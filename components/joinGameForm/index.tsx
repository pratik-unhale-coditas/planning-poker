import styles from './joinGameForm.module.scss'

import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { getGame } from '@/service/games';
import { addPlayerToGame } from '@/service/players';
import { ulid } from 'ulidx';


const JoinGameForm = () => {
    const router = useRouter()
    const { gid } = router.query

    const [joinGameId, setJoinGameId] = useState(gid as string);
    const [playerName, setPlayerName] = useState('');

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