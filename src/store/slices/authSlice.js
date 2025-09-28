// store/slices/authSlice.js
import { createSlice } from '@reduxjs/toolkit';

// Safe parse helper (still useful for rehydration)
function safeParseUser(raw) {
  try {
    if (!raw || raw === 'undefined' || raw === 'null') return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

const userFromStorage = safeParseUser(localStorage.getItem('user'));
const tokenFromStorage = localStorage.getItem('token') || null;

const initialState = {
  user: userFromStorage,
  token: tokenFromStorage,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      const { user, token } = action.payload;
      state.user = user;
      state.token = token;
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('token', token);
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      localStorage.removeItem('user');
      localStorage.removeItem('token');
    },
    updateUserAttribute: (state, action) => {
      if (!state.user) return;
      const payload = action.payload;

      if (Array.isArray(payload)) {
        payload.forEach(({ key, value }) => {
          if (key in state.user) state.user[key] = value;
        });
      } else if (payload && typeof payload === 'object') {
        const { key, value } = payload;
        if (key in state.user) state.user[key] = value;
      }

      localStorage.setItem('user', JSON.stringify(state.user));
    },
    updateProfilePhoto: (state, action) => {
      if (state.user) {
        state.user.profile_photo = action.payload;
        localStorage.setItem('user', JSON.stringify(state.user));
      }
    },
    setUser: (state, action) => {
      const updated = action.payload || {};
      const merged = { ...(state.user || {}), ...updated };
      state.user = merged;
      localStorage.setItem('user', JSON.stringify(merged));
    },
  },
});

export const {
  loginSuccess,
  logout,
  updateUserAttribute,
  updateProfilePhoto,
  setUser,
} = authSlice.actions;

export default authSlice.reducer;
