import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Spin, Alert } from 'antd'
import FrameItem from '../frameItem/frameItem'
import classes from './frame-list.module.scss'
import PaginationItems from '../pagination/pagination'

const FrameList = ({ articles, status, totalArticles, currentPage, setCurrentPage }) => {
  // Логирование состояния для отладки
  console.log('Articles:', articles)
  console.log('Status:', status)

  const navigate = useNavigate()

  // Отображаем загрузчик, если статус 'loading'
  if (status === 'loading') return <Spin size="large" className={classes.loader} />

  // Если ошибка загрузки, показываем alert
  if (status === 'failed') return <Alert message="Ошибка загрузки статей" type="error" />

  const handleArticleClick = (slug) => {
    navigate(`/articles/${slug}`)
  }

  return (
    <div className={classes.list}>
      {/* Если статьи есть, отображаем их */}
      {articles.length > 0 ? (
        articles.map((article) => (
          <FrameItem 
            key={article.slug} 
            article={article} 
            onClick={() => handleArticleClick(article.slug)} // передаем slug в функцию
          />
        ))
      ) : (
        // Если нет статей, показываем предупреждение
        <Alert message="Статьи не найдены" type="warning" />
      )}

      {/* Пагинация */}
      <PaginationItems currentPage={currentPage} setCurrentPage={setCurrentPage} totalArticles={totalArticles} />
    </div>
  )
}

export default FrameList
