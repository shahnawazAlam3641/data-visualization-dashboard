import { Route, Routes } from "react-router-dom";
import "./App.css";
import Navbar from "./components/Navbar";
import SignIn from "./components/SignIn";
import Dashboard from "./components/Dashboard";

function App() {
  return (
    <main className="w-full h-full">
      <Navbar />
      <Routes>
        <Route path="/login" element={<SignIn />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </main>
  );
}

export default App;
