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
        console.log(response.data);
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
  }, [userDetails]);

  return (
    <div className="flex justify-center items-center h-screen bg-gradient-to-r from-purple-500 to-blue-500">
      <div className="max-w-xl w-full bg-gray-800 text-white rounded-lg shadow-md">
        <div className="p-0">
          <div className="flex">
            {/* Profile Image Section */}
            <div className="h-[300px] flex justify-center items-center bg-gradient-to-tl from-red-500 to-purple-500 p-4 rounded-l-lg w-2/5">
              <div className="text-center">
                <img
                  className="w-36 h-36 rounded-full mx-auto border-4 border-gray-200"
                  src={imageUrl}
                  alt={userDetails.username}
                />
                <h3 className="text-lg font-semibold mt-4">{userDetails.username}</h3>
                <p className="text-sm text-purple-300">{userDetails.description}</p>
              </div>
            </div>

            {/* Profile Details Section */}
            <div className="bg-gray-900 p-4 rounded-r-lg h-[300px] w-3/5">
              <h3 className="text-lg font-semibold text-purple-200 mb-3">Profile Details</h3>
              <div className="text-sm text-gray-300">
                <p className="mb-3"><strong>Name:</strong> {userDetails.username}</p>
                <p className="mb-3"><strong>Mobile:</strong> {userDetails.phoneNumber}</p>
                <p className="mb-3"><strong>Email:</strong> {userDetails.email}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
