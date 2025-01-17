require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const path = require('path');
const multer = require('multer');

const storage = multer.memoryStorage();


const deviceRoutes = require('./routes/deviceRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const subcategoryRoutes = require('./routes/subcategoryRoutes');
const reviewsRoutes = require('./routes/reviewsRoutes');
const featureRoutes = require('./routes/featureRoutes');
const productRoutes = require('./routes/productRoutes');
const brandRoutes = require('./routes/brandRoutes');
const checkRoutes = require('./routes/checkRoutes');
const priceRoutes = require('./routes/priceRoutes')
const imagesDeviceRoutes = require('./routes/imagesDeviceRoutes')

const { pool, checkConnection } = require('./config/db');


// Middleware для обработки CORS
app.use(cors());

// Middleware для разбора JSON
app.use(express.json());

// Используйте маршруты
app.use('/device', deviceRoutes);
app.use('/category', categoryRoutes);
app.use('/subcategory', subcategoryRoutes);
app.use('/reviews', reviewsRoutes);
app.use('/feature', featureRoutes);
app.use('/product', productRoutes);
app.use('/brands', brandRoutes);
app.use('/check', checkRoutes);
app.use('/price', priceRoutes)
app.use('/images', imagesDeviceRoutes)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


app.listen(3001, async () => {
    if (await checkConnection()) {
        console.log('Сервер запущен на порту 3001');
    } else {
        console.error('Не удалось подключиться к базе данных. Сервер не запущен.');
    }
});




// const express = require('express');
// const app = express();
// const cors = require('cors');
// const pool = require('./db');

// async function checkDBConnection() {
//     try {
//       await pool.query('SELECT 1');
//       console.log('Подключение к базе данных установлено.');
//       return true;
//     } catch (error) {
//       console.error('Ошибка при подключении к базе данных:', error);
//       return false;
//     }
// }

// app.use(cors());

// // Маршрут для обработки без лимита
// app.get('/device', async (req, res) => {
//     await getDevices(res, null, null, null, null, null, req.query.sortField, req.query.sortOrder);
// });
// app.get('/device/limit/:limit', async (req, res) => {
//     const limit = parseInt(req.params.limit);
//     await getDevices(res, limit, 1, null, null, null, req.query.sortField, req.query.sortOrder);
// });
// // Маршрут для получения устройств с указанным лимитом и страницей
// app.get('/device/limit/:limit/page/:page', async (req, res) => {
//     const limit = parseInt(req.params.limit);
//     const page = parseInt(req.params.page);
//     await getDevices(res, limit, page, null, null, null, req.query.sortField, req.query.sortOrder);
// });


// // Маршрут для получения устройств по бренду без ограничения лимита
// app.get('/device/brand/:brand', async (req, res) => {
//     await getDevices(res, null, null, req.params.brand, null, null, req.query.sortField, req.query.sortOrder);
// });

// app.get('/device/brand/:brand/limit/:limit/page/:page', async (req, res) => {
//     const limit = parseInt(req.params.limit);
//     const page = parseInt(req.params.page);
//     await getDevices(res, limit, page, req.params.brand, null, null, req.query.sortField, req.query.sortOrder);
// });

// app.get('/device/brand/:brand/subcategory/:subcategory', async (req, res) => {
//     await getDevices(res, null, null, req.params.brand, req.params.subcategory, null, req.query.sortField, req.query.sortOrder);
// });

// // Маршрут для получения устройств по подкатегории
// app.get('/device/subcategory/:subcategory', async (req, res) => {
//     await getDevices(res, null, null, null, req.params.subcategory, null, req.query.sortField, req.query.sortOrder);
// });

// // Маршрут для получения устройств по подкатегории с указанным лимитом и страницей
// app.get('/device/subcategory/:subcategory/limit/:limit/page/:page', async (req, res) => {
//     const limit = parseInt(req.params.limit);
//     const page = parseInt(req.params.page);
//     await getDevices(res, limit, page, null, req.params.subcategory, null, req.query.sortField, req.query.sortOrder);
// });

// // Маршрут для получения устройств по категории
// app.get('/device/category/:category', async (req, res) => {
//     await getDevices(res, null, null, null, null, req.params.category, req.query.sortField, req.query.sortOrder);
// });

// // Маршрут для получения устройств по категории с указанным лимитом и страницей
// app.get('/device/category/:category/limit/:limit/page/:page', async (req, res) => {
//     const limit = parseInt(req.params.limit);
//     const page = parseInt(req.params.page);
//     await getDevices(res, limit, page, null, null, req.params.category, req.query.sortField, req.query.sortOrder);
// });

// async function getDevices(res, limit, page, brand, subcategory, category, sortField, sortOrder) {
//     try {
//         let query = `
//             SELECT
//                 device.id_device AS id,
//                 device.name_device AS name,
//                 device.desc_device AS description,
//                 brand.name_brand AS brand,
//                 subcategory.name_subcategory AS subcategory,
//                 category.name_category AS category,
//                 images_device.link_images_device AS link_image,
//                 price.id_price AS id_price,
//                 price.price AS price
//             FROM california.device_images_device
//             JOIN california.device ON device_images_device.id_device = device.id_device
//             JOIN california.brand ON device.id_brand = brand.id_brand
//             JOIN california.subcategory ON device.id_subcategory = subcategory.id_subcategory
//             JOIN california.category ON subcategory.id_category = category.id_category
//             JOIN california.images_device ON device_images_device.id_images_device = images_device.id_images_device
//             JOIN california.type_images ON images_device.id_type_images = type_images.id_type_images
//             JOIN (
//                 SELECT id_device, MIN(id_price) AS min_id_price
//                 FROM california.device_price
//                 GROUP BY id_device
//             ) AS min_prices ON device.id_device = min_prices.id_device
//             JOIN california.price ON min_prices.min_id_price = price.id_price
//             WHERE type_images.name_type = "main"
//         `;

//         const params = [];

//         if (brand) {
//             query += ' AND brand.name_brand = ?';
//             params.push(brand);
//         }

//         if (subcategory) {
//             query += ' AND subcategory.name_subcategory = ?';
//             params.push(subcategory);
//         }

//         if (category) {
//             query += ' AND category.name_category = ?';
//             params.push(category);
//         }

//         if (sortField && sortOrder) {
//             query += ` ORDER BY ${sortField} ${sortOrder}`;
//         } else {
//             query += ' ORDER BY price.price ASC';
//         }

//         if (limit && page) {
//             const offset = (page - 1) * limit;
//             query += ' LIMIT ? OFFSET ?';
//             params.push(limit, offset);
//         }

//         const [rows] = await pool.query(query, params);
//         res.json(rows);
//     } catch (error) {
//         console.error('Ошибка при получении устройств:', error);
//         res.status(500).json({ message: 'Ошибка при получении устройств' });
//     }
// }

// app.get('/category', async (req, res) => {
//     try {

//         const result = await pool.query(`
//             SELECT * FROM california.category;
//         `);

//         console.log('Результат запроса:', result);
//         console.log('Количество строк:', result[0].length);

//         if (!result[0] || result[0].length === 0) {
//             console.log('Данные не найдены для id:', id);
//             res.status(404).json({ error: 'Данные не найдены' });
//         } else {
//             res.json(result[0]);
//         }
//     } catch (error) {
//         console.error('Ошибка при выполнении запроса:', error);
//         res.status(500).json({ error: 'Произошла ошибка при выполнении запроса' });
//     }
// });

// app.get('/category/:category', async (req, res) => {
//     const { category } = req.params;
//     try {

//         const result = await pool.query(`
//             SELECT * FROM california.category where name_category = ?
//         `,[category]);

//         console.log('Результат запроса:', result);
//         console.log('Количество строк:', result[0].length);

//         if (!result[0] || result[0].length === 0) {
//             console.log('Данные не найдены для category:', category);
//             res.status(404).json({ error: 'Данные не найдены' });
//         } else {
//             res.json(result[0]);
//         }
//     } catch (error) {
//         console.error('Ошибка при выполнении запроса:', error);
//         res.status(500).json({ error: 'Произошла ошибка при выполнении запроса' });
//     }
// });

// app.get('/category/:category/subcategory', async (req, res) => {
//     const { category } = req.params;
//     try {

//         const result = await pool.query(`
//             select name_category,link_images_subcategory,name_subcategory
//             From california.subcategory
//             join california.category on subcategory.id_category = category.id_category
//             join california.subcategory_images_subcategory on subcategory_images_subcategory.id_subcategory = subcategory.id_subcategory
//             join california.images_subcategory on subcategory_images_subcategory.id_images_subcategory = images_subcategory.id_images_subcategory
//             where category.name_category = ?
//         `,[category]);

//         console.log('Результат запроса:', result);
//         console.log('Количество строк:', result[0].length);

//         if (!result[0] || result[0].length === 0) {
//             console.log('Данные не найдены для category:', category);
//             res.status(404).json({ error: 'Данные не найдены' });
//         } else {
//             res.json(result[0]);
//         }
//     } catch (error) {
//         console.error('Ошибка при выполнении запроса:', error);
//         res.status(500).json({ error: 'Произошла ошибка при выполнении запроса' });
//     }
// });

// app.get('/category/:category/brand', async (req, res) => {
//     const { category } = req.params;
//     try {

//         const result = await pool.query(`
//             select name_subcategory
//             From california.device
//             join california.subcategory on device.id_subcategory = subcategory.id_subcategory
//             join california.brand on device.id_brand = brand.id_brand
//             join california.category on subcategory.id_category = category.id_category
//             where category.name_category = ?
//         `,[category]);

//         console.log('Результат запроса:', result);
//         console.log('Количество строк:', result[0].length);

//         if (!result[0] || result[0].length === 0) {
//             console.log('Данные не найдены для category:', category);
//             res.status(404).json({ error: 'Данные не найдены' });
//         } else {
//             res.json(result[0]);
//         }
//     } catch (error) {
//         console.error('Ошибка при выполнении запроса:', error);
//         res.status(500).json({ error: 'Произошла ошибка при выполнении запроса' });
//     }
// });
// app.get('/subcategory', async (req, res) => {
//     try {

//         const result = await pool.query(`
//             SELECT name_subcategory FROM california.subcategory
//         `,);

//         console.log('Результат запроса:', result);
//         console.log('Количество строк:', result[0].length);

//         if (!result[0] || result[0].length === 0) {
//             res.status(404).json({ error: 'Данные не найдены' });
//         } else {
//             res.json(result[0]);
//         }
//     } catch (error) {
//         console.error('Ошибка при выполнении запроса:', error);
//         res.status(500).json({ error: 'Произошла ошибка при выполнении запроса' });
//     }
// });

// app.get('/reviews', async (req, res) => {
//     try {

//         const result = await pool.query(`
//             SELECT device.id_device, reviews.nickname_reviews as nickname, reviews.count_stars_reviews as count_stars, reviews.data_reviews as data, reviews.text_reviews
//             FROM california.device_reviews 
//             JOIN california.device ON device.id_device = device_reviews.id_device
//             JOIN california.reviews ON reviews.id_reviews = device_reviews.id_reviews
//         `,);

//         console.log('Результат запроса:', result);
//         console.log('Количество строк:', result[0].length);

//         if (!result[0] || result[0].length === 0) {
//             res.status(404).json({ error: 'Данные не найдены' });
//         } else {
//             res.json(result[0]);
//         }
//     } catch (error) {
//         console.error('Ошибка при выполнении запроса:', error);
//         res.status(500).json({ error: 'Произошла ошибка при выполнении запроса' });
//     }
// });

// app.get('/reviews/:id', async (req, res) => {
//     try {
//         const { id } = req.params;
//         console.log('Запрашиваемый id:', id);

//         const result = await pool.query(`
//             SELECT device.id_device, reviews.nickname_reviews as nickname, reviews.count_stars_reviews as count_stars, reviews.data_reviews as data, reviews.text_reviews
//             FROM california.device_reviews 
//             JOIN california.device ON device.id_device = device_reviews.id_device
//             JOIN california.reviews ON reviews.id_reviews = device_reviews.id_reviews
//             WHERE device.id_device = ?
//         `, [id]);

//         console.log('Результат запроса:', result);
//         console.log('Количество строк:', result[0].length);

//         if (!result[0] || result[0].length === 0) {
//             console.log('Данные не найдены для id:', id);
//             res.status(404).json({ error: 'Данные не найдены' });
//         } else {
//             res.json(result[0]);
//         }
//     } catch (error) {
//         console.error('Ошибка при выполнении запроса:', error);
//         res.status(500).json({ error: 'Произошла ошибка при выполнении запроса' });
//     }
// });

// app.get('/feature/:id', async (req, res) => {
//     try {
//         const { id } = req.params;
//         console.log('Запрашиваемый id:', id);

//         const result = await pool.query(`
//             SELECT 
//             device_feature.id_device, 
//             feature.title_feature, 
//             feature.desc_feature
//             FROM california.device_feature
//             JOIN california.device ON device_feature.id_device = device.id_device
//             JOIN california.feature ON device_feature.id_feature = feature.id_feature
//             WHERE device.id_device = ?
//         `, [id]);

//         console.log('Результат запроса:', result);
//         console.log('Количество строк:', result[0].length);

//         if (!result[0] || result[0].length === 0) {
//             console.log('Данные не найдены для id:', id);
//             res.status(404).json({ error: 'Данные не найдены' });
//         } else {
//             res.json(result[0]);
//         }
//     } catch (error) {
//         console.error('Ошибка при выполнении запроса:', error);
//         res.status(500).json({ error: 'Произошла ошибка при выполнении запроса' });
//     }
// });

// app.get('/feature', async (req, res) => {
//     try {

//         const result = await pool.query(`
//             SELECT 
//             device_feature.id_device, 
//             feature.title_feature, 
//             feature.desc_feature
//             FROM california.device_feature
//             JOIN california.device ON device_feature.id_device = device.id_device
//             JOIN california.feature ON device_feature.id_feature = feature.id_feature
//         `,);

//         console.log('Результат запроса:', result);
//         console.log('Количество строк:', result[0].length);

//         if (!result[0] || result[0].length === 0) {
//             res.status(404).json({ error: 'Данные не найдены' });
//         } else {
//             res.json(result[0]);
//         }
//     } catch (error) {
//         console.error('Ошибка при выполнении запроса:', error);
//         res.status(500).json({ error: 'Произошла ошибка при выполнении запроса' });
//     }
// });

// app.get('/tovar/:id', async (req, res) => {
//     try {
//         const { id } = req.params;
//         console.log('Запрашиваемый id:', id);

//         const result = await pool.query(`
//             SELECT 
//                 device.id_device,
//                 device.desc_device,
//                 JSON_ARRAYAGG(
//                     JSON_OBJECT(
//                         'name_type', type_images.name_type,
//                         'link_images_device', images_device.link_images_device
//                     )
//                 ) AS images
//             FROM california.device
//             JOIN california.device_images_device ON device.id_device = device_images_device.id_device
//             JOIN california.images_device ON device_images_device.id_images_device = images_device.id_images_device
//             JOIN california.type_images ON images_device.id_type_images = type_images.id_type_images
//             WHERE device.id_device = ?
//             GROUP BY device.id_device, device.desc_device
//         `, [id]);

//         console.log('Результат запроса:', result);
//         console.log('Количество строк:', result.length);

//         if (result.length === 0) {
//             console.log('Данные не найдены для id:', id);
//             res.status(404).json({ error: 'Данные не найдены' });
//         } else {
//             // Возвращаем только первый массив
//             res.json(result[0]);
//         }
//     } catch (error) {
//         console.error('Ошибка при выполнении запроса:', error);
//         res.status(500).json({ error: 'Произошла ошибка при выполнении запроса' });
//     }
// });
// app.get('/tovar', async (req, res) => {
//     try {

//         const result = await pool.query(`
//             SELECT 
//                 device.id_device,
//                 device.desc_device,
//                 JSON_ARRAYAGG(
//                     JSON_OBJECT(
//                         'name_type', type_images.name_type,
//                         'link_images_device', images_device.link_images_device
//                     )
//                 ) AS images
//             FROM california.device
//             JOIN california.device_images_device ON device.id_device = device_images_device.id_device
//             JOIN california.images_device ON device_images_device.id_images_device = images_device.id_images_device
//             JOIN california.type_images ON images_device.id_type_images = type_images.id_type_images
//             GROUP BY device.id_device, device.desc_device
//         `,);

//         console.log('Результат запроса:', result);
//         console.log('Количество строк:', result[0].length);

//         if (!result[0] || result[0].length === 0) {
//             res.status(404).json({ error: 'Данные не найдены' });
//         } else {
//             res.json(result[0]);
//         }
//     } catch (error) {
//         console.error('Ошибка при выполнении запроса:', error);
//         res.status(500).json({ error: 'Произошла ошибка при выполнении запроса' });
//     }
// });











// app.listen(3001, async () => {
//     if (await checkDBConnection()) {
//         console.log('Сервер запущен на порту 3001');
//     } else {
//         console.error('Не удалось подключиться к базе данных. Сервер не запущен.');
//     }
// });

















    //   for (const image of images) {
    //     // Проверяем, существует ли тип изображения в таблице "type_images"
    //     let [typeImageResult] = await db.pool.query(
    //       'SELECT id_type_images FROM type_images WHERE name_type = ?',
    //       [image.mimetype]
    //     );
  
    //     if (typeImageResult.length === 0) {
    //       // Если тип изображения не найден, добавляем его в таблицу "type_images"
    //       [typeImageResult] = await db.pool.query(
    //         'INSERT INTO type_images (name_type) VALUES (?)',
    //         [image.mimetype]
    //       );
    //     }
  
    //     const imageFilename = `${Date.now()}-${image.originalname}`;
    //     const imagePath = path.join('uploads', imageFilename);

    //     // Сохранение изображения на диск
    //     await fs.promises.mkdir('uploads', { recursive: true });
    //     await fs.promises.writeFile(path.join(__dirname, '..', imagePath), image.buffer);
  
    //     // Сохраняем ссылку на изображение в таблице "images_device"
    //     const [imageResult] = await db.pool.query(
    //       'INSERT INTO images_device (link_images_device, id_type_images) VALUES (?, ?)',
    //       [imagePath, typeImageResult[0].id_type_images]
    //     );
  
    //     // Связываем устройство с изображением в таблице "device_images_device"
    //     await db.pool.query(
    //       'INSERT INTO device_images_device (id_device, id_images_device) VALUES (?, ?)',
    //       [deviceId, imageResult.insertId]
    //     );
    //   }