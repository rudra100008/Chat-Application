"use client"
import { useState,useEffect } from "react"
import Post from "./Post";
import axios from "axios";
import base_url from "../api/base_url";


export default function AllPost(){
    const [post,setPost]=useState([])
    const getToken=()=>{
        return localStorage.getItem("token");
    }
    const getPostFromServer=()=>{
        const token =getToken()
        axios.get(`${base_url}/posts`,{
            headers:{
                Authorization :`Bearer ${token}`
            }
        }).then(
            (response)=>{

                const {data}=response.data
                setPost(data)
                console.log(response.data)
            }
        ).catch((err)=>{
            console.log(err.response.data)
        })
    }
useEffect(()=>{
getPostFromServer();
},[])
    return(
        <div>
            <h1>Posts</h1>
            <div>
            {
                post.length>0
                ?(post.map((post,index)=>(
                    <Post key={index} post={post}/>)))
                 :(<p>No post available</p>)   
                
            }
            </div>
        </div>
    );
}