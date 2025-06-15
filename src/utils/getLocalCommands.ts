import path from "path";
import getAllFiles from "./getAllFiles";
import { dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default async function (exeption?: string[]) {
  let localCommands = [];

  const commandCategories = getAllFiles(path.join(__dirname, "..", "commands"), true);
  for (const commandCategory of commandCategories) {
    const commandFiles = getAllFiles(commandCategory);
    for (const commandFile of commandFiles) {
      const commandObj = await import(commandFile);
      if (exeption?.includes(commandObj.name)) {
        continue;
      }
      localCommands.push(commandObj.default);
    }
  }

  return localCommands;
}
