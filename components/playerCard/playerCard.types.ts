import { Game } from "@/types/game";
import { Player } from "@/types/player";
import { IStory } from "@/types/story";

export interface IPlayerCardProps {
  game: Game;
  player: Player;
  currentStory: IStory;
}
