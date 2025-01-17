import React from "react";
import Logo from "../ui/Logo"
import link from "../../img/arrow-link.svg"

const Footer = () =>{
    return(
        <footer className="footer">
        <div className="footer__content wrap">
            <div className="footer__about">
                <Logo/>
                <p className="desc desc_lg">
                    Sign up for texts to be notified about our best offers on the perfect gifts.
                </p>
            </div>
            <ul className="footer__list">
                <h3 className="title title_sm">
                    All products
                </h3>
                <li className="footer__item"><a href="#">
                    Phones
                </a></li>
                <li className="footer__item"><a href="#">
                    Watch
                </a></li>
                <li className="footer__item"><a href="#">
                    Tablet
                </a></li>
                <li className="footer__item"><a href="#">
                    Laptops
                </a></li>
            </ul>
            <ul className="footer__list">
                <h3 className="title title_sm">
                    Company
                </h3>
                <li className="footer__item"><a href="#">
                    About
                </a></li>
                <li className="footer__item"><a href="#">
                    Support
                </a></li>
            </ul>
            <ul className="footer__list">
                <h3 className="title title_sm">
                    Support
                </h3>
                <li className="footer__item"><a href="#">
                    Style Guide
                </a></li>
                <li className="footer__item"><a href="#">
                    Licensing
                </a></li>
                <li className="footer__item"><a href="#">
                    Change Log
                </a></li>
                <li className="footer__item"><a href="#">
                    Contact
                </a></li>
            </ul>
            <ul className="footer__list">
                <h3 className="title">
                    Follow Us
                </h3>
                <li className="footer__item"><a href="#">
                    Instagram
                </a></li>
                <li className="footer__item"><a href="#">
                    Facebook
                </a></li>
                <li className="footer__item"><a href="#">
                    LinkedIn
                </a></li>
                <li className="footer__item"><a href="#">
                    Youtube
                </a></li>
            </ul>
        </div>
        <div className="copyright">
        <div className="cooperite__content wrap">
            <div className="made-by">
                <a href="">Made By:<p className="desc">Azwedo</p></a>
                <img src={link} alt="arrow"></img>
            </div>
        </div>
    </div>
    </footer>

    )
}

export default Footer