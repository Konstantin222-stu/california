// deviceController.js
const db = require('../config/db');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { log } = require('console');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Папка для хранения файлов
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}${path.extname(file.originalname)}`); // Уникальное имя файла
    }
});

const upload = multer({ storage });

async function getAllDevices(req, res) {
  const { limit, page, brands, subcategories, category, sortField, sortOrder, minPrice, maxPrice, name } = req.query;
  console.log(limit)
  try {
      let query = `
          SELECT
              device.id_device AS id,
              device.name_device AS name,
              device.desc_device AS description,
              brand.name_brand AS brand,
              subcategory.name_subcategory AS subcategory,
              category.name_category AS category,
              images_device.link_images_device AS link_image,
              price.id_price AS id_price,
              price.price AS price
          FROM california.device_images_device
          JOIN california.device ON device_images_device.id_device = device.id_device
          JOIN california.brand ON device.id_brand = brand.id_brand
          JOIN california.subcategory ON device.id_subcategory = subcategory.id_subcategory
          JOIN california.category ON subcategory.id_category = category.id_category
          JOIN california.images_device ON device_images_device.id_images_device = images_device.id_images_device
          JOIN california.type_images ON images_device.id_type_images = type_images.id_type_images
          JOIN (
              SELECT id_device, MIN(id_price) AS min_id_price
              FROM california.device_price
              GROUP BY id_device
          ) AS min_prices ON device.id_device = min_prices.id_device
          JOIN california.price ON min_prices.min_id_price = price.id_price
          WHERE type_images.name_type = 'main'
      `;

      const params = [];



      if (minPrice !== undefined && maxPrice !== undefined) {
          query += ' AND price.price BETWEEN ? AND ?';
          params.push(parseFloat(minPrice), parseFloat(maxPrice));
      } else if (minPrice !== undefined) {
          query += ' AND price.price >= ?';
          params.push(parseFloat(minPrice));
      } else if (maxPrice !== undefined) {
          query += ' AND price.price <= ?';
          params.push(parseFloat(maxPrice));
      }

      if (name) {
        query += ' AND device.name_device LIKE ?';
        params.push(`%${name}%`);
      }

      if (brands) {
          if (Array.isArray(brands)) {
              query += ' AND brand.name_brand IN (?)';
              params.push(brands);
          } else {
              query += ' AND brand.name_brand = ?';
              params.push(brands);
          }
      }

      if (subcategories) {
        if (Array.isArray(subcategories)) {
            query += ' AND subcategory.name_subcategory IN (?)';
            params.push(subcategories);
        } else {
            query += ' AND subcategory.name_subcategory = ?';
            params.push(subcategories);
        }
    }


      if (category) {
          query += ' AND category.name_category = ?';
          params.push(category);
      }

      if (sortField && sortOrder) {
          query += ` ORDER BY ${sortField} ${sortOrder}`;
      }

      if (limit) {
          query += ' LIMIT ?';
          params.push(parseInt(limit));
      }

      if (page) {
          const offset = (page - 1) * (limit || 10);
          query += ' OFFSET ?';
          params.push(offset);
      }

      const [rows] = await db.pool.query(query, params);

      res.json(rows);
  } catch (error) {
      console.error('Ошибка при получении устройств:', error);
      res.status(500).json({ message: 'Ошибка при получении устройств' });
  }
}
async function getDevices(req, res) {
  const { limit, page, brands, subcategories, category, sortField, sortOrder, minPrice, maxPrice, name } = req.query;
  const { id } = req.params;

  try {
    let query = `
      SELECT
        device.id_device AS id,
        device.name_device AS name,
        device.desc_device AS description,
        brand.name_brand AS brand,
        subcategory.name_subcategory AS subcategory,
        category.name_category AS category,
        images_device.link_images_device AS link_image,
        price.id_price AS id_price,
        price.price AS price
      FROM california.device_images_device
      JOIN california.device ON device_images_device.id_device = device.id_device
      JOIN california.brand ON device.id_brand = brand.id_brand
      JOIN california.subcategory ON device.id_subcategory = subcategory.id_subcategory
      JOIN california.category ON subcategory.id_category = category.id_category
      JOIN california.images_device ON device_images_device.id_images_device = images_device.id_images_device
      JOIN california.type_images ON images_device.id_type_images = type_images.id_type_images
      JOIN (
        SELECT id_device, MIN(id_price) AS min_id_price
        FROM california.device_price
        GROUP BY id_device
      ) AS min_prices ON device.id_device = min_prices.id_device
      JOIN california.price ON min_prices.min_id_price = price.id_price
      WHERE type_images.name_type = 'main' AND device.id_device = ?
    `;

    const params = [id];

    if (minPrice !== undefined && maxPrice !== undefined) {
      query += ' AND price.price BETWEEN ? AND ?';
      params.push(parseFloat(minPrice), parseFloat(maxPrice));
    } else if (minPrice !== undefined) {
      query += ' AND price.price >= ?';
      params.push(parseFloat(minPrice));
    } else if (maxPrice !== undefined) {
      query += ' AND price.price <= ?';
      params.push(parseFloat(maxPrice));
    }

    if (name) {
      query += ' AND device.name_device LIKE ?';
      params.push(`%${name}%`);
    }

    if (brands) {
      if (Array.isArray(brands)) {
        query += ' AND brand.name_brand IN (?)';
        params.push(brands);
      } else {
        query += ' AND brand.name_brand = ?';
        params.push(brands);
      }
    }

    if (subcategories) {
      if (Array.isArray(subcategories)) {
        query += ' AND subcategory.name_subcategory IN (?)';
        params.push(subcategories);
      } else {
        query += ' AND subcategory.name_subcategory = ?';
        params.push(subcategories);
      }
    }

    if (category) {
      query += ' AND category.name_category = ?';
      params.push(category);
    }

    if (sortField && sortOrder) {
      query += ` ORDER BY ${sortField} ${sortOrder}`;
    }

    if (limit) {
      query += ' LIMIT ?';
      params.push(parseInt(limit));
    }

    if (page) {
      const offset = (page - 1) * (limit || 10);
      query += ' OFFSET ?';
      params.push(offset);
    }

    const [rows] = await db.pool.query(query, params);

    res.json(rows);
  } catch (error) {
    console.error('Ошибка при получении устройств:', error);
    res.status(500).json({ message: 'Ошибка при получении устройств' });
  }
} 

async function updateDevice(req, res) {
  try {
      const { id } = req.params;
      const { name, description, brandName, subcategoryName, reviews, features, prices, types } = req.body;
      const images = req.files;

      if (!name || !description || !brandName || !subcategoryName || !images) {
          return res.status(400).json({ message: 'Все обязательные поля должны быть заполнены' });
      }

      // Найти или создать бренд
      const [brandResult] = await db.pool.query(
          'SELECT id_brand FROM brand WHERE name_brand = ?',
          [brandName]
      );
      let brandId = brandResult.length > 0 ? brandResult[0].id_brand : (await db.pool.query(
          'INSERT INTO brand (name_brand) VALUES (?)',
          [brandName]
      ))[0].insertId;

      // Найти или создать подкатегорию
      const [subcategoryResult] = await db.pool.query(
          'SELECT id_subcategory FROM subcategory WHERE name_subcategory = ?',
          [subcategoryName]
      );
      let subcategoryId = subcategoryResult.length > 0 ? subcategoryResult[0].id_subcategory : (await db.pool.query(
          'INSERT INTO subcategory (name_subcategory, id_category) VALUES (?, ?)',
          [subcategoryName, 1] // Замените 1 на фактический id_category
      ))[0].insertId;

      // Обновить устройство
      const [deviceResult] = await db.pool.query(
          'UPDATE device SET name_device = ?, desc_device = ?, id_brand = ?, id_subcategory = ? WHERE id_device = ?',
          [name, description, brandId, subcategoryId, id]
      );

      if (deviceResult.affectedRows === 0) {
          return res.status(404).json({ message: 'Устройство не найдено' });
      }

      // Обновить отзывы
      if (reviews && Array.isArray(reviews) && reviews.length > 0) {
          // Сначала удалить старые отзывы
          await db.pool.query(
              'DELETE FROM device_reviews WHERE id_device = ?',
              [id]
          );

          // Затем добавить новые отзывы
          for (const review of reviews) {
              const [reviewResult] = await db.pool.query(
                  'INSERT INTO reviews (nickname_reviews, data_reviews, count_stars_reviews, text_reviews) VALUES (?, ?, ?, ?)',
                  [review.nickname, review.data, review.count_stars, review.text]
              );
              await db.pool.query(
                  'INSERT INTO device_reviews (id_device, id_reviews) VALUES (?, ?)',
                  [id, reviewResult.insertId]
              );
          }
      }

      // Обновить характеристики
      // Сначала удалить старые характеристики
      await db.pool.query(
          'DELETE FROM device_feature WHERE id_device = ?',
          [id]
      );

      // Затем добавить новые характеристики
      for (const feature of features) {
          const [featureResult] = await db.pool.query(
              'INSERT INTO feature (title_feature, desc_feature) VALUES (?, ?)',
              [feature.title, feature.description]
          );
          await db.pool.query(
              'INSERT INTO device_feature (id_device, id_feature) VALUES (?, ?)',
              [id, featureResult.insertId]
          );
      }

      // Обновить цены
      // Сначала удалить старые цены
      await db.pool.query(
          'DELETE FROM device_price WHERE id_device = ?',
          [id]
      );

      // Затем добавить новые цены
for (const price of prices) {
  const [priceResult] = await db.pool.query(
      'INSERT INTO price (price, name_price) VALUES (?, ?)',
      [price.value, price.name]
  );
  await db.pool.query(
      'INSERT INTO device_price (id_device, id_price) VALUES (?, ?)',
      [id, priceResult.insertId]
  );
}

// Обновить изображения
// Сначала удалить старые изображения
await db.pool.query(
  'DELETE FROM device_images_device WHERE id_device = ?',
  [id]
);
await db.pool.query(
  'DELETE FROM images_device WHERE id_images_device IN (SELECT id_images_device FROM device_images_device WHERE id_device = ?)',
  [id]
);

// Затем добавить новые изображения
for (let index = 0; index < images.length; index++) {
  // Проверяем, существует ли тип изображения в таблице "type_images"
  let [typeImageResult] = await db.pool.query(
      'SELECT id_type_images FROM type_images WHERE name_type = ?',
      [types[index]]
  );

  if (typeImageResult.length === 0) {
      // Если тип изображения не найден, добавляем его в таблицу "type_images"
      [typeImageResult] = await db.pool.query(
          'INSERT INTO type_images (name_type) VALUES (?)',
          [types[index]]
      );
  }

  const imageFilename = `${Date.now()}-${images[index].originalname}`;
  const imagePath = path.join('uploads', imageFilename);

  // Сохранение изображения на диск
  await fs.promises.mkdir('uploads', { recursive: true });
  await fs.promises.writeFile(path.join(__dirname, '..', imagePath), images[index].buffer);
  const imageUrl = `${req.protocol}://${req.get('host')}/uploads/${imageFilename}`;

  // Сохраняем ссылку на изображение в таблице "images_device"
  const [imageResult] = await db.pool.query(
      'INSERT INTO images_device (link_images_device, id_type_images) VALUES (?, ?)',
      [imageUrl, typeImageResult[0].id_type_images]
  );

  // Связываем устройство с изображением в таблице "device_images_device"
  await db.pool.query(
      'INSERT INTO device_images_device (id_device, id_images_device) VALUES (?, ?)',
      [id, imageResult.insertId]
  );
}

res.status(200).json({
  message: 'Устройство успешно обновлено'
});
} catch (error) {
  console.error('Error updating device:', error);
  return res.status(500).json({ error: 'Ошибка при обновлении устройства' });
}
}
async function createDevice (req, res) {
  
    try {
      const { name, description, brandName, subcategoryName, categoryName, reviews, features, prices, types } = req.body;
      const images = req.files;
      console.log('Received data:', req.body);
    console.log('Received images:', req.files);

    if (!name || !description || !brandName || !subcategoryName || !categoryName || !images) {
      return res.status(400).json({ message: 'Все поля должны быть заполнены' });
    }
  
      
  
      // Найти или создать бренд
      const [brandResult] = await db.pool.query(
        'SELECT id_brand FROM brand WHERE name_brand = ?',
        [brandName]
      );
      let brandId = brandResult.length > 0 ? brandResult[0].id_brand : (await db.pool.query(
        'INSERT INTO brand (name_brand) VALUES (?)',
        [brandName]
      ))[0].insertId;
  
      // Найти или создать подкатегорию
      const [subcategoryResult] = await db.pool.query(
        'SELECT id_subcategory FROM subcategory WHERE name_subcategory = ?',
        [subcategoryName]
      );
      let subcategoryId = subcategoryResult.length > 0 ? subcategoryResult[0].id_subcategory : (await db.pool.query(
        'INSERT INTO subcategory (name_subcategory, id_category) VALUES (?, ?)',
        [subcategoryName, 1] // Замените 1 на фактический id_category
      ))[0].insertId;
  
       // Сохранить устройство
    const [deviceResult] = await db.pool.query(
        'INSERT INTO device (name_device, desc_device, id_brand, id_subcategory) VALUES (?, ?, ?, ?)',
        [name, description, brandId, subcategoryId]
      );
      const deviceId = deviceResult.insertId;
  
      // Сохранить отзывы
      if (reviews && Array.isArray(reviews) && reviews.length > 0) {
        for (const review of reviews) {
          const [reviewResult] = await db.pool.query(
            'INSERT INTO reviews (nickname_reviews, data_reviews, count_stars_reviews, text_reviews) VALUES (?, ?, ?, ?)',
            [review.nickname, review.data, review.count_stars, review.text]
          );
          await db.pool.query(
            'INSERT INTO device_reviews (id_device, id_reviews) VALUES (?, ?)',
            [deviceId, reviewResult.insertId]
          );
        }
      }
  
      // Сохранить характеристики
    for (const feature of features) {
        const [featureResult] = await db.pool.query(
          'INSERT INTO feature (title_feature, desc_feature) VALUES (?, ?)',
          [feature.title, feature.description]
        );
        await db.pool.query(
          'INSERT INTO device_feature (id_device, id_feature) VALUES (?, ?)',
          [deviceId, featureResult.insertId]
        );
      }
  
      // Сохранить цены
    for (const price of prices) {
        const [priceResult] = await db.pool.query(
          'INSERT INTO price (price, name_price) VALUES (?, ?)',
          [price.value, price.name]
        );
        await db.pool.query(
          'INSERT INTO device_price (id_device, id_price) VALUES (?, ?)',
          [deviceId, priceResult.insertId]
        );
      }


    for (let index = 0; index < images.length; index++) {

        // Проверяем, существует ли тип изображения в таблице "type_images"
      let [typeImageResult] = await db.pool.query(
        'SELECT id_type_images FROM type_images WHERE name_type = ?',
        [types[index]]
      );

      if (typeImageResult.length === 0) {
        // Если тип изображения не найден, добавляем его в таблицу "type_images"
        [typeImageResult] = await db.pool.query(
          'INSERT INTO type_images (name_type) VALUES (?)',
          [types[index]]
        );
      }
        
        const imageFilename = `${Date.now()}-${images[index].originalname}`;
        const imagePath = path.join('uploads', imageFilename);

        // Сохранение изображения на диск
        await fs.promises.mkdir('uploads', { recursive: true });
        await fs.promises.writeFile(path.join(__dirname, '..', imagePath), images[index].buffer);
        const imageUrl = `${req.protocol}://${req.get('host')}/uploads/${imageFilename}`;
  
        // Сохраняем ссылку на изображение в таблице "images_device"
        const [imageResult] = await db.pool.query(
          'INSERT INTO images_device (link_images_device, id_type_images) VALUES (?, ?)',
          [imageUrl, typeImageResult[0].id_type_images]
        );
  
        // Связываем устройство с изображением в таблице "device_images_device"
        await db.pool.query(
          'INSERT INTO device_images_device (id_device, id_images_device) VALUES (?, ?)',
          [deviceId, imageResult.insertId]
        );      
      }


        res.status(201).json({
            message: 'device успешно создана',
        });
  
    } catch (error) {
        console.error('Error creating device:', error);
        return res.status(500).json({ error: 'Ошибка при создании устройства' });
    }
    };
async function deleteDevice(req, res) {
        try {
          const { id } = req.params;
      
          // Получить список изображений, связанных с устройством
          const [imagesResult] = await db.pool.query(
            'SELECT id_images_device FROM device_images_device WHERE id_device = ?',
            [id]
          );

           // Удалить связи между устройством и изображениями
           await db.pool.query(
            'DELETE FROM device_images_device WHERE id_device = ?',
            [id]
          );
      
          // Удалить изображения с диска
          for (const image of imagesResult) {
            const imagePath = path.join(__dirname, '..', image.link_images_device.replace(`${req.protocol}://${req.get('host')}/uploads/`, ''));
            await fs.promises.unlink(imagePath);
            await db.pool.query(
              'DELETE FROM images_device WHERE id_images_device = ?',
              [image.id_images_device]
            );
          }
      
          // Удалить связи между устройством и отзывами
          await db.pool.query(
            'DELETE FROM device_reviews WHERE id_device = ?',
            [id]
          );
      
          // Удалить связи между устройством и характеристиками
          await db.pool.query(
            'DELETE FROM device_feature WHERE id_device = ?',
            [id]
          );
      
          // Удалить характеристики, не связанные с другими устройствами
          const [featuresResult] = await db.pool.query(
            'SELECT id_feature FROM device_feature WHERE id_device = ?',
            [id]
          );
          for (const feature of featuresResult) {
            const [deviceCountResult] = await db.pool.query(
              'SELECT COUNT(*) as count FROM device_feature WHERE id_feature = ?',
              [feature.id_feature]
            );
            if (deviceCountResult[0].count === 1) {
              await db.pool.query(
                'DELETE FROM feature WHERE id_feature = ?',
                [feature.id_feature]
              );
            }
          }
      
          // Удалить связи между устройством и ценами
          await db.pool.query(
            'DELETE FROM device_price WHERE id_device = ?',
            [id]
          );
      
          // Удалить устройство
          const [deviceResult] = await db.pool.query(
            'DELETE FROM device WHERE id_device = ?',
            [id]
          );
      
          if (deviceResult.affectedRows === 0) {
            return res.status(404).json({ message: 'Устройство не найдено' });
          }
      
          res.status(200).json({ message: 'Устройство успешно удалено' });
        } catch (error) {
          console.error('Error deleting device:', error);
          return res.status(500).json({ error: 'Ошибка при удалении устройства' });
        }
    }
      
      


    module.exports = {
        getDevices,
        getAllDevices,
        createDevice,
        deleteDevice,
        updateDevice,
        upload
    };
  