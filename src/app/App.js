import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { articlesFetch } from '../features/article-slice'
import Header from '../components/header'
import { Pagination } from 'antd'
import classes from './App.module.scss'
import FrameList from '../components/frameList'

const App = () => {
  const dispatch = useDispatch()
  const { articles} = useSelector((state) => state.articles)

  useEffect(() => {
    dispatch(articlesFetch()).then((result) => {
      console.log('Результат запроса:', result.payload) // Вывод данных в консоль
    })
  }, [dispatch])
  return (
    <div className={classes.body}>
      <Header />
      <FrameList articles={articles} />
      <Pagination  defaultCurrent={1} total={50} />
    </div>
  )
}
export default App
