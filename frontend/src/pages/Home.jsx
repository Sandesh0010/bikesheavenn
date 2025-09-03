import React from "react";
import bikelogo from "../assets/bikelogo.jpg";
import BikeItems from "../components/BikeItems";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Modal from "../components/Modal";
import Form from "../components/Form";

export default function Home() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const addBikes = () => {
    let token = localStorage.getItem("token");
    if (token) {
      navigate("/addbikes");
    } else {
      setIsOpen(true);
    }
  };

  return (
    <>
      <div className="bg-white min-h-screen">
        <main className="pt-16 pb-8 flex items-start justify-between px-20 min-h-[calc(100vh-6rem)]">
          <div className="left max-w-2xl">
            <h1 className="text-6xl font-bold mb-6 text-black">BikesHeaven</h1>
            <h5 className="text-xl mb-8 text-black">
              The ultimate destination for bike enthusiasts where you can get
              information about different bikes and brands
            </h5>
            <button
              onClick={addBikes}
              className="bg-blue-800 text-white px-8 py-3 rounded-lg hover:bg-blue-900 transition"
            >
              List Bikes
            </button>
          </div>

          <div className="right mt-0 flex-shrink-0">
            <img
              src={bikelogo}
              alt="Bike Logo"
              className="w-[450px] h-[400px] object-contain"
            />
          </div>
        </main>
      </div>
      {isOpen && (
        <Modal onClose={() => setIsOpen(false)}>
          {" "}
          <Form setIsOpen={() => setIsOpen(false)} />
        </Modal>
      )}

      <div>
        <BikeItems />
      </div>
    </>
  );
}
