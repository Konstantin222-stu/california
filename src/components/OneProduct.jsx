import React, { useEffect, useState } from "react";
import Splide from '@splidejs/splide';
import Button from "./ui/Button/Button"

const OneProduct = ({ productName, productPrice, productImages, productBig }) => {
    const [selectedPriceIndex, setSelectedPriceIndex] = useState(0);
    const [selectedPrice, setSelectedPrice] = useState(productPrice[0].price[1]);
    
    const handlePriceSelectionClick = (index) => {
        setSelectedPriceIndex(index);
        setSelectedPrice(productPrice[index].price[1]);
    };
    
    useEffect(() => {
        var splide = new Splide('#main-carousel', {
          pagination: false,
          arrows: false
        });

        var thumbnails = document.getElementsByClassName('thumbnail');
        var current;

        for (var i = 0; i < thumbnails.length; i++) {
          initThumbnail(thumbnails[i], i);
        }

        function initThumbnail(thumbnail, index) {
          thumbnail.addEventListener('click', function () {
            splide.go(index);
          });
        }

        splide.on('mounted move', function () {
          var thumbnail = thumbnails[splide.index];
          if (thumbnail) {
            if (current) {
              current.classList.remove('is-active');
            }
            thumbnail.classList.add('is-active');
            current = thumbnail;
          }
        });

        splide.mount();

        return () => {
          splide.destroy();
        }
    }, []);
    console.log(productPrice);
    

    return(
        <div className="product">
            <div className="product__content wrap">
                <div className="product__info">
                    <p className="sub sub-orange">
                        Free Engraving
                    </p>
                    <h1 className="title">
                        {productName}
                    </h1>
                    <p className="sub">
                        {selectedPrice}
                    </p>
                    <div className="product__price">
                        <h3 className="title">
                            Charging Case
                        </h3>
                        <div className="price">
                            {productPrice.map((price, index)=>
                                <div key={index} className={`price__selection ${selectedPriceIndex === index ? 'price__selection_active' : ''}`} onClick={() => handlePriceSelectionClick(index)} >
                                    <h4 className="title">
                                        {price.price}
                                    </h4>
                                    <p className="desc">
                                        {price.name_price}
                                    </p>
                                </div>
                            )}
                        </div>
                        <Button colorButton={"purpule"} sizeButton={"sm"} linkButton={"#"}>Добавить в корзину</Button>
                    </div>
                </div>
                <div className="product__imgs">
                    <section id="main-carousel" className="splide" aria-label="My Awesome Gallery">
                        <div className="splide__track">
                        <ul className="splide__list">
                            {productImages.map((image)=>
                                <li className="splide__slide">
                                    <img src={image.link_images_device} alt=""/>
                                </li>
                            )}
                        </ul>
                        </div>
                    </section>

                    <ul id="thumbnails" className="thumbnails">
                        {productImages.map((image)=>
                            <li className="thumbnail">
                                
                                <img src={image.link_images_device} alt=""/>
                            </li>
                        )}
                    </ul>
                </div>
            </div>
        </div>
    )
}

export default OneProduct