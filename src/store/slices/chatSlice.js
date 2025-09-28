import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { apiFetch } from '../../lib/apiClient';

export const fetchConversations = createAsyncThunk(
  "chat/fetchConversations",
  async () => {
    const data = await apiFetch(`${APP_BASE_URL}/api/chats/conversations`);
    return data.data;
  }
);

export const fetchMessagesForConversation = createAsyncThunk(
  "chat/fetchMessagesForConversation",
  async (conversationId) => {
    const data = await apiFetch(`${APP_BASE_URL}/api/chats/conversations/${conversationId}/messages`);
    return data.data || [];
  }
);

export const loadMoreMessages = createAsyncThunk(
  "chat/loadMoreMessages",
  async ({ conversationId, page }) => {
    const data = await apiFetch(`${APP_BASE_URL}/api/chats/conversations/${conversationId}/messages?page=${page}`);
    return data.data || [];
  }
);

export const sendMessageToConversation = createAsyncThunk(
  "chat/sendMessageToConversation",
  async ({ conversationId, text, media, mediaUuids }) => {
    // Support both legacy file upload and new presigned URL approach
    if (media && media.length > 0) {
      // Legacy direct file upload approach
      const formData = new FormData();
      formData.append('conversation_id', conversationId);
      if (text) {
        formData.append('body', text);
      }
      
      media.forEach(file => {
        formData.append('media[]', file);
      });

      const data = await apiFetch(`${APP_BASE_URL}/api/chats/messages`, {
        method: "POST",
        body: formData,
      });
      return data.data;
    } else if (mediaUuids && mediaUuids.length > 0) {
      // New presigned URL approach
      const payload = {
        conversation_id: conversationId,
        body: text || '',
        media_uuids: mediaUuids,
      };

      const data = await apiFetch(`${APP_BASE_URL}/api/chats/messages`, {
        method: "POST",
        body: JSON.stringify(payload),
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return data.data;
    } else {
      // Text-only message
      const payload = {
        conversation_id: conversationId,
        body: text,
      };

      const data = await apiFetch(`${APP_BASE_URL}/api/chats/messages`, {
        method: "POST",
        body: JSON.stringify(payload),
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return data.data;
    }
  }
);

export const fetchConversationById = createAsyncThunk(
  "chat/fetchConversationById",
  async (conversationId) => {
    const data = await apiFetch(`${APP_BASE_URL}/api/chats/conversations/${conversationId}`);
    return data.data;
  }
);

export const createPrivateConversation = createAsyncThunk(
  "chat/createPrivateConversation",
  async (userId, { rejectWithValue }) => {
    try {
      const data = await apiFetch(`${APP_BASE_URL}/api/chats/conversations`, {
        method: "POST",
        body: JSON.stringify({
          type: "private",
          user_ids: [userId],
        }),
      });
      return data.data;
    } catch (error) {
      return rejectWithValue(error.message || "Unknown error");
    }
  }
);

export const markConversationAsRead = createAsyncThunk(
  "chat/markConversationAsRead",
  async (conversationId) => {
    const data = await apiFetch(`${APP_BASE_URL}/api/chats/conversations/${conversationId}/mark-read`, {
      method: "PUT",
    });
    return data.data;
  }
);

const chatSlice = createSlice({
  name: "chat",
  initialState: {
    conversations: [],
    currentMessages: [],
    activeConversation: null,
    loading: false,
    error: null,
    messagesMeta: {
      currentPage: 1,
      lastPage: 1,
      total: 0,
      hasMore: false,
      nextPageUrl: null,
    },
    loadingMore: false,
    typingUsers: {}, 
    onlineUsers: {},
  },
  reducers: {
    applyReadReceipt: (state, action) => {
      const { conversationId, readerUserId, lastReadMessageId } = action.payload;
      if (!conversationId || !readerUserId) return;

      // Update currentMessages (active thread)
      if (state.activeConversation?.id === conversationId) {
        state.currentMessages = state.currentMessages.map(m => {
          if (m.user_id !== readerUserId && lastReadMessageId && m.id <= lastReadMessageId) {
            const readBy = new Set(m.read_by_user_ids || []);
            readBy.add(readerUserId);
            const participantsExceptSenderCount = (state.activeConversation?.users?.length || 1) - 1;
            return {
              ...m,
              read_by_user_ids: Array.from(readBy),
              read_by_count: Array.from(readBy).length,
              all_read_by_others: Array.from(readBy).length >= Math.max(participantsExceptSenderCount, 0),
            };
          }
          return m;
        });
      }

      // Update last_message in conversations list if needed
      const idx = state.conversations.findIndex(c => c.id === conversationId);
      if (idx !== -1) {
        const convo = state.conversations[idx];
        if (convo.last_message && convo.last_message.user_id !== readerUserId && lastReadMessageId && convo.last_message.id <= lastReadMessageId) {
          const readBy = new Set(convo.last_message.read_by_user_ids || []);
          readBy.add(readerUserId);
          const participantsExceptSenderCount = (convo.users?.length || 1) - 1;
          convo.last_message = {
            ...convo.last_message,
            read_by_user_ids: Array.from(readBy),
            read_by_count: Array.from(readBy).length,
            all_read_by_others: Array.from(readBy).length >= Math.max(participantsExceptSenderCount, 0),
          };
        }
      }
    },
    receiveIncomingMessage: (state, action) => {
      const { conversationId, message, currentUserId } = action.payload;
      
      if (state.activeConversation?.id === conversationId && currentUserId !== message.user_id) {
        state.currentMessages.unshift(message);
      } 

      const convoIndex = state.conversations.findIndex(c => c.id === conversationId);
        const convo = state.conversations[convoIndex];
        convo.messages = convo.messages || [];
        convo.messages.unshift(message);
        convo.updated_at = message.created_at;
        convo.last_message = message;
        state.conversations.splice(convoIndex, 1);
        state.conversations.unshift(convo);
    },

    receiveMessage: (state, action) => {
      const msg = action.payload;

      if (state.activeConversation?.id === msg.conversation_id) {
        state.currentMessages.unshift(msg);
      }

      const convoIndex = state.conversations.findIndex(c => c.id === msg.conversation_id);
      if (convoIndex !== -1) {
        const convo = state.conversations[convoIndex];
        convo.messages = convo.messages || [];
        convo.messages.unshift(msg);
        convo.updated_at = msg.created_at;

        state.conversations.splice(convoIndex, 1);
        state.conversations.unshift(convo);
      }
    },

    setTypingUsers: (state, action) => {
      const { conversationId, userId, userName, isTyping, userAvatar } = action.payload;
      
      if (!state.typingUsers[conversationId]) {
        state.typingUsers[conversationId] = {};
      }

      if (isTyping) {
        state.typingUsers[conversationId][userId] = {
          userName,
          userAvatar,
          timestamp: Date.now()
        };
      } else {
        delete state.typingUsers[conversationId][userId];
      }
    },

    cleanupOldTypingIndicators: (state) => {
      const now = Date.now();
      const timeout = 10000; // 10 seconds

      Object.keys(state.typingUsers).forEach(conversationId => {
        Object.keys(state.typingUsers[conversationId]).forEach(userId => {
          const typingUser = state.typingUsers[conversationId][userId];
          if (now - typingUser.timestamp > timeout) {
            delete state.typingUsers[conversationId][userId];
          }
        });
      });
    },

    clearTypingUsers: (state, action) => {
      const conversationId = action.payload;
      if (state.typingUsers[conversationId]) {
        delete state.typingUsers[conversationId];
      }
    },

    updateUserOnlineStatus: (state, action) => {
      const { conversationId, userId, userName, userAvatar, isOnline, lastSeen } = action.payload;
      
      if (!state.onlineUsers[conversationId]) {
        state.onlineUsers[conversationId] = {};
      }

      if (isOnline) {
        state.onlineUsers[conversationId][userId] = {
          userName,
          userAvatar,
          lastSeen,
          timestamp: Date.now()
        };
      } else {
        delete state.onlineUsers[conversationId][userId];
      }
    },

    setConversationOnlineStatus: (state, action) => {
      const { conversationId, onlineUsers: users, onlineCount, totalUsers } = action.payload;
      
      if (!state.onlineUsers[conversationId]) {
        state.onlineUsers[conversationId] = {};
      }

      // Clear existing online users for this conversation
      state.onlineUsers[conversationId] = {};

      // Add online users
      users.forEach(user => {
        state.onlineUsers[conversationId][user.user_id] = {
          userName: user.user_name,
          userAvatar: user.user_avatar,
          lastSeen: user.last_seen,
          timestamp: Date.now()
        };
      });
    },

    clearOnlineUsers: (state, action) => {
      const conversationId = action.payload;
      if (state.onlineUsers[conversationId]) {
        delete state.onlineUsers[conversationId];
      }
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchConversations.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchConversations.fulfilled, (state, action) => {
        state.conversations = action.payload;
        state.loading = false;
      })
      .addCase(fetchConversations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      .addCase(fetchMessagesForConversation.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMessagesForConversation.fulfilled, (state, action) => {
        state.currentMessages = action.payload.data;
        state.loading = false;
        state.messagesMeta = {
          currentPage: action.payload.current_page,
          lastPage: action.payload.last_page,
          total: action.payload.total,
          hasMore: action.payload.current_page < action.payload.last_page,
          nextPageUrl: action.payload.next_page_url,
        };
      })
      .addCase(fetchMessagesForConversation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      .addCase(loadMoreMessages.pending, (state) => {
        state.loadingMore = true;
        state.error = null;
      })
      .addCase(loadMoreMessages.fulfilled, (state, action) => {
        state.currentMessages = [...state.currentMessages, ...action.payload.data];
        state.loadingMore = false;
        state.messagesMeta = {
          currentPage: action.payload.current_page,
          lastPage: action.payload.last_page,
          total: action.payload.total,
          hasMore: action.payload.current_page < action.payload.last_page,
          nextPageUrl: action.payload.next_page_url,
        };
      })
      .addCase(loadMoreMessages.rejected, (state, action) => {
        state.loadingMore = false;
        state.error = action.error.message;
      })

      .addCase(sendMessageToConversation.fulfilled, (state, action) => {
        const msg = action.payload;
        state.currentMessages.unshift(msg);

        const convoIndex = state.conversations.findIndex(c => c.id === msg.conversation_id);
        if (convoIndex !== -1) {
          const convo = state.conversations[convoIndex];
          convo.messages = convo.messages || [];
          convo.messages.unshift(msg);
          convo.updated_at = msg.created_at;

          state.conversations.splice(convoIndex, 1);
          state.conversations.unshift(convo);
        }
      })

      .addCase(sendMessageToConversation.rejected, (state, action) => {
        state.error = action.error.message;
      })

      .addCase(fetchConversationById.fulfilled, (state, action) => {
        state.activeConversation = action.payload;
      })

      .addCase(createPrivateConversation.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createPrivateConversation.fulfilled, (state, action) => {
        state.loading = false;
        const existing = state.conversations.find(c => c.id === action.payload.id);
        if (!existing) {
          state.conversations.unshift(action.payload);
        }
        state.activeConversation = action.payload;
      })
      .addCase(createPrivateConversation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Mark-as-read success: no heavy state update here; backend will include read markers on next fetch
      .addCase(markConversationAsRead.fulfilled, (state, action) => {
        // Optionally, could zero a local unread counter if tracked
      });
  },
});

export default chatSlice.reducer;
export const { 
  applyReadReceipt,
  receiveMessage, 
  receiveIncomingMessage, 
  setTypingUsers, 
  clearTypingUsers, 
  cleanupOldTypingIndicators,
  updateUserOnlineStatus,
  setConversationOnlineStatus,
  clearOnlineUsers
} = chatSlice.actions;
