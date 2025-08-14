import {
  ApplicationCommandOptionType,
  PermissionFlagsBits,
  type Client,
} from "discord.js";

export default {
  name: "ban",
  description:
    "help someone retier discord with banning him from the server :)",
  options: [
    {
      name: "target",
      description: "The user to ban (mention or ID)",
      type: ApplicationCommandOptionType.String,
      required: true,
    },
    {
      name: "reason",
      description: "The reason for the ban",
      type: ApplicationCommandOptionType.String,
    },
  ],
  category: "moderation",
  global: true,
  dmPermission: false,
  permissionsRequired: [PermissionFlagsBits.BanMembers],
  botPermissions: [PermissionFlagsBits.BanMembers],

  callback: async (client: Client, int: any) => {
    const targetInput = int.options.getString("target");
    const reason: string =
      int.options.getString("reason") || "no reason provided";

    const targetUserID = targetInput.replace(/[<@!>]/g, "");

    await int.deferReply();

    let targetUser;
    try {
      targetUser = await int.guild.members.fetch(targetUserID);
    } catch {
      return int.editReply("Could not find that user in the server.");
    }

    if (targetUser.id === int.guild.ownerId) {
      return int.editReply("Trying to ban the server owner is great idea.");
    }

    const targetUserRolePosition = targetUser.roles.highest.position;
    const requestUserRolePosition = int.member.roles.highest.position;
    const botRolePosition = int.guild.members.me.roles.highest.position;

    if (targetUserRolePosition >= requestUserRolePosition) {
      return int.editReply(
        "You can't ban that user because they have the same or a higher role than you.",
      );
    }
    if (targetUserRolePosition >= botRolePosition) {
      return int.editReply(
        "I can't ban that user because they have the same or a higher role than me.",
      );
    }

    try {
      await targetUser.ban({ reason });
      await int.editReply(
        `${targetUser.user.tag} was banned from the server.\nReason: ${reason}`,
      );
    } catch (err) {
      console.error(err);
      await int.editReply("An error occurred during the ban process.");
    }
  },
};
