import { useEffect, useState } from "react"
import { useRouter } from "next/router"
import Image from "next/image"
import { useAuthState } from 'react-firebase-hooks/auth'
import moment from "moment"

import DeleteModal from "../deleteModal"
import Snackbar from "../snackbar"
import { auth, getStoriesFromStore } from '@/repository/firebase'
import { isModerator } from '@/utils/isModerator'

import styles from './savedGameCard.module.scss'

import { ISavedGameCardProps } from './savedGameCard.types'

const SavedGameCard = ({ recentGame, handleRemoveGame }: ISavedGameCardProps) => {
    const [user] = useAuthState(auth)
    const currentUserId = user?.uid
    const router = useRouter()
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
    const [showSnackbar, setShowSnackbar] = useState(false)
    const [snackbarMessage, setSnackbarMessage] = useState("")
    const { protocol, host } = location;
    const [totalEffortPoints, setTotalEffortPoints] = useState(0)
    const [totalStories, setTotalStories] = useState(0)

    const toggleDeleteModal = (value: boolean) => {
        setIsDeleteModalOpen(value)
    }
    const completeUrl = `${protocol}//${host}/join/${recentGame.id}`;

    const copyInviteLink = async () => {
        try {
            await navigator.clipboard.writeText(completeUrl);
            setSnackbarMessage(`Link Copied ${protocol}//${host}/join/${recentGame.id}`)
            setShowSnackbar(true);
        } catch (error) {
            console.error('Failed to copy: ', error);
        }
    }
    let timeStamp: any = recentGame.createdAt

    const date = new Date(timeStamp.seconds * 1000 + timeStamp.nanoseconds / 1000000);
    const createdAt = moment(date).fromNow();

    const getStoriesForRecentGame = async () => {
        const stories = await getStoriesFromStore(recentGame.id);
        setTotalStories(stories.length)
        let totalEffortPoints = 0
        stories.forEach((story) => {
            if (story.average) totalEffortPoints = totalEffortPoints + story.average
        })
        setTotalEffortPoints(totalEffortPoints)
    }

    useEffect(() => {
        recentGame.id && getStoriesForRecentGame()
    }, [])
    return (
        <div
            onClick={() => router.push(`/game/${recentGame.id}`)}
            className={styles["container"]}
        >
            <div className={styles["main"]}>
                <div className={styles["title"]}>
                    {recentGame.name}
                </div>
                <div className={styles["inviteLinkContainer"]}>
                    <p className={styles["inviteLinkPrompt"]}>Share this URL with your players:</p>
                    <div className={styles['copyLinkContainer']}>
                        <p>
                            {completeUrl}
                        </p>
                        <div
                            className={styles["copyIcon"]}
                            onClick={
                                (e) => {
                                    e.stopPropagation()
                                    copyInviteLink()
                                }
                            }
                        >
                            <Image width={24} height={24}
                                src="/icons/copy.svg"
                                alt=""
                            />
                        </div>
                    </div>
                </div>
                <div className={styles["snapshotContainer"]}>
                    <div className={styles["snapshotItem"]}>
                        <p className={styles["snapshotItemTitle"]}>Stories</p>
                        <p>{totalStories}</p>
                    </div>
                    <div className={styles["snapshotItem"]}>
                        <p className={styles["snapshotItemTitle"]}>Total Effort Points</p>
                        <p>{totalEffortPoints}</p>
                    </div>
                    <div className={styles["snapshotItem"]} style={{ border: 'none' }}>
                        <p className={styles["snapshotItemTitle"]}>Created</p>
                        <p>{createdAt}</p>
                    </div>
                </div>
                <div className={styles["deckTypeContainer"]}>
                    <p className={styles["deckTypeTitle"]}>Deck Type :-</p>
                    <p className={styles["deckType"]}>{recentGame.gameType}</p>
                </div>
            </div>
            {isModerator(recentGame.createdById, currentUserId) ?
                <div className={styles["deleteButton"]} onClick={(e) => {
                    e.stopPropagation()
                    setIsDeleteModalOpen(true)
                }}>
                    <Image width={24} height={24} src="/icons/trash.svg" alt="" />
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
            {
                showSnackbar ? <Snackbar message={snackbarMessage} showSnackbar={true} hideSnackbar={() => setShowSnackbar(false)} /> : null
            }
        </div>)
}

export default SavedGameCard