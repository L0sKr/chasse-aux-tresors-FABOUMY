import { AdvInfo, ParsedInfo, Position, TreasureMap } from './parsing';

// TODO: Pour un aventurier :
// Avancer dans la bonne direction - ok
// Changer de direction - ok
// Avancer après un changement de direction - ok
// Ne pas avancer si M - ok
// Décrémenter Trésors de la carte + compteur si trésor - ok
// -> Si T(0) passer à un . - ok
// compter les trésors par aventurier - ok

// TODO: Pour x aventuriers :
// Si A dans la case, vérifier que A.name différent de current - ok
// Process un à un - ok
// -> En partant du principe que les aventuriers ont le même nombre dec déplacements
// Si case M ou A: rester bloqué - ok

type MoveResult = { map: TreasureMap; adventurerInfo: AdvInfo };

export function processAdvMoves(entryInfo: ParsedInfo): void {
  let map = entryInfo.treasureMap;
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
        const forwardMoveResult = computeForwardMove(
          map,
          adventurerInfo,
        );
        map = forwardMoveResult.map;
        adventurerInfo = forwardMoveResult.adventurerInfo;
      } else {
        adventurerInfo = { ...computeTurningMove(adventurerInfo, move) };
      }
      adventurersInfo[adventurerName] = adventurerInfo;
    }
  }
  
  console.log(map);
  console.log(adventurersInfo);
}

function computeForwardMove(
  map: TreasureMap,
  adventurerInfo: AdvInfo,
): MoveResult {
  const newPosition = computeNextPosition(adventurerInfo.orientation, adventurerInfo.position);
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

function computeNextPosition(
  orientation: string,
  advPosition: Position,
): Position {
  let newLon = advPosition.longitude;
  let newLat = advPosition.latitude;
  switch (orientation) {
    case 'N':
      newLon = advPosition.longitude - 1;
      newLat = advPosition.latitude;
      break;
    case 'O':
      newLon = advPosition.longitude;
      newLat = advPosition.latitude - 1;
      break;

    case 'S':
      newLon = advPosition.longitude + 1;
      newLat = advPosition.latitude;
      break;
    case 'E':
      newLon = advPosition.longitude;
      newLat = advPosition.latitude + 1;
      break;
  }
  return { longitude: newLon, latitude: newLat };
}

function takeOneStep(
  map: TreasureMap,
  adventurerInfo: AdvInfo,
  newLon: number,
  newLat: number,
): MoveResult {
  const advPosition = {...adventurerInfo.position};

  map[newLon][newLat] = adventurerInfo.marker;

  //TODO: Sortir dans une fonction
  if (map[advPosition.longitude][advPosition.latitude][0] !== 'T') {
    map[advPosition.longitude][advPosition.latitude] = '.';
  }
  if (map[advPosition.longitude][advPosition.latitude][0] === 'A') {
    map[advPosition.longitude][advPosition.latitude] = (map[advPosition.longitude][advPosition.latitude]).substring(1);
  }
  //TODO: Sortir dans une fonction

  adventurerInfo.position = {
    longitude: newLon,
    latitude: newLat,
  };
  return { map, adventurerInfo };
}

function collectTreasure(
  map: TreasureMap,
  adventurerInfo: AdvInfo,
  newLon: number,
  newLat: number,
): MoveResult {
  const numberOfTreasures = map[newLon][newLat][2];
  const advPosition = adventurerInfo.position;
  
  //TODO: Sortir dans une fonction
  const previousCase = map[advPosition.longitude][advPosition.latitude];
  if (previousCase[0] !== 'T' && previousCase === adventurerInfo.marker) {
    map[advPosition.longitude][advPosition.latitude] = '.';
  }
  if (previousCase[0] === 'A' && previousCase[1] === 'T') {
    map[advPosition.longitude][advPosition.latitude] = (map[advPosition.longitude][advPosition.latitude]).substring(1);
  }
  //TODO: Sortir dans une fonction 

  map[newLon][newLat] =
    +numberOfTreasures === 1 ? adventurerInfo.marker : `AT(${+numberOfTreasures - 1})`;

  adventurerInfo.collectedTreasures += 1;
  adventurerInfo.position = {
    longitude: newLon,
    latitude: newLat,
  };
  return { map, adventurerInfo };
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
