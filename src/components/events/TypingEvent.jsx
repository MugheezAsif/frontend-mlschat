import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setTypingUsers, cleanupOldTypingIndicators } from '../../store/slices/chatSlice';

const TypingEvent = ({ conversations }) => {
  const user = useSelector((state) => state.auth.user);
  const token = useSelector((state) => state.auth.token);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!user || !token || !Array.isArray(conversations) || !conversations.length || !window.Echo) return;

    const channels = [];

    // Subscribe to typing events for each conversation
    conversations.forEach(conversation => {
      const channelName = `chat.conversation.${conversation.id}`;
      const channel = window.Echo.private(channelName);

      channel.listen('.chat.typing', (eventData) => {
        const { user_id, user_name, is_typing, user_avatar } = eventData;
        
        if (user_id !== user.id) { // Don't show typing indicator for current user
          dispatch(setTypingUsers({
            conversationId: conversation.id,
            userId: user_id,
            userName: user_name,
            isTyping: is_typing,
            userAvatar: user_avatar
          }));
        }
      });

      channels.push({ channelName, channel });
    });

    window._typingChannels = channels;

    return () => {
      channels.forEach(({ channel, channelName }) => {
        channel.stopListening('.chat.typing');
        window.Echo.leaveChannel(channelName);
      });
      window._typingChannels = [];
    };
  }, [user, token, conversations, dispatch]);

  // Cleanup old typing indicators every 5 seconds
  useEffect(() => {
    const cleanupInterval = setInterval(() => {
      dispatch(cleanupOldTypingIndicators());
    }, 5000);

    return () => clearInterval(cleanupInterval);
  }, [dispatch]);

  return null;
};

export default TypingEvent;
