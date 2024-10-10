"use client"
import { useState,useEffect } from "react"
import Post from "./Post";
import axios from "axios";
import base_url from "../api/base_url";
import { ToastContainer ,toast} from "react-toastify";
import Link from "next/link";
import { useRouter } from "next/navigation";


export default function AllPost(){
    const router =useRouter();
    const [post,setPost]=useState([])
    const [loading ,setLoading]=useState(false)
    const getToken=()=>{
        return localStorage.getItem("token");
    }
    const getPostFromServer= async ()=>{
        const token =getToken()
        try {
            const response =await axios.get(`${base_url}/posts`,{
                headers:{
                    Authorization:`Bearer ${token}`
                }
            });
            const {data}=response.data
            setPost(data)
            console.log(data)
        } catch (error) {
            if(error.response && error.response.status===401)
            {
                toast.error("Session expired.Please login again")
                localStorage.removeItem("token")
                localStorage.removeItem("username")
                localStorage.removeItem("userId")
                setTimeout(()=>{
                   router.push("/")
                },1000)
                return
            }
            console.log(error.response.data)
        }finally{
            //after the data is fecthed the loading is set true
            setTimeout(()=>{
                setLoading(true)
            },1000)
        }
        
    }
useEffect(()=>{
getPostFromServer();
},[])
    return(
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

            {!loading && <p className="text-center">Post loading.........</p>}
            <div>
                {loading && <Link href="/addPost">Do you want to post something?</Link>}
            </div>
            <div>
            {
                loading && post.length>0
                ?(post.map((post,index)=>(
                    <Post key={index} post={post}/>)))
                 :(loading && <p>No post available</p>)   
                
            }
            </div>
        </div>
    );
}