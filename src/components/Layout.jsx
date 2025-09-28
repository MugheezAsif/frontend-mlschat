import React from 'react';
import { useSelector } from 'react-redux';
import { Outlet } from 'react-router-dom';
import NavbarTop from './NavbarTop';
import GlobalLoader from './global/GlobalLoader';
import NotificationsEvent from './events/NotificationsEvent';
import ChatEvent from './events/ChatEvent';
import { useGlobalLoading } from '../hooks/useGlobalLoading';

const Layout = () => {
  const user = useSelector((state) => state.auth.user);

  const loading = useGlobalLoading();

  return (
    <>
      {loading && <GlobalLoader />}

      <NotificationsEvent />
      <ChatEvent />

      {user && (
        <>
          <NavbarTop avatarUrl={user.avatar_url} />
          <div className="py-0 py-md-4 my-0 my-md-3"></div>
          <div className="">
            <Outlet />
          </div>
        </>
      )}
    </>
  );
};

export default Layout;
