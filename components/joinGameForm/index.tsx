import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { ulid } from 'ulidx';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useForm } from "react-hook-form"
import * as Yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup';

import { auth, getUserFromStore, updateUserGamesInStore } from '@/repository/firebase';

import { getGame } from '@/service/games';
import { addPlayerToGame, isPlayerInGameStore } from '@/service/players';

import styles from './joinGameForm.module.scss'

const joinGameFormSchema = Yup.object().shape({
    displayName: Yup.string().required("Display name is required"),
});
interface IJoinGameFormValues {
    displayName: string;
};


const JoinGameForm = () => {
    const [user] = useAuthState(auth)

    const currentPlayerId = user?.uid
    const router = useRouter()
    const { gid } = router.query

    const [joinGameId, setJoinGameId] = useState(gid as string);
    const [loading, setLoading] = useState(false)
    const [gameExist, setGameExist] = useState(false)

    const navigateToHome = () => {
        router.push('/')
    }

    const checkIfGameExists = async () => {
        const res = await doesGameExist()
        setGameExist(Boolean(res))
    }

    const doesGameExist = async () => {
        if (joinGameId) {
            const res = await getGame(joinGameId)
            return Boolean(res)
        }
    }

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<IJoinGameFormValues>({
        resolver: yupResolver(joinGameFormSchema),
        defaultValues: {
            displayName: ''
        },
    });

    const onSubmit = async (data: any) => {
        setLoading(true)
        const { displayName } = data
        if (await doesGameExist()) {
            const newPlayer = { name: displayName, id: ulid() };
            const res = await addPlayerToGame(joinGameId, newPlayer);
            if (res) {
                localStorage.setItem("currentPlayerId", newPlayer.id)
                router.push(`/game/${joinGameId}?id=${newPlayer.id}`);
            }
        }
        setLoading(false)
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

    }

    useEffect(() => {
        const playerIdInCache = localStorage.getItem("currentPlayerId")
        async function fetchData() {
            if (await doesGameExist() && currentPlayerId) {
                if (await isPlayerInGameStore(gid as string, currentPlayerId as string)) {
                    router.push(`/game/${joinGameId}`);
                }
            }
            else if (await doesGameExist() && playerIdInCache) {
                if (await isPlayerInGameStore(gid as string, playerIdInCache as string)) {
                    router.push(`/game/${joinGameId}?id=${playerIdInCache}`);
                }
            }

        }
        fetchData();
        checkIfGameExists();
    }, [joinGameId, history, currentPlayerId]);

    return (
        <>{
            gameExist ? (
                !currentPlayerId ?
                    <form className={styles["container"]}
                        onSubmit={handleSubmit(onSubmit)}
                    >
                        <div className={styles["header"]}>
                            <h2>Join Game</h2>
                            <button
                                onClick={
                                    (event) => {
                                        event.stopPropagation()
                                        navigateToHome()
                                    }
                                }
                            ><img src="/icons/x.svg" alt="" /></button>
                        </div>
                        <div className={styles["main"]}>
                            <div className={styles["inputContainer"]}>
                                <label className={styles["label"]}>Display Name</label>
                                <input
                                    className={styles["input"]}
                                    type={"text"}
                                    {...register('displayName')}
                                />
                            </div>
                            <p className={styles["inputWarningMessage"]}>{errors.displayName?.message}</p>

                            <div className={styles["submitButtonContainer"]}>
                                <button
                                    disabled={loading}
                                    className={styles["submitButton"]}
                                    type={"submit"}>Join</button>
                            </div>
                        </div>
                    </form>
                    : <form
                        className={styles["container"]}
                        onSubmit={joinPlayer}>
                        <div className={styles["header"]}>
                            <h2>Join Game</h2>
                            <button
                                onClick={
                                    (event) => {
                                        event.stopPropagation()
                                        navigateToHome()
                                    }
                                }
                            >
                                <img src="/icons/x.svg" alt="" /></button>
                        </div>
                        <div className={styles["main"]}>
                            <div className={styles["submitButtonContainer"]}>
                                <button className={styles["submitButton"]} type={"submit"}>Join</button>
                            </div>
                        </div>
                    </form>) : <>Link not valid anymore</>
        }

        </>
    )
}

export default JoinGameForm