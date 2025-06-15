import { ApplicationCommandOptionType, type Client, PermissionFlagsBits } from "discord.js";

export default {
  name: "unmute",
  description: "Unmute a user from voice channels",
  options: [
    {
      name: "target",
      description: "The user you want to unmute",
      type: ApplicationCommandOptionType.Mentionable,
      required: true,
    },
    {
      name: "reason",
      description: "Reason for unmuting",
      type: ApplicationCommandOptionType.String,
    },
  ],
  category: "moderation",
  global: true,
  dmPermission: false,
  permissionsRequired: [PermissionFlagsBits.MuteMembers],
  botPermissions: [PermissionFlagsBits.MuteMembers],

  async callback(client: Client, int: any) {
    const targetId = int.options.get("target")!.value;
    const reason = int.options.get("reason")?.value || "No reason provided";

    await int.deferReply();

    const targetUser = await int.guild?.members.fetch(targetId);
    if (!targetUser) {
      await int.editReply("This user is not in the server.");
      return;
    }

    if (!targetUser.voice.channel) {
      await int.editReply("That user is not in a voice channel.");
      return;
    }

    try {
      await targetUser.voice.setMute(false, reason);
      await int.editReply(`${targetUser} has been unmuted.\nReason: ${reason}`);
    } catch (err) {
      console.error(err);
      await int.editReply({
        content: "An error occurred while trying to unmute the user.",
        ephemeral: true,
      });
    }
  },
};
//same as mute command
//im to lazy to write this
