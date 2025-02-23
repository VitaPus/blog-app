import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const initialState = {
  // Статьи
  articles: [],
  totalArticles: 0,
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,

  // Пользователь
  user: JSON.parse(localStorage.getItem('user')) || null,
  token: localStorage.getItem('token') || null,
  userStatus: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  userError: null,
};

// Асинхронное действие для загрузки статей
export const articlesFetch = createAsyncThunk('articles/articlesFetch', async (page = 1) => {
  const limit = 10;
  const offset = (page - 1) * limit;

  try {
    const response = await fetch(`https://blog-platform.kata.academy/api/articles?limit=${limit}&offset=${offset}`);
    const data = await response.json();

    if (!response.ok) throw new Error(data.errors?.message || 'Ошибка загрузки статей');

    return { articles: data.articles, total: data.articlesCount };
  } catch (error) {
    throw new Error(error.message || 'Ошибка загрузки статей');
  }
});

// Регистрация
export const signUp = createAsyncThunk('user/signUp', async (userData, { rejectWithValue }) => {
  try {
    const response = await fetch('https://blog-platform.kata.academy/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user: userData }),
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.errors?.message || 'Ошибка регистрации');

    // Сохраняем пользователя и токен
    localStorage.setItem('token', data.user.token);
    localStorage.setItem('user', JSON.stringify(data.user));

    return data.user;
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

// Логин
export const signIn = createAsyncThunk('user/signIn', async (credentials, { rejectWithValue }) => {
  try {
    const response = await fetch('https://blog-platform.kata.academy/api/users/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user: credentials }),
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.errors?.message || 'Ошибка авторизации');

    // Сохраняем пользователя и токен
    localStorage.setItem('token', data.user.token);
    localStorage.setItem('user', JSON.stringify(data.user));

    return data.user;
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

// Обновление профиля
export const updateUser = createAsyncThunk('user/updateUser', async (userData, { rejectWithValue }) => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch('https://blog-platform.kata.academy/api/user', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Token ${token}` },
      body: JSON.stringify({ user: userData }),
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.errors?.message || 'Ошибка обновления профиля');

    // Обновляем данные в localStorage
    localStorage.setItem('user', JSON.stringify(data.user));

    return data.user;
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

//Создание статьи
export const sendArticle = createAsyncThunk(
  'articles/sendArticle', async (articleData, { rejectWithValue }) => {
  try {
    const token = localStorage.getItem('token')
    const response = await fetch('https://blog-platform.kata.academy/api/articles', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json',
        Authorization: `Token ${token}` },
      body: JSON.stringify({
        article: {
          title: articleData.title,
          description: articleData.description,
          body: articleData.body,
          tagList: articleData.tagList || []
        }}),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.errors?.message || 'Ошибка при создании статьи');

    return data.article;
  } catch (err) {
    return rejectWithValue(err.message)
  }
})

const articleSlice = createSlice({
  name: 'article',
  initialState,
  reducers: {
    logIn: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      localStorage.setItem('user', JSON.stringify(action.payload.user));
      localStorage.setItem('token', action.payload.token);
    },
    logOut: (state) => {
      console.log('🚪 Пользователь вышел из аккаунта');
      state.user = null;
      state.token = null;
      state.userStatus = 'idle';
      state.userError = null;
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    },
  },
  extraReducers: (builder) => {
    builder
      // Статьи
      .addCase(articlesFetch.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(articlesFetch.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.articles = action.payload.articles;
        state.totalArticles = action.payload.total;
      })
      .addCase(articlesFetch.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
        console.error('Ошибка загрузки статей:', action.error.message);
      })

      // Регистрация
      .addCase(signUp.pending, (state) => {
        state.userStatus = 'loading';
      })
      .addCase(signUp.fulfilled, (state, action) => {
        state.userStatus = 'succeeded';
        state.user = action.payload;
        state.token = action.payload.token;
      })
      .addCase(signUp.rejected, (state, action) => {
        state.userStatus = 'failed';
        state.userError = action.payload;
        console.error('Ошибка регистрации:', action.payload);
      })

      // Логин
      .addCase(signIn.pending, (state) => {
        state.userStatus = 'loading';
      })
      .addCase(signIn.fulfilled, (state, action) => {
        state.userStatus = 'succeeded';
        state.user = action.payload;
        state.token = action.payload.token;
      })
      .addCase(signIn.rejected, (state, action) => {
        state.userStatus = 'failed';
        state.userError = action.payload;
        console.error('Ошибка авторизации:', action.payload);
      })

      // Обновление профиля
      .addCase(updateUser.pending, (state) => {
        state.userStatus = 'loading';
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.userStatus = 'succeeded';
        state.user = action.payload;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.userStatus = 'failed';
        state.userError = action.payload;
        console.error('Ошибка обновления профиля:', action.payload);
      })

      .addCase(sendArticle.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(sendArticle.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.articles.push(action.payload); // добавляем новую статью в список
      })
      .addCase(sendArticle.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
        console.error('Ошибка создания статьи:', action.payload);
      });
      
  },
});

export const { logOut, logIn } = articleSlice.actions;
export default articleSlice.reducer;
