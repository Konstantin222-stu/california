const db = require('../config/db');

async function getFeaturesByDevice(req, res) {
    try {
        const { id } = req.params;
        console.log('Запрашиваемый id:', id);

        const result = await db.pool.query(`
            SELECT 
            device_feature.id_device, 
            feature.title_feature, 
            feature.desc_feature, 
            feature.id_feature
            FROM california.device_feature
            JOIN california.device ON device_feature.id_device = device.id_device
            JOIN california.feature ON device_feature.id_feature = feature.id_feature
            WHERE device.id_device = ?
        `, [id]);

        console.log('Результат запроса:', result);
        console.log('Количество строк:', result[0].length);

        if (!result[0] || result[0].length === 0) {
            console.log('Данные не найдены для id:', id);
            res.status(404).json({ error: 'Данные не найдены' });
        } else {
            res.json(result[0]);
        }
    } catch (error) {
        console.error('Ошибка при выполнении запроса:', error);
        res.status(500).json({ error: 'Произошла ошибка при выполнении запроса' });
    }
}

async function getAllFeatures(req, res) {
    try {
        const result = await db.pool.query(`
            SELECT 
            device_feature.id_device, 
            feature.title_feature, 
            feature.desc_feature, 
            feature.id_feature
            FROM california.device_feature
            JOIN california.device ON device_feature.id_device = device.id_device
            JOIN california.feature ON device_feature.id_feature = feature.id_feature
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

async function createFeature(req, res) {
    try {
        const { id_device, name, description } = req.body;

        const result = await db.pool.query(`
            INSERT INTO california.feature (title_feature, desc_feature)
            VALUES (?, ?)
        `, [name, description]);
        
        console.log('Результат запроса: ', result);

        const featureId = result[0].insertId;
        console.log(featureId);
        

        await db.pool.query(`
            INSERT INTO california.device_feature (id_device, id_feature)
            VALUES (?, ?)
        `, [id_device, featureId]);

        res.status(201).json({ message: 'Функция успешно создана' });
    } catch (error) {
        console.error('Ошибка при создании функции:', error);
        res.status(500).json({ error: 'Произошла ошибка при создании функции' });
    }
}

async function updateFeature(req, res) {
    try {
        const { id } = req.params;
        const { name, description } = req.body;

        const result = await db.pool.query(`
            UPDATE california.feature
            SET title_feature = ?, desc_feature = ?
            WHERE id_feature = ?
        `, [name, description, id]);

        if (result.affectedRows === 0) {
            res.status(404).json({ error: 'Функция не найдена' });
        } else {
            res.json({ message: 'Функция успешно обновлена' });
        }
    } catch (error) {
        console.error('Ошибка при обновлении функции:', error);
        res.status(500).json({ error: 'Произошла ошибка при обновлении функции' });
    }
}

async function deleteFeature(req, res) {
    try {
        const { id } = req.params;

        await db.pool.query(`
            DELETE FROM california.device_feature
            WHERE id_feature = ?
        `, [id]);

        const result = await db.pool.query(`
            DELETE FROM california.feature
            WHERE id_feature = ?
        `, [id]);

        if (result.affectedRows === 0) {
            res.status(404).json({ error: 'Функция не найдена' });
        } else {
            res.json({ message: 'Функция успешно удалена' });
        }
    } catch (error) {
        console.error('Ошибка при удалении функции:', error);
        res.status(500).json({ error: 'Произошла ошибка при удалении функции' });
    }
}





module.exports = {
    getFeaturesByDevice,
    getAllFeatures,
    createFeature,
    updateFeature,
    deleteFeature
};
