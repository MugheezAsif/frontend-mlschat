import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { receiveIncomingMessage, applyReadReceipt, markConversationAsRead } from '../../store/slices/chatSlice';

const ChatEvent = ({ conversations }) => {
  const user = useSelector((state) => state.auth.user);
  const token = useSelector((state) => state.auth.token);
  const activeConversation = useSelector((state) => state.chat.activeConversation);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!user || !token || !Array.isArray(conversations) || !conversations.length || !window.Echo) return;

    const channelName = `chat.${user.id}`;
    const channel = window.Echo.private(channelName);

    channel.listen('.chat.message.sent', (eventData) => {
      dispatch(receiveIncomingMessage({
        conversationId: eventData.message.conversation_id,
        message: eventData.message,
        currentUserId: user.id
      }));

      if (activeConversation?.id === eventData.message.conversation_id) {
        dispatch(markConversationAsRead(eventData.message.conversation_id));
      }
    });

    const convChannels = (conversations || []).map(c => {
      const name = `chat.conversation.${c.id}`;
      const ch = window.Echo.private(name);
      ch.listen('.chat.message.read', (eventData) => {
        dispatch(applyReadReceipt({
          conversationId: eventData.conversation_id,
          readerUserId: eventData.reader_user_id,
          lastReadMessageId: eventData.last_read_message_id,
        }));
      });
      return { channelName: name, channel: ch };
    });

    window._chatChannels = [{ channelName, channel }, ...convChannels];

    return () => {
      channel.stopListening('.chat.message.sent');
      window.Echo.leaveChannel(channelName);
      convChannels.forEach(({ channelName: name, channel: ch }) => {
        ch.stopListening('.chat.message.read');
        window.Echo.leaveChannel(name);
      });
      window._chatChannels = [];
    };
  }, [user, token, conversations, dispatch, activeConversation]);

  return null;
};

export default ChatEvent;
