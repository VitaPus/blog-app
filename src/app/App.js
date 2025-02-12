import React, {useEffect} from 'react'
import { useDispatch } from 'react-redux'
import { articlesFetch } from '../features/article-slice'
import Header from '../components/header'
import classes from './App.module.scss'
import FrameList from '../components/frameList'

const App = () => {
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(articlesFetch()).then((result) => {
      console.log('Результат запроса:', result.payload) // Вывод данных в консоль
    })
  }, [dispatch])
  return (
    <div className={classes.body}>
      <Header />
      <FrameList />
    </div>
  )
}
export default App
