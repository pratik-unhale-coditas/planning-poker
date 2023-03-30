import styles from './players.module.scss'
import { Game } from "@/types/game";
import { Player } from "@/types/player";
import PlayerCard from "../playerCard";
import { IStory } from '@/types/story';

interface IPlayersProps {
    game: Game;
    players: Player[];
    currentPlayerId: string;
    currentStory: IStory
}

const Players: React.FC<IPlayersProps> = ({ game, players, currentPlayerId, currentStory }) => {
    return (<div className={styles["container"]}>
        {
            players.map((player: Player) => {
                return (
                    <PlayerCard
                        key={player.id}
                        game={game}
                        player={player}
                        currentStory={currentStory}
                    />
                )
            })
        }
    </div>)
}

export default Players