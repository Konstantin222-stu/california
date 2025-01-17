import React from "react"
import styleControllerButton from "./styleControllerButton"

const Button = ({children,props, colorButton,sizeButton,linkButton,onClick}) =>{
    colorButton = styleControllerButton.getColor(colorButton)
    sizeButton = styleControllerButton.getSize(sizeButton)
    const rootClass = ['button',colorButton,sizeButton]
    const handleClick = () => {
        if (onClick) {
            onClick(); // Вызов функции onClick, если она предоставлена
        }
    }
    return(
        <a href={linkButton} className={rootClass.join(' ')} onClick={handleClick}>{children}</a>
    )
}

export default Button