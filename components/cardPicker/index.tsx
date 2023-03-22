import Card from "../card"

import { updatePlayerValue } from "@/service/players";
import { CardConfig, getCards } from "../constants/deck";

import styles from './cardDeck.module.scss'

import { ICardPickerProps } from "./cardPicker.types";
import { Status } from "@/types/status";




const CardPicker: React.FC<ICardPickerProps> = ({ game, players, currentPlayerId }) => {

    const playPlayer = (cardValue: number) => {
        if (game.gameStatus !== Status.Finished) {
            updatePlayerValue(game.id, currentPlayerId, cardValue);
        }
    };
    const cards = getCards(game.gameType);

    return (<div className={styles["container"]}>
        {
            cards.map((card: CardConfig, i) => {
                let isSelected = false

                const player = players.find((player) => player.id === currentPlayerId);

                if (player && player.value !== undefined && player.value === card.value) {
                    isSelected = true
                }

                return (
                    <Card key={card.value}
                        card={card}
                        handleCardSelect={playPlayer}
                        isSelected={isSelected}
                    />)
            })

        }

    </div>)
}


export default CardPicker