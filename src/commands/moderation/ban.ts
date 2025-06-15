import { ApplicationCommandOptionType, PermissionFlagsBits, type Client } from "discord.js";

export default {
  name: "ban",
  description: "ban someone from the server",
  options: [
    {
      name: "target",
      description: "the user that you want to ban",
      type: ApplicationCommandOptionType.Mentionable,
      required: true,
    },
    {
      name: "reason",
      description: "the reason to ban this user",
      type: ApplicationCommandOptionType.String,
    },
  ],
  category: "moderation",
  global: true,
  dmPermission: false,
  permissionsRequired: [PermissionFlagsBits.BanMembers],
  botPermissions: [PermissionFlagsBits.BanMembers],

  callback: async (client: Client, int: any) => {
    const targetUserID = int.options.get("target").value;
    const reason: string = int.options.get("reason")?.value || "no reason provided";

    await int.deferReply();
    const targetUser = await int.guild.members.fetch(targetUserID);

    if (!targetUser) {
      await int.editReply("this user is not in the server");
      return;
    }
    if (targetUser.id === int.guild.ownerId) {
      await int.editReply("trying to ban the server owner is a great idea");
      return;
    }

    if (int.user.id === int.guild.ownerId) {
      try {
        await targetUser.ban({ reason: reason });
        await int.editReply(`${targetUser} was banned from the server\nreason: ${reason}`);
      } catch (err) {
        console.error(err);
        int.editReply("there was an error during the process");
      }
    }

    const targetUserRolePosition = targetUser.roles.highest.position; // the target users
    const requestUserRolePosition = int.member.roles.highest.position; // the user that runs the command
    const botRolePosition = int.guild.members.me.roles.highest.position; // bot

    if (targetUserRolePosition >= requestUserRolePosition) {
      await int.editReply("you can't ban that user because he/she has same/higher role then you");
      return;
    }
    if (targetUserRolePosition >= botRolePosition) {
      await int.editReply("I can't ban that user because he/she has same/higher role then me");
      return;
    }

    try {
      await targetUser.ban({ reason: reason });
      await int.editReply(`${targetUser} was banned from the server\nreason: ${reason}`);
    } catch (err) {
      console.error(err);
      int.editReply({ content: "an error happend during the process", ephemeral: true });
    }
  },
};
