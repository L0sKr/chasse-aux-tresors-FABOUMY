import * as fs from 'fs';

import { AdvsInfo, HuntInfo, TreasureMap } from './models/game-state';

export function writeHuntOutput(huntResult: HuntInfo): void {
  const huntOutput: string = formatHuntResult(huntResult);

  fs.writeFileSync('treasureHuntResult.txt', huntOutput);
}

export function formatHuntResult(huntResult: HuntInfo): string {
  let huntOutput: string;
  huntOutput = `C - ${huntResult.map[0].length} - ${huntResult.map.length}\n`;
  huntOutput += retrieveMountainInfoFromMap(huntResult.map);
  huntOutput += retrieveTreasureInfoFromMap(huntResult.map);
  huntOutput += retrieveAdventurersInfo(huntResult.adventurersInfo);

  return huntOutput;
}

export function retrieveMountainInfoFromMap(map: TreasureMap): string {
  let mountainInfo: string = '';
  for (let latitude = 0; latitude < map.length; latitude++) {
    for (let longitude = 0; longitude < map[latitude].length; longitude++) {
      if (map[latitude][longitude][0] === 'M')
        mountainInfo += `M - ${longitude} - ${latitude}\n`;
    }
  }

  return mountainInfo;
}

export function retrieveTreasureInfoFromMap(map: TreasureMap): string {
  let treasureInfo: string = '';
  for (let latitude = 0; latitude < map.length; latitude++) {
    for (let longitude = 0; longitude < map[latitude].length; longitude++) {
      if (map[latitude][longitude][0] === 'T')
        treasureInfo += `T - ${longitude} - ${latitude} - ${map[latitude][longitude][2]}\n`;
      else if (map[latitude][longitude].slice(0, 2) === 'AT')
        treasureInfo += `T - ${longitude} - ${latitude} - ${map[latitude][longitude][3]}\n`;
    }
  }

  return treasureInfo;
}

export function retrieveAdventurersInfo(adventurersInfo: AdvsInfo): string {
  let adventurersResultInfo: string = '';
  const adventurersNames = Object.keys(adventurersInfo);

  for (const adventurerName of adventurersNames) {
    const adventurerInfo = adventurersInfo[adventurerName];
    adventurersResultInfo += `A - ${adventurerName} - ${adventurerInfo.position.latitude} - ${adventurerInfo.position.longitude} - ${adventurerInfo.orientation} - ${adventurerInfo.collectedTreasures}\n`;
  }

  return adventurersResultInfo;
}
