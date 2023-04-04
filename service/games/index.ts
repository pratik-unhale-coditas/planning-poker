import {
  addGameToStore,
  addPlayerToGameInStore,
  getGameFromStore,
  removeGameFromStore,
  streamData,
  streamPlayersFromStore,
  updateGameDataInStore,
  updateUserGamesInStore,
} from "@/repository/firebase";
import { NewGame } from "@/types/game";
import { ulid } from "ulidx";

export const addNewGame = async (newGame: NewGame): Promise<string> => {
  const player = {
    name: newGame.createdByName,
    id: newGame.createdById,
  };

  const gameData = {
    ...newGame,
    id: ulid(),
    createdById: player.id,
  };

  await addGameToStore(gameData.id, gameData);
  await addPlayerToGameInStore(gameData.id, player);
  await updateUserGamesInStore(newGame.createdById, gameData.id);
  return gameData.id;
};

export const getGame = (id: string) => {
  return getGameFromStore(id);
};

export const streamGame = (id: string) => {
  return streamData(id);
};

export const streamPlayers = (id: string) => {
  return streamPlayersFromStore(id);
};

export const updateGame = async (
  gameId: string,
  updatedGame: any
): Promise<boolean> => {
  await updateGameDataInStore(gameId, updatedGame);
  return true;
};

export const removeGame = async (gameId: string) => {
  await removeGameFromStore(gameId);
};
