import {
  PermissionFlagsBits,
  ChannelType,
  MessageFlags,
  ApplicationCommandOptionType,
  type Client,
  type Interaction,
  type ChatInputCommandInteraction,
  type TextChannel,
} from "discord.js";

export default {
  name: "clear",
  description: "Clean the mess of useless or bad messages",
  options: [
    {
      name: "quantity",
      description: "How many messages you want to delete",
      type: ApplicationCommandOptionType.Integer,
      required: true,
    },
  ],
  category: "management",
  global: true,
  dmPermission: false,
  permissionsRequired: [PermissionFlagsBits.ManageMessages],
  botPermissions: [PermissionFlagsBits.ManageMessages],

  callback: async (client: Client, int: Interaction & ChatInputCommandInteraction) => {
    const quantity = int.options.getInteger("quantity");
    const channel = int.channel;

    if (!quantity || quantity === 0) {
      await int.reply({
        content: "Are you joking right?",
        flags: MessageFlags.Ephemeral,
      });
      return;
    }

    if (!channel) return;

    /* if (channel.type !== ChannelType.GuildText && channel.type !== ChannelType.GuildAnnouncement) {
      await int.reply({
        content: "This command can only be used in a text or announcement channel",
        flags: MessageFlags.Ephemeral,
      });
      return;
    }*/

    try {
      await (channel as TextChannel).bulkDelete(quantity, true);

      await int.reply({
        content: `Deleted ${quantity} messages`,
        flags: MessageFlags.Ephemeral,
      });
    } catch (err) {
      console.error(err);
      await int.reply({
        content: "Failed to delete messages. Make sure they are not older than 14 days",
        flags: MessageFlags.Ephemeral,
      });
    }
  },
};
