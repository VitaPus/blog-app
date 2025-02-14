import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

const initialState = {
  articles: [],
  totalArticles: 0,
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
}

// Асинхронное действие для загрузки статей
export const articlesFetch = createAsyncThunk('articles/articlesFetch', async (page = 1) => {
  const limit = 10;
  const offset = (page - 1) * limit;
  const response = await fetch(`https://blog-platform.kata.academy/api/articles?limit=${limit}&offset=${offset}`)
  if (!response.ok) {
    throw new Error('Failed to fetch articles')
  }
  const data = await response.json()
  console.log('Данные, полученные с сервера:', data) // ЛОГ В КОНСОЛЬ
  return { articles: data.articles, total: data.articlesCount };
})

// Создание слайса
const articlesSlice = createSlice({
  name: 'articles',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(articlesFetch.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(articlesFetch.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.articles = action.payload.articles
        state.totalArticles = action.payload.total
      })
      .addCase(articlesFetch.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message
        console.error('Ошибка при загрузке статей:', state.error) // ЛОГ ОШИБКИ
      })
  },
})

export default articlesSlice.reducer
