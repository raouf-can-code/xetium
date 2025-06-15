import type { Client } from "discord.js";

export default {
  name: "ping",
  description: "test the response time of the bot",
  category: "utils",
  global: true,
  dmPermission: false,

  callback: async (client: Client, int: any) => {
    await int.deferReply();

    const reply = await int.fetchReply();

    const ping = reply.createdTimestamp - int.createdTimestamp;

    await int.editReply(`Pong 🏓\nResponse Time: ${ping}ms\nWebsocket: ${client.ws.ping}ms`);
  },
};
