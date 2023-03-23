import React from "react";
import { useState, useEffect, CSSProperties } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";
import ProductDetails from "./ProductDetails";
import useStore from "../store";
import { ClipLoader, CircleLoader } from "react-spinners";
export const baseURL = "https://stalktrendz-backend.onrender.com";

// https://innocenti.onrender.com/products
// http://localhost:8080/products
const Shop = () => {
	const [products, setProducts] = useState([]);
	const [loading, setLoading] = useState(false);
	const { lastParamInURL, setLastParamInURL } = useStore();
	const params = useParams();

	// get all the params of the URL
	const getParamsPartOfURL = () => {
		const currentURL = window.location.href;
		const urlParts = currentURL.split("/");

		let paramVar = "";
		for (let i = 3; i < urlParts.length; i++) {
			paramVar += `${urlParts[i]}/`;
		}
		setLastParamInURL({ param: paramVar });
	};

	useEffect(() => {
		async function fetchProducts() {
			try {
				setLoading(true);
				const res = await axios.get(`${baseURL}/products`);
				// console.log(res);
				// console.log(...res.data);
				setLoading(false);
				const productsData = [...res.data];
				//console.log(productsData);
				// setProducts(productsData);
				// console.log(JSON.stringify(productList));
				const updatedProductsData = productsData.map((product) => {
					const newProduct = {
						_id: product._id,
						name: product.name,
						image: product.image,
						brand: product.brand,
						category: product.category,
						countInStock: product.countInStock,
						description: product.description,
						price: product.price,
					};
					//console.log(newProduct);
					return newProduct;
					// setProducts([...products, newProduct]);
				});
				setProducts([...updatedProductsData]);
				// setProducts(productsToBeAdded);
			} catch (error) {
				console.log(error);
			}
		}
		fetchProducts();
		// console.log(JSON.stringify(products));
		getParamsPartOfURL();
	}, []);

	if (loading)
		return (
			<div className="loading flex justify-center items-center w-screen h-screen bg-[#fff1e5]">
				<ClipLoader
					color={"black"}
					loading={loading}
					// cssOverride={override}
					size={130}
					aria-label="Loading Spinner"
					data-testid="loader"
					className="h-[50px] w-[50px]"
				/>
			</div>
		);
	return (
		<div className="mdlg:gap-12 mdlg:px-16 grid grid-cols-3 gap-20 gap-y-24 bg-[#fff1e5] min-h-screen  p-28 items-center overflow-x-hidden">
			{products.map((product) => {
				return (
					<div
						key={product._id}
						className="flex flex-col border-b-4 border-black p-5">
						<Link to={`/products/${product._id}`}>
							<img
								className="product-image xl:h-80 lg:h-60 h-96 w-80 border-4 border-black "
								src={product.image}
								alt=""
							/>
						</Link>
						<br />
						<span>{product.name}</span>
						<span>{product.brand}</span>
						<span>₹{product.price}</span>
					</div>
				);
			})}
		</div>
	);
};

export default Shop;
