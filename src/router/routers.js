import Basket from "../page/Basket";
import Goods from "../page/Goods";
import Main from "../page/Main";
import Product from "../page/Product";

export const routers = [
    {
      path: "/main",
      component: Main,
    },
    {
      path: "/goods/:category",
      component: Goods,
    },
    {
      path: "/basket",
      component: Basket,
    },
    {
        path: "/product/:id",
        // path: "/product",
        component: Product,
      },
  ];