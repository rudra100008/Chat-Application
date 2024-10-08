"use client"
import { useState,useEffect } from "react"
import Post from "./Post";
import axios from "axios";
import base_url from "../api/base_url";


export default function AllPost(){
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
            {!loading && <p className="text-center">Post loading.........</p>}
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