"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import Post from "./Post";
import axios from "axios";
import base_url from "../api/base_url";
import { ToastContainer, toast } from "react-toastify";
import { useRouter } from "next/navigation";

export default function AllPost() {
    const router = useRouter();
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [pageDetails, setPageDetails] = useState({
        pageSize: 10,     // You said you want pageSize to be 10
        pageNumber: 0,    // You said you want pageNumber to start at 0
        totalPages: null,
        totalElements: null,
        lastPage: false   // Tracks if it's the last page to prevent further requests
    });

    const observer = useRef(); // Ref for IntersectionObserver

    const getToken = () => {
        return localStorage.getItem("token");
    };

    const getPostFromServer = async (pageNumber) => {
        const token = getToken();
        setLoading(true);

        try {
            const response = await axios.get(`${base_url}/posts`, {
                headers: {
                    Authorization: `Bearer ${token}`
                },
                params: {
                    pageNumber: pageNumber,  // Use pageNumber for pagination
                    pageSize: pageDetails.pageSize
                }
            });

            const { data, totalPages, totalElements, lastPage } = response.data;

            // Update posts and pagination state
            setPosts((prevPosts) => [...prevPosts, ...data]); // Append new posts
            setPageDetails((prevDetails) => ({
                ...prevDetails,
                totalPages,
                totalElements,
                pageNumber,     // Update the pageNumber
                lastPage        // Update whether it’s the last page
            }));

        } catch (error) {
            if (error.response && error.response.status === 401) {
                toast.error("Session expired. Please login again");
                localStorage.removeItem("token");
                localStorage.removeItem("username");
                localStorage.removeItem("userId");
                setTimeout(() => {
                    router.push("/");
                }, 1000);
                return;
            }
            console.log(error.response.data);
        } finally {
            setLoading(false);
        }
    };

    const lastPostElementRef = useCallback((node) => {
        if (loading) return;
        if (observer.current) observer.current.disconnect();

        observer.current = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting && !pageDetails.lastPage) {
                // Load next page when the last post is visible
                getPostFromServer(pageDetails.pageNumber + 1);
            }
        });

        if (node) observer.current.observe(node);
    }, [loading, pageDetails]);

    useEffect(() => {
        getPostFromServer(0); // Load the first page (pageNumber: 0) on component mount
    }, []);

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

            {!loading && posts.length === 0 && <p className="text-center">Post loading.........</p>}

            <div>
                {posts.length > 0 ? (
                    posts.map((post, index) => {
                        if (index === posts.length - 1) {
                            return <Post key={index} post={post} ref={lastPostElementRef} />; // Attach observer to the last post
                        } else {
                            return <Post key={index} post={post} />;
                        }
                    })
                ) : (
                    loading && <p>No posts available</p>
                )}
            </div>

            {loading && <p>Loading more posts...</p>}
        </div>
    );
}
