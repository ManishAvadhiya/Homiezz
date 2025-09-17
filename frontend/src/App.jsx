import React, { Suspense, useEffect } from "react";
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
import ResetPassword from "./pages/ResetPassword";



import { useAuthStore } from "./store/userStore";

import Profile from "./pages/Profile";
import Favorites from "./pages/Favorites";
import Contact from "./pages/Contact";
import AddRoomPage from "./pages/AddRoomPage";

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
  const { checkAuth } = useAuthStore();
  
  useEffect(() => {
    // Check authentication status when app loads
    checkAuth();
  }, [checkAuth]);

  return (
    <div>
      {/* <Toaster position="top-right" /> */}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/register" element={<Register />} />
        
        
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/profile" element={<Profile />} />
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
        <Route path="/favorites" element={<Favorites />} />
        <Route path="/contact" element={<Contact />} />
          <Route path="/add-rooms" element={<AddRoomPage />} />
      </Routes>
    </div>
  );
};

export default App;