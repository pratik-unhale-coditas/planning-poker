import { getStoriesFromStore } from '@/repository/firebase'
import { IStory } from '@/types/story'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import AddStoryModal from '../addStoryModal'
import styles from './story.module.scss'

interface IStoryProps {
    stories: IStory[] | undefined,
    gameId: string,
    selectedStory: IStory | undefined,
    handleStorySelect: any
}

const Story = ({ stories, gameId, selectedStory, handleStorySelect }: IStoryProps) => {
    const [isAddStoryModalOpen, setIsAddStoryModalOpen] = useState(false)
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
        <div className={styles["addStory"]} onClick={() => setIsAddStoryModalOpen(!isAddStoryModalOpen)}>
            + Add Story
        </div>
        <div className={styles["footer"]} onClick={leaveGame}>
            X End Game
        </div>
        {
            isAddStoryModalOpen ? <AddStoryModal gameId={gameId} handleCloseModal={() => setIsAddStoryModalOpen(false)}></AddStoryModal> : null
        }
    </div>)
}

export default Story