import { useState } from "react"
import Modal from "../modal"
import styles from './addStoryModal.module.scss'

const AddStoryModal = ({ handleCloseModal }: any) => {

    const [storyName, setStoryName] = useState<string>("")

    const handleSubmit = () => {
        handleCloseModal()
    }

    return (<Modal onClose={handleCloseModal}>
        <div className={styles["container"]}>
            <div className={styles["header"]}>
                <div className={styles["title"]}>Add new story</div>
                <div className={styles["close"]} onClick={handleCloseModal}>X</div>
            </div>
            <div className={styles["inputContainer"]}>
                <label className={styles["label"]}>Name</label>
                <input name="firstName" className={styles["input"]} type={"text"} onChange={(e) => setStoryName(e.target.value)} />
            </div>
            <div className={styles["addStoryButtonContainer"]}>
                <button
                    className={storyName ? styles["addStoryButtonActive"] : styles["addStoryButton"]}
                    onClick={handleSubmit}
                >Add Story</button>
            </div>
        </div>
    </Modal>)
}

export default AddStoryModal