import React from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { setUser } from "../store/slices/userSlice";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const Nav = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.reducer.user);

  const handleLogout = () => {
    localStorage.removeItem("token");
    dispatch(setUser(null));
    navigate("/");
  };

  return (
    <nav className="w-full h-24 mx-auto flex items-center justify-center   sm:px-6 lg:px-8 bg-blue-800 shadow-lg text-white fixed z-1000 ">
      <img
        src="/logo.png"
        alt="Logo"
        className="rounded-full w-20 ml-10 border-white border"
      />

      {user ? (
        <section className="flex justify-end items-center gap-5 ml-auto text-white pr-10">
          <div className="font-medium text-xl">
            <Link to={"/profile"}>Profile</Link>
          </div>
          <div
            className="font-medium text-xl cursor-pointer"
            onClick={handleLogout}
          >
            Logout
          </div>
        </section>
      ) : (
        <div className="flex justify-end items-center gap-5 ml-auto font-medium text-2xl pr-10">
          <Link to={"/login"}>Login</Link>
          <Link to={"/register"}>Register</Link>
        </div>
      )}
    </nav>
  );
};

export default Nav;
