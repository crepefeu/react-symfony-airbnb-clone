import React, { useRef, useState } from "react";
import Modal from "./Modal";
import useAuth from "../hooks/useAuth";

const SignUpModal = ({ isOpen, onClose }) => {
  const [errors, setErrors] = useState([]);
  const firstNameRef = useRef(null);
  const lastNameRef = useRef(null);
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const { login } = useAuth();

  const handleSubmit = async (event) => {
    event.preventDefault();

    const firstName = firstNameRef.current.value;
    const lastName = lastNameRef.current.value;
    const email = emailRef.current.value;
    const password = passwordRef.current.value;

    const response = await fetch("/api/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password, firstName, lastName }),
    });

    if (response.ok) {
      const data = await response.json();
      localStorage.setItem("token", data.token);

      const me = await fetch("/api/me", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (me.ok) {
        const meData = await me.json();
        const user = {
          firstName: meData.firstName,
          lastName: meData.lastName,
          roles: meData.roles,
        };
        login({ user, token: data.token });
        location.href = "/profile";
      }
    } else {
      setErrors(["Something went wrong during registration"]);
      console.log("Erreur lors de l'inscription", response);
    }
  };
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="w-full" title="Sign Up">
        <form
          action=""
          className="flex flex-col gap-4 justify-center items-center"
          onSubmit={handleSubmit}
        >
          <input
            type="text"
            name="firstName"
            id="firstName"
            placeholder="First Name"
            required
            className="w-1/2 border border-gray-400 focus:border-rose-500 rounded outline-none px-4 py-2"
            ref={firstNameRef}
          />
          <input
            type="text"
            name="lastName"
            id="lastName"
            placeholder="Last Name"
            required
            className="w-1/2 border border-gray-400 focus:border-rose-500 rounded outline-none px-4 py-2"
            ref={lastNameRef}
          />
          <input
            type="email"
            name="email"
            id="email"
            placeholder="Email"
            required
            className="w-1/2 border border-gray-400 focus:border-rose-500 rounded outline-none px-4 py-2"
            ref={emailRef}
          />
          <input
            type="password"
            name="password"
            id="password"
            placeholder="Password"
            required
            className="w-1/2 border border-gray-400 focus:border-rose-500 rounded outline-none px-4 py-2"
            ref={passwordRef}
          />
          {errors.map((error, index) => (
            <span key={index}>{error}</span>
          ))}
          <button
            type="submit"
            className="bg-rose-500 text-white rounded-md px-4 py-2 w-1/3 mt-2 hover:bg-rose-700"
          >
            Submit
          </button>
        </form>
      </div>
    </Modal>
  );
};

export default SignUpModal;
