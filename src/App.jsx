import React from "react";
import shop from "./components/Shop";
import { Routes, Route } from "react-router-dom";
import Shop from "./components/Shop";
import Header from "./components/Header";
import "./css/index.css";
import ProductDetails from "./components/ProductDetails";
import Cart from "./components/Cart";
import Login from "./components/Login";
import Register from "./components/Register";
import useStore from "./store";
import ServerCart from "./components/ServerCart";
import Success from "./components/Success";
import Cancel from "./components/Cancel";
import Shipping from "./components/Shipping";
import CustomCursor from "./components/CustomCursor";
import Payment from "./components/Payment";
const App = () => {
  const { loginStatus } = useStore();
  // rounded cursor
  // var cursor = document.getElementById("cursor");
  // document.addEventListener("mousemove", function (e) {
  //   var x = e.clientX;
  //   var y = e.clientY;
  //   cursor.style.left = x + "px";
  //   cursor.style.top = y + "px";
  // });
  return (
    <div className="app-body">
      {/* <div id="cursor"></div> */}
      {/* <CustomCursor /> */}
      <Header />
      <Routes>
        <Route path="/" element={<Shop />} />
        <Route path="/products/:id" element={<ProductDetails />} />
        <Route path="/cart" element={loginStatus ? <ServerCart /> : <Cart />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/shipping" element={<Shipping />} />
        <Route path="/success" element={<Success />} />
        <Route path="/cancel" element={<Cancel />} />
        <Route path="/payment" element={<Payment />} />
      </Routes>
    </div>
  );
};

export default App;
