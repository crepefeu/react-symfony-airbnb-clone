import React, { useState, useRef } from "react";
import Layout from "../components/Layout";
import Toast from "../components/UI/Toast";

const ResetPassword = ({ token }) => {
  const passwordRef = useRef(null);
  const [showToast, setShowToast] = useState(false);
  const [toastType, setToastType] = useState("info");
  const [toastMessage, setToastMessage] = useState("");

  const handleSubmit = async (event) => {
    console.log(token);
    event.preventDefault();

    const password = passwordRef.current.value;

    const response = await fetch("/api/reset-password", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ token, password }),
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
    <Layout>
      <div className="flex flex-col items-center justify-center py-12 min-h-[80vh]">
        <h3 className="text-xl font-semibold mb-8">Reset your password</h3>
        <form
          action=""
          className="flex flex-col gap-2 justify-center items-center w-1/2"
          onSubmit={handleSubmit}
        >
          <input
            type="password"
            name="password"
            id="password"
            placeholder="New Password"
            required
            className="w-1/2 border border-gray-400 focus:border-rose-500 rounded outline-none px-4 py-2"
            ref={passwordRef}
          />
          <button
            type="submit"
            className="bg-rose-500 text-white rounded-md px-4 py-2 w-1/3 mt-2 hover:bg-rose-700"
          >
            Submit
          </button>
        </form>
      </div>
      {showToast && (
        <Toast
          type={toastType}
          message={toastMessage}
          onClose={() => setShowToast(false)}
          onClick={() => setShowToast(false)}
        />
      )}
    </Layout>
  );
};

export default ResetPassword;
