const db = require('../config/db');


async function createBrand(req, res) {
    try {
        const { name } = req.body;
        console.log(name);
        

        const result = await db.pool.query(`
            INSERT INTO california.brand (name_brand)
            VALUES (?)
        `, [name]);

        res.status(201).json({ message: 'Бренд успешно создан' });
    } catch (error) {
        console.error('Ошибка при создании бренда:', error);
        res.status(500).json({ error: 'Произошла ошибка при создании бренда' });
    }
}

async function updateBrand(req, res) {
    try {
        const { id } = req.params;
        const { name_brand } = req.body;

        const result = await db.pool.query(`
            UPDATE california.brand
            SET name_brand = ?
            WHERE id_brand = ?
        `, [name_brand, id]);

        if (result.affectedRows === 0) {
            res.status(404).json({ error: 'Бренд не найден' });
        } else {
            res.json({ message: 'Бренд успешно обновлен' });
        }
    } catch (error) {
        console.error('Ошибка при обновлении бренда:', error);
        res.status(500).json({ error: 'Произошла ошибка при обновлении бренда' });
    }
}


async function deleteBrand(req, res) {
    try {
        const { id } = req.params;

        // Проверяем, есть ли устройства, связанные с этим брендом
        const [deviceCount] = await db.pool.query(`
            SELECT COUNT(*) AS count 
            FROM california.device
            WHERE id_brand = ?
        `, [id]);

        if (deviceCount[0].count > 0) {
            return res.status(400).json({ error: 'Невозможно удалить бренд, так как он используется в таблице устройств' });
        }

        const result = await db.pool.query(`
            DELETE FROM california.brand
            WHERE id_brand = ?
        `, [id]);

        if (result.affectedRows === 0) {
            res.status(404).json({ error: 'Бренд не найден' });
        } else {
            res.json({ message: 'Бренд успешно удален' });
        }
    } catch (error) {
        console.error('Ошибка при удалении бренда:', error);
        res.status(500).json({ error: 'Произошла ошибка при удалении бренда' });
    }
}

async function getBrands(req, res) {
    try {
        const result = await db.pool.query(`
            SELECT * FROM california.brand
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





module.exports = {
    createBrand,
    updateBrand,
    deleteBrand,
    getBrands


};