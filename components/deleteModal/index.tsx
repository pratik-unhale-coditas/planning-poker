import Modal from "../modal"

import style from './deleteModal.module.scss'

import { IDeleteModalProps } from "./deleteModal.types"


const DeleteModal: React.FC<IDeleteModalProps> = ({ closeModalCallBack, title, handleDeleteCallback }) => {
    const handleDelete = () => {
        handleDeleteCallback()
        closeModalCallBack(false)
    }

    const handleCancel = () => {
        closeModalCallBack(false)
    }

    return (
        <Modal onClose={() => closeModalCallBack(false)}>
            <div className={style["modal"]}>
                <div className={style["title"]}>
                    <h2>{title}</h2>
                    <p>Once you delete, its gone for good.</p>
                </div>
                <div className={style['actions']}>
                    <button
                        className={style['deleteButton']}
                        onClick={handleDelete}>
                        Delete
                    </button>
                    <button
                        className={style['cancelButton']}
                        onClick={handleCancel}
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </Modal>
    )
}

export default DeleteModal