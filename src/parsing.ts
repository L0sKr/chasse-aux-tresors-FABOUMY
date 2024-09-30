// import * as fs from "fs";
import * as lineReader from "line-reader";
import path from "path";

export function parseFileFromPath(filePath: string): void {
  const filePathInDirectory: string = path.join(process.cwd(), filePath);
  let treasureMap: string[][] = [[]];

  lineReader.eachLine(filePathInDirectory, (line: string) => {
    line = line.replaceAll(" - ", "");

    const infoType = line[0];
    switch (infoType) {
      case "C":
        treasureMap = createMap(+line[2], +line[3]);
        break;
      case "M":
        addMountain(treasureMap, +line[2], +line[3]);
        break;
      case "T":
        addTreasures(treasureMap, +line[2], +line[3], +line[4]);
        break;
    }
    console.log(treasureMap);
  });
  // console.log(treasureMap);
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
  map[longitude][latitude] = "M";
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
