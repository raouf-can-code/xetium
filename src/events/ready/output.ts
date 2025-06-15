import type { Client } from "discord.js";
export default function (client: Client) {
  console.log(`${client.user?.username} is online`);
}
