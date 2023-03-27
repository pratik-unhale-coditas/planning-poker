import { Player } from "@/types/player";
import { IStory } from "@/types/story";
import Game from "../game";

export interface ICardPickerProps {
  game: Game;
  players: Player[];
  currentPlayerId: string;
  currentStory: IStory;
}
