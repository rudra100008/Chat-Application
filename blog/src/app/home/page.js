"use client"
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import AllPost from "../components/AllPost";
import Navbar from "../components/Navbar";
import Link from "next/link";
import axios from "axios"; // Import axios
import base_url from "../api/base_url";


const getUserId = () => {
  
  return localStorage.getItem('userId');
}

const getToken = () => {
  return localStorage.getItem('token');
}



export default function Home() {
  const router = useRouter();
  const [userDetails, setUserDetails] = useState({
    id: null,
    username: "",
    email: "",
    image: "",
    phoneNumber:"",
    description:""
  });

  const getUserDetails = () => {
    const id = getUserId(); // Get user ID from utility function or state
    if (!id) {
      console.log("No user ID found");
      return;
    }

    axios.get(`${base_url}/users/${id}`, {
      headers: {
        Authorization: `Bearer ${getToken()}`
      }
    }).then((response) => {
      console.log(response.data);
      const { id, username, email, image, phoneNumber, description } = response.data;
      setUserDetails({ id, username, email, image, phoneNumber, description });
    }).catch((error) => {
      console.log(error.response?.data || error.message);
    });
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
   
    if (!token) {
      router.push("/");
    } else {
      getUserDetails(); // Fetch user details if token is present
    }
    
  }, []);

  return (
    <div>
      <Navbar user={userDetails} />
      <div className="flex items-center justify-center mb-5">
        <Link
          className="no-underline mt-2 inline-block px-5 py-3 font-semibold text-white bg-blue-100 rounded-xl shadow-md hover:bg-blue-500 transition duration-200 hover:scale-105"
          href="/addPost"
        >
          Do you want to post something?
        </Link>
      </div>
      <AllPost />
    </div>
  );
}
