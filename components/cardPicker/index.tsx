import Card from "../card"

import { CardConfig, getCards } from "../constants/deck";

import styles from './cardDeck.module.scss'

import { ICardPickerProps } from "./cardPicker.types";
import { Status } from "@/types/status";
import { updatePlayerValue } from "@/service/story";




const CardPicker: React.FC<ICardPickerProps> = ({ game, players, currentPlayerId, currentStory }) => {

    const playPlayer = (cardValue: number) => {
        if (currentStory.status !== Status.Finished) {
            updatePlayerValue(game.id, currentStory, currentPlayerId, cardValue);
        }
    };

    const currentPlayerValue = currentStory.values[currentPlayerId]
    const cards = getCards(game.gameType);

    return (<div className={styles["container"]}>
        {
            cards.map((card: CardConfig, i) => {
                let isSelected = false


                if (currentPlayerValue === card.value) {
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