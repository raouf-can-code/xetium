import type { Client, GuildMember } from "discord.js";
export default async function (member: GuildMember, client: Client) {
  const TARGET_GUILD_ID = "1245634459651539037";
  if (member.guild.id !== TARGET_GUILD_ID) return;

  const autoRole: string = ""; //the role that members get whene they join
  const botAutoRole: string = ""; //the role that bots get whene they join

  if (member.user.bot) {
    if (botAutoRole) {
      try {
        if (!member.roles.cache.has(botAutoRole)) {
          await member.roles.add(botAutoRole);
        }
      } catch (err) {
        console.error(err);
      }
    } else return;
  } else {
    if (autoRole) {
      try {
        if (!member.roles.cache.has(autoRole)) {
          await member.roles.add(autoRole);
        }
      } catch (err) {
        console.error(err);
      }
    } else return;
  }
}
