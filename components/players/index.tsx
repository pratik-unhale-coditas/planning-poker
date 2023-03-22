import styles from './players.module.scss'
import { Game } from "@/types/game";
import { Player } from "@/types/player";
import PlayerCard from "../playerCard";

interface IPlayersProps {
    game: Game;
    players: Player[];
    currentPlayerId: string;
}

const Players: React.FC<IPlayersProps> = ({ game, players, currentPlayerId }) => {
    return (<div className={styles["container"]}>
        {
            players.map((player: Player) => {
                return (
                    <PlayerCard key={player.id} game={game} player={player} currentPlayerId={currentPlayerId} />
                )
            })
        }
    </div>)
}

export default Players