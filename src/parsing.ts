// import * as fs from "fs";
import * as lineReader from "line-reader";
import path from "path";

export function parseFileFromPath(filePath: string): void {
  const filePathInDirectory: string = path.join(process.cwd(), filePath);
  let treasureMap: string[][] = [[]];
  const advInfos: AdvInfos = {};

  lineReader.eachLine(filePathInDirectory, (line: string) => {
    const lineInfo: string[] = line.replaceAll(" ", "").split("-");
    const infoType = line[0];

    switch (infoType) {
      case "C":
        treasureMap = createMap(+lineInfo[1], +lineInfo[2]);
        break;
      case "M":
        treasureMap = addMountain(treasureMap, +lineInfo[1], +lineInfo[2]);
        break;
      case "T":
        treasureMap = addTreasures(
          treasureMap,
          +lineInfo[1],
          +lineInfo[2],
          +lineInfo[3]
        );
        break;
      case "A":
        treasureMap = addAdventurer(
          treasureMap,
          lineInfo[1],
          +lineInfo[2],
          +lineInfo[3]
        );
        setAdventurerInfos(advInfos, lineInfo[1], lineInfo[4], lineInfo[5]);
        break;
    }
    console.log(treasureMap);
    console.log(advInfos);
  });
}

function createMap(mapWidth: number, mapHeight: number): string[][] {
  return Array.from({ length: mapHeight }, () =>
    Array.from({ length: mapWidth }, () => ".")
  );
}

function addMountain(
  map: string[][],
  longitude: number,
  latitude: number
): string[][] {
  map[latitude][longitude] = "M";
  return map;
}

function addTreasures(
  map: string[][],
  longitude: number,
  latitude: number,
  nbTreasures: number
): string[][] {
  map[latitude][longitude] = `T(${nbTreasures})`;
  return map;
}

function addAdventurer(
  map: string[][],
  name: string,
  longitude: number,
  latitude: number
): string[][] {
  map[latitude][longitude] = `A(${name})`;
  return map;
}

type AdvInfos = { [key: string]: AdvInfo };
type AdvInfo = { orientation: string; moves: string };

function setAdventurerInfos(
  infos: AdvInfos,
  name: string,
  orientation: string,
  moves: string
): AdvInfos {
  infos[name] = { orientation, moves };
  return infos;
}
