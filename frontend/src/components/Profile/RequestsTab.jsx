// components/profile/RequestsTab.jsx
import { motion } from "framer-motion";
import SentRequestsSection from "@/components/profile/SentRequestsSection";
import ReceivedRequestsSection from "@/components/profile/ReceivedRequestsSection";
import SentRoommateRequestsSection from "@/components/profile/SentRoommateRequestsSection";
import ReceivedRoommateRequestsSection from "@/components/profile/ReceivedRoommateRequestsSection";

const RequestsTab = ({ 
  requestedRooms, 
  receivedRequests, 
  sentRoommateRequests,
  receivedRoommateRequests,
  loading, 
  onRequestAction,
  onRoommateRequestAction 
}) => {
  return (
    <div className="space-y-8">
      {/* Room Requests */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Room Requests</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <SentRequestsSection 
            requestedRooms={requestedRooms}
            loading={loading}
            onRequestAction={onRequestAction}
          />
          <ReceivedRequestsSection 
            receivedRequests={receivedRequests}
            loading={loading}
            onRequestAction={onRequestAction}
          />
        </div>
      </motion.div>

      {/* Roommate Requests */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Roommate Requests</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <SentRoommateRequestsSection 
            sentRequests={sentRoommateRequests}
            loading={loading}
            onRequestAction={onRoommateRequestAction}
          />
          <ReceivedRoommateRequestsSection 
            receivedRequests={receivedRoommateRequests}
            loading={loading}
            onRequestAction={onRoommateRequestAction}
          />
        </div>
      </motion.div>
    </div>
  );
};

export default RequestsTab;