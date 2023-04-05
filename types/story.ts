import { Status } from "./status";

export interface IStory {
  name: string;
  id: string;
  average: number | null;
  status: Status;
  values: IStoryValue;
}

export interface IStoryValue {
  [id: string]: number | null;
}
