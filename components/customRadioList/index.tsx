import styles from "./customRadioList.module.scss"

import { CheckboxProps } from "./customRadioList.types";



const CustomRadioList: React.FC<CheckboxProps> = ({ options, selectedOption, onChange, title }) => {
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        onChange(event.target.value);
    };

    return (
        <div>
            <label className={styles.title}>{title}</label>
            {options.map((option) => (
                <div className={styles.radioButton} key={option.value}>
                    <input type="radio" value={option.value} checked={option.value === selectedOption} onChange={handleChange} />
                    <label>
                        {option.label}
                    </label>
                </div>
            ))}
        </div>
    );
};

export default CustomRadioList