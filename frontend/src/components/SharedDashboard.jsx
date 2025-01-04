import { useEffect } from "react";
import { useLocation, useParams } from "react-router";
import useQuery from "../hooks/useQuery";
import BarAndLineChart from "./BarAndLineChart";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { addDataSet } from "../redux/dataSetSlice";

const BASE_URL = import.meta.env.VITE_BACKEND_URL;

const SharedDashboard = () => {
  const dataSet = useSelector((store) => store.dataSet);
  const dispatch = useDispatch();
  const query = useQuery();
  const age = query.get("age");
  const gender = query.get("gender");
  const startdate = query.get("startdate");
  const enddate = query.get("enddate");

  const filterOption = {
    age: age,
    gender: gender,
    startdate: startdate || "",
    enddate: enddate || "",
  };

  console.log(age, gender, startdate, enddate);

  const fetchData = async () => {
    const response = await axios.get(BASE_URL + "data", {
      withCredentials: true,
    });

    dispatch(addDataSet(response.data.data));
  };

  useEffect(() => {
    if (!dataSet) {
      fetchData();
    }
  }, []);

  return (
    dataSet && (
      <div className="max-w-[800px] mx-auto">
        <BarAndLineChart
          isSharedDashboard={true}
          data={dataSet}
          filterOption={filterOption}
        />
      </div>
    )
  );
};

export default SharedDashboard;
