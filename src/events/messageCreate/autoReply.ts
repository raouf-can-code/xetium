import type { Client, Message } from "discord.js";

interface Reply {
  msg: string[];
  msgReply: string[];
  inc: boolean;
}

function random(min: number = 0, max: number = 1): number {
  if (min === 0 && max === 1) {
    return Math.random();
  } else {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
}

const replies: Reply[] = [
  {
    msg: ["سلام عليكم"],
    msgReply: ["و عليكم السلام و رحمة الله و بركاته"],
    inc: true,
  },
  {
    msg: ["وداعا", "الى اللقاء", "سلام", "بروح"],
    msgReply: ["دمت في رعاية الله", "سلام", "وداعا"],
    inc: false,
  },
  { msg: ["هلا", "اهلا"], msgReply: ["اهلا بك"], inc: false },
  { msg: ["."], msgReply: ["تحاول تثبت وجودك؟"], inc: false },
];
export default async function (msg: Message, client: Client) {
  if (msg.author.bot) return;
  for (const reply of replies) {
    for (const rep of reply.msg) {
      if (msg.content.includes(rep)) {
        if (reply.inc) {
          const max = reply.msgReply.length - 1;
          await msg.reply(reply.msgReply[random(0, max)]);
          return;
        }
      }

      if (msg.content === rep) {
        const max = reply.msgReply.length - 1;
        await msg.reply(reply.msgReply[random(0, max)]);
      }
    }
  }
}
