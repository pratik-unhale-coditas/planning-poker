import { addPlayerToGameInStore, getGameFromStore, getPlayerFromStore, getStoriesFromStore, getUserFromStore, removePlayerFromGameInStore, updateStoryInStore } from "@/repository/firebase";
import { Game } from "@/types/game";
import { Player } from "@/types/player";
import { Status } from "@/types/status";
import { IStory } from "@/types/story";
import { finishStory } from "../story";


export const addPlayer = async (gameId: string, player: Player) => {
    const game = await getGameFromStore(gameId);
    if (game) {
        addPlayerToGameInStore(gameId, player);
    }
};

export const removePlayer = async (gameId: string, playerId: string, newStory: IStory) => {
    const game = await getGameFromStore(gameId);
    if (game) {
        removePlayerFromGameInStore(gameId, playerId);
        updateStoryInStore(gameId, newStory)
        if (newStory.status === Status.Finished) {
            finishStory(gameId, newStory)
        }
    }
};

export const isPlayerInGameStore = async (gameId: string, playerId: string) => {
    if (!playerId) {
        return false
    }
    const player = await getPlayerFromStore(gameId, playerId);
    return player ? true : false;
};


export const addPlayerToGame = async (gameId: string, newPlayer: Player): Promise<boolean> => {
    const joiningGame = await getGameFromStore(gameId);

    if (!joiningGame) {
        return false;
    }

    await addPlayerToGameInStore(gameId, newPlayer);

    const stories = await getStoriesFromStore(gameId);

    stories.forEach((story) => {
        let newStory = story
        newStory.values[newPlayer.id] = null
        updateStoryInStore(gameId, newStory)
    })

    return true;
};


export const getPlayerRecentGamesFromStore = async (userId: string) => {
    let games: Game[] = [];

    let player = await getUserFromStore(userId);

    let playerGames = player?.games as [string]

    if (playerGames) {
        await Promise.all(
            playerGames.map(async (playerGame: string) => {
                const game = await getGameFromStore(playerGame);

                if (game) {
                    games.push(game);
                }
            })
        );

        games.sort((a: Game, b: Game) => +b.createdAt - +a.createdAt);
        return games;
    }
};