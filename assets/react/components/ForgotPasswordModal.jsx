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
        <div className="w-full" title="Reset password">
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
            <button
              type="submit"
              className="bg-rose-500 text-white rounded-md px-4 py-2 w-1/3 mt-2 hover:bg-rose-700"
            >
              Submit
            </button>
          </form>
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
