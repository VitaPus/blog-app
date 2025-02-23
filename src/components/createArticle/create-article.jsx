import React, { useState } from 'react'
import classes from './create-article.module.scss'
import { useDispatch } from 'react-redux'
import { useForm } from 'react-hook-form'
import { sendArticle } from '../../features/article-slice'
import { useNavigate } from 'react-router-dom'

const CreateArticle = () => {
  const dispatch = useDispatch()
  const { register, handleSubmit} = useForm()
  const navigate = useNavigate()
  const [tags, setTags] = useState([])
  const [tagInput, setTagInput] = useState('')  // ✅ локальное состояние для ввода тега

  // ✅ Добавление тега
  const addTag = (e) => {
    e.preventDefault()
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()])
      setTagInput('')  // Очищаем поле после добавления
    }
  }

  // ✅ Удаление тега
  const removeTag = (index) => {
    setTags(tags.filter((_, i) => i !== index))
  }

  // ✅ Отправка статьи
  const onSubmit = async (data) => {
    const articleData = {
      ...data,
      tagList: tags,
    }
    try {
      await dispatch(sendArticle(articleData)).unwrap()
      navigate('/')
      window.location.reload()
    } catch (error) {
      console.log('Send error:', error)
    }
  }

  return (
    <div className={classes.formPos}>
      <h3>Create new article</h3>
      <form onSubmit={handleSubmit(onSubmit)} className={classes.formIn}>
        {/* Title */}
        <div className={classes.inputBox}>
          <label>Title</label>
          <input
            type="text"  // ✅ Исправлено
            {...register('title', { required: 'title is required' })}
            placeholder="Title"
          />
        </div>

        {/* Short description */}
        <div className={classes.inputBox}>
          <label>Short description</label>
          <input
            type="text"  // ✅ Исправлено
            {...register('description', { required: 'description is required' })}
            placeholder="Description"
          />
        </div>

        {/* Text */}
        <div className={classes.inputBox}>
          <label>Text</label>
          <textarea
            {...register('text', { required: 'text is required' })}
            placeholder="Text"
          />
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

          {/* ✅ Список добавленных тегов */}
          <ul className={classes.tagList}>
            {tags.map((tag, index) => (
              <li key={index} className={classes.tagItem}>
                {tag}
                <button onClick={() => removeTag(index)}>Delete</button>
              </li>
            ))}
          </ul>
        </div>

        {/* Submit */}
        <button type="submit">Send</button>
      </form>
    </div>
  )
}

export default CreateArticle
