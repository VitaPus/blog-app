import React from 'react'
import { Pagination } from 'antd'
import classes from './pagination.module.scss'

const PaginationItems = ({ currentPage, setCurrentPage, totalArticles }) => {
  return (
    <div className={classes.pagination}>
      <Pagination current={currentPage} total={totalArticles} pageSize={10} onChange={(page) => setCurrentPage(page)} />
    </div>
  )
}

export default PaginationItems
