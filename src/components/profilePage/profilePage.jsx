import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import { updateUser } from '../../features/article-slice'

const ProfilePage = () => {
  const dispatch = useDispatch()
  const user = useSelector((state) => state.user?.user) // безопасный доступ

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm()

  // Обновляем форму, когда данные пользователя загружены
  useEffect(() => {
    if (user) {
      reset({
        username: user.username || '',
        email: user.email || '',
        image: user.image || '',
      })
    }
  }, [user, reset])

  const onSubmit = (data) => {
    dispatch(updateUser(data))
  }

  // Если данные пользователя еще загружаются
  if (!user) {
    return <p>Loading...</p>
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input
        {...register('username', { required: true })}
        placeholder="Username"
      />
      {errors.username && <p style={{ color: 'red' }}>Username is required</p>}

      <input
        type="email"
        {...register('email', { required: true })}
        placeholder="Email"
      />
      {errors.email && <p style={{ color: 'red' }}>Email is required</p>}

      <input
        type="password"
        {...register('password', { minLength: 6, maxLength: 40 })}
        placeholder="New Password"
      />
      {errors.password && (
        <p style={{ color: 'red' }}>Password must be 6-40 characters</p>
      )}

      <input
        {...register('image', {
          pattern: /^(http(s?):)([/|.|\w|\s|-])*\.(?:jpg|jpeg|png)$/i,
        })}
        placeholder="Avatar URL"
      />
      {errors.image && (
        <p style={{ color: 'red' }}>Invalid URL. It should be a valid image link</p>
      )}

      <button type="submit">Update Profile</button>
    </form>
  )
}

export default ProfilePage
