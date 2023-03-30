export interface Game {
  id: string;
  name: string;
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
