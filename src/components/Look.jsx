import React, { useEffect, useState } from "react";
import search from "../img/search.svg";
import SearchResults from "./SearchResults";
import axios from "axios";

const Look = () => {
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [brands, setBrands] = useState([]);
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);

  useEffect(() => {
    let timeoutId;

    const fetchSearchResults = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/device?name=${searchQuery}`);
        setSearchResults(response.data);
      } catch (error) {
        console.error("Ошибка при получении результатов поиска:", error);
      }
    };

    const debouncedSearch = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(fetchSearchResults, 500);
    };

    debouncedSearch();

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const response = await axios.get("http://localhost:3001/brands");
        setBrands(response.data.slice(0, 9));
      } catch (error) {
        console.error("Ошибка при получении брендов:", error);
      }
    };

    fetchBrands();
  }, []);

  const toggleCategories = () => {
    setIsCategoriesOpen(!isCategoriesOpen);
  };

  const addSearchResult = (result) => {
    console.log("Добавлен результат поиска:", result);
    setIsSearchActive(false);
  };
  console.log(brands);
  
  return (
    <div className="look">
      <div className="look__content wrap">
        <h2 className="title title_bg">Looking for anything else?</h2>
        <div className="look__search">
          <form action="" method="post">
            <img src={search} alt="" />
            <input
              type="text"
              placeholder="Search keyword"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              onFocus={() => setIsSearchActive(true)}
              onBlur={() => setIsSearchActive(false)}
            />
            {isSearchActive && searchQuery && (
              <SearchResults
                searchQuery={searchQuery}
                searchResults={searchResults}
                addSearchResult={addSearchResult}
                searchType={"text"}
              />
            )}
          </form>
        </div>
        <div className="look__brands">
          {brands.map((brand, index) => (
            <a key={index} href="#" className="look__brand">
              <p className="desc">{brand.name_brand}</p>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Look;
