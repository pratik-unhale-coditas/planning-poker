import React, { useState, useRef, useEffect } from "react";

import style from './customSelect.module.scss'

interface Option {
    label: string;
    value: string;
}

interface SelectProps {
    options: Option[];
    defaultValue?: string;
    onChange: (value: string) => void;
}

const CustomSelect: React.FC<SelectProps> = ({ options, defaultValue, onChange }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [value, setValue] = useState(defaultValue || options[0]?.value)
    const containerReference = useRef<any>(null)

    const toggleSelect = () => setIsOpen((prev) => !prev);

    const handleOptionClick = (optionValue: string) => {
        if (onChange) {
            onChange(optionValue);
        }

        setValue(optionValue)
        toggleSelect();
    };
    const handleOutsideCLick = (e: any) => {
        e.stopPropagation()
        if (!containerReference.current.contains(e.target)) {
            toggleSelect()
        }
    }
    useEffect(() => {
        if (isOpen) {
            document.addEventListener("click", handleOutsideCLick);
            return () => document.removeEventListener("click", handleOutsideCLick);
        }
        else {
            document.removeEventListener("click", handleOutsideCLick);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isOpen])

    return (
        <div className={style["container"]}
            ref={containerReference}
        >
            <div className={style["header"]} onClick={toggleSelect}>
                <div className={style["headerTitle"]}>{options.find((option) => option.value === value)?.label}</div>
                <div className={style["headerIcon"]}>{
                    isOpen ?
                        <img src="./icons/chevronUp.png" alt="" />

                        :
                        <img src="./icons/chevronDown.png" alt="" />

                }</div>
            </div>
            {isOpen && (
                <ul className={style["options"]}>
                    {options.map((option) =>

                    (

                        <li
                            key={option.value}
                            onClick={() => handleOptionClick(option.value)}
                        >
                            {option.label}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default CustomSelect;
