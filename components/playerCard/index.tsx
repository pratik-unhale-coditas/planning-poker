import { removePlayer } from "@/service/players";
import { Game, GameType } from "@/types/game";
import { Player } from "@/types/player";
import { Status } from "@/types/status";
import { isModerator } from "@/utils/isModerator";
import { useContext } from "react";
import { getCards } from "../constants/deck";
import styles from "./playerCard.module.scss"

interface IPlayerCardProps {
    game: Game;
    player: Player;
    currentPlayerId: string;
}

const PlayerCard: React.FC<IPlayerCardProps> = ({ game, player, currentPlayerId }) => {
    const removeUser = (gameId: string, playerId: string) => {
        removePlayer(gameId, playerId);
    };


    return (<div
        className={[true ? styles["flipped"] : null, styles["card"]].join(" ")}
    >
        <div className={styles["front"]}>
            {player.name}
        </div>
        <div className={styles["back"]}>
            <div className={styles["title"]}>
                {player.name}
            </div>
            <div className={styles["value"]}>
                {getCardValue(player, game)}
            </div>
        </div>
        {
            isModerator(game.createdById, currentPlayerId) &&
                player.id !== currentPlayerId ?
                <div className={styles["deleteButton"]}>Delete</div>
                : null

        }

    </div>)
}

export default PlayerCard

const getCardValue = (player: Player, game: Game) => {
    if (game.gameStatus !== Status.Finished) {
        return player.status === Status.Finished ? '👍' : '🤔';
    }

    if (game.gameStatus === Status.Finished) {
        if (player.status === Status.Finished) {
            if (player.value && player.value === -1) {
                return '☕'; // coffee emoji
            }
            return getCardDisplayValue(game.gameType, player.value);
        }
        return '🤔';
    }
};

const getCardDisplayValue = (
    gameType: GameType | undefined,
    cardValue: number | undefined
): string | number | undefined => {
    return getCards(gameType).find((card) => card.value === cardValue)?.displayValue || cardValue;
};