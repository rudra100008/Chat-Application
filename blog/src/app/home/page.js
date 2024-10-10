"use client"
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import AllPost from "../components/AllPost";
import Navbar from "../components/Navbar";


export default function Home(){
    const router = useRouter();
    useEffect(()=>{
        const token =localStorage.getItem('token')
        if(!token)
        {
           router.push("/")
        }
    },[router])
    return(
        <div>
            <Navbar/>
            <AllPost/>
        </div>
    )
}