import { motion } from "framer-motion";
import SentRequestsSection from "@/components/profile/SentRequestsSection";
import ReceivedRequestsSection from "@/components/profile/ReceivedRequestsSection";

const RequestsTab = ({ requestedRooms, receivedRequests, loading, onRequestAction }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Sent Requests */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <SentRequestsSection 
          requestedRooms={requestedRooms}
          loading={loading}
          onRequestAction={onRequestAction}
        />
      </motion.div>

      {/* Received Requests */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <ReceivedRequestsSection 
          receivedRequests={receivedRequests}
          loading={loading}
          onRequestAction={onRequestAction}
        />
      </motion.div>
    </div>
  );
};

export default RequestsTab;