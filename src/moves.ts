import { AdvInfo, HuntInfo, Position, TreasureMap } from './models/game-state';

export type MoveResult = { map: TreasureMap; adventurerInfo: AdvInfo };

export function processAdvMoves(entryInfo: HuntInfo): HuntInfo {
  let map = entryInfo.map;
  const adventurersInfo = entryInfo.adventurersInfo;
  const adventurersNames = Object.keys(adventurersInfo);
  const firstAdv: string = adventurersNames[0];
  const nbOfMoves: number = adventurersInfo[firstAdv].moves.length;

  for (let i = 0; i < nbOfMoves; i++) {
    for (let j = 0; j < adventurersNames.length; j++) {
      const adventurerName: string = adventurersNames[j];
      let adventurerInfo: AdvInfo = adventurersInfo[adventurerName];
      const move = adventurerInfo.moves[i];

      if (move === 'A') {
        const forwardMoveResult = computeForwardMove(map, adventurerInfo);
        map = forwardMoveResult.map;
        adventurerInfo = forwardMoveResult.adventurerInfo;
      } else {
        adventurerInfo = { ...computeTurningMove(adventurerInfo, move) };
      }
      adventurersInfo[adventurerName] = adventurerInfo;
    }
  }

  return { map, adventurersInfo };
}

export function computeForwardMove(
  map: TreasureMap,
  adventurerInfo: AdvInfo,
): MoveResult {
  const newPosition = computeNextPosition(adventurerInfo);
  const newCaseType = map[newPosition.longitude][newPosition.latitude][0];
  let moveResult = { map, adventurerInfo };
  if (newCaseType === '.') {
    moveResult = takeOneStep(
      map,
      adventurerInfo,
      newPosition.longitude,
      newPosition.latitude,
    );
  } else if (newCaseType === 'T') {
    moveResult = collectTreasure(
      map,
      adventurerInfo,
      newPosition.longitude,
      newPosition.latitude,
    );
  }
  return moveResult;
}

export function computeNextPosition(adventurerInfo: AdvInfo): Position {
  let newLon = adventurerInfo.position.longitude;
  let newLat = adventurerInfo.position.latitude;
  switch (adventurerInfo.orientation) {
    case 'N':
      newLon = adventurerInfo.position.longitude - 1;
      newLat = adventurerInfo.position.latitude;
      break;
    case 'O':
      newLon = adventurerInfo.position.longitude;
      newLat = adventurerInfo.position.latitude - 1;
      break;

    case 'S':
      newLon = adventurerInfo.position.longitude + 1;
      newLat = adventurerInfo.position.latitude;
      break;
    case 'E':
      newLon = adventurerInfo.position.longitude;
      newLat = adventurerInfo.position.latitude + 1;
      break;
  }
  return { longitude: newLon, latitude: newLat };
}

export function takeOneStep(
  map: TreasureMap,
  adventurerInfo: AdvInfo,
  newLon: number,
  newLat: number,
): MoveResult {
  map[newLon][newLat] = adventurerInfo.marker;

  const updateMapResult = updatePreviousPosition(map, adventurerInfo);
  map = updateMapResult.map;
  adventurerInfo = updateMapResult.adventurerInfo;

  adventurerInfo.position = {
    longitude: newLon,
    latitude: newLat,
  };

  return { map, adventurerInfo };
}

export function collectTreasure(
  map: TreasureMap,
  adventurerInfo: AdvInfo,
  newLon: number,
  newLat: number,
): MoveResult {
  const numberOfTreasures = map[newLon][newLat][2];

  map[newLon][newLat] =
    +numberOfTreasures === 1
      ? adventurerInfo.marker
      : `AT(${+numberOfTreasures - 1})`;

  const updateMapResult = updatePreviousPosition(map, adventurerInfo);
  map = updateMapResult.map;
  adventurerInfo = updateMapResult.adventurerInfo;

  adventurerInfo.collectedTreasures += 1;
  adventurerInfo.position = {
    longitude: newLon,
    latitude: newLat,
  };

  return { map, adventurerInfo };
}

export function updatePreviousPosition(
  map: TreasureMap,
  adventurerInfo: AdvInfo,
): MoveResult {
  const advPosition = adventurerInfo.position;
  const previousCase = map[advPosition.longitude][advPosition.latitude];

  if (previousCase === adventurerInfo.marker) {
    map[advPosition.longitude][advPosition.latitude] = '.';
  } else if (previousCase[1] === 'T') {
    map[advPosition.longitude][advPosition.latitude] =
      previousCase.substring(1);
  }

  return { map, adventurerInfo };
}

export function computeTurningMove(
  adventurerInfo: AdvInfo,
  direction: string,
): AdvInfo {
  if (direction === 'D') {
    switch (adventurerInfo.orientation) {
      case 'N':
        adventurerInfo.orientation = 'E';
        break;
      case 'E':
        adventurerInfo.orientation = 'S';
        break;
      case 'S':
        adventurerInfo.orientation = 'O';
        break;
      case 'O':
        adventurerInfo.orientation = 'N';
        break;
    }
  } else if (direction === 'G') {
    switch (adventurerInfo.orientation) {
      case 'N':
        adventurerInfo.orientation = 'O';
        break;
      case 'O':
        adventurerInfo.orientation = 'S';
        break;
      case 'S':
        adventurerInfo.orientation = 'E';
        break;
      case 'E':
        adventurerInfo.orientation = 'N';
        break;
    }
  }
  return adventurerInfo;
}
