import React, { useEffect, useState } from 'react'
import classes from './edit-article.module.scss'
import { useSelector } from 'react-redux'
import { useForm } from 'react-hook-form'
import { useNavigate, useParams } from 'react-router-dom'
import { message, Button, Spin } from 'antd'

const EditArticle = () => {
  const { slug } = useParams()
  const { token } = useSelector((state) => state.articles || {})
  const { register, handleSubmit, setValue, formState: { errors } } = useForm()
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

  const clearTagInput = () => {
    setTagInput('')
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
      <h3 className={classes.formName}>Edit article</h3>
      <form onSubmit={handleSubmit(onSubmit)} className={classes.formIn}>
        {/* Title */}
        <div className={classes.inputBox}>
          <label>Title</label>
          <input
            type="text"
            {...register('title', { required: 'Title is required' })}
            placeholder="Title"
            className={errors.title ? classes.inputError : ''}
          />
          {errors.title && <span className={classes.errorMsg}>{errors.title.message}</span>}
        </div>

        {/* Short description */}
        <div className={classes.inputBox}>
          <label>Short description</label>
          <input
            type="text"
            {...register('description', { required: 'Description is required' })}
            placeholder="Description"
            className={errors.description ? classes.inputError : ''}
          />
          {errors.description && <span className={classes.errorMsg}>{errors.description.message}</span>}
        </div>

        {/* Main text */}
        <div className={classes.inputBoxBody}>
          <label>Text</label>
          <textarea
            {...register('body', { required: 'Text is required' })}
            placeholder="Text"
            className={errors.body ? classes.inputError : classes.textareaBox}
          />
          {errors.body && <span className={classes.errorMsg}>{errors.body.message}</span>}
        </div>

        {/* Tags */}
        <div className={classes.inputTag}>
          <label>Tags</label>

          {/* List of added tags */}
          <div className={classes.tagList}>
            {tags.map((tag, index) => (
              <div key={index} className={classes.tagInputWrapper}>
                <input className={classes.tagItem} value={tag} readOnly />
                <Button type="button" onClick={() => removeTag(index)} className={classes.deleteBtn}>Delete</Button>
              </div>
            ))}
          </div>

          {/* Input field for adding new tags */}
          <div className={classes.tagInputWrapper}>
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              placeholder="Tag"
            />
             <Button type="button" onClick={clearTagInput} className={classes.deleteBtn}>Delete</Button>
            <Button type="button" onClick={addTag} className={classes.addBtn}>Add tag</Button>
          </div>

          {/* Submit button */}
          <Button type="primary" htmlType="submit" className={classes.sendBtn}>Send</Button>
        </div>
      </form>
    </div>
  )
}

export default EditArticle
