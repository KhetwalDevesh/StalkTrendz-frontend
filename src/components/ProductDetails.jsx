import React, { useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useEffect } from "react";
import { baseURL } from "./Shop";
import "../css/index.css";
// import '../fonts/ClashDisplay-Bold.woff2';
// import '../fonts/ClashDisplay-Regular.woff2';
import "../css/main.css";
import useStore from "../store";
import { Link } from "react-router-dom";
import getParamFromURL from "../../utils/getParamFromURL";
const ProductDetails = () => {
  const {
    cartItems,
    addItemToCart,
    removeItemFromCart,
    lastParamInURL,
    setLastParamInURL,
    loginStatus,
    user,
    totalItemsInCart,
    setTotalItemsInCart,
  } = useStore();
  const [productDetail, setProductDetail] = useState();

  // setting lastParamInURL
  const params = useParams();

  // get all the params of the URL
  const getParamsPartOfURL = () => {
    const currentURL = window.location.href;
    console.log(currentURL);
    const urlParts = currentURL.split("/");

    let paramVar = "/";
    for (let i = 3; i < urlParts.length; i++) {
      paramVar += `${urlParts[i]}/`;
    }
    setLastParamInURL({ param: paramVar });
    console.log(paramVar);
    console.log(lastParamInURL);
  };

  const addProductToCartLocal = () => {
    let promise = new Promise(function (resolve, reject) {
      addItemToCart({ item: productDetail });
    });
    console.log("cartItems", JSON.stringify(cartItems, null, 2));
    let localTotalItemsInClientCart = 0;
    cartItems.map((item) => {
      localTotalItemsInClientCart += item.quantity;
    });
    setTotalItemsInCart({ allQuantity: localTotalItemsInClientCart });
    console.log(
      "localTotalItemsInClientCart",
      JSON.stringify(localTotalItemsInClientCart, null, 2)
    );
    console.log("totalItemsInCart", JSON.stringify(totalItemsInCart, null, 2));
  };

  // add product to backend inside loggedIn user's cart
  const addProductToServerCart = async () => {
    const response = await axios({
      method: "post",
      url: `${baseURL}/cart/`,
      data: {
        _id: productDetail._id,
        quantity: 1,
      },
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    });
    console.log(
      "response.items.length",
      JSON.stringify(response.data.items.length, null, 2)
    );
    let totalCountOfItems = 0;
    response.data.items.map((item) => {
      totalCountOfItems += item.quantity;
    });
    setTotalItemsInCart({ allQuantity: totalCountOfItems });
    // console.log("response", JSON.stringify(response, null, 2));
  };

  console.log("productDetail", JSON.stringify(productDetail, null, 2));

  useEffect(() => {
    const getProductDetails = async () => {
      try {
        console.log(baseURL);
        console.log(params.id);
        console.log(`${baseURL} / ${params.id}`);
        const productData = await axios.get(`${baseURL}/products/${params.id}`);
        console.log(productData.data.data);
        setProductDetail(productData.data.data);
      } catch (error) {
        console.log(error);
      }
    };
    getProductDetails();
  }, [params.id]);

  useEffect(() => {
    getParamsPartOfURL();
  }, []);

  // console.log(productDetail);
  console.log(cartItems);
  if (productDetail === undefined) return <div>Loading...</div>;
  return (
    <div className="bg-[#fff1e5]">
      <div className="mdlg:px-32 flex p-44 h-[100vh]">
        <img
          src={productDetail.image}
          className="mdlg:w-[280px] lg:w-[340px] lg:h-[440px] w-[500px] h-[600px] border-4 border-black"
        />
        <div className="flex flex-col p-8 space-y-8">
          <div className="lg:text-3xl flex space-x-4 text-4xl uppercase">
            <span>{productDetail.name}</span>
            <span>-</span>
            <span>{productDetail.brand}</span>
          </div>
          <div className="flex space-x-10">
            <span className="lg:text-xl text-2xl">
              Rs.{productDetail.price}
            </span>
          </div>
          <button
            onClick={
              loginStatus ? addProductToServerCart : addProductToCartLocal
            }
            className="w-60 h-16 border-2  bg-black text-white text-lg rounded-full"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
