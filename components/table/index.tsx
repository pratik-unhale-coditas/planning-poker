import { getPlayersFromStore } from '@/repository/firebase';
import { finishGame, removeGame, resetGame } from '@/service/games';
import { Game } from '@/types/game';
import { Player } from '@/types/player';
import { isModerator } from '@/utils/isModerator';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react'
import DeleteModal from '../deleteModal';
import Snackbar from '../snackbar';
import styles from './table.module.scss'

interface ITableProps {
    game: Game;
    currentPlayerId: string;
    players: Player[]
}

const Table: React.FC<ITableProps> = ({ game, currentPlayerId, players }) => {

    const router = useRouter()

    const { gid } = router.query
    const { protocol, host } = location;
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
    const [showSnackbar, setShowSnackbar] = useState(false)

    const completeUrl = `${protocol}//${host}/join/${gid}`;

    const copyInviteLink = async () => {
        try {
            await navigator.clipboard.writeText(completeUrl);
            setShowSnackbar(true);
        } catch (error) {
            console.error('Failed to copy: ', error);
        }
    }
    const leaveGame = () => {
        router.push(`/dashboard`);
    };
    const toggleDeleteModal = (value: boolean) => {
        setIsDeleteModalOpen(value)
    }

    const handleRemoveGame = async (gameId: string) => {
        await removeGame(gameId);
        setTimeout(() => {
            router.push('/dashboard')
            window.location.reload()
        }, 200
        )
    }

    const handleFinishGame = () => {
        if (players.filter((player) => player.status !== "Finished").length === 0) {
            finishGame(game.id)
        } else {
            console.log("not finished")
        }
    }

    return (<div className={styles["table"]}>
        <div className={styles["infoContainer"]}>
            <div className={styles["title"]}>{game.name}</div>
            <div className={styles["result"]}>Result : {game.average || 0}</div>
        </div>
        {isModerator(game.createdById, currentPlayerId) ?
            <div className={styles["utilityContainer"]}>
                <div className={styles['utilityItem']} onClick={handleFinishGame}>
                    <div className={styles["utilityIcon"]}>
                        <img src="./icons/eye.svg" alt="" />
                    </div>
                    <p>Reveal</p>
                </div>
                <div className={styles['utilityItem']}
                    onClick={
                        () => toggleDeleteModal(true)
                    }>
                    <div className={styles["utilityIcon"]}>
                        <img src="./icons/trash.svg" alt="" />
                    </div>
                    <p>Delete</p>
                </div>
                <div className={styles['utilityItem']}
                    onClick={() => resetGame(game.id)}
                >
                    <div className={styles["utilityIcon"]}>
                        <img src="./icons/refresh.svg" alt="" />
                    </div>
                    <p>Reset</p>
                </div>
                <div className={styles['utilityItem']}
                    onClick={() => leaveGame()}
                >
                    <div className={styles["utilityIcon"]}>
                        <img src="./icons/logout.svg" alt="" />
                    </div>
                    Exit</div>
                <div className={styles['utilityItem']}
                    onClick={() => copyInviteLink()}
                >
                    <div className={styles["utilityIcon"]}>
                        <img src="./icons/link.svg" alt="" />
                    </div>
                    Invite</div>
            </div>
            :
            <div className={styles["utilityContainer"]}>
                <div className={styles['utilityItem']}
                    onClick={() => leaveGame()}
                >
                    <div className={styles["utilityIcon"]}>
                        <img src="./icons/logout.svg" alt="" />
                    </div>
                    Exit</div>
            </div>
        }

        {
            isDeleteModalOpen ?
                <DeleteModal
                    closeModalCallBack={toggleDeleteModal}
                    title={`Delete ${game.name}`}
                    handleDeleteCallback={
                        () => handleRemoveGame(game.id)
                    }
                />
                :
                null
        }
        {
            showSnackbar ? <Snackbar message={`Link Copied ${protocol}//${host}/join/${gid}`} showSnackbar={true} hideSnackbar={() => setShowSnackbar(false)} /> : null
        }
    </div>)
}

export default Table