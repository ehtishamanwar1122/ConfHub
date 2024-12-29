import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./components/Login";
import RegisterOrganizer from "./components/RegisterOrganizer";
import Dashboard from "./components/Dashboard";
import OrganizerDashboard  from "./Components/OrganizerDashboard";
import CreateConference from "./Components/CreateNewConference";
import AdminDashboard from "./Components/Admin/AdminDashboard";
import AdminConferenceManager from "./Components/Admin/AdminConferenceManager";
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<RegisterOrganizer />} />
        <Route path="/OrganizerDashboard" element={<OrganizerDashboard />} />
        <Route path="/CreateConference" element={<CreateConference />} />
        <Route path="/AdminDashboard" element={<AdminDashboard />} />
        <Route path="/AdminConferenceManager" element={<AdminConferenceManager />} />
      </Routes>
    </Router>
  );
}

export default App;
