import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import 'bootstrap/dist/css/bootstrap.min.css';

import NavbarTop from '../components/NavbarTop';
import NavbarMobile from '../components/NavbarMobile';
import ProfileHeader from '../components/ProfileHeader';

import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import ProfileTabs from '../components/profile/ProfileTabs';
import AboutTab from '../components/profile/AboutTab';
import FriendsTab from '../components/profile/FriendsTab';
import PostsTab from '../components/profile/PostsTab';
import SavedPostsTab from '../components/profile/SavedPostsTab';
import MediaTab from '../components/profile/MediaTab';
import ActionsTab from '../components/profile/ActionsTab';
import { useProfile } from '../hooks/useProfile';
import GlobalLoader from '../components/global/GlobalLoader';

const tabKeys = ['profile', 'about', 'friends', 'posts', 'saved', 'media', 'actions'];

const ProfileTab = () => {
  const { id } = useParams();
  const current_user = useSelector((state) => state.auth.user);
  const { user, posts, setUser } = useProfile(id);
  const [searchParams, setSearchParams] = useSearchParams();
  const [value, setValue] = useState(0); // default to first tab

  useEffect(() => {
    if (!user) return;

    const isOwner = current_user?.id === user.id;
    const tabFromUrl = searchParams.get('tab');
    const index = isOwner ? tabKeys.indexOf(tabFromUrl) : 0;

    setValue(index >= 0 ? index : 0);
  }, [user, current_user, searchParams]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
    const isOwner = current_user?.id === user?.id;
    const selectedTab = isOwner ? tabKeys[newValue] : 'profile';
    setSearchParams({ tab: selectedTab });
  };

  const TabPanel = ({ children, value, index }) => (
    <div hidden={value !== index}>
      {value === index && (
        <Box p={2}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );

  if (!user) return <GlobalLoader />;

  const isOwner = current_user?.id === user.id;

  return (
    <div>
      <div className="main py-4">
        <div className="container">
          <ProfileHeader user={user} onUserUpdate={setUser} />

          <Box>
            <Tabs
              value={value}
              className="bg-white rounded-2 px-2"
              onChange={handleChange}
              aria-label="profile tabs"
            >
              <Tab label="Profile" />
              {isOwner && <Tab label="About" />}
              {isOwner && <Tab label="Friends" />}
              {isOwner && <Tab label="Posts" />}
              {isOwner && <Tab label="Saved" />}
              {isOwner && <Tab label="Media" />}
              {isOwner && <Tab label="Actions" />}
            </Tabs>

            <TabPanel value={value} index={0}>
              <ProfileTabs />
            </TabPanel>

            {isOwner && (
              <>
                <TabPanel value={value} index={1}>
                  <AboutTab />
                </TabPanel>
                <TabPanel value={value} index={2}>
                  <FriendsTab />
                </TabPanel>
                <TabPanel value={value} index={3}>
                  <PostsTab />
                </TabPanel>
                <TabPanel value={value} index={4}>
                  <SavedPostsTab />
                </TabPanel>
                <TabPanel value={value} index={5}>
                  <MediaTab />
                </TabPanel>
                <TabPanel value={value} index={6}>
                  <ActionsTab />
                </TabPanel>
              </>
            )}
          </Box>
        </div>
      </div>
    </div>
  );
};

export default ProfileTab;
