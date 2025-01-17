const db = require('../config/db');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); 
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}${path.extname(file.originalname)}`); 
    }
});

const upload = multer({ storage });


async function createSubcategory(req, res) {
    try {
        const { name, id_category } = req.body;
        const image = req.file;
        console.log(id_category + typeof(id_category));
        
        if (!image || !image.buffer || image.buffer.length === 0) {
            return res.status(400).json({ error: 'Изображение не предоставлено' });
        }

        const imageFilename = `${Date.now()}-${image.originalname}`;
        const imagePath = path.join('uploads', imageFilename);

        // Сохранение изображения на диск
        await fs.promises.mkdir('uploads', { recursive: true });
        await fs.promises.writeFile(path.join(__dirname, '..', imagePath), image.buffer);
        const imageUrl = `${req.protocol}://${req.get('host')}/uploads/${imageFilename}`;
        const [subcategoryResult] = await db.pool.query(`
            INSERT INTO california.subcategory (name_subcategory, id_category)
            VALUES (?, ?)
        `, [name, id_category]);

        const [imageResult] = await db.pool.query(`
            INSERT INTO california.images_subcategory (link_images_subcategory)
            VALUES (?)
        `, [imageUrl]);

        await db.pool.query(`
            INSERT INTO california.subcategory_images_subcategory (id_subcategory, id_images_subcategory)
            VALUES (?, ?)
        `, [subcategoryResult.insertId, imageResult.insertId]);

        

        res.status(201).json({
            message: 'Подкатегория успешно создана',
            subcategoryId: subcategoryResult.insertId,
            imageUrl
        });
    } catch (error) {
        if (error.code === 'ER_NO_SUCH_TABLE') {
            console.error('Таблица images_subcategory или subcategory_images_subcategory не существует в базе данных');
        } else {
            console.error('Ошибка при создании подкатегории:', error);
        }
        res.status(500).json({ error: 'Произошла ошибка при создании подкатегории' });
    }
}





async function updateSubcategory(req, res) {
    try {
        const { id } = req.params;
        const { name, id_category } = req.body;
        const image = req.file;

        // Обновление названия и категории подкатегории
        const [subcategoryResult] = await db.pool.query(`
            UPDATE subcategory
            SET name_subcategory = ?, id_category = ?
            WHERE id_subcategory = ?
        `, [name, id_category, id]);

        if (subcategoryResult.affectedRows === 0) {
            return res.status(404).json({ error: 'Подкатегория не найдена' });
        }

        // Если изображение предоставлено, обновить его
        if (image && image.buffer && image.buffer.length > 0) {
            const imageFilename = `${Date.now()}-${image.originalname}`;
            const imagePath = path.join('uploads', imageFilename);

            // Сохранение изображения на диск
            await fs.promises.mkdir('uploads', { recursive: true });
            await fs.promises.writeFile(path.join(__dirname, '..', imagePath), image.buffer);
            const imageUrl = `${req.protocol}://${req.get('host')}/uploads/${imageFilename}`;

            // Удаление старого изображения
            const [oldImageResult] = await db.pool.query(`
                SELECT link_images_subcategory
                FROM images_subcategory
                WHERE id_images_subcategory IN (
                    SELECT id_images_subcategory
                    FROM subcategory_images_subcategory
                    WHERE id_subcategory = ?
                )
            `, [id]);

            if (oldImageResult.length > 0) {
                const oldImagePath = path.join(__dirname, '..', oldImageResult[0].link_images_subcategory.replace(`${req.protocol}://${req.get('host')}/uploads/`, ''));
                await fs.promises.unlink(oldImagePath);
            }

            // Обновление изображения
            await db.pool.query(`
                UPDATE images_subcategory
                SET link_images_subcategory = ?
                WHERE id_images_subcategory IN (
                    SELECT id_images_subcategory
                    FROM subcategory_images_subcategory
                    WHERE id_subcategory = ?
                )
            `, [imageUrl, id]);
        }

        res.status(200).json({ message: 'Подкатегория успешно обновлена' });
    } catch (error) {
        console.error('Ошибка при обновлении подкатегории:', error);
        res.status(500).json({ error: 'Произошла ошибка при обновлении подкатегории' });
    }
}

async function deleteSubcategory(req, res) {
    try {
        const { id } = req.params;

        // Удаление связи между подкатегорией и изображением
        await db.pool.query(`
            DELETE FROM subcategory_images_subcategory
            WHERE id_subcategory = ?
        `, [id]);

        // Удаление изображения
        const [imageResult] = await db.pool.query(`
            SELECT link_images_subcategory
            FROM images_subcategory
            WHERE id_images_subcategory IN (
                SELECT id_images_subcategory
                FROM subcategory_images_subcategory
                WHERE id_subcategory = ?
            )
        `, [id]);

        if (imageResult.length > 0) {
            const imagePath = path.join(__dirname, '..', imageResult[0].link_images_subcategory.replace(`${req.protocol}://${req.get('host')}/uploads/`, ''));
            await fs.promises.unlink(imagePath);

            // Удаление записи об изображении
            await db.pool.query(`
                DELETE FROM images_subcategory
                WHERE id_images_subcategory IN (
                    SELECT id_images_subcategory
                    FROM subcategory_images_subcategory
                    WHERE id_subcategory = ?
                )
            `, [id]);
        }

        // Удаление подкатегории
        const [subcategoryResult] = await db.pool.query(`
            DELETE FROM subcategory
            WHERE id_subcategory = ?
        `, [id]);

        if (subcategoryResult.affectedRows === 0) {
            return res.status(404).json({ error: 'Подкатегория не найдена' });
        }

        res.status(200).json({ message: 'Подкатегория успешно удалена' });
    } catch (error) {
        console.error('Ошибка при удалении подкатегории:', error);
        res.status(500).json({ error: 'Произошла ошибка при удалении подкатегории' });
    }
}



async function getSubcategories(req, res) {
    try {
        const result = await db.pool.query(`
            SELECT name_subcategory FROM california.subcategory
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
    getSubcategories,
    createSubcategory,
    updateSubcategory,
    deleteSubcategory,
    upload
};
