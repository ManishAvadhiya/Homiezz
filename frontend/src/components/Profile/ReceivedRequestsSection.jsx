// components/profile/ReceivedRequestsSection.jsx
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Link } from "react-router-dom";
import RequestCard from "@/components/profile/RequestCard";

const ReceivedRequestsSection = ({ receivedRequests, loading, onRequestAction }) => {
  return (
    <Card className="border-0 shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center text-lg">
          <MessageCircle className="h-5 w-5 mr-2 text-blue-500" />
          Received Requests
        </CardTitle>
        <CardDescription>
          Requests for your listed rooms ({receivedRequests.length} requests)
        </CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
          </div>
        ) : receivedRequests.length > 0 ? (
          <div className="grid gap-3">
            {receivedRequests.map((request) => (
              <RequestCard
                key={request.requestId || request._id}
                request={request}
                type="received"
                onAction={onRequestAction}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <MessageCircle className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900">No requests received yet</h3>
            <p className="text-gray-500 mt-2 mb-6">
              You'll see requests here when users show interest in your listed rooms
            </p>
            <Link to="/add-rooms">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                List More Rooms
              </Button>
            </Link>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ReceivedRequestsSection;