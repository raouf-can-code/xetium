import type { Client } from "discord.js";
import { testServer } from "../../../config.json";
import getLocalCommands from "../../utils/getLocalCommands";
import areCommandsDifferent from "../../utils/areCommandsDifferent";

export default async function registerCommands(client: Client) {
  try {
    const localCommands = await getLocalCommands();

    for (const localCommand of localCommands) {
      const { name, description, options, global, deleted } = localCommand;

      const commandsManager = global ? client.application!.commands : client.guilds.cache.get(testServer)?.commands;

      if (!commandsManager) {
        console.warn(`Could not access commands manager for ${global ? "global" : "test server"} for command: ${name}`);
        continue;
      }

      const allCommands = await commandsManager.fetch(); //useless error
      const existingCommand = allCommands.find((cmd) => cmd.name === name);

      if (existingCommand) {
        if (deleted) {
          await commandsManager.delete(existingCommand.id);
          console.log(`Deleted command: ${name}`);
          continue;
        }

        if (areCommandsDifferent(existingCommand, localCommand)) {
          await commandsManager.edit(existingCommand.id, { description, options });
          console.log(`Updated command: ${name} (${global ? "global" : "test server"})`);
        }
      } else {
        if (deleted) {
          console.log(`Skipped deleted command: ${name}`);
          continue;
        }

        await commandsManager.create({ name, description, options });
        console.log(`Registered command: ${name} (${global ? "global" : "test server"})`);
      }
    }
  } catch (err) {
    console.error("Error while registering commands:", err);
  }
}
