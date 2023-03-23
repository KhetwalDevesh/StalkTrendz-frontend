import React, { useEffect, useRef, useState } from "react";
import { baseURL } from "./Shop";
import axios from "axios";
import useStore from "../store";
import Shipping from "./Shipping";
import { Navigate, useNavigate } from "react-router-dom";
import { toast, Toaster } from "react-hot-toast";

let renderCount = 0;
const ServerCart = () => {
	const {
		user,
		totalItemsInCart,
		setTotalItemsInCart,
		serverCartItems,
		setServerCartItems,
	} = useStore();

	const navigate = useNavigate();

	let localTotalItemsInServerCart = 0;
	let subTotal = 0;

	// proceed to checkout function
	const proceedToCheckout = async () => {
		try {
			// const checkoutSession = await axios({
			//   method: "post",
			//   url: `${baseURL}/checkout/stripeCheckout/`,
			//   data: { serverCartItems },
			// });
			// console.log(
			//   "checkoutSession.url",
			//   JSON.stringify(checkoutSession.data.url, null, 2)
			// );
			// if (checkoutSession.data.url) {
			//   window.location.assign(checkoutSession.data.url);
			// }
			// <Shipping cartItems={serverCartItems} />;
			navigate("/shipping");
		} catch (error) {
			console.log(error);
		}
	};

	// get server cart items function
	const getServerCartItems = async () => {
		const userCart = await axios({
			method: "get",
			url: `${baseURL}/cart`,
			headers: {
				Authorization: `Bearer ${user.token}`,
			},
		});
		// console.log("userCart", JSON.stringify(userCart, null, 2));
		const userCartData = userCart.data;

		const allCartItems = await Promise.all(
			userCartData.items.map(async (currentItem) => {
				let _updatedItem = {};
				const getItemData = async () => {
					try {
						localTotalItemsInServerCart += currentItem.quantity;
						const productDetailOfCurrentItem = await axios({
							method: "get",
							url: `${baseURL}/products/${currentItem.product}`,
						});

						const cartItem = {
							...productDetailOfCurrentItem.data.data,
							quantity: currentItem.quantity,
						};
						_updatedItem = cartItem;
					} catch (error) {
						console.log("error in getItemData", error);
						throw error;
					}
				};
				await getItemData();

				return _updatedItem;
			})
		);
		setTotalItemsInCart({ allQuantity: localTotalItemsInServerCart });
		setServerCartItems({ allCartItems: allCartItems });
	};

	const decreaseQuantityOfItemInServerCart = async ({ item }) => {
		try {
			const response = await axios({
				method: "put",
				url: `${baseURL}/cart/decrease/`,
				data: item,
				headers: {
					Authorization: `Bearer ${user.token}`,
				},
			});
			// if (response.data.quantity == 0) {
			//   removeItemFromServerCart({ item });
			// }
			getServerCartItems();
		} catch (error) {}
	};

	const increaseQuantityOfItemInServerCart = async ({ item }) => {
		try {
			const response = await axios({
				method: "put",
				url: `${baseURL}/cart/increase/`,
				data: item,
				headers: {
					Authorization: `Bearer ${user.token}`,
				},
			});
			getServerCartItems();
		} catch (error) {
			console.log(error);
		}
	};

	const removeItemFromServerCart = async ({ item }) => {
		try {
			const response = await axios({
				method: "put",
				url: `${baseURL}/cart/remove/`,
				data: item,
				headers: {
					Authorization: `Bearer ${user.token}`,
				},
			});

			getServerCartItems();
			toast.success("Item removed from Cart");
		} catch (error) {
			console.log(error);
		}
	};

	useEffect(() => {
		getServerCartItems();
		return () => {};
	}, []);

	renderCount++;
	return (
		<div className="bg-[#fff1e5] pt-20 min-h-screen ">
			<Toaster />
			<div className="p-10 ">
				{serverCartItems.map((item) => {
					// console.log(cartItems);
					subTotal += item.quantity * item.price;
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
										onClick={() =>
											decreaseQuantityOfItemInServerCart({ item: item })
										}
										className="xl:w-16 w-6 mdlg:w-5 mdlg:h-5 flex items-center justify-center bg-slate-700 text-white rounded-full">
										-
									</button>
									<span className="xl:text-[15px] xl:w-[300px] mdlg:p-2 mdlg:w-[120px] mdlg:text-[12px] p-3 m-1 bg-indigo-900 text-white rounded-full flex justify-center">
										<span>Quantity ({item.quantity})</span>
									</span>
									<button
										onClick={() => {
											increaseQuantityOfItemInServerCart({ item: item });
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
										xmlns="http://www.w3.org/2000/svg"
										fill="none"
										viewBox="0 0 24 24"
										strokeWidth={1.5}
										stroke="currentColor"
										className="w-6 h-6 cursor-pointer"
										onClick={() => removeItemFromServerCart({ item: item })}>
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
				<div className="m-auto p-7 xl:text-2xl  flex flex-col gap-6 justify-center items-center text-4xl space-x-5">
					<span>Subtotal : ₹{subTotal}</span>
					<button
						onClick={() => {
							proceedToCheckout();
						}}
						className="p-5 border-2 xl:p-3 xl:text-lg border-blue-500 bg-black text-2xl text-white rounded-full active:translate-y-2 hover:shadow-2xl">
						Proceed to Checkout 🡆
					</button>
				</div>
			</div>
		</div>
	);
};

export default ServerCart;

// import React, { useEffect, useRef, useState } from 'react'
// import { baseURL } from './Shop'
// import axios from 'axios';
// import useStore from '../store';
// const ServerCart = () => {
//     const { user } = useStore();
//     const [serverCartItems,setServerCartItems] = useState([]);
//     const serverCartItemsContainer = useRef([]);
//     let serverCartItemsArray = [];
//     const getServerCartItems = async () =>{
//             const userCart = await axios(
//                 {
//                     method : "get",
//                     url : `${baseURL}/cart`,
//                     headers : {
//                         'Authorization' : `Bearer ${user.token}`
//                     }
//                 }
//             );
//             const userCartData = [...userCart.data];
//             console.log('userCart', JSON.stringify(userCartData[0].items, null, 2))
//             const allCartItems = userCartData[0].items.map( async (currentItem) => {
//                 const productDetailOfCurrentItem = await axios(
//                     {
//                         method : "get",
//                         url : `${baseURL}/products/${currentItem.product}`,
//                     }
//                 );
//                 console.log(`${baseURL}/products/${currentItem.product}`)
//                 console.log('productDetailOfCurrentItem', JSON.stringify(productDetailOfCurrentItem.data.data, null, 2))
//                 const cartItem = {
//                     ...productDetailOfCurrentItem.data.data,
//                     quantity : currentItem.quantity
//                 }
//                 console.log('cartItem', JSON.stringify(cartItem, null, 2))
//                 // setServerCartItems(serverCartItems => [...serverCartItems,cartItem]);
//                 serverCartItemsContainer.current = [...serverCartItemsContainer.current,cartItem];
//                 // serverCartItemsArray.push(cartItem);
//                return cartItem;
//             });

//             console.log('serverCartItemsContainer.current', JSON.stringify(serverCartItemsContainer.current, null, 2))
//             setServerCartItems(serverCartItemsContainer.current);
//             console.log('allCartItems', JSON.stringify(allCartItems, null, 2))
//             // setServerCartItems(allCartItems);
//             // console.log('serverCartItemsArray', JSON.stringify(serverCartItemsArray, null, 2))
//     }

//     useEffect(()=>{
//         getServerCartItems();
//     },[]);

//   return (
//     <div>{console.log('serverCartItems', JSON.stringify(serverCartItems, null, 2))}</div>
//   )
// }

// export default ServerCart
