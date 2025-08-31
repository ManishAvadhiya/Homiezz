import React, { Suspense } from "react";
import { Button } from "./components/ui/button";
import Register from "./pages/Register";
import {
  Route,
  BrowserRouter as Router,
  Routes,
  useLocation,
  useNavigate,
} from "react-router-dom";
import FancyLoader from "./components/Loading";
import HomePage from "./pages/HomePage";

import CreateProfileForm from "./pages/CreateUserProfile";
import FindRoomsPage from "./pages/FindRooms";
import FindRoommatesPage from "./pages/FindRoommates";
import AboutPage from "./pages/About";
import ViewDetailsPage from "./pages/ViewDetails";
const App = () => {
  return (
    <Suspense fallback={<FancyLoader />}>
      <Router>
        <AppContent />
      </Router>
    </Suspense>
  );
};
const AppContent = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/createUserProfile"
          element={
            <div className="container mx-auto py-8">
              <CreateProfileForm />
            </div>
          }
        />
        <Route path="/find-rooms" element={<FindRoomsPage />} />
        <Route path="/find-roommates" element={<FindRoommatesPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/view-details" element={<ViewDetailsPage />} />
      </Routes>
    </div>
  );
};
export default App;
