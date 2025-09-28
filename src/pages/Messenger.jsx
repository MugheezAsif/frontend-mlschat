import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import MessengerSidebar from "../components/messenger/MessengerSidebar";
import MessengerChatArea from "../components/messenger/MessengerChatArea";
import { useSearchParams, useNavigate } from "react-router-dom";
import ChatEvent from '../components/events/ChatEvent';
import TypingEvent from '../components/events/TypingEvent';
import OnlineStatusEvent from '../components/events/OnlineStatusEvent';
import '../chat.css'
import {
  fetchConversations,
  fetchMessagesForConversation,
  sendMessageToConversation,
  fetchConversationById,
} from "../store/slices/chatSlice";

const MessengerPage = () => {
  const dispatch = useDispatch();
  const { user, token } = useSelector((state) => state.auth);
  const {
    conversations,
    currentMessages,
    activeConversation,
    loading,
    error
  } = useSelector((state) => state.chat);

  const [selectedId, setSelectedId] = useState(null);
  const [input, setInput] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [isChatOpen, setIsChatOpen] = useState(false);
  const convoIdFromUrl = searchParams.get("convo_id");

  useEffect(() => {
    if (user && token) dispatch(fetchConversations());
  }, [dispatch, user, token]);

  useEffect(() => {
    if (!user || !conversations.length) return;

    if (!convoIdFromUrl) {
      setSelectedId(null);
      return;
    }

    const convo = conversations.find(c => String(c.id) === convoIdFromUrl);
    if (convo) {
      setSelectedId(convo.id);
      dispatch(fetchConversationById(convo.id));
      // dispatch(fetchMessagesForConversation(convo.id));
    } else {
      setSelectedId(null);
      navigate("/messenger", { replace: true });
    }
  }, [dispatch, convoIdFromUrl, conversations, searchParams, user]);

  useEffect(() => {
    if (selectedId) {
      dispatch(fetchConversationById(selectedId));
      dispatch(fetchMessagesForConversation(selectedId));
    }
  }, [dispatch, selectedId]);

  const handleSend = async (files = null, mediaUuids = null) => {
    if ((!input.trim() && !files && !mediaUuids) || !selectedId) return;
    
    try {
      if (files) {
        // Send media files (legacy approach)
        await dispatch(sendMessageToConversation({ 
          conversationId: selectedId, 
          text: input,
          media: files 
        })).unwrap();
      } else if (mediaUuids) {
        // Send media using presigned URLs (new approach)
        await dispatch(sendMessageToConversation({ 
          conversationId: selectedId, 
          text: input,
          mediaUuids: mediaUuids 
        })).unwrap();
      } else {
        // Send text message
        await dispatch(sendMessageToConversation({ 
          conversationId: selectedId, 
          text: input 
        })).unwrap();
      }
      
      setInput("");
    } catch (error) {
      console.error('Error sending message:', error);
      throw error; // Re-throw to let the modal handle the error
    }
  };

  if (loading || error) return null;

  return (
    <>
      <ChatEvent conversations={conversations || []} />
      <TypingEvent conversations={conversations || []} />
      <OnlineStatusEvent conversations={conversations || []} />
      <div id="chatPage">
        <div className="container">
          <div className="d-flex gap-2"></div>
          <div className="d-flex gap-2">
            <div className={`d-${isChatOpen ? 'none' : 'block'} d-md-block`}>
              <MessengerSidebar
                selectedId={selectedId}
                setSelected={(c) => {
                  setSearchParams({ convo_id: c.id });
                  setIsChatOpen(true);
                }}
              />
            </div>

            <div className={`d-${isChatOpen ? 'block' : 'none'} d-md-block flex-grow-1`}>
              {activeConversation ? (
                <MessengerChatArea
                  contact={activeConversation}
                  messages={currentMessages}
                  input={input}
                  setInput={setInput}
                  onSend={handleSend}
                  onBack={() => {
                    setSearchParams({ convo_id: null });
                    setIsChatOpen(false)
                  }}
                />
              ) : (
                <div className="flex-grow-1 h-100 d-flex align-items-center justify-content-center text-muted">
                  Select a conversation to start chatting
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MessengerPage;
