import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  filter: 'all',
}

const blogSlice = createSlice({
  name: 'blog',
  initialState,
  reducers: {
    setFilter: (state, action) => {
      state.filter = action.payload
    },
  },
})

export const { setFilter } = blogSlice.actions
export default blogSlice.reducer
