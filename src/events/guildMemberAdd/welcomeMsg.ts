import { type Client, type GuildMember, type TextBasedChannel } from "discord.js";
export default async function (member: GuildMember, client: Client) {
  if (!member.guild.id) return;
  if (member.user.bot) return;

  const newMmbr = member.user;
  const targetChannelID = ""; //add  the id of the channel that you want the bot to welcome the new member
  const channel = await client.channels.cache.get(targetChannelID);

  if (!channel) return;
  if (channel.isTextBased()) return;

  const msg = ``; //add the message

  await channel.send(msg); //useless error as the other ts silly errors
}
