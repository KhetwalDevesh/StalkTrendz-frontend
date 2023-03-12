import React from "react";
import { baseURL } from "./Shop";
import axios from "axios";
import useStore from "../store";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
const Shipping = ({ cartItems }) => {
  const navigate = useNavigate();
  const { serverCartItems, user, addClientSecret } = useStore();
  const { register, handleSubmit, getValues } = useForm();
  const onSubmit = handleSubmit((data) => {
    proceedToCheckout();
  });
  const proceedToCheckout = async () => {
    try {
      const { address, mobile, city, pincode, state, country } = getValues();
      const orderItem = {
        orderItems: serverCartItems,
        user: {
          name: user.username,
          email: user.email,
        },
        deliveryAddress: {
          address: address,
          pincode: pincode,
          mobile: mobile,
          city: city,
          state: state,
          country: country,
        },
        orderStatus: "pending",
      };

      const response = await axios.post(`${baseURL}/orders`, {
        ...orderItem,
      });
      if (response.data.clientSecret) {
        addClientSecret(response.data.clientSecret);
        navigate("/payment", { state: { orderResponse: response.data } });
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="flex flex-col justify-center items-center h-screen gap-8 bg-[#fff1e5]">
      <div className="text-4xl mt-8">Shipping</div>
      <form className="address-form flex flex-col gap-4 border-2 border-black p-9 w-[600px] bg-white rounded-md">
        <span>Address</span>
        <input
          type="text"
          className="border-[1px] border-solid border-black rounded-xl p-2 outline-0"
          {...register("address")}
        ></input>
        <span>Mobile number</span>
        <input
          type="number"
          className="border-[1px] border-solid border-black rounded-xl p-2 outline-0"
          {...register("mobile")}
        ></input>
        <span>Town/City</span>
        <input
          type="text"
          className="border-[1px] border-solid border-black rounded-xl p-2 outline-0"
          {...register("city")}
        ></input>
        <span>Pincode</span>
        <input
          type="number"
          className="border-[1px] border-solid border-black rounded-xl p-2 outline-0"
          {...register("pincode")}
        ></input>
        <span>State</span>
        <input
          type="text"
          className="border-[1px] border-solid border-black rounded-xl p-2 outline-0"
          {...register("state")}
        ></input>
        <span>Country</span>
        <input
          type="text"
          className="border-[1px] border-solid border-black rounded-xl p-2 outline-0"
          {...register("country")}
        ></input>
        <div className="flex justify-center">
          <button
            onClick={onSubmit}
            className="bg-orange-900 rounded-md text-white p-2 w-2/4 items-center"
          >
            Continue
          </button>
        </div>
      </form>
    </div>
  );
};

export default Shipping;
