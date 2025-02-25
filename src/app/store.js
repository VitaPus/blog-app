// src/store/index.js
import { configureStore } from '@reduxjs/toolkit';
import articlesSlice from '../features/article-slice';
import likeSlice from '../features/like-slice'; // Подключаем слайс для лайков

export const store = configureStore({
  reducer: {
    articles: articlesSlice,
    likes: likeSlice, // Добавляем слайс лайков
  },
});
