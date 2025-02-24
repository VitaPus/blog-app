import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import { Spin, Alert, Modal, Button, message, Tag } from 'antd'
import { format } from 'date-fns'
import { enGB } from 'date-fns/locale'
import classes from './article-page.module.scss'
import { useSelector } from 'react-redux'

const ArticlePage = () => {
  const { slug } = useParams()
  const [article, setArticle] = useState(null)
  const [status, setStatus] = useState('loading')
  const { token, user } = useSelector((state) => state.articles || {}) // ⬅️ Добавляем username
  const navigate = useNavigate()
  console.log('Current User:', user?.username)
  console.log('Article Author:', article?.author?.username)

  const handleDelete = () => {
    Modal.confirm({
      title: 'Are you sure you want to delete this article?',
      okText: 'Yes, delete',
      okType: 'danger',
      cancelText: 'Cancel',
      onOk: () => {
        fetch(`https://blog-platform.kata.academy/api/articles/${slug}`, {
          method: 'DELETE',
          headers: {
            Authorization: `Token ${token}`,
          },
        })
          .then((res) => {
            if (res.ok) {
              message.success('Article deleted')
              navigate('/')
              window.location.reload()
            } else {
              throw new Error()
            }
          })
          .catch(() => message.error('Failed to delete article'))
      },
    })
  }
  const handleEdit = () => {
    navigate(`/articles/${slug}/edit`)
  }

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
            <div>
              <div>{article.author.username}</div>
              <div className={classes.date}>{formattedDate}</div>
            </div>
            <img src={article.author.image} alt="avatar" className={classes.avaImg} />
          </div>

          {token && article.author.username === user?.username && (
            <div className={classes.buttonsArticle}>
              <Button danger onClick={handleDelete} className={classes.deleteBtn}>
                Delete
              </Button>
              <Button onClick={handleEdit} className={classes.editeBtn}>Edit</Button>
            </div>
          )}
        </div>
      </div>

      <div className={classes.itemDescription}>{article.description}</div>
      <ReactMarkdown className={classes.content}>{article.body}</ReactMarkdown>
    </div>
  )
}

export default ArticlePage
