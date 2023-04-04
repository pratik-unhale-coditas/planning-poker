import { Game } from "@/types/game";

export interface ISavedGameCardProps {
  recentGame: Game;
  handleRemoveGame: () => void;
}
