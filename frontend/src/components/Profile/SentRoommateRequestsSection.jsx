// components/profile/SentRoommateRequestsSection.jsx
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Loader2, Users } from "lucide-react";
import RoommateRequestCard from "@/components/profile/RoommateRequestCard";
import { Link } from "react-router-dom";
import { Button } from "../ui/button";

const SentRoommateRequestsSection = ({ sentRequests, loading, onRequestAction }) => {
  return (
    <Card className="border-0 shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center text-lg">
          <User className="h-5 w-5 mr-2 text-purple-500" />
          My Roommate Requests
        </CardTitle>
        <CardDescription>
          Roommate requests you've sent ({sentRequests.length} requests)
        </CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
          </div>
        ) : sentRequests.length > 0 ? (
          <div className="grid gap-3">
            {sentRequests.map((request) => (
              <RoommateRequestCard
                key={request._id}
                request={request}
                type="sent"
                onAction={onRequestAction}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <User className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900">No roommate requests sent yet</h3>
            <p className="text-gray-500 mt-2 mb-6">
              Find potential roommates and send them requests
            </p>
            <Link to="/find-roommates">
              <Button>
                <Users className="h-4 w-4 mr-2" />
                Find Roommates
              </Button>
            </Link>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SentRoommateRequestsSection;