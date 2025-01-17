import React, { useState, useEffect } from "react";
import search from "../../img/search.svg";
import cart from "../../img/cart.svg";
import Logo from "./Logo";
import check from "../../img/check.svg";
import { Link, useNavigate } from "react-router-dom";
import SearchResults from "../SearchResults";
import axios from "axios";
import useRequest from "../hooks/useRequest";

const Header = () => {
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);
  const [prevSearchQuery, setPrevSearchQuery] = useState("");
  const [prevCategory, setPrevCategory] = useState(null);
  const navigate = useNavigate();

  const [category, loading, error] = useRequest(fetchCategory);

  function fetchCategory() {
    return axios.get(`http://localhost:3001/category?`);
  }

  useEffect(() => {
    const fetchSearchResults = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/device?name=${searchQuery}`);
        setSearchResults(response.data);
      } catch (error) {
        console.error("Ошибка при получении результатов поиска:", error);
      }
    };

    if (searchQuery !== prevSearchQuery) {
      fetchSearchResults();
      setPrevSearchQuery(searchQuery);
    }
  }, [searchQuery, prevSearchQuery]);

  useEffect(() => {
    if (category !== prevCategory) {
      setPrevCategory(category);
    }
  }, [category, prevCategory]);

  const toggleSearchActive = () => {
    setIsSearchActive(!isSearchActive);
  };

  const toggleCategories = () => {
    setIsCategoriesOpen(!isCategoriesOpen);
  };

  if (loading) {
    return <h1>Идет загрузка...</h1>;
  }

  if (error) {
    return <h1>Произошла ошибка при загрузке данных</h1>;
  }

  return (
    <header className="header">
      <div className="header__content wrap">
        <nav className="nav">
          <Link to="/main">
            <Logo />
          </Link>
          <ul className="nav__list">
            <li className="nav-list__item">
              <Link to={`/goods/${prevCategory?.[0]?.name_category || ""}`}>
                Продукты
              </Link>
            </li>
            <li className="nav-list__item">
              <a href="#" onClick={toggleCategories}>
                Категории товара{" "}
                <img
                  src={check}
                  alt="check"
                  className={`${isCategoriesOpen ? "rotate-180" : ""}`}
                />
              </a>
              {isCategoriesOpen && (
                <ul className="sub-categories">
                  {prevCategory &&
                    prevCategory.map((category) => (
                      <li className="sub-categories__item">
                        <a
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            navigate(`/goods/${category.name_category}`);
                          }}
                          key={category.id_category}
                        >
                          {category.name_category}
                        </a>
                      </li>
                    ))}
                </ul>
              )}
            </li>
            <li className="nav-list__item">
              <a href="#">Популярное</a>
            </li>
            <li className="nav-list__item">
              <a href="#">Наши категории</a>
            </li>
          </ul>
          <div className="nav__container">
            <div
              className={`nav__search ${isSearchActive ? "nav__search_active" : ""}`}
            >
              <img onClick={toggleSearchActive} src={search} alt="поиск"></img>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              ></input>
            </div>
            <img src={cart} alt="корзина" />
          </div>
          </nav>
        {isSearchActive && (
          <SearchResults
            searchQuery={searchQuery}
            searchResults={searchResults}
          />
        )}
      </div>
    </header>
  );
};

export default Header;