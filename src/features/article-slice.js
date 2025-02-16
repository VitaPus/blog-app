import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

const initialState = {
  // Статьи
  articles: [],
  totalArticles: 0,
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
  
  // Пользователь
  user: null,
  token: localStorage.getItem('token') || null,
  userStatus: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  userError: null,
}

// Асинхронное действие для загрузки статей
export const articlesFetch = createAsyncThunk('articles/articlesFetch', async (page = 1) => {
  const limit = 10
  const offset = (page - 1) * limit

  try {
    const response = await fetch(`https://blog-platform.kata.academy/api/articles?limit=${limit}&offset=${offset}`)
    
    if (!response.ok) {
      throw new Error('Failed to fetch articles')
    }

    const data = await response.json()
    console.log('Данные, полученные с сервера:', data) // Логирование для отладки

    return { articles: data.articles, total: data.articlesCount }
  } catch (error) {
    throw new Error(error.message || 'Ошибка загрузки статей')
  }
})

// Регистрация
export const signUp = createAsyncThunk('user/signUp', async (userData, { rejectWithValue }) => {
  try {
    const response = await fetch('https://blog-platform.kata.academy/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user: userData }),
    })
    if (!response.ok) throw new Error('Ошибка регистрации')
    const data = await response.json()
    localStorage.setItem('token', data.user.token)
    return data.user
  } catch (err) {
    return rejectWithValue(err.message)
  }
})

// Логин
export const signIn = createAsyncThunk('user/signIn', async (credentials, { rejectWithValue }) => {
  try {
    const response = await fetch('https://blog-platform.kata.academy/api/users/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user: credentials }),
    })
    if (!response.ok) throw new Error('Ошибка авторизации')
    const data = await response.json()
    localStorage.setItem('token', data.user.token)
    return data.user
  } catch (err) {
    return rejectWithValue(err.message)
  }
})

// Обновление профиля
export const updateUser = createAsyncThunk('user/updateUser', async (userData, { rejectWithValue }) => {
  try {
    const token = localStorage.getItem('token')
    const response = await fetch('https://blog-platform.kata.academy/api/user', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Token ${token}` },
      body: JSON.stringify({ user: userData }),
    })
    if (!response.ok) throw new Error('Ошибка обновления')
    const data = await response.json()
    return data.user
  } catch (err) {
    return rejectWithValue(err.message)
  }
})

const articleSlice = createSlice({
  name: 'article',
  initialState,
  reducers: {
    logOut: (state) => {
      state.user = null
      state.token = null
      state.userStatus = 'idle'
      state.userError = null
      localStorage.removeItem('token')
    },
  },
  extraReducers: (builder) => {
    // Статьи
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
        console.error('Ошибка при загрузке статей:', action.error.message)
      })
      
      // Регистрация
      .addCase(signUp.pending, (state) => {
        state.userStatus = 'loading'
      })
      .addCase(signUp.fulfilled, (state, action) => {
        state.userStatus = 'succeeded'
        state.user = action.payload
        state.token = action.payload.token
      })
      .addCase(signUp.rejected, (state, action) => {
        state.userStatus = 'failed'
        state.userError = action.payload
      })
      
      // Логин
      .addCase(signIn.pending, (state) => {
        state.userStatus = 'loading'
      })
      .addCase(signIn.fulfilled, (state, action) => {
        state.userStatus = 'succeeded'
        state.user = action.payload
        state.token = action.payload.token
      })
      .addCase(signIn.rejected, (state, action) => {
        state.userStatus = 'failed'
        state.userError = action.payload
      })
      
      // Обновление профиля
      .addCase(updateUser.pending, (state) => {
        state.userStatus = 'loading'
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.userStatus = 'succeeded'
        state.user = action.payload
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.userStatus = 'failed'
        state.userError = action.payload
      })
  },
})

export const { logOut } = articleSlice.actions
export default articleSlice.reducer
