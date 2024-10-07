import { AdvInfo, AdvsInfo, HuntInfo, TreasureMap } from 'src/models/game-state';

import {
  collectTreasure,
  computeForwardMove,
  computeNextPosition,
  computeTurningMove,
  MoveResult,
  processAdvMoves,
  takeOneStep,
  updatePreviousPosition,
} from '../moves';

describe('processAdvMoves', () => {
  it('should process moves of all the adventurers and update their info (positions, orientations and number of collected treasures', () => {
    const map: TreasureMap = [
      ['.', 'M', '.'],
      ['.', 'A(Lara)', 'M'],
      ['.', 'A(Tom)', '.'],
      ['T(2)', 'T(3)', '.'],
    ];

    const adventurersInfo: AdvsInfo = {
      Tom: {
        marker: 'A(Tom)',
        position: { latitude: 1, longitude: 2 },
        orientation: 'E',
        moves: 'ADADAADAA',
        collectedTreasures: 0,
      },
      Lara: {
        marker: 'A(Lara)',
        position: { latitude: 1, longitude: 1 },
        orientation: 'S',
        moves: 'AADADAGGA',
        collectedTreasures: 0,
      },
    };
    const expectedAdventurersInfo: AdvsInfo = {
      Tom: {
        marker: 'A(Tom)',
        position: { longitude: 1, latitude: 1 },
        orientation: 'N',
        moves: 'ADADAADAA',
        collectedTreasures: 1,
      },
      Lara: {
        marker: 'A(Lara)',
        position: { longitude: 3, latitude: 0 },
        orientation: 'S',
        moves: 'AADADAGGA',
        collectedTreasures: 3,
      },
    };
    const expectedMap: TreasureMap = [
      ['.', 'M', '.'],
      ['.', 'A(Tom)', 'M'],
      ['.', '.', '.'],
      ['A(Lara)', 'T(1)', '.'],
    ];

    const huntResult: HuntInfo = processAdvMoves({ map, adventurersInfo });

    expect(huntResult.map).toEqual(expectedMap);
    expect(huntResult.adventurersInfo).toEqual(expectedAdventurersInfo);
  });
});

describe('computeForwardMove', () => {
  it('should compute adventurer next position when they are not collecting a treasure, update their info (position) and the map', () => {
    const map: TreasureMap = [
      ['.', 'M', '.'],
      ['.', 'A(Lara)', 'M'],
      ['.', 'A(Tom)', '.'],
      ['T(2)', 'T(3)', '.'],
    ];

    const adventurerInfo: AdvInfo = {
      marker: 'A(Tom)',
      position: { latitude: 1, longitude: 2 },
      orientation: 'E',
      moves: 'ADADAADAA',
      collectedTreasures: 0,
    };
    const expectedAdventurerInfo: AdvInfo = {
      marker: 'A(Tom)',
      position: { latitude: 2, longitude: 2 },
      orientation: 'E',
      moves: 'ADADAADAA',
      collectedTreasures: 0,
    };
    const expectedMap: TreasureMap = [
      ['.', 'M', '.'],
      ['.', 'A(Lara)', 'M'],
      ['.', '.', 'A(Tom)'],
      ['T(2)', 'T(3)', '.'],
    ];

    const moveResult: MoveResult = computeForwardMove(map, adventurerInfo);

    expect(moveResult.map).toEqual(expectedMap);
    expect(moveResult.adventurerInfo).toEqual(expectedAdventurerInfo);
  });
  it('should compute adventurer next position when they are collecting a treasure, update their info (position, treasure) and the map', () => {
    const map: TreasureMap = [
      ['.', 'M', '.'],
      ['.', 'A(Lara)', 'M'],
      ['.', 'A(Tom)', '.'],
      ['T(2)', 'T(3)', '.'],
    ];

    const adventurerInfo: AdvInfo = {
      marker: 'A(Tom)',
      position: { latitude: 1, longitude: 2 },
      orientation: 'S',
      moves: 'ADADAADAA',
      collectedTreasures: 0,
    };
    const expectedAdventurerInfo: AdvInfo = {
      marker: 'A(Tom)',
      position: { latitude: 1, longitude: 3 },
      orientation: 'S',
      moves: 'ADADAADAA',
      collectedTreasures: 1,
    };
    const expectedMap: TreasureMap = [
      ['.', 'M', '.'],
      ['.', 'A(Lara)', 'M'],
      ['.', '.', '.'],
      ['T(2)', 'AT(2)', '.'],
    ];

    const moveResult: MoveResult = computeForwardMove(map, adventurerInfo);

    expect(moveResult.map).toEqual(expectedMap);
    expect(moveResult.adventurerInfo).toEqual(expectedAdventurerInfo);
  });
  it('should compute adventurer next position when they are collecting a treasure, but not update their info (position) and the map if they are heading towards a mountain', () => {
    const map: TreasureMap = [
      ['.', 'M', '.'],
      ['.', 'A(Lara)', 'M'],
      ['.', 'A(Tom)', '.'],
      ['T(2)', 'T(3)', '.'],
    ];

    const adventurerInfo: AdvInfo = {
      marker: 'A(Lara)',
      position: { latitude: 1, longitude: 1 },
      orientation: 'N',
      moves: 'ADADAADAA',
      collectedTreasures: 0,
    };
    const expectedAdventurerInfo: AdvInfo = {
      marker: 'A(Lara)',
      position: { latitude: 1, longitude: 1 },
      orientation: 'N',
      moves: 'ADADAADAA',
      collectedTreasures: 0,
    };
    const expectedMap: TreasureMap = [
      ['.', 'M', '.'],
      ['.', 'A(Lara)', 'M'],
      ['.', 'A(Tom)', '.'],
      ['T(2)', 'T(3)', '.'],
    ];

    const moveResult: MoveResult = computeForwardMove(map, adventurerInfo);

    expect(moveResult.map).toEqual(expectedMap);
    expect(moveResult.adventurerInfo).toEqual(expectedAdventurerInfo);
  });
});

describe('computeNextPosition', () => {
  const testCases = [
    {
      orientation: 'N',
      previousLatitude: 2,
      previousLongitude: 3,
      nextLatitude: 2,
      nextLongitude: 2,
    },
    {
      orientation: 'O',
      previousLatitude: 2,
      previousLongitude: 3,
      nextLatitude: 1,
      nextLongitude: 3,
    },
    {
      orientation: 'S',
      previousLatitude: 2,
      previousLongitude: 3,
      nextLatitude: 2,
      nextLongitude: 4,
    },
    {
      orientation: 'E',
      previousLatitude: 2,
      previousLongitude: 3,
      nextLatitude: 3,
      nextLongitude: 3,
    },
  ];

  testCases.forEach(
    ({
      orientation,
      previousLatitude,
      previousLongitude,
      nextLatitude,
      nextLongitude,
    }) => {
      it(`with orientation ${orientation}, previous latitude ${previousLatitude} and prebious longitude ${previousLongitude} adventurer's next latitude and longitude should be ${nextLatitude} and ${nextLongitude} `, () => {
        const adventurerInfo: AdvInfo = {
          marker: 'A(Tom)',
          position: {
            latitude: previousLatitude,
            longitude: previousLongitude,
          },
          orientation: orientation,
          moves: 'ADADAADAA',
          collectedTreasures: 0,
        };

        const newAdventurerInfo = computeNextPosition(adventurerInfo);
        expect(newAdventurerInfo.latitude).toBe(nextLatitude);
        expect(newAdventurerInfo.longitude).toBe(nextLongitude);
      });
    },
  );
});

describe('takeOnestep', () => {
  it('should update adventurer position marker to A(xx), update map and update adventurer position in their info', () => {
    const map: TreasureMap = [
      ['.', 'M', '.'],
      ['.', 'A(Lara)', 'M'],
      ['.', 'A(Tom)', '.'],
      ['T(2)', 'T(3)', '.'],
    ];
    const newLongitude = 2;
    const newLatitude = 2;

    const adventurerInfo: AdvInfo = {
      marker: 'A(Tom)',
      position: { latitude: 1, longitude: 2 },
      orientation: 'E',
      moves: 'ADADAADAA',
      collectedTreasures: 0,
    };
    const expectedAdventurerInfo: AdvInfo = {
      marker: 'A(Tom)',
      position: { latitude: 2, longitude: 2 },
      orientation: 'E',
      moves: 'ADADAADAA',
      collectedTreasures: 0,
    };
    const expectedMap: TreasureMap = [
      ['.', 'M', '.'],
      ['.', 'A(Lara)', 'M'],
      ['.', '.', 'A(Tom)'],
      ['T(2)', 'T(3)', '.'],
    ];

    const moveResult: MoveResult = takeOneStep(
      map,
      adventurerInfo,
      newLongitude,
      newLatitude,
    );

    expect(moveResult.map).toEqual(expectedMap);
    expect(moveResult.adventurerInfo).toEqual(expectedAdventurerInfo);
  });
});

describe('collectTreasure', () => {
  it('should increment adventurer treasure, update their position to AT(x) and update map when number of treasure is greater than one', () => {
    const map: TreasureMap = [
      ['.', 'M', '.'],
      ['.', 'A(Lara)', 'M'],
      ['.', 'A(Tom)', '.'],
      ['T(2)', 'T(3)', '.'],
    ];
    const newLongitude = 3;
    const newLatitude = 1;

    const adventurerInfo: AdvInfo = {
      marker: 'A(Tom)',
      position: { latitude: 1, longitude: 2 },
      orientation: 'E',
      moves: 'ADADAADAA',
      collectedTreasures: 0,
    };
    const expectedAdventurerInfo: AdvInfo = {
      marker: 'A(Tom)',
      position: { latitude: 1, longitude: 3 },
      orientation: 'E',
      moves: 'ADADAADAA',
      collectedTreasures: 1,
    };
    const expectedMap: TreasureMap = [
      ['.', 'M', '.'],
      ['.', 'A(Lara)', 'M'],
      ['.', '.', '.'],
      ['T(2)', 'AT(2)', '.'],
    ];

    const moveResult: MoveResult = collectTreasure(
      map,
      adventurerInfo,
      newLongitude,
      newLatitude,
    );

    expect(moveResult.map).toEqual(expectedMap);
    expect(moveResult.adventurerInfo).toEqual(expectedAdventurerInfo);
  });
  it('should increment adventurer treasure, update their position to A(xx) and update map when number of treasure is equal to one', () => {
    const map: TreasureMap = [
      ['.', 'M', '.'],
      ['.', 'A(Lara)', 'M'],
      ['.', 'A(Tom)', '.'],
      ['T(2)', 'T(1)', '.'],
    ];
    const newLongitude = 3;
    const newLatitude = 1;

    const adventurerInfo: AdvInfo = {
      marker: 'A(Tom)',
      position: { latitude: 1, longitude: 2 },
      orientation: 'E',
      moves: 'ADADAADAA',
      collectedTreasures: 0,
    };
    const expectedAdventurerInfo: AdvInfo = {
      marker: 'A(Tom)',
      position: { latitude: 1, longitude: 3 },
      orientation: 'E',
      moves: 'ADADAADAA',
      collectedTreasures: 1,
    };
    const expectedMap: TreasureMap = [
      ['.', 'M', '.'],
      ['.', 'A(Lara)', 'M'],
      ['.', '.', '.'],
      ['T(2)', 'A(Tom)', '.'],
    ];

    const moveResult: MoveResult = collectTreasure(
      map,
      adventurerInfo,
      newLongitude,
      newLatitude,
    );

    expect(moveResult.map).toEqual(expectedMap);
    expect(moveResult.adventurerInfo).toEqual(expectedAdventurerInfo);
  });
});

describe('updatePreviousPosition', () => {
  it('should set previous aventurer position marker to "." if they were not collecting a treasure', () => {
    const map: TreasureMap = [
      ['.', 'M', '.'],
      ['.', 'A(Lara)', 'M'],
      ['.', 'A(Tom)', '.'],
      ['T(2)', 'T(3)', '.'],
    ];
    const adventurerInfo: AdvInfo = {
      marker: 'A(Tom)',
      position: { latitude: 1, longitude: 2 },
      orientation: 'E',
      moves: 'ADADAADAA',
      collectedTreasures: 0,
    };
    const expectedMap: TreasureMap = [
      ['.', 'M', '.'],
      ['.', 'A(Lara)', 'M'],
      ['.', '.', '.'],
      ['T(2)', 'T(3)', '.'],
    ];

    const moveResult: MoveResult = updatePreviousPosition(map, adventurerInfo);

    expect(moveResult.map).toEqual(expectedMap);
  });
  it('should set previous aventurer position marker to "T(x)" if they were collecting a treasure', () => {
    const map: TreasureMap = [
      ['.', 'M', '.'],
      ['.', 'A(Lara)', 'M'],
      ['.', '.', '.'],
      ['T(2)', 'AT(3)', '.'],
    ];
    const adventurerInfo: AdvInfo = {
      marker: 'A(Tom)',
      position: { latitude: 1, longitude: 3 },
      orientation: 'E',
      moves: 'ADADAADAA',
      collectedTreasures: 0,
    };
    const expectedMap: TreasureMap = [
      ['.', 'M', '.'],
      ['.', 'A(Lara)', 'M'],
      ['.', '.', '.'],
      ['T(2)', 'T(3)', '.'],
    ];

    const moveResult: MoveResult = updatePreviousPosition(map, adventurerInfo);

    expect(moveResult.map).toEqual(expectedMap);
  });
});

describe('computeTurningMove', () => {
  const testCases = [
    { direction: 'D', previousOrientation: 'N', newOrientation: 'E' },
    { direction: 'D', previousOrientation: 'E', newOrientation: 'S' },
    { direction: 'D', previousOrientation: 'S', newOrientation: 'O' },
    { direction: 'D', previousOrientation: 'O', newOrientation: 'N' },
    { direction: 'G', previousOrientation: 'N', newOrientation: 'O' },
    { direction: 'G', previousOrientation: 'O', newOrientation: 'S' },
    { direction: 'G', previousOrientation: 'S', newOrientation: 'E' },
    { direction: 'G', previousOrientation: 'E', newOrientation: 'N' },
  ];

  testCases.forEach(({ direction, previousOrientation, newOrientation }) => {
    it(`with direction ${direction} and previous orientation ${previousOrientation}, adventurer's next orientaton should be ${newOrientation}`, () => {
      const adventurerInfo: AdvInfo = {
        marker: 'A(Tom)',
        position: { latitude: 1, longitude: 2 },
        orientation: previousOrientation,
        moves: 'ADADAADAA',
        collectedTreasures: 0,
      };

      const newAdventurerInfo = computeTurningMove(adventurerInfo, direction);
      expect(newAdventurerInfo.orientation).toBe(newOrientation);
    });
  });
});
