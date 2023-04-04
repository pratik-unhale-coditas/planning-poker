import { Game } from "@/types/game";
import { Player } from "@/types/player";
import { IStory } from "@/types/story";

export interface IStoryProps {
  stories: IStory[] | undefined;
  game: Game;
  selectedStory: IStory | undefined;
  handleStorySelect: any;
  currentPlayerId: string;
  players: Player[];
}
