export type HuntInfo = {
  map: TreasureMap;
  adventurersInfo: AdvsInfo;
};

export type TreasureMap = string[][];

export type AdvsInfo = { [key: string]: AdvInfo };

export type AdvInfo = {
  marker: string;
  position: Position;
  orientation: string;
  moves: string;
  collectedTreasures: number;
};

export type Position = { latitude: number; longitude: number };
