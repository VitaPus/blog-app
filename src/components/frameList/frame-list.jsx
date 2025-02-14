import React from 'react'
import { Spin, Alert } from 'antd'
import FrameItem from '../frameItem/frameItem'
import classes from './frame-list.module.scss'
import PaginationItems from '../pagination/pagination'

const FrameList = ({ articles, status, totalArticles, currentPage, setCurrentPage }) => {
  if (status === 'loading') return <Spin size="large" className={classes.loader} />
  if (status === 'failed') return <Alert message="Ошибка загрузки статей" type="error" />

  return (
    <div className={classes.list}>
      {articles.length > 0 ? (
        articles.map((article) => <FrameItem key={article.slug} article={article} />)
      ) : (
        <Alert message="Статьи не найдены" type="warning" />
      )}
      <PaginationItems currentPage={currentPage} setCurrentPage={setCurrentPage} totalArticles={totalArticles} />
    </div>
  )
}

export default FrameList
