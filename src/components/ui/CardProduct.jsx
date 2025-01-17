import React from "react";
import left from "../../img/arrow-left.svg"
import right from "../../img/arrow-right.svg"
import { useNavigate } from "react-router-dom";



const CardProduct = ({id_device, imageProduct, titleProduct, desProduct, priceProduct, typeCard, countProduct,onDecrease, onIncrease }) =>{
    const router = useNavigate()
    if(typeCard == "column"){
        
        return(
            <a href="#" onClick={(e) => { e.preventDefault(); router(`/product/${id_device}`);}} key={id_device} className="popular__card">
                <img src={imageProduct} alt=""></img>
                <h3 className="title title_sm title_purpule">
                    {titleProduct}
                </h3>
                <span>
                    <p className="desc">
                        {desProduct}
                    </p>
                </span>
                <p className="sub sub_purpule">
                    {priceProduct}
                </p>
            </a>
        )
    }
    else if(typeCard == "row"){
        return(
            <div class="basket__product">
                <span>
                    <img src={left} alt="" onClick={onDecrease} />
                    {countProduct} 
                    <img src={right} alt="" onClick={onIncrease} />
                </span>
                <div class="basket-product__content">
                    <img src={imageProduct} alt=""/>
                    <div class="basket__info">
                        <h3 class="title">
                            {titleProduct}
                        </h3>
                        <p class="desc">
                            {desProduct}
                        </p>
                        <p class="sub">
                            {priceProduct}
                        </p>
                    </div>
                </div>
            </div>
        )

    }
    
}

export default CardProduct