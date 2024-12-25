import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./components/Login";
import RegisterOrganizer from "./components/RegisterOrganizer";
import Dashboard from "./components/Dashboard";
import OrganizerDashboard  from "./Components/OrganizerDashboard";
import CreateConference from "./Components/CreateNewConference";
import AdminDashboard from "./Components/Admin/AdminDashboard";
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<RegisterOrganizer />} />
        <Route path="/OrganizerDashboard" element={<OrganizerDashboard />} />
        <Route path="/Create?Conference" element={<CreateConference />} />
        <Route path="/AdminDashboard" element={<AdminDashboard />} />
    
      </Routes>
    </Router>
  );
}

export default App;
