import { ApplicationCommandOptionType, PermissionFlagsBits, type Client } from "discord.js";

export default {
  name: "unban",
  description: "Unban a user",
  options: [
    {
      name: "user",
      description: "The ID of the user to unban",
      type: ApplicationCommandOptionType.String,
      required: true,
    },
    {
      name: "reason",
      description: "The reason for unbanning this user",
      type: ApplicationCommandOptionType.String,
    },
  ],
  category: "moderation",
  global: true,
  dmPermission: false,
  permissionsRequired: [PermissionFlagsBits.BanMembers],
  botPermissions: [PermissionFlagsBits.BanMembers],

  callback: async (client: Client, int: any) => {
    const userId: string = int.options.get("user").value;
    const reason: string = int.options.get("reason")?.value || "No reason provided";

    await int.deferReply();

    const member = int.member;
    if (!int.guild?.members.me?.permissions.has(PermissionFlagsBits.BanMembers)) {
      await int.editReply("I don't have permission to unban members.");
      return;
    }

    if (!("permissions" in member) || !member.permissions.has(PermissionFlagsBits.BanMembers)) {
      await int.editReply("You don't have permission to unban members.");
      return;
    }

    try {
      const ban = await int.guild.bans.fetch(userId).catch(() => null);

      if (!ban) {
        await int.editReply("That user is not banned.");
        return;
      }

      await int.guild.members.unban(userId, reason);
      await int.editReply(`Successfully unbanned <@${userId}>.\nReason: ${reason}`);
    } catch (err) {
      console.error(err);
      await int.editReply({ content: "an error happend during the process", ephemeral: true });
    }
  },
};
