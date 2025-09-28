// src/store.js
import { configureStore } from '@reduxjs/toolkit';
import authReducer, { logout } from './slices/authSlice';
import postsReducer from './slices/postSlice';
import groupsReducer from './slices/groupsSlice';
import chatReducer from './slices/chatSlice';
import notificationsReducer from './slices/notificationSlice';
import mediaReducer from './slices/mediaSlice';
import { initApiClient } from '../lib/apiClient';

const store = configureStore({
  reducer: {
    auth: authReducer,
    posts: postsReducer,
    groups: groupsReducer,
    chat: chatReducer,
    notifications: notificationsReducer,
    media: mediaReducer,
  },
});

// ---- Global API handling: auto-logout on 401/419 ----
initApiClient({
  getToken: () => store.getState().auth.token,
  onSessionExpired: () => {
    store.dispatch(logout());
    if (typeof window !== 'undefined') {
      const publicRoutes = ['/', '/about', '/upcoming', '/login', '/signup', '/agent-signup', '/professionals', '/reset-password', '/verify-email', '/terms'];
      const currentPath = window.location.pathname;
      if (!publicRoutes.includes(currentPath)) {
        window.location.replace('/login');
      }
    }
  },
  // Skip session-expired handling for auth endpoints if needed
  shouldHandleAsSessionExpired: (url) => {
    const u = (url || '').toLowerCase();
    if (u.endsWith('/login') || u.endsWith('/signup')) return false;
    return true;
  },
});

// ---- Optional: cross-tab logout sync ----
if (typeof window !== 'undefined') {
  window.addEventListener('storage', (e) => {
    if (e.key === 'token' || e.key === 'user') {
      store.dispatch(logout());
      const publicRoutes = ['/', '/about', '/upcoming', '/login', '/signup', '/agent-signup', '/professionals', '/reset-password', '/verify-email', '/terms'];
      const currentPath = window.location.pathname;
      if (!publicRoutes.includes(currentPath)) {
        window.location.replace('/login');
      }
    }
  });
}

// ---- Validate localStorage auth immediately on boot ----
(function validateBootAuth() {
  if (typeof window === 'undefined') return; // SSR guard

  // Define public routes that don't require authentication
  const publicRoutes = ['/', '/about', '/upcoming', '/login', '/signup', '/agent-signup', '/professionals', '/reset-password', '/verify-email', '/terms'];
  const currentPath = window.location.pathname;
  
  // Skip authentication check for public routes
  if (publicRoutes.includes(currentPath)) {
    return;
  }

  const isInvalidJSON = (raw) => {
    if (!raw || raw === 'undefined' || raw === 'null') return true;
    try { JSON.parse(raw); return false; } catch { return true; }
  };

  const rawUser = localStorage.getItem('user');
  const token = localStorage.getItem('token');

  if (isInvalidJSON(rawUser) || !token) {
    store.dispatch(logout());
    if (!publicRoutes.includes(currentPath)) {
      window.location.replace('/login');
    }
  }
})();

export default store;
