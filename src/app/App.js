import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { articlesFetch } from '../features/article-slice'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Header from '../components/header'
import FrameList from '../components/frameList'
import ArticlePage from '../components/page'
import classes from './App.module.scss'

const App = () => {
  const dispatch = useDispatch()
  const { articles, totalArticles, status } = useSelector((state) => state.articles)
  const [currentPage, setCurrentPage] = useState(1)

  useEffect(() => {
    dispatch(articlesFetch(currentPage))
  }, [dispatch, currentPage])

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
        </Routes>
      </div>
    </Router>
  )
}

export default App
