import User from '../models/user.js';
import RoommateRequest from '../models/RoommateRequest.js';
import { sendEmail } from '../utils/emailService.js';

// @desc    Send roommate request
// @route   POST /api/roommates/:id/request
// @access  Private
export const sendRoommateRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const { message } = req.body;
    const userId = req.user.userId;

    console.log("Received roommate request for:", id, "from user:", userId);

    // Check if roommate exists and has active profile
    const roommate = await User.findById(id);
    if (!roommate || !roommate.roommateProfile?.isActive) {
      return res.status(404).json({
        success: false,
        message: 'Roommate profile not found or inactive'
      });
    }

    // Check if user is not requesting themselves
    if (id === userId) {
      return res.status(400).json({
        success: false,
        message: 'Cannot send request to yourself'
      });
    }

    // Check if request already exists
    const existingRequest = await RoommateRequest.findOne({
      toUser: id,
      fromUser: userId,
      status: 'pending'
    });

    if (existingRequest) {
      return res.status(400).json({
        success: false,
        message: 'You have already sent a request to this roommate'
      });
    }

    console.log("Creating roommate request...");

    // Create roommate request
    const roommateRequest = await RoommateRequest.create({
      toUser: id,
      fromUser: userId,
      message: message || '',
      status: 'pending'
    });

    console.log("Roommate request created:", roommateRequest._id);

    // Populate the request
    await roommateRequest.populate('fromUser', 'name avatar email phone');
    await roommateRequest.populate('toUser', 'name avatar email');

    // Send email notification to roommate
    if (roommateRequest.toUser.email) {
      await sendEmail({
        to: roommateRequest.toUser.email,
        subject: `New Roommate Request from ${roommateRequest.fromUser.name}`,
        html: `
          <h2>Hello ${roommateRequest.toUser.name},</h2>
          <p>You have received a new roommate request from <b>${roommateRequest.fromUser.name}</b>.</p>
          <p><b>Message:</b> ${roommateRequest.message || "No message provided."}</p>
          <p>Please login to your Homiezz account to view and respond to this request.</p>
          <p>Contact: ${roommateRequest.fromUser.email} ${roommateRequest.fromUser.phone ? `| ${roommateRequest.fromUser.phone}` : ''}</p>
          <br>
          <p>Best regards,<br>Homiezz Team</p>
        `
      });
    }

    res.status(201).json({
      success: true,
      message: 'Roommate request sent successfully',
      data: roommateRequest
    });
  } catch (error) {
    console.error('Error sending roommate request:', error);
    
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid roommate ID'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Server error while sending roommate request'
    });
  }
};

// @desc    Get roommate requests (sent and received)
// @route   GET /api/roommates/requests/all
// @access  Private
export const getRoommateRequests = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { type = 'received' } = req.query;

    let requests;
    let populateFields;

    if (type === 'sent') {
      requests = await RoommateRequest.find({ fromUser: userId })
        .populate('toUser', 'name avatar email phone roommateProfile');
      populateFields = 'toUser';
    } else {
      requests = await RoommateRequest.find({ toUser: userId })
        .populate('fromUser', 'name avatar email phone roommateProfile');
      populateFields = 'fromUser';
    }

    // Sort by creation date (newest first)
    requests.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    res.status(200).json({
      success: true,
      data: requests,
      count: requests.length
    });
  } catch (error) {
    console.error('Error fetching roommate requests:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching roommate requests'
    });
  }
};

// @desc    Accept roommate request
// @route   POST /api/roommates/requests/:requestId/accept
// @access  Private
export const acceptRoommateRequest = async (req, res) => {
  try {
    const { requestId } = req.params;
    const userId = req.user.userId;

    const roommateRequest = await RoommateRequest.findById(requestId)
      .populate('fromUser', 'name avatar email phone')
      .populate('toUser', 'name avatar email');

    if (!roommateRequest) {
      return res.status(404).json({
        success: false,
        message: 'Roommate request not found'
      });
    }

    // Check if user is the recipient of the request
    if (roommateRequest.toUser._id.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to accept this request'
      });
    }

    // Check if request is still pending
    if (roommateRequest.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: 'Request has already been processed'
      });
    }

    // Update request status
    roommateRequest.status = 'accepted';
    await roommateRequest.save();

    // Send email notification to requester
    if (roommateRequest.fromUser.email) {
      await sendEmail({
        to: roommateRequest.fromUser.email,
        subject: `Your Roommate Request was Accepted!`,
        html: `
          <h2>Hi ${roommateRequest.fromUser.name},</h2>
          <p>Great news! Your roommate request to <b>${roommateRequest.toUser.name}</b> has been <span style="color:green;"><b>accepted</b></span>!</p>
          <p>You can now contact them to discuss further details:</p>
          <p><b>Email:</b> ${roommateRequest.toUser.email}</p>
          ${roommateRequest.toUser.phone ? `<p><b>Phone:</b> ${roommateRequest.toUser.phone}</p>` : ''}
          <br>
          <p>Best regards,<br>Homiezz Team</p>
        `
      });
    }

    res.status(200).json({
      success: true,
      message: 'Roommate request accepted successfully',
      data: roommateRequest
    });
  } catch (error) {
    console.error('Error accepting roommate request:', error);
    
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid request ID'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Server error while accepting roommate request'
    });
  }
};

// @desc    Reject roommate request
// @route   POST /api/roommates/requests/:requestId/reject
// @access  Private
export const rejectRoommateRequest = async (req, res) => {
  try {
    const { requestId } = req.params;
    const userId = req.user.userId;

    const roommateRequest = await RoommateRequest.findById(requestId)
      .populate('fromUser', 'name avatar email')
      .populate('toUser', 'name avatar email');

    if (!roommateRequest) {
      return res.status(404).json({
        success: false,
        message: 'Roommate request not found'
      });
    }

    // Check if user is the recipient of the request
    if (roommateRequest.toUser._id.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to reject this request'
      });
    }

    // Check if request is still pending
    if (roommateRequest.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: 'Request has already been processed'
      });
    }

    // Update request status
    roommateRequest.status = 'rejected';
    await roommateRequest.save();

    // Send email notification to requester
    if (roommateRequest.fromUser.email) {
      await sendEmail({
        to: roommateRequest.fromUser.email,
        subject: `Update on Your Roommate Request`,
        html: `
          <h2>Hi ${roommateRequest.fromUser.name},</h2>
          <p>Your roommate request to <b>${roommateRequest.toUser.name}</b> was <span style="color:red;"><b>rejected</b></span>.</p>
          <p>Don't worry! There are many other potential roommates on Homiezz. Keep searching to find your perfect match.</p>
          <br>
          <p>Best regards,<br>Homiezz Team</p>
        `
      });
    }

    res.status(200).json({
      success: true,
      message: 'Roommate request rejected successfully',
      data: roommateRequest
    });
  } catch (error) {
    console.error('Error rejecting roommate request:', error);
    
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid request ID'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Server error while rejecting roommate request'
    });
  }
};

// @desc    Cancel roommate request (for sender)
// @route   POST /api/roommates/requests/:requestId/cancel
// @access  Private
export const cancelRoommateRequest = async (req, res) => {
  try {
    const { requestId } = req.params;
    const userId = req.user.userId;

    const roommateRequest = await RoommateRequest.findById(requestId);

    if (!roommateRequest) {
      return res.status(404).json({
        success: false,
        message: 'Roommate request not found'
      });
    }

    // Check if user is the sender of the request
    if (roommateRequest.fromUser.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to cancel this request'
      });
    }

    // Check if request is still pending
    if (roommateRequest.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: 'Request has already been processed'
      });
    }

    // Update request status
    roommateRequest.status = 'cancelled';
    await roommateRequest.save();

    res.status(200).json({
      success: true,
      message: 'Roommate request cancelled successfully',
      data: roommateRequest
    });
  } catch (error) {
    console.error('Error cancelling roommate request:', error);
    
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid request ID'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Server error while cancelling roommate request'
    });
  }
};

// @desc    Send direct message to roommate
// @route   POST /api/roommates/:id/message
// @access  Private
export const sendRoommateMessage = async (req, res) => {
  try {
    const { id } = req.params;
    const { message } = req.body;
    const userId = req.user.userId;

    // Check if roommate exists
    const roommate = await User.findById(id);
    if (!roommate) {
      return res.status(404).json({
        success: false,
        message: 'Roommate not found'
      });
    }

    // Check if user is not messaging themselves
    if (id === userId) {
      return res.status(400).json({
        success: false,
        message: 'Cannot message yourself'
      });
    }

    // For now, we'll just send an email notification
    // In a real implementation, you might want to integrate with your chat system
    if (roommate.email) {
      const currentUser = await User.findById(userId).select('name email phone');
      
      await sendEmail({
        to: roommate.email,
        subject: `New Message from ${currentUser.name} on Homiezz`,
        html: `
          <h2>Hello ${roommate.name},</h2>
          <p>You have received a new message from <b>${currentUser.name}</b> on Homiezz:</p>
          <p><b>Message:</b> ${message}</p>
          <p>You can reply directly to this email or login to your Homiezz account to continue the conversation.</p>
          <p><b>Contact details:</b></p>
          <p>Email: ${currentUser.email}</p>
          ${currentUser.phone ? `<p>Phone: ${currentUser.phone}</p>` : ''}
          <br>
          <p>Best regards,<br>Homiezz Team</p>
        `
      });
    }

    res.status(200).json({
      success: true,
      message: 'Message sent successfully',
      data: {
        toUser: roommate._id,
        message: message
      }
    });
  } catch (error) {
    console.error('Error sending roommate message:', error);
    
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid roommate ID'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Server error while sending message'
    });
  }
};