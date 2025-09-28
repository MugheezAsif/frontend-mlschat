import React, { useEffect, useRef, useState } from "react";
import MessengerMessage from "./MessengerMessage";
import TypingIndicator from "./TypingIndicator";
import MediaUpload from "./MediaUpload";
import MediaMessage from "./MediaMessage";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import { useSelector, useDispatch } from "react-redux";
import { loadMoreMessages } from "../../store/slices/chatSlice";
import { markConversationAsRead } from "../../store/slices/chatSlice";
import { applyReadReceipt } from "../../store/slices/chatSlice";
import { startTyping, stopTyping } from "../../services/typingService";
import { useOnlineStatus } from "../../hooks/useOnlineStatus";

const MessengerChatArea = ({ contact, messages, input, setInput, onSend, onBack }) => {
  const currentUser = useSelector((state) => state.auth.user);
  const { messagesMeta, loadingMore, typingUsers, onlineUsers } = useSelector((state) => state.chat);
  const dispatch = useDispatch();
  
  useOnlineStatus(contact?.id);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showMediaUpload, setShowMediaUpload] = useState(false);
  const messagesEndRef = useRef(null);
  const emojiPickerRef = useRef(null);
  const chatBodyRef = useRef(null);
  const [shouldScrollToBottom, setShouldScrollToBottom] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const typingTimeoutRef = useRef(null);
  const isTypingRef = useRef(false);
  const markReadTimerRef = useRef(null);
  const markReadInFlightRef = useRef(false);

  useEffect(() => {
    if (shouldScrollToBottom && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
      setShouldScrollToBottom(false);
    }
  }, [messages, shouldScrollToBottom]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (emojiPickerRef.current && !emojiPickerRef.current.contains(e.target)) {
        setShowEmojiPicker(false);
      }
    };

    if (showEmojiPicker) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showEmojiPicker]);

  // Cleanup typing timeout on unmount
  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      if (isTypingRef.current) {
        handleTypingStop();
      }
    };
  }, []);
  const [isAtBottom, setIsAtBottom] = useState(true);

  useEffect(() => {
    const chatBody = chatBodyRef.current;
    if (!chatBody) return;

    const lastScrollTop = { current: chatBody.scrollTop };

    const handleScroll = () => {
      const currentScrollTop = chatBody.scrollTop;

      const scrollingUp = currentScrollTop < lastScrollTop.current;
      lastScrollTop.current = currentScrollTop;

      if (
        scrollingUp &&
        !loadingMore &&
        messagesMeta.hasMore &&
        currentScrollTop <= 50
      ) {
        dispatch(
          loadMoreMessages({
            conversationId: contact.id,
            page: messagesMeta.currentPage + 1,
          })
        );
      }

      const threshold = 0;
      const atBottom =
        chatBody.scrollHeight - chatBody.scrollTop - chatBody.clientHeight <
        threshold;
      setIsAtBottom(atBottom);
    };

    chatBody.addEventListener("scroll", handleScroll);
    return () => chatBody.removeEventListener("scroll", handleScroll);
  }, [dispatch, contact.id, messagesMeta.hasMore, messagesMeta.currentPage, loadingMore]);

  useEffect(() => {
    if (isAtBottom && chatBodyRef.current) {
      chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    if (!contact?.id || !window.Echo) return;
    const channelName = `chat.conversation.${contact.id}`;
    const channel = window.Echo.private(channelName);
    channel.listen('.chat.message.read', (eventData) => {
      dispatch(applyReadReceipt({
        conversationId: eventData.conversation_id,
        readerUserId: eventData.reader_user_id,
        lastReadMessageId: eventData.last_read_message_id,
      }));
    });
    return () => {
      channel.stopListening('.chat.message.read');
      window.Echo.leaveChannel(channelName);
    };
  }, [dispatch, contact?.id]);

  const scheduleMarkAsRead = () => {
    if (!contact?.id) return;
    if (markReadInFlightRef.current) return;
    if (markReadTimerRef.current) {
      clearTimeout(markReadTimerRef.current);
    }
    markReadTimerRef.current = setTimeout(() => {
      markReadInFlightRef.current = true;
      dispatch(markConversationAsRead(contact.id))
        .finally(() => {
          markReadInFlightRef.current = false;
        });
    }, 200);
  };

  useEffect(() => {
    if (!contact?.id || !Array.isArray(messages) || messages.length === 0) return;
    const newest = messages[0]; // currentMessages keeps newest first
    if (isAtBottom && newest && newest.user_id !== currentUser?.id) {
      scheduleMarkAsRead();
    }
  }, [messages, isAtBottom, dispatch, contact?.id, currentUser?.id]);

  useEffect(() => {
    const onFocus = () => {
      if (contact?.id && isAtBottom) {
        scheduleMarkAsRead();
      }
    };
    window.addEventListener('focus', onFocus);
    return () => window.removeEventListener('focus', onFocus);
  }, [dispatch, contact?.id, isAtBottom]);

  useEffect(() => {
    if (!contact?.id) return;
    scheduleMarkAsRead();
  }, [dispatch, contact?.id]);

  useEffect(() => {
    if (!contact?.id) return;
    if (isAtBottom) {
      scheduleMarkAsRead();
    }
  }, [isAtBottom, dispatch, contact?.id]);


  const getChatTitle = () => {
    if (contact.type === "private") {
      const other = contact.users?.find((u) => u.id !== currentUser.id);
      return other?.name || "Private Chat";
    }
    return contact.name || "Group Chat";
  };

  const getChatAvatar = () => {
    if (contact.type === "private") {
      const other = contact.users?.find((u) => u.id !== currentUser.id);
      return other?.avatar_url ?? 'https://images.unsplash.com/photo-1683029096295-7680306aa37d?q=80&w=3264&auto=format&fit=crop';
    }
    return "https://images.unsplash.com/photo-1502444330042-d1a1ddf9bb5b?q=80&w=2373&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";
  };

  const getOnlineStatusText = () => {
    if (!contact?.id || !onlineUsers[contact.id]) {
      return contact?.type === 'private' ? 'Offline' : `${contact?.users?.length || 0} members`;
    }

    const conversationOnlineUsers = onlineUsers[contact.id];
    const onlineUserCount = Object.keys(conversationOnlineUsers).length;

    if (contact?.type === 'private') {
      // For 1-to-1 chat, show if the other user is online
      const otherUser = contact?.users?.find(u => u?.id !== currentUser?.id);
      if (otherUser && conversationOnlineUsers[otherUser.id]) {
        return 'Online now';
      } else {
        return 'Offline';
      }
    } else {
      // For group chat, show online count
      if (onlineUserCount === 0) {
        return `${contact?.users?.length || 0} members`;
      } else if (onlineUserCount === 1) {
        return `${onlineUserCount} person online`;
      } else {
        return `${onlineUserCount} people online`;
      }
    }
  };

  const getOnlineStatusColor = () => {
    if (!contact?.id || !onlineUsers[contact.id]) {
      return 'text-muted';
    }

    const conversationOnlineUsers = onlineUsers[contact.id];
    const onlineUserCount = Object.keys(conversationOnlineUsers).length;

    if (contact?.type === 'private') {
      // For 1-to-1 chat, check if the other user is online
      const otherUser = contact?.users?.find(u => u?.id !== currentUser?.id);
      if (otherUser && conversationOnlineUsers[otherUser.id]) {
        return 'text-success';
      } else {
        return 'text-muted';
      }
    } else {
      // For group chat, show green if anyone is online
      return onlineUserCount > 0 ? 'text-success' : 'text-muted';
    }
  };

  const addEmoji = (emoji) => {
    setInput((prev) => prev + emoji.native);
  };

  const handleTypingStart = () => {
    if (!contact?.id || isTypingRef.current) return;
    
    isTypingRef.current = true;
    startTyping(contact.id);
  };

  const handleTypingStop = () => {
    if (!contact?.id || !isTypingRef.current) return;
    
    isTypingRef.current = false;
    stopTyping(contact.id);
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setInput(value);
    
    // Start typing indicator
    handleTypingStart();
    
    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    
    // Set timeout to stop typing indicator after 2 seconds of no input
    typingTimeoutRef.current = setTimeout(() => {
      handleTypingStop();
    }, 2000);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSend = async () => {
    if (!input.trim()) return;
    if (isSending) return; // prevent rapid duplicate sends
    setIsSending(true);
    
    // Stop typing indicator when sending message
    handleTypingStop();
    
    // Clear typing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    
    setShouldScrollToBottom(true);
    try {
      const maybePromise = onSend();
      if (maybePromise && typeof maybePromise.then === 'function') {
        await maybePromise;
      }
    } finally {
      setIsSending(false);
    }
  };

  const handleMediaSelect = async (mediaData) => {
    // Stop typing indicator when sending media
    handleTypingStop();
    
    // Clear typing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    
    setShouldScrollToBottom(true);
    
    // Check if mediaData is an array of files (legacy) or media UUIDs (new)
    if (Array.isArray(mediaData) && mediaData.length > 0) {
      if (typeof mediaData[0] === 'string') {
        // New approach: media UUIDs
        await onSend(null, mediaData);
      } else {
        // Legacy approach: files
        await onSend(mediaData);
      }
    }
  };

  return (
    <div className="card-basic my-0 w-100 d-flex flex-column flex-grow-1">
      <div className="main-chat d-flex flex-column flex-grow-1">
        <div className="top border-bottom pb-2 w-100">
          <div className="d-flex align-items-center justify-content-between">
            <div className="d-flex align-items-center">
              <div className="user-profile me-3">
                <img src={getChatAvatar()} alt="Avatar" className="rounded-circle img-fluid" />
              </div>
              <div>
                <p className="mb-0 text-black">{getChatTitle()}</p>
                <p className={`mb-0 chat-user-status ${getOnlineStatusColor()} d-flex align-items-center gap-2`}>
                  {contact?.id && onlineUsers[contact.id] && Object.keys(onlineUsers[contact.id]).length > 0 && (
                    <span className="online-dot-small"></span>
                  )}
                  {getOnlineStatusText()}
                </p>
              </div>
            </div>
            {window.innerWidth < 768 && (
              <button className="btn btn-link d-md-none mb-2" onClick={onBack} >
                <i className="fa fa-arrow-left text-black"></i>
              </button>
            )}
          </div>
        </div>

        <div ref={chatBodyRef} className="chat-body flex-grow-1 overflow-auto py-3">
          {loadingMore && (
            <div className="text-center py-2">
              <div className="spinner-border spinner-border-sm" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <span className="ms-2">Loading more messages...</span>
            </div>
          )}

          {messages?.slice()?.reverse().map((m, i) => (
            <div key={m.id || i} className="d-flex mb-3" style={{ paddingLeft: 12, paddingRight: 12 }}>
              {m.media && m.media.length > 0 ? (
                <div className="w-100">
                  {m.media.map((media, mediaIndex) => (
                    <MediaMessage
                      key={mediaIndex}
                      media={media}
                      message={m}
                      from={m.user_id === currentUser.id ? "me" : "them"}
                      contactAvatar={m.sender?.avatar_url}
                    />
                  ))}
                  {m.body && m.body.trim() && (
                    <MessengerMessage
                      message={{
                        from: m.user_id === currentUser.id ? "me" : "them",
                        text: m.body,
                        time: new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                        readByCount: m.read_by_count,
                        allReadByOthers: m.all_read_by_others,
                      }}
                      contactAvatar={m.sender?.avatar_url}
                    />
                  )}
                </div>
              ) : (
                <MessengerMessage
                  message={{
                    from: m.user_id === currentUser.id ? "me" : "them",
                    text: m.body,
                    time: new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                    readByCount: m.read_by_count,
                    allReadByOthers: m.all_read_by_others,
                  }}
                  contactAvatar={m.sender?.avatar_url}
                />
              )}
            </div>
          ))}
          
          
          {/* Typing Indicator */}
          <TypingIndicator typingUsers={typingUsers} conversationId={contact?.id} />
          
          <div ref={messagesEndRef} />
        </div>

        <div className="bottom border-top pt-3 d-flex gap-2 align-items-center">
          <div className="input-cont">
            {showEmojiPicker && (
              <div ref={emojiPickerRef} className="emoji-picker-cont">
                <Picker
                  data={data}
                  onEmojiSelect={addEmoji}
                  theme="light"
                />
              </div>
            )}
            <button className="emojiPicker" onClick={() => setShowEmojiPicker((prev) => !prev)} >
              <i className="fa-solid fa-face-smile"></i>
            </button>
            <button className="mediaPicker" onClick={() => setShowMediaUpload(true)} >
              <i className="fa-solid fa-paperclip"></i>
            </button>
            <input
              className="message-input w-100"
              placeholder="Type message..."
              value={input}
              onChange={handleInputChange}
              onKeyDown={handleKeyPress}
            />
          </div>
          <button className="sendBtn" onClick={handleSend} >
            <i className="fa-solid fa-paper-plane"></i>
          </button>
        </div>

        {/* Media Upload Modal */}
        {showMediaUpload && (
          <MediaUpload
            onMediaSelect={handleMediaSelect}
            onClose={() => setShowMediaUpload(false)}
            conversationId={contact?.id}
          />
        )}
      </div>
    </div>
  );
};

export default MessengerChatArea;
