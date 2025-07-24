import { ApplicationCommandOptionType, type Client } from "discord.js";

export default {
  name: "echo",
  description: "tell the bot to say somthing",
  options: [
    {
      name: "message",
      description: "what the bot will say",
      type: ApplicationCommandOptionType.String,
      required: true,
    },
  ],
  category: "utils",
  devOnly: true,
  global: true,
  dmPermission: false,
  callback: async (client: Client, int: any) => {
    const msg = int.options.get("message").value;
    try {
      await int.channel?.send(msg);
      await int.reply({ content: "done", ephemeral: true });
    } catch (error) {
      await int.reply({ content: "error", ephemeral: true });
    }
    return;
  },
};
