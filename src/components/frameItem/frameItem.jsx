import React from 'react'
import { format } from 'date-fns'
import { enGB } from 'date-fns/locale'
import classes from './frameitem.module.scss'
import { Tag } from 'antd'

const FrameItem = ({ article, onClick }) => {
  const formattedDate = format(new Date(article.createdAt), 'MMM d, yyyy', { locale: enGB })

  return (
    <div className={classes.item} onClick={() => onClick(article.slug)}>
      {' '}
      {/* Добавляем onClick */}
      <div className={classes.info}>
        <div className={classes.textInfo}>
          <div>
            <h5 className={classes.itemTitle}>{article.title}</h5>
            <div className={classes.tags}>
              {article.tagList.length > 0 ? (
                article.tagList.map((tag, index) => (
                  <Tag key={index} className={classes.tag}>
                    #{tag}
                  </Tag>
                ))
              ) : (
                <Tag className={classes.tag}>Без тегов</Tag>
              )}
            </div>
          </div>
          <div>❤️ {article.favoritesCount}</div>
        </div>
        <div className={classes.userInfo}>
          <div className={classes.nameInfo}>
            <div>{article.author.username}</div>
            <div className={classes.date}>{formattedDate}</div>
          </div>
          <img src={article.author.image} alt="avatar" className={classes.avaImg} />
        </div>
      </div>
      <div className={classes.itemDescription}>{article.description}</div>
    </div>
  )
}

export default FrameItem
