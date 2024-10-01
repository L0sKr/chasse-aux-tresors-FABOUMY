import * as fs from 'fs';

import { ParsedInfo, parseFileFromPath } from './parsing';

const entryFilePath: fs.PathOrFileDescriptor = process.argv[2];

const processedEntryInfo: ParsedInfo = parseFileFromPath(entryFilePath);

console.log(processedEntryInfo.treasureMap);
console.log(processedEntryInfo.adventurersInfo);
