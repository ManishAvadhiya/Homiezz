import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Home, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import RoomCard from "@/components/profile/RoomCard";

const MyRoomsTab = ({ userRooms, loading, onDeleteRoom }) => {
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
                  onDelete={onDeleteRoom}
                  showDelete={true}
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
    </motion.div>
  );
};

export default MyRoomsTab;