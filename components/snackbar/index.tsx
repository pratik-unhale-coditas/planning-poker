import React, { useState, useEffect } from 'react';
import styles from './snackbar.module.scss'

const Snackbar = ({ message, showSnackbar, hideSnackbar }: any) => {
    const [show, setShow] = useState(false);

    useEffect(() => {
        if (showSnackbar) {
            setShow(true);
            setTimeout(() => {
                setShow(false);
                hideSnackbar();
            }, 2000);
        }
    }, [showSnackbar, hideSnackbar]);
    console.log(show)
    return (
        <div className={show ? styles["snackbar"] : styles["snackbarHidden"]}>
            <div className={styles["message"]}>{message}</div>
        </div>
    );
};

export default Snackbar;
