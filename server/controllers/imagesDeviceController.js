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


async function getAllImages(req, res) {
    try {
      const query = `
        SELECT
          device_images_device.id_device,
          images_device.link_images_device,
          type_images.name_type,images_device.id_images_device as id_images_device
        FROM california.device_images_device
        JOIN california.images_device ON device_images_device.id_images_device = images_device.id_images_device
        JOIN california.type_images ON images_device.id_type_images = type_images.id_type_images
      `;
  
      const [rows] = await db.pool.query(query);
  
      // Группируем данные по id_device
      const result = {};
      for (const row of rows) {
        const { id_device, link_images_device, name_type } = row;
        if (!result[id_device]) {
          result[id_device] = {
            id_device,
            images: []
          };
        }
  
        result[id_device].images.push({
          link_images_device,
          name_type,
          id_image: row.id_images_device
        });
      }
  
      // Преобразуем объект в массив
      const finalResult = Object.values(result);
  
      res.json(finalResult);
    } catch (error) {
      console.error('Ошибка при получении изображений:', error);
      res.status(500).json({ message: 'Ошибка при получении изображений' });
    }
  }
async function getImageByDevice(req, res) {
    const { id } = req.params; // Получаем id_device из параметров запроса

  try {
    const query = `
      SELECT
        device_images_device.id_device,
        images_device.link_images_device,
        type_images.name_type, images_device.id_images_device as id_images_device
      FROM california.device_images_device
      JOIN california.images_device ON device_images_device.id_images_device = images_device.id_images_device
      JOIN california.type_images ON images_device.id_type_images = type_images.id_type_images
      WHERE device_images_device.id_device = ?
    `;

    const [rows] = await db.pool.query(query, [id]);

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Изображения не найдены' });
    }

    const result = {
      id_device: rows[0].id_device,
      images: []
    };

    for (const row of rows) {
      result.images.push({
        link_images_device: row.link_images_device,
        name_type: row.name_type,
        id_image: row.id_images_device
      });
    }

    res.json(result);
  } catch (error) {
    console.error('Ошибка при получении изображений:', error);
    res.status(500).json({ message: 'Ошибка при получении изображений' });
  }
}
async function addImages(req, res) {
    try {
    const { id_device, types } = req.body;
    const images = req.files;
    console.log(images);
    
    for (let index = 0; index < images.length; index++) {

        let [typeImageResult] = await db.pool.query(
            'SELECT id_type_images FROM type_images WHERE name_type = ?',
            [types[index]]
          );
        
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
          [id_device, imageResult.insertId]
        );      
      }
      res.status(201).json({
        message: 'изображения успешно добавлены',
    });
    } catch (error) {
        console.error('Error creating device:', error);
        return res.status(500).json({ error: 'Ошибка при добавлении изображения' });
    }
}
async function updateImages(req, res) {
    try {
        const { id } = req.params;
      const {type} = req.body;
      const image = req.file;
        console.log(image);
        
      // Обновляем существующие изображения, связанные с устройством
      
        let [typeImageResult] = await db.pool.query(
          'SELECT id_type_images FROM type_images WHERE name_type = ?',
          [type]
        );
        console.log(typeImageResult);
        
        const imageFilename = `${Date.now()}-${image.originalname}`;
        const imagePath = path.join('uploads', imageFilename);
  
        // Сохранение изображения на диск
        await fs.promises.mkdir('uploads', { recursive: true });
        await fs.promises.writeFile(path.join(__dirname, '..', imagePath), image.buffer);
        const imageUrl = `${req.protocol}://${req.get('host')}/uploads/${imageFilename}`;
  
        // Обновляем ссылку на изображение в таблице "images_device"
        await db.pool.query(
          'UPDATE images_device SET link_images_device = ?, id_type_images = ? WHERE id_images_device = ?',
          [imageUrl, typeImageResult[0].id_type_images, id]
        );
      
  
      res.status(200).json({
        message: 'Изображения успешно обновлены',
      });
    } catch (error) {
      console.error('Error updating device images:', error);
      return res.status(500).json({ error: 'Ошибка при обновлении изображений' });
    }
  }
  
async function deleteImages(req, res) {
    const { id } = req.params; // Получаем id_images_device из параметров запроса

  try {
    // Удаляем связь между устройством и изображением
    const deleteDeviceImageQuery = `
      DELETE FROM california.device_images_device
      WHERE id_images_device = ?
    `;
    await db.pool.query(deleteDeviceImageQuery, [id]);

    // Удаляем само изображение
    const deleteImageQuery = `
      DELETE FROM california.images_device
      WHERE id_images_device = ?
    `;
    await db.pool.query(deleteImageQuery, [id]);

    res.json({ message: 'Изображение успешно удалено' });
  } catch (error) {
    console.error('Ошибка при удалении изображения:', error);
    res.status(500).json({ message: 'Ошибка при удалении изображения' });
  }
}



module.exports = {
    getAllImages,
    getImageByDevice,
    addImages,
    updateImages,
    deleteImages,
    upload

  };
  