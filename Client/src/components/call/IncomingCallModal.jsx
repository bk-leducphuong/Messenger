import React from 'react';
import { Avatar, IconButton } from '@mui/material';
import CallIcon from '@mui/icons-material/Call';
import CallEndIcon from '@mui/icons-material/CallEnd';
import '../../assets/styles/call/call.css';

const IncomingCallModal = ({ 
  isOpen, 
  callType,
  callerName,
  onAccept,
  onReject 
}) => {
  if (!isOpen) return null;

  return (
    <div className="incoming-call-modal">
      <div className="incoming-call-container">
        <div className="call-info">
          <Avatar className="caller-avatar" />
          <div className="caller-name">{callerName}</div>
          <div className="call-type">Incoming {callType} call...</div>
        </div>

        <div className="call-actions">
          <IconButton onClick={onAccept} className="accept-call">
            <CallIcon />
          </IconButton>
          <IconButton onClick={onReject} className="reject-call">
            <CallEndIcon />
          </IconButton>
        </div>
      </div>
    </div>
  );
};

export default IncomingCallModal;