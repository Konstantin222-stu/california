export default class styleControllerButton{
    static getColor(color){
        if(!color){
            return ""
        }
        else{
            return `button_${color}`
        }
    }
    static getSize(size){
        if(!size){
            return ""
        }
        else{
            return `button_${size}`
        }
    }
}