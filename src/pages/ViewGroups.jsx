import React, { useEffect, useState } from 'react';
import { Tabs, Tab, Box } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useSearchParams } from 'react-router-dom';

import GroupPost from '../components/groups/GroupPost';
import Requests from '../components/groups/Requests';
import InviteUsers from '../components/groups/InviteUsers';
import GroupInfo from '../components/groups/GroupInfo';
import PendingPosts from '../components/groups/PendingPosts';
import Members from '../components/groups/Members';
import { useNavigate, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGear, faUsers, faEye, faLock, faGlobe, faCalendarAlt, faMapMarkerAlt, faPlus, faEdit } from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-toastify';

import {
  fetchGroupById,
  joinGroup,
} from '../store/slices/groupsSlice';

import 'bootstrap/dist/css/bootstrap.min.css';
import '../group.css';

const ViewGroups = () => {
  const { id } = useParams();
  const slug = id;
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const [tabIndex, setTabIndex] = useState(0);

  const { currentGroup: group, loading, error, membershipStatus, joinLoading } = useSelector((s) => s.groups);
  const user = useSelector((s) => s.auth.user);
  const isAdmin = user && group && user.id === group?.user_id;
  const isMember = group && membershipStatus === 'joined';
  const navigate = useNavigate();

  // Fetch group data
  useEffect(() => {
    if (slug) dispatch(fetchGroupById(slug));
  }, [dispatch, slug]);

  const location = useLocation();
  useEffect(() => {
    if (error) {
      toast.error(error || 'Something went wrong.');
      setTimeout(() => {
        if (location?.state?.from) {
          navigate(location.state.from);
        } else {
          navigate(-1);
        }
      }, 200);
    }
  }, [error, navigate, location]);

  // Build tabMap based on role and group visibility
  const tabMap = ['info'];
  if (isAdmin || isMember) tabMap.push('posts');
  if (isAdmin && group?.visibility === 'private') tabMap.push('requests');
  if (isAdmin && group?.visibility === 'invite_only') tabMap.push('invite');
  if (isAdmin && group?.settings?.post_permission_required) tabMap.push('pending');
  if (isAdmin) tabMap.push('members');

  // Sync tab from URL
  useEffect(() => {
    if (!group) return;
    const tabFromUrl = searchParams.get('tab');
    const index = tabMap.indexOf(tabFromUrl);
    setTabIndex(index >= 0 ? index : 0);
  }, [group, searchParams]);

  // Handle tab switch
  const handleTabChange = (e, newIndex) => {
    setTabIndex(newIndex);
    setSearchParams({ tab: tabMap[newIndex] || 'info' });
  };

  // Join button logic
  const joinButton = (() => {
    if (!group) return { label: 'Join', disabled: true };
    if (group?.visibility === 'invite_only') return { label: 'Invite Only', disabled: true };
    switch (membershipStatus) {
      case 'joined': return { label: 'Joined', disabled: true };
      case 'requested': return { label: 'Requested', disabled: true };
      default: return { label: 'Join', disabled: false };
    }
  })();

  const handleJoin = () => {
    if (joinLoading || !group) return;
    dispatch(joinGroup(group?.slug));
  };

  if (loading) {
    return (
      <div className="group-loading-container">
        <div className="group-loading-spinner"></div>
        <p>Loading group...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="group-error-container">
        <div className="group-error-icon">
          <i className="fas fa-exclamation-triangle"></i>
        </div>
        <h4>Something went wrong</h4>
        <p>Unable to load the group. Please try again later.</p>
        <button className="btn btn-primary" onClick={() => window.location.reload()}>
          Retry
        </button>
      </div>
    );
  }

  const cover = group?.cover_url ?? 'https://images.unsplash.com/photo-1502444330042-d1a1ddf9bb5b?q=80&w=3546&auto=format&fit=crop&ixlib=rb-4.1.0';
  const members = group?.members_count ?? '—';

  const getVisibilityIcon = () => {
    switch (group?.visibility) {
      case 'private': return <FontAwesomeIcon icon={faLock} />;
      case 'invite_only': return <FontAwesomeIcon icon={faUsers} />;
      default: return <FontAwesomeIcon icon={faGlobe} />;
    }
  };

  const getVisibilityText = () => {
    switch (group?.visibility) {
      case 'private': return 'Private Group';
      case 'invite_only': return 'Invite Only';
      default: return 'Public Group';
    }
  };

  return (
    <div className="view-groups-page">
      {/* Hero Section with Cover */}
      <div className="group-hero-section">
        <div className="group-cover-image">
          <img src={cover} alt="Group Cover" />
          <div className="group-cover-overlay">
            <div className="container">
              <div className="group-hero-content">
                <div className="group-avatar">
                  <div className="group-logo">
                    <FontAwesomeIcon icon={faUsers} />
                  </div>
                </div>
                <div className="group-hero-info">
                  <h1 className="group-title">{group?.name}</h1>
                  <div className="group-meta">
                    <span className="group-visibility">
                      {getVisibilityIcon()} {getVisibilityText()}
                    </span>
                    <span className="group-members">
                      <FontAwesomeIcon icon={faUsers} /> {members} members
                    </span>
                    {group?.category && (
                      <span className="group-category">
                        {group.category.split('_').map(word => 
                          word.charAt(0).toUpperCase() + word.slice(1)
                        ).join(' ')}
                      </span>
                    )}
                  </div>
                  {group?.description && (
                    <p className="group-description">{group.description}</p>
                  )}
                </div>
                <div className="group-hero-actions">
                  {!isAdmin && (
                    <button
                      className={`btn btn-join-group ${joinButton.disabled ? 'btn-disabled' : 'btn-primary'}`}
                      disabled={joinButton.disabled || joinLoading}
                      onClick={handleJoin}
                    >
                      {joinLoading ? (
                        <span className="spinner-border spinner-border-sm me-2"></span>
                      ) : null}
                      {joinButton.label}
                    </button>
                  )}
                  {isAdmin && (
                    <button
                      className="btn btn-outline-light btn-settings"
                      onClick={() => navigate(`/group/${group?.slug}/settings`)}
                    >
                      <FontAwesomeIcon icon={faGear} className="me-2" />
                      Settings
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="group-main-content">
        <div className="container">
          <div className="row">
            {/* Left Sidebar */}
            <div className="col-lg-3">
              <div className="group-sidebar">
                {/* Group Stats */}
                <div className="sidebar-card group-stats-card">
                  <h5 className="sidebar-card-title">Group Stats</h5>
                  <div className="stats-grid">
                    <div className="stat-item">
                      <div className="stat-icon">
                        <FontAwesomeIcon icon={faUsers} />
                      </div>
                      <div className="stat-content">
                        <div className="stat-number">{members}</div>
                        <div className="stat-label">Members</div>
                      </div>
                    </div>
                    <div className="stat-item">
                      <div className="stat-icon">
                        <FontAwesomeIcon icon={faEye} />
                      </div>
                      <div className="stat-content">
                        <div className="stat-number">{group?.group_posts_count || 0}</div>
                        <div className="stat-label">Posts Today</div>
                      </div>
                    </div>
                  </div>
                </div>

                {(isAdmin || isMember) && (
                  <div className="sidebar-card quick-actions-card">
                    <h5 className="sidebar-card-title">Quick Actions</h5>
                    <div className="quick-actions">
                      {/* Admin Actions */}
                      {isAdmin && (
                        <>
                          <button 
                            className="btn btn-outline-primary btn-sm w-100 mb-2"
                            onClick={() => handleTabChange(null, tabMap.indexOf('members'))}
                          >
                            <FontAwesomeIcon icon={faUsers} className="me-2" />
                            View Members
                          </button>
                          <button 
                            className="btn btn-outline-secondary btn-sm w-100 mb-2"
                            onClick={() => navigate(`/group/${group?.slug}/settings`)}
                          >
                            <FontAwesomeIcon icon={faGear} className="me-2" />
                            Group Settings
                          </button>
                        </>
                      )}
                      
                      {/* Member Actions - Create Post */}
                      <button 
                        className="btn btn-outline-success btn-sm w-100 mb-2"
                        onClick={() => handleTabChange(null, tabMap.indexOf('posts'))}
                      >
                        <FontAwesomeIcon icon={faPlus} className="me-2" />
                        View Post
                      </button>
                      
                      {isAdmin && tabMap.includes('pending') && (
                        <button 
                          className="btn btn-outline-warning btn-sm w-100 mb-2"
                          onClick={() => handleTabChange(null, tabMap.indexOf('pending'))}
                        >
                          <FontAwesomeIcon icon={faEye} className="me-2" />
                          Pending Posts
                        </button>
                      )}
                      
                    </div>
                  </div>
                )}

                {/* Group Rules */}
                {group?.rules && (
                  <div className="sidebar-card group-rules-card">
                    <h5 className="sidebar-card-title">Group Rules</h5>
                    <div className="rules-list">
                      {group.rules.split('\n').map((rule, index) => (
                        <div key={index} className="rule-item">
                          <span className="rule-number">{index + 1}.</span>
                          <span className="rule-text">{rule}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Main Content Area */}
            <div className="col-lg-9">
              <div className="group-content-area">
                {/* Enhanced Tabs */}
                <div className="group-tabs-container">
                  <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <Tabs 
                      value={tabIndex} 
                      onChange={handleTabChange}
                      className="group-tabs"
                      variant="scrollable"
                      scrollButtons="auto"
                    >
                      {tabMap.map((key) => (
                        <Tab
                          key={key}
                          label={{
                            info: 'About',
                            posts: 'Posts',
                            requests: 'Requests',
                            invite: 'Invite Members',
                            pending: 'Pending Posts',
                            members: 'Members',
                          }[key]}
                          className="group-tab"
                        />
                      ))}
                    </Tabs>
                  </Box>
                </div>

                {/* Tab Content */}
                <div className="tab-content-area">
                  {tabMap[tabIndex] === 'info' && (
                    <div className="tab-content">
                      <GroupInfo group={group} />
                    </div>
                  )}
                  {tabMap[tabIndex] === 'posts' && (
                    <div className="tab-content">
                      <GroupPost slug={group?.slug} group={group} />
                    </div>
                  )}
                  {tabMap[tabIndex] === 'requests' && (
                    <div className="tab-content">
                      <Requests groupSlug={group?.slug} />
                    </div>
                  )}
                  {tabMap[tabIndex] === 'invite' && (
                    <div className="tab-content">
                      <InviteUsers groupSlug={group?.slug} />
                    </div>
                  )}
                  {tabMap[tabIndex] === 'pending' && (
                    <div className="tab-content">
                      <PendingPosts slug={group?.slug} />
                    </div>
                  )}
                  {tabMap[tabIndex] === 'members' && (
                    <div className="tab-content">
                      <Members groupSlug={group?.slug} />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewGroups;

