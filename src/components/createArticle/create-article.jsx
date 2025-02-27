import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate, useParams } from 'react-router-dom'
import {  useSelector } from 'react-redux'
import { Button, message, Spin } from 'antd'
import classes from './create-article.module.scss'

const ArticleForm = ({ isEditing }) => {
  const navigate = useNavigate()
  const { slug } = useParams()
  const { token } = useSelector((state) => state.articles || {})
  const { register, handleSubmit, setValue, formState: { errors } } = useForm()

  const [loading, setLoading] = useState(isEditing)
  const [tags, setTags] = useState([])
  const [tagInput, setTagInput] = useState('')

  useEffect(() => {
    if (isEditing) {
      fetch(`https://blog-platform.kata.academy/api/articles/${slug}`)
        .then((res) => res.json())
        .then((data) => {
          const article = data.article
          setValue('title', article.title)
          setValue('description', article.description)
          setValue('body', article.body)
          setTags(article.tagList || [])
          setLoading(false)
        })
        .catch(() => {
          message.error('Failed to load article')
          setLoading(false)
        })
    }
  }, [isEditing, slug, setValue])

  const addTag = (e) => {
    e.preventDefault()
    if (tagInput.trim()) {
      setTags([...tags, tagInput.trim()])
      setTagInput('')
    }
  }

  const removeTag = (index) => setTags(tags.filter((_, i) => i !== index))
  const clearTagInput = () => setTagInput('')

  const onSubmit = async (data) => {
    const articleData = { ...data, tagList: tags }
    try {
      const url = `https://blog-platform.kata.academy/api/articles${isEditing ? `/${slug}` : ''}`
      const method = isEditing ? 'PUT' : 'POST'
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json', Authorization: `Token ${token}` },
        body: JSON.stringify({ article: articleData })
      })
      if (!response.ok) throw new Error('Failed to save article')
      message.success(`Article ${isEditing ? 'updated' : 'created'} successfully`)
      navigate(isEditing ? `/articles/${slug}` : '/')
      window.location.reload()
    } catch (error) {
      message.error(error.message)
    }
  }

  if (loading) return <Spin size="large" className={classes.loader} />

  return (
    <div className={classes.formPos}>
      <h3 className={classes.formName}>{isEditing ? 'Edit Article' : 'Create New Article'}</h3>
      <form onSubmit={handleSubmit(onSubmit)} className={classes.formIn}>
        <div className={classes.inputBox}>
          <label>Title</label>
          <input type="text" {...register('title', { required: 'Title is required' })} />
          {errors.title && <span className={classes.errorMsg}>{errors.title.message}</span>}
        </div>
        
        <div className={classes.inputBox}>
          <label>Short description</label>
          <input type="text" {...register('description', { required: 'Description is required' })} />
          {errors.description && <span className={classes.errorMsg}>{errors.description.message}</span>}
        </div>
        
        <div className={classes.inputBoxBody}>
          <label>Text</label>
          <textarea {...register('body', { required: 'Text is required' })} className={classes.textareaBox} />
          {errors.body && <span className={classes.errorMsg}>{errors.body.message}</span>}
        </div>
        
        <div className={classes.inputTag}>
          <label>Tags</label>
          <div className={classes.tagList}>
            {tags.map((tag, index) => (
              <div key={index} className={classes.tagInputWrapper}>
                <input className={classes.tagItem} value={tag} readOnly />
                <Button type="button" onClick={() => removeTag(index)} className={classes.deleteBtn}>Delete</Button>
              </div>
            ))}
          </div>
          <div className={classes.tagInputWrapper}>
            <input type="text" value={tagInput} onChange={(e) => setTagInput(e.target.value)} />
            <Button type="button" onClick={clearTagInput} className={classes.deleteBtn}>Clear</Button>
            <Button type="button" onClick={addTag} className={classes.addBtn}>Add tag</Button>
          </div>
          <Button type="primary" htmlType="submit" className={classes.sendBtn}>{isEditing ? 'Send' : 'Create'}</Button>
        </div>
      </form>
    </div>
  )
}

export default ArticleForm
