import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './store';
import Login from './pages/Login';
import Signup from './pages/Signup';
import AgentSignup from './pages/AgentSignup';
import FrontendHome from './pages/Home';
import Home from './pages/Frontend/Home';
import Upcoming from './pages/Frontend/Upcoming';
import About from './pages/Frontend/About';
import TermsAndConditions from './pages/Frontend/TermsAndConditions';
import Listings from './pages/Listings';
import List from './pages/List';
import Friends from './pages/Friends';
import Photos from './pages/Photos';
import MyPost from './pages/MyPost';
import CreateNewGroup from './pages/CreateNewGroup';
import ViewGroups from './pages/ViewGroups';
import ProfileTab from './pages/ProfileTab';
import Groups from './pages/Groups';
import MessengerPage from './pages/Messenger';
import UserSettings from './pages/UserSettings';
import Layout from './components/Layout';
import PrivateRoute from './components/routing/PrivateRoute';
import GroupSettings from './pages/GroupSettings';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import 'bootstrap/dist/css/bootstrap.min.css';
import './app.css';
import './buttons.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Echo from 'laravel-echo';
import Pusher from 'pusher-js';
import Professionals from './pages/Professionals.jsx';
import ProfessionalShow from './pages/ProfessionalShow.jsx';
import ResetPassword from './pages/ResetPassword.jsx';
import VerifyEmail from './pages/VerifyEmail.jsx';

const state = store.getState();
const token = state.auth.token;

window.Pusher = Pusher;
window.Echo = new Echo({
  broadcaster: 'reverb',
  key: import.meta.env.VITE_REVERB_APP_KEY,
  wsHost: import.meta.env.VITE_REVERB_HOST,
  wsPort: import.meta.env.VITE_REVERB_PORT,
  wssPort: import.meta.env.VITE_REVERB_PORT,
  forceTLS: (import.meta.env.VITE_REVERB_SCHEME ?? 'https') === 'https',
  enabledTransports: ['ws', 'wss'],
  disableStats: true,
  authEndpoint: `${APP_BASE_URL}/broadcasting/auth`,
  auth: {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  },
});

store.subscribe(() => {
  const currentState = store.getState();
  const currentToken = currentState.auth.token;

  if (window.Echo && currentToken) {
    window.Echo.connector.options.auth.headers.Authorization = `Bearer ${currentToken}`;
  }
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <ToastContainer position="top-right" autoClose={3000} />
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/upcoming" element={<Upcoming />} />
        <Route path="/about" element={<About />} />
        <Route path="/terms" element={<TermsAndConditions />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/agent-signup" element={<AgentSignup />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/professionals" element={<Professionals />} />
        <Route path="/professionals/:id" element={<ProfessionalShow />} />

        {/* Protected Layout with Navbars */}
        <Route element={<PrivateRoute><Layout /></PrivateRoute>}>
          <Route path="/home" element={<FrontendHome />} />
          <Route path="/listings" element={<Listings />} />
          <Route path="/list" element={<List />} />
          <Route path="/friends" element={<Friends />} />
          <Route path="/photos" element={<Photos />} />
          <Route path="/my_post" element={<MyPost />} />
          <Route path="/user/:id" element={<ProfileTab />} />
          <Route path="/CreateNewGroup" element={<CreateNewGroup />} />
          <Route path="/ViewGroups" element={<ViewGroups />} />
          <Route path="/Groups" element={<Groups />} />
          <Route path="/group/:id" element={<ViewGroups />} />
          <Route path="/messenger" element={<MessengerPage />} />
          <Route path="/group/:id/settings" element={<GroupSettings />} />
          <Route path="/users/:id/settings" element={<UserSettings />} />

        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/home" replace />} />
      </Routes>
    </BrowserRouter>
  </Provider>
);
