import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { apiFetch } from '../../lib/apiClient'; // adjust path


export const fetchFeedPosts = createAsyncThunk(
  'posts/fetchFeedPosts',
  async () => {
    try {
      const data = await apiFetch(`${APP_BASE_URL}/api/feed`);
      return Array.isArray(data?.data) ? data.data : [];
    } catch (err) {
      console.error('[fetchFeedPosts] error:', err);
      throw err;
    }
  }
);

export const fetchUserPosts = createAsyncThunk(
  'posts/fetchUserPosts',
  async () => {
    try {
      const data = await apiFetch(`${APP_BASE_URL}/api/posts/my`);
      return data.data || [];
    } catch (err) {
      console.error('[fetchUserPosts] error:', err);
      throw err;
    }
  }
);

export const fetchFriendPosts = createAsyncThunk(
  'posts/fetchFriendPosts',
  async (userId) => {
    try {
      const data = await apiFetch(`${APP_BASE_URL}/api/users/${userId}/posts`);
      return data.data || [];
    } catch (err) {
      console.error('[fetchFriendPosts] error:', err);
      throw err;
    }
  }
);

export const deletePostById = createAsyncThunk(
  'posts/deletePostById',
  async (postId) => {
    await apiFetch(`${APP_BASE_URL}/api/posts/${postId}`, {
      method: 'DELETE',
    });
    return postId;
  }
);

export const hidePostById = createAsyncThunk(
  'posts/hidePostById',
  async (postId) => {
    const data = await apiFetch(`${APP_BASE_URL}/api/posts/${postId}/hide`, {
      method: 'POST',
    });
    if (!data.success) {
      throw new Error(data.message || 'Failed to hide post');
    }
    return postId;
  }
);

export const fetchGroupPosts = createAsyncThunk(
  'posts/fetchGroupPosts',
  async (slug) => {
    const data = await apiFetch(`${APP_BASE_URL}/api/group/${slug}/posts`);
    return data.data;
  }
);

export const fetchSavedPosts = createAsyncThunk(
  'posts/fetchSavedPosts',
  async () => {
    try {
      const data = await apiFetch(`${APP_BASE_URL}/api/posts/saved`);
      return data.data || [];
    } catch (err) {
      console.error('[fetchSavedPosts] error:', err);
      throw err;
    }
  }
);

const postsSlice = createSlice({
  name: 'posts',
  initialState: {
    feedPosts: [],
    userPosts: [],
    groupPosts: [],
    friendPosts: [],
    savedPosts: [],
    loading: false,
    error: null,
  },
  reducers: {
    // DEEP-MERGE essential nested fields so we never drop user/groups/media on partial API responses
    updatePost: (state, action) => {
      const incoming = action.payload;

      const mergeOne = (oldPost) => {
        if (!oldPost) return incoming;
        return {
          ...oldPost,
          ...incoming,
          user: incoming.user ?? oldPost.user,
          groups: incoming.groups ?? oldPost.groups,
          group_posts: incoming.group_posts ?? oldPost.group_posts,
          media_urls: incoming.media_urls ?? oldPost.media_urls,
          media: incoming.media ?? oldPost.media,
          like_count: incoming.like_count ?? oldPost.like_count,
          comment_count: incoming.comment_count ?? oldPost.comment_count,
          share_count: incoming.share_count ?? oldPost.share_count,
          liked_by: incoming.liked_by ?? oldPost.liked_by,
          saved_by: incoming.saved_by ?? oldPost.saved_by,
        };
      };

      const updateInList = (list) => list.map((p) => (p.id === incoming.id ? mergeOne(p) : p));

      state.feedPosts   = updateInList(state.feedPosts);
      state.userPosts   = updateInList(state.userPosts);
      state.friendPosts = updateInList(state.friendPosts);
      state.groupPosts  = updateInList(state.groupPosts);
      state.savedPosts  = updateInList(state.savedPosts);
    },
    addPost: (state, action) => {
      state.feedPosts.unshift(action.payload);
      state.userPosts.unshift(action.payload);
    },
    addGroupPost: (state, action) => {
      state.groupPosts.unshift(action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFeedPosts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFeedPosts.fulfilled, (state, action) => {
        state.feedPosts = action.payload;
        state.loading = false;
      })
      .addCase(fetchFeedPosts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      .addCase(fetchUserPosts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserPosts.fulfilled, (state, action) => {
        state.userPosts = action.payload;
        state.loading = false;
      })
      .addCase(fetchUserPosts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      .addCase(fetchFriendPosts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFriendPosts.fulfilled, (state, action) => {
        state.friendPosts = action.payload;
        state.loading = false;
      })
      .addCase(fetchFriendPosts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      .addCase(deletePostById.fulfilled, (state, action) => {
        const postId = action.payload;
        const filterOut = (list) => list.filter((post) => post.id !== postId);
        state.feedPosts = filterOut(state.feedPosts);
        state.userPosts = filterOut(state.userPosts);
        state.friendPosts = filterOut(state.friendPosts);
        state.savedPosts = filterOut(state.savedPosts);
      })
      .addCase(deletePostById.rejected, (state, action) => {
        state.error = action.error.message;
      })

      .addCase(hidePostById.fulfilled, (state, action) => {
        const postId = action.payload;
        const removePost = (list) => list.filter((post) => post.id !== postId);
        state.feedPosts = removePost(state.feedPosts);
        state.userPosts = removePost(state.userPosts);
        state.friendPosts = removePost(state.friendPosts);
        state.savedPosts = removePost(state.savedPosts);
      })
      .addCase(hidePostById.rejected, (state, action) => {
        state.error = action.error.message;
      })

      .addCase(fetchGroupPosts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchGroupPosts.fulfilled, (state, action) => {
        state.groupPosts = action.payload;
        state.loading = false;
      })
      .addCase(fetchGroupPosts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      .addCase(fetchSavedPosts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSavedPosts.fulfilled, (state, action) => {
        state.savedPosts = action.payload;
        state.loading = false;
      })
      .addCase(fetchSavedPosts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { updatePost, addPost, addGroupPost } = postsSlice.actions;
export default postsSlice.reducer;
