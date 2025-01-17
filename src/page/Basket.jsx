import React, { useState } from "react";
import tovar from "../img/tovar.png"
import CardProduct from "../components/ui/CardProduct";
import Details from "../components/Details";

const Basket = () =>{
    const [selectAll, setSelectAll] = useState(false);
    const [products, setProducts] = useState([
        {name:"MacBook Air M1", desc:"Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit...", price:"1009", images:tovar, link:"#", count:1,},
        {name:"MacBook Air M1", desc:"Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit...", price:"1009", images:tovar, link:"#", count:2,},
        {name:"MacBook Air M1", desc:"Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit...", price:"1009", images:tovar, link:"#", count:1,},
        {name:"MacBook Air M1", desc:"Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit...", price:"1009", images:tovar, link:"#", count:3,},
    ]);
    const [formalizationVisible, setFormalizationVisible] = useState(false);

    const handleFormalizationToggle = (visible) => {
        setFormalizationVisible(visible); 
    };

    const handleSelectAllChange = () => {
        setSelectAll(!selectAll);
        const updatedProducts = products.map((product) => {
          return { ...product, selected: !selectAll };
        });
        setProducts(updatedProducts);
      };
    
      const handleProductSelect = (index) => {
        const updatedProducts = [...products];
        updatedProducts[index].selected = !updatedProducts[index].selected;
        setProducts(updatedProducts);
        setSelectAll(updatedProducts.every((product) => product.selected));
      };
    
      const handleDeleteAll = () => {
        setProducts([]);
      };
    
      const handleDeleteSelected = () => {
        const updatedProducts = products.filter((product) => !product.selected);
        setProducts(updatedProducts);
      };
      const handleDecrease = (index) => {
        const updatedProducts = [...products];
        if (updatedProducts[index].count > 1) {
          updatedProducts[index].count = updatedProducts[index].count - 1;
          setProducts(updatedProducts);
        }
      };
      
      const handleIncrease = (index) => {
        const updatedProducts = [...products];
        updatedProducts[index].count = updatedProducts[index].count + 1;
        setProducts(updatedProducts);
      };
    return(
        <div className="basket">
            <div className="basket__content wrap">
                <h1 className="title title_md">
                    Корзина
                </h1>
                <div className="basket__header">
                    <form className="basket-top__form" action="">
                        <span>
                        <input type="checkbox" checked={selectAll} onChange={handleSelectAllChange}/> 
                            <p className="sub  sub_purpule">
                                Выбрать все
                            </p>
                        </span>
                    </form>
                    <div className="basket__links">
                        <a className="desc" onClick={handleDeleteSelected}>
                            Удалить выбранное
                        </a>
                        <p 
                            className="desc"
                            onClick={handleDeleteAll}
                        >
                            Удалить все
                        </p>
                    </div>
                </div>
                <div className="basket__main">
                    <form action="" method="post">
                        {products.map((product, index) =>
                            <span>
                                <input 
                                    type="checkbox"
                                    checked={product.selected}
                                    onChange={() => handleProductSelect(index)}
                                />
                                <CardProduct 
                                    linkProduct={product.link} 
                                    imageProduct={product.images} 
                                    titleProduct={product.name} 
                                    desProduct={product.desc} 
                                    priceProduct={product.price}
                                    countProduct={product.count} 
                                    typeCard={"row"}
                                    onDecrease={() => handleDecrease(index)}
                                    onIncrease={() => handleIncrease(index)} 
                                />
                            </span>
                        )}
                        
                    </form>
                </div>
                </div>
                <Details detailsProduts={products} onVisible={handleFormalizationToggle}/>
                {formalizationVisible?
                
                    <div className="formalization" id="formalization">
                <div className="formalization__content wrap">
                    <div className="formalization__form">
                        <h2 className="title title_md">
                            Оформление закза
                        </h2>
                        <form action="">
                            <span>
                                <p className="desc desc_bg sub_purpule">
                                Фамилия 
                                </p>
                                <input type="text"/>
                            </span>
                            <span>
                                <p className="desc desc_bg sub_purpule" >
                                    Имя
                                </p>
                                <input type="text"/>
                            </span>
                            <span>
                                <p className="desc desc_bg sub_purpule">
                                    Email
                                </p>
                                <input type="text"/>
                            </span>
                            <a href="" className="button_formalization button button_bg button_purpule">
                                Заказать
                            </a>
                        </form>
                    </div>
                    <div className="formalization_ditails">
                        <Details detailsProduts={products} detailsType={"min"}/>
                    </div>
                </div>
            </div>
                :
            <div></div>
            }
                
            
        </div>
    )
}

export default Basket