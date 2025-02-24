import React from 'react'
import { useForm } from 'react-hook-form'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { signUp } from '../../features/article-slice'
import { Button, message } from 'antd'
import classes from './signUpPage.module.scss'

const SignUpPage = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm()

  const onSubmit = async (data) => {
    try {
      await dispatch(signUp(data)).unwrap()
      message.success('Регистрация прошла успешно! 🎉')
      setTimeout(() => navigate('/sign-in'), 1500)
    } catch (error) {
      message.error(`Ошибка регистрации: ${error.message || 'Попробуйте снова'}`)
    }
  }

  return (
    <div className={classes.formPos}>
      <h3 className={classes.formName}>Create new account</h3>
      <form onSubmit={handleSubmit(onSubmit)} className={classes.formUp}>
        {/* Username */}
        <div className={classes.inputBox}>
          <label>Username</label>
          <input
            className={errors.username ? classes.inputError : ''}
            {...register('username', {
              required: 'Имя пользователя обязательно',
              minLength: { value: 3, message: 'Минимум 3 символа' },
              maxLength: { value: 20, message: 'Максимум 20 символов' },
            })}
            placeholder="Username"
          />
          {errors.username && <p className={classes.errorText}>{errors.username.message}</p>}
        </div>

        {/* Email */}
        <div className={classes.inputBox}>
          <label>Email address</label>
          <input
            type="email"
            className={errors.email ? classes.inputError : ''}
            {...register('email', {
              required: 'Email обязателен',
              pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Некорректный формат email' },
            })}
            placeholder="Email address"
          />
          {errors.email && <p className={classes.errorText}>{errors.email.message}</p>}
        </div>

        {/* Password */}
        <div className={classes.inputBox}>
          <label>Password</label>
          <input
            type="password"
            className={errors.password ? classes.inputError : ''}
            {...register('password', {
              required: 'Пароль обязателен',
              minLength: { value: 6, message: 'Минимум 6 символов' },
              maxLength: { value: 40, message: 'Максимум 40 символов' },
            })}
            placeholder="Password"
          />
          {errors.password && <p className={classes.errorText}>{errors.password.message}</p>}
        </div>

        {/* Confirm Password */}
        <div className={classes.inputBox}>
          <label>Repeat Password</label>
          <input
            type="password"
            className={errors.confirmPassword ? classes.inputError : ''}
            {...register('confirmPassword', {
              validate: (value) => value === getValues('password') || 'Пароли не совпадают',
            })}
            placeholder="Password"
          />
          {errors.confirmPassword && <p className={classes.errorText}>{errors.confirmPassword.message}</p>}
        </div>

        {/* Terms */}
        <label className={classes.formLabel}>
          <input
            type="checkbox"
            className={errors.terms ? classes.checkboxError : classes.formCheck}
            {...register('terms', { required: 'Необходимо согласие' })}
          />{' '}
          I agree to the processing of my personal information
        </label>
        {errors.terms && <p className={classes.errorText}>{errors.terms.message}</p>}

        {/* Button */}
        <div className={classes.boxBtn}>
          <Button type="primary" htmlType="submit" className={classes.sendBtn}>
          Create
          </Button>
          <span className={classes.boxBtnText}>
          Already have an account? <a href="/sign-in">Sign In</a>
          </span>
        </div>
      </form>
    </div>
  )
}

export default SignUpPage
