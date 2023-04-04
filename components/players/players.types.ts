import { Game } from "@/types/game";
import { Player } from "@/types/player";
import { IStory } from "@/types/story";

export interface IPlayersProps {
  game: Game;
  players: Player[];
  currentStory: IStory;
}
