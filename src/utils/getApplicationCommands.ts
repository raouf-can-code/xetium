import type { Client } from "discord.js";

export default async function (client: Client, guildID: string) {
  let applicationCommands;

  if (guildID) {
    const guild = await client.guilds.fetch(guildID);
    applicationCommands = guild.commands;
  } else {
    applicationCommands = await client.application?.commands;
  }

  await applicationCommands?.fetch({});
  return applicationCommands;
}
