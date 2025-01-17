const db = require('../config/db');

async function getAllReviews(req, res) {
    const { limit, sortField, sortOrder } = req.query;
    try {
        let query = `
            SELECT device.id_device, reviews.nickname_reviews as nickname, reviews.count_stars_reviews as count_stars, reviews.data_reviews as data, reviews.text_reviews,reviews.id_reviews
            FROM california.device_reviews 
            JOIN california.device ON device.id_device = device_reviews.id_device
            JOIN california.reviews ON reviews.id_reviews = device_reviews.id_reviews
        `;

        const params = [];

        if (limit) {
            query += ' LIMIT ?';
            params.push(parseInt(limit));
        }

        if (sortField && sortOrder) {
            query += ` ORDER BY ${sortField} ${sortOrder}`;
        }

        const [rows] = await db.pool.query(query, params);

        res.json(rows);
    } catch (error) {
        console.error('Ошибка при получении отзывов:', error);
        res.status(500).json({ message: 'Ошибка при получении отзывов' });
    }
}

async function getReviewsByDevice(req, res) {
    try {
        const { id } = req.params;
        const { limit, sortField, sortOrder } = req.query;
        console.log('Запрашиваемый id:', id);

        let query = `
            SELECT device.id_device, reviews.nickname_reviews as nickname, reviews.count_stars_reviews as count_stars, reviews.data_reviews as data, reviews.text_reviews, reviews.id_reviews
            FROM california.device_reviews 
            JOIN california.device ON device.id_device = device_reviews.id_device
            JOIN california.reviews ON reviews.id_reviews = device_reviews.id_reviews
            WHERE device.id_device = ?
        `;

        const params = [id];

        if (limit) {
            query += ' LIMIT ?';
            params.push(parseInt(limit));
        }

        if (sortField && sortOrder) {
            query += ` ORDER BY ${sortField} ${sortOrder}`;
        }

        const [rows] = await db.pool.query(query, params);

        res.json(rows);
    } catch (error) {
        console.error('Ошибка при получении отзывов:', error);
        res.status(500).json({ message: 'Ошибка при получении отзывов' });
    }
}


async function createReview(req, res) {
    try {
        const { id_device, nickname, count_stars, data, text } = req.body;

        const result = await db.pool.query(`
            INSERT INTO california.reviews (nickname_reviews, count_stars_reviews, data_reviews, text_reviews)
            VALUES (?, ?, ?, ?)
        `, [nickname, count_stars, data, text]);

        const reviewId = result[0].insertId;

        await db.pool.query(`
            INSERT INTO california.device_reviews (id_device, id_reviews)
            VALUES (?, ?)
        `, [id_device, reviewId]);

        res.status(201).json({ message: 'Отзыв успешно создан' });
    } catch (error) {
        console.error('Ошибка при создании отзыва:', error);
        res.status(500).json({ error: 'Произошла ошибка при создании отзыва' });
    }
}
async function updateReview(req, res) {
    try {
        const { id } = req.params;
        const { nickname, count_stars, data, text } = req.body;

        const result = await db.pool.query(`
            UPDATE california.reviews
            SET nickname_reviews = ?, count_stars_reviews = ?, data_reviews = ?, text_reviews = ?
            WHERE id_reviews = ?
        `, [nickname, count_stars, data, text, id]);

        if (result.affectedRows === 0) {
            res.status(404).json({ error: 'Отзыв не найден' });
        } else {
            res.json({ message: 'Отзыв успешно обновлен' });
        }
    } catch (error) {
        console.error('Ошибка при обновлении отзыва:', error);
        res.status(500).json({ error: 'Произошла ошибка при обновлении отзыва' });
    }
}
async function deleteReview(req, res) {
    try {
        const { id } = req.params;

        // Сначала удаляем связь между отзывом и устройством
        await db.pool.query(`
            DELETE FROM california.device_reviews
            WHERE id_reviews = ?
        `, [id]);

        // Затем удаляем сам отзыв
        const result = await db.pool.query(`
            DELETE FROM california.reviews
            WHERE id_reviews = ?
        `, [id]);

        if (result.affectedRows === 0) {
            res.status(404).json({ error: 'Отзыв не найден' });
        } else {
            res.json({ message: 'Отзыв успешно удален' });
        }
    } catch (error) {
        console.error('Ошибка при удалении отзыва:', error);
        res.status(500).json({ error: 'Произошла ошибка при удалении отзыва' });
    }
}




module.exports = {
    getAllReviews,
    getReviewsByDevice,
    createReview,
    updateReview,
    deleteReview
};
