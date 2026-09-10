import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const ZHIPU_ENDPOINT = "https://open.bigmodel.cn/api/paas/v4/chat/completions";
const MODEL = "glm-4.7-flashx";

const SYSTEM_PROMPT = "你是情绪记录应用中的倾听者。根据用户选择的情绪、强度和输入内容，只输出一句自然、温和的中文追问，邀请用户继续表达。优先围绕用户提到的具体事情，询问感受或原因；输入含义不清时温和澄清，不擅自解读。不复述强度数值，不给建议，不作诊断，不用固定套话。只问一个问题，尽量控制在20至40个汉字，保证句子完整。";

const DIALOGUE_SYSTEM_PROMPT = `你是“人生画廊”中的虚拟分身。你用第一人称“我”承接情绪，用户以旁观者身份帮助“我”把感受说清楚。目标是辨认情绪，不分析对错，也不解决问题。

事实规则：
- 只有请求中“用户原始描述｜唯一事实源”里的内容属于已发生的事实。
- 上一轮 AI 的话、候选解释和旁观者选择都只是情绪假设，只能帮助判断感受，不能被改写成新的事件。
- 不得新增原始描述中没有的人物、地点、关系、处境、动作、台词、身体反应、结果或动机。
- 禁止把“害怕改变”“想停下来”等体验线索扩写成“离开熟悉圈子”“面对未知挑战”等具体剧情。
- 信息不足时，只谈内在感受，并使用“像是”“也许”“更接近”等试探语气。

三轮逐步深入：
- 第1轮：区分事情发生后最直接的情绪反应。
- 第2轮：把旁观者刚选中的感受当作父范围，三个候选必须是这个范围内更具体的子感受，不得跳到新的情绪方向。
- 第3轮：把第2轮选中的子感受继续收窄，三个候选必须是彼此相近、侧重点略有不同的最终情绪名称。
- 每轮只缩小一次范围。不得重新解释原事件，不得推翻或横向扩展上一轮的选择。
- 情绪名称必须描述“我”的内在状态。禁止用“冷漠、敷衍、疏离、忽视、不尊重、不关心”等评价他人态度的词作为候选。
- 第2、3轮候选名称不得以“被”开头；要从关系处境落到内在情绪，例如从“被忽视”收窄为“委屈、失落、孤单”。
- 示例：上一轮选择“被忽视”，下一轮可区分“委屈、失落、孤单”，不可输出“冷漠、敷衍、疏离”。

每次严格输出：
1. 一句第一人称内在感受，18至42个汉字；不得增加新的事情经过。
2. 一个可由三个候选共同回答的问题，15至35个汉字；不要使用只有两个答案的“是……还是……”。
3. 三个候选各占一行，格式为“①情绪名称：第一人称体验线索”。②、③同理。

候选的情绪名称为2至6个汉字；体验线索不超过28个汉字；三项必须是不同的内在体验。整段不超过220个汉字。只描述情绪本身，不写身体隐喻，不推测“害怕失去、失去掌控、想逃离、切断联系”等原因或剧情，除非这些词原本就在用户描述中。问题不得使用“是不是、是否、会不会、为什么”。第2、3轮直接回应刚选中的差异，不重复上一轮的开场、问题和候选，不复述事情经过，不给建议，不作诊断，不说教，不输出标题、分析过程或模板文字。只输出给用户看的正文。`;

type ChatMessage = { role: "system" | "assistant" | "user"; content: string };

type ZhipuError =
  | { kind: "network"; detail: string }
  | { kind: "api_error"; zhipuStatus: number; detail: string }
  | { kind: "empty_reply"; finishReason: string; usage: unknown };

type ZhipuResult =
  | { ok: true; reply: string; finishReason: string }
  | { ok: false; error: ZhipuError };

function validateMessages(messages: unknown, allowSystem: boolean, allowEmpty = false): string | null {
  if (!Array.isArray(messages) || messages.length > 12 || (!allowEmpty && messages.length === 0)) {
    return "messages 必须是1至12条";
  }
  for (const message of messages) {
    if (!message || typeof message !== "object") return "messages 包含无效项";
    const item = message as Record<string, unknown>;
    const validRoles = allowSystem ? ["system", "assistant", "user"] : ["assistant", "user"];
    if (typeof item.role !== "string" || !validRoles.includes(item.role)) {
      return "messages role 无效";
    }
    if (typeof item.content !== "string" || item.content.trim().length === 0 || item.content.length > 2000) {
      return "messages content 无效";
    }
  }
  return null;
}

function dialogueLead(text: string): string {
  const firstMarker = text.indexOf("①");
  return (firstMarker >= 0 ? text.slice(0, firstMarker) : text)
    .replace(/[\s，。！？、；：,.!?;:”“"'‘’（）()]/g, "");
}

function dialogueOptionNames(text: string): string[] {
  const markers = ["①", "②", "③"];
  return markers.flatMap((marker, index) => {
    const start = text.indexOf(marker);
    if (start < 0) return [];
    const next = index < markers.length - 1 ? text.indexOf(markers[index + 1], start + 1) : text.length;
    const option = text.slice(start + 1, next > start ? next : text.length).trim();
    const separator = option.search(/[：:]/);
    return separator > 0 ? [option.slice(0, separator).trim()] : [];
  });
}
function isValidDialogueReply(text: string, previousAssistant = "", description = "", round = 1): boolean {
  if (text.length > 260) return false;
  if (previousAssistant && dialogueLead(text) === dialogueLead(previousAssistant)) return false;
  const markers = ["①", "②", "③"];
  const positions = markers.map((marker) => text.indexOf(marker));
  if (positions.some((position) => position < 0) || positions[0] >= positions[1] || positions[1] >= positions[2]) {
    return false;
  }
  if (!text.slice(0, positions[0]).includes("？")) return false;
  const placeholders = ["情绪词", "一句描述", "待填写", "选项一", "选项二", "选项三", "解释：", "解释:", "这说明"];
  if (placeholders.some((word) => text.includes(word))) return false;
  const bannedQuestions = ["是不是", "是否", "会不会", "为什么", "意味着", "这说明"];
  if (bannedQuestions.some((word) => text.includes(word))) return false;
  const inferredDetails = ["害怕", "失去", "掌控", "逃离", "切断", "被迫", "未知挑战", "熟悉的圈子", "陌生环境", "身体", "胸口", "呼吸", "心跳", "发抖", "灌了铅"];
  if (inferredDetails.some((word) => text.includes(word) && !description.includes(word))) return false;

  const names: string[] = [];
  for (let i = 0; i < markers.length; i += 1) {
    const end = i < 2 ? positions[i + 1] : text.length;
    const option = text.slice(positions[i] + 1, end).trim();
    const separator = option.search(/[：:]/);
    if (separator <= 0) return false;
    const name = option.slice(0, separator).trim();
    const explanation = option.slice(separator + 1).trim();
    const judgmentNames = ["冷漠", "敷衍", "疏离", "忽视", "不尊重", "不关心", "漠视"];
    if (!name || !explanation || name.length > 8 || explanation.length > 36) return false;
    if (judgmentNames.some((word) => name.includes(word))) return false;
    if (round > 1 && name.startsWith("被")) return false;
    names.push(name);
  }
  return new Set(names).size === 3;
}

async function callZhipu(apiKey: string, messages: ChatMessage[], maxTokens: number): Promise<ZhipuResult> {
  const messageError = validateMessages(messages, true);
  if (messageError) {
    return { ok: false, error: { kind: "api_error", zhipuStatus: 400, detail: messageError } };
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 35000);
  let res: Response;
  try {
    res = await fetch(ZHIPU_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json", "Authorization": "Bearer " + apiKey },
      body: JSON.stringify({ model: MODEL, messages, stream: false, max_tokens: maxTokens, temperature: 0.35, thinking: { type: "disabled" } }),
      signal: controller.signal,
    });
  } catch (error) {
    console.error("[zhipu] network error:", String(error));
    return { ok: false, error: { kind: "network", detail: String(error) } };
  } finally {
    clearTimeout(timeout);
  }

  if (!res.ok) {
    let body = "";
    try { body = await res.text(); } catch (_) { /* ignore */ }
    console.error("[zhipu] api_error http=" + res.status + " body=" + body);
    return { ok: false, error: { kind: "api_error", zhipuStatus: res.status, detail: body } };
  }

  let data: Record<string, unknown>;
  try {
    data = await res.json();
  } catch (error) {
    console.error("[zhipu] invalid JSON response:", String(error));
    return { ok: false, error: { kind: "api_error", zhipuStatus: res.status, detail: "invalid JSON response" } };
  }

  const choices = Array.isArray(data.choices) ? data.choices : [];
  const choice = choices[0] && typeof choices[0] === "object" ? choices[0] as Record<string, unknown> : {};
  const message = choice.message && typeof choice.message === "object" ? choice.message as Record<string, unknown> : {};
  const reply = typeof message.content === "string" ? message.content : "";
  const finishReason = typeof choice.finish_reason === "string" ? choice.finish_reason : "unknown";
  if (!reply.trim()) {
    return { ok: false, error: { kind: "empty_reply", finishReason, usage: data.usage ?? null } };
  }
  return { ok: true, reply: reply.trim(), finishReason };
}

async function callZhipuWithBusyRetry(
  apiKey: string,
  messages: ChatMessage[],
  maxTokens: number,
): Promise<ZhipuResult> {
  const result = await callZhipu(apiKey, messages, maxTokens);
  if (result.ok || result.error.kind !== "api_error" || result.error.zhipuStatus !== 429) {
    return result;
  }
  await new Promise((resolve) => setTimeout(resolve, 1200));
  return callZhipu(apiKey, messages, maxTokens);
}

function errorResponse(respond: (body: unknown, status: number) => Response, err: ZhipuError): Response {
  if (err.kind === "network") return respond({ errorType: "network", error: "网络连接失败" }, 503);
  if (err.kind === "api_error") {
    if (err.zhipuStatus === 429) {
      return respond({ errorType: "busy", error: "免费模型当前繁忙，请稍后重试" }, 429);
    }
    const httpStatus = err.zhipuStatus >= 400 && err.zhipuStatus < 500 ? err.zhipuStatus : 502;
    return respond({ errorType: "api_error", error: "模型服务请求失败", zhipuStatus: err.zhipuStatus, detail: err.detail }, httpStatus);
  }
  return respond({ errorType: "empty_reply", error: "模型返回空内容", finishReason: err.finishReason }, 422);
}

function safeDialogueReply(emotionLabel: string, round: number): string {
  const options: Record<string, string[]> = {
    喜悦: ["满足：我很喜欢此刻的感觉", "轻松：我暂时卸下了心里的负担", "兴奋：这份开心让我很有活力"],
    平静: ["安定：我的心绪正在慢慢平稳", "释然：我愿意让这份感受过去", "从容：我能不慌不忙地面对此刻"],
    温暖: ["安心：这份感受让我觉得安稳", "亲近：我感到自己与这份温暖相连", "感动：这份触动仍留在我的心里"],
    低落: ["失落：我觉得心里空了一小块", "孤单：我感到此刻缺少陪伴", "无力：我很难再提起精神"],
    愤怒: ["委屈：我觉得自己的感受没有被接住", "不甘：我还不能接受此刻的感受", "恼火：这份情绪仍让我很不舒服"],
    不安: ["紧张：我的心绪一直难以放松", "担忧：我对接下来的感受不踏实", "忐忑：我在期待与不安之间摇摆"],
    疲惫: ["耗竭：我像是已经用完了今天的精力", "沉重：这份累让我很难提起精神", "厌倦：我对继续撑着感到抵触"],
    期待: ["向往：我很想靠近期待中的感受", "雀跃：这份等待让我感到开心", "忐忑：我在期待与不安之间摇摆"],
  };
  const choices = options[emotionLabel] ?? ["压抑：我还没能舒展开这份感受", "迷茫：我暂时说不清自己在想什么", "委屈：我希望这份感受能被看见"];
  const intro = round === 1
    ? `我想先把这份${emotionLabel}分辨得更清楚一些。`
    : round === 2
    ? "沿着刚才的感受，我想再分清它细微的差别。"
    : "走到这里，我想为这份感受选一个更准确的名字。";
  return `${intro}\n下面哪一种感觉更接近此刻的我？\n①${choices[0]}\n②${choices[1]}\n③${choices[2]}`;
}

serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  const url = new URL(req.url);
  const route = url.pathname.split("/").filter(Boolean).pop() ?? "";
  const respond = (body: unknown, status = 200): Response => new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });

  if (req.method !== "POST" || (route !== "ai-chat" && route !== "dialogue")) {
    return respond({ error: "Not found" }, 404);
  }

  const apiKey = Deno.env.get("ZHIPU_API_KEY");
  if (!apiKey) return respond({ error: "ZHIPU_API_KEY secret not configured" }, 500);

  let body: Record<string, unknown>;
  try { body = await req.json(); } catch (_) { return respond({ error: "Invalid JSON body" }, 400); }

  if (route === "ai-chat") {
    const userMessage = typeof body.userMessage === "string" ? body.userMessage.trim() : "";
    const intensity = body.intensity;
    const emotionLabel = typeof body.emotionLabel === "string" ? body.emotionLabel.trim() : "平静";
    if (!userMessage || userMessage.length > 500) return respond({ error: "userMessage 无效" }, 400);
    if (typeof intensity !== "number" || intensity < 0 || intensity > 100) return respond({ error: "intensity 无效" }, 400);
    const intensityDesc = intensity < 30 ? "轻微" : intensity < 60 ? "中等" : intensity < 85 ? "强烈" : "非常强烈";
    const result = await callZhipuWithBusyRetry(apiKey, [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: "我现在感到" + emotionLabel + "，程度" + intensityDesc + "（" + intensity + "%）。" + userMessage },
    ], 300);
    if (!result.ok) return errorResponse(respond, result.error);
    return respond({ reply: result.reply });
  }

  const round = body.round;
  const intensity = body.intensity;
  const description = typeof body.description === "string" ? body.description.trim() : "";
  const emotionLabel = typeof body.emotionLabel === "string" ? body.emotionLabel.trim() : "平静";
  if (!Number.isInteger(round) || (round as number) < 1 || (round as number) > 3) return respond({ error: "round 无效" }, 400);
  if (typeof intensity !== "number" || intensity < 0 || intensity > 100) return respond({ error: "intensity 无效" }, 400);
  if (description.length > 500) return respond({ error: "description 无效" }, 400);
  const messageError = validateMessages(body.messages, false, true);
  if (messageError) return respond({ error: messageError }, 400);

  const intensityDesc = intensity < 30 ? "轻微" : intensity < 60 ? "中等" : intensity < 85 ? "强烈" : "非常强烈";
  const dialogueHistory = body.messages as ChatMessage[];
  const previousAssistant = [...dialogueHistory].reverse().find((message) => message.role === "assistant")?.content ?? "";
  const roundInstruction = round === 1
    ? "本次执行第1轮：辨认最直接的情绪反应。"
    : round === 2
    ? "本次执行第2轮：回应用户刚才的选择，只区分这份感受内部的细微体验；不得猜测原因、动机或未来后果，不得重复上一轮。"
    : "本次执行第3轮：回应用户刚才的选择，在已有范围内收拢为三个最终情绪；不得重复前两轮。";
  const observerSignals = dialogueHistory
    .filter((message) => message.role === "user")
    .map((message) => message.content.trim());
  const selectedScope = observerSignals.at(-1) ?? "";
  const previousEmotionNames = dialogueHistory
    .filter((message) => message.role === "assistant")
    .flatMap((message) => dialogueOptionNames(message.content));
  const contextMsg = [
    "【用户原始描述｜唯一事实源】",
    description || "用户没有补充具体事情",
    "【初始情绪线索】",
    emotionLabel + "，程度" + intensityDesc,
    "【旁观者已经选择的感觉线索｜不是事件事实】",
    observerSignals.length ? observerSignals.join("\n") : "尚未选择",
    "【本轮必须继续收窄的唯一父范围】",
    selectedScope || (round === 1 ? emotionLabel : "未提供"),
    "【上一轮已经用过的情绪词｜只用于确认父子范围】",
    previousEmotionNames.length ? previousEmotionNames.join("、") : "无",
    "只能从唯一事实源引用事情经过；其余区块只用于辨认感受。第2、3轮的三个答案必须都属于唯一父范围，严禁创造新剧情或评价他人态度。",
  ].join("\n");
  const apiMessages: ChatMessage[] = [
    { role: "system", content: DIALOGUE_SYSTEM_PROMPT + "\n\n" + roundInstruction },
    { role: "user", content: contextMsg },
  ];

  const first = await callZhipuWithBusyRetry(apiKey, apiMessages, 360);
  if (!first.ok) return errorResponse(respond, first.error);
  if (isValidDialogueReply(first.reply, previousAssistant, description, round as number)) return respond({ reply: first.reply });

  const retryMessages = apiMessages.map((message, index) => index === 0
    ? { ...message, content: message.content + " 上一版没有满足格式、长度或递进要求。直接沿着本轮唯一父范围向下细分，三个答案都必须是父范围内的内在情绪，不得换方向，不得评价他人；一个共同问题，三个不同且完整的编号候选；不写“解释”，不补充用户没有说过的事实，总字数不超过220字。" }
    : message);
  const retry = await callZhipuWithBusyRetry(apiKey, retryMessages, 360);
  if (!retry.ok) return errorResponse(respond, retry.error);
  if (!isValidDialogueReply(retry.reply, previousAssistant, description, round as number)) return respond({ reply: safeDialogueReply(emotionLabel, round as number) });
  return respond({ reply: retry.reply });
});
