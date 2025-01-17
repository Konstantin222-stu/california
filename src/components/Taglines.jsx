import React from "react";
import laptop from "../img/laptop-taglines.png"
import phone from "../img/phone-taglines.png"
import table from "../img/table-taglines.png"
import watch from "../img/watch-taglines.png"
const Taglines = () => {
    return(
    <div className="taglines">
        <div className="taglines__content wrap">
            <h2 className="title title_bg">
                Откройте для себя мир высоких технологий
            </h2>
            <div className="taglines__cards">
                <div className="taglines__card-1">
                    <div className="taglines-card__img">
                        <img src={laptop} alt=""></img>
                    </div>
                    <div className="taglines-card__info">
                        <p className="sub">
                            Laptops
                        </p>
                        <h3 className="title title_md">
                            True Laptop Solution
                        </h3>
                    </div>
                </div>
                <div className="taglines__card-3">
                    <div className="taglines-card__img">
                        <img src={phone} alt=""></img>
                    </div>
                    <div className="taglines-card__info">
                        <p className="sub">
                            Phones
                        </p>
                        <h3 className="title title_md">
                            Your day to day life
                        </h3>
                    </div>
                </div>
                <div className="taglines__card-4">
                    <div className="taglines-card__info">
                        <p className="sub">
                            Tablet
                        </p>
                        <h3 className="title title_md">
                            Empower your work
                        </h3>
                    </div>
                    <div className="taglines-card__img">
                        <img src={table} alt=""></img>
                    </div>
                </div>
                <div className="taglines__card-2">
                    <div className="taglines-card__info">
                        <p className="sub">
                            Watch
                        </p>
                        <h3 className="title title_md">
                            Not just stylisht
                        </h3>
                    </div>
                    <div className="taglines-card__img">
                        <img src={watch} alt=""></img>
                    </div>
                </div>
            </div>
        </div>
    </div>
    )
}

export default Taglines