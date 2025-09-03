import React from "react";
import Modal from "./Modal";
import Form from "./Form";
import { Link, NavLink } from "react-router-dom";
import { useState, useEffect } from "react";

export default function Navbar() {
  const [isOpen, setIsOpen] = React.useState(false);

  let token = localStorage.getItem("token");
  const [isLogin, setIsLogin] = useState(token ? false : true);
  let user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    setIsLogin(token ? false : true);
  }),
    [token];

  const checkLogin = () => {
    if (token) {
      const confirmLogout = window.confirm("Are you sure you want to logout?");
      if (confirmLogout) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setIsLogin(true);
      }
    } else {
      setIsOpen(true);
    }
  };
  return (
    <>
      <header className="w-full flex items-center justify-between px-10 py-4 bg-white shadow-md sticky top-0 z-50">
        <Link to="/">
          <h2 className="text-2xl font-bold text-black">BikesHeaven</h2>
        </Link>

        <ul className="flex space-x-8">
          <li className="cursor-pointer text-black ">
            <NavLink to="/">
              <b>Home</b>
            </NavLink>
          </li>
          <li
            className="cursor-pointer text-black "
            onClick={() => isLogin && setIsOpen(true)}
          >
            <NavLink to={!isLogin ? "/mybikes" : "/"}>
              {" "}
              <b>MyBikes</b>
            </NavLink>
          </li>
          <li className="cursor-pointer text-black" onClick={checkLogin}>
            {" "}
            <p className="login">{isLogin ? <b>Login</b> : <b>Logout</b>}</p>
          </li>
        </ul>
      </header>
      {isOpen && (
        <Modal onClose={() => setIsOpen(false)}>
          {" "}
          <Form setIsOpen={() => setIsOpen(false)} />
        </Modal>
      )}
    </>
  );
}
