import React from "react";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import useStore from "../store";
import CheckoutForm from "./CheckoutForm";
import { useLocation } from "react-router-dom";
const STRIPE_PUBLISHABLE_KEY =
  "pk_test_51Mg6UGSCB333o0lIZra1AOi4Z2ED7CJHOp9ThNQJjSaBQjm5sLnWv3HXCrNVaAt9Waf947lhmFHxfFnpIeijrrIP002SFfhEao";
const stripePromise = loadStripe(STRIPE_PUBLISHABLE_KEY);
const Payment = () => {
  const location = useLocation();
  const orderDetails = location.state.orderResponse;
  const { clientSecret } = useStore();
  const options = {
    clientSecret,
  };
  return (
    <div className="p-36 border-2 border-black">
      <div className="flex gap-96">
        <div className="flex gap-20">
          <span className="text-xl">
            <b>Delivery Address</b>
          </span>
          <div className="flex flex-col">
            <span>{orderDetails.user.name}</span>
            <span>Mobile : {orderDetails.deliveryAddress.mobile}</span>
            <span>{orderDetails.deliveryAddress.address}</span>
            <span>Pincode : {orderDetails.deliveryAddress.pincode}</span>
            <span>{orderDetails.deliveryAddress.city}</span>
            <span>{orderDetails.deliveryAddress.state}</span>
            <span>{orderDetails.deliveryAddress.country}</span>
          </div>
        </div>
        <div className="flex gap-20 ">
          <span className="text-xl">
            <b>Order Total </b>
          </span>
          <span>₹{orderDetails.orderAmount}</span>
        </div>
      </div>
      <div className="">
        {clientSecret && (
          <Elements options={options} stripe={stripePromise}>
            <CheckoutForm />
          </Elements>
        )}
      </div>
    </div>
  );
};

export default Payment;
