import { AdvsInfo, TreasureMap } from 'src/models/game-state';

import {
  formatHuntResult,
  retrieveAdventurersInfo,
  retrieveMountainInfoFromMap,
  retrieveTreasureInfoFromMap,
} from '../write-result';

describe('formatHuntResult', () => {
  it('should return a string of the mountains info with the correct format', () => {
    // expected format :
    // M - {Horizontal axis} - {Vertical Axis}

    const map: TreasureMap = [
      ['.', 'M', '.'],
      ['.', 'A(Tom)', 'M'],
      ['.', '.', '.'],
      ['A(Lara)', 'T(1)', '.'],
    ];
    const adventurersInfo: AdvsInfo = {
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
    const expectedMountainsOutput: string = `C - 3 - 4
M - 1 - 0
M - 2 - 1
T - 1 - 3 - 1
A - Tom - 1 - 1 - N - 1
A - Lara - 0 - 3 - S - 3\n`;

    const mountainsOutput: string = formatHuntResult({ map, adventurersInfo });

    expect(mountainsOutput).toEqual(expectedMountainsOutput);
  });
});

describe('retrieveMountainInfoFromMap', () => {
  it('should return a string of the mountains info with the correct format', () => {
    // expected format :
    // M - {Horizontal axis} - {Vertical Axis}

    const map: TreasureMap = [
      ['.', 'M', '.'],
      ['.', 'A(Lara)', 'M'],
      ['.', '.', '.'],
      ['T(2)', 'AT(1)', '.'],
    ];
    const expectedMountainsOutput: string = 'M - 1 - 0\nM - 2 - 1\n';

    const mountainsOutput: string = retrieveMountainInfoFromMap(map);

    expect(mountainsOutput).toEqual(expectedMountainsOutput);
  });
});

describe('retrieveTreasureInfoFromMap', () => {
  it('should return a string of the treasures info with the correct format, parsing boxes with both formats (AT(x) and T(x))', () => {
    // expected format :
    // T - {Horizontal axis} - {Vertical Axis} - {Nb of remaining treasures}

    const map: TreasureMap = [
      ['.', 'M', '.'],
      ['.', 'A(Lara)', 'M'],
      ['.', '.', '.'],
      ['T(2)', 'AT(1)', '.'],
    ];
    const expectedTreasuresOutput: string = 'T - 0 - 3 - 2\nT - 1 - 3 - 1\n';

    const treasuresOutput: string = retrieveTreasureInfoFromMap(map);

    expect(treasuresOutput).toEqual(expectedTreasuresOutput);
  });
});

describe('retrieveAdventurersInfo', () => {
  it('should return a string of the adventurers info with the correct format', () => {
    // expected format :
    // A - {Adventurer name} - {Horizontal axis} - {Vertical Axis} - {Orientation} - {Nb of collected treasures}

    const adventurersInfo: AdvsInfo = {
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
    const expectedAdventurersOutput: string =
      'A - Tom - 1 - 1 - N - 1\nA - Lara - 0 - 3 - S - 3\n';

    const adventurersOutput: string = retrieveAdventurersInfo(adventurersInfo);

    expect(adventurersOutput).toEqual(expectedAdventurersOutput);
  });
});
