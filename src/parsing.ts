// import * as fs from "fs";
import * as lineReader from "line-reader";
import path from "path";

export function parseFileFromPath(filePath: string): void {
  const filePathInDirectory: string = path.join(process.cwd(), filePath);
  let treasureMap: string[][];

  lineReader.eachLine(filePathInDirectory, (line: string) => {
    line = line.replaceAll(" - ", "");

    const infoType = line[0];
    switch (infoType) {
      case "C":
        treasureMap = createMap(+line[2], +line[3]);
        console.log(treasureMap);
        break;
      case "M":
        console.log("Mountain info : lat - " + line[2] + ",  lon - " + line[3]);
        break;
      case "T":
        console.log(
          "Treasure info : lat - " +
            line[2] +
            ",  lon - " +
            line[3] +
            ", nb - " +
            line[4]
        );
        break;
    }
  });
}

function createMap(mapWidth: number, mapHeight: number): string[][] {
  return Array.from({ length: mapHeight }, () =>
    Array.from({ length: mapWidth }, () => ".")
  );
}
