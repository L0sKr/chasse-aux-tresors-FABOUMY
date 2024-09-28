import * as fs from "fs";
import path from "path";

export function parseFileFromPath(filePath: string): void {
  const filePathInDirectory: string = path.join(process.cwd(), filePath);
  fs.readFile(filePathInDirectory, "utf8", (err, data) => {
    if (err) {
      console.error(err);
    } else {
      console.log(data); // parsed file contents as a string
    }
  });
}
