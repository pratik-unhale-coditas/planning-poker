import { Player } from "@/types/player";
import Game from "../game";

export interface ICardPickerProps {
  game: Game;
  players: Player[];
  currentPlayerId: string;
}
