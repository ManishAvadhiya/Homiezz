// components/profile/RequestCard.jsx
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MapPinIcon, Bed, Bath, Home, Eye, XCircle, CheckCircle, PhoneCall, Calendar, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";

const RequestCard = ({ request, type, onAction }) => {
  const [actionLoading, setActionLoading] = useState(false);

  const getRoomFromRequest = (request) => {
    if (request.room) return request.room;
    if (request.roomId) return request;
    return request;
  };

  const getRequesterFromRequest = (request) => {
    return request.requester || {};
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getRequestStatusBadge = (status) => {
    const statusConfig = {
      pending: { label: "Pending", color: "bg-yellow-100 text-yellow-800 border-yellow-200" },
      accepted: { label: "Accepted", color: "bg-green-100 text-green-800 border-green-200" },
      rejected: { label: "Rejected", color: "bg-red-100 text-red-800 border-red-200" },
      cancelled: { label: "Cancelled", color: "bg-gray-100 text-gray-800 border-gray-200" }
    };
    
    const config = statusConfig[status] || statusConfig.pending;
    return <Badge variant="outline" className={`${config.color} border text-xs`}>{config.label}</Badge>;
  };

  const handleAction = async (action) => {
    setActionLoading(true);
    const requestId = request.requestId || request._id;
    await onAction(requestId, action);
    setActionLoading(false);
  };

  const room = getRoomFromRequest(request);
  const requester = getRequesterFromRequest(request);

  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow border border-gray-200">
      <div className="flex">
        {/* Room Image - Compact on left */}
        <div className="w-2/7 relative flex-shrink-0">
          <img
            src={room.images?.[0] || "/placeholder-room.jpg"}
            alt={room.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute top-1 left-1">
            {getRequestStatusBadge(request.status || 'pending')}
          </div>
        </div>

        {/* Content - Right side */}
        <div className="flex-1 p-3">
          <div className="flex justify-between items-start mb-2">
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-semibold text-gray-900 line-clamp-1">
                    {room.title || 'Room'}
                  </h3>
                  <div className="flex items-center mt-1 text-xs text-gray-600">
                    <MapPinIcon className="h-3 w-3 mr-1 text-orange-500 flex-shrink-0" />
                    <span className="line-clamp-1">
                      {room.address?.area && `${room.address.area}, `}{room.address?.city}
                      {!room.address?.area && !room.address?.city && 'Location not specified'}
                    </span>
                  </div>
                </div>
                <div className="text-right ml-2 flex-shrink-0">
                  <div className="text-sm font-bold text-orange-600">
                    ₹{room.price?.toLocaleString() || '0'}
                  </div>
                  <div className="text-xs text-gray-500">month</div>
                </div>
              </div>
            </div>
          </div>

          {/* Requester Information (for received requests) */}
          {type === 'received' && (
            <div className="flex items-center gap-2 mb-2">
              <Avatar className="h-6 w-6">
                <AvatarImage src={requester.avatar} />
                <AvatarFallback className="bg-purple-100 text-purple-600 text-xs">
                  {requester.name?.charAt(0).toUpperCase() || 'U'}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-gray-900 truncate">{requester.name || 'Unknown User'}</p>
                <div className="flex items-center gap-2 text-xs text-gray-600">
                  {requester.phone && (
                    <span className="truncate">{requester.phone}</span>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Quick Room Details */}
          <div className="flex items-center gap-3 mb-2 text-xs text-gray-600">
            <div className="flex items-center">
              <Bed className="h-3 w-3 mr-1" />
              {room.availableBeds || 1}
            </div>
            <div className="flex items-center">
              <Bath className="h-3 w-3 mr-1" />
              {room.metadata?.bathrooms || 1}
            </div>
            <div className="flex items-center">
              <Home className="h-3 w-3 mr-1" />
              {room.metadata?.propertyType || 'Apt'}
            </div>
          </div>

          {/* Actions and Date */}
          <div className="flex justify-between items-center">
            <div className="flex items-center text-xs text-gray-500">
              <Calendar className="h-3 w-3 mr-1" />
              {formatDate(request.createdAt)}
            </div>
            
            <div className="flex gap-1">
              {(request.status === 'pending' || !request.status) && (
                <>
                  {type === 'sent' && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleAction('cancel')}
                      disabled={actionLoading}
                      className="h-7 text-xs"
                    >
                      {actionLoading ? (
                        <Loader2 className="h-3 w-3 animate-spin" />
                      ) : (
                        <XCircle className="h-3 w-3 mr-1" />
                      )}
                      Cancel
                    </Button>
                  )}
                  {type === 'received' && (
                    <>
                      <Button
                        size="sm"
                        onClick={() => handleAction('accept')}
                        disabled={actionLoading}
                        className="bg-green-600 hover:bg-green-700 h-7 text-xs"
                      >
                        {actionLoading ? (
                          <Loader2 className="h-3 w-3 animate-spin" />
                        ) : (
                          <CheckCircle className="h-3 w-3 mr-1" />
                        )}
                        Accept
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleAction('reject')}
                        disabled={actionLoading}
                        className="h-7 text-xs"
                      >
                        {actionLoading ? (
                          <Loader2 className="h-3 w-3 animate-spin" />
                        ) : (
                          <XCircle className="h-3 w-3 mr-1" />
                        )}
                        Reject
                      </Button>
                    </>
                  )}
                </>
              )}
              <Link to={`/room/${room._id}`}>
                <Button size="sm" variant="outline" className="h-7 text-xs">
                  <Eye className="h-3 w-3 mr-1" />
                  View
                </Button>
              </Link>
              {type === 'sent' && room.owner?.phone && (
                <Button 
                  size="sm" 
                  className="bg-green-600 hover:bg-green-700 h-7 text-xs"
                  onClick={() => window.open(`tel:${room.owner.phone}`, '_self')}
                >
                  <PhoneCall className="h-3 w-3 mr-1" />
                  Call
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default RequestCard;