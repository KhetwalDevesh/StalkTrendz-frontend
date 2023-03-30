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
import toast, { Toaster } from "react-hot-toast";
import ClipLoader from "react-spinners/ClipLoader";
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
	const [loading, setLoading] = useState(false);

	// setting lastParamInURL
	const params = useParams();

	// get all the params of the URL
	const getParamsPartOfURL = () => {
		const currentURL = window.location.href;
		const urlParts = currentURL.split("/");

		let paramVar = "/";
		for (let i = 3; i < urlParts.length; i++) {
			paramVar += `${urlParts[i]}/`;
		}
		setLastParamInURL({ param: paramVar });
	};

	const addProductToCartLocal = () => {
		let promise = new Promise(function (resolve, reject) {
			addItemToCart({ item: productDetail });
		});
		let localTotalItemsInClientCart = 0;
		cartItems.map((item) => {
			localTotalItemsInClientCart += item.quantity;
		});
		setTotalItemsInCart({ allQuantity: localTotalItemsInClientCart });
	};

	// add product to backend inside loggedIn user's cart
	const addProductToServerCart = async () => {
		toast.success("Product added to cart");
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
		let totalCountOfItems = 0;
		response.data.items.map((item) => {
			totalCountOfItems += item.quantity;
		});
		setTotalItemsInCart({ allQuantity: totalCountOfItems });
		// console.log("response", JSON.stringify(response, null, 2));
	};

	useEffect(() => {
		const getProductDetails = async () => {
			try {
				setLoading(true);
				const productData = await axios.get(`${baseURL}/products/${params.id}`);
				setLoading(true);
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
	if (productDetail === undefined)
		return (
			<div className="loading flex justify-center items-center w-screen h-screen bg-[#fff1e5]">
				<div className="circle-loader"></div>
			</div>
		);
	return (
		<div className="bg-[#fff1e5] min-h-screen h-[100vh]">
			<Toaster />
			<div className="mdlg:px-28 flex p-44 min-h-screen bg-[#fff1e5]">
				<img
					src={productDetail.image}
					className="mdlg:w-[280px] mdlg:h-[350px] lg:w-[340px] lg:h-[440px] xl:h-[440px] w-[400px] w-[500px] h-[600px] border-4 border-black"
				/>
				<div className="flex flex-col mdlg:py-0 p-12 space-y-8">
					<div className="lg:text-3xl xl:text-[1.8rem] flex space-x-4 text-4xl uppercase">
						<span>{productDetail.name}</span>
						<span>-</span>
						<span>{productDetail.brand}</span>
					</div>
					<div className="xl:text-[1rem]">{productDetail.description}</div>
					<div className="flex space-x-10">
						<span className="lg:text-xl text-2xl">
							Rs.{productDetail.price}
						</span>
					</div>
					<button
						onClick={
							loginStatus ? addProductToServerCart : addProductToCartLocal
						}
						className="w-60 h-16 border-2  bg-black text-white text-lg rounded-full active:translate-y-2 hover:shadow-2xl">
						Add to Cart
					</button>
				</div>
			</div>
		</div>
	);
};

export default ProductDetails;
