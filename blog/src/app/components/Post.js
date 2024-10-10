"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import base_url from "../api/base_url";

export default function Post({ post }) {
    const [image, setImage] = useState(null);

    const getToken = () => {
        return localStorage.getItem("token");
    };

    const fetchImage = () => {
        const token = getToken();
        axios.get(`${base_url}/posts/image/${post.image}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
            responseType: "blob", // Get the image as a blob
        })
        .then((response) => {
            const imageURL = URL.createObjectURL(response.data); // Create a blob URL for the image
            setImage(imageURL); // Set the image URL to state
        })
        .catch((err) => {
            console.log("Cannot fetch the image:", err);
        });
    };

    // Fetch image when the post has an image
    useEffect(() => {
        if (post.image) {
            fetchImage();
        }
    }, [post.image]);

    return (
        <div className="flex justify-center">
 <div className="max-w-sm rounded-md overflow-hidden shadow-lg bg-white m-4 cursor-pointer">
            {/* Render the image if it's available */}
            {image && (
                <img
                    className="w-full object-cover h-64"
                    src={image}
                    alt={post.postTitle}
                />
            )}
            <div className="px-6 py-4">
                <div className="font-bold text-xl mb-2">{post.postTitle}</div>
                <p className="text-gray-700 text-base">{post.content}</p>
                <p className="text-gray-600 text-sm">
                    {new Date(post.postDate).toLocaleString()}
                </p>
            </div>
        </div>
    
        </div>
    )
}
