import {
  Bot,
  webhookCallback,
} from "https://deno.land/x/grammy@v1.20.3/mod.ts";

const kv = await Deno.openKv();

const token = Deno.env.get("BOT_TOKEN");
if (!token) {
  throw new Error("환경 변수 'BOT_TOKEN'이 설정되지 않았습니다.");
}

const bot = new Bot(token);

bot.command("start", (ctx) => {
  return ctx.reply(
    "반갑습니다! 이름을 알려주시면 기억해 드릴게요.\n예) '이름: 루비'라고 입력해 보세요.",
  );
});

bot.on("message:text", async (ctx) => {
  const userId = ctx.from.id;
  const text = ctx.message.text;

  console.log(`[수신] ID: ${userId}, 내용: ${text}`);

  if (text.startsWith("이름:")) {
    const name = text.replace("이름:", "").trim();

    await kv.set(["users", userId, "name"], name);
    console.log(`[저장] 사용자 ${userId}의 이름을 ${name}으로 저장함`);
    return ctx.reply(`기억했습니다! 이제 ${name}님이라고 불러드릴게요.`);
  }

  const entry = await kv.get<string>(["users", userId, "name"]);
  const savedName = entry.value;

  if (savedName) {
    return ctx.reply(`${savedName}님, 보낸 메시지를 확인했습니다: "${text}"`);
  } else {
    return ctx.reply(
      `아직 이름을 모르겠어요. '이름: [이름]' 형식으로 알려주세요!`,
    );
  }
});

Deno.serve(async (req) => {
  if (req.method === "POST") {
    const url = new URL(req.url);
    if (url.pathname.slice(1) === token) {
      try {
        return await webhookCallback(bot, "std/http")(req);
      } catch (err) {
        console.error("Webhook 에러:", err);
      }
    }
  }
  return new Response("봇 서버가 작동 중입니다.", { status: 200 });
});
