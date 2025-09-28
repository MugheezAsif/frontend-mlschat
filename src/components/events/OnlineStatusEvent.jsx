import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { updateUserOnlineStatus } from '../../store/slices/chatSlice';

const OnlineStatusEvent = ({ conversations }) => {
  const user = useSelector((state) => state.auth.user);
  const token = useSelector((state) => state.auth.token);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!user || !token || !Array.isArray(conversations) || !conversations.length || !window.Echo) return;

    const channels = [];

    // Subscribe to online status events for each conversation
    conversations.forEach(conversation => {
      const channelName = `chat.conversation.${conversation.id}`;
      const channel = window.Echo.private(channelName);

      channel.listen('.user.online.status', (eventData) => {
        const { user_id, user_name, user_avatar, is_online, last_seen } = eventData;
        
        if (user_id !== user.id) { // Don't update status for current user
          dispatch(updateUserOnlineStatus({
            conversationId: conversation.id,
            userId: user_id,
            userName: user_name,
            userAvatar: user_avatar,
            isOnline: is_online,
            lastSeen: last_seen
          }));
        }
      });

      channels.push({ channelName, channel });
    });

    window._onlineStatusChannels = channels;

    return () => {
      channels.forEach(({ channel, channelName }) => {
        channel.stopListening('.user.online.status');
        window.Echo.leaveChannel(channelName);
      });
      window._onlineStatusChannels = [];
    };
  }, [user, token, conversations, dispatch]);

  return null;
};

export default OnlineStatusEvent;
