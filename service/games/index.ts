import {
  addGameToStore,
  addPlayerToGameInStore,
  getGameFromStore,
  getPlayersFromStore,
  removeGameFromStore,
  streamData,
  streamPlayersFromStore,
  updateGameDataInStore,
  updateUserGamesInStore,
} from "@/repository/firebase";
import { NewGame } from "@/types/game";
import { Status } from "@/types/status";
// import { updatePlayerGames } from "../players";
import { ulid } from "ulidx";
import { Player } from "@/types/player";

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
  // updatePlayerGames(gameData.id, player.id);
  await updateUserGamesInStore(newGame.createdById, gameData.id);
  return gameData.id;
};

export const streamGame = (id: string) => {
  return streamData(id);
};

export const streamPlayers = (id: string) => {
  return streamPlayersFromStore(id);
};

export const getGame = (id: string) => {
  return getGameFromStore(id);
};

export const updateGame = async (
  gameId: string,
  updatedGame: any
): Promise<boolean> => {
  await updateGameDataInStore(gameId, updatedGame);
  return true;
};

// export const resetGame = async (gameId: string) => {
//   const game = await getGameFromStore(gameId);
//   if (game) {
//     const updatedGame = {
//       average: 0,
//       gameStatus: Status.Started,
//     };
//     updateGame(gameId, updatedGame);
//     await resetPlayers(gameId);
//   }
// };

// export const finishGame = async (gameId: string) => {
//   const game = await getGameFromStore(gameId);
//   const players = await getPlayersFromStore(gameId);

//   if (game && players) {
//     const updatedGame = {
//       average: getAverage(players),
//       gameStatus: Status.Finished,
//     };
//     updateGame(gameId, updatedGame);
//   }
// };

// export const getGameStatus = (players: Player[]): Status => {
//   let numberOfPlayersPlayed = 0;
//   players.forEach((player: Player) => {
//     if (player.status === Status.Finished) {
//       numberOfPlayersPlayed++;
//     }
//   });
//   if (numberOfPlayersPlayed === 0) {
//     return Status.Started;
//   }
//   return Status.InProgress;
// };

// export const updateGameStatus = async (gameId: string): Promise<boolean> => {
//   const game = await getGame(gameId);
//   if (!game) {
//     console.log("Game not found");
//     return false;
//   }
//   const players = await getPlayersFromStore(gameId);
//   if (players) {
//     const status = getGameStatus(players);
//     const dataToUpdate = {
//       gameStatus: status,
//     };
//     const result = await updateGameDataInStore(gameId, dataToUpdate);
//     return result;
//   }
//   return false;
// };

export const removeGame = async (gameId: string) => {
  await removeGameFromStore(gameId);
};
