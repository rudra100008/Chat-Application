"use client"
import 'bootstrap/dist/css/bootstrap.min.css';
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

import 'bootstrap/dist/css/bootstrap.min.css';
import Login from './login/page';
import { useEffect,useState } from 'react';
export default function Home() {
  const [token,setToken]= useState(false);
  useEffect(()=>{
    const getToken=  localStorage.getItem("token");
    if(getToken){
      setToken(true)
    }else{
      setToken(false)
    }
  })
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
      { !token ? <Login/>: window.location.href="/home" }
    </div>
  );
}
