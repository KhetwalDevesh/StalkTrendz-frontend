import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./css/index.css";
import Scrollbar from "smooth-scrollbar";
import OverscrollPlugin from "smooth-scrollbar/plugins/overscroll";

var options = {
  damping: 0.05,
  alwaysShowTracks: true,
};
var overscrollOptions = {
  enable: true,
  effect: "bounce",
  damping: 0.2,
};
// var Scrollbar = window.Scrollbar;
Scrollbar.init(document.querySelector("#scrollbar"), options);
Scrollbar.use(OverscrollPlugin);
Scrollbar.init(document.querySelector("#scrollbar"), {
  plugins: {
    overscroll: overscrollOptions | false,
  },
});

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
