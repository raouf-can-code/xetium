import { ApplicationCommandOptionType, type Client, PermissionFlagsBits } from "discord.js";

export default {
  name: "untimeout",
  description: "remove timeout from someone",
  options: [
    {
      name: "target",
      description: "the user that you want to untimeout",
      type: ApplicationCommandOptionType.Mentionable,
      required: true,
    },
  ],
  category: "moderation",
  global: true,
  dmPermission: false,
  permissionsRequired: [PermissionFlagsBits.ModerateMembers],
  botPermissions: [PermissionFlagsBits.ModerateMembers],

  async callback(client: Client, int: any) {
    const theChosen = int.options.get("target")!.value;

    await int.deferReply();
    const targetUser = await int.guild?.members.fetch(theChosen as string);

    if (!targetUser) {
      await int.editReply("this user is not in the server");
      return;
    }

    if (!targetUser.isCommunicationDisabled()) {
      await int.editReply(`this user is already untimed out`);
      return;
    }
    if (targetUser.user.bot) {
      await int.editReply("I can't timeout a bot");
      return;
    }

    const targetUserRolePosition = targetUser.roles.highest.position; // the target users
    const requestUserRolePosition = int.member!.roles.highest.position; // the user that runs the command
    const botRolePosition = int.guild.members.me.roles.highest.position; // bot

    if (targetUserRolePosition >= requestUserRolePosition) {
      await int.editReply(
        "you can't untimeout that user because he/she has same/higher role then you"
      );
      return;
    }
    if (targetUserRolePosition >= botRolePosition) {
      await int.editReply(
        "I can't untimeout that user because he/she has same/higher role then me"
      );
      return;
    }

    try {
      if (targetUser.isCommunicationDisabled()) {
        await targetUser.timeout(null);
        await int.editReply(`${targetUser} can talk again`);
        return;
      }
    } catch (err) {
      console.error(err);
      await int.editReply({ content: "an error happend during the process", ephemeral: true });
      return;
    }
  },
};
