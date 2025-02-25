// src/features/like-slice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Получаем лайки из localStorage (если есть)
const initialLikes = JSON.parse(localStorage.getItem('likes')) || {};

// Начальное состояние
const initialState = {
  likes: initialLikes, // Загружаем лайки из localStorage
  status: 'idle',
  error: null,
};

// Асинхронная операция для лайка
export const likeArticle = createAsyncThunk(
  'likes/likeArticle',
  async (slug, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`https://blog-platform.kata.academy/api/articles/${slug}/favorite`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Token ${token}`,
        },
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.errors?.message || 'Ошибка при лайке');

      return { slug, favorited: data.article.favorited, favoritesCount: data.article.favoritesCount };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Асинхронная операция для дизлайка
export const unlikeArticle = createAsyncThunk(
  'likes/unlikeArticle',
  async (slug, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`https://blog-platform.kata.academy/api/articles/${slug}/favorite`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Token ${token}`,
        },
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.errors?.message || 'Ошибка при удалении лайка');

      return { slug, favorited: data.article.favorited, favoritesCount: data.article.favoritesCount };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const likeSlice = createSlice({
  name: 'likes',
  initialState,
  reducers: {
    // Восстанавливаем лайки при загрузке
    setLikesFromStorage: (state) => {
      const storedLikes = JSON.parse(localStorage.getItem('likes')) || {};
      state.likes = storedLikes;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(likeArticle.fulfilled, (state, action) => {
        state.likes[action.payload.slug] = {
          favorited: action.payload.favorited,
          favoritesCount: action.payload.favoritesCount,
        };
        localStorage.setItem('likes', JSON.stringify(state.likes)); // Сохраняем в localStorage
      })
      .addCase(unlikeArticle.fulfilled, (state, action) => {
        state.likes[action.payload.slug] = {
          favorited: action.payload.favorited,
          favoritesCount: action.payload.favoritesCount,
        };
        localStorage.setItem('likes', JSON.stringify(state.likes)); // Обновляем localStorage
      });
  },
});

export const { setLikesFromStorage } = likeSlice.actions;
export default likeSlice.reducer;
