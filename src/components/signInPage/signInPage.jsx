import React from 'react'
import { useForm } from 'react-hook-form'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { signIn } from '../../features/article-slice'
import classes from './signInPage.module.scss'
import { Button, message } from 'antd'

const SignInPage = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm()

  const onSubmit = async (data) => {
    try {
      await dispatch(signIn(data)).unwrap()
      message.success('Sign In successful! 🎉')
      navigate('/')
    } catch (error) {
      console.log('Server Error:', error) // 👈 Посмотри что приходит от сервера

      if (error?.message === 'Incorrect password') {
        message.error('Incorrect password ❌')
        setError('password', { type: 'manual', message: 'Incorrect password' })
      } else if (error?.message === 'User not found') {
        message.error('User not found ⚠️')
        setError('email', { type: 'manual', message: 'User not found' })
      } else {
        message.error('Login error. Try again. 🚨')
      }
    }
  }

  return (
    <div className={classes.formPos}>
      <h3 className={classes.formName}>Sign In</h3>

      <form onSubmit={handleSubmit(onSubmit)} className={classes.formIn}>
        {/* Email Field */}
        <div className={classes.inputBox}>
          <label>Email address</label>
          <input
            type="email"
            className={errors.email ? classes.inputError : ''}
            {...register('email', {
              required: 'Email is required',
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: 'Invalid email format',
              },
            })}
            placeholder="Email"
          />
          {errors.email && <p className={classes.errorText}>{errors.email.message}</p>}
        </div>

        {/* Password Field */}
        <div className={classes.inputBox}>
          <label>Password</label>
          <input
            type="password"
            className={errors.password ? classes.inputError : ''}
            {...register('password', { required: 'Password is required' })}
            placeholder="Password"
          />
          {errors.password && <p className={classes.errorText}>{errors.password.message}</p>}
        </div>

        {/* Submit Button */}
        <div className={classes.boxBtn}>
          <Button type="primary" htmlType="submit" className={classes.sendBtn}>
            Login
          </Button>
          <span className={classes.boxBtnText}>
            Don't have an account? <a href="/sign-up">Sign Up</a>
          </span>
        </div>
      </form>
    </div>
  )
}

export default SignInPage
