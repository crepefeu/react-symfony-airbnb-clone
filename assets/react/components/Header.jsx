import React, { useState, useRef, useEffect } from "react";
import LogInModal from "./LogInModal";
import SignUpModal from "./SignUpModal";
import { SearchProvider, useSearch } from "../contexts/SearchContext";
import useAuth from "../hooks/useAuth";
import { motion, AnimatePresence } from "framer-motion";
import { Autocomplete, LoadScript } from "@react-google-maps/api";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import GuestPicker from "./GuestPicker";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const HeaderContent = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLogInModalOpen, setIsLogInModalOpen] = useState(false);
  const [isSignUpModalOpen, setIsSignUpModalOpen] = useState(false);
  const { isAuthenticated, user, logout } = useAuth();
  const menuRef = useRef(null);
  const searchRef = useRef(null);
  const { searchState, updateSearch } = useSearch();
  const [searchBox, setSearchBox] = useState(null);
  const headerRef = useRef(null);
  const [scrollPosition, setScrollPosition] = useState(0);

  const executeSearch = async () => {
    try {
      const guestCount = getTotalGuests();
      const params = {
        location: searchState.location,
        guests: guestCount,
      };

      // Add dates if available
      if (searchState.dates.startDate && searchState.dates.endDate) {
        params.checkIn = searchState.dates.startDate.toISOString();
        params.checkOut = searchState.dates.endDate.toISOString();
      }

      // Add coordinates if available
      if (searchState.latitude && searchState.longitude) {
        params.latitude = searchState.latitude;
        params.longitude = searchState.longitude;
      }

      window.location.href = `/search?${new URLSearchParams(
        params
      ).toString()}`;
    } catch (error) {
      console.error("Search failed:", error);
    }
  };

  const getTotalGuests = () => {
    const adults = parseInt(searchState.guests?.adults) || 0;
    const children = parseInt(searchState.guests?.children) || 0;
    return adults + children;
  };

  const formatGuests = () => {
    const total = getTotalGuests();
    if (total === 0) return "Add guests";
    return `${total} guest${total !== 1 ? "s" : ""}`;
  };

  const formatDate = (date) => {
    if (!date) return "Add date";
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }

      // New: Check if click is outside header and search is expanded
      if (
        headerRef.current &&
        !headerRef.current.contains(event.target) &&
        searchState.isExpanded
      ) {
        updateSearch({
          isExpanded: false,
          activeSection: null,
        });
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [searchState.isExpanded]); // Add searchState.isExpanded to dependencies

  // Update useEffect for scroll locking
  useEffect(() => {
    const shouldDisableScroll =
      isMenuOpen ||
      searchState.isExpanded ||
      isLogInModalOpen ||
      isSignUpModalOpen;

    if (shouldDisableScroll) {
      setScrollPosition(window.scrollY);
      document.body.classList.add("no-scroll");
      document.body.style.top = `-${window.scrollY}px`;
    } else {
      document.body.classList.remove("no-scroll");
      document.body.style.top = "";
      window.scrollTo(0, scrollPosition);
    }

    return () => {
      document.body.classList.remove("no-scroll");
      document.body.style.top = "";
    };
  }, [
    isMenuOpen,
    searchState.isExpanded,
    isLogInModalOpen,
    isSignUpModalOpen,
    scrollPosition,
  ]);

  const handleLocationFocus = (e) => {
    e.stopPropagation();
    updateSearch({
      isExpanded: true,
      activeSection: "location",
    });
    // Force the autocomplete to show
    if (e.target) {
      setTimeout(() => {
        e.target.click();
      }, 100);
    }
  };

  const onPlaceSelected = () => {
    const place = searchBox.getPlace();
    if (place.geometry) {
      updateSearch({
        location: place.formatted_address,
        latitude: place.geometry.location.lat(),
        longitude: place.geometry.location.lng(),
        activeSection: null
      });
    }
  };

  return (
    <div>
      {/* Add overlay */}
      {searchState.isExpanded && (
        <div
          className="overlay"
          onClick={() =>
            updateSearch({ isExpanded: false, activeSection: null })
          }
        />
      )}

      <motion.header
        ref={headerRef} // Add ref to header
        className="fixed top-0 left-0 right-0 bg-white shadow-md z-40"
        animate={{
          height: searchState.isExpanded ? "180px" : "80px",
        }}
        transition={{ duration: 0.3 }}
      >
        <div className="max-w-7xl mx-auto px-4 h-full">
          <div className="h-20 flex items-center justify-between">
            {/* Logo */}
            <a href="/" className="flex items-center flex-shrink-0">
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
            <div className="flex-1 max-w-2xl mx-auto">
              <motion.div
                className={`relative w-full rounded-full border ${
                  searchState.isExpanded
                    ? "border-gray-300 shadow-lg"
                    : "border-gray-200 shadow-sm"
                }`}
              >
                <div className="flex items-center h-12 divide-x divide-gray-200">
                  <button
                    className={`search-input-button flex-1 px-6 text-left rounded-l-full hover:bg-gray-100 ${
                      searchState.activeSection === "location"
                        ? "bg-gray-100"
                        : ""
                    }`}
                    onClick={() =>
                      updateSearch({
                        isExpanded: true,
                        activeSection: "location",
                      })
                    }
                  >
                    <div className="text-xs font-bold">Where</div>
                    <input
                      type="text"
                      placeholder="Search destinations"
                      className="w-full bg-transparent border-none outline-none text-sm"
                      value={searchState.location}
                      onChange={(e) =>
                        updateSearch({ location: e.target.value })
                      }
                    />
                  </button>
                  <button
                    className={`search-input-button px-6 py-2 hover:bg-gray-100 ${
                      searchState.activeSection === "dates" ? "bg-gray-100" : ""
                    }`}
                    onClick={() =>
                      updateSearch({
                        isExpanded: true,
                        activeSection: "dates",
                      })
                    }
                  >
                    <div className="text-xs font-bold">Check in</div>
                    <div className="text-sm">
                      {formatDate(searchState.dates.startDate)}
                    </div>
                  </button>
                  <button
                    className={`search-input-button px-6 py-2 hover:bg-gray-100 ${
                      searchState.activeSection === "dates" ? "bg-gray-100" : ""
                    }`}
                    onClick={() =>
                      updateSearch({
                        isExpanded: true,
                        activeSection: "dates",
                      })
                    }
                  >
                    <div className="text-xs font-bold">Check out</div>
                    <div className="text-sm">
                      {formatDate(searchState.dates.endDate)}
                    </div>
                  </button>
                  <button
                    className={`search-input-button px-6 py-2 rounded-r-full hover:bg-gray-100 ${
                      searchState.activeSection === "guests"
                        ? "bg-gray-100"
                        : ""
                    }`}
                    onClick={() =>
                      updateSearch({
                        isExpanded: true,
                        activeSection: "guests",
                      })
                    }
                  >
                    <div className="text-xs font-bold">Who</div>
                    <div className="text-sm">{formatGuests()}</div>
                  </button>
                  <button
                    className="p-2 bg-rose-500 rounded-full text-white hover:bg-rose-600 mx-2"
                    onClick={executeSearch}
                  >
                    <svg
                      className="w-5 h-5"
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
              </motion.div>
            </div>

            {/* User Menu */}
            <div
              className="flex-shrink-0 flex items-center space-x-4 relative"
              ref={menuRef}
            >
              {(!user || (user.roles && !user.roles.includes("ROLE_HOST"))) && (
                <a
                  href="/become-a-host"
                  className="hidden md:block text-gray-600 hover:text-gray-900"
                >
                  Become a host
                </a>
              )}
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
                      {user && user.roles.includes("ROLE_HOST") && (
                        <a
                          href="/bookings"
                          className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                        >
                          Manage bookings
                        </a>
                      )}
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

          {/* Floating Menus */}
          <AnimatePresence>
            {searchState.isExpanded && searchState.activeSection && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="absolute left-0 right-0 bg-white shadow-lg rounded-3xl mt-2 p-4 mx-auto max-w-4xl"
              >
                {searchState.activeSection === "location" && (
                  <div className="p-6 relative">
                    <div className="mb-6">
                      <h3 className="text-lg font-semibold">Where to?</h3>
                      <p className="text-gray-500 text-sm mt-1">
                        Search by destination
                      </p>
                    </div>
                    <div className="w-full">
                      <LoadScript
                        googleMapsApiKey="AIzaSyB1Tdhuiy1tk6QluPWGU7pwMZyotQqbcQA"
                        libraries={["places"]}
                      >
                        <Autocomplete
                          onLoad={setSearchBox}
                          onPlaceChanged={onPlaceSelected}
                          options={{
                            types: ["geocode", "establishment"],
                          }}
                        >
                          <div className="relative">
                            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                              <svg
                                className="h-5 w-5 text-gray-400"
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
                            </div>
                            <input
                              type="text"
                              placeholder="Search destinations"
                              className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent text-base bg-gray-50 hover:bg-white transition-colors"
                              value={searchState.location}
                              onChange={(e) =>
                                updateSearch({ location: e.target.value })
                              }
                              onFocus={handleLocationFocus}
                              autoFocus
                            />
                          </div>
                        </Autocomplete>
                      </LoadScript>
                    </div>
                  </div>
                )}

                {searchState.activeSection === "dates" && (
                  <div className="p-4">
                    <div className="flex justify-between items-center mb-4">
                      <div>
                        <h3 className="font-bold text-lg">Select dates</h3>
                      </div>
                      <div className="flex gap-2 text-sm">
                        <div className="border rounded-lg p-2">
                          <div className="font-semibold">CHECK-IN</div>
                          <div>{formatDate(searchState.dates.startDate)}</div>
                        </div>
                        <div className="border rounded-lg p-2">
                          <div className="font-semibold">CHECK-OUT</div>
                          <div>{formatDate(searchState.dates.endDate)}</div>
                        </div>
                      </div>
                    </div>
                    <DatePicker
                      selected={searchState.dates.startDate}
                      onChange={(dates) => {
                        updateSearch({
                          dates: {
                            startDate: dates[0],
                            endDate: dates[1],
                          },
                        });
                        if (dates[0] && dates[1]) {
                          updateSearch({ activeSection: null });
                        }
                      }}
                      startDate={searchState.dates.startDate}
                      endDate={searchState.dates.endDate}
                      selectsRange
                      inline
                      monthsShown={2}
                      minDate={new Date()}
                      calendarClassName="flex hostMe-style border-none"
                    />
                  </div>
                )}

                {searchState.activeSection === "guests" && (
                  <GuestPicker
                    guests={searchState.guests || { adults: 0, children: 0 }}
                    onChange={(guests) => {
                      updateSearch({
                        guests,
                      });
                    }}
                    maxGuests={16}
                    onClose={() => updateSearch({ activeSection: null })}
                  />
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.header>
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

const Header = () => {
  return (
    <SearchProvider>
      <HeaderContent />
    </SearchProvider>
  );
};

export default Header;
