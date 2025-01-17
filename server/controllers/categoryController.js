const db = require('../config/db');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Папка для хранения файлов
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}${path.extname(file.originalname)}`); // Уникальное имя файла
    }
});

const upload = multer({ storage });


async function createCategory(req, res) {
    try {
        let { name_category, id_device} = req.body;
        const video = req.file; // Файл видео
        console.log(id_device + typeof(parseInt(id_device)));
        
        

        if (!video) {
            return res.status(400).json({ error: 'Видео не предоставлено' });
        }

        const videoFilename = `${Date.now()}-${video.originalname}`;
        const videoPath = path.join('uploads', videoFilename);
        await fs.promises.mkdir('uploads', { recursive: true });
        await fs.promises.writeFile(path.join(__dirname, '..', videoPath), video.buffer);
        const videoUrl = `${req.protocol}://${req.get('host')}/uploads/${videoFilename}`;
        const result = await db.pool.query(`
            INSERT INTO california.category (name_category, link_video_category, id_device)
            VALUES (?, ?, ?)
        `, [name_category, videoUrl, parseInt(id_device)]);
        const { id_category } = result[0];

        res.json({ message: 'Категория успешно создана', id_category });
    } catch (error) {
        console.error('Ошибка при создании категории:', error);
        res.status(500).json({ error: 'Произошла ошибка при создании категории' });
    }
}

async function updateCategory(req, res) {
    try {
        const { id } = req.params;
        const { name_category, id_device } = req.body;
        const video = req.file; // Файл видео

        // Обновляем данные категории
        await db.pool.query(`
            UPDATE california.category
            SET name_category = ?, id_device = ?
            WHERE id_category = ?
        `, [name_category,id_device, id]);

        // Если предоставлено новое видео
        if (video) {
            const videoFilename = `${Date.now()}-${video.originalname}`;
            const videoPath = path.join('uploads', videoFilename);
            await db.pool.query(`
                UPDATE california.category
                SET link_video_category = ?
                WHERE id_category = ?
            `, [videoPath, id]);
        }

        res.json({ message: 'Категория успешно обновлена' });
    } catch (error) {
        console.error('Ошибка при обновлении категории:', error);
        res.status(500).json({ error: 'Произошла ошибка при обновлении категории' });
    }
}

async function deleteCategory(req, res) {
    try {
        const { id } = req.params;

        // Проверяем, есть ли связанные подкатегории
        const [[{ count }]] = await db.pool.query(`
            SELECT COUNT(*) AS count
            FROM california.subcategory
            WHERE id_category = ?
        `, [id]);

        if (count > 0) {
            return res.status(400).json({ error: 'Невозможно удалить категорию, так как она содержит подкатегории' });
        }

        // Удаляем категорию
        const result = await db.pool.query(`
            DELETE FROM california.category
            WHERE id_category = ?
        `, [id]);

        if (result.affectedRows === 0) {
            res.status(404).json({ error: 'Категория не найдена' });
        } else {
            res.json({ message: 'Категория успешно удалена' });
        }
    } catch (error) {
        console.error('Ошибка при удалении категории:', error);
        res.status(500).json({ error: 'Произошла ошибка при удалении категории' });
    }
}

async function getCategories(req, res) {
    try {
        const result = await db.pool.query(`
            SELECT * FROM california.category;
        `);

        console.log('Результат запроса:', result);
        console.log('Количество строк:', result[0].length);

        if (!result[0] || result[0].length === 0) {
            console.log('Данные не найдены');
            res.status(404).json({ error: 'Данные не найдены' });
        } else {
            res.json(result[0]);
        }
    } catch (error) {
        console.error('Ошибка при выполнении запроса:', error);
        res.status(500).json({ error: 'Произошла ошибка при выполнении запроса' });
    }
}

async function getCategoryByName(req, res) {
    const { category } = req.params;
    try {
        const result = await db.pool.query(`
           SELECT 
                c.name_category, 
                s.name_subcategory, 
                i.link_images_subcategory, 
                c.link_video_category, 
                d.name_device, 
                d.id_device, 
                d.desc_device
            FROM california.subcategory s
            JOIN california.category c ON s.id_category = c.id_category
            JOIN california.subcategory_images_subcategory si ON s.id_subcategory = si.id_subcategory
            JOIN california.images_subcategory i ON si.id_images_subcategory = i.id_images_subcategory
            JOIN california.device d ON c.id_device = d.id_device
             WHERE name_category = ?
        `, [category]);

        console.log('Результат запроса:', result);
        console.log('Количество строк:', result[0].length);

        if (!result[0] || result[0].length === 0) {
            console.log('Данные не найдены для category:', category);
            res.status(404).json({ error: 'Данные не найдены' });
        } else {
            res.json(result[0]);
        }
    } catch (error) {
        console.error('Ошибка при выполнении запроса:', error);
        res.status(500).json({ error: 'Произошла ошибка при выполнении запроса' });
    }
}

async function getSubcategoriesByCategory(req, res) {
    const { category } = req.params;
    try {
        const result = await db.pool.query(`
            SELECT 
                c.name_category, 
                s.name_subcategory, 
                i.link_images_subcategory, 
                d.name_device, 
                d.desc_device
            FROM california.subcategory s
            JOIN california.category c ON s.id_category = c.id_category
            JOIN california.subcategory_images_subcategory si ON s.id_subcategory = si.id_subcategory
            JOIN california.images_subcategory i ON si.id_images_subcategory = i.id_images_subcategory
            JOIN california.device d ON c.id_device = d.id_device
            WHERE c.name_category = ?
        `, [category]);

        console.log('Результат запроса:', result);
        console.log('Количество строк:', result[0].length);

        if (!result[0] || result[0].length === 0) {
            console.log('Данные не найдены для category:', category);
            res.status(404).json({ error: 'Данные не найдены' });
        } else {
            res.json(result[0]);
        }
    } catch (error) {
        console.error('Ошибка при выполнении запроса:', error);
        res.status(500).json({ error: 'Произошла ошибка при выполнении запроса' });
    }
}

async function getBrandsByCategory(req, res) {
    const { category } = req.params;
    try {
        const result = await db.pool.query(`
            SELECT name_category, name_brand
            FROM california.device
            JOIN california.subcategory ON device.id_subcategory = subcategory.id_subcategory
            JOIN california.brand ON device.id_brand = brand.id_brand
            JOIN california.category ON subcategory.id_category = category.id_category
            WHERE category.name_category = ?
        `, [category]);

        console.log('Результат запроса:', result);
        console.log('Количество строк:', result[0].length);

        if (!result[0] || result[0].length === 0) {
            console.log('Данные не найдены для category:', category);
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
    getCategories,
    getCategoryByName,
    getSubcategoriesByCategory,
    getBrandsByCategory,
    createCategory,
    updateCategory,
    deleteCategory,
    upload
};
