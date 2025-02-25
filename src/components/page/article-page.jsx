import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import { Spin, Alert, Modal, Button, message, Tag } from 'antd'
import { format } from 'date-fns'
import { enGB } from 'date-fns/locale'
import classes from './article-page.module.scss'
import { useDispatch, useSelector } from 'react-redux'
import { likeArticle, unlikeArticle, setLikesFromStorage } from '../../features/like-slice'

const ArticlePage = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { slug } = useParams()

  const [currentArticle, setCurrentArticle] = useState(null)
  const [status, setStatus] = useState('loading')

  const { token, user } = useSelector((state) => state.articles || {})
  const [isLiked, setIsLiked] = useState(false)
  const [favoritesCount, setFavoritesCount] = useState(0)

  useEffect(() => {
    dispatch(setLikesFromStorage())
  }, [dispatch])

  useEffect(() => {
    fetch(`https://blog-platform.kata.academy/api/articles/${slug}`)
      .then((res) => res.json())
      .then((data) => {
        setCurrentArticle(data.article)
        setStatus('succeeded')
        
        // Загружаем лайки из localStorage для текущего пользователя
        const likes = JSON.parse(localStorage.getItem('likes')) || {}
        if (likes[slug]) {
          setIsLiked(likes[slug].favorited)
          setFavoritesCount(likes[slug].favoritesCount)
        }
      })
      .catch(() => setStatus('failed'))
  }, [slug, dispatch])

  const handleLikeClick = (event) => {
    event.stopPropagation()

    // Если пользователь не залогинен
    if (!token) {
      return message.error('Please log in to like articles')
    }

    // Логика для обновления лайков
    const likes = JSON.parse(localStorage.getItem('likes')) || {}

    // Если пользователь не залогинен, лайк не изменяется
    if (isLiked) {
      setIsLiked(false)
      setFavoritesCount(favoritesCount - 1)
      likes[slug] = { favorited: false, favoritesCount: favoritesCount - 1 }
      dispatch(unlikeArticle(slug)) // Отправляем на сервер
    } else {
      setIsLiked(true)
      setFavoritesCount(favoritesCount + 1)
      likes[slug] = { favorited: true, favoritesCount: favoritesCount + 1 }
      dispatch(likeArticle(slug)) // Отправляем на сервер
    }

    // Обновляем localStorage
    localStorage.setItem('likes', JSON.stringify(likes))
  }

  const handleDelete = () => {
    Modal.confirm({
      title: 'Are you sure you want to delete this article?',
      okText: 'Yes, delete',
      okType: 'danger',
      cancelText: 'Cancel',
      onOk: () => {
        fetch(`https://blog-platform.kata.academy/api/articles/${slug}`, {
          method: 'DELETE',
          headers: { Authorization: `Token ${token}` },
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

  const handleEdit = () => navigate(`/articles/${slug}/edit`)

  if (status === 'loading') return <Spin size="large" className={classes.loader} />
  if (status === 'failed') return <Alert message="Ошибка загрузки статьи" type="error" />
  if (!currentArticle) return null

  const formattedDate = format(new Date(currentArticle.createdAt), 'MMM d, yyyy', { locale: enGB })

  return (
    <div className={classes.article}>
      <div className={classes.info}>
        <div className={classes.textInfo}>
          <div>
            <h5 className={classes.itemTitle}>{currentArticle.title}</h5>
            <div className={classes.tags}>
              {currentArticle.tagList.length > 0 ? (
                currentArticle.tagList.map((tag, index) => (
                  <Tag key={index} className={classes.tag}>
                    #{tag}
                  </Tag>
                ))
              ) : (
                <Tag className={classes.tag}>Без тегов</Tag>
              )}
            </div>
          </div>
          <div className={classes.likeBox}>
            <img
              // Используем условие для отображения лайка красным только для залогиненных
              src={isLiked && token ? '/favoriteActive-icon.svg' : '/favorite-icon.svg'}
              alt="likes"
              onClick={handleLikeClick}
            />{' '}
            {favoritesCount}
          </div>
        </div>

        <div className={classes.userInfo}>
          <div className={classes.nameInfo}>
            <div>
              <div>{currentArticle.author.username}</div>
              <div className={classes.date}>{formattedDate}</div>
            </div>
            <img src={currentArticle.author.image} alt="avatar" className={classes.avaImg} />
          </div>
          {token && currentArticle.author.username === user?.username && (
            <div className={classes.buttonsArticle}>
              <Button danger onClick={handleDelete} className={classes.deleteBtn}>
                Delete
              </Button>
              <Button onClick={handleEdit} className={classes.editeBtn}>
                Edit
              </Button>
            </div>
          )}
        </div>
      </div>

      <div className={classes.itemDescription}>{currentArticle.description}</div>
      <ReactMarkdown className={classes.content}>{currentArticle.body}</ReactMarkdown>
    </div>
  )
}

export default ArticlePage
