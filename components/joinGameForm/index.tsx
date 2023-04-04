import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { ulid } from 'ulidx';
import { useAuthState } from 'react-firebase-hooks/auth';

import Snackbar from '../snackbar';

import { auth, getUserFromStore, updateUserGamesInStore } from '@/repository/firebase';

import { getGame } from '@/service/games';
import { addPlayerToGame, isPlayerInGameStore } from '@/service/players';

import styles from './joinGameForm.module.scss'


const JoinGameForm = () => {
    const [user] = useAuthState(auth)

    const currentPlayerId = user?.uid
    const router = useRouter()
    const { gid } = router.query

    const [joinGameId, setJoinGameId] = useState(gid as string);
    const [playerName, setPlayerName] = useState('');
    const [showSnackbar, setShowSnackbar] = useState(false)
    const [snackbarMessage, setSnackbarMessage] = useState("")

    const navigateToHome = () => {
        router.push('/')
    }

    const doesGameExist = async () => {
        const res = await getGame(joinGameId)
        return Boolean(res)
    }

    const onSubmit = async (e: any) => {
        e.preventDefault()
        if (await doesGameExist()) {
            const newPlayer = { name: playerName, id: ulid() };
            const res = await addPlayerToGame(joinGameId, newPlayer);
            if (res) {
                router.push(`/game/${joinGameId}?id=${newPlayer.id}`);
            }
        }
        else if (!(await doesGameExist())) {
            setSnackbarMessage("Link not valid anymore")
            setShowSnackbar(true)
        }
    };
    const joinPlayer = async (e: any) => {
        e.preventDefault()
        if (await doesGameExist() && currentPlayerId) {
            const user = await getUserFromStore(currentPlayerId)
            const name = user?.firstName as string
            const newPlayer = { name: name, id: currentPlayerId };
            const result = await addPlayerToGame(joinGameId, newPlayer);
            const res = await updateUserGamesInStore(currentPlayerId, joinGameId);
            if (res && result) {
                router.push(`/game/${joinGameId}`);
            }
        }
        else if (!(await doesGameExist())) {
            setSnackbarMessage("Link not valid anymore")
            setShowSnackbar(true)
        }
    }

    useEffect(() => {
        async function fetchData() {
            if (await doesGameExist() && currentPlayerId) {
                if (await isPlayerInGameStore(gid as string, currentPlayerId as string)) {
                    router.push(`/game/${joinGameId}`);
                }
            }
            else if (!(await doesGameExist())) {
                setSnackbarMessage("Link not valid anymore")
                setShowSnackbar(true)
            }
        }
        fetchData();
    }, [joinGameId, history, currentPlayerId]);

    return (
        <>{
            !currentPlayerId ?
                <form className={styles["container"]}
                    onSubmit={onSubmit}
                >
                    <div className={styles["header"]}>
                        <h2>Join Game</h2>
                        <button
                            onClick={navigateToHome}
                        ><img src="./icons/x.svg" alt="" /> Close</button>
                    </div>
                    <div className={styles["main"]}>
                        <div className={styles["inputContainer"]}>
                            <label className={styles["label"]}>Display Name</label>
                            <input name="name" className={styles["input"]} type={"text"} onChange={(e) => setPlayerName(e.target.value)} />
                        </div>
                        <div className={styles["submitButtonContainer"]}>
                            <button className={styles["submitButton"]} type={"submit"}>Join</button>
                        </div>
                    </div>
                </form>
                : <form
                    className={styles["container"]}
                    onSubmit={joinPlayer}>
                    <div className={styles["header"]}>
                        <h2>Join Game</h2>
                        <button

                            onClick={navigateToHome}>
                            <img src="./icons/x.svg" alt="" /> Close</button>
                    </div>
                    <div className={styles["main"]}>
                        <div className={styles["submitButtonContainer"]}>
                            <button className={styles["submitButton"]} type={"submit"}>Join</button>
                        </div>
                    </div>
                </form>
        }
            {
                showSnackbar ? <Snackbar message={snackbarMessage as string} showSnackbar={true} hideSnackbar={() => setShowSnackbar(false)} /> : null
            }
        </>
    )
}

export default JoinGameForm