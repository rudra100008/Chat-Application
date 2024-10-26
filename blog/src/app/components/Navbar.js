"use client";
import Link from 'next/link';
import { useState, useEffect } from 'react';
import base_url from '../api/base_url';
import { toast } from 'react-toastify';
import axios from 'axios';
import { useRouter, usePathname } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faInfoCircle, faListSquares, faSignInAlt, faSignOutAlt, faCog, faUser, faSignOut } from '@fortawesome/free-solid-svg-icons';

const Navbar = ({ user }) => {
  const router = useRouter();
  const pathname = usePathname(); // Get the current path
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
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${base_url}/logout`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 200) {
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        localStorage.removeItem('userId');
        localStorage.removeItem('isTokenExpired')
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
          {/* Dropdown Menu for Smaller Screens */}
          <div className="relative">
            <button
              className="text-gray-300 hover:text-white focus:outline-none"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              <FontAwesomeIcon icon={faListSquares} className="w-6 h-6" />
            </button>
            {isDropdownOpen && (
              <div className="absolute left-0 mt-2 bg-white rounded-lg shadow-lg w-32">
                <Link href="/home" className="no-underline block px-4 py-2 hover:bg-gray-200">
                  <p className={`${pathname === "/home" ? "text-amber-300" : "text-gray-700"}`}>
                    <FontAwesomeIcon icon={faHome} /> Home
                  </p>
                </Link>
                <Link href="/about" className="block px-4 py-2 text-gray-700 hover:bg-gray-200 no-underline">
                  <p className={`${pathname === "/about" ? "text-amber-300" : "text-gray-700"}`}>
                    <FontAwesomeIcon icon={faInfoCircle} /> About
                  </p>
                </Link>
                {loggedIn ? (
                  <Link href="/" onClick={handleLogout} className="block px-4 py-2 text-gray-700 hover:bg-gray-200 no-underline">
                    <FontAwesomeIcon icon={faSignOut} /> LogOut
                  </Link>
                ) : (
                  <Link href="/signup" className="block px-4 py-2 text-gray-700 hover:bg-gray-200 no-underline">
                    <FontAwesomeIcon icon={faSignInAlt} /> Sign Up
                  </Link>
                )}
                <Link href="/settings" className="block px-4 py-2 text-gray-700 hover:bg-gray-200 no-underline">
                  <FontAwesomeIcon icon={faCog} /> Settings
                </Link>
                <Link href="/profile" className="block px-4 py-2 text-gray-700 hover:bg-gray-200 no-underline">
                  <FontAwesomeIcon icon={faUser} /> Profile
                </Link>
              </div>
            )}
          </div>
          <h1 className="text-xl font-bold text-white">
            <Link href="/home">BlogApp</Link>
          </h1>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-9">
          <Link href="/home" className="hover:text-white no-underline">
            <p className={`${pathname === "/home" ? "text-amber-300" : "text-gray-400"}`}>
              <FontAwesomeIcon icon={faHome} className="w-7 h-7" />
            </p>
          </Link>
          <Link href="/about" className="no-underline hover:text-white">
            <p className={`${pathname === "/about" ? "text-amber-300" : "text-gray-400"}`}>
              <FontAwesomeIcon icon={faInfoCircle} className="w-7 h-7" />
            </p>
          </Link>
          {loggedIn ? (
            <button onClick={handleLogout} className="bg-red-600 text-white px-3 py-1 rounded-lg hover:bg-red-700 flex items-center">
              <FontAwesomeIcon icon={faSignOutAlt} /> <span className="ml-1">Logout</span>
            </button>
          ) : (
            <Link href="/signup" className="text-gray-300 no-underline hover:text-white">
              <FontAwesomeIcon icon={faSignInAlt} />
            </Link>
          )}
          <Link href="/profile" className="text-gray-400 hover:text-gray-300 no-underline flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full overflow-hidden shadow-lg">
              <img src={imageUrl} alt={user.username} className="w-full h-full object-cover" />
            </div>
            <span className="text-white">@{user.username.toUpperCase()}</span>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
