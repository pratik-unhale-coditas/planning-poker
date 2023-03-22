import { auth, db } from '@/repository/firebase'
import { streamGame } from '@/service/games'
import { getCurrentPlayerId } from '@/service/players'
import { Game } from '@/types/game'
import { Player } from '@/types/player'
import { doc, onSnapshot } from 'firebase/firestore'

import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import CardPicker from '../cardPicker'
import PlayerCard from '../playerCard'
import Table from '../table'
import styles from './game.module.scss'
import { collection, getDocs } from "firebase/firestore";
import Players from '../players'

const Game = () => {
    const router = useRouter()
    const { gid } = router.query
    const [game, setGame] = useState<Game | undefined>(undefined);
    const [players, setPlayers] = useState<Player[] | undefined>(undefined);
    const [loading, setIsLoading] = useState(true);
    const [currentPlayerId, setCurrentPlayerId] = useState<string | undefined>(undefined);
    useEffect(() => {
        let effectCleanup = true;

        if (effectCleanup) {
            const currentPlayerId = getCurrentPlayerId(gid as string);
            if (!currentPlayerId) {
                router.push(`/join/${gid}`);
            }

            setCurrentPlayerId(currentPlayerId);
            setIsLoading(true);
        }

        const gameUnsubscribe = onSnapshot(streamGame(gid as string), (snapshot) => {

            if (effectCleanup) {
                if (snapshot.exists()) {
                    const data = snapshot.data();
                    if (data) {
                        setGame(data as Game);
                        setIsLoading(false);
                        return;
                    }
                }
                setIsLoading(false);
            }
        })
        const streamPlayersFromStore = (id: string) => {
            return collection(doc(db, "games", id), "players");
        };

        const streamPlayers = (id: string) => {
            return streamPlayersFromStore(id);
        };

        const playerUnsubscribe = onSnapshot(streamPlayers(gid as string), (snapshot) => {
            const players: Player[] = [];
            snapshot.forEach((doc) => {
                players.push(doc.data() as Player);
            });
            const currentPlayerId = getCurrentPlayerId(gid as string);
            if (!players.find((player) => player.id === currentPlayerId)) {
                router.push(`/join/${gid}`);
            }
            setPlayers(players);

        });

        return () => {
            gameUnsubscribe()
            playerUnsubscribe()
            effectCleanup = false
        };
    }, [gid, router]);

    if (loading) {
        return (
            <div className='PokerLoading'>
                Loading...
            </div>
        );
    }
    return (
        <> {game && players && currentPlayerId ?
            <div className={styles["container"]}>
                <Players game={game} players={players} currentPlayerId={currentPlayerId} />
                <div className={styles["tableModuleContainer"]}>
                    <div className={styles["table"]}>
                        <Table game={game} currentPlayerId={currentPlayerId} players={players} />
                    </div>
                </div>
                <CardPicker game={game} players={players} currentPlayerId={currentPlayerId} />
            </div>
            :
            <div>Game not found</div>
        }
        </>
    )
}

export default Game

