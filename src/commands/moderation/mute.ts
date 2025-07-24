import { ApplicationCommandOptionType, type Client, PermissionFlagsBits } from "discord.js";
import ms, { StringValue } from "ms";

export default {
  name: "mute",
  description: "Give a user a break from the voice rooms of the server :)",
  options: [
    {
      name: "target",
      description: "The user you want to mute",
      type: ApplicationCommandOptionType.Mentionable,
      required: true,
    },
    {
      name: "duration",
      description: "Mute duration (e.g. 30m, 1h, 2d)",
      type: ApplicationCommandOptionType.String,
      required: true,
    },
    {
      name: "reason",
      description: "The reason for the mute",
      type: ApplicationCommandOptionType.String,
    },
  ],
  category: "moderation",
  global: true,
  dmPermission: false,
  permissionsRequired: [PermissionFlagsBits.MuteMembers],
  botPermissions: [PermissionFlagsBits.MuteMembers],

  async callback(client: Client, int: any) {
    const theChosen = int.options.get("target")!.value;
    const duration: string = int.options.get("duration")!.value as string;
    const reason: string = int.options.get("reason")?.value || "no reason provided";

    await int.deferReply();

    const targetUser = await int.guild?.members.fetch(theChosen as string);
    console.log(targetUser);
    if (!targetUser) {
      await int.editReply("This user is not in the server.");
      return;
    }

    if (targetUser.id === int.guild!.ownerId) {
      await int.editReply("You can't mute the server owner.");
      return;
    }

    if (targetUser.user.bot) {
      await int.editReply("I can't mute a bot.");
      return;
    }

    const msDuration = ms(duration as StringValue);
    if (isNaN(msDuration)) {
      await int.editReply("Please provide a valid duration.");
      return;
    }

    const maxDuration = 31 * 24 * 60 * 60 * 1000;
    if (msDuration > maxDuration) {
      await int.editReply("More than 30 days? why?");
      return;
    }

    if (msDuration < 5000) {
      await int.editReply("That's too short. Just forgive them.");
      return;
    }

    const targetUserRolePosition = targetUser.roles.highest.position;
    const requestUserRolePosition = int.member!.roles.highest.position;
    const botRolePosition = int.guild.members.me.roles.highest.position;

    if (targetUserRolePosition >= requestUserRolePosition) {
      await int.editReply(
        "You can't mute that user because they have a higher or equal role to you."
      );
      return;
    }

    if (targetUserRolePosition >= botRolePosition) {
      await int.editReply("I can't mute that user because they have a higher or equal role to me.");
      return;
    }

    if (!targetUser.voice.channel) {
      await int.editReply("That user is not in a voice channel.");
      return;
    }

    try {
      const { default: prettyMs } = await import("pretty-ms");

      await targetUser.voice.setMute(true, reason);
      await int.editReply(
        `${targetUser} has been voice muted for ${prettyMs(msDuration, { verbose: true })}.`
      );

      setTimeout(async () => {
        try {
          const freshTarget = await int.guild?.members.fetch(theChosen as string);
          if (freshTarget?.voice.channel) {
            await freshTarget.voice.setMute(false, "Mute duration expired");
          }
        } catch (e) {
          console.error("Error while unmuting:", e);
        }
      }, msDuration);
    } catch (err) {
      console.error(err);
      await int.editReply({
        content: "An error happened while trying to mute the user.",
        ephemeral: true,
      });
    }
  },
};
//written by chat gpt i was lazy to write it
