import React from 'react';
import { Avatar, IconButton } from '@mui/material';
import CallIcon from '@mui/icons-material/Call';
import CallEndIcon from '@mui/icons-material/CallEnd';
import '../../assets/styles/call/call.css';
import { useState, useEffect } from 'react';
import { 
  initIncomingCallSound, 
  playIncomingCallSound, 
  stopIncomingCallSound 
} from '../../utils/soundUtils';

const IncomingCallModal = ({ 
  isOpen, 
  callType,
  callerName,
  onAccept,
  onReject 
}) => {
  const [isPlayingSound, setIsPlayingSound] = useState(false);
  
  // Initialize the sound when component mounts
  useEffect(() => {
    initIncomingCallSound(true).catch(error => {
      console.error("Failed to initialize call sound:", error);
    });
    
    // Cleanup when component unmounts
    return () => {
      stopIncomingCallSound();
    };
  }, []);
  
  // Handle sound playing when modal opens/closes
  useEffect(() => {
    if (isOpen && !isPlayingSound) {
      playIncomingCallSound()
        .then(() => {
          setIsPlayingSound(true);
        })
        .catch(error => {
          console.error("Error playing incoming call sound:", error);
        });
    } else if (!isOpen && isPlayingSound) {
      stopIncomingCallSound();
      setIsPlayingSound(false);
    }
  }, [isOpen, isPlayingSound]);
  
  const handleAccept = () => {
    stopIncomingCallSound();
    setIsPlayingSound(false);
    onAccept();
  };
  
  const handleReject = () => {
    stopIncomingCallSound();
    setIsPlayingSound(false);
    onReject();
  };
  
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
          <IconButton onClick={handleAccept} className="accept-call">
            <CallIcon />
          </IconButton>
          <IconButton onClick={handleReject} className="reject-call">
            <CallEndIcon />
          </IconButton>
        </div>
      </div>
    </div>
  );
};

export default IncomingCallModal;