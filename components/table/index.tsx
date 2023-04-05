import { useState } from 'react'
import { useRouter } from 'next/router';

import DeleteModal from '../deleteModal';
import Snackbar from '../snackbar';

import { finishStory, removeStory, resetStory } from '@/service/story';
import { isModerator } from '@/utils/isModerator';

import styles from './table.module.scss'

import { Status } from '@/types/status';
import { ITableProps } from './table.types';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/repository/firebase';


const Table: React.FC<ITableProps> = ({ game, currentPlayerId, currentStory }) => {
    const router = useRouter()
    const [user] = useAuthState(auth)

    const { gid } = router.query
    const { protocol, host } = location;
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
    const [showSnackbar, setShowSnackbar] = useState(false)
    const [snackbarMessage, setSnackbarMessage] = useState("")

    const completeUrl = `${protocol}//${host}/join/${gid}`;

    const copyInviteLink = async () => {
        try {
            await navigator.clipboard.writeText(completeUrl);
            setSnackbarMessage(`Link Copied ${protocol}//${host}/join/${gid}`)
            setShowSnackbar(true);
        } catch (error) {
            console.error('Failed to copy: ', error);
        }
    }


    const toggleDeleteModal = (value: boolean) => {
        setIsDeleteModalOpen(value)
    }

    const handleFinishGame = () => {
        const obj = currentStory.values
        for (const key in obj) {
            if (obj[key] === null) {
                obj[key] = -1;
            }
        }
        finishStory(game.id, currentStory)
    }

    const handleRemoveStory = async (gameId: string, storyId: string) => {
        await removeStory(gameId, storyId);
    }

    const leaveGame = () => {
        user ?
            router.push(`/dashboard`) : router.push(`/`);
    };

    return (<div className={styles["table"]}>
        <div className={styles["infoContainer"]}>
            <div className={styles["title"]}>{currentStory?.name}</div>
            <div className={styles["result"]}>Average : {currentStory?.average || '-/-'}</div>
        </div>
        {isModerator(game.createdById, currentPlayerId) ?
            <div className={styles["utilityContainer"]}>
                <div className={styles['utilityItem']} onClick={handleFinishGame}>
                    <div className={styles["utilityIcon"]}>
                        <img src="/icons/eye.svg" alt="" />
                    </div>
                    <p>Reveal</p>
                </div>
                <div className={styles['utilityItem']}
                    onClick={
                        () => toggleDeleteModal(true)
                    }>
                    <div className={styles["utilityIcon"]}>
                        <img src="/icons/trash.svg" alt="" />
                    </div>
                    <p>Delete</p>
                </div>
                <div className={styles['utilityItem']}
                    onClick={() => resetStory(game.id, currentStory
                    )}
                >
                    <div className={styles["utilityIcon"]}>
                        <img src="/icons/refresh.svg" alt="" />
                    </div>
                    <p>Reset</p>
                </div>
                <div className={styles['utilityItem']}
                    onClick={() => leaveGame()}
                >
                    <div className={styles["utilityIcon"]}>
                        <img src="/icons/logOut.svg" alt="" />
                    </div>
                    Exit</div>
                <div className={styles['utilityItem']}
                    onClick={() => copyInviteLink()}
                >
                    <div className={styles["utilityIcon"]}>
                        <img src="/icons/link.svg" alt="" />
                    </div>
                    Invite</div>
            </div>
            :
            <div className={styles["utilityContainer"]}>
                <div className={styles['utilityItem']}
                    onClick={() => leaveGame()}
                >
                    <div className={styles["utilityIcon"]}>
                        <img src="/icons/logout.svg" alt="" />
                    </div>
                    Exit</div>
            </div>
        }
        <div className={styles["instructionContainer"]}>
            {

                !isModerator(game.createdById, currentPlayerId) ?
                    currentStory.status !== Status.Finished ?
                        (
                            currentStory.values[currentPlayerId] === null ?
                                <div className={styles["instruction"]}>
                                    <p>
                                        Choose a card that best represents your estimate for this story.
                                    </p>
                                    <p>
                                        Your vote will help the team reach a consensus on the estimated effort for this story!
                                    </p>
                                </div>

                                :
                                <div className={styles["instruction"]}>
                                    <p>
                                        Please wait for the moderator to complete the game.
                                    </p>
                                    <p>(P.S.:  Once the voting is finished, your vote is final – so choose wisely!)</p>
                                </div>
                        )
                        :
                        <div className={styles["instruction"]}>
                            <p>The moderator has closed voting for this story.</p>
                            <p>(P.S.: The final estimate has been submitted, so your vote is now final and cant be changed.)</p>
                        </div>
                    : null
            }
        </div>
        {
            isDeleteModalOpen ?
                <DeleteModal
                    closeModalCallBack={toggleDeleteModal}
                    title={`Delete ${currentStory.name}`}
                    handleDeleteCallback={
                        () => handleRemoveStory(game.id, currentStory.id)
                    }
                />
                :
                null
        }
        {
            showSnackbar ? <Snackbar message={snackbarMessage} showSnackbar={true} hideSnackbar={() => setShowSnackbar(false)} /> : null
        }
    </div>)
}

export default Table