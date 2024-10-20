import { useEffect, useState } from "react";
import axios from "axios";
import base_url from "../api/base_url";
import Post from "./Post"; 
import { useRouter } from "next/navigation";

const AllPost = () => {
    const router =useRouter();
    const [posts, setPosts] = useState([]);
    const [pageNumber, setPageNumber] = useState(0);
    const [loading, setLoading] = useState(false);
    const [hasMorePosts, setHasMorePosts] = useState(true); 

    const getToken = () => {
        return localStorage.getItem("token");
    };

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
                    pageNumber: pageNumber,
                    pageSize: 3, 
                },
            });

            console.log(response.data);
            const { data, totalPage, pageNumber: currentPage } = response.data;
            console.log("page Number is " + currentPage);

            // Append the new posts to the existing ones
            setPosts((prevPosts) => {
                const existingPostIds = new Set(prevPosts.map(post => post.postId));
                const newPosts = data.filter(post => !existingPostIds.has(post.postId)); 
                return [...prevPosts, ...newPosts]; 
            });

            // If no more posts or we've reached the last page
            if (data.length === 0 || currentPage >= totalPage - 1) {
                setHasMorePosts(false); // No more posts to load
            }

        } catch (error) {
            console.error("Error fetching posts:", error);
            // if(error.response.status === 401){
            //     router.push("/")
            // }
        } finally {
            setLoading(false); 
        }
    };

    // Fetch posts only when pageNumber changes or when hasMorePosts changes
    useEffect(() => {
        if (hasMorePosts && !loading) {
            fetchPosts();
        }
    }, [pageNumber, hasMorePosts]);

    // Debounce function to avoid multiple quick scroll triggers
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

    // Infinite Scroll Handling with Debounce
    useEffect(() => {
        const handleScroll = () => {
            if (
                window.innerHeight + document.documentElement.scrollTop >=
                    document.documentElement.offsetHeight - 50 &&
                hasMorePosts &&
                !loading // Trigger fetch only if there are more posts and not loading
            ) {
                setPageNumber((prevPageNumber) => prevPageNumber + 1); // Increment page number
            }
        };

        const debounceHandler = debounce(handleScroll, 50); // Debounce scroll
        window.addEventListener("scroll", debounceHandler);
        return () => {
            window.removeEventListener("scroll", debounceHandler);
        };
    }, [hasMorePosts, loading]);

    return (
        <div>
            {posts.length > 0 ? (
                posts.map((post,index) => (
                    <Post key={post.id || index} post={post} /> // Use post.id as key to ensure uniqueness
                ))
            ) : (
                <p className="text-center font-semibold">No posts available</p> // Fallback for no posts
            )}
            {loading && hasMorePosts && <p className="text-center font-semibold">Loading more posts...</p>}
            {!hasMorePosts && <p>No more posts available.</p>}
        </div>
    );
};

export default AllPost;
