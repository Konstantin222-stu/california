import React, { useEffect, useState } from "react";
import CardProduct from "./ui/CardProduct";

const GoodsCards = ({ tovarData }) => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    setProducts(tovarData);
  }, [tovarData]);
  console.log(tovarData);
  
  return (
    <div className="goods">
      <div className="goods__content">
        <div className="goods__cards">
          {products.map((product) => (
            <CardProduct
              linkProduct={"#"}
              titleProduct={product.name}
              desProduct={product.descriptio}
              priceProduct={product.price}
              imageProduct={product.link_image}
              typeCard={"column"}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default GoodsCards;
