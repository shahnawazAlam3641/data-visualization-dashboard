import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import useCookie from "../hooks/useCookie";
import axios from "axios";
import { addDataSet } from "../redux/dataSetSlice";
import Chart from "chart.js/auto";

import { CategoryScale } from "chart.js";
// import PieChart from "./PieChart";
// import { BarChart } from "./BarChart";
import BarAndLineChart from "./BarAndLineChart";
import { useNavigate } from "react-router-dom";

const BASE_URL = import.meta.env.VITE_BACKEND_URL;

Chart.register(CategoryScale);

const Dashboard = () => {
  const navigate = useNavigate();
  const user = useSelector((store) => store.user);

  const dispatch = useDispatch();

  const dataSet = useSelector((store) => store.dataSet);

  const cookie = useCookie("token");

  const fetchData = async () => {
    const response = await axios.get(BASE_URL + "data", {
      withCredentials: true,
    });

    dispatch(addDataSet(response.data.data));
  };

  useEffect(() => {
    if (!user) {
      return navigate("/login");
    } else if (!dataSet) {
      fetchData();
    }
  }, []);

  return (
    dataSet && (
      <div className="max-w-[800px] mx-auto">
        <BarAndLineChart data={dataSet} />
      </div>
    )
  );
};

export default Dashboard;
