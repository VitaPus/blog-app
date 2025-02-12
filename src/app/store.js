import { configureStore } from '@reduxjs/toolkit';
import articlesSlice from '../features/article-slice';

export const store = configureStore({
  reducer: {
    articles: articlesSlice,

  },
});
 