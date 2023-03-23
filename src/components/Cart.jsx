import React, { useState } from "react";
import useStore from "../store";
import { useParams } from "react-router-dom";
import { useEffect } from "react";
import { toast, Toaster } from "react-hot-toast";

const Cart = () => {
	const {
		cartItems,
		increaseQuantity,
		decreaseQuantity,
		removeItemFromCart,
		lastParamInURL,
		setLastParamInURL,
		setTotalItemsInCart,
		loginStatus,
	} = useStore();
	const [useSubTotal, setUseSubTotal] = useState(0);

	let localTotalItemsInClientCart = 0;
	const getSubTotal = () => {
		let subTotal = 0;
		cartItems.map((cartItem) => {
			localTotalItemsInClientCart += cartItem.quantity;
			subTotal += cartItem.quantity * cartItem.price;
		});
		setTotalItemsInCart({ allQuantity: localTotalItemsInClientCart });
		setUseSubTotal(subTotal);
	};

	const params = useParams();

	// get all the params of the URL
	const getParamsPartOfURL = () => {
		const currentURL = window.location.href;
		const urlParts = currentURL.split("/");

		let paramVar = "/";
		for (let i = 3; i < urlParts.length; i++) {
			paramVar += `${urlParts[i]}/`;
		}
		if (params.id) paramVar += params.id;
		setLastParamInURL({ param: paramVar });
	};

	useEffect(() => {
		getParamsPartOfURL();
		getSubTotal();
	}, [cartItems]);

	return (
		<div className="bg-[#fff1e5] pt-20 min-h-screen ">
			<Toaster />
			<div className="p-10 ">
				{cartItems.map((item) => {
					// console.log(cartItems);
					return (
						<div
							key={item._id}
							className=" space-x-32 p-5  border-b-2 border-gray-700">
							<div className="xl:gap-20 lg:gap-16 mdlg:gap-8 grid grid-cols-5 gap-28">
								<img
									src={item.image}
									alt=""
									className="lg:h-28 lg:w-68 xl:h-40 xl:w-64 mdlg:w-24 h-52 w-52"
								/>
								<div className=" justify-center items-center flex">
									{item.name}
								</div>
								<span className="xl:w-44 flex justify-center items-center">
									<button
										onClick={() => {
											decreaseQuantity({ item: item });
											getSubTotal();
										}}
										className="xl:w-16 w-6 mdlg:w-5 mdlg:h-5 flex items-center justify-center bg-slate-700 text-white rounded-full">
										-
									</button>
									<span className="xl:text-[15px] xl:w-[300px] mdlg:p-2 mdlg:w-[120px] mdlg:text-[12px] p-3 m-1 bg-indigo-900 text-white rounded-full flex justify-center">
										Quantity ({item.quantity})
									</span>
									<button
										onClick={() => {
											increaseQuantity({ item: item });
											getSubTotal();
										}}
										className="xl:w-16 w-6 mdlg:w-5 mdlg:h-5 flex items-center justify-center   bg-slate-700 text-white rounded-full">
										+
									</button>
								</span>
								<div className=" justify-center items-center flex">
									₹{item.quantity * item.price}
								</div>

								{/* <div className="border-2 border-black h-10 w-8"> */}
								{/* <i className=" fa fa-trash  border-2 border-yellow-400 w-6 h-6"></i> */}

								<div className="w-fit flex items-center">
									<svg
										onClick={() => {
											removeItemFromCart({ itemId: item._id });
											getSubTotal();
										}}
										xmlns="http://www.w3.org/2000/svg"
										fill="none"
										viewBox="0 0 24 24"
										strokeWidth={1.5}
										stroke="currentColor"
										className="w-6 h-6 cursor-pointer">
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
										/>
									</svg>
								</div>
							</div>
							{/* </div> */}
						</div>
					);
				})}
				<div className="m-auto p-7  xl:text-2xl  flex flex-col gap-6 justify-center items-center text-4xl space-x-5">
					<span>Subtotal : ₹{useSubTotal}</span>
					<button
						onClick={() => toast.error("Login to buy the products")}
						className="p-5 xl:p-3 xl:text-lg border-2 border-blue-500 bg-black text-2xl text-white rounded-full">
						Proceed to Checkout 🡆
					</button>
				</div>
			</div>
		</div>
	);
};

export default Cart;
