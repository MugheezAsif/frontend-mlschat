import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { apiFetch } from '../../lib/apiClient';

export const fetchUserMedias = createAsyncThunk(
  'media/fetchUserMedias',
  async (_, { rejectWithValue }) => {
    try {
      const json = await apiFetch(`${APP_BASE_URL}/api/users/medias`);
      const list = Array.isArray(json?.data) ? json.data : [];

      return list.map(m => ({
        id: m.id,
        uuid: m.uuid,
        slug: m.slug,
        userId: m.user_id,
        url: m.file_url,
        path: m.file_path,
        fileName: m.file_name,
        fileType: m.file_type,   
        mimeType: m.mime_type,  
        size: m.file_size,
        isPrimary: !!m.is_primary,
        uploaded: !!m.uploaded,
        role: m.media_role,
        status: m.media_status,  // active/...
        createdAt: m.created_at,
        updatedAt: m.updated_at,
        // Keep raw in case you need other fields
        raw: m,
      }));
    } catch (err) {
      return rejectWithValue(err.message || 'Network error');
    }
  }
);

const initialState = {
  items: [],
  loading: false,
  error: null,
  lastLoadedAt: null,
};

const mediaSlice = createSlice({
  name: 'media',
  initialState,
  reducers: {
    clearMedia(state) {
      state.items = [];
      state.error = null;
      state.loading = false;
      state.lastLoadedAt = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserMedias.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserMedias.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
        state.lastLoadedAt = Date.now();
      })
      .addCase(fetchUserMedias.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to load media';
      });
  },
});

export const { clearMedia } = mediaSlice.actions;

// ✅ Selectors
export const selectMediaItems = (state) => state.media.items;
export const selectMediaLoading = (state) => state.media.loading;
export const selectMediaError = (state) => state.media.error;

export default mediaSlice.reducer;
