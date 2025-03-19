import React, { useEffect, useRef, useState } from 'react';
import { Avatar, IconButton } from '@mui/material';
import CallEndIcon from '@mui/icons-material/CallEnd';
import MicIcon from '@mui/icons-material/Mic';
import MicOffIcon from '@mui/icons-material/MicOff';
import VideocamIcon from '@mui/icons-material/Videocam';
import VideocamOffIcon from '@mui/icons-material/VideocamOff';
import '../../assets/styles/call/call.css';

const CallModal = ({ 
  isOpen, 
  callType, // 'audio' or 'video'
  caller,
  receiver,
  onClose,
  socket 
}) => {
  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const localVideoRef = useRef();
  const remoteVideoRef = useRef();
  const peerConnection = useRef(null);

  useEffect(() => {
    if (isOpen) {
      initializeCall();
    }
    return () => {
      cleanupCall();
    };
  }, [isOpen]);

  const initializeCall = async () => {
    try {
      // Get user media based on call type
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: callType === 'video'
      });
      
      setLocalStream(stream);
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }

      // Initialize WebRTC peer connection
      const configuration = {
        iceServers: [
          { urls: 'stun:stun.l.google.com:19302' },
          // Add your TURN server here for production
        ]
      };

      peerConnection.current = new RTCPeerConnection(configuration);

      // Add local stream to peer connection
      stream.getTracks().forEach(track => {
        peerConnection.current.addTrack(track, stream);
      });

      // Handle incoming remote stream
      peerConnection.current.ontrack = (event) => {
        setRemoteStream(event.streams[0]);
        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = event.streams[0];
        }
      };

      // Handle ICE candidates
      peerConnection.current.onicecandidate = (event) => {
        if (event.candidate) {
          socket.emit('call:ice-candidate', {
            candidate: event.candidate,
            receiverId: receiver.user_id
          });
        }
      };

      // Listen for remote ICE candidates
      socket.on('call:ice-candidate', async ({ candidate }) => {
        if (peerConnection.current) {
          await peerConnection.current.addIceCandidate(new RTCIceCandidate(candidate));
        }
      });

      // Handle call acceptance
      socket.on('call:accepted', async ({ answer }) => {
        await peerConnection.current.setRemoteDescription(new RTCSessionDescription(answer));
      });

      // Create and send offer
      const offer = await peerConnection.current.createOffer();
      await peerConnection.current.setLocalDescription(offer);
      
      socket.emit('call:start', {
        caller,
        offer,
        callType,
        receiverId: receiver.user_id
      });

    } catch (error) {
      console.error('Error initializing call:', error);
      onClose();
    }
  };

  const cleanupCall = () => {
    if (localStream) {
      localStream.getTracks().forEach(track => track.stop());
    }
    if (peerConnection.current) {
      peerConnection.current.close();
    }
    setLocalStream(null);
    setRemoteStream(null);
  };

  const handleEndCall = () => {
    socket.emit('call:end', { receiverId: receiver.user_id });
    cleanupCall();
    onClose();
  };

  const toggleMute = () => {
    if (localStream) {
      localStream.getAudioTracks().forEach(track => {
        track.enabled = !track.enabled;
      });
      setIsMuted(!isMuted);
    }
  };

  const toggleVideo = () => {
    if (localStream && callType === 'video') {
      localStream.getVideoTracks().forEach(track => {
        track.enabled = !track.enabled;
      });
      setIsVideoOff(!isVideoOff);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="call-modal">
      <div className="call-container">
        {callType === 'video' && (
          <div className="video-container">
            <video
              ref={remoteVideoRef}
              className="remote-video"
              autoPlay
              playsInline
            />
            <video
              ref={localVideoRef}
              className="local-video"
              autoPlay
              playsInline
              muted
            />
          </div>
        )}
        
        <div className="call-info">
          <Avatar src={receiver.avatar_url} className="caller-avatar" />
          <div className="caller-name">{receiver.username}</div>
          <div className="call-status">
            {remoteStream ? 'Connected' : 'Connecting...'}
          </div>
        </div>

        <div className="call-controls">
          <IconButton onClick={toggleMute} className="control-button">
            {isMuted ? <MicOffIcon /> : <MicIcon />}
          </IconButton>
          
          {callType === 'video' && (
            <IconButton onClick={toggleVideo} className="control-button">
              {isVideoOff ? <VideocamOffIcon /> : <VideocamIcon />}
            </IconButton>
          )}

          <IconButton 
            onClick={handleEndCall} 
            className="control-button end-call"
          >
            <CallEndIcon />
          </IconButton>
        </div>
      </div>
    </div>
  );
};

export default CallModal;