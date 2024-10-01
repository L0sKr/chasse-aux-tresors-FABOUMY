import { AdvInfo, ParsedInfo, Position, TreasureMap } from './parsing';

// TODO: Pour un aventurier :
// Avancer dans la bonne direction - ok
// Changer de direction - ok
// Avancer après un changement de direction - ok
// Ne pas avancer si M - ok
// Décrémenter Trésors de la carte + compteur si trésor - ok
// -> Si T(0) passer à un . - ok
// compter les trésors par aventurier

// TODO: Pour x aventuriers :
// Process un à un
// Si case M ou A: rester bloqué

type MoveResult = { map: TreasureMap; advPosition: Position };

export function processAdvMoves(entryInfo: ParsedInfo): void {
  const firstAdv: string = Object.keys(entryInfo.adventurersInfo)[0];
  let map = entryInfo.treasureMap;
  let adventurerInfo: AdvInfo = entryInfo.adventurersInfo[firstAdv];
  const advMoves = adventurerInfo.moves;
  let advPosition = adventurerInfo.position;
  const advMarker = map[advPosition.latitude][advPosition.longitude];

  for (const move of advMoves) {
    if (move === 'A') {
      const forwardMoveResult = computeForwardMove(
        map,
        adventurerInfo.orientation,
        advPosition,
        advMarker,
      );
      map = forwardMoveResult.map;
      advPosition = forwardMoveResult.advPosition;

      //   console.log(map);
    } else {
      //   console.log('coucou');
      //   console.log(adventurerInfo.orientation);
      adventurerInfo = { ...computeTurningMove(adventurerInfo, move) };
      //   console.log(adventurerInfo.orientation);
    }
  }
  console.log(map);
  console.log(advPosition);
}

function computeForwardMove(
  map: TreasureMap,
  orientation: string,
  advPosition: Position,
  advMarker: string,
): MoveResult {
  const newPosition = computeNextPosition(orientation, advPosition);
  const newCaseType = map[newPosition.latitude][newPosition.longitude][0];
  let moveResult = { map, advPosition };
  if (newCaseType === '.') {
    moveResult = takeOneStep(
      map,
      advPosition,
      newPosition.latitude,
      newPosition.longitude,
      advMarker,
    );
  } else if (newCaseType === 'T') {
    moveResult = collectTreasure(
      map,
      advPosition,
      newPosition.latitude,
      newPosition.longitude,
    );
  }
  return moveResult;
}

function computeNextPosition(
  orientation: string,
  advPosition: Position,
): Position {
  let newLat = advPosition.latitude;
  let newLon = advPosition.longitude;
  switch (orientation) {
    case 'N':
      newLat = advPosition.latitude - 1;
      newLon = advPosition.longitude;
      break;
    case 'O':
      newLat = advPosition.latitude;
      newLon = advPosition.longitude - 1;
      break;

    case 'S':
      newLat = advPosition.latitude + 1;
      newLon = advPosition.longitude;
      break;
    case 'E':
      newLat = advPosition.latitude;
      newLon = advPosition.longitude + 1;
      break;
  }
  //   console.log(advPosition.latitude, advPosition.longitude);
  //   console.log(newLat, newLon);
  return { latitude: newLat, longitude: newLon };
}

function takeOneStep(
  map: TreasureMap,
  advPosition: Position,
  newLat: number,
  newLon: number,
  advMarker: string,
): MoveResult {
  if (map[advPosition.latitude][advPosition.longitude][0] !== 'T')
    map[advPosition.latitude][advPosition.longitude] = '.';
  map[newLat][newLon] = advMarker;

  advPosition = {
    latitude: newLat,
    longitude: newLon,
  };
  return { map, advPosition };
}

function collectTreasure(
  map: TreasureMap,
  advPosition: Position,
  newLat: number,
  newLon: number,
): MoveResult {
  const numberOfTreasures = map[newLat][newLon][2];
  //   console.log(numberOfTreasures);
  //   console.log(advPosition.latitude, advPosition.longitude);
  //   console.log(newLat, newLon);
  if (map[advPosition.latitude][advPosition.longitude][0] !== 'T')
    map[advPosition.latitude][advPosition.longitude] = '.';
  map[newLat][newLon] =
    +numberOfTreasures === 1 ? '.' : `T(${+numberOfTreasures - 1})`;

  advPosition = {
    latitude: newLat,
    longitude: newLon,
  };
  return { map, advPosition };
}

function computeTurningMove(
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
