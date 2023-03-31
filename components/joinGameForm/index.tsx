import styles from './joinGameForm.module.scss'

import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { getGame } from '@/service/games';
import { addPlayerToGame, isPlayerInGameStore } from '@/service/players';
import { ulid } from 'ulidx';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, getUserFromStore, updateUserGamesInStore } from '@/repository/firebase';


const JoinGameForm = () => {
    const [user] = useAuthState(auth)

    const currentPlayerId = user?.uid
    const router = useRouter()
    const { gid } = router.query

    const [joinGameId, setJoinGameId] = useState(gid as string);
    const [playerName, setPlayerName] = useState('');

    const navigateToHome = () => {
        router.push('/')
    }
    const onSubmit = async (e: any) => {
        e.preventDefault()
        if (joinGameId) {
            const newPlayer = { name: playerName, id: ulid() };

            const res = await addPlayerToGame(joinGameId, newPlayer);

            if (res) {
                router.push(`/game/${joinGameId}?id=${newPlayer.id}`);
            }
        }
    };
    const joinPlayer = async (e: any) => {
        e.preventDefault()
        if (joinGameId && currentPlayerId) {
            const user = await getUserFromStore(currentPlayerId)
            const name = user?.firstName as string
            const newPlayer = { name: name, id: currentPlayerId };
            const result = await addPlayerToGame(joinGameId, newPlayer);
            const res = await updateUserGamesInStore(currentPlayerId, joinGameId);
            if (res && result) {
                router.push(`/game/${joinGameId}`);
            }
        }
    }

    useEffect(() => {
        async function fetchData() {
            if (joinGameId && currentPlayerId) {
                if (await getGame(joinGameId)) {
                    if (await isPlayerInGameStore(gid as string, currentPlayerId as string)) {
                        router.push(`/game/${joinGameId}`);
                    }
                }
            }
        }
        fetchData();
    }, [joinGameId, history, currentPlayerId]);

    return (!currentPlayerId ?
        <form className={styles["container"]}
            onSubmit={onSubmit}
        >
            <div className={styles["header"]}>
                <h2>Join A Game</h2>
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
                <h2>Join A Game</h2>
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
    )
}

export default JoinGameForm