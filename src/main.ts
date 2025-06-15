import { Client, IntentsBitField } from "discord.js";
import dotenv from "dotenv";
import eventHandler from "./handlers/eventHandler";
dotenv.config();

const xetium = new Client({
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMembers,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.MessageContent,
    IntentsBitField.Flags.GuildVoiceStates,
  ],
});

eventHandler(xetium);

xetium.login(process.env.TOKEN);
