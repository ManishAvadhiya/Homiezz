import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Mail, Phone, Shield, Home, Heart, MessageCircle, Building, User } from "lucide-react";

const OverviewTab = ({ user, userRooms, requestedRooms, receivedRequests }) => {
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

      {/* Quick Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
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
      </motion.div>
    </div>
  );
};

export default OverviewTab;