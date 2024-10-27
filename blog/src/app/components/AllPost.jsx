"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import base_url from "../api/base_url";
import Post from "./Post"; 
import { useRouter } from "next/navigation";

const getToken = () => {
    return localStorage.getItem("token");
};

const AllPost = () => {
    const router = useRouter();
    const [posts, setPosts] = useState([]);
    const [pageNumber, setPageNumber] = useState(0);
    const [loading, setLoading] = useState(false);
    const [hasMorePosts, setHasMorePosts] = useState(true); 
    const [sortBy, setSortBy] = useState('postDate');
    const [sortDir, setSortDir] = useState('ascending');
    
    const fetchPosts = async () => {
        if (loading || !hasMorePosts) return; 
        setLoading(true); 
        try {
            const token = getToken();
            const response = await axios.get(`${base_url}/posts`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                params: {
                    pageNumber,
                    pageSize: 3,
                    sortBy,
                    sortDir,
                },
            });

            const { data, totalPage, pageNumber: currentPage } = response.data;
            setPosts((prevPosts) => {
                const existingPostIds = new Set(prevPosts.map((post) => post.postId));
                const newPosts = data.filter((post) => !existingPostIds.has(post.postId)); 
                return [...prevPosts, ...newPosts]; 
            });

            if (data.length === 0 || currentPage >= totalPage - 1) {
                setHasMorePosts(false);
            }
        } catch (error) {
            console.error("Error fetching posts:", error);
            if (error.response?.status === 401) {
                localStorage.setItem("message", "Session expired. Please log in again.");
                setTimeout(() => {
                    router.push("/"); // Redirect to login page
                }, 1000); 
            }
        } finally {
            setLoading(false); 
        }
    };

    const sortHandler = (criteria, direction) => {
        setSortBy(criteria);
        setSortDir(direction);
        setPosts([]); // Clear posts to refetch with new sort
        setPageNumber(0); // Reset page number
        setHasMorePosts(true); // Allow fetching with new sort
    };

    useEffect(() => {
        if (hasMorePosts && !loading) {
            fetchPosts();
        }
    }, [pageNumber, hasMorePosts, sortBy, sortDir]);

    function debounce(func, delay) {
        let timeout;
        return function (...args) {
            const context = this;
            clearTimeout(timeout);
            timeout = setTimeout(() => {
                func.apply(context, args);
            }, delay);
        };
    }

    useEffect(() => {
        const handleScroll = () => {
            if (
                window.innerHeight + document.documentElement.scrollTop >=
                    document.documentElement.offsetHeight - 50 &&
                hasMorePosts &&
                !loading 
            ) {
                setPageNumber((prevPageNumber) => prevPageNumber + 1); 
            }
        };

        const debounceHandler = debounce(handleScroll, 50); 
        window.addEventListener("scroll", debounceHandler);
        return () => {
            window.removeEventListener("scroll", debounceHandler);
        };
    }, [hasMorePosts, loading]);

    return (
        <div className="container mx-auto p-6">
            <div className="flex justify-between items-center mb-4">
               
                <div className="space-x-2">
                    {sortDir === "ascending" && sortBy === "postDate" ? (
                        <button
                            onClick={() => sortHandler("postDate", "descending")}
                            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                        >
                            Sort by Newest
                        </button>
                    ) : (
                        <button
                            onClick={() => sortHandler("postDate", "ascending")}
                            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                        >
                            Sort by Oldest
                        </button>
                    )}
                </div>
            </div>

            {posts.length > 0 ? (
                <div className="space-y-4">
                    {posts.map((post, index) => (
                        <div key={post.id || index}>
                            <Post post={post} isUserPost={false} />
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-center font-semibold text-gray-700">No posts available</p>
            )}
            
            {loading && hasMorePosts && (
                <p className="text-center font-semibold text-gray-500">Loading more posts...</p>
            )}
            
            {!hasMorePosts && !loading && (
                <p className="bg-gray-200 p-4 mt-5 text-gray-800 text-center font-bold rounded">
                    No more posts available.
                </p>
            )}
        </div>
    );
};

export default AllPost;
