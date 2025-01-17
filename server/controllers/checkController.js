const db = require('../config/db');

async function getAllCheck(req, res) {
  try {
    const query = `
      SELECT
        check.id_check,
        check.email_check,
        check.fio_check,
        order.data_device,
        order.device_name,
        order.id_device,
        order.count_order,
        order.device_price AS price
      FROM california.order_check
      JOIN california.order ON order_check.id_order = order.id_order
      JOIN california.check ON order_check.id_check = check.id_check
    `;

    const [rows] = await db.pool.query(query);

    // Группируем данные по id_check
    const result = {};
    for (const row of rows) {
      const { id_check, email_check, fio_check, data_device } = row;
      if (!result[id_check]) {
        result[id_check] = {
          data_device,
          email_check,
          fio_check,
          order: []
        };
      }

      result[id_check].order.push({
        device_name: row.device_name,
        id_device: row.id_device,
        count_order: row.count_order,
        price: row.price
      });
    }

    // Преобразуем объект в массив
    const finalResult = Object.values(result);

    res.json(finalResult);
  } catch (error) {
    console.error('Ошибка при получении чеков:', error);
    res.status(500).json({ message: 'Ошибка при получении чеков' });
  }
}


async function getByIdCheck(req, res) {
  const { id } = req.params; // Получаем id из параметров запроса

  try {
    const query = `
      SELECT
        check.id_check,
        check.email_check,
        check.fio_check,
        order.data_device,
        order.device_name,
        order.id_device,
        order.count_order,
        order.device_price AS price
      FROM california.order_check
      JOIN california.order ON order_check.id_order = order.id_order
      JOIN california.check ON order_check.id_check = check.id_check
      WHERE order_check.id_check = ?
    `;

    const [rows] = await db.pool.query(query, [id]);

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Чек не найден' });
    }

    // Группируем данные по id_check
    const result = {
      id_check: rows[0].id_check,
      data_device: rows[0].data_device,
      email_check: rows[0].email_check,
      fio_check: rows[0].fio_check,
      order: []
    };

    for (const row of rows) {
      result.order.push({
        device_name: row.device_name,
        id_device: row.id_device,
        count_order: row.count_order,
        price: row.price
      });
    }

    res.json(result);
  } catch (error) {
    console.error('Ошибка при получении чека:', error);
    res.status(500).json({ message: 'Ошибка при получении чека' });
  }
}


async function updateCheck(req, res) {
  const { email_check, fio_check, order, data_device } = req.body;
  const { id } = req.params;
  console.log(email_check, fio_check, order, data_device,id);
  
  try {
    // Начинаем транзакцию
    await db.pool.query('START TRANSACTION');

    // Обновляем запись в таблице check
    const updateCheckQuery = `
      UPDATE california.check
      SET email_check = ?, fio_check = ?
      WHERE id_check = ?
    `;
    await db.pool.query(updateCheckQuery, [email_check, fio_check, id]);

    // Обновляем записи в таблице order и order_check
    for (const orderItem of order) {
      const { device_name, count_order, price, id_device } = orderItem;

      // Получаем id_order из таблицы order_check
      const getOrderIdQuery = `
        SELECT id_order
        FROM california.order_check
        WHERE id_check = ? 
      `;
      const [[{ id_order }]] = await db.pool.query(getOrderIdQuery, [id]);
      console.log(id_order);
      

      const updateOrderQuery = `
        UPDATE california.order
        SET device_name = ?, count_order = ?, data_device = ?, device_price = ?, id_device = ?
        WHERE id_order = ?
      `;
      await db.pool.query(updateOrderQuery, [device_name, count_order, data_device, price, id_device, id_order]);

      // Обновляем связь между чеком и заказом в таблице order_check
      const updateCheckOrderQuery = `
        UPDATE california.order_check
        SET id_check = ?
        WHERE id_order = ?
      `;
      await db.pool.query(updateCheckOrderQuery, [id, id_order]);
    }

    // Подтверждаем транзакцию
    await db.pool.query('COMMIT');

    res.status(200).json({ message: 'Чек и заказы успешно обновлены' });
  } catch (error) {
    await db.pool.query('ROLLBACK');
    console.error('Ошибка при обновлении чека и заказов:', error);
    res.status(500).json({ message: 'Ошибка при обновлении чека и заказов' });
  }
}

async function deleteCheck(req, res) {
  const { id } = req.params;

  try {
    // Начинаем транзакцию
    await db.pool.query('START TRANSACTION');

    // Получаем список связанных заказов
    const getOrdersQuery = `
      SELECT id_order
      FROM california.order_check
      WHERE id_check = ?
    `;
    const [orders] = await db.pool.query(getOrdersQuery, [id]);

    // Проверяем, есть ли связанные заказы
    if (orders.length > 0) {
      // Удаляем связи между заказами и чеком
      const deleteCheckOrderQuery = `
        DELETE FROM california.order_check
        WHERE id_check = ?
      `;
      await db.pool.query(deleteCheckOrderQuery, [id]);

      // Удаляем заказы, связанные с чеком
      const deleteOrderQuery = `
        DELETE FROM california.order
        WHERE id_order IN (?)
      `;
      await db.pool.query(deleteOrderQuery, [orders.map(order => order.id_order)]);
    }

    // Удаляем чек
    const deleteCheckQuery = `
      DELETE FROM california.check
      WHERE id_check = ?
    `;
    await db.pool.query(deleteCheckQuery, [id]);

    // Подтверждаем транзакцию
    await db.pool.query('COMMIT');

    res.status(200).json({ message: 'Чек и связанные заказы успешно удалены' });
  } catch (error) {
    await db.pool.query('ROLLBACK');
    console.error('Ошибка при удалении чека и заказов:', error);
    res.status(500).json({ message: 'Ошибка при удалении чека и заказов' });
  }
}

async function createCheck(req, res) {
  const { data_device, email_check, fio_check, order } = req.body;
  console.log(data_device, email_check, fio_check, order);

  try {
    // Начинаем транзакцию
    await db.pool.query('START TRANSACTION');

    // Создаем новую запись в таблице check
    const createCheckQuery = `
      INSERT INTO california.check (email_check, fio_check)
      VALUES (?, ?)
    `;
    const [checkResult] = await db.pool.query(createCheckQuery, [email_check, fio_check]);
    const id_check = checkResult.insertId;

    // Создаем новые записи в таблице check_order и связываем их с чеком и заказами
    for (const orderItem of order) {
      const { device_name, count_order, price, id_device } = orderItem;
      const createOrderQuery = `
        INSERT INTO california.order (device_name, count_order, data_device, device_price, id_device)
        VALUES (?, ?, ?, ?, ?)
      `;
      const [orderResult] = await db.pool.query(createOrderQuery, [device_name, count_order, data_device, price, id_device]);
      const id_order = orderResult.insertId;

      const createCheckOrderQuery = `
        INSERT INTO california.order_check (id_check, id_order)
        VALUES (?, ?)
      `;
      await db.pool.query(createCheckOrderQuery, [id_check, id_order]);
    }

    // Подтверждаем транзакцию
    await db.pool.query('COMMIT');

    res.status(201).json({ message: 'Чек и заказы успешно созданы' });
  } catch (error) {
    await db.pool.query('ROLLBACK');
    console.error('Ошибка при создании чека и заказов:', error);
    res.status(500).json({ message: 'Ошибка при создании чека и заказов' });
  }
}




module.exports = {
  createCheck,
  getAllCheck,
  getByIdCheck,
  updateCheck,
  deleteCheck
};
