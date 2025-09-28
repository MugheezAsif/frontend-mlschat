import { useSelector } from "react-redux";
import React, { useMemo, useState } from "react";
import GroupConversationModal from '../modal/GroupConversationModal';

const MessengerSidebar = ({ selectedId, setSelected }) => {
  const currentUserId = useSelector((state) => state.auth.user?.id);
  const contacts = useSelector((state) => state.chat.conversations) || [];
  const onlineUsers = useSelector((state) => state.chat.onlineUsers) || {};
  const [showGroupModal, setShowGroupModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const getConversationTitle = (conversation) => {
    if (conversation?.type === "group") return conversation?.name || "Untitled Group";
    const otherUser = conversation?.users?.find(u => u?.id && u.id !== currentUserId);
    return otherUser?.name || "Private Chat";
  };

  const getAvatar = (conversation) => {
    if (conversation?.type === "group") {
      return "https://images.unsplash.com/photo-1502444330042-d1a1ddf9bb5b?q=80&w=2373&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";
    }
    const otherUser = conversation?.users?.find(u => u?.id && u.id !== currentUserId);
    return otherUser?.avatar_url || "";
  };

  const isUserOnline = (conversation) => {
    if (conversation?.type === "group") {
      const conversationOnlineUsers = onlineUsers[conversation.id] || {};
      return Object.keys(conversationOnlineUsers).length > 0;
    } else {
      const otherUser = conversation?.users?.find(u => u?.id && u.id !== currentUserId);
      if (!otherUser) return false;
      const conversationOnlineUsers = onlineUsers[conversation.id] || {};
      return conversationOnlineUsers[otherUser.id]?.isOnline || false;
    }
  };

  const getLastMessageText = (conversation) => {
    const last = conversation?.last_message;
    if (!last) return "No messages yet";
    
    if (last.media && last.media.length > 0) {
      const mediaType = last.media[0].media_type;
      const mediaEmoji = {
        'image': '🖼️',
        'video': '🎥',
        'audio': '🎵',
        'document': '📄'
      };
      const emoji = mediaEmoji[mediaType] || '📎';
      const mediaText = `${emoji} ${mediaType}`;
      
      if (last.body && last.body.trim()) {
        return `${mediaText}: ${last.body}`;
      }
      
      return mediaText;
    }
    
    const text = last.body || "";
    return text.length > 30 ? text.slice(0, 30) + "..." : text;
  };

  const getLastMessageTime = (conversation) => {
    const last = conversation?.last_message;
    return last?.created_at
      ? new Date(last.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      : "";
  };

  const uniqueUsers = useMemo(() => {
    const seen = new Set();
    const out = [];
    for (const c of Array.isArray(contacts) ? contacts : []) {
      for (const u of Array.isArray(c?.users) ? c.users : []) {
        if (!u || u.id == null || u.id === currentUserId) continue;
        if (seen.has(u.id)) continue;
        seen.add(u.id);
        out.push(u);
      }
    }
    return out;
  }, [contacts, currentUserId]);

  const filteredContacts = (Array.isArray(contacts) ? contacts : []).filter((c) =>
    (getConversationTitle(c) || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="card-basic my-0">
      <div className="chats-list">
        <div className="list-cont">
          <div className="top">
            <div className="d-flex align-items-center justify-content-between">
              <h4>Chats</h4>
              <span className="cursor-pointer" onClick={() => setShowGroupModal(true)}>
                <i className="fa-solid fa-pen-to-square"></i>
              </span>
            </div>
          </div>

          <div className="search my-3">
            <input
              type="text"
              className="w-100"
              placeholder="Search chats..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="chats">
            {filteredContacts.length > 0 ? (
              filteredContacts.map((c) => (
                <div
                  key={c.id}
                  className={`chat-cont py-3 my-1 ${selectedId === c.id ? 'active' : ''}`}
                  onClick={() => setSelected(c)}
                >
                  <div className="d-flex align-items-center justify-content-between">
                    <div className="d-flex align-items-center gap-2">
                      <div className="user-profile position-relative">
                        <img className="img-fluid" src={getAvatar(c)} alt="user-profile" />
                        {isUserOnline(c) && (
                          <span className="online-dot position-absolute" style={{
                            bottom: '2px',
                            right: '2px',
                            width: '12px',
                            height: '12px',
                            border: '2px solid white'
                          }}></span>
                        )}
                      </div>
                      <div className="details">
                        <p className="mb-1 user-name">{getConversationTitle(c)}</p>
                        <p className="mb-0 message">{getLastMessageText(c)}</p>
                      </div>
                    </div>
                    <div className="time-cont">
                      <p className="mb-0 time">{getLastMessageTime(c)}</p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-muted text-center mt-4">No chats found</p>
            )}
          </div>
        </div>
      </div>

      <GroupConversationModal
        show={showGroupModal}
        onClose={() => setShowGroupModal(false)}
        users={uniqueUsers}
        onCreate={(data) => {
          console.log("Create group with:", data);
          setShowGroupModal(false);
        }}
      />
    </div>
  );
};

export default MessengerSidebar;
