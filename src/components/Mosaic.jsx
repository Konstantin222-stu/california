import React from "react";
import Button from "./ui/Button/Button";
import laptop from "../img/laptop-mosaic.png"
import watch from "../img/watch-mosaic.png"
import smartphone from "../img/ssmartphone-mosaic.png"
import table from "../img/table-mosaic.png"
import keboard from "../img/keboard-mosaic.png"
import gamepad from "../img/gamepad-mosaic.png"
import headphone from "../img/headphone-mosaic.png"

const Mosaic = () =>{
    return(
        <div className="mosaic">
            <div className="mosaic__content">
                <div className="mosaic__card mosaic__card_top mosaic-card_black">
                    <h3 className="title title_vbg">
                        Элегантность во времени
                    </h3>
                    <p className="desc">
                        Стильные и надежные часы для любого случая.
                    </p>
                    <div className="mosaic-card__container">
                        <Button colorButton="purpule" sizeButton="bg" linkButton="#">Еще</Button>
                        <Button colorButton="purpule-border" sizeButton="bg" linkButton="#">Купить</Button>
                    </div>
                    <img src={watch} alt="watch"></img>
                </div>
                <div className="mosaic__conteiner">
                    <div className="mosaic__card mosaic__card_top mosaic-card_black">
                        <h3 className="title title_vbg">
                            Мощность в каждом ноутбуке
                        </h3>
                        <p className="desc">
                            Выбирайте производительность и стиль для работы и развлечений
                        </p>
                        <div className="mosaic-card__container">
                            <Button colorButton="purpule" sizeButton="bg" linkButton="#">Еще</Button>
                            <Button colorButton="purpule-border" sizeButton="bg" linkButton="#">Купить</Button>
                        </div>
                        <img src={laptop} alt="laptop"></img>
                    </div>
                    <div className="mosaic__card mosaic__card_bottom mosaic-card_white">
                        <div className="mosaic-card__container">
                            <Button colorButton="purpule" sizeButton="bg" linkButton="#">Еще</Button>
                            <Button colorButton="purpule-border" sizeButton="bg" linkButton="#">Купить</Button>
                        </div>
                        <p className="desc">
                            Стильные и надежные часы для любого случая.
                        </p>
                        <h3 className="title title_vbg">
                            Элегантность во времени
                        </h3>
                        <img src={smartphone} alt="smartphone"></img>
                    </div>
                </div>
                <div className="mosaic__conteiner">
                    <div className="mosaic__card mosaic__card_bottom mosaic-card_white">
                        
                        <div className="mosaic-card__container">
                            <Button colorButton="purpule" sizeButton="bg" linkButton="#">Еще</Button>
                            <Button colorButton="purpule-border" sizeButton="bg" linkButton="#">Купить</Button>
                        </div>
                        
                        <p className="desc">
                            Идеальные планшеты для работы, учебы и развлечений.
                        </p>
                        <h3 className="title title_vbg">
                            Мобильность и производительность
                        </h3>
                        <img src={table} alt="table"></img>
                    </div>
                    <div className="mosaic__card mosaic__card_top mosaic-card_black">
                        <h3 className="title title_vbg">
                            Клавиатуры для продуктивности
                        </h3>
                        <p className="desc">
                            Широкий выбор клавиатур для работы и игр
                        </p>
                        <div className="mosaic-card__container">
                            <Button colorButton="purpule" sizeButton="bg" linkButton="#">Еще</Button>
                            <Button colorButton="purpule-border" sizeButton="bg" linkButton="#">Купить</Button>
                        </div>
                        <img src={keboard} alt="keboard"></img>
                    </div>
                </div>
                <div className="mosaic__conteiner">
                    <div className="mosaic__card mosaic__card_top mosaic-card_white">
                        <h3 className="title title_vbg">
                            Погрузитесь в игровые миры
                        </h3>
                        <p className="desc">
                            Высокотехнологичные джойстики для невероятных игровых ощущений.
                        </p>
                        <div className="mosaic-card__container">
                            <Button colorButton="purpule" sizeButton="bg" linkButton="#">Еще</Button>
                            <Button colorButton="purpule-border" sizeButton="bg" linkButton="#">Купить</Button>
                        </div>
                        <img src={gamepad} alt="gamepad"></img>
                    </div>
                    <div className="mosaic__card mosaic__card_top mosaic-card_white">
                        <h3 className="title title_vbg">
                            Звук, который вас вдохновляет
                        </h3>
                        <p className="desc">
                            Откройте для себя новые грани звука с нашей коллекцией премиальных наушников.
                        </p>
                        <div className="mosaic-card__container">
                            <Button colorButton="purpule" sizeButton="bg" linkButton="#">Еще</Button>
                            <Button colorButton="purpule-border" sizeButton="bg" linkButton="#">Купить</Button>
                        </div>
                        <img src={headphone} alt="headphone"></img>
                    </div>
                </div>
            </div>
    </div>
    )
}

export default Mosaic