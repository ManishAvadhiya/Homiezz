// App.jsx (Updated)
import React, { Suspense, useEffect } from "react";
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
import { useChatStore } from "./store/chatStore"; // Add this import
import Profile from "./pages/Profile";
import Favorites from "./pages/Favorites";
import Contact from "./pages/Contact";
import AddRoomPage from "./pages/AddRoomPage";
import Login from "./pages/Login";
import Signup from "./pages/Signup"; 
import AccommodationMap from "./pages/AccommodationMap";
import RoommateProfilePage from "./pages/RoommateProfilePage";
import Chat from "./components/Chat/Chat"; // Add this import

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
  const { checkAuth, user } = useAuthStore();
  const { initializeSocket, disconnectSocket } = useChatStore(); // Add this
  
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // Initialize socket when user is authenticated
  useEffect(() => {
    if (user) {
      // You need to get the token from your auth store or cookies
      const token = document.cookie
        .split('; ')
        .find(row => row.startsWith('token='))
        ?.split('=')[1];
      
      if (token) {
        initializeSocket(token);
      }
    } else {
      disconnectSocket();
    }

    return () => {
      disconnectSocket();
    };
  }, [user, initializeSocket, disconnectSocket]);

  return (
    <div>
      {/* Chat Component - Rendered globally */}
      <Chat />
      
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} /> 
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
        <Route path="/room/:id" element={<ViewDetailsPage />} />
        <Route path="/favorites" element={<Favorites />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/add-rooms" element={<AddRoomPage />} />
        <Route path="/map" element={<AccommodationMap />}/>
        <Route path="/roommate-profile" element={<RoommateProfilePage />} />
        
        {/* Add chat route if needed */}
        <Route path="/chat" element={<div>Chat Page</div>} />
      </Routes>
    </div>
  );
};

export default App;