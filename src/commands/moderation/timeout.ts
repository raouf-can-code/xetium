import { ApplicationCommandOptionType, type Client, PermissionFlagsBits } from "discord.js";
import ms, { StringValue } from "ms";

export default {
  name: "timeout",
  description: "give a user break from your server :)",
  options: [
    {
      name: "target",
      description: "the user that you want to timeout",
      type: ApplicationCommandOptionType.Mentionable,
      required: true,
    },
    {
      name: "duration",
      description: "timeout duration (30m, 1h, 2d)",
      type: ApplicationCommandOptionType.String,
      required: true,
    },
    {
      name: "reason",
      description: "the reason for the timeout",
      type: ApplicationCommandOptionType.String,
    },
  ],
  category: "moderation",
  global: true,
  dmPermission: false,
  permissionsRequired: [PermissionFlagsBits.ModerateMembers],
  botPermissions: [PermissionFlagsBits.ModerateMembers],

  async callback(client: Client, int: any) {
    const theChosen = int.options.get("target")!.value;
    const duration: string = int.options.get("duration")!.value as string;
    const reason: string = int.options.get("reason")?.value || "no reason provided";

    await int.deferReply();
    const targetUser = await int.guild?.members.fetch(theChosen as string);

    if (!targetUser) {
      await int.editReply("this user is not in the server");
      return;
    }
    if (targetUser.id === int.guild!.ownerId) {
      await int.editReply("trying to timeout the server owner? really?");
      return;
    }

    if (targetUser.user.bot) {
      await int.editReply("I can't timeout a bot");
      return;
    }

    const msDuration = ms(duration as StringValue);
    if (isNaN(msDuration)) {
      await int.editReply("please provide a valid duration");
      return;
    }
    const maxDuration: number = 28 * 24 * 60 * 60 * 1000; //28 days
    if (msDuration > maxDuration) {
      await int.editReply("more then 28 days !?\njust kick or ban him/her from the server");
      return;
    }
    if (msDuration < 5000) {
      await int.editReply("just forgive him/her");
      return;
    }

    const targetUserRolePosition = targetUser.roles.highest.position; // the target users
    const requestUserRolePosition = int.member!.roles.highest.position; // the user that runs the command
    const botRolePosition = int.guild.members.me.roles.highest.position; // bot

    if (targetUserRolePosition >= requestUserRolePosition) {
      await int.editReply(
        "you can't timeout that user because he/she has same/higher role then you"
      );
      return;
    }
    if (targetUserRolePosition >= botRolePosition) {
      await int.editReply("I can't timeout that user because he/she has same/higher role then me");
      return;
    }

    try {
      const { default: prettyMS } = await import("pretty-ms");

      if (targetUser.isCommunicationDisabled()) {
        await targetUser.timeout(msDuration, reason);
        await int.editReply(
          `${targetUser}'s timeout has been updated to ${prettyMS(msDuration, { verbose: true })}`
        );
        return;
      }
      await targetUser.timeout(msDuration, reason);
      await int.editReply(`${targetUser} is timed out\nreason: ${reason}`);
    } catch (err) {
      console.error(err);
      await int.editReply({ content: "an error happend during the process", ephemeral: true });
      return;
    }
  },
};
