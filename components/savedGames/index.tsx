import { useEffect, useState } from 'react';
import Link from 'next/link'

import { removeGame } from '@/service/games';
import { getPlayerRecentGamesFromStore } from '@/service/players';
import Game from '../game';
import SavedGameCard from '../savedGameCard';
import styles from './savedGames.module.scss'
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/repository/firebase';

const SavedGames = () => {

    const [user] = useAuthState(auth)
    const userId = user?.uid as string
    const [recentGames, setRecentGames] = useState<Game[] | undefined>(undefined);
    const [reloadRecent, setReloadRecent] = useState<Boolean>(false);

    const handleRemoveGame = async (recentGameId: string) => {
        await removeGame(recentGameId);
        setReloadRecent(!reloadRecent);
    }

    useEffect(() => {
        let fetchCleanup = true;

        async function fetchRecent() {
            const games = await getPlayerRecentGamesFromStore(userId)
            if (games && fetchCleanup) {
                setRecentGames(games);
            }
        }

        fetchRecent();

        return () => { fetchCleanup = false };
    }, [reloadRecent]);

    const isEmptyRecentGames = (): boolean => {
        if (!recentGames) {
            return true;
        }
        if (recentGames && recentGames.length === 0) {
            return true;
        }
        return false;
    };


    return (
        <div className={styles["container"]}>
            <h2 className={styles["title"]}>Saved Games</h2>
            {isEmptyRecentGames() ? <Link href={'/dashboard/createNewGame'} className={styles["createNewGame"]}>Create New Game</Link>
                : null}
            <div className={styles["savedGamesContainer"]}>
                {
                    recentGames?.map((recentGame) => {
                        return (
                            <SavedGameCard
                                key={recentGame.id}
                                recentGame={recentGame}
                                handleRemoveGame={() => handleRemoveGame(recentGame.id)}
                            />
                        )
                    })
                }
            </div>

        </div>

    )
}

export default SavedGames