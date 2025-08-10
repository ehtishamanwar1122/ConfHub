import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./components/Login";
import RegisterOrganizer from "./components/RegisterOrganizer";
import Dashboard from "./components/Dashboard";
import OrganizerDashboard  from "./components/OrganizerDashboard";
import CreateConference from "./components/CreateNewConference";
import AdminDashboard from "./components/Admin/AdminDashboard";
import AdminConferenceManager from "./components/Admin/AdminConferenceManager";
import ConferenceDetails from "./components/Conference/ConferenceDetails";
import RegisterAuthor from "./components/Author/AuthorRegistration";
import AuthorDashboard from "./components/Author/AuthorDashboard";
import PaperSubmissionForm from "./components/Author/SubmitPaper";
import ManageReviewerRequests from "./components/ManageReviewRequest";
import ReviewerDashboard from "./components/Reviewer/ReviewerDashboard";
import ManageInvitations from "./components/Reviewer/ManageInvitation";
import SubmitReview from "./components/Reviewer/SubmitReview";

import OrgConfDetails from "./components/Conference/OrgConfDetails";
import AssignSubOrganizer from "./components/AssignSubOrganizer";
import SubOrganizerDashboard from './components/SubOrganizer/SubOrganizerDashboard'
import PaperReviewPage from "./components/Author/PaperReview";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<RegisterOrganizer />} />
        <Route path="/OrganizerDashboard" element={<OrganizerDashboard />} />
        <Route path="/CreateConference" element={<CreateConference />} />
        <Route path="/AssignSubOrganizer" element={<AssignSubOrganizer />} />

        <Route path="/SubOrganizerDashboard" element={<SubOrganizerDashboard />} />

        <Route path="/ManageReviewerRequests" element={<ManageReviewerRequests />} />
        <Route path="/AdminDashboard" element={<AdminDashboard />} />
        <Route path="/AdminConferenceManager" element={<AdminConferenceManager />} />
        <Route path="/conference/:id" element={<ConferenceDetails />} />
        <Route path="/registerAuthor" element={<RegisterAuthor />} />
        <Route path="/AuthorDashboard" element={<AuthorDashboard />} />

        <Route path="/SubmitPaper" element={<PaperSubmissionForm />} />
        <Route path="/paper-review/:paperId" element={<PaperReviewPage />} />
     

        <Route path="/ReviewerDashboard" element={<ReviewerDashboard />} />
        
        <Route path="/ManageInvitations" element={<ManageInvitations />} />
        <Route path="/SubmitReview/:id" element={<SubmitReview />} />

        <Route path="/SubmitPaper/:id" element={<PaperSubmissionForm />} />
        <Route path="/orgConferenceDetails/:id" element={<OrgConfDetails />} />

      </Routes>
    </Router>
  );
}

export default App;
