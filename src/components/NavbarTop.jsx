import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { logout } from '../store/slices/authSlice';
import { getRelativeTime } from '../utils/dateUtils';

import {
  fetchUnreadNotifications,
  fetchReadNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  markMultipleNotificationsAsRead,
} from '../store/slices/notificationSlice';

const NavbarTop = ({ avatarUrl = 'https://images.unsplash.com/photo-1683029096295-7680306aa37d?q=80&w=3264&auto=format&fit=crop' }) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const [activeTab, setActiveTab] = useState('all'); // 'all', 'unread', 'read'
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const notificationContainerRef = useRef(null);

  const handleLogout = () => {
    dispatch(logout());
    window.location.href = '/login';
  };
  const unreadNotifications = useSelector((state) => state.notifications.unread) || [];
  const readNotifications = useSelector((state) => state.notifications.read) || [];

  useEffect(() => {
    if (user) {
      dispatch(fetchUnreadNotifications());
      dispatch(fetchReadNotifications());
    }
  }, [dispatch, user]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationContainerRef.current && !notificationContainerRef.current.contains(event.target)) {
        setIsNotificationsOpen(false);
      }
    };

    const handleEscapeKey = (event) => {
      if (event.key === 'Escape') {
        setIsNotificationsOpen(false);
      }
    };

    if (isNotificationsOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscapeKey);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [isNotificationsOpen]);

  const toggleNotifications = () => {
    setIsNotificationsOpen(!isNotificationsOpen);
  };

  const closeNotifications = () => {
    setIsNotificationsOpen(false);
  };

  const handleNotificationClick = async (notification) => {
    if (!notification.is_read) {
      try {
        await dispatch(markNotificationAsRead(notification.id));
      } catch (error) {
        console.error('Failed to mark notification as read:', error);
      }
    }
    closeNotifications();
  };

  const handleMarkAllAsRead = async () => {
    if (unreadNotifications && unreadNotifications.length > 0) {
      try {
        await dispatch(markAllNotificationsAsRead());
      } catch (error) {
        console.error('Failed to mark all notifications as read:', error);
      }
    }
    closeNotifications();
  };

  const getNotificationsToShow = () => {
    switch (activeTab) {
      case 'unread':
        return unreadNotifications || [];
      case 'read':
        return readNotifications || [];
      default:
        // Combine unread and read, but ensure no duplicates by ID
        const allNotifications = [...(unreadNotifications || []), ...(readNotifications || [])];
        return allNotifications.filter((notification, index, self) =>
          index === self.findIndex(n => n.id === notification.id)
        );
    }
  };

  const renderNotificationItem = (notification) => (
    <Link
      to={notification.data?.url ?? '/home'}
      key={`notification-${notification.id}-${notification.is_read ? 'read' : 'unread'}`}
      className={`notification-item my-2 p-3 rounded-3 text-decoration-none d-flex align-items-center ${!notification.is_read ? 'notification-unread' : ''}`}
      onClick={() => handleNotificationClick(notification)}
    >
      <img
        src={notification.data?.user?.avatar?.file_url ??
          'https://images.unsplash.com/photo-1683029096295-7680306aa37d?q=80&w=3264&auto=format&fit=crop'}
        alt="User Avatar"
        className="rounded-circle me-3"
      />
      <div className="flex-grow-1">
        <span
          className="notification-message d-block mb-0"
          dangerouslySetInnerHTML={{ __html: notification.message }}
        ></span>
        <small className="text-muted">{getRelativeTime(notification.created_at)}</small>
      </div>
    </Link>
  );

  return (
    <div id='navbarTop' className="navbar-top">
      <div className="px-2">
        <div className="navbar-content justify-content-between d-flex">
          {/* Left Section - Logo and Navigation */}
          <div className="navbar-left d-flex align-items-center">
            <Link className="navbar-brand d-flex align-items-center me-3" to="/home">
              <div className="brand-logo">
                <i className="fas fa-comments"></i>
              </div>
              <span className="brand-text ms-2 d-none d-md-inline">MLSChat</span>
            </Link>
          </div>

          <div className="navbar-middle">
            <nav className="navbar-nav d-none d-lg-flex flex-row align-items-center">
              <Link className="nav-link px-2 d-flex align-items-center" to="/home">
                <i className="fas fa-home"></i>
                <span className="ms-1">Home</span>
              </Link>
              <Link className="nav-link px-2 d-flex align-items-center" to="/friends">
                <i className="fas fa-user-friends"></i>
                <span className="ms-1">Friends</span>
              </Link>
              <Link className="nav-link px-2 d-flex align-items-center" to="/listings">
                <i className="fas fa-home"></i>
                <span className="ms-1">Listings</span>
              </Link>
              <Link className="nav-link px-2 d-flex align-items-center" to="/professionals">
                <i className="fas fa-id-badge"></i>
                <span className="ms-1">Professionals</span>
              </Link>
              <div className="nav-dropdown mx-2">
                <button className="nav-link dropdown-toggl d-flex align-items-center" data-bs-toggle="dropdown" type="button">
                  <i className="fas fa-users"></i>
                  <span className="ms-1">Groups</span>
                  <i className="fas fa-chevron-down ms-1"></i>
                </button>
                <ul className="dropdown-menu">
                  <li><Link className="dropdown-item" to="/Groups">Find Groups</Link></li>
                  <li><Link className="dropdown-item" to="/CreateNewGroup">Create Group</Link></li>
                </ul>
              </div>
            </nav>
          </div>

          {/* Right Section - Actions and Profile */}
          <div className="navbar-right">
            {/* Search Bar - Desktop Only */}
            {/* Notifications */}
            <div
              className="notification-container"
              ref={notificationContainerRef}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="notification-badge">
                {unreadNotifications && unreadNotifications.length > 0 && (
                  <span className="notification-count">{unreadNotifications.length}</span>
                )}
                <button
                  className="notification-btn"
                  onClick={toggleNotifications}
                >
                  <i className={`fas fa-bell notification-icon ${isNotificationsOpen ? 'active' : ''}`}></i>
                </button>
              </div>

              {/* Notifications Dropdown */}
              <div className={`notification-dropdown p-3 ${isNotificationsOpen ? 'show' : ''}`}>
                <div className="d-flex align-items-center justify-content-between">
                  <h5 className="notification-title">Notifications</h5>
                  <div className="notification-actions">
                    <button
                      className="btn btn-link close-notifications"
                      onClick={closeNotifications}
                    >
                      <i className="fas text-danger fa-times"></i>
                    </button>
                  </div>
                </div>

                <div className="badges my-3">
                  <span
                    className={activeTab === 'all' ? 'active' : ''}
                    onClick={() => setActiveTab('all')}
                    style={{ cursor: 'pointer' }}
                  >
                    All
                  </span>
                  <span
                    className={activeTab === 'unread' ? 'active' : ''}
                    onClick={() => setActiveTab('unread')}
                    style={{ cursor: 'pointer' }}
                  >
                    Unread
                  </span>
                  <span
                    className={activeTab === 'read' ? 'active' : ''}
                    onClick={() => setActiveTab('read')}
                    style={{ cursor: 'pointer' }}
                  >
                    Read
                  </span>
                </div>

                <div className="notification-list">
                  {getNotificationsToShow().length === 0 ? (
                    <div className="no-notifications">
                      <i className="fas fa-bell-slash"></i>
                      <p>No notifications</p>
                    </div>
                  ) : (
                    <>
                      {getNotificationsToShow()
                        .slice()
                        .sort((a, b) => {
                          try {
                            const dateA = new Date(a.created_at || 0);
                            const dateB = new Date(b.created_at || 0);
                            return dateB - dateA;
                          } catch (error) {
                            console.error('Error sorting notifications:', error);
                            return 0;
                          }
                        })
                        .map((notification) => renderNotificationItem(notification))}
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Messenger */}
            <Link className="action-btn messenger-btn d-none d-md-flex" to="/messenger" title="Messenger">
              <i class="fa-brands fa-facebook-messenger"></i>
            </Link>

            {/* Profile Dropdown */}
            {user && (
              <div className="profile-container">
                <div className="profile-dropdown">
                  <button className="profile-btn" data-bs-toggle="dropdown">
                    <img
                      src={user.profile_photo || avatarUrl}
                      className="profile-avatar"
                      alt="Profile"
                    />
                    {/* <span className="profile-name d-none d-md-inline">{user.name}</span>
                    <i className="fas fa-chevron-down d-none d-md-inline"></i> */}
                  </button>
                  <ul className="dropdown-menu profile-menu">
                    <li>
                      <Link className="dropdown-item" to={`/user/${user.id}`}>
                        <i className="fas fa-user"></i>
                        Profile
                      </Link>
                    </li>
                    <li>
                      <Link className="dropdown-item" to={`/users/${user.id}/settings`}>
                        <i className="fas fa-cog"></i>
                        Settings
                      </Link>
                    </li>
                    <li><hr className="dropdown-divider" /></li>
                    <li>
                      <button className="dropdown-item text-danger" onClick={handleLogout}>
                        <i className="fas fa-sign-out-alt"></i>
                        Logout
                      </button>
                    </li>
                  </ul>
                </div>
              </div>
            )}

            {/* Mobile Menu Toggle */}
            <button
              className="mobile-menu-toggle d-lg-none"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <i className={`fas ${isMobileMenuOpen ? 'fa-times' : 'fa-bars'}`}></i>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        <div className={`mobile-nav ${isMobileMenuOpen ? 'show' : ''}`}>
          <div className="mobile-nav-content">
            <div className="mobile-search-container">
              <div className="search-input-wrapper">
                <i className="fas fa-search search-icon"></i>
                <input
                  type="text"
                  placeholder="Search MLSChat..."
                  className="search-input"
                />
              </div>
            </div>

            <nav className="mobile-nav-links">
              <Link
                className="mobile-nav-link"
                to="/home"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <i className="fas fa-home"></i>
                <span>Home</span>
              </Link>
              <Link
                className="mobile-nav-link"
                to="/friends"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <i className="fas fa-user-friends"></i>
                <span>Friends</span>
              </Link>
              <Link
                className="mobile-nav-link"
                to="/listings"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <i className="fas fa-home"></i>
                <span>Listings</span>
              </Link>
              <Link
                className="mobile-nav-link"
                to="/professionals"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <i className="fas fa-id-badge"></i>
                <span>Professionals</span>
              </Link>
              <Link
                className="mobile-nav-link"
                to="/Groups"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <i className="fas fa-users"></i>
                <span>Groups</span>
              </Link>
              <Link
                className="mobile-nav-link"
                to="/messenger"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <i className="fab fa-facebook-messenger"></i>
                <span>Messages</span>
              </Link>
              <Link
                className="mobile-nav-link"
                to={`/user/${user.id}`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <i className="fas fa-user"></i>
                <span>Profile</span>
              </Link>
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NavbarTop;
