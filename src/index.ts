import * as fs from 'fs';

import { processAdvMoves } from './moves';
import { ParsedInfo, parseFileFromPath } from './parsing';
import { writeHuntOutput } from './write-result';

const entryFilePath: fs.PathOrFileDescriptor = process.argv[2];

const processedEntryInfo: ParsedInfo = parseFileFromPath(entryFilePath);

const huntResult = processAdvMoves(processedEntryInfo);

writeHuntOutput(huntResult);
