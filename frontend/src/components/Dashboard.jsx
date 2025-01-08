import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { addDataSet } from "../redux/dataSetSlice";
import BarAndLineChart from "./BarAndLineChart";
import { useNavigate } from "react-router-dom";
// import useCookie from "../hooks/useCookie";

const BASE_URL = import.meta.env.VITE_BACKEND_URL;

const Dashboard = () => {
  const navigate = useNavigate();
  // const token = useCookie("token");

  const dispatch = useDispatch();

  const dataSet = useSelector((store) => store.dataSet);

  // const user = useSelector((store) => store.user.user);

  const fetchData = async () => {
    try {
      const response = await axios.get(BASE_URL + "data", {
        withCredentials: true,
      });

      dispatch(addDataSet(response.data.data));
    } catch (error) {
      console.log(error);

      if (error?.response?.data?.message == "Invalid Token") {
        navigate("/login");
      }
    }
  };

  // useEffect(() => {
  //   if (!user) {
  //     navigate("/login");
  //   }
  // }, [user]);

  useEffect(() => {
    if (!dataSet) {
      fetchData();
    }
  }, [dataSet]);

  if (!dataSet)
    return (
      <div className="flex justify-center items-center w-full min-h-[92vh]">
        <div className="h-12 w-12 rounded-full border-[4px] border-r-gray-500 animate-spin "></div>
      </div>
    );

  return (
    dataSet && (
      <div className="max-w-[800px] mx-auto">
        <BarAndLineChart data={dataSet} />
      </div>
    )
  );
};

export default Dashboard;
