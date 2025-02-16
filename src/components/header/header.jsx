import React from "react";
import { Button } from "antd";
import { useNavigate } from "react-router-dom";
import classes from './header.module.scss'

const Header = () => {
  const navigate = useNavigate(); // Получаем функцию навигации

  // Обработчик для кнопки "Sign In"
  const handleSignInClick = () => {
    navigate("/sign-in");
  };

  // Обработчик для кнопки "Sign Up"
  const handleSignUpClick = () => {
    navigate("/sign-up");
  };

  // Обработчик для перехода на главную страницу
  const handleTitleClick = () => {
    navigate("/"); // Переход на главную страницу
  };

  return (
    <div className={classes.headbar}>
      {/* Добавлен обработчик клика на заголовок */}
      <h6 className={classes.title} onClick={handleTitleClick}>
        Realworld Blog
      </h6>
      <div className={classes.headButtons}>
        <Button type="text" className={classes.buttonIn} onClick={handleSignInClick}>
          Sign In
        </Button>
        <Button className={classes.buttonUp} onClick={handleSignUpClick}>
          Sign Up
        </Button> 
      </div>
    </div>
  );
};

export default Header;
