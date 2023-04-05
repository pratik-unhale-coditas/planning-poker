import { useEffect, useState } from 'react';
import Link from 'next/link'
import { useAuthState } from 'react-firebase-hooks/auth';

import SavedGameCard from '../savedGameCard';
import Snackbar from '../snackbar';


import { removeGame } from '@/service/games';
import { getPlayerRecentGamesFromStore } from '@/service/players';
import { auth } from '@/repository/firebase';


import styles from './savedGames.module.scss'
import { Game } from '@/types/game';

const SavedGames = () => {

    const [user] = useAuthState(auth)
    const userId = user?.uid as string
    const [recentGames, setRecentGames] = useState<Game[] | undefined>(undefined);
    const [reloadRecent, setReloadRecent] = useState<Boolean>(false);
    const [showSnackbar, setShowSnackbar] = useState(false)
    const [query, setQuery] = useState("");

    const handleRemoveGame = async (recentGameId: string) => {
        await removeGame(recentGameId);
        setShowSnackbar(true)
        setReloadRecent(!reloadRecent);
    }

    useEffect(() => {
        let fetchCleanup = true;

        async function fetchRecent() {
            const games = await getPlayerRecentGamesFromStore(userId) as Game[]
            if (games && fetchCleanup) {
                setRecentGames(games);
            }
        }

        userId && fetchRecent();

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
    const handleQueryChange = (event: any) => {
        setQuery(event.target.value);
    };
    const filteredGames = recentGames?.filter((game) =>
        game.name.toLowerCase().includes(query.toLowerCase())
    );
    return (
        <div className={styles["container"]}>
            <h2 className={styles["title"]}>Saved Games</h2>
            {isEmptyRecentGames() ? <Link href={'/dashboard/createNewGame'} className={styles["createNewGame"]}>Create New Game</Link>
                :
                <form className={styles["searchFormContainer"]}>
                    <input
                        type="text"
                        value={query}
                        onChange={handleQueryChange}
                        className={styles["searchInput"]}
                        placeholder="Search by name"
                    />
                </form>
            }
            <div className={styles["savedGamesContainer"]}>
                {
                    filteredGames?.map((recentGame) => {
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
            {
                showSnackbar ? <Snackbar message={"Game deleted successfully"} showSnackbar={true} hideSnackbar={() => setShowSnackbar(false)} /> : null
            }
        </div>

    )
}

export default SavedGames