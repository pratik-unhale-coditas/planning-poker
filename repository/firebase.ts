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
import { omit } from "lodash";

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
