import * as fs from 'fs';

import { HuntInfo } from './models/game-state';
import { processAdvMoves } from './moves';
import { parseFileFromPath } from './parsing';
import { writeHuntOutput } from './write-result';

const entryFilePath: fs.PathOrFileDescriptor = process.argv[2];

const processedEntryInfo: HuntInfo = parseFileFromPath(entryFilePath);

const huntResult = processAdvMoves(processedEntryInfo);

writeHuntOutput(huntResult);
