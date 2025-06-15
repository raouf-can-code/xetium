import {
  StringSelectMenuBuilder,
  StringSelectMenuOptionBuilder,
  ActionRowBuilder,
  type ChatInputCommandInteraction,
  type Interaction,
  type Client,
  EmbedBuilder,
  ComponentType,
} from "discord.js";
import getLocalCommands from "../../utils/getLocalCommands";

export default {
  name: "help",
  description: "you don't know how to use the bot?",
  global: true,
  dmPermission: false,
  category: "utils",

  callback: async (client: Client, int: Interaction & ChatInputCommandInteraction) => {
    const opt = [
      {
        label: "Utilities",
        description: "Utilities commands like (avatar, ping...)",
        value: "utils",
        emoji: "🔧",
      },
      {
        label: "Management",
        description: "Commands you use to manage the server",
        value: "management",
        emoji: "💼",
      },
      {
        label: "Moderation",
        description: "Commands used to moderate the server",
        value: "moderation",
        emoji: "🛠️",
      },
    ];

    // Create select menu
    const helpMenu = new StringSelectMenuBuilder()
      .setCustomId(int.id)
      .setPlaceholder("Choose a category...")
      .addOptions(
        opt.map((el) =>
          new StringSelectMenuOptionBuilder()
            .setLabel(el.label)
            .setDescription(el.description)
            .setValue(el.value)
            .setEmoji(el.emoji)
        )
      );

    const actionRow = new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(helpMenu);

    // Get commands
    interface cmdList {
      name: string;
      description: string;
      category: string;
    }

    const localCommands = await getLocalCommands();
    const arr: cmdList[] = localCommands.map(({ name, description, category }) => ({
      name,
      description,
      category,
    }));

    const managementCommands = arr.filter((el) => el.category === "management");
    const moderationCommands = arr.filter((el) => el.category === "moderation");
    const utilsCommands = arr.filter((el) => el.category === "utils");

    // Create embed
    function createEmbed(ctg: cmdList[]) {
      const embed = new EmbedBuilder().setTitle(`${ctg[0].category} Commands:`).setColor("#ffffff");

      for (const el of ctg) {
        embed.addFields({ name: `/${el.name}`, value: el.description });
      }

      return embed;
    }

    // Send initial embed with utils commands
    const initialEmbed = createEmbed(utilsCommands);
    const reply = await int.reply({
      embeds: [initialEmbed],
      components: [actionRow],
      fetchReply: true,
    });

    // Collector for menu interaction
    const collector = reply.createMessageComponentCollector({
      componentType: ComponentType.StringSelect,
      filter: (i) => i.user.id === int.user.id && i.customId === int.id,
      time: 60000,
    });

    collector.on("collect", async (menuInt) => {
      let embed;

      switch (menuInt.values[0]) {
        case "management":
          embed = createEmbed(managementCommands);
          break;
        case "moderation":
          embed = createEmbed(moderationCommands);
          break;
        case "utils":
          embed = createEmbed(utilsCommands);
          break;
        default:
          embed = new EmbedBuilder().setDescription("Unknown category").setColor("Red");
      }

      await menuInt.update({
        embeds: [embed],
        components: [actionRow], // Keep the menu
      });
    });
  },
};

//this command is simple but it took me 3 days to create it because i made it in a "dynamic" way
//this shows you how i hate my self and i will go back to react and NextJS and never see discorJS again
//chat gpt helped me about not making this command spamable
