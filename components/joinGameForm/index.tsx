import styles from './joinGameForm.module.scss'

import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { getGame } from '@/service/games';
import { addPlayerToGame, isCurrentPlayerInGame } from '@/service/players';


const JoinGameForm = () => {
    const router = useRouter()
    const { gid } = router.query

    const [joinGameId, setJoinGameId] = useState(gid as string);
    const [playerName, setPlayerName] = useState('');
    const [gameFound, setIsGameFound] = useState(true);
    const [showNotExistMessage, setShowNotExistMessage] = useState(false);
    const [loading, setLoading] = useState(false);

    const onSubmit = async (e: any) => {
        e.preventDefault()
        setLoading(true);
        if (joinGameId) {
            const res = await addPlayerToGame(joinGameId, playerName);

            setIsGameFound(res);
            if (res) {
                router.push(`/game/${joinGameId}`);
            }
            setLoading(false);
        }
    };

    useEffect(() => {
        async function fetchData() {
            if (joinGameId) {
                if (await getGame(joinGameId)) {
                    setIsGameFound(true);
                    if (await isCurrentPlayerInGame(joinGameId)) {
                        router.push(`/game/${joinGameId}`);
                    }
                } else {
                    setShowNotExistMessage(true);
                    setTimeout(() => {
                        router.push('/');
                    }, 5000)
                }
            }
        }
        fetchData();
    }, [joinGameId, history]);

    return (
        <form className={styles["container"]}
            onSubmit={onSubmit}
        >
            <div className={styles["header"]}>
                <h2>Join A Game</h2>
                <button><img src="./icons/x.svg" alt="" /> Close</button>
            </div>
            <div className={styles["main"]}>
                <div className={styles["inputContainer"]}>
                    <label className={styles["label"]}>Display Name</label>
                    <input name="name" className={styles["input"]} type={"text"} onChange={(e) => setPlayerName(e.target.value)} />
                </div>
                <div className={styles["submitButtonContainer"]}>
                    <button className={styles["submitButton"]}>Join</button>
                </div>
            </div>
        </form>)
}

export default JoinGameForm