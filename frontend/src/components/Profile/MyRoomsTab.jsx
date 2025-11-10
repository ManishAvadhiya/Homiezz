import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Home, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import { useRoomStore } from "@/store/roomStore";
import RoomCard from "./RoomCard";
import EditRoomForm from "./EditRoomForm";
import { toast } from "react-hot-toast";

const MyRoomsTab = () => {
  const { userRooms, updateRoom, getUserRooms, loading, deleteRoom } = useRoomStore();
  const [editingRoom, setEditingRoom] = useState(null);
  const [editLoading, setEditLoading] = useState(false);

  const handleEdit = (room) => {
    console.log("Editing room:", room);
    console.log("Room ID:", room._id);
    setEditingRoom(room);
  };

  const handleSave = async (formData) => {
    if (!editingRoom || !editingRoom._id) {
      toast.error("Invalid room ID");
      return;
    }

    setEditLoading(true);
    try {
      // Prepare the update data in the correct format expected by backend
      const updateData = {
        title: formData.title,
        price: parseInt(formData.price),
        availableBeds: parseInt(formData.availableBeds),
        description: formData.description,
        // Address as individual fields (not nested object)
        address: formData.street,
        city: formData.city,
        state: formData.state,
        pincode: formData.zip,
        // Metadata fields
        area: formData.area,
        landmark: formData.landmark,
        propertyType: formData.propertyType,
        bedrooms: parseInt(formData.bedrooms),
        bathrooms: parseInt(formData.bathrooms)
      };

      console.log("Updating room with ID:", editingRoom._id);
      console.log("Update data:", updateData);

      const result = await updateRoom(editingRoom._id, updateData);
      
      if (result.success) {
        await getUserRooms();
        setEditingRoom(null);
        toast.success("Room updated successfully!");
      } else {
        toast.error(result.message || "Failed to update room");
      }
    } catch (error) {
      console.error("Error updating room:", error);
      toast.error("Failed to update room");
    } finally {
      setEditLoading(false);
    }
  };

  const handleCancel = () => setEditingRoom(null);

  const handleDelete = async (roomId) => {
    if (!roomId) {
      toast.error("Invalid room ID");
      return;
    }
    
    console.log("Deleting room with ID:", roomId);
    await deleteRoom(roomId);
    await getUserRooms();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="border-0 shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          <div>
            <CardTitle>My Listed Rooms</CardTitle>
            <CardDescription>
              Rooms you've listed for rent ({userRooms.length} rooms)
            </CardDescription>
          </div>
          <Link to="/add-rooms">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add New Room
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
            </div>
          ) : userRooms.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2">
              {userRooms.map(room => (
                <RoomCard 
                  key={room._id} 
                  room={room} 
                  onDelete={handleDelete}
                  onEdit={handleEdit}
                  showDelete
                  showEdit
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Home className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900">No rooms listed yet</h3>
              <p className="text-gray-500 mt-2">
                Start by listing your first room for rent
              </p>
              <Link to="/add-rooms">
                <Button className="mt-4">
                  <Plus className="h-4 w-4 mr-2" />
                  List a Room
                </Button>
              </Link>
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Edit Room Modal */}
      {editingRoom && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">Edit Room</h2>
            <EditRoomForm
              room={editingRoom}
              onSave={handleSave}
              onCancel={handleCancel}
              loading={editLoading}
            />
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default MyRoomsTab;