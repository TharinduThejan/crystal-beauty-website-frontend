import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { FaEdit, FaTrash } from "react-icons/fa";
import toast from "react-hot-toast";

export default function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoading === true) {
      axios
        .get(import.meta.env.VITE_BACKEND_URL + "/api/products")
        .then((response) => {
          setProducts(response.data);
          console.log(response.data);
          setIsLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching products:", error);
        });
    }
  }, [isLoading]);

  function deleteProduct(productId) {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("You must be logged in to delete a product");
      return;
    }
    axios
      .delete(import.meta.env.VITE_BACKEND_URL + "/api/products/" + productId, {
        headers: {
          Authorization: "Bearer " + token,
        },
      })
      .then(() => {
        toast.success("Product deleted successfully");
        setProducts(products.filter((item) => item.productId !== productId));
      })
      .catch((error) => {
        toast.error("Failed to delete product");
        console.error(error);
      });
  }

  return (
    <div className="w-full h-full max-h-full overflow-y-scroll p-6 font-[Poppins] bg-gray-50">
      {/* Add Product Button */}
      <Link
        to="/admin/add-product"
        className="w-14 h-14 flex items-center justify-center text-3xl absolute bottom-6 right-6 bg-green-600 hover:bg-green-700 transition-all duration-200 shadow-lg rounded-full text-white"
      >
        +
      </Link>

      {isLoading ? (
        // Loading Spinner
        <div className="flex justify-center items-center h-full">
          <div className="w-[70px] h-[70px] border-[6px] border-gray-200 border-t-green-600 rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="bg-white shadow-md rounded-lg overflow-hidden border border-gray-200">
          <table className="w-full text-sm text-gray-700">
            <thead className="bg-gray-100 text-gray-700 uppercase text-sm">
              <tr>
                <th className="py-3 px-4 text-left">Product ID</th>
                <th className="py-3 px-4 text-left">Name</th>
                <th className="py-3 px-4 text-center">Image</th>
                <th className="py-3 px-4 text-right">Labeled Price</th>
                <th className="py-3 px-4 text-center">Stock</th>
                <th className="py-3 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {products.map((item, index) => (
                <tr
                  key={index}
                  className="hover:bg-gray-50 transition duration-150"
                >
                  <td className="py-3 px-4">{item.productId}</td>
                  <td className="py-3 px-4 font-medium">{item.name}</td>
                  <td className="py-3 px-4 text-center">
                    <img
                      src={item.images[0]}
                      className="w-[50px] h-[50px] object-cover rounded-md mx-auto shadow"
                      alt={item.name}
                    />
                  </td>
                  <td className="py-3 px-4 text-right font-semibold text-gray-800">
                    ${item.labeledPrice}
                  </td>
                  <td className="py-3 px-4 text-center">{item.stock}</td>
                  <td className="py-3 px-4">
                    <div className="flex justify-center items-center space-x-4">
                      <FaTrash
                        onClick={() => {
                          deleteProduct(item.productId);
                          setIsLoading(true);
                        }}
                        className="text-red-500 cursor-pointer hover:text-red-700 transition duration-200 text-lg"
                      />
                      <FaEdit
                        onClick={() =>
                          navigate("/admin/edit-product", {
                            state: { product: item },
                          })
                        }
                        className="text-blue-500 cursor-pointer hover:text-blue-700 transition duration-200 text-lg"
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
