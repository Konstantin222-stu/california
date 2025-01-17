import React, { useState, useEffect } from "react";
import videoBg from "../img/headphone.mp4";
import arrow from "../img/arrow-video.svg"
import Button from "./ui/Button/Button";

const Video = ({link_video, id_device}) => {
    console.log(link_video);
    
    const [device, setDevice] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`http://localhost:3001/device/${id_device}?limit=1`);
                const data = await response.json();
                setDevice(data);
                setIsLoading(false);
            } catch (error) {
                console.error(error);
                setIsLoading(false);
            }
        };

        fetchData();
    }, [id_device]);

    if (isLoading) {
        return <div>Загрузка...</div>;
    }

    if (!device) {
        return null; // Не рендерить компонент, если данные не загрузились
    }

    console.log();

    return (
        <div className="video">
            <video className="video__background" autoPlay loop muted>
                <source src={device[0].link_video} type="video/mp4" />
                Your browser does not support the video tag.
            </video>
            <div className="video__content">
                <h2 className="title title_lg title_white">
                    {device[0].name}
                </h2>
                <h3 className="title title_md title_white">
                    {device[0].description}
                </h3>
                <p className="sub sub_white">
                    {device[0].price}
                </p>
                <div className="video__container">
                    <Button colorButton={"white"} sizeButton={"md"} linkButton={"#"}>Купить</Button>
                    <Button colorButton={"link-white"} linkButton={"#"}>Еще<img src={arrow} alt=""/></Button>
                </div>
            </div>
        </div>
    )
}

export default Video
