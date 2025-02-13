import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

const initialState = {
  articles: [],
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
}

// Асинхронное действие для загрузки статей
export const articlesFetch = createAsyncThunk('articles/articlesFetch', async () => {
  const response = await fetch('https://blog-platform.kata.academy/api/articles')
  if (!response.ok) {
    throw new Error('Failed to fetch articles')
  }
  const data = await response.json()
  console.log('Данные, полученные с сервера:', data) // ЛОГ В КОНСОЛЬ
  return data.articles
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
        state.articles = action.payload
      })
      .addCase(articlesFetch.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message
        console.error('Ошибка при загрузке статей:', state.error) // ЛОГ ОШИБКИ
      })
  },
})

export default articlesSlice.reducer
