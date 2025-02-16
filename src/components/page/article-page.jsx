import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import { Spin, Alert } from 'antd'
import { format } from 'date-fns';
import { enGB } from 'date-fns/locale';
import classes from './article-page.module.scss'

const ArticlePage = () => {
  const { slug } = useParams()
  const [article, setArticle] = useState(null)
  const [status, setStatus] = useState('loading')

  let formattedDate = ''
  if (article) {
    formattedDate = format(new Date(article.createdAt), 'MMM d, yyyy', { locale: enGB })
  }

  useEffect(() => {
    fetch(`https://blog-platform.kata.academy/api/articles/${slug}`)
      .then((res) => res.json())
      .then((data) => {
        setArticle(data.article)
        setStatus('succeeded')
      })
      .catch(() => {
        setStatus('failed')
      })
  }, [slug])

  if (status === 'loading') return <Spin size="large" className={classes.loader} />
  if (status === 'failed') return <Alert message="Ошибка загрузки статьи" type="error" />
  if (!article) return null

  return (
    <div className={classes.article}>
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
            <div className={classes.date}>{formattedDate}</div>
          </div>
          <img src={article.author.image} alt="avatar" className={classes.avaImg} />
        </div>
      </div>
      <p className={classes.description}>{article.description}</p>
      <ReactMarkdown className={classes.content}>{article.body}</ReactMarkdown>
    </div>
  )
}

export default ArticlePage
