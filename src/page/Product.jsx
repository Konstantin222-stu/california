import tab2 from "../img/tab2.png"
import tab3 from "../img/tab3.png"
import tab4 from "../img/tab 4.png"
import tab5 from "../img/tab5.png"
import tab6 from "../img/tab6.png"
import big from "../img/big-products.png"
import avatar from "../img/avatar.png"
import star from "../img/Star.svg"
import starActive from "../img/Star_active.svg"
import Popular from "../components/Popular";
import useRequest from "../components/hooks/useRequest";
import React, { useState, useEffect } from "react";
import ProductCard from "../components/OneProduct";
import { useParams } from "react-router-dom";
import axios from "axios";

const Product = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [prevId, setPrevId] = useState(null);
    const [sortField, setSortField] = useState('count_stars');
    const [sortOrder, setSortOrder] = useState('asc');
  
    const fetchReviews = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/reviews/${id}?sortField=${sortField}&sortOrder=${sortOrder}`);
        setReviews(response.data);
      } catch (err) {
        setError(err);
      }
    };
  
    useEffect(() => {
      async function fetchProduct() {
        try {
          setLoading(true);
          const response = await axios.get(`http://localhost:3001/product/${id}`);
          setProduct(response.data);
          setLoading(false);
          setPrevId(id);
        } catch (err) {
          setError(err);
          setLoading(false);
        }
      }
  
      if (id !== prevId) {
        fetchProduct();
        fetchReviews();
      } else {
        fetchReviews();
      }
    }, [id, prevId, sortField, sortOrder]);
  
    const handleSortReviews = () => {
      if (sortOrder === 'asc') {
        setSortOrder('desc');
      } else {
        setSortOrder('asc');
      }
      fetchReviews();
      };
  
    if (loading) {
      return <h1>Идет загрузка...</h1>;
    }
  
    if (error) {
      return <h1>Произошла ошибка при загрузке данных</h1>;
    }
  
    if (!product) {
      return null;
    }
  
    return (
            <div className="">
                {console.log(product[0])}
                <ProductCard productName={product[0].name_device} productPrice={product[0].prices} productImages={product[0].images} productBig={product[0].images}/>
                <div className="overview">
                    <div className="overview__content wrap">
                        <h2 className="title title_md">
                            Описание
                        </h2>
                        <p className="desc desc_bg">
                            {product[0].desc_device}
                        </p>
                    </div>
                </div>
                <div className="characteristics">
                    <div className="characteristics__content wrap">
                        <h2 className="title title_md">
                            Характеристики: {product[0].name_device}
                        </h2>
                        <div className="characteristics__rows">
                            {product[0].features.map((characteristic)=>
                                <div className="characteristic">
                                    <h4 className="title title_sm title_purpule">
                                        {characteristic.title_feature}
                                    </h4>
                                    <p className="desc">
                                        {characteristic.desc_feature}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                <div className="reviews">
                    <div className="reviews__content wrap">
                    <div className="reviews__header">
                        <h2 className="title title_md">Отзывы</h2>
                        <span>
                            <p className="desc">Сортировать:</p>
                            <a className="sub" onClick={handleSortReviews}>
                                {sortOrder === 'asc' ? 'по возрастанию' : 'по убыванию'}
                                <img src="./img/check-filter-top.svg" alt="" />
                            </a>
                        </span>
                    </div>
                    {reviews.map((review) => ( 
                    <div className="reviews__rows">
                    <div className="reviews-rows__row">
                        <div className="review__header">
                        <span>
                            <img className="review__avatar" src={avatar} alt="" />
                            <h4 className="title title_sm">
                                    {review.nickname_reviews}
                                    </h4>
                                    <p className="sub">
                                    {review.data_reviews}
                                    </p>
                                </span>
                                <ReviewStars totalStars={review.count_stars} />
                                </div>
                                <div className="review__message">
                                <p className="desc desc_bg">
                                    {review.text_reviews}
                                </p>
                                </div>
                            </div>
                        </div>
                    ))}
                    </div>
                </div>
                <Popular>Посмотрите еще</Popular>
            </div>
        )
}

const ReviewStars = ({ totalStars }) => {
    console.log(totalStars);
    
    const renderStars = () => {
        const stars = [];
        for (let i = 0; i < totalStars; i++) {
            stars.push(<img key={i} src={starActive} alt="Active Star" />);
        }
        for (let i = totalStars; i < 5; i++) {
            stars.push(<img key={i} src={star} alt="Inactive Star" />);
        }
        return stars;
    }

    return (
        <div className="review__stars">
            {renderStars()}
        </div>
    );
}

export default Product