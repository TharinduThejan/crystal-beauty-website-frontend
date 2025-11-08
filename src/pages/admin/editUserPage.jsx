import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { Link } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function AdminEditUserPage() {
  const [userId, setUserId] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("user");
  const navigate = useNavigate();
  //   const[loading,setLoading]=useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    // Don't fetch until an ID is provided
    if (!userId) {
      setFetching(false);
      return;
    }
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please login first");
      setFetching(false);
      return;
    }
    setFetching(true);
    axios
      .get(import.meta.env.VITE_BACKEND_URL + "/api/users/all", {
        headers: { Authorization: "Bearer " + token },
      })
      .then((response) => {
        const users = Array.isArray(response.data) ? response.data : [];
        const user = users.find((u) => u._id === userId);
        if (!user) {
          toast.error("User not found");
          return;
        }
        setFirstName(user.firstName || "");
        setLastName(user.lastName || "");
        setEmail(user.email || "");
        setRole(user.role || "customer");
      })
      .catch((error) => {
        console.error("Error fetching user data:", error);
        toast.error("Failed to load user");
      })
      .finally(() => {
        setFetching(false);
      });
  }, [userId]);
  async function EditUser() {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("You must be logged in to edit a user");
      return;
    }

    const user = {
      firstName,
      lastName,
      email,
      role,
    };
    axios
      .put(import.meta.env.VITE_BACKEND_URL + "/api/users/" + userId, user, {
        headers: { Authorization: "Bearer " + token },
      })
      .then(() => {
        toast.success("User edited successfully");
        navigate("/admin/users");
      })
      .catch((err) => {
        toast.error("Failed to edit user");
        console.error(err);
      });
  }
  return (
    <div className="w-full h-full max-h-full flex items-center justify-center bg-gray-100 font-[Poppins] px-4">
      <div className="bg-white shadow-lg rounded-xl w-full max-w-lg p-3 gap-2">
        <h1 className="text-2xl font-semibold text-gray-800 mb-6 mt-1 text-center">
          Edit User
        </h1>
        {/* User ID */}
        <input
          type="text"
          placeholder="User ID (Mongo _id)"
          value={userId}
          onChange={(e) => setUserId(e.target.value.trim())}
          className="w-full border border-gray-300 rounded-lg px-4 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-green-500"
        />
        {/* First Name */}
        <input
          type="text"
          placeholder="First name"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-4 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-green-500"
          disabled={!userId || fetching}
        />
        {/* Last Name */}
        <input
          type="text"
          placeholder="Last name"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-4 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-green-500"
          disabled={!userId || fetching}
        />
        {/* Email */}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-4 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-green-500"
          disabled={!userId || fetching}
        />
        {/* Role */}
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-4 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-green-500"
          disabled={!userId || fetching}
        >
          <option value="user">User</option>
          <option value="customer">Customer</option>
          <option value="admin">Admin</option>
        </select>

        <div className="flex justify-between items-center">
          <button
            onClick={EditUser}
            disabled={!userId || fetching}
            className="w-1/2 bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 text-white py-2 px-4 rounded-lg font-medium mr-2"
          >
            {fetching ? "Loading..." : "Edit User"}
          </button>
          <Link
            to="/admin/users"
            className="w-1/2 text-center bg-red-500 hover:bg-red-600 transition-all duration-200 text-white py-2 px-4 rounded-lg font-medium ml-2"
          >
            Cancel
          </Link>
        </div>
      </div>
    </div>
  );
}
//   const [productId, setProductId] = useState("");
//   const [name, setName] = useState("");
//   const [altNames, setAltNames] = useState([]);
//   const [description, setDescription] = useState("");
//   const [images, setImages] = useState([]);
//   const [labeledPrice, setLabeledPrice] = useState("");
//   const [price, setPrice] = useState("");
//   const [stock, setStock] = useState("");
//   const navigate = useNavigate();

//   async function AddProduct() {
//     const token = localStorage.getItem("token");
//     if (!token) {
//       toast.error("You must be logged in to add a product");
//       return;
//     }
//     if (images.length <= 0) {
//       toast.error("Please select at least one image");
//       return;
//     }
//     const promisesArray = [];
//     for (let i = 0; i < images.length; i++) {
//       promisesArray[i] = mediaUpload(images[i]);
//     }
//     try {
//       const imageUrls = await Promise.all(promisesArray);
//       const product = {
//         productId,
//         name,
//         altNames,
//         description,
//         images: imageUrls,
//         labeledPrice,
//         price,
//         stock,
//         isAvailable: true,
//       };
//       axios
//         .post(import.meta.env.VITE_BACKEND_URL + "/api/products", product, {
//           headers: { Authorization: "Bearer " + token },
//         })
//         .then(() => {
//           toast.success("Product added successfully");
//           navigate("/admin/products");
//         })
//         .catch((err) => {
//           toast.error("Failed to add product");
//           console.error(err);
//         });
//     } catch (error) {
//       console.error(error);
//     }
//   }

//   return (
//     <div className="w-full h-full max-full flex items-center justify-center bg-gray-100 font-[Poppins] px-4">
//       <div className="bg-white shadow-lg rounded-xl w-full max-w-lg p-3 gap-2">
//         <h1 className="text-2xl font-semibold text-gray-800 mb-6 mt-1 text-center">
//           Add New Product
//         </h1>

//         {/* Product ID */}
//         <input
//           type="text"
//           placeholder="Product ID"
//           value={productId}
//           onChange={(e) => setProductId(e.target.value)}
//           className="w-full border border-gray-300 rounded-lg px-4 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-green-500"
//         />

//         {/* Name */}
//         <input
//           type="text"
//           placeholder="Name"
//           value={name}
//           onChange={(e) => setName(e.target.value)}
//           className="w-full border border-gray-300 rounded-lg px-4 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-green-500"
//         />

//         {/* Alternative Names */}
//         <input
//           type="text"
//           placeholder="Alternative Names (comma separated)"
//           value={altNames.join(",")}
//           onChange={(e) => setAltNames(e.target.value.split(","))}
//           className="w-full border border-gray-300 rounded-lg px-4 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-green-500"
//         />

//         {/* Description */}
//         <textarea
//           placeholder="Description"
//           value={description}
//           onChange={(e) => setDescription(e.target.value)}
//           className="w-full border border-gray-300 rounded-lg px-4 py-2 mb-4 h-28 focus:outline-none focus:ring-2 focus:ring-green-500"
//         />

//         {/* Image Upload */}
//         <input
//           type="file"
//           onChange={(e) => setImages(e.target.files)}
//           multiple
//           className="w-full border border-gray-300 rounded-lg px-4 py-2 mb-2 cursor-pointer file:mr-3 file:py-1 file:px-3 file:border-0 file:bg-green-500 file:text-white file:rounded-lg hover:file:bg-green-600"
//         />
//         {images && images.length > 0 && (
//           <div className="mt-2 text-sm text-gray-600">
//             Selected files:{" "}
//             {Array.from(images)
//               .map((file) => file.name)
//               .join(", ")}
//           </div>
//         )}

//         {/* Labeled Price */}
//         <input
//           type="number"
//           placeholder="Labeled Price"
//           value={labeledPrice}
//           onChange={(e) => setLabeledPrice(Number(e.target.value))}
//           className="w-full border border-gray-300 rounded-lg px-4 py-2 mt-4 mb-4 focus:outline-none focus:ring-2 focus:ring-green-500"
//         />

//         {/* Price */}
//         <input
//           type="number"
//           placeholder="Price"
//           value={price}
//           onChange={(e) => setPrice(Number(e.target.value))}
//           className="w-full border border-gray-300 rounded-lg px-4 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-green-500"
//         />

//         {/* Stock */}
//         <input
//           type="number"
//           placeholder="Stock"
//           value={stock}
//           onChange={(e) => setStock(Number(e.target.value))}
//           className="w-full border border-gray-300 rounded-lg px-4 py-2 mb-6 focus:outline-none focus:ring-2 focus:ring-green-500"
//         />

//         {/* Buttons */}
//         <div className="flex justify-between items-center">
//           <button
//             onClick={AddProduct}
//             className="w-1/2 bg-green-600 hover:bg-green-700 transition-all duration-200 text-white py-2 px-4 rounded-lg font-medium mr-2"
//           >
//             Add Product
//           </button>
//           <Link
//             to="/admin/products"
//             className="w-1/2 text-center bg-red-500 hover:bg-red-600 transition-all duration-200 text-white py-2 px-4 rounded-lg font-medium ml-2"
//           >
//             Cancel
//           </Link>
//         </div>
//       </div>
//     </div>
//   );
// }
