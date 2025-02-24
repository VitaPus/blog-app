import React, { useState } from 'react'
import classes from './create-article.module.scss'
import { useDispatch } from 'react-redux'
import { useForm } from 'react-hook-form'
import { sendArticle } from '../../features/article-slice'
import { useNavigate } from 'react-router-dom'
import { Button, message } from 'antd'

const CreateArticle = () => {
  const dispatch = useDispatch()
  const { register, handleSubmit} = useForm()
  const navigate = useNavigate()
  const [tags, setTags] = useState([])
  const [tagInput, setTagInput] = useState('')

  // ✅ Добавление тега
  const addTag = (e) => {
    e.preventDefault()
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()])
      setTagInput('')
    }
  }

  // ✅ Удаление тега из списка
  const removeTag = (index) => {
    setTags(tags.filter((_, i) => i !== index))
  }

  // ✅ Очистка инпута тега
  const clearTagInput = () => {
    setTagInput('')
  }

  // ✅ Отправка статьи
  const onSubmit = async (data) => {
    const articleData = {
      ...data,
      tagList: tags,
    }
    try {
      await dispatch(sendArticle(articleData)).unwrap()
      message.success('Article created successfully!')
      navigate('/')
      window.location.reload()
    } catch (error) {
      console.log('Send error:', error)
      message.error('Failed to create article.')
    }
  }

  return (
    <div className={classes.formPos}>
      <h3 className={classes.formName}>Create new article</h3>
      <form onSubmit={handleSubmit(onSubmit)} className={classes.formIn}>
        {/* Title */}
        <div className={classes.inputBox}>
          <label>Title</label>
          <input
            type="text"
            {...register('title', { required: 'Title is required' })}
            placeholder="Title"
          />
        </div>

        {/* Short description */}
        <div className={classes.inputBox}>
          <label>Short description</label>
          <input
            type="text"
            {...register('description', { required: 'Description is required' })}
            placeholder="Description"
          />
        </div>

        {/* Text */}
        <div className={classes.inputBoxBody}>
          <label>Text</label>
          <textarea
            {...register('body', { required: 'Text is required' })}
            placeholder="Text"
            className={classes.textareaBox}
          />
        </div>

        {/* Tags */}
        <div className={classes.inputTag}>
          <label>Tags</label>

          {/* ✅ Список добавленных тегов */}
          <div className={classes.tagList}>
            {tags.map((tag, index) => (
              <div key={index} className={classes.tagInputWrapper}>
                <input className={classes.tagItem} value={tag} readOnly />
                <Button type="button" onClick={() => removeTag(index)} className={classes.deleteBtn}>Delete</Button>
              </div>
            ))}
          </div>

          {/* ✅ Поле ввода нового тега */}
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

          {/* ✅ Кнопка отправки */}
          <Button type="primary" htmlType="submit" className={classes.sendBtn}>Send</Button>
        </div>
      </form>
    </div>
  )
}

export default CreateArticle
