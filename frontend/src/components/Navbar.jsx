import React, { useEffect } from "react";
import useCookie from "../hooks/useCookie";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { addUser, removeUser } from "../redux/userSlice";
import { useNavigate } from "react-router-dom";

const BASE_URL = import.meta.env.VITE_BACKEND_URL;

const Navbar = () => {
  const user = useSelector((store) => store.user);

  const navigate = useNavigate();

  const dispatch = useDispatch();

  console.log(user);

  const cookie = useCookie("token");

  const handleLogout = async () => {
    try {
      await axios.post(BASE_URL + "user/logout", {}, { withCredentials: true });
      dispatch(removeUser());
      navigate("/login");
    } catch (error) {
      console.log(error);
    }
  };

  const fetchUser = async () => {
    try {
      const response = await axios.get(BASE_URL + "user/userDetails", {
        withCredentials: true,
      });

      console.log(response.data.data);

      dispatch(addUser(response.data.data));
    } catch (error) {
      console.error(error);
      navigate("/login");
    }
  };

  useEffect(() => {
    if (!user) {
      fetchUser();
    }
  }, []);

  return (
    <nav className="flex justify-between min-w-[100vw] h-[8vh] shadow-md py-4 px-2">
      <p className="text-xl font-bold">Data Visualisation</p>

      {user && (
        <div className="relative flex gap-2 items-center mr-4 hover:cursor-pointer group">
          <span className="flex justify-center items-center min-w-8 min-h-8 text-white bg-accesntColor rounded-full">
            {user.name.split("")[0].toUpperCase()}
            {user.name.split("")[1].toUpperCase()}
          </span>
          <p className="text-lg font-semibold">{user.name}</p>

          <button
            onClick={handleLogout}
            className="absolute top-[100%] transition-colors duration-200 shadow-md hidden group-hover:block right-0 bg-white text-md p-2 hover:bg-gray-300 rounded-md"
          >
            Logout
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
