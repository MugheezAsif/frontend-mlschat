import { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { updateOnlineStatus, sendHeartbeat, getConversationOnlineStatus } from '../services/onlineStatusService';
import { setConversationOnlineStatus } from '../store/slices/chatSlice';
import { useDispatch } from 'react-redux';

export const useOnlineStatus = (conversationId) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const heartbeatIntervalRef = useRef(null);
  const isOnlineRef = useRef(false);

  // Initialize online status when component mounts
  useEffect(() => {
    if (!user || !conversationId) return;

    const initializeOnlineStatus = async () => {
      try {
        // Set user as online
        await updateOnlineStatus(true, conversationId);
        isOnlineRef.current = true;

        // Get initial online status for the conversation
        const statusData = await getConversationOnlineStatus(conversationId);
        if (statusData) {
          dispatch(setConversationOnlineStatus({
            conversationId,
            onlineUsers: statusData.online_users,
            onlineCount: statusData.online_count,
            totalUsers: statusData.total_users
          }));
        }

        // Start heartbeat
        startHeartbeat();
      } catch (error) {
        console.error('Error initializing online status:', error);
      }
    };

    initializeOnlineStatus();

    // Cleanup function
    return () => {
      cleanup();
    };
  }, [user, conversationId, dispatch]);

  // Handle page visibility changes
  useEffect(() => {
    const handleVisibilityChange = async () => {
      if (!user || !conversationId) return;

      if (document.hidden) {
        // Page is hidden, set user as offline
        await updateOnlineStatus(false, conversationId);
        isOnlineRef.current = false;
        stopHeartbeat();
      } else {
        // Page is visible, set user as online
        await updateOnlineStatus(true, conversationId);
        isOnlineRef.current = true;
        startHeartbeat();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [user, conversationId]);

  // Handle beforeunload event
  useEffect(() => {
    const handleBeforeUnload = async () => {
      if (!user || !conversationId) return;
      
      // Set user as offline when leaving the page
      await updateOnlineStatus(false, conversationId);
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [user, conversationId]);

  const startHeartbeat = () => {
    if (heartbeatIntervalRef.current) {
      clearInterval(heartbeatIntervalRef.current);
    }

    // Send heartbeat every 30 seconds
    heartbeatIntervalRef.current = setInterval(async () => {
      if (user && conversationId && isOnlineRef.current) {
        try {
          await sendHeartbeat(conversationId);
        } catch (error) {
          console.error('Error sending heartbeat:', error);
        }
      }
    }, 30000);
  };

  const stopHeartbeat = () => {
    if (heartbeatIntervalRef.current) {
      clearInterval(heartbeatIntervalRef.current);
      heartbeatIntervalRef.current = null;
    }
  };

  const cleanup = async () => {
    stopHeartbeat();
    
    if (user && conversationId && isOnlineRef.current) {
      try {
        await updateOnlineStatus(false, conversationId);
        isOnlineRef.current = false;
      } catch (error) {
        console.error('Error setting offline status:', error);
      }
    }
  };

  return {
    isOnline: isOnlineRef.current,
    startHeartbeat,
    stopHeartbeat,
    cleanup
  };
};
