import { useState } from "react"
import Image from "next/image"

import Modal from "../modal"

import { addStoryToGame } from "@/service/story"

import styles from './addStoryModal.module.scss'

import { IAddStoryModal } from "./addStoryModa.types"


const AddStoryModal: React.FC<IAddStoryModal> = ({ handleCloseModal, gameId, players }) => {

    const [storyName, setStoryName] = useState<string>("")

    const handleSubmit = async () => {
        await addStoryToGame(gameId, storyName, players)
        handleCloseModal()
    }

    return (<Modal onClose={handleCloseModal}>

        <div className={styles["container"]}>
            <div className={styles["header"]}>
                <div className={styles["title"]}>Add new story</div>
                <div className={styles["close"]} onClick={handleCloseModal}>
                    <Image width={24} height={24} src="/icons/x.svg" alt="" />
                </div>
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