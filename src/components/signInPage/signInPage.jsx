import React from 'react'
import { useForm } from 'react-hook-form'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { signIn } from '../../features/article-slice'
import classes from './signInPage.module.scss'

const SignInPage = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()

  const onSubmit = async (data) => {
    try {
      await dispatch(signIn(data)).unwrap() // Обработать ошибку, если возникнет
      alert('Sign In successful!')
      navigate("/")
    } catch (error) {
      console.error('Sign-in error:', error)
    }
  }

  return (
    <div className={classes.formPos}>
      <h3>Sign In</h3>
    <form onSubmit={handleSubmit(onSubmit)} className={classes.formIn}>
    <div className={classes.inputBox}>
      <label>Email address</label>
      <input
        type="email"
        {...register('email', {
          required: 'Email is required',
          pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Invalid email format' },
        })}
        placeholder="Email"
      />
      {errors.email && <p>{errors.email.message}</p>}
      </div>
      
      <div className={classes.inputBox}>
      <label>Email address</label>
      <input
        type="password"
        {...register('password', { required: 'Password is required' })}
        placeholder="Password"
      />
      {errors.password && <p>{errors.password.message}</p>}
      </div>

      <button type="submit">
        Login
      </button>
    </form>
    </div>
  )
}

export default SignInPage
