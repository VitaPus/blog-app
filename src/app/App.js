import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { articlesFetch } from '../features/article-slice'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Header from '../components/header'
import FrameList from '../components/frameList'
import ArticlePage from '../components/page'
import SignInPage from '../components/signInPage'
import SignUpPage from '../components/signUpPage'
import ProfilePage from '../components/profilePage'
import classes from './App.module.scss'

const App = () => {
  const dispatch = useDispatch()
  const [currentPage, setCurrentPage] = useState(1)
  
  // Получаем состояние из Redux
  const articles = useSelector((state) => state.articles.articles)
  const status = useSelector((state) => state.articles.status)
  const totalArticles = useSelector((state) => state.articles.totalArticles)

  useEffect(() => {
    // Загрузка статей для текущей страницы
    dispatch(articlesFetch(currentPage))
  }, [dispatch, currentPage])  // Зависимости: изменение currentPage вызывает новый запрос

  // Логируем для диагностики
  useEffect(() => {
    console.log('Articles:', articles)
    console.log('Status:', status)
    console.log('Total Articles:', totalArticles)
  }, [articles, status, totalArticles])  // Логируем изменения данных

  return (
    <Router>
      <div className={classes.body}>
        <Header />
        <Routes>
          <Route path="/" element={<Navigate replace to="/articles" />} />
          <Route path="/articles/:slug" element={<ArticlePage />} />
          <Route
            path="/articles"
            element={
              <FrameList
                articles={articles}
                status={status}
                totalArticles={totalArticles}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
              />
            }
          />
          <Route path="/sign-in" element={<SignInPage />} />
          <Route path="/sign-up" element={<SignUpPage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
