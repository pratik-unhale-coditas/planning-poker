import { auth } from "@/repository/firebase";
import { removePlayer } from "@/service/players";
import { Game, GameType } from "@/types/game";
import { Player } from "@/types/player";
import { Status } from "@/types/status";
import { IStory } from "@/types/story";
import { isModerator } from "@/utils/isModerator";
import { useAuthState } from "react-firebase-hooks/auth";
import { getCards } from "../constants/deck";
import styles from "./playerCard.module.scss"

interface IPlayerCardProps {
    game: Game;
    player: Player;
    currentStory: IStory
}



const PlayerCard: React.FC<IPlayerCardProps> = ({ game, player, currentStory }) => {
    const [user] = useAuthState(auth)
    const currentPlayerId = user?.uid

    const removeUser = (gameId: string, playerId: string) => {
        const newStory = currentStory
        delete newStory.values[playerId]
        removePlayer(gameId, playerId, newStory);
    };

    return (< div
        className={styles["card"]}
    >

        <div className={styles["title"]}>
            {player.name}
        </div>
        <div className={styles["value"]}>
            {getCardValue(player.id, currentStory, game)}
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
    if (story.status !== Status.Finished) {
        return story.values[playerId] === null ? '🤔' : '👍'
    }

    if (story.status === Status.Finished) {
        if (story.values[playerId] !== null) {
            if (story.values[playerId] === -1) {
                return 'Pass'; // coffee emoji
            }
            return getCardDisplayValue(game.gameType, story.values[playerId]);
        }
        return '🤔';
    }
};

const getCardDisplayValue = (
    gameType: GameType | undefined,
    cardValue: number | null
): string | number | null => {
    return getCards(gameType).find((card) => card.value === cardValue)?.displayValue || cardValue;
};