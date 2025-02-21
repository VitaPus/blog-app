import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import { updateUser } from '../../features/article-slice'

const ProfilePage = () => {
  const dispatch = useDispatch()
  const user = useSelector((state) => state.articles?.user)
  console.log('User from store:', user)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm()

  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (user) {
      reset({
        username: user.username || '',
        email: user.email || '',
        image: user.image || '',
      })
    }
  }, [user, reset])

  const onSubmit = async (data) => {
    setIsSubmitting(true)
    try {
      await dispatch(updateUser(data)).unwrap()
      alert('Profile updated successfully!')
    } catch (error) {
      alert(`Failed to update profile: ${error}`)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!user) {
    return <p>Loading...</p>
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('username', { required: 'Username is required' })} placeholder="Username" />
      {errors.username && <p style={{ color: 'red' }}>{errors.username.message}</p>}

      <input type="email" {...register('email', { required: 'Email is required' })} placeholder="Email" />
      {errors.email && <p style={{ color: 'red' }}>{errors.email.message}</p>}

      <input
        type="password"
        {...register('password', {
          required: 'Password is required',
          minLength: { value: 6, message: 'Password must be at least 6 characters' },
          maxLength: { value: 40, message: 'Password must be less than 40 characters' },
        })}
        placeholder="New Password"
      />
      {errors.password && <p style={{ color: 'red' }}>{errors.password.message}</p>}

      <input
        {...register('image', {
          pattern: {
            value: /^(https?:\/\/.*\.(?:png|jpg|jpeg|gif|svg))$/i,
            message: 'Invalid image URL',
          },
        })}
        placeholder="Avatar URL"
      />
      {errors.image && <p style={{ color: 'red' }}>{errors.image.message}</p>}

      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Updating...' : 'Update Profile'}
      </button>
    </form>
  )
}

export default ProfilePage
