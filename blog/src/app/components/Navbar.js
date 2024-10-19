"use client";
import Link from 'next/link';
import { useState, useEffect } from 'react';
import base_url from '../api/base_url';
import { toast } from 'react-toastify';
import axios from 'axios';
import { useRouter } from 'next/navigation';

const Navbar = ({ user }) => {
  const router = useRouter();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [imageUrl, setImageUrl] = useState('');

  const getToken = () => {
    return localStorage.getItem('token');
  };

  const getUserImageFromServer = async () => {
    await axios.get(`${base_url}/users/getImage/${user.image}`, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
      responseType: "blob",
    }).then((response) => {
      const url = URL.createObjectURL(response.data);
      setImageUrl(url);
    }).catch((error) => {
      console.log(error.response.data);
      if (!user.image) {
        toast.error("No image found for this user.");
      }
    });
  };

  const handleLogout = async () => {
    try {
      const response = await axios.post(`${base_url}/logout`);
      if (response.status === 200) {
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        localStorage.removeItem('userId');
        setLoggedIn(false);
        toast.success("Logout Successful");
        setTimeout(() => {
          router.push("/");
        }, 1000);
      } else {
        console.log("Logout failed");
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const token = getToken();
    if (token) {
      setLoggedIn(true);
    } else {
      setLoggedIn(false);
    }
  }, []);

  useEffect(() => {
    if (user.image) {
      getUserImageFromServer();
    }
  }, [user]);

  return (
    <nav className="bg-gray-800 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex space-x-6">
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
              <div className="absolute left-0 mt-2 rounded-lg shadow-lg bg-white w-32 overflow-hidden transition-all duration-500 ease-in">
                <Link href="/" className="block no-underline text-gray-700 px-4 py-2 text-center rounded-lg focus:outline-none hover:bg-gray-100">
                  Home
                </Link>
                <Link href="/about" className="block no-underline text-gray-700 px-4 py-2 text-center rounded-lg hover:bg-gray-100">
                  About
                </Link>
                {!loggedIn ? (
                  <>
                    <Link href="/signup" className="block no-underline text-gray-700 px-4 py-2 text-center rounded-lg hover:bg-gray-100">
                      Signup
                    </Link>
                    <Link href="/" className="block no-underline text-gray-700 px-4 py-2 text-center rounded-lg hover:bg-gray-100">
                      Login
                    </Link>
                  </>
                ) : (
                  <Link  onClick={handleLogout} className="block no-underline text-gray-700 px-4 py-2 text-center rounded-lg hover:bg-gray-100">
                    Logout
                  </Link>
                )}
                <Link href="/settings" className="block no-underline text-gray-700 px-4 py-2 text-center rounded-lg hover:bg-gray-100">
                  Settings
                </Link>
                <Link href="/profile"
                className="block no-underline text-gray-700 px-4 py-2 text-center rounded-lg hover:bg-gray-100">
                  Profile
                </Link>
              </div>
            )}
          </div>
          <div className="text-xl font-bold mt-2">
            <Link className='no-underline text-white' href="/home">BlogApp</Link>
          </div>
        </div>
        <div className="hidden md:flex items-center space-x-4">
          <Link href="/home" className="text-gray-300 mt-2 no-underline hover:text-white">
            Home
          </Link>
          <Link href="/about" className="text-gray-300 mt-2 no-underline hover:text-white">
            About
          </Link>
          {!loggedIn ? (
            <>
              <Link href="/signup" className="text-gray-300 mt-2 no-underline hover:text-white">
                Signup
              </Link>
              <Link href="/" className="text-gray-300 mt-2 no-underline hover:text-white">
                Login
              </Link>
            </>
          ) : (
            <div className="flex items-center space-x-2">
              <button className="bg-red-600 text-white px-3 py-1 rounded-lg hover:bg-red-700" onClick={handleLogout}>
                Logout
              </button>
              <Link href="/profile" className="flex items-center space-x-2 text-lg font-bold text-gray-400 no-underline hover:text-gray-300">
                <div className="relative w-10 h-10 rounded-full overflow-hidden shadow-lg border-2 border-gray-300">
                  <img
                    className="w-full h-full object-cover"
                    src={imageUrl} 
                    alt={user.username}
                  />
                </div>
                <span>{`@${user.username.toUpperCase()}`}</span>
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
