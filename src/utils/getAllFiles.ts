import fs from "fs";
import path from "path";

export default function (dir: string, dirOnly: boolean = false): string[] {
  let fileNames: string[] = [];
  const files = fs.readdirSync(dir, { withFileTypes: true });
  for (const file of files) {
    const filePath = path.join(dir, file.name);

    if (dirOnly) {
      if (file.isDirectory()) {
        fileNames.push(filePath);
      }
    } else {
      if (file.isFile()) {
        fileNames.push(filePath);
      }
    }
  }
  return fileNames;
}
