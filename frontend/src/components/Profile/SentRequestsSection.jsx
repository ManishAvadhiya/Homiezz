import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, Heart, Loader2 } from "lucide-react";
import RequestCard from "@/components/profile/RequestCard";
import { Link } from "react-router-dom";
import { Button } from "../ui/button";

const SentRequestsSection = ({ requestedRooms, loading, onRequestAction }) => {
  return (
    <Card className="border-0 shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center text-lg">
          <Heart className="h-5 w-5 mr-2 text-purple-500" />
          My Room Requests
        </CardTitle>
        <CardDescription>
          Rooms you've requested to rent ({requestedRooms.length} requests)
        </CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
          </div>
        ) : requestedRooms.length > 0 ? (
          <div className="grid gap-3">
            {requestedRooms.map((request) => (
              <RequestCard
                key={request.requestId || request._id}
                request={request}
                type="sent"
                onAction={onRequestAction}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Heart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900">No room requests sent yet</h3>
            <p className="text-gray-500 mt-2 mb-6">
              Start exploring rooms and send requests to interested properties
            </p>
            <Link to="/find-rooms">
              <Button>
                <Eye className="h-4 w-4 mr-2" />
                Browse Rooms
              </Button>
            </Link>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SentRequestsSection;