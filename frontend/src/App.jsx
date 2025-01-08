import { Navigate, Route, Routes } from "react-router-dom";
import "./App.css";
import Navbar from "./components/Navbar";
import SignIn from "./components/SignIn";
import Dashboard from "./components/Dashboard";
import SharedDashboard from "./components/SharedDashboard";
import Error from "./components/Error";
import Loading from "./components/Loading";
import { useSelector } from "react-redux";

function App() {
  const loading = useSelector((store) => store.loading);

  return (
    <main className="w-full h-full relative">
      <Navbar />
      {loading && <Loading />}
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="*" element={<Error />} />
        <Route path="/login" element={<SignIn />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route
          path="/shared-dashboard/:userId/filters"
          element={<SharedDashboard />}
        />
      </Routes>
    </main>
  );
}

export default App;
