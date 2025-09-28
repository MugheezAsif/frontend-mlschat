import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { apiFetch } from '../../lib/apiClient';

// 🔁 Fetch all notifications
export const fetchNotifications = createAsyncThunk(
  'notifications/fetchAll',
  async () => {
    const data = await apiFetch(`${APP_BASE_URL}/api/notifications`);
    return data;
  }
);

// ✅ Fetch unread notifications
export const fetchUnreadNotifications = createAsyncThunk(
  'notifications/fetchUnread',
  async () => {
    const url = `${APP_BASE_URL}/api/notifications?is_read=false&per_page=15`;
    const data = await apiFetch(url, { method: 'GET' });
    return data.data;
  }
);

// 🔁 Fetch read notifications
export const fetchReadNotifications = createAsyncThunk(
  'notifications/fetchRead',
  async () => {
    const url = `${APP_BASE_URL}/api/notifications?is_read=true`;
    const data = await apiFetch(url);
    return data.data;
  }
);

// ✅ Mark one as read
export const markNotificationAsRead = createAsyncThunk(
  'notifications/markAsRead',
  async (id) => {
    await apiFetch(`${APP_BASE_URL}/api/notifications/${id}/mark-read`, {
      method: 'PUT',
    });
    return id;
  }
);

// ✅ Mark all as read
export const markAllNotificationsAsRead = createAsyncThunk(
  'notifications/markAllAsRead',
  async () => {
    await apiFetch(`${APP_BASE_URL}/api/notifications/mark-all-read`, {
      method: 'PUT',
    });
    return true;
  }
);

// ✅ Mark multiple notifications as read
export const markMultipleNotificationsAsRead = createAsyncThunk(
  'notifications/markMultipleAsRead',
  async (ids) => {
    const data = await apiFetch(`${APP_BASE_URL}/api/notifications/mark-multiple-read`, {
      method: 'PUT',
      body: JSON.stringify({ ids }),
    });
    return { ids, updatedCount: data.data?.updated_count || ids.length };
  }
);

const notificationSlice = createSlice({
  name: 'notifications',
  initialState: {
    items: [],
    unread: [],
    read: [],
    loading: false,
    error: null,
  },
  reducers: {
    addNewNotification: (state, action) => {
      const newNotification = action.payload;

      const unreadIndex = state.unread.findIndex(item => item.id === newNotification.id);
      if (unreadIndex !== -1) {
        state.unread.splice(unreadIndex, 1);
      }
      state.unread.unshift(newNotification);

      const itemsIndex = state.items.findIndex(item => item.id === newNotification.id);
      if (itemsIndex !== -1) {
        state.items.splice(itemsIndex, 1);
      }
      state.items.unshift(newNotification);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotifications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.items = action.payload;
        state.loading = false;
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      .addCase(fetchUnreadNotifications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUnreadNotifications.fulfilled, (state, action) => {
        state.unread = action.payload;
        state.loading = false;
      })
      .addCase(fetchUnreadNotifications.rejected, (state, action) => {
        console.error('❌ Failed to fetch unread notifications:', action.error);
        state.loading = false;
        state.error = action.error.message;
      })

      .addCase(fetchReadNotifications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchReadNotifications.fulfilled, (state, action) => {
        state.read = action.payload;
        state.loading = false;
      })
      .addCase(fetchReadNotifications.rejected, (state, action) => {
        console.error('❌ Failed to fetch read notifications:', action.error);
        state.loading = false;
        state.error = action.error.message;
      })

      .addCase(markNotificationAsRead.fulfilled, (state, action) => {
        const id = action.payload;
        // Move from unread to read
        const notification = state.unread.find(n => n.id === id);
        if (notification) {
          const updatedNotification = { ...notification, is_read: true, read_at: new Date().toISOString() };
          // Remove from unread first
          state.unread = state.unread.filter(n => n.id !== id);
          // Add to read (check for duplicates)
          const existingInRead = state.read.find(n => n.id === id);
          if (!existingInRead) {
            state.read.unshift(updatedNotification);
          }
        }
        // Update in items array
        state.items = state.items.map(n =>
          n.id === id ? { ...n, is_read: true, read_at: new Date().toISOString() } : n
        );
      })

      .addCase(markAllNotificationsAsRead.fulfilled, (state) => {
        // Move all unread to read
        const updatedUnread = state.unread.map(n => ({
          ...n,
          is_read: true,
          read_at: new Date().toISOString(),
        }));

        // Filter out any that already exist in read array
        const newReadNotifications = updatedUnread.filter(unreadNotif =>
          !state.read.find(readNotif => readNotif.id === unreadNotif.id)
        );

        state.read.unshift(...newReadNotifications);
        state.unread = [];

        // Update items array
        state.items = state.items.map(n => ({
          ...n,
          is_read: true,
          read_at: new Date().toISOString(),
        }));
      })

      .addCase(markMultipleNotificationsAsRead.fulfilled, (state, action) => {
        const { ids, updatedCount } = action.payload;

        // Move specified notifications from unread to read
        const notificationsToMove = state.unread.filter(n => ids.includes(n.id));

        if (notificationsToMove.length > 0) {
          const updatedNotifications = notificationsToMove.map(n => ({
            ...n,
            is_read: true,
            read_at: new Date().toISOString(),
          }));

          // Remove from unread
          state.unread = state.unread.filter(n => !ids.includes(n.id));

          // Add to read (avoid duplicates)
          const newReadNotifications = updatedNotifications.filter(notif =>
            !state.read.find(readNotif => readNotif.id === notif.id)
          );
          state.read.unshift(...newReadNotifications);
        }

        // Update items array
        state.items = state.items.map(n =>
          ids.includes(n.id) ? { ...n, is_read: true, read_at: new Date().toISOString() } : n
        );
      });
  },
});

export const { addNewNotification } = notificationSlice.actions;
export default notificationSlice.reducer;
