import fs from 'fs';
import path from 'path';

import { AdvsInfo, HuntInfo, TreasureMap } from './models/game-state';

export function parseFileFromPath(filePath: string): HuntInfo {
  const filePathInDirectory: string = path.join(process.cwd(), filePath);

  const fileContent = fs.readFileSync(filePathInDirectory, 'utf-8');
  const lines = fileContent.split('\n');

  const parsedInfo: HuntInfo = processLinesInfo(lines);
  return parsedInfo;
}

export function processLinesInfo(lines: string[]): HuntInfo {
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
      default:
        break;
    }
  }
  return { map: treasureMap, adventurersInfo };
}

export function createMap(mapWidth: number, mapHeight: number): TreasureMap {
  return Array.from({ length: mapHeight }, () =>
    Array.from({ length: mapWidth }, () => '.'),
  );
}

export function addMountain(
  map: TreasureMap,
  latitude: number,
  longitude: number,
): TreasureMap {
  if (longitude < map.length && latitude < map[0].length)
    map[longitude][latitude] = 'M';
  return map;
}

export function addTreasures(
  map: TreasureMap,
  latitude: number,
  longitude: number,
  nbTreasures: number,
): TreasureMap {
  if (longitude < map.length && latitude < map[0].length && nbTreasures > 0)
    map[longitude][latitude] = `T(${nbTreasures})`;
  return map;
}

export function addAdventurer(
  map: TreasureMap,
  name: string,
  latitude: number,
  longitude: number,
): TreasureMap {
  if (longitude < map.length && latitude < map[0].length)
    map[longitude][latitude] = `A(${name})`;
  return map;
}

export function setAdventurerInfos(
  infos: AdvsInfo,
  name: string,
  latitude: number,
  longitude: number,
  orientation: string,
  moves: string,
): AdvsInfo {
  infos[name] = {
    marker: `A(${name})`,
    position: { latitude, longitude },
    orientation,
    moves,
    collectedTreasures: 0,
  };
  return infos;
}
