import type { Client, GuildMember } from "discord.js";
export default async function (member: GuildMember, client: Client) {
  const autoRole: string = ""; //the role that members get whene they join
  const botAutoRole: string = ""; //the role that bots get whene they join
  if (member.user.bot) {
    if (botAutoRole) {
      try {
        await member.roles.add(botAutoRole);
      } catch (err) {
        console.error(err);
      }
    } else return;
  } else {
    if (autoRole) {
      try {
        await member.roles.add(autoRole);
      } catch (err) {
        console.error(err);
      }
    } else return;
  }
}
