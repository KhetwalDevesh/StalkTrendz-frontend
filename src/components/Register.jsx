import React from "react";
import { Link } from "react-router-dom";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Login from "./Login";
import useStore from "../store";
import { baseURL } from "./Shop";

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { lastParamInURL } = useStore();
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = { username, email, password };
      const response = await axios({
        method: "post",
        url: `${baseURL}/users/register`,
        data,
      });
      if (response.statusText === "Created") {
        navigate("/login");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className=" pt-28 bg-[#fff1e5] flex justify-center items-center h-screen  ">
      <div className="login-form bg-white border-2 border-black p-9 rounded-md">
        <form
          action=""
          onSubmit={(e) => {
            handleSubmit(e);
          }}
        >
          <div className="flex flex-col gap-2">
            <span>Username</span>
            <input
              className="border-[1px] border-solid border-black rounded-xl p-2 outline-0"
              type="text"
              onChange={(e) => {
                setUsername(e.target.value);
              }}
            />
            <span>Email</span>
            <input
              className="border-[1px] border-solid border-black rounded-xl p-2 outline-0"
              type="email"
              onChange={(e) => {
                setEmail(e.target.value);
              }}
            />
            <span>Password</span>
            <input
              className="border-[1px] border-solid border-black rounded-xl p-2 outline-0"
              type="password"
              onChange={(e) => {
                setPassword(e.target.value);
              }}
            />
            <div className="flex justify-center mt-8">
              <button className="bg-orange-900 rounded-md text-white p-2 w-2/4 items-center">
                Register
              </button>
            </div>
            <div>
              <span>Already have an account? </span>
              <Link className="text-orange-900 underline" to="/login">
                Login
              </Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
