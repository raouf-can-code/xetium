import { Client, TextChannel, type GuildMember } from "discord.js";
export default async function (member: GuildMember, client: Client) {
  const TARGET_GUILD_ID = "1245634459651539037";
  if (member.guild.id !== TARGET_GUILD_ID) return;

  if (!member.guild.id) return;
  if (member.user.bot) return;
  const newMmbr = member.user;
  const targetChannelID = "1245634814913286254"; //add  the id of the channel that you want the bot to welcome the new member
  const channel = client.channels.cache.get(targetChannelID);
  const msg = `اهلا و سهلا بك يا ${newMmbr.username}!\nمرحبا بك في سيرفر ${member.guild.name}\n نتمنى لك وقتا ممتعا مليئا بالعلم و المعرفة`; //add the message
  try {
    if (channel && channel.isTextBased())
      await (channel as TextChannel).send(msg);
  } catch (err) {
    console.error(err);
  }
}
