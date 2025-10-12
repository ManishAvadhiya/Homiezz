import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useAuthStore } from "@/store/userStore";
import { useRoomStore } from "@/store/roomStore";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "react-hot-toast";
import Navbar from "@/components/Navbar";
import ProfileHeader from "@/components/profile/ProfileHeader";
import OverviewTab from "@/components/profile/OverviewTab";
import MyRoomsTab from "@/components/profile/MyRoomsTab";
import RequestsTab from "@/components/profile/RequestsTab";
import SettingsTab from "@/components/profile/SettingsTab";
import { Card, CardContent } from "@/components/ui/card";

const Profile = () => {
  const { user, loading: authLoading } = useAuthStore();
  const {
    userRooms,
    requestedRooms,
    receivedRequests,
    loading: roomsLoading,
    getUserRooms,
    getRequestedRooms,
    getReceivedRequests,
    deleteRoom,
    acceptRequest,
    rejectRequest,
    cancelRequest
  } = useRoomStore();

  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    if (user) {
      fetchUserRoomsData();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const fetchUserRoomsData = async () => {
    try {
      await Promise.all([
        getUserRooms(),
        getRequestedRooms(),
        getReceivedRequests()
      ]);
    } catch (error) {
      console.error('Error fetching rooms data:', error);
      toast.error('Failed to load rooms data');
    }
  };

  const handleDeleteRoom = async (roomId) => {
    if (!window.confirm("Are you sure you want to delete this room? This action cannot be undone.")) {
      return;
    }

    try {
      const result = await deleteRoom(roomId);
      if (result.success) {
        toast.success("Room deleted successfully");
      } else {
        toast.error("Failed to delete room");
      }
    } catch (error) {
      toast.error("Failed to delete room");
    }
  };

  const handleRequestAction = async (requestId, action) => {
    try {
      let result;
      if (action === 'accept') {
        result = await acceptRequest(requestId);
      } else if (action === 'reject') {
        result = await rejectRequest(requestId);
      } else if (action === 'cancel') {
        result = await cancelRequest(requestId);
      }

      if (result.success) {
        toast.success(`Request ${action}ed successfully`);
        await fetchUserRoomsData();
      } else {
        toast.error(`Failed to ${action} request`);
      }
    } catch (error) {
      toast.error(`Failed to ${action} request`);
    }
  };

  if (authLoading) {
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-8"
        >
          <ProfileHeader user={user} />
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="my-rooms">My Rooms</TabsTrigger>
              <TabsTrigger value="requests">Requests</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="mt-6">
              <OverviewTab 
                user={user}
                userRooms={userRooms}
                requestedRooms={requestedRooms}
                receivedRequests={receivedRequests}
              />
            </TabsContent>

            <TabsContent value="my-rooms" className="mt-6">
              <MyRoomsTab 
                userRooms={userRooms}
                loading={roomsLoading}
                onDeleteRoom={handleDeleteRoom}
              />
            </TabsContent>

            <TabsContent value="requests" className="mt-6">
              <RequestsTab
                requestedRooms={requestedRooms}
                receivedRequests={receivedRequests}
                loading={roomsLoading}
                onRequestAction={handleRequestAction}
              />
            </TabsContent>

            <TabsContent value="settings" className="mt-6">
              <SettingsTab user={user} />
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
};

export default Profile;