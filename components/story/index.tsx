import { removeStory } from '@/service/story'
import { IStory } from '@/types/story'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import AddStoryModal from '../addStoryModal'
import styles from './story.module.scss'
import DeleteModal from "../deleteModal"
import { Game } from '@/types/game'
import { isModerator } from '@/utils/isModerator'
import { Player } from '@/types/player'

interface IStoryProps {
    stories: IStory[] | undefined,
    game: Game,
    selectedStory: IStory | undefined,
    handleStorySelect: any,
    currentPlayerId: string,
    players: Player[]
}

const Story = ({ stories, game, selectedStory, handleStorySelect,
    currentPlayerId,
    players }: IStoryProps) => {
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
                            {/* <div
                                className={styles["deleteStory"]}
                                onClick={() => setIsDeleteStoryModalOpen(!isDeleteStoryModalOpen)}
                            >
                                <img src="./icons/trash.svg" />
                            </div> */}
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
                // currentPlayerId={currentPlayerId}
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