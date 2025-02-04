import React, { useRef, useState } from "react";
import Modal from "./Modal";
import Toast from "./UI/Toast";

const ForgotPasswordModal = ({ isOpen, onClose }) => {
  const emailRef = useRef(null);
  const [showToast, setShowToast] = useState(false);
  const [toastType, setToastType] = useState("info");
  const [toastMessage, setToastMessage] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    const email = emailRef.current.value;

    const response = await fetch("/api/forgot-password", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });
    const data = await response.json();

    if (response.ok) {
      setShowToast(true);
      setToastType("success");
      setToastMessage(data.message);
    } else {
      setShowToast(true);
      setToastType("error");
      setToastMessage(data.error);
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
                  Forgot your password?
                </h2>
                <p className="text-rose-100 text-lg">
                  Don't worry! It happens to the best of us. Enter your email and we'll help you get back to your account.
                </p>
              </div>
              <div className="absolute bottom-8 left-8 right-8">
                <div className="flex items-center space-x-2 text-rose-100">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                  <span>Check your email after submission</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right side - Form */}
          <div className="w-full md:w-1/2 p-8">
            <div className="mb-8 text-center">
              <h3 className="text-2xl font-bold text-gray-800">
                Reset Password
              </h3>
              <p className="mt-2 text-gray-600">
                Enter your email address and we'll send you a link to reset your password.
              </p>
            </div>

            <form
              className="space-y-6"
              onSubmit={handleSubmit}
            >
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  ref={emailRef}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-colors"
                  placeholder="you@example.com"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-rose-500 text-white py-3 rounded-lg hover:bg-rose-600 transition-colors font-medium"
              >
                Send Reset Link
              </button>

              <button
                type="button"
                onClick={onClose}
                className="w-full text-center text-sm text-rose-500 hover:text-rose-600 mt-4"
              >
                Back to login
              </button>
            </form>
          </div>
        </div>
      </Modal>

      {showToast && (
        <Toast
          type={toastType}
          message={toastMessage}
          onClose={() => setShowToast(false)}
          onClick={() => setShowToast(false)}
        />
      )}
    </>
  );
};

export default ForgotPasswordModal;
