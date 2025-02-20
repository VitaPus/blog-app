import React from 'react'
import { useForm } from 'react-hook-form'
import { useDispatch } from 'react-redux'
import { signUp } from '../../features/article-slice'
import classes from './signUpPage.module.scss'

const SignUpPage = () => {
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
    <div className={classes.formPos}>
      <h3>Create new account</h3>
      <form onSubmit={handleSubmit(onSubmit)} className={classes.formUp}>
        <div className={classes.inputBox}>
          <label>Username</label>
          <input
            {...register('username', {
              required: 'Username is required',
              minLength: { value: 3, message: 'Username must be at least 3 characters' },
              maxLength: { value: 20, message: 'Username must be at most 20 characters' },
            })}
            placeholder="Username"
          />
          {errors.username && <p>{errors.username.message}</p>}
        </div>

        <div className={classes.inputBox}>
          <label>Email address</label>
          <input
            type="email"
            {...register('email', {
              required: 'Email is required',
              pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Invalid email format' },
            })}
            placeholder="Email address"
          />
          {errors.email && <p>{errors.email.message}</p>}
        </div>

        <div className={classes.inputBox}>
          <label>Password</label>
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
        </div>

        <div className={classes.inputBox}>
          <label>Repeat Password</label>
          <input
            type="password"
            {...register('confirmPassword', {
              validate: (value) => value === getValues('password') || 'Passwords do not match',
            })}
            placeholder="Password"
          />
          {errors.confirmPassword && <p>{errors.confirmPassword.message}</p>}
        </div>

        <label>
          <input type="checkbox" {...register('terms', { required: 'You must accept the terms' })} /> I agree to the
          processing of my personal information
        </label>
        {errors.terms && <p>{errors.terms.message}</p>}

        {/* Убираем onClick с кнопки, форма будет отправляться по submit */}
        <button type="submit">Sign Up</button>
      </form>
    </div>
  )
}

export default SignUpPage
