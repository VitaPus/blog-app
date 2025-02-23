import React, { useEffect, useState } from 'react'
import classes from './edit-article.module.scss'
import { useSelector } from 'react-redux'
import { useForm } from 'react-hook-form'
import { useNavigate, useParams } from 'react-router-dom'
import { message, Spin } from 'antd'

const EditArticle = () => {
  const { slug } = useParams()
  const { token } = useSelector((state) => state.articles || {})
  const { register, handleSubmit, setValue } = useForm()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [tags, setTags] = useState([])
  const [tagInput, setTagInput] = useState('')

  // Загрузка статьи
  useEffect(() => {
    fetch(`https://blog-platform.kata.academy/api/articles/${slug}`)
      .then((res) => res.json())
      .then((data) => {
        const article = data.article
        setValue('title', article.title)
        setValue('description', article.description)
        setValue('body', article.body)
        setTags(article.tagList || []) // ✅ Загружаем теги
        setLoading(false)
      })
      .catch(() => {
        message.error('Failed to load article')
        setLoading(false)
      })
  }, [slug, setValue])

  // ✅ Добавление тега
  const addTag = (e) => {
    e.preventDefault()
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()])
      setTagInput('')
    }
  }

  // ✅ Удаление тега
  const removeTag = (index) => {
    setTags(tags.filter((_, i) => i !== index))
  }

  // ✅ Сохранение статьи
  const onSubmit = async (data) => {
    const updatedData = {
      ...data,
      tagList: tags, // Добавляем теги
    }

    try {
      const response = await fetch(`https://blog-platform.kata.academy/api/articles/${slug}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Token ${token}`,
        },
        body: JSON.stringify({ article: updatedData }),
      })

      if (!response.ok) throw new Error('Failed to update article')

      message.success('Article updated successfully')
      navigate(`/articles/${slug}`)
    } catch (error) {
      message.error(error.message)
    }
  }

  if (loading) return <Spin size="large" className={classes.loader} />

  return (
    <div className={classes.formPos}>
      <h3>Edit article</h3>
      <form onSubmit={handleSubmit(onSubmit)} className={classes.formIn}>
        {/* Title */}
        <div className={classes.inputBox}>
          <label>Title</label>
          <input type="text" {...register('title', { required: 'title is required' })} placeholder="Title" />
        </div>

        {/* Short description */}
        <div className={classes.inputBox}>
          <label>Short description</label>
          <input
            type="text"
            {...register('description', { required: 'description is required' })}
            placeholder="Description"
          />
        </div>

        {/* Main text */}
        <div className={classes.inputBox}>
          <label>Text</label>
          <textarea {...register('body', { required: 'text is required' })} placeholder="Text" />
        </div>

        {/* Tags */}
        <div className={classes.inputTag}>
          <label>Tags</label>
          <div className={classes.tagInputWrapper}>
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              placeholder="Enter tag"
            />
            <button onClick={addTag}>Add tag</button>
          </div>

          {/* Список тегов */}
          <ul className={classes.tagList}>
            {tags.map((tag, index) => (
              <li key={index} className={classes.tagItem}>
                {tag}
                <button type="button" onClick={() => removeTag(index)}>
                  Delete
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Submit */}
        <button type="submit">Save changes</button>
      </form>
    </div>
  )
}

export default EditArticle
