import { useRouter } from 'next/router'
import { useState } from 'react'
import AddStoryModal from '../addStoryModal'
import Modal from '../modal'
import styles from './addStory.module.scss'
const AddStory = () => {
    const [isAddStoryModalOpen, setIsAddStoryModalOpen] = useState(false)
    const router = useRouter()
    const leaveGame = () => {
        router.push(`/dashboard`);
    };
    return (<div className={styles["container"]}>
        <div className={styles["title"]}>Story</div>
        <div className={styles["storyList"]}>
            <div className={styles["story"]}>
                <div className={styles["storyName"]}>A</div>
                <div className={styles["deleteIcon"]}>   <img src="./icons/trash.svg" alt="" /></div>
            </div>
        </div>
        <div className={styles["addStory"]} onClick={() => setIsAddStoryModalOpen(!isAddStoryModalOpen)}>
            + Add Story
        </div>
        <div className={styles["footer"]} onClick={leaveGame}>
            X End Game
        </div>
        {
            isAddStoryModalOpen ? <AddStoryModal handleCloseModal={() => setIsAddStoryModalOpen(false)}></AddStoryModal> : null
        }
    </div>)
}

export default AddStory