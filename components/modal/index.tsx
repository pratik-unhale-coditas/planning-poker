import style from './modal.module.scss'

import { IModalProps } from './modal.types';

const Modal: React.FC<IModalProps> = ({ children, onClose }) => {
    return (
        <div
            className={style['modal']}
            onClick={onClose}
        >
            <div
                className={style['modal_content']}
                onClick={(event) => event.stopPropagation()}
            >
                {children}
            </div>
        </div>
    );
}

export default Modal;
