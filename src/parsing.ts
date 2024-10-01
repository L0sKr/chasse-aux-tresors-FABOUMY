import fs from 'fs';
import path from 'path';

// import * as fs from "fs";
type Map = string[][];
type AdvsInfo = { [key: string]: AdvInfo };
type AdvInfo = { orientation: string; moves: string };
export type ParsedInfo = {
  treasureMap: Map;
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
  let treasureMap: Map = [];
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
          lineInfo[4],
          lineInfo[5],
        );
        break;
    }
  }
  return { treasureMap, adventurersInfo };
}

function createMap(mapWidth: number, mapHeight: number): Map {
  return Array.from({ length: mapHeight }, () =>
    Array.from({ length: mapWidth }, () => '.'),
  );
}

function addMountain(map: Map, longitude: number, latitude: number): Map {
  map[latitude][longitude] = 'M';
  return map;
}

function addTreasures(
  map: Map,
  longitude: number,
  latitude: number,
  nbTreasures: number,
): Map {
  map[latitude][longitude] = `T(${nbTreasures})`;
  return map;
}

function addAdventurer(
  map: Map,
  name: string,
  longitude: number,
  latitude: number,
): Map {
  map[latitude][longitude] = `A(${name})`;
  return map;
}

function setAdventurerInfos(
  infos: AdvsInfo,
  name: string,
  orientation: string,
  moves: string,
): AdvsInfo {
  infos[name] = { orientation, moves };
  return infos;
}
