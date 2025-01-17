import React from "react";
import "../styles/hero.css"
import { Splide, SplideSlide } from '@splidejs/react-splide';
import '@splidejs/splide/dist/css/splide.min.css';
import headphone from "../img/headphone-hero.png"
import phone from "../img/phone-hero.png"
import  laptop from "../img/laptop-hero.png"
import Button from "./ui/Button/Button";

const Slider = () => {
  return (
    <Splide options={{ type: 'loop', speed: 2000, autoplay: true,}}>
      <SplideSlide>
        <div className="slider__left">
          <div className="slider__info">
            <h1 className="title title_lg">
              Технологии для вашей жизни.
            </h1>
            <p className="desc desc_lg">
              Широкий выбор современной техники от ведущих брендов. Все, что нужно для работы, развлечений и повседневных задач.
            </p>
            <Button linkButton={"#"} colorButton={"black"} sizeButton={"bg"}>Выбрать</Button>
          </div>
          <div className="slider__img">
            <img src={phone} alt=""></img>
          </div>
        </div>
      </SplideSlide>
      <SplideSlide>
        <div className="slider__right">
            <div className="slider__img">
                <img src={headphone} alt=""/>
            </div>
            <div className="slider__info">
                <h1 className="title title_lg">
                    Качество, проверенное временем
                </h1>
                <p className="desc desc_lg">
                    Мы тщательно отбираем только надежные и высококачественные устройства. Доверьтесь нашему опыту и получите максимальное удовольствие от использования техники.
                </p>
                <Button linkButton={"#"} colorButton={"black"} sizeButton={"bg"}>Выбрать</Button>
            </div>
        </div>
      </SplideSlide>
      <SplideSlide>
        <div className="slider__left">
            <div className="slider__info">
                <h1 className="title title_lg">
                    Покупки в пару кликов
                </h1>
                <p className="desc desc_lg">
                    Интуитивно понятный интернет-магазин позволяет быстро и легко найти и приобрести необходимую технику. Оформляйте заказы с комфортом.
                </p>
                <Button linkButton={"#"} colorButton={"black"} sizeButton={"bg"}>Выбрать</Button>
            </div>
            <div className="slider__img">
                <img src={laptop} alt=""/>
            </div>
        </div>
      </SplideSlide>
    </Splide>
  );
};

export default Slider;
