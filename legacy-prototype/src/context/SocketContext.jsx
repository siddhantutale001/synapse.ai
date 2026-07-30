import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [roomCode, setRoomCode] = useState(null);
  const [collaborators, setCollaborators] = useState([]);
  const [activeTabSync, setActiveTabSync] = useState(null);

  useEffect(() => {
    // Connect to backend Socket.IO server
    const newSocket = io(window.location.origin, {
      reconnectionAttempts: 5,
      timeout: 10000,
    });

    newSocket.on('connect', () => {
      console.log('⚡ Connected to WebSockets Gateway:', newSocket.id);
    });

    newSocket.on('room_presence_update', (users) => {
      setCollaborators(users);
    });

    newSocket.on('tab_changed', (tabId) => {
      setActiveTabSync(tabId);
    });

    setSocket(newSocket);

    return () => newSocket.close();
  }, []);

  const joinRoom = (code, username = 'Collaborator') => {
    if (!socket) return;
    setRoomCode(code);
    socket.emit('join_room', { roomCode: code, username });
  };

  const leaveRoom = () => {
    if (!socket || !roomCode) return;
    socket.emit('leave_room', { roomCode });
    setRoomCode(null);
    setCollaborators([]);
  };

  const broadcastTab = (tabId) => {
    if (!socket || !roomCode) return;
    socket.emit('change_tab', { roomCode, tabId });
  };

  const broadcastRoadmapToggle = (stepNumber, completed) => {
    if (!socket || !roomCode) return;
    socket.emit('roadmap_step_toggle', { roomCode, stepNumber, completed });
  };

  return (
    <SocketContext.Provider
      value={{
        socket,
        roomCode,
        collaborators,
        activeTabSync,
        joinRoom,
        leaveRoom,
        broadcastTab,
        broadcastRoadmapToggle,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
