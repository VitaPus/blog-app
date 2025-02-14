import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import { Spin, Alert } from 'antd'
import classes from './article-page.module.scss'

const ArticlePage = () => {
  const { slug } = useParams()
  const [article, setArticle] = useState(null)
  const [status, setStatus] = useState('loading')

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

  return (
    <div className={classes.article}>
      <h1>{article.title}</h1>
      <p className={classes.author}>By {article.author.username}</p>
      <ReactMarkdown className={classes.content}>{article.body}</ReactMarkdown>
    </div>
  )
}

export default ArticlePage
