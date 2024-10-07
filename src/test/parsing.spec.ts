import { AdvsInfo, HuntInfo, TreasureMap } from 'src/models/game-state';

import { addAdventurer, addMountain, addTreasures, createMap, processLinesInfo, setAdventurerInfos } from '../parsing';

describe('processLinesInfo', () => {
  it('should return a map of the mountains, treasures and adventurers as well as an object with the adventurers info when provided with the lines of the entryfile', () => {
    const linesFromEntryFile: string[] = [
      'C​ - 3 - 4',
      'M​ - 1 - 0',
      'M​ - 2 - 1',
      'T​ - 0 - 3 - 2',
      'T​ - 1 - 3 - 3',
      'A​ - Tom - 1 - 2 - E - ADADAADAA',
      'A​ - Lara - 1 - 1 - S - AADADAGGA',
    ];
    const expectedMap: TreasureMap = [
      ['.', 'M', '.'],
      ['.', 'A(Lara)', 'M'],
      ['.', 'A(Tom)', '.'],
      ['T(2)', 'T(3)', '.'],
    ];
    const expectedAdventurersInfo = {
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

    const processedEntryInfo: HuntInfo = processLinesInfo(linesFromEntryFile);

    expect(processedEntryInfo.map).toEqual(expectedMap);
    expect(processedEntryInfo.adventurersInfo).toEqual(expectedAdventurersInfo);
  });
});

describe('createMap', () => {
  it('should return a map of the correct length and filles with "." characters', () => {
    const mapHeight = 4;
    const mapWidth = 6;

    const expectedMap: TreasureMap = [
      ['.', '.', '.', '.', '.', '.'],
      ['.', '.', '.', '.', '.', '.'],
      ['.', '.', '.', '.', '.', '.'],
      ['.', '.', '.', '.', '.', '.'],
    ];

    const resultMap: TreasureMap = createMap(mapWidth, mapHeight);

    expect(resultMap).toEqual(expectedMap);
  });
});

describe('addMountain', () => {
  it('should add the mountain marker (M) to the map when mountain position is correct', () => {
    const map: TreasureMap = [
      ['.', '.'],
      ['.', '.'],
    ];
    const latitude = 1;
    const longitude = 0;

    const expectedMap: TreasureMap = [
      ['.', 'M'],
      ['.', '.'],
    ];

    const resultMap: TreasureMap = addMountain(map, latitude, longitude);

    expect(resultMap).toEqual(expectedMap);
  });

  it('should not add the mountain marker (M) to the map when mountain position is incorrect', () => {
    const map: TreasureMap = [
      ['.', '.'],
      ['.', '.'],
    ];
    const latitude = 100;
    const longitude = 22;

    const expectedMap: TreasureMap = [
      ['.', '.'],
      ['.', '.'],
    ];

    const resultMap: TreasureMap = addMountain(map, latitude, longitude);

    expect(resultMap).toEqual(expectedMap);
  });
});

describe('addTreasure', () => {
  it('should add the treasure marker (T(x)) to the map when treasure position is correct', () => {
    const map: TreasureMap = [
      ['.', '.'],
      ['.', '.'],
    ];
    const latitude = 0;
    const longitude = 0;
    const numberOfTreasures = 12;

    const expectedMap: TreasureMap = [
      ['T(12)', '.'],
      ['.', '.'],
    ];

    const resultMap: TreasureMap = addTreasures(
      map,
      latitude,
      longitude,
      numberOfTreasures,
    );

    expect(resultMap).toEqual(expectedMap);
  });

  it('should not add the treasure marker to the map when treasure position is incorrect', () => {
    const map: TreasureMap = [
      ['.', '.'],
      ['.', '.'],
    ];
    const latitude = 100;
    const longitude = 22;
    const numberOfTreasures = 5;

    const expectedMap: TreasureMap = [
      ['.', '.'],
      ['.', '.'],
    ];

    const resultMap: TreasureMap = addTreasures(
      map,
      latitude,
      longitude,
      numberOfTreasures,
    );

    expect(resultMap).toEqual(expectedMap);
  });

  it('should not add the treasure marker to the map when the number of treasures is incorrect', () => {
    const map: TreasureMap = [
      ['.', '.'],
      ['.', '.'],
    ];
    const latitude = 0;
    const longitude = 0;
    const numberOfTreasures = 0;

    const expectedMap: TreasureMap = [
      ['.', '.'],
      ['.', '.'],
    ];

    const resultMap: TreasureMap = addTreasures(
      map,
      latitude,
      longitude,
      numberOfTreasures,
    );

    expect(resultMap).toEqual(expectedMap);
  });
});

describe('addAdventurer', () => {
  it('should add the adventurer marker to the map when adventurer position is correct', () => {
    const map: TreasureMap = [
      ['.', '.'],
      ['.', '.'],
    ];
    const name = 'Jane';
    const latitude = 0;
    const longitude = 1;

    const expectedMap: TreasureMap = [
      ['.', '.'],
      ['A(Jane)', '.'],
    ];

    const resultMap: TreasureMap = addAdventurer(
      map,
      name,
      latitude,
      longitude,
    );

    expect(resultMap).toEqual(expectedMap);
  });

  it('should not add the adventurer marker to the map when adventurer position is incorrect', () => {
    const map: TreasureMap = [
      ['.', '.'],
      ['.', '.'],
    ];
    const name = 'Jane';
    const latitude = 100;
    const longitude = 22;

    const expectedMap: TreasureMap = [
      ['.', '.'],
      ['.', '.'],
    ];

    const resultMap: TreasureMap = addAdventurer(
      map,
      name,
      latitude,
      longitude,
    );

    expect(resultMap).toEqual(expectedMap);
  });
});

describe('setAdventurerInfos', () => {
  it('should add the adventurer info to the adventurers info after the data has been extracted from the entry file', () => {
    const adventurersInfo: AdvsInfo = {};
    const name = 'Jane';
    const latitude = 3;
    const longitude = 2;
    const orientation = 'E';
    const moves = 'AAGADAADDAG';
    const expectedInfo: AdvsInfo = {
      Jane: {
        marker: `A(Jane)`,
        position: { latitude: 3, longitude: 2 },
        orientation: 'E',
        moves: 'AAGADAADDAG',
        collectedTreasures: 0,
      },
    };

    const resultInfo: AdvsInfo = setAdventurerInfos(
      adventurersInfo,
      name,
      latitude,
      longitude,
      orientation,
      moves,
    );

    expect(resultInfo).toEqual(expectedInfo);
  });
});
