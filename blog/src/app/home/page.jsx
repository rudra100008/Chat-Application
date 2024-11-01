"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import AllPost from "../components/AllPost";
import Navbar from "../components/Navbar";
import Link from "next/link";
import axios from "axios"; // Import axios
import base_url from "../api/base_url";
import { ToastContainer } from "react-toastify";

const getUserId = () => localStorage.getItem('userId');
const getToken = () => localStorage.getItem('token');

export default function Home() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [userDetails, setUserDetails] = useState({
    id: null,
    username: "",
    email: "",
    image: "",
    phoneNumber: "",
    description: ""
  });

  const getUserDetails = async () => {
    setLoading(true);
    const userId = getUserId();
    if (!userId) {
      console.log("No user ID found");
      return;
    }

    try {
      const response = await axios.get(`${base_url}/users/${userId}`, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });

      const { id, username, email, image, phoneNumber, description } = response.data;
      setUserDetails({ id, username, email, image, phoneNumber, description });
    } catch (error) {
      console.log(error.response?.data || error.message);
      if (error.response?.status === 401) {
        localStorage.removeItem("userId");
        localStorage.removeItem("token");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = getToken();
    if (token && !userDetails.id) {
      getUserDetails();
    }
  }, [userDetails.id]); // Add userDetails.id as a dependency

  return (
    <div>
       <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="dark"
            />
      {loading ? (
        <div>Loading.....</div>
      ) : (
        <>
          <Navbar user={userDetails} />
          <div className="flex items-center justify-center mb-5">
            <Link
              className="no-underline mt-2 inline-block px-5 py-3 font-semibold text-white bg-blue-300 rounded-xl shadow-md hover:bg-blue-500 transition duration-200 hover:scale-105"
              href="/addPost"
            >
              Do you want to share your thought?
            </Link>
          </div>
          <AllPost />
        </>
      )}
    </div>
  );
}
