"use client"
import Link from 'next/link';
import { useState,useEffect } from 'react';

const Navbar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [loggedIn,setLoggedIn]=useState(false);
  const getToken=()=>{
    return localStorage.getItem('token')
  }
  useEffect(()=>{
    const token=getToken()
    if(token){
      setLoggedIn(true)
    }
  },[])
 const handleLogout=()=>{
  localStorage.removeItem('token')
  setLoggedIn(false)
  window.location.reload()
 }
  return (
    <nav className="bg-gray-800 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-white text-xl font-bold">
          <Link href="/home">BlogApp</Link>  
          </div>
        <div className="hidden md:flex space-x-6">
          <Link href="/home" className="text-gray-300 mt-2  hover:text-white">
            Home
          </Link>
          <Link href="/about" className="text-gray-300 mt-2 hover:text-white">
            About
          </Link>
          {!loggedIn ?(
            <>
            <Link href="/signup" className="text-gray-300 mt-2 hover:text-white">
            Signup
          </Link>
          <Link href="/" className="text-gray-300 mt-2 hover:text-white">
            Login
          </Link>
          </>
          ):(
            <button className="ml-4 bg-red-600 text-white px-3 py-2 rounded-lg hover:bg-red-700" onClick={handleLogout}>
              Logout
            </button>
          )}
          
           <div className="relative">
          <button
            className="text-gray-300 hover:text-white focus:outline-none"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            <svg
              className="w-6 h-6 mt-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16m-7 6h7"
              />
            </svg>
          </button>
          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 rounded-lg shadow-lg bg-white  w-32 overflow-hidden transition-all duration-500 ease-in">
              <Link href="/" className="block text-gray-700 px-4 py-2 text-center rounded-lg hover:bg-gray-100">
                Home
              </Link>
              <Link href="/about" className="block text-gray-700 px-4 py-2 text-center rounded-lg hover:bg-gray-100">
                About
              </Link>
              <Link href="/signup" className="block text-gray-700 px-4 py-2 text-center rounded-lg hover:bg-gray-100">
                Signup
              </Link>
              <Link href="/" className="block text-gray-700 px-4 py-2 text-center rounded-lg hover:bg-gray-100">
                Login
              </Link>
              <Link href="/settings" className="block text-gray-700 px-4 py-2 text-center rounded-lg hover:bg-gray-100">
                Settings
              </Link>
              <Link href="/profile" className="block text-gray-700 px-4 py-2 text-center rounded-lg hover:bg-gray-100">
                Profile
              </Link>
            </div>
          )}
        </div>
        </div>

        {/* Mobile Menu */}
       
      </div>
    </nav>
  );
};

export default Navbar;
