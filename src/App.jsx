import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./Components/login";
import RegisterOrganizer from "./Components/RegisterOrganizer";
import Dashboard from "./Components/Dashboard";
import OrganizerDashboard  from "./Components/OrganizerDashboard";
import CreateConference from "./Components/CreateNewConference";
import AdminDashboard from "./Components/Admin/AdminDashboard";
import AdminConferenceManager from "./Components/Admin/AdminConferenceManager";
import ConferenceDetails from "./Components/Conference/ConferenceDetails";
import RegisterAuthor from "./Components/Author/AuthorRegistration";
import AuthorDashboard from "./Components/Author/AuthorDashboard";
import PaperSubmissionForm from "./Components/Author/SubmitPaper";
import ManageReviewerRequests from "./Components/ManageReviewRequest";
import ReviewerDashboard from "./Components/Reviewer/ReviewerDashboard";
import ManageInvitations from "./Components/Reviewer/ManageInvitation";
import SubmitReview from "./Components/Reviewer/SubmitReview";

import OrgConfDetails from "./Components/Conference/OrgConfDetails";
import AssignSubOrganizer from "./Components/AssignSubOrganizer";
import SubOrganizerDashboard from './Components/SubOrganizer/SubOrganizerDashboard'
import PaperReviewPage from "./Components/Author/PaperReview";

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
