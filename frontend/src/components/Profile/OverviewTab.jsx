import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Mail, Phone, Shield, Home, Heart, MessageCircle, Building, User, UserPlus, Users } from "lucide-react";

const OverviewTab = ({ 
  user, 
  userRooms, 
  requestedRooms, 
  receivedRequests,
  sentRoommateRequests = [],
  receivedRoommateRequests = [] 
}) => {
  const roleConfig = {
    owner: {
      badge: "bg-amber-100 text-amber-800 hover:bg-amber-100",
      icon: <Home className="h-5 w-5" />
    },
    tenant: {
      badge: "bg-purple-100 text-purple-800 hover:bg-purple-100",
      icon: <Building className="h-5 w-5" />
    }
  };

  const userRole = user.role?.toLowerCase() || 'tenant';
  const config = roleConfig[userRole] || roleConfig.tenant;

  // Calculate roommate request statistics
  const acceptedRoommateRequests = receivedRoommateRequests.filter(req => req.status === 'accepted').length;
  const pendingRoommateRequests = receivedRoommateRequests.filter(req => req.status === 'pending').length;

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <User className="h-5 w-5 mr-2" />
              Personal Information
            </CardTitle>
            <CardDescription>Your basic profile details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center">
              <Mail className="h-4 w-4 mr-2 text-gray-500" />
              <span className="text-gray-700">{user.email}</span>
            </div>
            {user.phone && (
              <div className="flex items-center">
                <Phone className="h-4 w-4 mr-2 text-gray-500" />
                <span className="text-gray-700">{user.phone}</span>
              </div>
            )}
            {user.aadharNumber && (
              <div className="flex items-center">
                <Shield className="h-4 w-4 mr-2 text-gray-500" />
                <span className="text-gray-700">Aadhar: •••• •••• {user.aadharNumber.slice(-4)}</span>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Account Status</CardTitle>
            <CardDescription>Your account information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-700">Email Verification</span>
              <Badge variant={user.isVerified ? "default" : "secondary"}>
                {user.isVerified ? "Verified" : "Pending"}
              </Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-700">Account Role</span>
              <Badge variant="outline" className={config.badge}>
                {user.role}
              </Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-700">Member Since</span>
              <span className="text-gray-500">
                {new Date(user.createdAt || Date.now()).toLocaleDateString()}
              </span>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Room Request Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Room Requests Overview</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Listed Rooms</p>
                  <p className="text-2xl font-bold text-gray-900">{userRooms.length}</p>
                </div>
                <Home className="h-8 w-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Sent Requests</p>
                  <p className="text-2xl font-bold text-gray-900">{requestedRooms.length}</p>
                </div>
                <Heart className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Received Requests</p>
                  <p className="text-2xl font-bold text-gray-900">{receivedRequests.length}</p>
                </div>
                <MessageCircle className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
        </div>
      </motion.div>

      {/* Roommate Request Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Roommate Requests Overview</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Sent Requests</p>
                  <p className="text-2xl font-bold text-gray-900">{sentRoommateRequests.length}</p>
                </div>
                <User className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Received Requests</p>
                  <p className="text-2xl font-bold text-gray-900">{receivedRoommateRequests.length}</p>
                </div>
                <UserPlus className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Pending Requests</p>
                  <p className="text-2xl font-bold text-gray-900">{pendingRoommateRequests}</p>
                </div>
                <UserPlus className="h-8 w-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Accepted Matches</p>
                  <p className="text-2xl font-bold text-gray-900">{acceptedRoommateRequests}</p>
                </div>
                <Users className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
        </div>
      </motion.div>

      {/* Quick Actions Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Quick Summary</CardTitle>
            <CardDescription>Your current activity across the platform</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
              <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg">
                <Home className="h-4 w-4 text-orange-500" />
                <span>
                  <strong>{userRooms.length}</strong> rooms listed
                </span>
              </div>
              <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg">
                <Heart className="h-4 w-4 text-purple-500" />
                <span>
                  <strong>{requestedRooms.length}</strong> room requests sent
                </span>
              </div>
              <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg">
                <User className="h-4 w-4 text-blue-500" />
                <span>
                  <strong>{sentRoommateRequests.length}</strong> roommate requests sent
                </span>
              </div>
              <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg">
                <Users className="h-4 w-4 text-green-500" />
                <span>
                  <strong>{acceptedRoommateRequests}</strong> roommate matches
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default OverviewTab;