import React from 'react'
import classes from './create-article.module.scss'
import { useDispatch } from 'react-redux'
import { useForm } from 'react-hook-form'
import { sendArticle } from '../../features/article-slice'

const CreateArticle = () => {
  const dispatch = useDispatch()
  const {
    register,
    handleSubmit,
  } = useForm()

  const onSubmit = async (data) => {
    try {
      await dispatch(sendArticle(data)).unwrap()
    } catch (error) {
      console.log('Send error:', error)
    }
  }
  return (
    <div className={classes.formPos}>
      <h3>Create new article</h3>
      <form onSubmit={handleSubmit(onSubmit)} className={classes.formIn}>
        <div className={classes.inputBox}>
          <label>Title</label>
          <input
            type="title"
            {...register('title', {
              required: 'title is required',
            })}
            placeholder="Title"
          />
        </div>

        <div className={classes.inputBox}>
          <label>Short description</label>
          <input
            type="description"
            {...register('description', { required: 'description is required' })}
            placeholder="description"
          />
        </div>

        <button type="submit">Send</button>
      </form>
    </div>
  )
}
export default CreateArticle
