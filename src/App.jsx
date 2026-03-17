import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./components/Home";
import Navbar from "./components/Navbar";
import Login from "./Pages/Login";
import Register from "./Pages/Register";
import Categories from "./Pages/Categories";
import Products from "./Pages/Products";
import Cart from "./Pages/CartPage";

import ProfilePage from "./Pages/ProfilePage";
import AdminDashboard from "./Pages/AdminDashboard";
import Wishlist from "./Pages/Wishlist";
import UserOrdersPage from "./Pages/UserOrdersPage";
import TrackOrderPage from "./Pages/TrackOrderPage";


const App = () => {
  return (
    <BrowserRouter>
      <div className='"app"'>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />}></Route>
          <Route path="/login" element={<Login />}></Route>
          <Route path="/categories" element={<Categories />} />
          <Route path="/products" element={<Products />} />
          <Route path="/cart" element={<Cart />} />
          {/* Orders */}
          <Route path="/orders" element={<UserOrdersPage />} />
          <Route path="/track-order/:orderId" element={<TrackOrderPage />} />



          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/adminPanel" element={<AdminDashboard />} />
          <Route path="/wishlist" element={<Wishlist />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
};

export default App;
