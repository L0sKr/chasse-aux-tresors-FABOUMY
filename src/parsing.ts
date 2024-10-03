import fs from 'fs';
import path from 'path';

// import * as fs from "fs";
export type TreasureMap = string[][];
type AdvsInfo = { [key: string]: AdvInfo };
export type AdvInfo = {
  marker: string;
  position: Position;
  orientation: string;
  moves: string;
  collectedTreasures: number;
};
export type Position = { latitude: number; longitude: number };
export type ParsedInfo = {
  treasureMap: TreasureMap;
  adventurersInfo: AdvsInfo;
};

export function parseFileFromPath(filePath: string): ParsedInfo {
  const filePathInDirectory: string = path.join(process.cwd(), filePath);

  const fileContent = fs.readFileSync(filePathInDirectory, 'utf-8');
  const lines = fileContent.split('\n');

  const parsedInfo: ParsedInfo = processLinesInfo(lines);
  return parsedInfo;
}

function processLinesInfo(lines: string[]): ParsedInfo {
  let treasureMap: TreasureMap = [];
  const adventurersInfo: AdvsInfo = {};

  for (const line of lines) {
    const lineInfo: string[] = line.replaceAll(' ', '').split('-');
    const infoType = line[0];

    switch (infoType) {
      case 'C':
        treasureMap = createMap(+lineInfo[1], +lineInfo[2]);
        break;
      case 'M':
        addMountain(treasureMap, +lineInfo[1], +lineInfo[2]);
        break;
      case 'T':
        addTreasures(treasureMap, +lineInfo[1], +lineInfo[2], +lineInfo[3]);
        break;
      case 'A':
        addAdventurer(treasureMap, lineInfo[1], +lineInfo[2], +lineInfo[3]);
        setAdventurerInfos(
          adventurersInfo,
          lineInfo[1],
          +lineInfo[2],
          +lineInfo[3],
          lineInfo[4],
          lineInfo[5],
        );
        break;
    }
  }
  return { treasureMap, adventurersInfo };
}

function createMap(mapWidth: number, mapHeight: number): TreasureMap {
  return Array.from({ length: mapHeight }, () =>
    Array.from({ length: mapWidth }, () => '.'),
  );
}

function addMountain(
  map: TreasureMap,
  longitude: number,
  latitude: number,
): TreasureMap {
  map[latitude][longitude] = 'M';
  return map;
}

function addTreasures(
  map: TreasureMap,
  longitude: number,
  latitude: number,
  nbTreasures: number,
): TreasureMap {
  map[latitude][longitude] = `T(${nbTreasures})`;
  return map;
}

function addAdventurer(
  map: TreasureMap,
  name: string,
  longitude: number,
  latitude: number,
): TreasureMap {
  map[latitude][longitude] = `A(${name})`;
  return map;
}

function setAdventurerInfos(
  infos: AdvsInfo,
  name: string,
  latitude: number,
  longitude: number,
  orientation: string,
  moves: string,
): AdvsInfo {
  infos[name] = { marker: `A(${name})`, position: { latitude, longitude }, orientation, moves, collectedTreasures: 0 };
  return infos;
}
