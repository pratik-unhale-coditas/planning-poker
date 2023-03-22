import styles from './savedGameCard.module.scss'
import { useRouter } from "next/router"

import { useState } from "react"
import DeleteModal from "../deleteModal"
import { isModerator } from '@/utils/isModerator'
import { getCurrentPlayerId } from '@/service/players'
import { Game } from '@/types/game'

interface ISavedGameCardProps {
    recentGame: Game,
    handleRemoveGame: () => void
}

const SavedGameCard = ({ recentGame, handleRemoveGame }: ISavedGameCardProps) => {
    const router = useRouter()

    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)

    const toggleDeleteModal = (value: boolean) => {
        setIsDeleteModalOpen(value)
    }

    return (
        <div
            onClick={() => router.push(`/game/${recentGame.id}`)}
            className={styles["container"]}
        >
            <div className={styles["title"]}>
                {recentGame.name}
            </div>
            <div className={styles["detail"]}>
                {recentGame.id}
            </div>
            {isModerator(recentGame.createdById, getCurrentPlayerId(recentGame.id)) ?
                <div className={styles["deleteButton"]} onClick={(e) => {
                    e.stopPropagation()
                    setIsDeleteModalOpen(true)
                }}>
                    <img src="./icons/trash.svg" alt="" />
                </div>
                : null
            }
            {
                isDeleteModalOpen ?
                    <DeleteModal
                        closeModalCallBack={toggleDeleteModal}
                        title={`Delete ${recentGame.name}`}
                        handleDeleteCallback={
                            handleRemoveGame
                        }
                    />
                    :
                    null
            }
        </div>)
}

export default SavedGameCard