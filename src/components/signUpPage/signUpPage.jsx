import React from 'react'
import { useForm } from 'react-hook-form'
import { useDispatch } from 'react-redux'
import { signUp } from '../../features/article-slice'

const SignUpPage = ({ onClick }) => {
  const dispatch = useDispatch()
  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm()

  const onSubmit = async (data) => {
    try {
      await dispatch(signUp(data)).unwrap()
      alert('Registration successful!')
    } catch (error) {
      console.error('Sign-up error:', error)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input
        {...register('username', {
          required: 'Username is required',
          minLength: { value: 3, message: 'Username must be at least 3 characters' },
          maxLength: { value: 20, message: 'Username must be at most 20 characters' },
        })}
        placeholder="Username"
      />
      {errors.username && <p>{errors.username.message}</p>}

      <input
        type="email"
        {...register('email', {
          required: 'Email is required',
          pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Invalid email format' },
        })}
        placeholder="Email"
      />
      {errors.email && <p>{errors.email.message}</p>}

      <input
        type="password"
        {...register('password', {
          required: 'Password is required',
          minLength: { value: 6, message: 'Password must be at least 6 characters' },
          maxLength: { value: 40, message: 'Password must be at most 40 characters' },
        })}
        placeholder="Password"
      />
      {errors.password && <p>{errors.password.message}</p>}

      <input
        type="password"
        {...register('confirmPassword', {
          validate: (value) => value === getValues('password') || 'Passwords do not match',
        })}
        placeholder="Confirm Password"
      />
      {errors.confirmPassword && <p>{errors.confirmPassword.message}</p>}

      <label>
        <input type="checkbox" {...register('terms', { required: 'You must accept the terms' })} /> I agree to the terms
      </label>
      {errors.terms && <p>{errors.terms.message}</p>}

      {/* Убираем onClick с кнопки, форма будет отправляться по submit */}
      <button type="submit">
        Sign Up
      </button>
    </form>
  )
}

export default SignUpPage
