import React, { useState, useEffect } from "react";
import GoodsCards from "../components/GoodsCards";
import Filter from "../components/Filter";
import Video from "../components/Video";
import Subcategories from "../components/Subcategories";
import axios from "axios";
import { useParams } from "react-router-dom";

const Goods = () => {
  const { category } = useParams();
  const [brands, setBrands] = useState([]);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [videoData, setVideoData] = useState(null);
  const [products, setProducts] = useState([]);
  const [selectedSubcategory, setSelectedSubcategory] = useState(null);
  const [minPrice, setMinPrice] = useState(null);
  const [maxPrice, setMaxPrice] = useState(null);
  const [selectedSort, setSelectedSort] = useState('Сначала дорогие');

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Получение данных о брендах
        const brandsResponse = await axios.get(`http://localhost:3001/category/${category}/brand`);
        setBrands(brandsResponse.data);

        // Получение данных о подкатегориях
        const subcategoriesResponse = await axios.get(`http://localhost:3001/category/${category}/subcategory`);
        setSubcategories(subcategoriesResponse.data);

        // Получение данных о видео
        const videoResponse = await axios.get(`http://localhost:3001/category/${category}`);
        setVideoData(videoResponse.data);

        // Получение данных о продуктах
        await fetchProducts();
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, [category, selectedSubcategory, selectedBrands, selectedSort, minPrice, maxPrice]);

  const fetchProducts = async () => {
    try {
      let url = `http://localhost:3001/device?category=${category}`;
      if (selectedSubcategory) {
        url += `&subcategory[]=${selectedSubcategory}`;
      }
      if (selectedBrands.length > 0) {
        url += `&brands[]=${selectedBrands.join('&brands[]=')}`; // добавление фильтра по брендам
      }
      if (minPrice !== null) {
        url += `&minPrice=${minPrice}`; // добавление фильтра по минимальной цене
      }
      if (maxPrice !== null) {
        url += `&maxPrice=${maxPrice}`; // добавление фильтра по максимальной цене
      }
      if (selectedSort === 'Сначала дешевые') {
        url += `&sortField=price&sortOrder=asc`; // добавление сортировки по возрастанию цены
      } else if (selectedSort === 'Сначала дорогие') {
        url += `&sortField=price&sortOrder=desc`; // добавление сортировки по убыванию цены
      }
      const productsResponse = await axios.get(url);
      setProducts(productsResponse.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSortChange = (newSort) => {
    setSelectedSort(newSort);

    
    fetchProducts();
  };

  const handleBrandSelect = (selectedBrands) => {
    setSelectedBrands(selectedBrands);
    fetchProducts();
  };

  const handlePriceRangeChange = (min, max) => {
    setMinPrice(min);
    setMaxPrice(max);
    fetchProducts();
  };

  return (
    <div className="">
      <Subcategories category={category} setSelectedSubcategory={setSelectedSubcategory}/>
      {videoData && (
        <Video
          link_video={videoData[0].link_video_category}
          id_device={videoData[0].id_device}
        />
      )}
      <main className="main wrap">
        {brands && (
          <Filter
            filterType={"left"}
            brands={brands}
            onBrandSelect={handleBrandSelect}
            onPriceRangeChange={handlePriceRangeChange}
          />
        )}
        <div className="main__content">
          <Filter filterType={"top"} onSortChange={handleSortChange} />
          <GoodsCards tovarData={products} />
        </div>
      </main>
    </div>
  );
};

export default Goods;

