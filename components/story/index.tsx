import { useState } from 'react'
import { useRouter } from 'next/router'

import DeleteModal from "../deleteModal"
import AddStoryModal from '../addStoryModal'

import { removeStory } from '@/service/story'
import { isModerator } from '@/utils/isModerator'

import styles from './story.module.scss'

import { IStoryProps } from './story.types'


const Story: React.FC<IStoryProps> = ({ stories, game, selectedStory, handleStorySelect,
    currentPlayerId,
    players }) => {
    const [isAddStoryModalOpen, setIsAddStoryModalOpen] = useState(false)
    const [isDeleteStoryModalOpen, setIsDeleteStoryModalOpen] = useState(false)

    const router = useRouter()
    const leaveGame = () => {
        router.push(`/dashboard`);
    };


    return (<div className={styles["container"]}>
        <div className={styles["title"]}>Story</div>
        <div className={styles["storyList"]}>
            {
                stories?.map((story) => {
                    const isSelected = selectedStory === story
                    return (
                        <div
                            className={isSelected ? styles["storySelected"] : styles["story"]}
                            key={story.id}
                            onClick={() => handleStorySelect(story)}
                        >
                            <div className={styles["storyName"]}>{story.name}</div>
                            <div className={styles["storyAverage"]}>{story.average}</div>
                        </div>
                    )
                })
            }

        </div>
        {
            isModerator(game.createdById, currentPlayerId) ? <>
                <div className={styles["addStory"]} onClick={() => setIsAddStoryModalOpen(!isAddStoryModalOpen)}>
                    + Add Story
                </div>
                <div className={styles["footer"]} onClick={leaveGame}>
                    X End Game
                </div>
            </>
                : null
        }


        {
            isAddStoryModalOpen ? <AddStoryModal
                gameId={game.id}
                handleCloseModal={() => setIsAddStoryModalOpen(false)}
                players={players}
            ></AddStoryModal> : null
        }
        {
            isDeleteStoryModalOpen && selectedStory ?
                <DeleteModal
                    closeModalCallBack={() => setIsDeleteStoryModalOpen(false)}
                    title={`Delete ${selectedStory.name}`}
                    handleDeleteCallback={
                        () => removeStory(game.id, selectedStory.id)
                    }
                /> : null
        }
    </div>)
}

export default Story