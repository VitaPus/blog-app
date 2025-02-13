import React from 'react'
import { format } from 'date-fns'
import { enGB } from 'date-fns/locale'
import classes from './frameitem.module.scss'

const FrameItem = ({ article }) => {
  const formateDate = format(new Date(article.createdAt), 'MMM d, yyy', {locale: enGB})

  return (
    <div className={classes.item}>
      <div className={classes.info}>
        <div className={classes.textInfo}>
          <div>
            <h5 className={classes.itemTitle}>{article.title}</h5>
            <div className={classes.tags}>
              {article.tagList.length > 0 ? (
                article.tagList.map((tag, index) => (
                  <span key={index} className={classes.tag}>
                    #{tag}
                  </span>
                ))
              ) : (
                <span className={classes.tag}>Без тегов</span>
              )}
            </div>
          </div>
          <div>❤️ {article.favoritesCount}</div>
        </div>
        <div className={classes.userInfo}>
          <div className={classes.nameInfo}>
            <div>{article.author.username}</div>
            <div className={classes.date}>{formateDate}</div>
          </div>
          <img src={article.author.image} alt="avatar" />
        </div>
      </div>
      <div className={classes.itemBody}>{article.body}</div>
    </div>
  )
}

export default FrameItem
