"use client"
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import AllPost from "../components/AllPost";
import Navbar from "../components/Navbar";
import Link from "next/link";


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
            <div className="flex items-center justify-center mb-5">
            <Link className="no-underline mt-2  inline-block px-5 py-3 font-semiblod text-white bg-blue-100 rounded-xl shadow-md hover:bg-blue-500 transition duration-200 hover:scale-105 " href="/addPost">
                Do you want to post something?
            </Link>
            </div>
            <AllPost/>
        </div>
    )
}