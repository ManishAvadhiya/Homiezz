import { useAuthStore } from "@/store/userStore";
import { Button } from "../components/ui/button";
import {
  Home,
  User,
  Heart,
  LogOut,
  LayoutDashboard
} from "lucide-react";
import { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";

const Navbar = () => {
  const { user, checkingAuth, logout, checkAuth } = useAuthStore();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const location = useLocation();

  // Check authentication status on component mount
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const handleLogout = async () => {
    await logout();
    setIsDropdownOpen(false);
    window.location.href = "/";
  };

  // Helper to check active route
  const isActive = (path) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md supports-[backdrop-filter]:bg-white/80 border-b border-orange-200 shadow-sm">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-gradient-to-br from-orange-500 to-amber-500 rounded-xl shadow-lg">
            <img
              src="/logo.png"
              alt="Homiezz Logo"
              height={"40px"}
              width={"40px"}
            />
          </div>
          <span
            className="bg-gradient-to-r from-orange-600 via-amber-500 to-yellow-500 bg-clip-text text-transparent animate-pulse text-4xl font-bold cursor-pointer"
            onClick={() => (window.location.href = "/")}
          >
            Homiezz
          </span>
        </div>
        
        <div className="hidden md:flex items-center space-x-8">
          <Link
            to="/find-rooms"
            className={`font-medium transition-colors ${
              isActive("/find-rooms")
                ? "text-orange-600 border-b-2 border-orange-500 pb-1"
                : "text-gray-700 hover:text-orange-600"
            }`}
          >
            Find Rooms
          </Link>
          <Link
            to="/add-rooms"
            className={`font-medium transition-colors ${
              isActive("/add-rooms")
                ? "text-orange-600 border-b-2 border-orange-500 pb-1"
                : "text-gray-700 hover:text-orange-600"
            }`}
          >
            Add Rooms
          </Link>
          <Link
            to="/find-roommates"
            className={`font-medium transition-colors ${
              isActive("/find-roommates")
                ? "text-orange-600 border-b-2 border-orange-500 pb-1"
                : "text-gray-700 hover:text-orange-600"
            }`}
          >
            Find Roommates
          </Link>
          <Link
            to="/about"
            className={`font-medium transition-colors ${
              isActive("/about")
                ? "text-orange-600 border-b-2 border-orange-500 pb-1"
                : "text-gray-700 hover:text-orange-600"
            }`}
          >
            About Us
          </Link>
          <Link
            to="/contact"
            className={`font-medium transition-colors ${
              isActive("/contact")
                ? "text-orange-600 border-b-2 border-orange-500 pb-1"
                : "text-gray-700 hover:text-orange-600"
            }`}
          >
            Contact
          </Link>
        </div>

        <div className="flex items-center space-x-4">
          {checkingAuth ? (
            <div className="animate-pulse h-8 w-8 rounded-full bg-gray-200"></div>
          ) : user ? (
            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-amber-500 text-white font-semibold shadow-md hover:shadow-lg transition-shadow"
              >
                {user.name ? user.name.charAt(0).toUpperCase() : "U"}
              </button>
              
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
                  <div className="px-4 py-2 border-b border-gray-100">
                    <p className="text-sm font-medium text-gray-900">
                      {user.name}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      {user.email}
                    </p>
                  </div>
                  
                  <Link
                    to="/profile"
                    className={`flex items-center px-4 py-2 text-sm hover:bg-gray-100 ${
                      isActive("/profile") ? "text-orange-600 font-bold" : "text-gray-700"
                    }`}
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </Link>
                  
                  <Link
                    to="/favorites"
                    className={`flex items-center px-4 py-2 text-sm hover:bg-gray-100 ${
                      isActive("/favorites") ? "text-orange-600 font-bold" : "text-gray-700"
                    }`}
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    <Heart className="mr-2 h-4 w-4" />
                    Favorites
                  </Link>
                  
                  <button
                    onClick={handleLogout}
                    className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                onClick={() => (window.location.href = "/register")}
                className="border-orange-500 text-orange-600 hover:bg-orange-50"
              >
                Login
              </Button>
              <Button
                onClick={() => (window.location.href = "/register")}
                className="bg-gradient-to-br from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white shadow-md hover:shadow-lg"
              >
                Sign Up
              </Button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;