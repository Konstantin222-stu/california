const db = require('../config/db');

async function getProductByDevice(req, res) {
    try {
        const { id } = req.params;
        console.log('Запрашиваемый id:', id);

        const result = await db.pool.query(`
            SELECT 
                device.id_device,
                device.desc_device,
                device.name_device,
                (
                    SELECT JSON_ARRAYAGG(
                        JSON_OBJECT(
                            'id_price', price.id_price,
                            'price', price.price,
                            'name_price', price.name_price
                        )
                    )
                    FROM california.device_price
                    JOIN california.price ON device_price.id_price = price.id_price
                    WHERE device_price.id_device = device.id_device
                    GROUP BY device_price.id_device
                ) AS prices,
                (
                    SELECT JSON_ARRAYAGG(
                        JSON_OBJECT(
                            'name_type', type_images.name_type,
                            'link_images_device', images_device.link_images_device
                        )
                    )
                    FROM california.device_images_device
                    JOIN california.images_device ON device_images_device.id_images_device = images_device.id_images_device
                    JOIN california.type_images ON images_device.id_type_images = type_images.id_type_images
                    WHERE device_images_device.id_device = device.id_device
                    GROUP BY device_images_device.id_device
                ) AS images,
                (
                    SELECT JSON_ARRAYAGG(
                        JSON_OBJECT(
                            'id_feature', feature.id_feature,
                            'title_feature', feature.title_feature,
                            'desc_feature', feature.desc_feature
                        )
                    )
                    FROM california.device_feature
                    JOIN california.feature ON device_feature.id_feature = feature.id_feature
                    WHERE device_feature.id_device = device.id_device
                    GROUP BY device_feature.id_device
                ) AS features,
                (
                    SELECT JSON_ARRAYAGG(
                        JSON_OBJECT(
                            'id_review', reviews.id_reviews,
                            'nickname_reviews', reviews.nickname_reviews,
                            'text_reviews', reviews.text_reviews,
                            'data_reviews', reviews.data_reviews,
                            'count_stars_reviews', reviews.count_stars_reviews
                        )
                    )
                    FROM california.device_reviews
                    JOIN california.reviews ON device_reviews.id_reviews = reviews.id_reviews
                    WHERE device_reviews.id_device = device.id_device
                    GROUP BY device_reviews.id_device
                ) AS reviews
            FROM california.device
            WHERE device.id_device = ?
        `, [id]);

        console.log('Результат запроса:', result);
        console.log('Количество строк:', result.length);

        if (result.length === 0) {
            console.log('Данные не найдены для id:', id);
            res.status(404).json({ error: 'Данные не найдены' });
        } else {
            // Возвращаем только первый массив
            res.json(result[0]);
        }
    } catch (error) {
        console.error('Ошибка при выполнении запроса:', error);
        res.status(500).json({ error: 'Произошла ошибка при выполнении запроса' });
    }
}













async function getAllProducts(req, res) {
    try {
        const result = await db.pool.query(`
            SELECT 
                device.id_device,
                device.desc_device,
                device.name_device,
                (
                    SELECT JSON_ARRAYAGG(
                        JSON_OBJECT(
                            'id_price', price.id_price,
                            'price', price.price,
                            'name_price', price.name_price
                        )
                    )
                    FROM california.device_price
                    JOIN california.price ON device_price.id_price = price.id_price
                    WHERE device_price.id_device = device.id_device
                    GROUP BY device_price.id_device
                ) AS prices,
                (
                    SELECT JSON_ARRAYAGG(
                        JSON_OBJECT(
                            'name_type', type_images.name_type,
                            'link_images_device', images_device.link_images_device
                        )
                    )
                    FROM california.device_images_device
                    JOIN california.images_device ON device_images_device.id_images_device = images_device.id_images_device
                    JOIN california.type_images ON images_device.id_type_images = type_images.id_type_images
                    WHERE device_images_device.id_device = device.id_device
                    GROUP BY device_images_device.id_device
                ) AS images,
                (
                    SELECT JSON_ARRAYAGG(
                        JSON_OBJECT(
                            'id_feature', feature.id_feature,
                            'title_feature', feature.title_feature,
                            'desc_feature', feature.desc_feature
                        )
                    )
                    FROM california.device_feature
                    JOIN california.feature ON device_feature.id_feature = feature.id_feature
                    WHERE device_feature.id_device = device.id_device
                    GROUP BY device_feature.id_device
                ) AS features,
                (
                    SELECT JSON_ARRAYAGG(
                        JSON_OBJECT(
                            'id_review', reviews.id_reviews,
                            'nickname_reviews', reviews.nickname_reviews,
                            'text_reviews', reviews.text_reviews,
                            'data_reviews', reviews.data_reviews,
                            'count_stars_reviews', reviews.count_stars_reviews
                        )
                    )
                    FROM california.device_reviews
                    JOIN california.reviews ON device_reviews.id_reviews = reviews.id_reviews
                    WHERE device_reviews.id_device = device.id_device
                    GROUP BY device_reviews.id_device
                ) AS reviews
            FROM california.device
        `);

        console.log('Результат запроса:', result);
        console.log('Количество строк:', result.length);

        if (result.length === 0) {
            res.status(404).json({ error: 'Данные не найдены' });
        } else {
            // Возвращаем все данные, кроме последнего
            res.json(result.slice(0, -1));
        }
    } catch (error) {
        console.error('Ошибка при выполнении запроса:', error);
        res.status(500).json({ error: 'Произошла ошибка при выполнении запроса' });
    }
}





module.exports = {
    getProductByDevice,
    getAllProducts,
    
};
