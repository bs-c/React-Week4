import { createHashRouter } from "react-router-dom";

import Home from "./views/front/Home";
import Product from "./views/front/Products";
import Cart from "./views/front/Cart";
import SingleProduct from "./views/front/SingleProduct";

import Navbar from "./layout/Navbar";

export const router = createHashRouter([
  {
    path: "/",
    element: <Navbar />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "product",
        element: <Product />,
      },
      {
        path: "product/:id",
        element: <SingleProduct />,
      },
      {
        path: "cart",
        element: <Cart />,
      },
    ],
  },
]);
