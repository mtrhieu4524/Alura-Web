import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "bootstrap/dist/css/bootstrap.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { Toaster } from "sonner";
import { CssBaseline } from "@mui/material";
import { CartProvider } from "./context/CartContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <>
      <CssBaseline />
      <Toaster richColors position="top-right" />
      <CartProvider>
        <App />
      </CartProvider>
    </>
  </BrowserRouter>
);
