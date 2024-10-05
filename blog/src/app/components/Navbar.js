// components/Navbar.js
"use client";

import Link from "next/link";

export default function Navbar() {
  return (
    <div>
      <nav className="p-2 font-medium bg-gray-200 shadow-md">
        <ul className="p-2 flex space-x-3 justify-end">
          <li className=" p-1 rounded-lg transition-transform hover:bg-green-400 hover:scale-110 cursor-pointer">
            <Link className="text-gray-500 no-underline" href="/home">Home</Link>
          </li>
          <li className="p-1 rounded-lg transition-transform hover:bg-green-400 hover:scale-110 cursor-pointer">
            <Link className="text-gray-500 no-underline" href="/about">About</Link>
          </li>
          <li className="p-1 rounded-lg transition-transform hover:bg-green-400 hover:scale-110 cursor-pointer">
            <Link className="text-gray-500 no-underline" href="/login">Login</Link>
          </li>
          <li className="p-1 rounded-lg transition-transform hover:bg-green-400 hover:scale-110 cursor-pointer">
            <Link className="text-gray-500 no-underline" href="/signup">SignUp</Link>
          </li>
        </ul>
      </nav>
    </div>
  );
}
