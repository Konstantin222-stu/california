const db = require('../config/db');

async function getPrice(req, res) {
    try {        

        const result = await db.pool.query(`
            SELECT * FROM california.price
            `);

            console.log('Результат запроса:', result);
            console.log('Количество строк:', result[0].length);
    
            if (!result[0] || result[0].length === 0) {
                res.status(404).json({ error: 'Данные не найдены' });
            } else {
                res.json(result[0]);
            }
        } catch (error) {
            console.error('Ошибка при выполнении запроса:', error);
            res.status(500).json({ error: 'Произошла ошибка при выполнении запроса' });
        }
}
    
async function createPrice(req, res) {
    try {
        const { id_device, name, price} = req.body;

        const result = await db.pool.query(`
            INSERT INTO california.price (price, name_price)
            VALUES (?, ?)
        `, [price, name]);

        const reviewId = result[0].insertId;

        await db.pool.query(`
            INSERT INTO california.device_price (id_device, id_price)
            VALUES (?, ?)
        `, [id_device, reviewId]);

        res.status(201).json({ message: 'Цена успешно создан' });
    } catch (error) {
        console.error('Ошибка при создании цены:', error);
        res.status(500).json({ error: 'Произошла ошибка при создании цены' });
    }
}

async function updatePrice(req, res) {
    try {
        const { id } = req.params;
        const { name, price} = req.body;

        const result = await db.pool.query(`
            UPDATE california.price
            SET name_price = ?, price = ?
            WHERE id_price = ?
        `, [name, price, id]);


        if (result.affectedRows === 0) {
            res.status(404).json({ error: 'Цена не найден' });
        } else {
            res.json({ message: 'Цена успешно обновлен' });
        }
    } catch (error) {
        console.error('Ошибка при обновлении цены:', error);
        res.status(500).json({ error: 'Произошла ошибка при обновлении цены' });
    }
}

async function deletePrice(req, res) {
    try {
        const { id } = req.params;
        console.log(id);

        await db.pool.query(`
            DELETE FROM california.device_price
            WHERE id_price = ?
        `, [id]);

        const result = await db.pool.query(`
            DELETE FROM california.price
            WHERE id_price = ?
        `, [id]);

        if (result.affectedRows === 0) {
            res.status(404).json({ error: 'Цена не найдена' });
        } else {
            res.json({ message: 'Цена успешно удалена' });
        }
    } catch (error) {
        console.error('Ошибка при удалении цены:', error);
        res.status(500).json({ error: 'Произошла ошибка при удалении цены' });
    }
}


module.exports = {
    getPrice,
    createPrice,
    updatePrice,
    deletePrice
};