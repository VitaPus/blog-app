import React from "react";
import { Button } from "antd";
import classes from './header.module.scss'

const Header = () => {
    return (
        <div className={classes.headbar}>
        <h6 className={classes.title}>Realworld Blog</h6>
        <div className={classes.headButtons}>
         <Button type="text" className={classes.buttonIn}>Sign In</Button>
         <Button className={classes.buttonUp}>Sign Up</Button> 
        </div>
        </div>
    )
}

export default Header