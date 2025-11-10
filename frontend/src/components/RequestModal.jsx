import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useRoomStore } from "@/store/roomStore";
import { toast } from "react-hot-toast";

const RequestModal = ({ room, isOpen, onClose }) => {
  const [loading, setLoading] = useState(false);
  const { requestRoom } = useRoomStore();

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const result = await requestRoom(room._id);
      if (result.success) {
        toast.success('Room request sent successfully!');
        onClose();
      }
    } catch (error) {
      toast.error('Failed to send room request');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Request to Rent Room</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold">{room.title}</h3>
            <p className="text-sm text-gray-600">{room.address?.city}, {room.address?.state}</p>
          </div>
          <p className="text-sm text-gray-600">
            You are requesting to live in this room. The owner will be notified and can accept or reject your request.
          </p>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? 'Sending...' : 'Send Request'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default RequestModal;