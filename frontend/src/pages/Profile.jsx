// components/Profile.jsx (updated)
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useAuthStore } from "@/store/userStore";
import { useRoomStore } from "@/store/roomStore";
import { useRoommateStore } from "@/store/roommateStore";
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

  const {
    sentRequests: sentRoommateRequests,
    receivedRequests: receivedRoommateRequests,
    getRoommateRequests,
    acceptRoommateRequest,
    rejectRoommateRequest,
    cancelRoommateRequest,
    loading: roommateLoading
  } = useRoommateStore();

  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    if (user) {
      fetchUserData();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const fetchUserData = async () => {
    try {
      await Promise.all([
        getUserRooms(),
        getRequestedRooms(),
        getReceivedRequests(),
        getRoommateRequests('sent'),
        getRoommateRequests('received')
      ]);
    } catch (error) {
      console.error('Error fetching user data:', error);
      toast.error('Failed to load user data');
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
        await fetchUserData();
      } else {
        toast.error(`Failed to ${action} request`);
      }
    } catch (error) {
      toast.error(`Failed to ${action} request`);
    }
  };

  const handleRoommateRequestAction = async (requestId, action) => {
    try {
      let result;
      if (action === 'accept') {
        result = await acceptRoommateRequest(requestId);
      } else if (action === 'reject') {
        result = await rejectRoommateRequest(requestId);
      } else if (action === 'cancel') {
        result = await cancelRoommateRequest(requestId);
      }

      if (result.success) {
        toast.success(`Roommate request ${action}ed successfully`);
        await Promise.all([
          getRoommateRequests('sent'),
          getRoommateRequests('received')
        ]);
      } else {
        toast.error(`Failed to ${action} roommate request`);
      }
    } catch (error) {
      toast.error(`Failed to ${action} roommate request`);
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

  const loading = roomsLoading || roommateLoading;

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
                sentRoommateRequests={sentRoommateRequests}
                receivedRoommateRequests={receivedRoommateRequests}
              />
            </TabsContent>

            <TabsContent value="my-rooms" className="mt-6">
              <MyRoomsTab 
                userRooms={userRooms}
                loading={loading}
                onDeleteRoom={handleDeleteRoom}
              />
            </TabsContent>

            <TabsContent value="requests" className="mt-6">
              <RequestsTab
                requestedRooms={requestedRooms}
                receivedRequests={receivedRequests}
                sentRoommateRequests={sentRoommateRequests}
                receivedRoommateRequests={receivedRoommateRequests}
                loading={loading}
                onRequestAction={handleRequestAction}
                onRoommateRequestAction={handleRoommateRequestAction}
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