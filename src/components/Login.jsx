import React from "react";
import { Link } from "react-router-dom";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import useStore from "../store";
import { baseURL } from "./Shop";
const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const {
    lastParamInURL,
    loginStatus,
    setLoginStatus,
    user,
    setUser,
    cartItems,
    clearClientCartItems,
    setTotalItemsInCart,
  } = useStore();
  let localTotalItemsInServerCart = 0;
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = { email, password };
      console.log("data", JSON.stringify(data, null, 2));
      const loginResponse = await axios({
        method: "post",
        url: `${baseURL}/users/login`,
        data,
      });
      console.log("loginResponse", JSON.stringify(loginResponse, null, 2));
      if (loginResponse.statusText === "OK") {
        setLoginStatus({ currentStatus: true });
        setUser({ userData: loginResponse.data });

        const addedCartItems = await Promise.all(
          cartItems.map(async (clientCartItem) => {
            console.log(
              "clientCartItem",
              JSON.stringify(clientCartItem, null, 2)
            );
            localTotalItemsInServerCart += clientCartItem.quantity;
            const addClientCartToServerCartResponse = await axios({
              method: "post",
              url: `${baseURL}/cart/`,
              data: {
                _id: clientCartItem._id,
                quantity: clientCartItem.quantity,
              },
              headers: {
                Authorization: `Bearer ${loginResponse.data.token}`,
              },
            });
          })
        );

        clearClientCartItems();
        setTotalItemsInCart({ allQuantity: localTotalItemsInServerCart });
        console.log("user", JSON.stringify(user, null, 2));

        navigate(lastParamInURL);
      }
    } catch (error) {
      console.log(error);
    }
  };
  console.log("lastParamInURL", JSON.stringify(lastParamInURL, null, 2));
  return (
    <div className=" pt-28 bg-[#fff1e5] flex justify-center items-center h-screen">
      <div className="login-form bg-white border-2 border-black p-9 rounded-md">
        <form action="" onSubmit={(e) => handleSubmit(e)}>
          <div className="flex flex-col gap-2">
            <span>Email</span>
            <input
              className="border-[1px] border-solid border-black rounded-xl p-2 outline-0"
              value={email}
              type="text"
              name="email"
              onChange={(e) => {
                setEmail(e.target.value);
              }}
            />
            <span>Password</span>
            <input
              className="border-[1px] border-solid border-black rounded-xl p-2 outline-0"
              value={password}
              type="password"
              name="password"
              onChange={(e) => {
                setPassword(e.target.value);
              }}
            />
            <div className="flex justify-center mt-8">
              <button
                className="bg-orange-900 rounded-md text-white p-2 w-2/4 items-center"
                type="submit"
              >
                Login
              </button>
            </div>
            <div>
              <span>Don't have an account? </span>
              <Link className="text-orange-900 underline" to="/register">
                Create one
              </Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
