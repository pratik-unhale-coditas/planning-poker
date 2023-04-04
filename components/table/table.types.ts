import { Game } from "@/types/game";
import { IStory } from "@/types/story";

export interface ITableProps {
  game: Game;
  currentPlayerId: string;
  currentStory: IStory;
}
