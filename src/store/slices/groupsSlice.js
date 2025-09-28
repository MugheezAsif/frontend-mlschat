// src/store/slices/groupsSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
import { apiFetch } from '../../lib/apiClient';


export const rejectGroupPost = createAsyncThunk(
  'groups/rejectGroupPost',
  async ({ groupSlug, postSlug }, { rejectWithValue }) => {
    try {
      const data = await apiFetch(
        `${APP_BASE_URL}/api/group/${groupSlug}/reject-post/${postSlug}`,
        {
          method: 'PUT', // <-- Spec says PUT (not DELETE)
        }
      );
      if (data?.success === false) {
        return rejectWithValue(data?.message || 'Failed to reject post');
      }
      return { postSlug };
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to reject post');
    }
  }
);

/* 🔁 1. List – all groups */
export const fetchGroups = createAsyncThunk(
  'groups/fetchGroups',
  async () => {
    const data = await apiFetch(`${APP_BASE_URL}/api/group`);
    return data.data || [];
  }
);

/* 🔎 2. Show – single group by ID */
export const fetchGroupById = createAsyncThunk(
  'groups/fetchGroupById',
  async (id) => {
    const data = await apiFetch(`${APP_BASE_URL}/api/group/${id}`);
    return data.data;            // single-group object
  }
);

/* ➕ 3. Join – current user joins a group (slug) */
export const joinGroup = createAsyncThunk(
  'groups/joinGroup',
  async (slug) => {
    const data = await apiFetch(`${APP_BASE_URL}/api/group/${slug}/join`, {
      method: 'POST',
    });
    return data.data;            // the new GroupUser record
  }
);

/* 👥 4. Members – list all (accepted & pending) */
export const fetchGroupMembers = createAsyncThunk(
  'groups/fetchGroupMembers',
  async (slug) => {
    const data = await apiFetch(`${APP_BASE_URL}/api/group/${slug}/members`);
    return data.data;            // array of GroupUser records + user
  }
);

/* 📝 5. Posts – list all posts in the group */
export const fetchGroupPosts = createAsyncThunk(
  'groups/fetchGroupPosts',
  async (slug) => {
    const data = await apiFetch(`${APP_BASE_URL}/api/group/${slug}/posts`);
    return data.data;          // array of posts
  }
);

/* ❌ 6. Non-members – users not in the group */
export const fetchGroupNonMembers = createAsyncThunk(
  'groups/fetchGroupNonMembers',
  async (slug) => {
    const data = await apiFetch(`${APP_BASE_URL}/api/group/${slug}/non-members`);
    return data.data; // array of users
  }
);


export const approveGroupMember = createAsyncThunk(
  'groups/approveGroupMember',
  async ({ groupSlug, userId }) => {
    await apiFetch(`${APP_BASE_URL}/api/group/${groupSlug}/approve-member/${userId}`, {
      method: 'PUT',
    });
    return { userId }; // for frontend state update
  }
);

export const approveGroupPost = createAsyncThunk(
  'groups/approveGroupPost',
  async ({ groupSlug, postSlug }, { rejectWithValue }) => {
    try {
      await apiFetch(`${APP_BASE_URL}/api/group/${groupSlug}/approve-post/${postSlug}`, {
        method: 'PUT',
      });
      return { postSlug };
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to approve post');
    }
  }
);

export const inviteUserToGroup = createAsyncThunk(
  'groups/inviteUserToGroup',
  async ({ groupSlug, userId }) => {
    await apiFetch(`${APP_BASE_URL}/api/group/${groupSlug}/invite-member/${userId}`, {
      method: 'POST',
    });
    return { userId };
  }
);

export const fetchInvitedUsers = createAsyncThunk(
  'groups/fetchInvitedUsers',
  async (slug) => {
    const data = await apiFetch(`${APP_BASE_URL}/api/group/${slug}/invite-pendings`, {
      method: 'GET',
    });
    return data.data; // array of invited users
  }
);

export const fetchPendingGroupPosts = createAsyncThunk(
  'groups/fetchPendingGroupPosts',
  async (slug) => {
    const data = await apiFetch(`${APP_BASE_URL}/api/group/${slug}/pending-posts`);
    return data.data; // array of pending posts
  }
);

export const removeGroupMember = createAsyncThunk(
  'groups/removeGroupMember',
  async ({ groupSlug, userId }, { rejectWithValue }) => {
    try {
      await apiFetch(`${APP_BASE_URL}/api/group/${groupSlug}/reject-member/${userId}`, {
        method: 'DELETE',
      });
      return { userId };
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to remove member');
    }
  }
);

// Inside groupsSlice.js
export const updateGroupSettings = createAsyncThunk(
  'groups/updateGroupSettings',
  async ({ slug, settings }, { rejectWithValue }) => {
    try {
      const data = await apiFetch(`${APP_BASE_URL}/api/group`, {
        method: 'PUT',
        body: JSON.stringify({
          group_slug: slug,
          ...settings
        }),
      });
      return data.data;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to update group settings');
    }
  }
);







const groupsSlice = createSlice({
  name: 'groups',
  initialState: {
    groups: [],          // list view
    currentGroup: null,  // show view

    membershipStatus: 'none', // 'none' | 'requested' | 'joined'

    members: [],         // all members for currentGroup
    pendingMembers: [],  // derived below

    posts: [],           // posts for current group
    postsLoading: false,

    loading: false,      // list / show
    membersLoading: false,
    joinLoading: false,

    nonMembers: [],
    nonMembersLoading: false,

    invitedUsers: [],
    invitedUsersLoading: false,

    pendingPosts: [],
    pendingPostsLoading: false,




    error: null,
    joinError: null,
  },
  reducers: {},
  extraReducers: (b) => {
    /* ===== list ===== */
    b.addCase(fetchGroups.pending, (s) => { s.loading = true; s.error = null; });
    b.addCase(fetchGroups.fulfilled, (s, a) => { s.loading = false; s.groups = a.payload; });
    b.addCase(fetchGroups.rejected, (s, a) => { s.loading = false; s.error = a.error.message; });

    /* ===== show ===== */
    b.addCase(fetchGroupById.pending, (s) => { s.loading = true; s.error = null; s.currentGroup = null; });
    b.addCase(fetchGroupById.fulfilled, (s, a) => {
      s.loading = false; s.currentGroup = a.payload; const rec = a.payload.is_member?.[0];        // undefined if not a member
      if (!rec) s.membershipStatus = 'none';
      else if (rec.status === 'accepted')
        s.membershipStatus = 'joined';
      else s.membershipStatus = 'requested';

      delete s.currentGroup.is_member;             // optional clean-up
    });
    b.addCase(fetchGroupById.rejected, (s, a) => { s.loading = false; s.error = a.error.message; });

    /* ===== join ===== */
    b.addCase(joinGroup.pending, (s) => { s.joinLoading = true; s.joinError = null; });
    b.addCase(joinGroup.fulfilled, (s, a) => {
      s.joinLoading = false; 
      const newStatus = a.payload.status === 'accepted' ? 'joined' : 'requested';
      s.membershipStatus = newStatus;
      
      if (newStatus === 'joined' && s.currentGroup) {
        s.currentGroup.members_count = (s.currentGroup.members_count || 0) + 1;
      }
    });
    b.addCase(joinGroup.rejected, (s, a) => { s.joinLoading = false; s.joinError = a.error.message; });

    /* ===== members ===== */
    b.addCase(fetchGroupMembers.pending, (s) => { s.membersLoading = true; })
    b.addCase(fetchGroupMembers.fulfilled, (s, a) => {
      s.membersLoading = false;
      s.members = a.payload;
      s.pendingMembers = a.payload.filter((u) => u.status === 'pending');
    })
    b.addCase(fetchGroupMembers.rejected, (s, a) => { s.membersLoading = false; s.error = a.error.message; });

    /* ===== posts ===== */
    b.addCase(fetchGroupPosts.pending, (s) => { s.postsLoading = true; });
    b.addCase(fetchGroupPosts.fulfilled, (s, a) => {
      s.postsLoading = false;
      s.posts = a.payload;
    });
    b.addCase(fetchGroupPosts.rejected, (s, a) => {
      s.postsLoading = false;
      s.error = a.error.message;
    });

    b.addCase(approveGroupMember.fulfilled, (state, action) => {
      const userId = action.payload.userId;
      // Remove the approved user from pending list
      state.members = state.members.map((m) =>
        m.user_id === userId ? { ...m, status: 'accepted' } : m
      );
      state.pendingMembers = state.members.filter((m) => m.status === 'pending');
      
      // Increment members_count when approving a member
      if (state.currentGroup) {
        state.currentGroup.members_count = (state.currentGroup.members_count || 0) + 1;
      }
    });

    /* ===== non-members ===== */
    b.addCase(fetchGroupNonMembers.pending, (s) => {
      s.nonMembersLoading = true;
    });
    b.addCase(fetchGroupNonMembers.fulfilled, (s, a) => {
      s.nonMembersLoading = false;
      s.nonMembers = a.payload;
    });
    b.addCase(fetchGroupNonMembers.rejected, (s, a) => {
      s.nonMembersLoading = false;
      s.error = a.error.message;
    });
    b.addCase(fetchInvitedUsers.pending, (s) => {
      s.invitedUsersLoading = true;
    });
    b.addCase(fetchInvitedUsers.fulfilled, (s, a) => {
      s.invitedUsersLoading = false;
      s.invitedUsers = a.payload;
    });
    b.addCase(fetchInvitedUsers.rejected, (s, a) => {
      s.invitedUsersLoading = false;
      s.error = a.error.message;
    });

    b.addCase(inviteUserToGroup.fulfilled, (state, action) => {
      const userId = action.payload.userId;
      const user = state.nonMembers.find((u) => u.id === userId);
      if (user) {
        state.invitedUsers.push(user); // Add to invited list
        state.nonMembers = state.nonMembers.filter((u) => u.id !== userId); // Remove from nonMembers
      }
    });

    b.addCase(fetchPendingGroupPosts.pending, (s) => {
      s.pendingPostsLoading = true;
    });
    b.addCase(fetchPendingGroupPosts.fulfilled, (s, a) => {
      s.pendingPostsLoading = false;
      s.pendingPosts = a.payload;
    });
    b.addCase(fetchPendingGroupPosts.rejected, (s, a) => {
      s.pendingPostsLoading = false;
      s.error = a.error.message;
    });

    b.addCase(approveGroupPost.fulfilled, (state, action) => {
      const { postSlug } = action.payload;

      // Remove the approved post from the pendingPosts list
      state.pendingPosts = state.pendingPosts.filter(p => p.slug !== postSlug);

      // Show toast
      toast.success('Post approved successfully');
    });

    b.addCase(approveGroupPost.rejected, (state, action) => {
      toast.error(action.payload || 'Error approving post');
    });
    b.addCase(removeGroupMember.fulfilled, (state, action) => {
      const userId = action.payload.userId;
      state.members = state.members.filter((m) => m.user_id !== userId);
      
      // Decrement members_count when removing a member
      if (state.currentGroup && state.currentGroup.members_count > 0) {
        state.currentGroup.members_count = state.currentGroup.members_count - 1;
      }
    });

    b.addCase(removeGroupMember.rejected, (state, action) => {
      toast.error(action.payload || 'Error removing member');
    });

    b.addCase(updateGroupSettings.fulfilled, (s, a) => {
      toast.success('Settings updated');
      s.currentGroup = a.payload;
    });
    b.addCase(updateGroupSettings.rejected, (s, a) => {
      toast.error(a.payload || 'Error updating settings');
    });
    b.addCase(rejectGroupPost.fulfilled, (state, action) => {
      const { postSlug } = action.payload;
      state.pendingPosts = state.pendingPosts.filter(p => p.slug !== postSlug);
      toast.success('Post rejected successfully');
    });

    b.addCase(rejectGroupPost.rejected, (state, action) => {
      toast.error(action.payload || 'Error rejecting post');
    });









  },
});

export default groupsSlice.reducer;
