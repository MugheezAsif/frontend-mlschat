import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchGroupNonMembers,
  inviteUserToGroup,
  fetchInvitedUsers,
} from '../../store/slices/groupsSlice';
import { useNavigate } from 'react-router-dom';

function InviteUsers({ groupSlug }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('invite'); // 'invite' | 'invited'

  const nonMembers = useSelector((state) => state.groups.nonMembers);
  const invitedUsers = useSelector((state) => state.groups.invitedUsers);
  const loadingNon = useSelector((s) => s.groups.nonMembersLoading);
  const loadingInvited = useSelector((s) => s.groups.invitedUsersLoading);

  useEffect(() => {
    if (groupSlug) {
      dispatch(fetchGroupNonMembers(groupSlug));
      dispatch(fetchInvitedUsers(groupSlug));
    }
  }, [dispatch, groupSlug]);

  const handleInvite = async (userId) => {
    try {
      await dispatch(inviteUserToGroup({ groupSlug, userId })).unwrap();
      dispatch(fetchInvitedUsers(groupSlug)); // refresh invited list
    } catch (err) {
      console.error('Invite error:', err.message);
    }
  };

  const handleViewProfile = (userId) => {
    navigate(`/user/${userId}`);
  };

  const filteredNonMembers = nonMembers.filter((u) =>
    u?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredInvited = invitedUsers.filter((i) =>
    i?.user?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const isInviteTab = activeTab === 'invite';
  const isLoading = isInviteTab ? loadingNon : loadingInvited;
  const userList = isInviteTab ? filteredNonMembers : filteredInvited;

  return (
    <div className="card-basic">
      <h5 className="mb-3">Invite Members</h5>

      {/* Tabs */}
      <div className="mb-3">
        <button
          className={`btn btn-sm me-2 ${isInviteTab ? 'btn-primary' : 'btn-outline-primary'}`}
          onClick={() => setActiveTab('invite')}
        >
          Invite Users
        </button>
        <button
          className={`btn btn-sm ${!isInviteTab ? 'btn-primary' : 'btn-outline-primary'}`}
          onClick={() => setActiveTab('invited')}
        >
          Invited Users
        </button>
      </div>

      {/* Search */}
      <input
        type="text"
        className="form-control mb-3"
        placeholder="Search by name"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {/* Content */}
      {isLoading ? (
        <div>Loading users…</div>
      ) : userList.length === 0 ? (
        <div className="text-muted">No users found.</div>
      ) : (
        userList.map((entry) => {
          const user = isInviteTab ? entry : entry.user;

          return (
            <div key={user.id} className="d-flex align-items-center mb-3">
              <img
                src={user.avatar_url}
                alt={user.name}
                className="rounded-circle me-3"
                style={{ width: 48, height: 48, objectFit: 'cover' }}
              />
              <div className="flex-grow-1">
                <div className="fw-bold">{user.name}</div>
                <div className="text-muted small">{user.location}</div>
              </div>
              <button
                className="btn btn-sm btn-outline-secondary me-2"
                onClick={() => handleViewProfile(user.id)}
              >
                View Profile
              </button>
              {isInviteTab && (
                <button
                  className="btn btn-sm btn-outline-primary"
                  onClick={() => handleInvite(user.id)}
                >
                  Invite
                </button>
              )}
            </div>
          );
        })
      )}
    </div>
  );
}

export default InviteUsers;

