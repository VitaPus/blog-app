import React from "react";
import { Button } from "antd";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logOut } from "../../features/article-slice";
import classes from './header.module.scss';

const Header = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Получаем данные о пользователе из состояния Redux
  const { user, token } = useSelector((state) => state.articles || {});

  // Обработчик для кнопки "Sign In"
  const handleSignInClick = () => {
    navigate("/sign-in");
  };

  // Обработчик для кнопки "Sign Up"
  const handleSignUpClick = () => {
    navigate("/sign-up");
  };

  // Обработчик для кнопки "Log Out"
  const handleLogOutClick = () => {
    dispatch(logOut()); // Вызов action для выхода
    navigate("/"); // Перенаправление на главную страницу
  };

  // Обработчик для перехода на главную страницу
  const handleTitleClick = () => {
    navigate("/");
  };

  const handleProfileClick = () => {
    navigate("/profile")
  }

  return (
    <div className={classes.headbar}>
      <h6 className={classes.title} onClick={handleTitleClick}>
        Realworld Blog
      </h6>
      <div className={classes.headButtons}>
        {token ? (
          // Если пользователь авторизован
          <>
            <button>create</button>
            <span className={classes.username} onClick={handleProfileClick}>{user?.username}</span>
            <img src={user?.image} alt="avatar" className={classes.avaImg} onClick={handleProfileClick} />
            <Button className={classes.buttonUp} onClick={handleLogOutClick}>
              Log Out
            </Button>
          </>
        ) : (
          // Если пользователь не авторизован
          <>
            <Button type="text" className={classes.buttonIn} onClick={handleSignInClick}>
              Sign In
            </Button>
            <Button className={classes.buttonUp} onClick={handleSignUpClick}>
              Sign Up
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

export default Header;
