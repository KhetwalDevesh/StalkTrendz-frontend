import React from "react";
import { Link } from "react-router-dom";
import useStore from "../store";
const Header = () => {
  let cartQuantity = 0;
  const {
    cartItems,
    addItemToCart,
    loginStatus,
    setLoginStatus,
    user,
    setUser,
    totalItemsInCart,
    setTotalItemsInCart,
  } = useStore();
  console.log(`header : ${cartItems}`);
  const countAllCartItems = () => {
    if (loginStatus == true) {
      cartQuantity = totalItemsInCart;
    } else {
      cartItems.map((cartItem) => {
        cartQuantity += cartItem.quantity;
      });
    }
  };
  countAllCartItems();
  console.log(user.username);
  console.log("totalItemsInCart", JSON.stringify(totalItemsInCart, null, 2));

  // handle Logout function
  const handleLogout = () => {
    setLoginStatus({ currentStatus: false });
    setUser({ userData: {} });
    setTotalItemsInCart({ allQuantity: 0 });
  };

  return (
    <div className=" flex items-center justify-between p-12 w-full h-20  bg-[#fff1e5] fixed">
      <Link to="/">
        <div className=" font-bold text-4xl ">Stalktrendz</div>
      </Link>
      <div className=" flex space-x-20  text-xl uppercase">
        <span>Contact</span>
        {loginStatus ? (
          <>
            <span>{user.username}</span>
            <button
              onClick={() => {
                handleLogout();
              }}
            >
              Logout
            </button>
          </>
        ) : (
          <Link to="/login">
            <span>Login</span>
          </Link>
        )}

        <Link to="/cart">
          <span>Cart ({cartQuantity})</span>
        </Link>
      </div>
    </div>
  );
};

export default Header;
