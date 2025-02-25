import React, { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { enGB } from 'date-fns/locale';
import { Tag } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { likeArticle, unlikeArticle } from '../../features/like-slice';
import classes from './frameitem.module.scss';

const FrameItem = ({ article, onClick }) => {
  const dispatch = useDispatch();

  // Получаем лайки из Redux
  const likes = useSelector((state) => state.likes.likes);
  const { token } = useSelector((state) => state.articles || {}); // Получаем токен из стейта

  const [isLiked, setIsLiked] = useState(likes[article.slug]?.favorited || false);
  const [favoritesCount, setFavoritesCount] = useState(likes[article.slug]?.favoritesCount || article.favoritesCount);

  // Форматируем дату
  const formattedDate = format(new Date(article.createdAt), 'MMM d, yyyy', { locale: enGB });

  useEffect(() => {
    // Обновляем статус лайка при изменении данных
    setIsLiked(likes[article.slug]?.favorited || false);
    setFavoritesCount(likes[article.slug]?.favoritesCount || article.favoritesCount);
  }, [likes, article.slug, article.favoritesCount]); // Добавляем article.favoritesCount
  
  // Обработчик клика на лайк
  const handleLikeClick = (event) => {
    event.stopPropagation();

    // Если пользователь не залогинен, просто показываем сообщение
    if (!token) {
      return;
    }

    // Логика для изменения лайка
    const updatedLikes = { ...likes };
    if (isLiked) {
      updatedLikes[article.slug] = { favorited: false, favoritesCount: favoritesCount - 1 };
      dispatch(unlikeArticle(article.slug)); // Убираем лайк
    } else {
      updatedLikes[article.slug] = { favorited: true, favoritesCount: favoritesCount + 1 };
      dispatch(likeArticle(article.slug)); // Ставим лайк
    }

    // Обновляем локальный стейт и записываем в Redux
    setIsLiked(!isLiked);
    setFavoritesCount(isLiked ? favoritesCount - 1 : favoritesCount + 1);
  };

  return (
    <div className={classes.item} onClick={() => onClick(article.slug)}>
      <div className={classes.info}>
        <div className={classes.textInfo}>
          <div>
            <h5 className={classes.itemTitle}>{article.title}</h5>
            <div className={classes.tags}>
              {article.tagList.length > 0 ? (
                article.tagList.map((tag, index) => (
                  <Tag key={index} className={classes.tag}>
                    #{tag}
                  </Tag>
                ))
              ) : (
                <Tag className={classes.tag}>Без тегов</Tag>
              )}
            </div>
          </div>
          <div className={classes.likeBox}>
            <img
              src={isLiked && token ? '/favoriteActive-icon.svg' : '/favorite-icon.svg'}
              alt="likes"
              onClick={handleLikeClick}
            />
            {favoritesCount}
          </div>
        </div>
        <div className={classes.userInfo}>
          <div className={classes.nameInfo}>
            <div>{article.author.username}</div>
            <div className={classes.date}>{formattedDate}</div>
          </div>
          <img src={article.author.image} alt="avatar" className={classes.avaImg} />
        </div>
      </div>
      <div className={classes.itemDescription}>{article.description}</div>
    </div>
  );
};

export default FrameItem;
