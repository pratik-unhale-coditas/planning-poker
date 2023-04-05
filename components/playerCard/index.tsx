import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/repository/firebase";

import { getCards } from "../constants/deck";
import { removePlayer } from "@/service/players";
import { isModerator } from "@/utils/isModerator";

import { Game, GameType } from "@/types/game";
import { Status } from "@/types/status";
import { IStory } from "@/types/story";
import { IPlayerCardProps } from "./playerCard.types";

import styles from "./playerCard.module.scss"


const PlayerCard: React.FC<IPlayerCardProps> = ({ game, player, currentStory }) => {
    const [user] = useAuthState(auth)
    const currentPlayerId = user?.uid

    const removeUser = (gameId: string, playerId: string) => {
        const newStory = currentStory
        delete newStory.values[playerId]
        removePlayer(gameId, playerId, newStory);
    };
    const value = getCardValue(player.id, currentStory, game)
    return (< div
        className={[currentStory.status === Status.Finished ? styles["flipped"] : null, styles["card"]].join(" ")}
    >

        <div className={styles["front"]}>
            <div className={styles["frontEmoji"]}>{currentStory.values[player.id] === null ? '🤔' : '👍'}</div>
            <p>{player.name}</p>
        </div>
        <div className={styles["back"]}>
            <div className={styles["title"]}>
                {player.name}
            </div>
            <div className={styles["value"]}>
                {value === "☕" ? <div>
                    {value}
                    <p>Pass</p>
                </div>
                    :
                    value === "❓" ?
                        <div>
                            {value}
                            <p>Not sure</p>
                        </div> : value
                }
            </div>
        </div>
        {
            isModerator(game.createdById, currentPlayerId) &&
            player.id != currentPlayerId &&
            <div
                className={styles["deleteButton"]}
                onClick={() => removeUser(game.id, player.id)}
            ><img src="/icons/trash.svg" /></div>
        }
    </div>
    )
}

export default PlayerCard

const getCardValue = (playerId: string, story: IStory, game: Game) => {
    // if (story.status !== Status.Finished) {
    //     return story.values[playerId] === null ? '🤔' : '👍'
    // }

    if (story.status === Status.Finished) {
        if (story.values[playerId] !== null) {
            if (story.values[playerId] === -1) {
                return '☕'; // coffee emoji
            }
            return getCardDisplayValue(game.gameType, story.values[playerId]);
        }
    }
};

const getCardDisplayValue = (
    gameType: GameType | undefined,
    cardValue: number | null
): string | number | null => {
    return getCards(gameType).find((card) => card.value === cardValue)?.displayValue || cardValue;
};