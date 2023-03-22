import { useEffect, useState } from 'react';

import styles from './card.module.scss'

import { ICardProps } from './card.types';


const Card = ({ card, handleCardSelect, isSelected }: ICardProps) => {


    const [selected, setSelected] = useState<boolean | null>(null)

    const { value, displayValue, color } = card

    useEffect(() => {
        setSelected(isSelected)
    }, [isSelected])

    return (
        <div
            className={[styles["container"], selected ? styles["selected"] : null].join(" ")}
            style={{ backgroundColor: color }}
            onClick={() => handleCardSelect(value)}
        >
            <div className={styles["top"]}>{displayValue}</div>
            <div className={styles["main"]}>{displayValue}</div>
            <div className={styles["bottom"]}>{displayValue}</div>
        </div>

    )
}

export default Card




