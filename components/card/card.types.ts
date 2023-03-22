import { CardConfig } from "../constants/deck";

export interface ICardProps {
  card: CardConfig;
  handleCardSelect: any;
  isSelected: boolean;
}
