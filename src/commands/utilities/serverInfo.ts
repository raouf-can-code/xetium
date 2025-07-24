import {
  type ChatInputCommandInteraction,
  type Interaction,
  type Client,
  EmbedBuilder,
} from "discord.js";

export default {
  name: "server-info",
  description: "get some information about the server",
  global: true,
  category: "utils",

  dmPermission: false,

  callback: async (client: Client, int: Interaction & ChatInputCommandInteraction) => {
    await int.deferReply();
    //getting server age
    const createdAt = int.guild?.createdAt;
    if (!createdAt) return;
    const now = new Date();

    let years = now.getFullYear() - createdAt.getFullYear();
    let months = now.getMonth() - createdAt.getMonth();

    if (months < 0) {
      years--;
      months += 12;
    }
    let answer: string;
    if (years === 0) {
      answer = `${months} month${months !== 1 ? "s" : ""}`;
    } else {
      answer = `${years} year${years !== 1 ? "s" : ""} and ${months} month${
        months !== 1 ? "s" : ""
      }`;
    }
    //getting channel count
    const textChannels = int.guild?.channels.cache.filter((c) => c.type === 0).size;
    const voiceChannels = int.guild?.channels.cache.filter((c) => c.type === 2).size;

    const reply = new EmbedBuilder()
      .setAuthor({ name: `${int.guild?.name}`, iconURL: `${int.guild?.iconURL()}` })
      .setThumbnail(`${int.guild?.iconURL()}`)
      .addFields(
        { name: "Server ID: ", value: `${int.guild?.id}`, inline: true },
        { name: "Owned by: ", value: `<@${int.guild?.ownerId}>`, inline: true },
        { name: "Members:", value: `Total: ${int.guild?.memberCount}\n`, inline: true }
      )
      .addFields(
        { name: "Server Age: ", value: answer, inline: true },
        { name: "Roles", value: `${int.guild?.roles.cache.size} roles`, inline: true },
        {
          name: "Channels:",
          value: `Total: ${
            textChannels + voiceChannels
          }\n text: ${textChannels} | voice: ${voiceChannels}`,
          inline: true,
        }
      )
      .setColor("White")
      .setFooter({ text: `requested by ${int.user.username}`, iconURL: `${int.user.avatarURL()}` });
    await int.editReply({ embeds: [reply] });
  },
};
