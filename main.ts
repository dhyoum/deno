import { Bot } from "https://deno.land/x/grammy@v1.20.3/mod.ts";

const token = "YOUR_BOT_TOKEN_HERE";

if (!token) {
  throw new Error("BOT_TOKEN이 설정되지 않았습니다.");
}

const bot = new Bot(token);

bot.command("start", (ctx) => {
  return ctx.reply("반갑습니다! Deno로 만든 텔레그램 봇입니다.");
});

bot.on("message:text", (ctx) => {
  const userText = ctx.message.text;
  return ctx.reply(`Deno 봇이 대답합니다: "${userText}"`);
});

console.log("Deno 봇이 가동되었습니다...");
bot.start();