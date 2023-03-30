import { Player } from "@/types/player";

export interface IAddStoryModal {
  handleCloseModal: () => void;
  gameId: string;
  players: Player[];
}
