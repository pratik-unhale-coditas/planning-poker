// Import the functions you need from the SDKs you need
import { initializeApp, getApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import {
  collection,
  deleteDoc,
  getDoc,
  getDocs,
  getFirestore,
  updateDoc,
} from "firebase/firestore";
import { Game } from "../types/game";
import { Player } from "../types/player";
import { doc, setDoc } from "firebase/firestore";
import { IStory } from "@/types/story";

const firebaseConfig = {
  apiKey: "AIzaSyBsmR6Rr1UbvfIZyR2FHBNqNByVTjSfzEo",
  authDomain: "planning-poker-7a973.firebaseapp.com",
  projectId: "planning-poker-7a973",
  storageBucket: "planning-poker-7a973.appspot.com",
  messagingSenderId: "506854053336",
  appId: "1:506854053336:web:f70cb59fbab30ba51e8ead",
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);
export const db = getFirestore(app);

////////////////////////////////////////////////////////////////////////////////////////////////////////////

const gamesCollectionName = "games";
const playersCollectionName = "players";
const storyCollectionName = "stories";
const usersCollectionName = "users";

export const addGameToStore = async (gameId: string, data: any) => {
  await setDoc(doc(db, gamesCollectionName, gameId), data);
  return true;
};

export const getGameFromStore = async (
  id: string
): Promise<Game | undefined> => {
  const docRef = doc(db, gamesCollectionName, id);
  const docSnap = await getDoc(docRef);
  let game = undefined;
  if (docSnap.exists()) {
    game = docSnap.data();
  }
  return game as Game;
};

export const getPlayersFromStore = async (
  gameId: string
): Promise<Player[]> => {
  const playersRef = collection(
    db,
    gamesCollectionName,
    gameId,
    playersCollectionName
  );
  const playerDocs = await getDocs(playersRef);
  const players: Player[] = [];
  playerDocs.forEach((doc) => {
    const player = doc.data() as Player;
    players.push(player);
  });
  return players;
};

export const getStoriesFromStore = async (
  gameId: string
): Promise<IStory[]> => {
  const storiesRef = collection(
    db,
    gamesCollectionName,
    gameId,
    storyCollectionName
  );
  const storyDocs = await getDocs(storiesRef);
  const stories: IStory[] = [];
  storyDocs.forEach((doc) => {
    const story = doc.data() as IStory;
    stories.push(story);
  });
  return stories;
};

export const getPlayerFromStore = async (
  gameId: string,
  playerId: string
): Promise<Player | undefined> => {
  const docRef = doc(
    db,
    gamesCollectionName,
    gameId,
    playersCollectionName,
    playerId
  );
  const docSnap = await getDoc(docRef);
  let player = undefined;
  if (docSnap.exists()) {
    player = docSnap.data();
  }
  return player as Player;
};

export const streamData = (id: string) => {
  return doc(db, gamesCollectionName, id);
};

export const streamPlayersFromStore = (id: string) => {
  return doc(db, `${gamesCollectionName}/${id}/${playersCollectionName}`);
};
export const streamStoriesFromStore = (id: string) => {
  return doc(db, `${gamesCollectionName}/${id}/${storyCollectionName}`);
};

export const updateGameDataInStore = async (
  gameId: string,
  data: any
): Promise<boolean> => {
  await updateDoc(doc(db, gamesCollectionName, gameId), data);
  return true;
};

export const addPlayerToGameInStore = async (
  gameId: string,
  player: Player
) => {
  await setDoc(
    doc(db, gamesCollectionName, gameId, playersCollectionName, player.id),
    player
  );
  return true;
};
export const addStoryToGameInStore = async (gameId: string, story: IStory) => {
  await setDoc(
    doc(db, gamesCollectionName, gameId, storyCollectionName, story.id),
    story
  );
  return true;
};
export const removeStoryFromGameInStore = async (
  gameId: string,
  storyId: string
) => {
  await deleteDoc(
    doc(db, gamesCollectionName, gameId, storyCollectionName, storyId)
  );
  return true;
};

export const removePlayerFromGameInStore = async (
  gameId: string,
  playerId: string
) => {
  await deleteDoc(
    doc(db, gamesCollectionName, gameId, playersCollectionName, playerId)
  );
  return true;
};

export const updatePlayerInStore = async (gameId: string, player: Player) => {
  const playerData = {
    ...player,
    id: player.id,
  };
  await updateDoc(
    doc(db, gamesCollectionName, gameId, playersCollectionName, player.id),
    playerData
  );
  return true;
};

export const updateStoryInStore = async (gameId: string, story: IStory) => {
  const storyData = {
    ...story,
    id: story.id,
  };
  await updateDoc(
    doc(db, gamesCollectionName, gameId, storyCollectionName, story.id),
    storyData
  );
  return true;
};

export const removeGameFromStore = async (gameId: string) => {
  const gameRef = doc(db, gamesCollectionName, gameId);
  await deleteDoc(gameRef);

  const playersRef = collection(
    db,
    gamesCollectionName,
    gameId,
    playersCollectionName
  );
  const playerDocs = await getDocs(playersRef);
  playerDocs.forEach((doc) => deleteDoc(doc.ref));

  return true;
};

////////////////////////////////////////
export const getUserFromStore = async (userId: string) => {
  const docRef = doc(db, usersCollectionName, userId);
  const docSnap = await getDoc(docRef);
  let user = undefined;
  if (docSnap.exists()) {
    user = docSnap.data();
  }
  return user;
};

export const updateUserGamesInStore = async (
  userId: string,
  gameId: string
) => {
  const user = await getUserFromStore(userId);
  const newGames = user?.games ? user?.games.push(gameId) : [gameId];
  const userData = {
    ...user,
    games: newGames,
  };
  await updateDoc(doc(db, usersCollectionName, userId), userData);
};
