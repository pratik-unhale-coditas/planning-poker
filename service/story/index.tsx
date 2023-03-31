import { addStoryToGameInStore, getGameFromStore, removeStoryFromGameInStore, updateStoryInStore } from "@/repository/firebase";
import { ulid } from "ulidx";
import { Status } from "@/types/status";
import { IStory } from "@/types/story";
import { Player } from "@/types/player";

export const addStoryToGame = async (gameId: string, storyName: string, players: Player[]) => {
    const game = await getGameFromStore(gameId);
    const values: { [id: string]: null } = {};
    players.forEach((player) =>
        values[player.id] = null
    )

    const newStory = { name: storyName, id: ulid(), average: 0, status: Status.NotStarted, values: values };
    if (game) {
        await addStoryToGameInStore(gameId, newStory);
    }
};

export const removeStory = async (gameId: string, storyId: string) => {
    const game = await getGameFromStore(gameId);
    if (game) {
        await removeStoryFromGameInStore(gameId, storyId);
    }
};

export const finishStory = async (gameId: string, story: IStory) => {
    const filteredValues = Object.values(story.values).filter((n) => n !== -1 && n !== -2) as number[]
    const updatedStory = {
        ...story,
        average: Math.round(filteredValues.reduce((a, c) => a + c) / filteredValues.length),
        status: Status.Finished
    }
    updateStoryInStore(gameId, updatedStory)
}

export const resetStory = async (gameId: string, story: IStory) => {
    const game = await getGameFromStore(gameId);
    let valuesCopy = story.values
    for (let playerId in story.values) {
        valuesCopy[playerId] = null
    }
    if (game) {
        const updatedStory = {
            ...story,
            average: 0,
            status: Status.Started,
            values: valuesCopy
        };
        updateStoryInStore(gameId, updatedStory);
    }
};

export const updatePlayerValue = async (gameId: string, story: IStory, playerId: string, value: number) => {
    const newValues = story.values;
    newValues[playerId] = value;
    const updatedStory = {
        ...story,
        values: newValues,
    };
    await updateStoryInStore(gameId, updatedStory);
    return true
};