// components/profile/RoommateRequestCard.jsx
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MapPinIcon, Calendar, MessageCircle, PhoneCall, CheckCircle, XCircle, Loader2, User } from "lucide-react";

const RoommateRequestCard = ({ request, type, onAction }) => {
  const [actionLoading, setActionLoading] = useState(false);

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

  const getOtherUser = (request) => {
    return type === 'received' ? request.fromUser : request.toUser;
  };

  const handleAction = async (action) => {
    setActionLoading(true);
    await onAction(request._id, action);
    setActionLoading(false);
  };

  const otherUser = getOtherUser(request);

  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow border border-gray-200">
      <CardContent className="p-4">
        {/* User Info */}
        <div className="flex items-start gap-3 mb-3">
          <Avatar className="h-12 w-12 border-2 border-purple-100">
            <AvatarImage src={otherUser?.avatar} />
            <AvatarFallback className="bg-purple-100 text-purple-600">
              {otherUser?.name?.charAt(0).toUpperCase() || 'U'}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold text-gray-900 truncate">
                  {otherUser?.name || 'Unknown User'}
                </h3>
                <div className="flex items-center mt-1 text-sm text-gray-600">
                  <User className="h-3 w-3 mr-1 text-purple-500" />
                  <span className="truncate">
                    {otherUser?.roommateProfile?.occupationType || 'Not specified'}
                  </span>
                </div>
              </div>
              <div className="text-right ml-2">
                <div className="text-sm font-bold text-purple-600">
                  ₹{otherUser?.roommateProfile?.budget?.toLocaleString() || '0'}
                </div>
                <div className="text-xs text-gray-500">budget</div>
              </div>
            </div>
          </div>
        </div>

        {/* Location and Status */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center text-sm text-gray-600">
            <MapPinIcon className="h-3 w-3 mr-1 text-orange-500" />
            <span className="truncate">
              {otherUser?.roommateProfile?.locationPreference || 'Location not specified'}
            </span>
          </div>
          {getRequestStatusBadge(request.status)}
        </div>

        {/* Request Message */}
        {request.message && (
          <div className="mb-3 p-3 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600">
              <span className="font-medium">
                {type === 'sent' ? 'Your message:' : 'Message:'}
              </span> {request.message}
            </p>
          </div>
        )}

        {/* Lifestyle Preferences */}
        {otherUser?.roommateProfile?.lifestyle && (
          <div className="flex flex-wrap gap-1 mb-3">
            {Object.entries(otherUser.roommateProfile.lifestyle).map(([key, value]) => (
              value && (
                <Badge key={key} variant="secondary" className="text-xs">
                  {key}: {value}
                </Badge>
              )
            ))}
          </div>
        )}

        {/* Actions and Date */}
        <div className="flex justify-between items-center">
          <div className="flex items-center text-xs text-gray-500">
            <Calendar className="h-3 w-3 mr-1" />
            {formatDate(request.createdAt)}
          </div>
          
          <div className="flex gap-2">
            {(request.status === 'pending' || !request.status) && (
              <>
                {type === 'sent' && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleAction('cancel')}
                    disabled={actionLoading}
                    className="h-8 text-xs"
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
                      className="bg-green-600 hover:bg-green-700 h-8 text-xs"
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
                      className="h-8 text-xs"
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
            
            {type === 'received' && otherUser?.phone && (
              <Button 
                size="sm" 
                className="bg-blue-600 hover:bg-blue-700 h-8 text-xs"
                onClick={() => window.open(`tel:${otherUser.phone}`, '_self')}
              >
                <PhoneCall className="h-3 w-3 mr-1" />
                Call
              </Button>
            )}
            
            <Button size="sm" variant="outline" className="h-8 text-xs">
              <MessageCircle className="h-3 w-3 mr-1" />
              Message
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RoommateRequestCard;