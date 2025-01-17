import React from "react";
import Slider from "../components/Slider";
import Taglines from "../components/Taglines";
import Popular from "../components/Popular";
import Mosaic from "../components/Mosaic";
import Look from "../components/Look";
import phone from "../img/phone-subscription.png"


const Main = () =>{

    
    return(
        <div className="">
            <div className="hero">
                <div className="hero__content wrap">
                    <Slider />
                </div>
            </div>
             <Taglines/>
             <Popular/>
             <Mosaic/>
             <Look/>
             <div className="subscription">
                <div className="subscription__content wrap">
                    <div className="subscription__info">
                        <h2 className="title title_bg">
                            Never miss a thing
                        </h2>
                        <p className="desc desc_lg">
                            Sign up for texts to be notified about our best offers on the perfect gifts.
                        </p>
                        <form action="" method="post">
                            <input className="subscription__search" type="text" name="" id="" placeholder="Your email"></input>
                            <input className="subscription__button" type="submit" value="Sign up"></input>
                        </form>
                    </div>
                    <div className="subscription__img">
                        <img src={phone} alt="phone"></img>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Main