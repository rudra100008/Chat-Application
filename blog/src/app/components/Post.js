"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import base_url from "../api/base_url";

export default function Post({ post }) {
    const [image, setImage] = useState(null);
    const [user,setUser]=useState()
    const getToken = () => {
        return localStorage.getItem("token");
    };

    const fetchImage = () => {
        const token = getToken();
        axios.get(`${base_url}/posts/image/${post.image}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
            responseType: "blob", // Ensures we get the image as a blob
        })
        .then((response) => {
            const imageURL = URL.createObjectURL(response.data); // Create a URL for the blob
            setImage(imageURL); // Update the state with the image URL
        })
        .catch((err) => {
            console.log("Cannot fetch the image:", err);
        });
    };

    const fetchUserDetails=()=>{
        const token=getToken();
        axios.get(`${base_url}/users/${post.userId}`,{
            headers:{
                Authorization:`Bearer ${token}`
            }
        }).then((response)=>{
            console.log(response.data)
            setUser(response.data)
        }).catch((err)=>{
            console.log(err.response.data)
        })
    }
    useEffect(() => {
        if (post.image) {
            fetchImage();// Fetch the image only when the post has an image
        }
        if(post.userId){
            fetchUserDetails();
        }
    }, [post.image,post.userId]);

    return (
        <div className="flex justify-center">
            <div className="max-w-sm w-full h-auto rounded-md overflow-hidden shadow-lg bg-white m-4 cursor-pointer transition-transform hover:scale-105 hover:shadow-xl">
                {/* Image Container */}
                {image && (
                    <div className=" w-full pb-2/3 bg-gray-100">
                        <img
                            className=" top-0 left-0 w-full h-full object-cover"
                            src={image}
                            alt={post.postTitle}
                        />
                    </div>
                )}

                <div className="px-6 py-4 h-auto flex flex-col justify-between">
                    {/* Post Date */}
                    <p className="text-gray-500 text-xs mb-2">
                        {new Date(post.postDate).toLocaleString("en-US", {
                            weekday: 'short', year: 'numeric', month: 'long', day: 'numeric'
                        })}
                    </p>

                    {user &&(
                        <p className="text-gray-700 text-sm mb-2">
                           Post By: <span className="font-bold">{user.username}</span> 
                        </p>
                    )}

                    {/* Post Title */}
                    <h2 className="font-bold text-xl text-gray-800 mb-2">
                        {post.postTitle}
                    </h2>

                    {/* Post Content (Truncated) */}
                    <p className="text-gray-700 text-base mb-4 overflow-hidden">
                        {post.content.length > 100
                            ? `${post.content.substring(0, 100)}...`
                            : post.content}
                    </p>

                    {/* Read More Button */}
                    <div className="mt-auto">
                        <button className="bg-blue-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-600 transition-all">
                            Read More
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
