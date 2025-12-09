import { Link, Routes, Route } from "react-router-dom";
import AdminProductsPage from "./admin/ProductsPage";
import AddProductPage from "./admin/addProductPage";
import EditProductPage from "./admin/editProductsPage";
import { useLocation } from "react-router-dom";
import AdminOrdersPage from "./admin/adminOrdersPage";
import { useEffect } from "react";
import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import Loading from "../components/loading";
import AdminUsersPage from "./admin/usersPage";
import EditUserPage from "./admin/editUserPage";

export default function AdminPage() {
  const location = useLocation();
  const path = location.pathname;
  const [status, setStatus] = useState("Loading");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setStatus("Not Authenticated");
      window.location.href = "/login";
      return;
    } else {
      axios
        .get(import.meta.env.VITE_BACKEND_URL + "/api/users/", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          if (response.data.role !== "admin") {
            setStatus("Not Authorized");
            toast.error("You are not authorized to access this page");
            window.location.href = "/";
          } else {
            setStatus("Authorized");
          }
        })
        .catch((error) => {
          console.error(error);
          setStatus("Not Authenticated");
          toast.error("Please login to continue");
          window.location.href = "/login";
        });
    }
  }, []);

  function getClass(name) {
    if (path.includes(name)) {
      return "bg-accent text-pink-500 block p-4";
    } else {
      return "text-accent block p-4";
    }
  }

  return (
    <div className=" w-full h-screen flex ">
      {status === "Loading" ||
      status === "Not Authenticated" ||
      status === "Not Authorized" ? (
        <Loading />
      ) : (
        <>
          <div className="h-full w-[300px] bg-white ">
            <Link className={getClass("users")} to="/admin/users">
              Users
            </Link>
            <Link className={getClass("products")} to="/admin/products">
              Products
            </Link>
            <Link to="/admin/orders" className={getClass("orders")}>
              Orders
            </Link>
            <Link to="/admin/reviews" className={getClass("reviews")}>
              Reviews
            </Link>
            <Link to="/" className={getClass("home")}>
              Go to shop
            </Link>
          </div>
          <div className="h-full w-[calc(100%-300px)] border-accent  border-l-2 p-4 overflow-y-auto relative">
            <Routes>
              <Route path="/*">
                <Route path="products" element={<AdminProductsPage />} />
                <Route path="users" element={<AdminUsersPage />} />
                <Route path="orders" element={<AdminOrdersPage />} />
                <Route path="reviews" element={<h1>Reviews</h1>} />
                <Route path="add-product" element={<AddProductPage />} />
                <Route path="edit-product" element={<EditProductPage />} />
                <Route path="edit-user" element={<EditUserPage />} />
              </Route>
            </Routes>
          </div>
        </>
      )}
    </div>
  );
}
