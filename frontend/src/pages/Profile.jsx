import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useAuthStore } from "@/store/userStore";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Mail, Phone, User, Shield, Home, Building, Edit, Save } from "lucide-react";
import { toast } from "react-hot-toast";
import Navbar from "@/components/Navbar";

const Profile = () => {
  const { user, loading, updateProfile } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  });
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
      });
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async () => {
    try {
      const result = await updateProfile(formData);
      if (result.success) {
        toast.success("Profile updated successfully");
        setIsEditing(false);
      }
    } catch (error) {
      toast.error("Failed to update profile");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <p className="text-center">Please log in to view your profile</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Get initials for avatar
  const getInitials = (name) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase();
  };

  // Role-based styling
  const roleConfig = {
    owner: {
      badge: "bg-amber-100 text-amber-800 hover:bg-amber-100",
      gradient: "from-amber-500 to-amber-600",
      icon: <Home className="h-5 w-5" />
    },
    tenant: {
      badge: "bg-purple-100 text-purple-800 hover:bg-purple-100",
      gradient: "from-purple-500 to-purple-600",
      icon: <Building className="h-5 w-5" />
    },
    admin: {
      badge: "bg-red-100 text-red-800 hover:bg-red-100",
      gradient: "from-red-500 to-red-600",
      icon: <Shield className="h-5 w-5" />
    }
  };

  const userRole = user.role?.toLowerCase() || 'tenant';
  const config = roleConfig[userRole] || roleConfig.tenant;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <Navbar />
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-8"
        >
          {/* Header Section */}
          <Card className="overflow-hidden border-0 shadow-lg">
            <div className={`h-32 bg-gradient-to-r ${config.gradient}`} />
            <CardContent className="pt-0 relative">
              <div className="flex flex-col items-center -mt-16">
                <Avatar className="h-24 w-24 border-4 border-white shadow-lg">
                  <AvatarImage src={user.avatar} />
                  <AvatarFallback className="text-2xl font-bold bg-white">
                    {getInitials(user.name)}
                  </AvatarFallback>
                </Avatar>
                <div className="text-center mt-4">
                  <h1 className="text-2xl font-bold text-gray-900">{user.name}</h1>
                  <div className="flex items-center justify-center mt-2 space-x-2">
                    <Badge variant="outline" className={config.badge}>
                      <div className="flex items-center">
                        {config.icon}
                        <span className="ml-1 capitalize">{user.role}</span>
                      </div>
                    </Badge>
                    {user.isVerified && (
                      <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-100">
                        Verified
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Content Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6 mt-6">
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

              {/* Role-specific content */}
              {userRole === 'owner' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Home className="h-5 w-5 mr-2" />
                        Property Owner Dashboard
                      </CardTitle>
                      <CardDescription>Manage your properties and tenants</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-700">
                        As a property owner, you can list properties, manage tenants, and track rent payments.
                      </p>
                      <Button className="mt-4 bg-amber-600 hover:bg-amber-700">
                        Manage Properties
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              )}

              {userRole === 'tenant' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Building className="h-5 w-5 mr-2" />
                        Tenant Information
                      </CardTitle>
                      <CardDescription>Your rental details and agreements</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-700">
                        As a tenant, you can view your rental agreements, payment history, and maintenance requests.
                      </p>
                      <Button className="mt-4 bg-purple-600 hover:bg-purple-700">
                        View Rental Details
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </TabsContent>

            <TabsContent value="settings" className="mt-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle>Edit Profile</CardTitle>
                    <CardDescription>Update your personal information</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        placeholder="Enter your phone number"
                      />
                    </div>
                    <div className="flex justify-end space-x-2 pt-4">
                      {isEditing ? (
                        <>
                          <Button variant="outline" onClick={() => setIsEditing(false)}>
                            Cancel
                          </Button>
                          <Button onClick={handleSave}>
                            <Save className="h-4 w-4 mr-2" />
                            Save Changes
                          </Button>
                        </>
                      ) : (
                        <Button onClick={() => setIsEditing(true)}>
                          <Edit className="h-4 w-4 mr-2" />
                          Edit Profile
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
};

export default Profile;