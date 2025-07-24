import type { Client, Interaction, ChatInputCommandInteraction, PermissionResolvable } from "discord.js";
import { dev, testServer } from "../../../config.json";
import getLocalCommands from "../../utils/getLocalCommands.js";

export default async function (interaction: Interaction, client: Client) {
  if (!interaction.isChatInputCommand()) return;

  const localCommands = await getLocalCommands();

  try {
    const commandObj = localCommands.find((cmd) => cmd.name === interaction.commandName);
    if (!commandObj) return;

    // Dev only command check
    if (commandObj.devOnly && !dev.includes(interaction.user.id)) {
      await interaction.reply({
        content: "This command is only for the bot developers.",
        ephemeral: true,
      });
      return;
    }

    // TestOnly command check
    if (commandObj.testOnly && interaction.guildId !== testServer) {
      await interaction.reply({
        content: "This command is only available in the test server.",
        ephemeral: true,
      });
      return;
    }

    // User permissions check
    if (commandObj.permissionsRequired?.length) {
      const missingPerms: PermissionResolvable[] = [];
      for (const perm of commandObj.permissionsRequired) {
        if (!interaction.memberPermissions?.has(perm)) {
          missingPerms.push(perm);
        }
      }

      if (missingPerms.length) {
        await interaction.reply({
          content: `not enough permission, ask the admins for some perms`,
          ephemeral: true,
        });
        return;
      }
    }

    // Bot permissions check
    if (commandObj.botPermissions?.length) {
      const bot = interaction.guild?.members.me;
      const missingBotPerms: PermissionResolvable[] = [];

      for (const perm of commandObj.botPermissions) {
        if (!bot?.permissions.has(perm)) {
          missingBotPerms.push(perm);
        }
      }

      if (missingBotPerms.length) {
        await interaction.reply({
          content: `you expect me to run a command without permission? genius`,
          ephemeral: true,
        });
        return;
      }
    }

    // Run the command
    await commandObj.callback(client, interaction);
  } catch (err) {
    console.error(err);
    const errorMsg = "An error occurred while executing the command.";

    if (interaction.replied || interaction.deferred) {
      await interaction.editReply({ content: errorMsg });
    } else {
      await interaction.reply({ content: errorMsg, ephemeral: true });
    }
  }
}
