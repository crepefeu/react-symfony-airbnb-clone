import React, { useRef, useState, useEffect } from "react";
import Modal from "./Modal";
import useAuth from "../hooks/useAuth";

const LogInModal = ({ isOpen, onClose }) => {
  const [errors, setErrors] = useState([]);
  const { login } = useAuth();
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const [previousUrl, setPreviousUrl] = useState('');

  useEffect(() => {
    // Store the current URL when the modal opens
    if (isOpen) {
      setPreviousUrl(window.location.pathname + window.location.search);
    }
  }, [isOpen]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const email = emailRef.current.value;
    const password = passwordRef.current.value;

    const response = await fetch("/api/login_check", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    if (response.ok) {
      const data = await response.json();

      const me = await fetch("/api/me", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${data.token}`,
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
        // Redirect to the previous URL instead of the profile page
        location.href = previousUrl || '/';
      }
    } else {
      setErrors(["Invalid logins"]);
      console.log("Erreur", response);
    }
  };
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="w-full" title="Log In">
        <form
          action=""
          className="flex flex-col gap-4 justify-center items-center"
          onSubmit={handleSubmit}
        >
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

export default LogInModal;
