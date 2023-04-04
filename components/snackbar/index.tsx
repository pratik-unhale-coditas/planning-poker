import React, { useState, useEffect } from 'react';

import styles from './snackbar.module.scss'

import { ISnackbarProps } from './snackbar.types';

const Snackbar: React.FC<ISnackbarProps> = ({ message, showSnackbar, hideSnackbar }) => {
    const [show, setShow] = useState(false);

    useEffect(() => {
        if (showSnackbar) {
            setShow(true);
            setTimeout(() => {
                setShow(false);
                hideSnackbar();
            }, 3000);
        }
    }, [showSnackbar, hideSnackbar]);
    return (
        <div className={show ? styles["snackbar"] : styles["snackbarHidden"]}>
            <div className={styles["message"]}>{message}</div>
        </div>
    );
};

export default Snackbar;
