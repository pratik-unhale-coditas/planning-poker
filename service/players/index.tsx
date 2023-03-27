import { addPlayerToGameInStore, getGameFromStore, getPlayerFromStore, getPlayersFromStore, getStoriesFromStore, removePlayerFromGameInStore, updatePlayerInStore, updateStoryInStore } from "@/repository/firebase";
import { getPlayerGamesFromCache, updatePlayerGamesInCache } from "@/repository/localStorage";
import { Game } from "@/types/game";
import { Player, PlayerGame } from "@/types/player";
import { ulid } from "ulidx";


export const addPlayer = async (gameId: string, player: Player) => {
    const game = await getGameFromStore(gameId);
    if (game) {
        addPlayerToGameInStore(gameId, player);
    }
};

export const removePlayer = async (gameId: string, playerId: string) => {
    const game = await getGameFromStore(gameId);
    if (game) {
        removePlayerFromGameInStore(gameId, playerId);
    }
};


export const getPlayerRecentGames = async (): Promise<Game[]> => {
    let playerGames: PlayerGame[] = getPlayerGamesFromCache();
    let games: Game[] = [];

    await Promise.all(
        playerGames.map(async (playerGame: PlayerGame) => {
            const game = await getGameFromStore(playerGame.gameId);

            if (game) {
                const player = await getPlayerFromStore(game.id, playerGame.playerId);
                player && games.push(game);
            }
        })
    );

    games.sort((a: Game, b: Game) => +b.createdAt - +a.createdAt);
    return games;
};

export const getCurrentPlayerId = (gameId: string): string | undefined => {
    let playerGames: PlayerGame[] = getPlayerGamesFromCache();

    const game = playerGames.find((playerGame) => playerGame.gameId === gameId);

    return game && game.playerId;
};



export const isCurrentPlayerInGame = async (gameId: string): Promise<boolean> => {
    const playerGames = getPlayerGamesFromCache();
    const found = playerGames.find((playerGames) => playerGames.gameId === gameId);
    if (found) {
        const player = await getPlayerFromStore(found.gameId, found.playerId);

        //Remove game from cache is player is no longer in the game
        if (!player) {
            removeGameFromCache(found.gameId);
            return false;
        }
        return true;
    }
    return false;
};

export const isPlayerInGameStore = async (gameId: string, playerId: string) => {
    const player = await getPlayerFromStore(gameId, playerId);
    return player ? true : false;
};

export const updatePlayerGames = (gameId: string, playerId: string) => {
    let playerGames: PlayerGame[] = getPlayerGamesFromCache();

    playerGames.push({ gameId, playerId });

    updatePlayerGamesInCache(playerGames);
};

export const removeGameFromCache = (gameId: string) => {
    const playerGames = getPlayerGamesFromCache();
    updatePlayerGamesInCache(playerGames.filter((playerGame) => playerGame.gameId !== gameId));
};

export const addPlayerToGame = async (gameId: string, playerName: string): Promise<boolean> => {
    const joiningGame = await getGameFromStore(gameId);

    if (!joiningGame) {
        console.log('Game not found');
        return false;
    }
    const newPlayer = { name: playerName, id: ulid() };

    updatePlayerGames(gameId, newPlayer.id);
    await addPlayerToGameInStore(gameId, newPlayer);

    const stories = await getStoriesFromStore(gameId);

    stories.forEach((story) => {
        let newStory = story
        newStory.values[newPlayer.id] = null
        updateStoryInStore(gameId, newStory)
    })

    return true;
};

// export const resetPlayers = async (gameId: string) => {
//     const players = await getPlayersFromStore(gameId);

//     players.forEach(async (player) => {
//         const updatedPlayer: Player = {
//             ...player,
//             status: Status.NotStarted,
//             value: 0,
//         };
//         await updatePlayerInStore(gameId, updatedPlayer);
//     });
// };

// export const getPlayerRecentGamesFromStore = async (): Promise<Game[]> => {
//     let playerGames: PlayerGame[] = getPlayerGamesFromCache();
//     let games: Game[] = [];

//     await Promise.all(
//         playerGames.map(async (playerGame: PlayerGame) => {
//             const game = await getGameFromStore(playerGame.gameId);

//             if (game) {
//                 const player = await getPlayerFromStore(game.id, playerGame.playerId);
//                 player && games.push(game);
//             }
//         })
//     );

//     games.sort((a: Game, b: Game) => +b.createdAt - +a.createdAt);
//     return games;
// };