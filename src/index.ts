import * as fs from "fs";

import { parseFileFromPath } from "./parsing";

const entryFilePath: fs.PathOrFileDescriptor = process.argv[2];

parseFileFromPath(entryFilePath);
