import React from "react";
import CardProduct from "./ui/CardProduct";
import useRequest from "../components/hooks/useRequest";
import axios from "axios";

const Popular = ({children, ...props}) =>{
   
    const [device, loading, error] = useRequest(fetchDevice)
    function fetchDevice() {
        return axios.get(`http://localhost:3001/device?limit=4`)
    }

    if(loading){
        return <h1>Идет загрузка...</h1>
    }

    if(error){
        return <h1>Произошла ошибка при загрузке данных</h1>
    }
    
    return(
        <div className="popular">
                <div className="popular__content wrap">
                    <h2 className="title title_bg">
                        {!children ? "Экономьте на наших самых продаваемых товарах.": children}
                    </h2>
                    <div className="popular__cards ">
                        {device && device.map((device)=>(
                                <CardProduct id_device={device.id} titleProduct={device.name} desProduct={device.description} priceProduct={device.price} imageProduct={device.link_image} typeCard ={"column"}/>
                        ))}
                    </div>
                </div>
            </div>
            )
}

export default Popular