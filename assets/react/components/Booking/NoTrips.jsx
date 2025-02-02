import React from "react";

const NoTrips = () => (
  <div className="flex flex-col items-center justify-center py-12 min-h-[80vh]">
    <svg
      height="200px"
      width="200px"
      version="1.1"
      id="Layer_1"
      viewBox="0 0 512 512"
    >
      <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
      <g
        id="SVGRepo_tracerCarrier"
        stroke-linecap="round"
        stroke-linejoin="round"
      ></g>
      <g id="SVGRepo_iconCarrier">
        {" "}
        <g transform="translate(1 1)">
          {" "}
          <g>
            {" "}
            <polygon
              fill="#fda4af"
              points="50.2,122.733 118.467,122.733 118.467,97.133 50.2,97.133 "
            ></polygon>{" "}
            <polygon
              fill="#fda4af"
              points="391.533,122.733 459.8,122.733 459.8,97.133 391.533,97.133 "
            ></polygon>{" "}
          </g>{" "}
          <path
            fill="#FFFFFF"
            d="M212.333,464.067H24.6c-9.387,0-17.067-7.68-17.067-17.067V139.8c0-9.387,7.68-17.067,17.067-17.067 h187.733c9.387,0,17.067,7.68,17.067,17.067V447C229.4,456.387,221.72,464.067,212.333,464.067"
          ></path>{" "}
          <path
            fill="#fda4af"
            d="M485.4,464.067H297.667c-9.387,0-17.067-7.68-17.067-17.067V139.8 c0-9.387,7.68-17.067,17.067-17.067H485.4c9.387,0,17.067,7.68,17.067,17.067V447C502.467,456.387,494.787,464.067,485.4,464.067"
          ></path>{" "}
          <path
            fill="#ffe4e6"
            d="M459.8,464.067H50.2c-9.387,0-17.067-7.68-17.067-17.067V139.8c0-9.387,7.68-17.067,17.067-17.067 h409.6c9.387,0,17.067,7.68,17.067,17.067V447C476.867,456.387,469.187,464.067,459.8,464.067"
          ></path>{" "}
          <g>
            {" "}
            <path
              fill="#f43f5e"
              d="M485.4,472.6H24.6C10.093,472.6-1,460.653-1,447V139.8c0-14.507,11.947-25.6,25.6-25.6h460.8 c14.507,0,25.6,11.947,25.6,25.6V447C511,460.653,499.053,472.6,485.4,472.6z M24.6,131.267c-5.12,0-8.533,4.267-8.533,8.533V447 c0,5.12,4.267,8.533,8.533,8.533h460.8c5.12,0,8.533-4.267,8.533-8.533V139.8c0-5.12-4.267-8.533-8.533-8.533H24.6z"
            ></path>{" "}
            <path
              fill="#f43f5e"
              d="M340.333,131.267H169.667c-5.12,0-8.533-3.413-8.533-8.533V64.707 c0-15.36,11.947-27.307,27.307-27.307h133.12c15.36,0,27.307,11.947,27.307,27.307v58.027 C348.867,127.853,345.453,131.267,340.333,131.267z M178.2,114.2h153.6V64.707c0-5.973-4.267-10.24-10.24-10.24H188.44 c-5.973,0-10.24,4.267-10.24,10.24V114.2z"
            ></path>{" "}
            <path
              fill="#f43f5e"
              d="M75.8,472.6c-5.12,0-8.533-3.413-8.533-8.533V122.733c0-5.12,3.413-8.533,8.533-8.533 c5.12,0,8.533,3.413,8.533,8.533v341.333C84.333,469.187,80.92,472.6,75.8,472.6z"
            ></path>{" "}
            <path
              fill="#f43f5e"
              d="M434.2,472.6c-5.12,0-8.533-3.413-8.533-8.533V122.733c0-5.12,3.413-8.533,8.533-8.533 c5.12,0,8.533,3.413,8.533,8.533v341.333C442.733,469.187,439.32,472.6,434.2,472.6z"
            ></path>{" "}
            <path
              fill="#f43f5e"
              d="M118.467,131.267H50.2c-5.12,0-8.533-3.413-8.533-8.533v-25.6c0-5.12,3.413-8.533,8.533-8.533 h68.267c5.12,0,8.533,3.413,8.533,8.533v25.6C127,127.853,123.587,131.267,118.467,131.267z M58.733,114.2h51.2v-8.533h-51.2 V114.2z"
            ></path>{" "}
            <path
              fill="#f43f5e"
              d="M459.8,131.267h-68.267c-5.12,0-8.533-3.413-8.533-8.533v-25.6c0-5.12,3.413-8.533,8.533-8.533 H459.8c5.12,0,8.533,3.413,8.533,8.533v25.6C468.333,127.853,464.92,131.267,459.8,131.267z M400.067,114.2h51.2v-8.533h-51.2 V114.2z"
            ></path>{" "}
          </g>{" "}
        </g>{" "}
      </g>
    </svg>
    <h3 className="text-xl font-semibold mb-4 mt-8">No trips booked...yet!</h3>
    <p className="text-gray-600 mb-6">
      Time to dust off your bags and start planning your next adventure
    </p>
    <a
      href="/"
      className="bg-rose-500 text-white px-6 py-2 rounded-lg hover:bg-rose-600"
    >
      Start searching
    </a>
  </div>
);

export default NoTrips;
