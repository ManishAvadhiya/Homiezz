import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Bed, Bath, Home, Eye, Trash2, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";

const RoomCard = ({ room, onDelete, showDelete = false }) => {
  const [deleteLoading, setDeleteLoading] = useState(false);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this room? This action cannot be undone.")) {
      return;
    }

    setDeleteLoading(true);
    try {
      await onDelete(room._id);
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <Card className="overflow-hidden hover:shadow-md transition-all duration-200 border border-gray-200">
      <div className="flex">
        {/* Image Section */}
        <div className="w-1/4 relative">
          <img
            src={room.images?.[0] || "/placeholder-room.jpg"}
            alt={room.title}
            className="w-full h-32 object-cover"
          />
          <Badge className={`absolute top-2 left-2 ${room.isVacant ? 'bg-green-500' : 'bg-red-500'} text-white text-xs`}>
            {room.isVacant ? 'Available' : 'Occupied'}
          </Badge>
        </div>

        {/* Content Section */}
        <div className="w-3/4 p-4">
          <div className="flex justify-between items-start mb-2">
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">{room.title}</h3>
              <div className="flex items-center text-gray-600 mt-1">
                <MapPin className="h-3 w-3 mr-1 text-orange-500" />
                <span className="text-sm line-clamp-1">
                  {room.address?.area && `${room.address.area}, `}{room.address?.city}
                </span>
              </div>
            </div>
            <div className="text-right ml-4">
              <div className="text-xl font-bold text-orange-600">
                ₹{room.price?.toLocaleString()}
              </div>
              <div className="text-xs text-gray-500">per month</div>
            </div>
          </div>

          {/* Quick Details */}
          <div className="flex items-center gap-4 mb-3 text-sm text-gray-600">
            <div className="flex items-center">
              <Bed className="h-4 w-4 mr-1" />
              {room.availableBeds} Beds
            </div>
            <div className="flex items-center">
              <Bath className="h-4 w-4 mr-1" />
              {room.metadata?.bathrooms || 1} Bath
            </div>
            <div className="flex items-center">
              <Home className="h-4 w-4 mr-1" />
              {room.metadata?.propertyType || 'Apartment'}
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-between items-center">
            <div className="text-xs text-gray-500">
              Listed {formatDate(room.createdAt)}
            </div>
            <div className="flex gap-2">
              <Link to={`/room/${room._id}`}>
                <Button size="sm" variant="outline" className="h-8 text-xs">
                  <Eye className="h-3 w-3 mr-1" />
                  View
                </Button>
              </Link>
              {showDelete && (
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={handleDelete}
                  disabled={deleteLoading}
                  className="h-8 text-xs"
                >
                  {deleteLoading ? (
                    <Loader2 className="h-3 w-3 animate-spin" />
                  ) : (
                    <Trash2 className="h-3 w-3 mr-1" />
                  )}
                  Delete
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default RoomCard;