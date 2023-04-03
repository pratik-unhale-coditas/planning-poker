import { auth, db } from '@/repository/firebase'
import { streamGame } from '@/service/games'
import { Game } from '@/types/game'
import { Player } from '@/types/player'
import { doc, onSnapshot } from 'firebase/firestore'

import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import CardPicker from '../cardPicker'
import Table from '../table'
import styles from './game.module.scss'
import { collection } from "firebase/firestore";
import Players from '../players'
import Story from '../story'
import { IStory } from '@/types/story'
import Image from 'next/image'
import { isModerator } from '@/utils/isModerator'
import { useAuthState } from 'react-firebase-hooks/auth'

interface IGameProps {
    gid: string
}

const Game = ({ gid }: IGameProps) => {

    const router = useRouter()
    const [user] = useAuthState(auth)
    const { id } = router.query

    const [game, setGame] = useState<Game | undefined>(undefined);
    const [players, setPlayers] = useState<Player[] | undefined>(undefined);
    const [stories, setStories] = useState<IStory[] | undefined>([])
    const [loading, setIsLoading] = useState(true);
    const [currentPlayerId, setCurrentPlayerId] = useState<string | undefined>(undefined);
    const [currentStory, setCurrentStory] = useState<IStory | undefined>(undefined)

    useEffect(() => {
        let effectCleanup = true;

        if (effectCleanup) {
            const currentPlayerId = user ? user.uid : id as string;
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
            if (!players.find((player) => player.id === currentPlayerId)) {
                router.push(`/join/${gid}`);
            }
            setPlayers(players);

        });

        const streamStoriesFromStore = (id: string) => {
            return collection(doc(db, "games", id), "stories");
        };

        const streamStories = (id: string) => {
            return streamStoriesFromStore(id);
        };

        const storyUnsubscribe = onSnapshot(streamStories(gid as string), (snapshot) => {
            const stories: IStory[] = [];
            snapshot.forEach((doc) => {
                stories.push(doc.data() as IStory);
            });
            setStories(stories);

        });

        return () => {
            gameUnsubscribe()
            playerUnsubscribe()
            storyUnsubscribe()
            effectCleanup = false
        };
    }, [gid, router, currentPlayerId]);



    useEffect(() => {
        if (stories && !currentStory) {
            setCurrentStory(stories[0])
        }
        else if (currentStory) {
            let newCurrentStory = stories?.find((story) => story.id === currentStory.id)
            if (newCurrentStory) {
                setCurrentStory(newCurrentStory)
            } else {
                if (stories) {
                    setCurrentStory(stories[0])
                }
            }
        }
    }, [stories])

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
                <div className={styles["gameTitle"]}>
                    <p>  {game.name}</p>
                </div>
                <div className={styles["left"]}>

                    {stories?.length as number > 0 && currentStory ?
                        <>
                            <Players
                                game={game}
                                players={players}
                                currentPlayerId={currentPlayerId}
                                currentStory={currentStory}
                            />
                            <div className={styles["tableModuleContainer"]}>
                                <div className={styles["table"]}>
                                    <Table
                                        game={game}
                                        currentPlayerId={currentPlayerId}
                                        currentStory={currentStory} />
                                </div>
                            </div>
                            <CardPicker
                                game={game}
                                players={players}
                                currentPlayerId={currentPlayerId}
                                currentStory={currentStory}
                            />
                        </>
                        :
                        <div className={styles["addStoryPrompt"]}>
                            <div>
                                < Image
                                    src='/icons/emptyState.png'
                                    alt='emptyStateImage'
                                    width={250}
                                    height={250} />
                            </div>
                            <p>Oops! No story found</p>
                            {
                                isModerator(game.createdById, currentPlayerId) ?
                                    <p>Add your first story to get started</p>
                                    :
                                    <p>Wait for the moderator to add a story to get started</p>
                            }
                        </div>
                    }
                </div>


                <div className={styles["right"]}>
                    <Story
                        stories={stories}
                        game={game}
                        selectedStory={currentStory}
                        handleStorySelect={setCurrentStory}
                        currentPlayerId={currentPlayerId}
                        players={players}
                    />
                </div>
            </div>
            :
            game ? <div>Link not valid</div> :
                <div>Game not found</div>
        }
        </>
    )
}

export default Game

