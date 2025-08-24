import {
  ApplicationCommandOptionType,
  type Interaction,
  type ChatInputCommandInteraction,
  type Client,
  PermissionFlagsBits,
} from "discord.js";

export default {
  name: "set-nick",
  description: "change someone's nickname",
  options: [
    {
      name: "target",
      description: "the person that you want to change their nickname",
      type: ApplicationCommandOptionType.User,
      required: false,
    },
    {
      name: "nickname",
      description: "The new nickname (leave empty to remove nickname)",
      type: ApplicationCommandOptionType.String,
      required: false,
    },
  ],
  category: "utils",
  global: true,
  dmPermission: false,
  callback: async (
    client: Client,
    int: Interaction & ChatInputCommandInteraction,
  ) => {
    if (!int.inGuild()) {
      await int.reply({
        content: "This command only works in servers.",
        ephemeral: true,
      });
      return;
    }

    const targetUser = int.options.getUser("target") ?? int.user;
    const targetMember = await int
      .guild!.members.fetch(targetUser.id)
      .catch(() => null);
    const nickName = int.options.getString("nickname");

    if (!targetMember) {
      await int.reply("target not found");
      return;
    }

    if (
      !int.guild!.members.me!.permissions.has(
        PermissionFlagsBits.ManageNicknames,
      )
    ) {
      await int.reply("I don't have permission to manage nicknames.");
      return;
    }

    if (nickName && (nickName.length < 1 || nickName.length > 32)) {
      await int.reply("enter a nickname not a paragraph");
      return;
    }

    try {
      await targetMember.setNickname(nickName || null);
      if (nickName) {
        await int.reply(
          `Changed ${targetUser.username}'s nickname to ${nickName}`,
        );
      } else {
        await int.reply(`Removed ${targetUser.username}'s nickname`);
      }
    } catch (err) {
      await int.reply({
        content: "an error happened during the process",
        ephemeral: true,
      });
    }
  },
};
