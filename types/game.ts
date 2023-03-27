import { Status } from "./status";

export interface Game {
  id: string;
  name: string;
  // average: number;
  // gameStatus: Status;
  gameType?: GameType | GameType.Fibonacci;
  createdBy: string;
  createdById: string;
  createdAt: Date;
  updatedAt?: Date;
}

export interface NewGame {
  name: string;
  gameType: string;
  createdByName: string;
  createdById: string;
  createdAt: Date;
}

export enum GameType {
  Fibonacci = "Fibonacci",
  PowersOfTwo = "PowersOfTwo",
  TShirt = "TShirt",
}
