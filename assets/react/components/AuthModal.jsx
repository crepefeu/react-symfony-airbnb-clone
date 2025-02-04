import React, { useRef, useState, useEffect } from "react";
import Modal from "./Modal";
import useAuth from "../hooks/useAuth";
import ForgotPasswordModal from "./ForgotPasswordModal";

const AuthModal = ({ isOpen, onClose }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [errors, setErrors] = useState([]);
  const [isForgotModalShow, setIsForgotModalShow] = useState(false);
  const [previousUrl, setPreviousUrl] = useState("");
  const { login } = useAuth();

  // Refs for all form fields
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const firstNameRef = useRef(null);
  const lastNameRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setPreviousUrl(window.location.pathname + window.location.search);
    }
  }, [isOpen]);

  const handleLogin = async (e) => {
    e.preventDefault();
    const response = await fetch("/api/login_check", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: emailRef.current.value,
        password: passwordRef.current.value,
      }),
    });

    if (response.ok) {
      const data = await response.json();
      const me = await fetch("/api/me", {
        headers: { Authorization: `Bearer ${data.token}` },
      });

      if (me.ok) {
        const meData = await me.json();
        login({ 
          user: {
            firstName: meData.firstName,
            lastName: meData.lastName,
            roles: meData.roles,
          }, 
          token: data.token 
        });
        location.href = previousUrl || "/";
      }
    } else {
      setErrors(["Invalid credentials"]);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    const response = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: emailRef.current.value,
        password: passwordRef.current.value,
        firstName: firstNameRef.current.value,
        lastName: lastNameRef.current.value,
      }),
    });

    if (response.ok) {
      const data = await response.json();
      localStorage.setItem("token", data.token);
      const me = await fetch("/api/me", {
        headers: { Authorization: `Bearer ${data.token}` },
      });

      if (me.ok) {
        const meData = await me.json();
        login({ 
          user: {
            firstName: meData.firstName,
            lastName: meData.lastName,
            roles: meData.roles,
          }, 
          token: data.token 
        });
        location.href = "/profile";
      }
    } else {
      setErrors(["Something went wrong during registration"]);
    }
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <div className="flex w-full max-w-4xl mx-auto bg-white rounded-2xl overflow-hidden">
          {/* Left side - Image */}
          <div className="hidden md:block w-1/2 bg-rose-500 p-8 text-white relative">
            <div className="h-full flex flex-col justify-between">
              <div>
                <h2 className="text-3xl font-bold mb-6">
                  {isLogin ? "Welcome back" : "Join HostMe"}
                </h2>
                <p className="text-rose-100 text-lg">
                  {isLogin
                    ? "Your next adventure awaits"
                    : "Find your perfect stay worldwide"}
                </p>
              </div>
              <div className="absolute bottom-8 left-8 right-8">
                <div className="flex items-center space-x-2 text-rose-100">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <span>Over 1M+ happy guests</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right side - Form */}
          <div className="w-full md:w-1/2 p-8">
            <div className="mb-8 text-center">
              <h3 className="text-2xl font-bold text-gray-800">
                {isLogin ? "Sign in to your account" : "Create your account"}
              </h3>
            </div>

            <form
              className="space-y-6"
              onSubmit={isLogin ? handleLogin : handleSignup}
            >
              {!isLogin && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      First Name
                    </label>
                    <input
                      type="text"
                      ref={firstNameRef}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-colors"
                      placeholder="John"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Last Name
                    </label>
                    <input
                      type="text"
                      ref={lastNameRef}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-colors"
                      placeholder="Doe"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  ref={emailRef}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-colors"
                  placeholder="you@example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  ref={passwordRef}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-colors"
                  placeholder="••••••••"
                />
              </div>

              {errors.length > 0 && (
                <div className="bg-red-50 text-red-500 p-3 rounded-lg">
                  {errors.map((error, index) => (
                    <p key={index} className="text-sm">
                      {error}
                    </p>
                  ))}
                </div>
              )}

              <button
                type="submit"
                className="w-full bg-rose-500 text-white py-3 rounded-lg hover:bg-rose-600 transition-colors font-medium"
              >
                {isLogin ? "Sign In" : "Create Account"}
              </button>

              <div className="relative my-8">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">
                    {isLogin ? "New to HostMe?" : "Already have an account?"}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsLogin(!isLogin)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                {isLogin ? "Create an account" : "Sign in to existing account"}
              </button>

              {isLogin && (
                <button
                  type="button"
                  onClick={() => setIsForgotModalShow(true)}
                  className="w-full text-center text-sm text-rose-500 hover:text-rose-600 mt-4"
                >
                  Forgot your password?
                </button>
              )}
            </form>
          </div>
        </div>
      </Modal>

      {isForgotModalShow && (
        <ForgotPasswordModal
          isOpen={isForgotModalShow}
          onClose={() => setIsForgotModalShow(false)}
        />
      )}
    </>
  );
};

export default AuthModal;
