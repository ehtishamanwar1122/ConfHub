import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./components/Login";
import RegisterOrganizer from "./components/RegisterOrganizer";
import Dashboard from "./components/Dashboard";
import OrganizerDashboard  from "./Components/OrganizerDashboard";
import CreateConference from "./Components/CreateNewConference";
import AdminDashboard from "./Components/Admin/AdminDashboard";
import AdminConferenceManager from "./Components/Admin/AdminConferenceManager";
import ConferenceDetails from "./Components/Conference/ConferenceDetails";
import RegisterAuthor from "./Components/Author/AuthorRegistration";
import AuthorDashboard from "./Components/Author/AuthorDashboard";
import PaperSubmissionForm from "./Components/Author/SubmitPaper";
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
        <Route path="/conference/:id" element={<ConferenceDetails />} />
        <Route path="/registerAuthor" element={<RegisterAuthor />} />
        <Route path="/AuthorDashboard" element={<AuthorDashboard />} />
        <Route path="/SubmitPaper/:id" element={<PaperSubmissionForm />} />
      </Routes>
    </Router>
  );
}

export default App;
