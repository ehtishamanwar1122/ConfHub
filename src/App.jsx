import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./components/Login";
import RegisterOrganizer from "./components/RegisterOrganizer";
import Dashboard from "./components/Dashboard";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<RegisterOrganizer />} />
      </Routes>
    </Router>
  );
}

export default App;
