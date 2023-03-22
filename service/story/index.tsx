import { addStoryToGameInStore, getGameFromStore } from "@/repository/firebase";
import { ulid } from "ulidx";

export const addStoryToGame = async (gameId: string, storyName: string) => {
    const game = await getGameFromStore(gameId);
    const newStory = { name: storyName, id: ulid(), average: 0 };
    if (game) {
        await addStoryToGameInStore(gameId, newStory);
    }
};

