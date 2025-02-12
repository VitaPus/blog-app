import React from 'react'
import classes from './frameitem.module.scss'

const FrameItem = () => {
  return (
    <div className={classes.item}>
      <div className={classes.info}>
        <div className={classes.textInfo}>
          <div>title</div>
          <div>like</div>
        </div>
        <div className={classes.userInfo}>
          <div>name</div>
          <div>avatar</div>
        </div>
      </div>
      <div>
        Lorem Ipsum - это текст-"рыба", часто используемый в печати и вэб-дизайне. Lorem Ipsum является стандартной
        "рыбой" для текстов на латинице с начала XVI века.
      </div>
    </div>
  )
}

export default FrameItem
