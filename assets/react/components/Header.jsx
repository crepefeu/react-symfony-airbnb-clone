import React, { useState, useRef, useEffect } from "react";
import LogInModal from "./LogInModal";
import SignUpModal from "./SignUpModal";
import useAuth from "../hooks/useAuth";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLogInModalOpen, setIsLogInModalOpen] = useState(false);
  const [isSignUpModalOpen, setIsSignUpModalOpen] = useState(false);
  const { isAuthenticated, user, logout } = useAuth();
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div>
      <header className="fixed top-0 left-0 right-0 h-16 bg-white shadow-md z-50">
        <div className="max-w-7xl mx-auto px-4 h-full flex items-center justify-between">
          {/* Logo */}
          <a href="/" className="flex items-center">
            <svg
              className="h-8 w-auto text-rose-500"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12.0002 0C5.37037 0 0 5.37037 0 12.0002C0 18.63 5.37037 24.0004 12.0002 24.0004C18.63 24.0004 24.0004 18.63 24.0004 12.0002C24.0004 5.37037 18.63 0 12.0002 0ZM15.8507 16.9001C14.7724 18.6605 12.0002 21.0007 12.0002 21.0007C12.0002 21.0007 9.22797 18.6605 8.14967 16.9001C5.85027 13.2298 7.01842 8.67931 12.0002 8.67931C16.982 8.67931 18.1501 13.2298 15.8507 16.9001Z" />
            </svg>
            <span className="ml-2 text-xl font-semibold text-gray-900">
              HostMe
            </span>
          </a>

          {/* Search Bar */}
          <div className="hidden md:flex items-center px-4 h-12 border border-gray-200 rounded-full hover:shadow-md transition-shadow">
            <input
              type="text"
              placeholder="Search properties..."
              className="w-64 outline-none text-gray-600 placeholder-gray-400"
            />
            <button className="ml-4 p-2 bg-rose-500 text-white rounded-full">
              <svg
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </button>
          </div>

          {/* User Menu */}
          <div className="flex items-center space-x-4 relative" ref={menuRef}>
            <a
              href="/host"
              className="hidden md:block text-gray-600 hover:text-gray-900"
            >
              Become a host
            </a>
            <button className="p-2 rounded-full hover:bg-gray-100">
              <svg
                className="h-5 w-5 text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z"
                />
              </svg>
            </button>
            <button
              className="flex items-center space-x-2 border border-gray-200 rounded-full p-2 hover:shadow-md transition-shadow"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <svg
                className="h-5 w-5 text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
              <div className="h-8 w-8 bg-gray-500 rounded-full text-white flex items-center justify-center">
                <svg
                  className="h-5 w-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </button>

            {/* Dropdown Menu */}
            {isMenuOpen && (
              <div className="absolute right-0 top-16 w-64 bg-white rounded-xl shadow-lg border border-gray-200 py-2">
                {isAuthenticated && (
                  <div>
                    <a
                      href="/wishlists"
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                    >
                      Messages
                    </a>
                    <a
                      href="/trips"
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                    >
                      Trips
                    </a>
                    {/* {user.roles.include("ROLE_HOST") && ( */}
                    <a
                      href="/bookings"
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                    >
                      Manage bookings
                    </a>
                    {/* )} */}
                    <a
                      href="/wishlists"
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                    >
                      Wishlists
                    </a>
                    <hr className="my-2" />
                  </div>
                )}
                {/* Add other menu items here */}
                {!isAuthenticated && (
                  <div>
                    <span
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-100 hover:cursor-pointer"
                      onClick={() => setIsLogInModalOpen(true)}
                    >
                      Log In
                    </span>
                    <span
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-100 hover:cursor-pointer"
                      onClick={() => setIsSignUpModalOpen(true)}
                    >
                      Sign Up
                    </span>
                  </div>
                )}
                {isAuthenticated && (
                  <div>
                    <a
                      href="/profile"
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                    >
                      Profile
                    </a>
                    <span
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-100 hover:cursor-pointer"
                      onClick={() => logout()}
                    >
                      Log out
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </header>
      <LogInModal
        isOpen={isLogInModalOpen}
        onClose={() => setIsLogInModalOpen(false)}
      />
      <SignUpModal
        isOpen={isSignUpModalOpen}
        onClose={() => setIsSignUpModalOpen(false)}
      />
    </div>
  );
};

export default Header;
