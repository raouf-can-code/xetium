import {
  PermissionFlagsBits,
  ApplicationCommandOptionType,
  type Client,
  type ChatInputCommandInteraction,
  type Interaction,
} from "discord.js";

export default {
  name: "unlock",
  description: "unlock the channel so the members can talk again",
  options: [
    {
      name: "channel",
      description: "the channel that you want to unlock (optional)",
      type: ApplicationCommandOptionType.Channel,
    },
  ],
  global: true,
  category: "management",
  dmPermission: false,
  permissionsRequired: [PermissionFlagsBits.ManageChannels],
  botPermissions: [PermissionFlagsBits.ManageChannels],

  callback: async (client: Client, int: ChatInputCommandInteraction & Interaction) => {
    const channel = int.options.getChannel("channel") || int.channel;

    if (!int.guild || !channel?.isTextBased()) {
      return int.reply({
        content: "This command can only be used in a server text channel",
        ephemeral: true,
      });
    }

    const botMember = int.guild.members.me;
    if (!botMember?.permissionsIn(channel).has(PermissionFlagsBits.ManageChannels)) {
      return int.reply({
        content: "I don't have permission to manage this channel",
        ephemeral: true,
      });
    }
    try {
      const everyoneRole = int.guild.roles.everyone;
      await channel.permissionOverwrites.edit(everyoneRole, {
        SendMessages: null,
      });
      await int.reply({
        content: `<#${channel.id}> has been unlocked`,
      });
    } catch (err) {
      console.log(err);
    }
  },
};
