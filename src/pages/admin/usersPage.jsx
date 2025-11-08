import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaEdit, FaTrash } from "react-icons/fa";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoading) {
      const token = localStorage.getItem("token");
      axios
        .get(import.meta.env.VITE_BACKEND_URL + "/api/users/all", {
          headers: {
            Authorization: "Bearer " + token,
          },
        })
        .then((response) => {
          setUsers(response.data);
          setIsLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching users:", error);
          toast.error("Failed to fetch users");
          setIsLoading(false);
        });
    }
  }, [isLoading]);

  function deleteUser(userId) {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("You must be logged in to delete a user");
      return;
    }
    axios
      .delete(import.meta.env.VITE_BACKEND_URL + "/api/users/" + userId, {
        headers: {
          Authorization: "Bearer " + token,
        },
      })
      .then(() => {
        toast.success("User deleted successfully");
        setUsers(users.filter((item) => item._id !== userId));
      })
      .catch((error) => {
        toast.error("Failed to delete user");
        console.error(error);
      });
  }

  return (
    <div className="w-full h-full max-h-full overflow-y-scroll p-6 font-[Poppins] bg-gray-50">
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
                {/* <th className="py-3 px-4 text-left">User ID</th> */}
                <th className="py-3 px-4 text-left">Name</th>
                <th className="py-3 px-4 text-left">Email</th>
                <th className="py-3 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {users.map((user) => (
                <tr
                  key={user._id}
                  className="hover:bg-gray-50 transition duration-150"
                >
                  {/* <td className="py-3 px-4">{user._id}</td> */}
                  <td className="py-3 px-4 font-medium">
                    {user.firstName} {user.lastName}
                  </td>
                  <td className="py-3 px-4">{user.email}</td>
                  <td className="py-3 px-4">
                    <div className="flex justify-center items-center space-x-4">
                      <FaTrash
                        onClick={() => deleteUser(user._id)}
                        className="text-red-500 cursor-pointer hover:text-red-700 transition duration-200 text-lg"
                      />
                      <FaEdit
                        onClick={() =>
                          navigate("/admin/edit-user", {
                            state: { user: user },
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
