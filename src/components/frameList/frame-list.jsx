import React from 'react'
import FrameItem from '../frameItem/frameItem'
import classes from './frame-list.module.scss'

const FrameList = ({ articles }) => {
  return (
    <div className={classes.list}>
      {articles.map((article) => (
        <FrameItem key={articles.slug} article={article}/>
      ))}
    </div>
  )
}

export default FrameList
