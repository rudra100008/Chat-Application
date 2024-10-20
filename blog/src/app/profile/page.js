"use client";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import base_url from "../api/base_url";
import { toast } from "react-toastify";

const getUserId = () => {
  return localStorage.getItem("userId");
};

const getToken = () => {
  return localStorage.getItem("token");
};

const Profile = () => {
  const router = useRouter();
  const [imageUrl, setImageUrl] = useState("");
  const [userDetails, setUserDetails] = useState({
    id: null,
    username: "",
    email: "",
    image: "",
    phoneNumber: "",
    description: "",
  });

  const getUserDetails = () => {
    const id = getUserId();
    if (!id) {
      console.log("No user ID found");
      return;
    }

    axios
      .get(`${base_url}/users/${id}`, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      })
      .then((response) => {
        const {
          id,
          username,
          email,
          image,
          phoneNumber,
          description,
        } = response.data;
        setUserDetails({
          id,
          username,
          email,
          image,
          phoneNumber,
          description,
        });
      })
      .catch((error) => {
        console.log(error.response?.data || error.message);
      });
  };

  const getUserImageFromServer = async () => {
    await axios
      .get(`${base_url}/users/getImage/${userDetails.image}`, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
        responseType: "blob",
      })
      .then((response) => {
        const url = URL.createObjectURL(response.data);
        setImageUrl(url);
      })
      .catch((error) => {
        console.log(error.response.data);
        if (!userDetails.image) {
          toast.error("No image found for this user.");
        }
      });
  };

  const handleAddPost=()=>{
   router.push("/addPost")
  }
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/");
    } else {
      getUserDetails();
    }
  }, [router]);

  useEffect(() => {
    if (userDetails.image) {
      getUserImageFromServer();
    }
    const isTokenExpired =localStorage.getItem("isTokenExpired")
    if(isTokenExpired === "true"){
      router.push("/")
      localStorage.removeItem("isTokenExpired")
    }else{
      router.push("/profile")
    }
  }, [userDetails,router]);

  return (
    <div className=" h-screen bg-sky-200">
      <div className="max-w-4xl w-full mx-auto bg-white rounded-lg shadow-lg p-6 text-center">
        <div className="w-48 h- mx-auto">
        <img
          className=" rounded-full mb-4 border-4 border-gray-200"
          src={imageUrl}
          alt={userDetails.username}
        />
        </div>
        
        <h3 className="text-4xl font-semibold text-gray-700 hover:text-gray-500 hover:font-bold">{userDetails.username}</h3>
        <p className="text-sm text-gray-500">{userDetails.description}</p>
        <div className="flex justify-around mt-4">
          <div>
            <span className="block font-bold text-gray-700">{userDetails.phoneNumber}</span>
            <span className="text-gray-500">Mobile Number</span>
          </div>
          <div>
            <span className="block font-bold text-gray-700">{userDetails.email}</span>
            <span className="text-gray-500">Email</span>
          </div>
          
        </div>
        <div className="mt-6">
          <button className="bg-cyan-300 text-white font-semibold px-4 py-2 rounded-lg shadow-lg hover:bg-pink-600 transition-transform hover:scale-105">
            Edit Profile
          </button>
          <button 
          onClick={handleAddPost}
          className="bg-gray-300 text-gray-700 font-semibold px-4 py-2 rounded-lg shadow-lg ml-4 hover:bg-gray-400 transition-transform hover:scale-105">
            Do you want to post something?
          </button>
        </div>
      </div>
      
      <div className="bg-white max-w-4xl w-full mx-auto mt-3 flex justify-center items-center space-x-3 rounded-lg">
        <p className="hover:underline decoration-gray-600">Posts</p>
        <p>More Details</p>
      </div>
    </div>
  );
};

export default Profile;
