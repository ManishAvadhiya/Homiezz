// components/profile/ReceivedRoommateRequestsSection.jsx
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Loader2, UserPlus } from "lucide-react";
import RoommateRequestCard from "@/components/profile/RoommateRequestCard";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const ReceivedRoommateRequestsSection = ({ receivedRequests, loading, onRequestAction }) => {
  return (
    <Card className="border-0 shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center text-lg">
          <UserPlus className="h-5 w-5 mr-2 text-blue-500" />
          Received Roommate Requests
        </CardTitle>
        <CardDescription>
          People interested in being your roommate ({receivedRequests.length} requests)
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
              <RoommateRequestCard
                key={request._id}
                request={request}
                type="received"
                onAction={onRequestAction}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <UserPlus className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900">No roommate requests received yet</h3>
            <p className="text-gray-500 mt-2 mb-6">
              Create a roommate profile to start receiving requests from potential roommates
            </p>
            <Link to="/roommate-profile">
              <Button>
                <User className="h-4 w-4 mr-2" />
                Create Roommate Profile
              </Button>
            </Link>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ReceivedRoommateRequestsSection;