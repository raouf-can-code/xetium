import {
  ApplicationCommandOptionType,
  EmbedBuilder,
  type ChatInputCommandInteraction,
  type Interaction,
  type Client,
} from "discord.js";

export default {
  name: "avatar",
  description: "get your or someone's avatar",
  options: [
    {
      name: "user",
      description:
        "the user that you want to get his avatar (leave it blank if you want your's)",
      type: ApplicationCommandOptionType.Mentionable,
    },
  ],
  category: "utils",

  global: true,
  dmPermission: false,

  callback: async (
    client: Client,
    int: Interaction & ChatInputCommandInteraction,
  ) => {
    const user = int.options.get("user")?.user || int.user;
    const avatarUrl = user.displayAvatarURL({ size: 1024, dynamic: true }); //useless error
    try {
      const avatarEmbed = new EmbedBuilder()
        .setAuthor({ name: `${user.username}`, iconURL: `${user.avatarURL()}` })
        .setTitle(`${user.username} Avatar's`)
        .setURL(user.avatarURL())
        .setImage(avatarUrl)
        .setFooter({
          text: `requested by ${int.user.username}`,
          iconURL: `${int.user.avatarURL()}`,
        })
        .setColor("White");

      await int.reply({ embeds: [avatarEmbed] });
    } catch (err) {
      console.error(err);
    }
  },
};
