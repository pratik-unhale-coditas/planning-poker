import PlayerCard from "../playerCard";

import styles from './players.module.scss'

import { IPlayersProps } from './players.types';

const Players: React.FC<IPlayersProps> = ({ game, players, currentStory }) => {
    return (<div className={styles["container"]}>
        {
            players.map((player) => {
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