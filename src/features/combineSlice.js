import { combineReducers } from '@reduxjs/toolkit'
import articleSlice from './article-slice'
import userSlice from './userSlice'

const combineSlice = combineReducers({
  articles: articleSlice,
  user: userSlice,
})

export default combineSlice
