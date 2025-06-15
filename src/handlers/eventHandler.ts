import type { Client } from "discord.js";
import getAllFiles from "../utils/getAllFiles";
import path from "path";

import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename); //why did i use es modules insted of commonJS

export default function (client: Client) {
  const eventFolders = getAllFiles(path.join(__dirname, "..", "events"), true);

  for (const eventFolder of eventFolders) {
    const eventFiles: string[] = getAllFiles(eventFolder);
    const eventName: string | undefined = eventFolder.replace(/\\/g, "/").split("/").pop();
    eventFiles.sort((a, b) => a.localeCompare(b));
    client.on(eventName!, async (...args: any[]) => {
      for (const eventFile of eventFiles) {
        const eventFunc = await import(eventFile);
        await eventFunc.default(...args, client);
      }
    });
  }
}
