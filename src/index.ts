import * as fs from 'fs';

import { processAdvMoves } from './moves';
import { ParsedInfo, parseFileFromPath } from './parsing';

const entryFilePath: fs.PathOrFileDescriptor = process.argv[2];

const processedEntryInfo: ParsedInfo = parseFileFromPath(entryFilePath);

console.log(processedEntryInfo.map);
console.log(processedEntryInfo.adventurersInfo);

const huntResult = processAdvMoves(processedEntryInfo);

console.log(huntResult.map);
console.log(huntResult.adventurersInfo);
