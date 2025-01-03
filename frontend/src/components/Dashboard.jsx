import { useEffect } from "react";
import { useSelector } from "react-redux";
import useCookie from "../hooks/useCookie";

const Dashboard = () => {
  const user = useSelector((store) => store.user);

  console.log(user);

  const cookie = useCookie("token");

  useEffect(() => {}, []);

  return <div>Dashboard</div>;
};

export default Dashboard;
