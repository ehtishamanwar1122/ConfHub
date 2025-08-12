import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import ProtectedRoute from "./Components/ProtectedRoute";
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
<Route path="/conference/:id" element={<ConferenceDetails />} />
<Route
  path="/OrganizerDashboard"
  element={
    <ProtectedRoute allowedRoles={["organizer"]}>
      <OrganizerDashboard />
    </ProtectedRoute>
  }
/>

<Route
  path="/CreateConference"
  element={
    <ProtectedRoute allowedRoles={["organizer"]}>
      <CreateConference />
    </ProtectedRoute>
  }
/>

<Route
  path="/AssignSubOrganizer"
  element={
    <ProtectedRoute allowedRoles={["organizer"]}>
      <AssignSubOrganizer />
    </ProtectedRoute>
  }
/>

<Route
  path="/SubOrganizerDashboard"
  element={
    <ProtectedRoute>
      <SubOrganizerDashboard />
    </ProtectedRoute>
  }
/>

<Route
  path="/ManageReviewerRequests"
  element={
 <ProtectedRoute allowedRoles={["organizer"]}>
      <ManageReviewerRequests />
    </ProtectedRoute>
  }
/>

<Route
  path="/AdminDashboard"
  element={
   <ProtectedRoute allowedRoles={["admin"]}>
      <AdminDashboard />
    </ProtectedRoute>
  }
/>

<Route
  path="/AdminConferenceManager"
  element={
    <ProtectedRoute allowedRoles={["admin"]}>
      <AdminConferenceManager />
    </ProtectedRoute>
  }
/>

<Route
  path="/AuthorDashboard"
  element={
    <ProtectedRoute allowedRoles={["author"]}>
      <AuthorDashboard />
    </ProtectedRoute>
  }
/>

<Route
  path="/SubmitPaper"
  element={
   <ProtectedRoute allowedRoles={["author"]}>
      <PaperSubmissionForm />
    </ProtectedRoute>
  }
/>

<Route
  path="/ReviewerDashboard"
  element={
    <ProtectedRoute allowedRoles={["reviewer"]}>
      <ReviewerDashboard />
    </ProtectedRoute>
  }
/>

<Route
  path="/ManageInvitations"
  element={
    <ProtectedRoute allowedRoles={["reviewer"]}>
      <ManageInvitations />
    </ProtectedRoute>
  }
/>

<Route
  path="/SubmitReview/:id"
  element={
   <ProtectedRoute allowedRoles={["reviewer"]}>
      <SubmitReview />
    </ProtectedRoute>
  }
/>

<Route
  path="/SubmitPaper/:id"
  element={
    <ProtectedRoute allowedRoles={["author"]}>
      <PaperSubmissionForm />
    </ProtectedRoute>
  }
/>
<Route
  path="/paper-review/:id"
  element={
    <ProtectedRoute allowedRoles={["author"]}>
      <PaperReviewPage />
    </ProtectedRoute>
  }
/>

<Route
  path="/orgConferenceDetails/:id"
  element={
   <ProtectedRoute allowedRoles={["organizer"]}>
      <OrgConfDetails />
    </ProtectedRoute>
  }
/>
      </Routes>
    </Router>
  );
}

export default App;
