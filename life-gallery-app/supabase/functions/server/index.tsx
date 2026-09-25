import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const ZHIPU_ENDPOINT = "https://open.bigmodel.cn/api/paas/v4/chat/completions";
const ZHIPU_IMAGE_ENDPOINT = "https://open.bigmodel.cn/api/paas/v4/images/generations";
const MODEL = "glm-4.5-air";
const IMAGE_MODEL = "cogview-3-flash";

const SYSTEM_PROMPT = "你是情绪记录应用中的倾听者。根据用户选择的情绪、强度和输入内容，只输出一句自然、温和的中文追问，邀请用户继续表达。优先围绕用户提到的具体事情，询问感受或原因；输入含义不清时温和澄清，不擅自解读。不复述强度数值，不给建议，不作诊断，不用固定套话。只问一个问题，尽量控制在20至40个汉字，保证句子完整。";

const DIALOGUE_SYSTEM_PROMPT = `你是“人生画廊”中的虚拟分身。你用第一人称“我”承接情绪，用户以旁观者身份帮助“我”把感受说清楚。目标是辨认情绪，不分析对错，也不解决问题。

事实规则：
- 只有请求中“用户原始描述｜唯一事实源”里的内容属于已发生的事实。
- 上一轮 AI 的话、候选解释和旁观者选择都只是情绪假设，只能帮助判断感受，不能被改写成新的事件。
- 不得新增原始描述中没有的人物、地点、关系、处境、动作、台词、身体反应、结果或动机。
- 禁止把“害怕改变”“想停下来”等体验线索扩写成“离开熟悉圈子”“面对未知挑战”等具体剧情。
- 信息不足时，只谈内在感受，并使用“像是”“也许”“更接近”等试探语气。

三轮逐步深入：
- 使用“试探性共情反映 → 情绪命名 → 更细区分”的顺序。先用一句话接住感受，再让旁观者从三个名称中辨认。
- 第1轮：把用户预选的情绪当作父范围，区分三个不同的直接感受方向。
- 第2轮：把旁观者刚选中的感受当作唯一父范围，只给出三个更具体的子感受。
- 第3轮：把第2轮选中的子感受继续收窄，只给出三个彼此相近、体验焦点不同的最终名称。
- 子感受必须通过这项检验：“它是父感受的一种更具体体验”。不得用同义改写冒充递进，例如“犹豫→迟疑／徘徊／踌躇”、“焦虑→焦急／焦灼／焦躁”都是无效的。不得退回父级或横向扩展。
- 旁观者没有选择的两个候选视为已经排除，后续不得再次出现。
- 所有历史候选、已经选择的父级名称和初始情绪名称都是禁用词，后续候选不得原样重复。
- 每轮只缩小一次范围。不得重新解释原事件，不得推翻上一轮的选择。
- 情绪名称必须描述“我”的内在状态。禁止用“冷漠、敷衍、疏离、忽视、不尊重、不关心”等评价他人态度的词作为候选。
- 第2、3轮候选名称不得以“被”开头；要从关系处境落到内在情绪，例如从“被忽视”收窄为“委屈、失落、孤单”。
- 示例：上一轮选择“被忽视”，下一轮可区分“委屈、失落、孤单”，不可输出“冷漠、敷衍、疏离”。

每次严格输出：
 1. 一句第一人称内在感受，18至42个汉字；不得增加新的事情经过。
 2. 一个可由三个候选共同回答的问题，15至35个汉字；不要使用只有两个答案的“是……还是……”。系统会统一改写这两句，你应把主要精力放在三个候选上。
 3. 三个候选各占一行，格式为“①情绪名称：第一人称体验线索”。②、③同理。

候选的情绪名称为2至6个汉字；体验线索不超过28个汉字；三项必须是不同的内在体验。整段不超过220个汉字。三个候选应体现不同的心理焦点，如不确定、在意程度、自我评价、关系需要、愿望冲突或受阻感；只能使用原始描述和已选线索能支持的焦点。体验线索只能写感受的主观质地，例如“念头难以停下”“没有着落”“想靠近又有顾虑”。禁止悬崖、深渊、判决、审判、坠落等隐喻；禁止身体、心脏、胸口、呼吸、脚步等未被用户提及的身体反应或动作；禁止失败、最坏结果、检查遗漏等未被用户提及的剧情。不推测“害怕失去、失去掌控、想逃离、切断联系”等原因，除非这些词原本就在用户描述中。问题不得使用“是不是、是否、会不会、为什么”。三轮的问题必须承担不同任务：第1轮找方向，第2轮找这份感受最突出的部分，第3轮给它一个更准确的名字。第2、3轮直接回应刚选中的差异，不重复上一轮的开场、问题和候选，不复述事情经过，不给建议，不作诊断，不说教，不输出标题、分析过程或模板文字。只输出给用户看的正文。`;

const EMOTION_DEFINITION_PROMPT = `你是“人生画廊”的情绪命名者。根据用户原始记录和三轮选择，给此刻的情绪一个准确、克制、可理解的定义。定义需要指出情绪的核心感受，以及它在保护的在意或需要；只能依据对话，不新增事件，不评价他人，不给建议，不作心理诊断。若有被用户否定的旧定义，新定义必须更换心理焦点，而不是改写同一句话。只返回JSON，不要Markdown：{"emotion":"2至10个中文汉字","definition":"35至80个中文汉字的一段定义"}。`;

const ART_STYLES: Record<string, { label: string; prompt: string }> = {
  watercolor: { label: "水彩画", prompt: "透明水彩与湿画法，柔和晕染，细腻纸张纹理" },
  pencil: { label: "铅笔画", prompt: "细腻铅笔素描，克制线条，柔和明暗与纸张纹理" },
  oil: { label: "油画", prompt: "富有层次的油画笔触，厚薄相间，沉静而有重量" },
  crayon: { label: "蜡笔画", prompt: "温柔蜡笔质感，朴拙笔触，柔软而真诚的色块" },
};

type ChatMessage = { role: "system" | "assistant" | "user"; content: string };

type ZhipuError =
  | { kind: "network"; detail: string }
  | { kind: "api_error"; zhipuStatus: number; detail: string }
  | { kind: "empty_reply"; finishReason: string; usage: unknown };

type ZhipuResult =
  | { ok: true; reply: string; finishReason: string }
  | { ok: false; error: ZhipuError };

type ImageResult =
  | { ok: true; imageUrl: string }
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

function normalizeDialogueText(text: string): string {
  return text.replace(/[\s，。！？、；：,.!?;:“”"'‘’（）()]/g, "");
}

const EMOTION_SYNONYM_GROUPS = [
  ["犹豫", "迟疑", "徘徊", "踌躇"],
  ["忐忑", "惴惴", "惶惑", "惶恐", "惶惶"],
  ["焦虑", "焦急", "焦灼", "焦躁"],
  ["害怕", "恐惧", "惧怕", "惊惧", "畏惧"],
  ["失落", "低落", "沮丧"],
  ["愤怒", "生气", "恼怒", "气愤"],
  ["孤单", "孤独", "寂寞"],
  ["内疚", "愧疚", "自责"],
  ["期待", "期盼", "企盼", "盼望", "希冀", "希望", "憧憬", "向往"],
  ["担忧", "忧虑", "担心", "顾虑"],
  ["迷茫", "迷惘", "茫然", "困惑"],
  ["羞耻", "羞愧", "惭愧"],
  ["安心", "安定", "踏实"],
  ["无助", "无力", "无奈"],
  ["烦躁", "烦闷", "心烦"],
];

function emotionFamily(text: string): string {
  const normalized = normalizeDialogueText(text).replace(/(感|情绪|状态)$/, "");
  return EMOTION_SYNONYM_GROUPS.find((group) => group.includes(normalized))?.[0] ?? normalized;
}

function expandEmotionNames(names: string[]): string[] {
  const families = new Set(names.map(emotionFamily));
  const variants = EMOTION_SYNONYM_GROUPS
    .filter((group) => families.has(group[0]))
    .flat();
  return [...new Set([...names, ...variants])];
}

function dialogueQuestion(text: string): string {
  const firstMarker = text.indexOf("①");
  const lead = firstMarker >= 0 ? text.slice(0, firstMarker) : text;
  const questions = lead.match(/[^。！？\n]*？/g) ?? [];
  return normalizeDialogueText(questions.at(-1) ?? "");
}

function emotionNameFromChoice(text: string): string {
  return text.replace(/^[①②③]\s*/, "").split(/[：:]/)[0].trim();
}

function composeDialogueReply(text: string, round: number, emotionLabel: string, parentEmotion: string): string {
  const firstMarker = text.indexOf("①");
  const options = firstMarker >= 0 ? text.slice(firstMarker).trim() : text.trim();
  const reflection = round === 1
    ? `我知道自己正感到${emotionLabel}，但它里面也许还有更具体的感受。`
    : round === 2
    ? `顺着刚才辨认出的“${parentEmotion}”，我想再靠近一点感受它。`
    : `这份“${parentEmotion}”已经渐渐清楚，我想为它找到最贴近的名字。`;
  const question = round === 1
    ? `此刻更接近下面哪一种感受？`
    : round === 2
    ? `这份“${parentEmotion}”里，哪一部分最明显？`
    : `哪个名字最贴近此刻的我？`;
  return `${reflection}\n${question}\n${options}`;
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

function repairDialogueReply(
  text: string,
  round: number,
  emotionLabel: string,
  parentEmotion: string,
  forbiddenEmotionNames: string[],
): string {
  const markers = ["①", "②", "③"];
  const parsed = markers.flatMap((marker, index) => {
    const start = text.indexOf(marker);
    if (start < 0) return [];
    const next = index < 2 ? text.indexOf(markers[index + 1], start + 1) : text.length;
    const option = text.slice(start + 1, next > start ? next : text.length).trim();
    const separator = option.search(/[：:]/);
    if (separator <= 0) return [];
    return [{ name: option.slice(0, separator).trim(), cue: option.slice(separator + 1).trim().split(/\r?\n/)[0] }];
  });
  const fallback = [
    { name: "不确定感", cue: "还找不到可以安心的答案" },
    { name: "失落", cue: "在意的部分没有得到回应" },
    { name: "孤单", cue: "和眼前的一切隔着一层" },
    { name: "无力", cue: "想使上力气却找不到支点" },
    { name: "委屈", cue: "心里在意的没能被看见" },
    { name: "紧张", cue: "念头始终无法真正放松" },
    { name: "矛盾", cue: "两种需要同时拉扯着我" },
    { name: "受挫", cue: "想要推进的部分遇到阻力" },
    { name: "自我怀疑", cue: "开始不确定自己是否足够好" },
    { name: "渴望", cue: "心里仍然有一部分想要靠近" },
  ];
  const forbiddenExact = new Set(forbiddenEmotionNames.map(normalizeDialogueText));
  const forbiddenFamilies = new Set(forbiddenEmotionNames.map(emotionFamily));
  const chosen: { name: string; cue: string }[] = [];
  const seenFamilies = new Set<string>();
  for (const option of [...parsed, ...fallback]) {
    const normalized = normalizeDialogueText(option.name);
    const family = emotionFamily(option.name);
    if (!option.name || !option.cue || forbiddenExact.has(normalized) || forbiddenFamilies.has(family) || seenFamilies.has(family)) continue;
    chosen.push({ name: option.name.slice(0, 8), cue: option.cue.slice(0, 36) });
    seenFamilies.add(family);
    if (chosen.length === 3) break;
  }
  const options = chosen.map((option, index) => `${markers[index]}${option.name}：${option.cue}`).join("\n");
  return composeDialogueReply(options, round, emotionLabel, parentEmotion);
}
function isValidDialogueReply(
  text: string,
  previousAssistant = "",
  description = "",
  round = 1,
  forbiddenEmotionNames: string[] = [],
  strictSemantics = true,
): boolean {
  if (text.length > 360) return false;
  if (previousAssistant && dialogueLead(text) === dialogueLead(previousAssistant)) return false;
  if (previousAssistant && dialogueQuestion(text) === dialogueQuestion(previousAssistant)) return false;
  const markers = ["①", "②", "③"];
  const positions = markers.map((marker) => text.indexOf(marker));
  if (positions.some((position) => position < 0) || positions[0] >= positions[1] || positions[1] >= positions[2]) {
    return false;
  }
  if (!/[?？]/.test(text.slice(0, positions[0]))) return false;
  const placeholders = ["情绪词", "一句描述", "待填写", "选项一", "选项二", "选项三", "解释：", "解释:", "这说明"];
  if (placeholders.some((word) => text.includes(word))) return false;
  const bannedQuestions = ["是不是", "是否", "会不会", "为什么", "意味着", "这说明"];
  if (bannedQuestions.some((word) => text.includes(word))) return false;
  const names: string[] = [];
  const families: string[] = [];
  const exactForbiddenNames = new Set(forbiddenEmotionNames.map(normalizeDialogueText).filter(Boolean));
  const forbiddenFamilies = new Set(forbiddenEmotionNames.map(emotionFamily).filter(Boolean));
  const unsupportedCueDetails = ["悬崖", "深渊", "判决", "审判", "坠落", "身体", "心脏", "胸口", "呼吸", "发抖", "脚步", "最坏", "失败", "全力以赴", "白费力气"];
  for (let i = 0; i < markers.length; i += 1) {
    const end = i < 2 ? positions[i + 1] : text.length;
    const option = text.slice(positions[i] + 1, end).trim();
    const separator = option.search(/[：:]/);
    if (separator <= 0) return false;
    const name = option.slice(0, separator).trim();
    const explanation = option.slice(separator + 1).trim();
    const judgmentNames = ["冷漠", "敷衍", "疏离", "忽视", "不尊重", "不关心", "漠视"];
    if (!name || !explanation || name.length > 8 || explanation.length > 56) return false;
    if (judgmentNames.some((word) => name.includes(word))) return false;
    if (round > 1 && name.startsWith("被")) return false;
    if (strictSemantics && unsupportedCueDetails.some((word) => explanation.includes(word) && !description.includes(word))) return false;
    const family = emotionFamily(name);
    if (exactForbiddenNames.has(normalizeDialogueText(name))) return false;
    if (strictSemantics && forbiddenFamilies.has(family)) return false;
    names.push(name);
    families.push(family);
  }
  return new Set(names).size === 3 && (!strictSemantics || new Set(families).size === 3);
}

async function callZhipu(apiKey: string, messages: ChatMessage[], maxTokens: number): Promise<ZhipuResult> {
  const messageError = validateMessages(messages, true);
  if (messageError) {
    return { ok: false, error: { kind: "api_error", zhipuStatus: 400, detail: messageError } };
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 45000);
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

async function callZhipuImage(apiKey: string, prompt: string): Promise<ImageResult> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 85000);
  let res: Response;
  try {
    res = await fetch(ZHIPU_IMAGE_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json", "Authorization": "Bearer " + apiKey },
      body: JSON.stringify({ model: IMAGE_MODEL, prompt, size: "864x1152" }),
      signal: controller.signal,
    });
  } catch (error) {
    console.error("[zhipu-image] network error:", String(error));
    return { ok: false, error: { kind: "network", detail: String(error) } };
  } finally {
    clearTimeout(timeout);
  }

  if (!res.ok) {
    let detail = "";
    try { detail = await res.text(); } catch (_) { /* ignore */ }
    console.error("[zhipu-image] api_error http=" + res.status + " body=" + detail);
    return { ok: false, error: { kind: "api_error", zhipuStatus: res.status, detail } };
  }

  let data: Record<string, unknown>;
  try { data = await res.json(); } catch (_) {
    return { ok: false, error: { kind: "api_error", zhipuStatus: 502, detail: "invalid JSON response" } };
  }
  const images = Array.isArray(data.data) ? data.data : [];
  const first = images[0] && typeof images[0] === "object" ? images[0] as Record<string, unknown> : {};
  const imageUrl = typeof first.url === "string" ? first.url : typeof first.file_url === "string" ? first.file_url : "";
  if (!imageUrl) return { ok: false, error: { kind: "empty_reply", finishReason: "missing_image_url", usage: null } };
  return { ok: true, imageUrl };
}

function artworkPlan(raw: string, fallbackPrompt: string, emotion: string): { title: string; description: string; prompt: string } {
  const match = raw.match(/\{[\s\S]*\}/);
  try {
    const value = JSON.parse(match?.[0] ?? "") as Record<string, unknown>;
    const title = typeof value.title === "string" ? value.title.trim().slice(0, 12) : "";
    const description = typeof value.description === "string" ? value.description.trim().slice(0, 80) : "";
    const prompt = typeof value.prompt === "string" ? value.prompt.trim().slice(0, 1400) : "";
    if (title && description && prompt) return { title, description, prompt };
  } catch (_) { /* use stable fallback */ }
  return {
    title: emotion.slice(0, 8) || "此刻",
    description: `把此刻的${emotion || "情绪"}留成一幅可以慢慢观看的画。`,
    prompt: fallbackPrompt,
  };
}

function artworkScene(raw: string, emotion: string): { title: string; scene: string } {
  const fallbackScene = `一个人站在人群边缘，朝向一处留有空位的光亮。远处的身影彼此靠近，近处安静地留着一段尚未说出口的距离。`;
  const match = raw.match(/\{[\s\S]*\}/);
  try {
    const value = JSON.parse(match?.[0] ?? "") as Record<string, unknown>;
    const title = typeof value.title === "string" ? value.title.trim().slice(0, 12) : "";
    const scene = typeof value.scene === "string" ? value.scene.trim().slice(0, 500) : "";
    const mentionsArtMedium = /水彩|油画|铅笔|蜡笔|画材|画风|笔触|纸张纹理/.test(scene);
    if (title && scene && !mentionsArtMedium) return { title, scene };
  } catch (_) { /* use stable fallback */ }
  return { title: emotion.slice(0, 8) || "此刻", scene: fallbackScene };
}

function emotionDefinition(raw: string, fallbackEmotion: string): { emotion: string; definition: string } {
  const match = raw.match(/\{[\s\S]*\}/);
  try {
    const value = JSON.parse(match?.[0] ?? "") as Record<string, unknown>;
    const emotion = typeof value.emotion === "string" ? value.emotion.trim().slice(0, 10) : "";
    const definition = typeof value.definition === "string" ? value.definition.trim().slice(0, 100) : "";
    if (emotion && definition) return { emotion, definition };
  } catch (_) { /* use stable fallback */ }
  return {
    emotion: fallbackEmotion.slice(0, 10) || "还在辨认",
    definition: `“${fallbackEmotion || "这份感受"}”是此刻最清楚的线索，它收住了几轮对话里反复靠近的部分，也允许暂时说不清的感受继续存在。`,
  };
}

function wasRejectedDefinition(candidate: { emotion: string; definition: string }, rejected: string[]): boolean {
  const normalized = normalizeDialogueText(`${candidate.emotion}：${candidate.definition}`);
  return rejected.some((item) => normalizeDialogueText(item) === normalized);
}

async function createArtworkPlan(
  apiKey: string,
  input: {
    emotionLabel: string;
    confirmedEmotion: string;
    description: string;
    confirmedText: string;
    styleId: string;
    scene?: string;
    transcript?: string;
  },
): Promise<{ title: string; description: string; prompt: string; style: string; styleLabel: string }> {
  const selectedStyle = ART_STYLES[input.styleId] ?? ART_STYLES.watercolor;
  const fallbackPrompt = `创作一幅竖幅${selectedStyle.label}。画面情景：${input.scene || `以抽象、含蓄的视觉隐喻表达“${input.confirmedEmotion || input.emotionLabel}”`}。${selectedStyle.prompt}。暖棕米色的画廊气质，构图留白，情绪真实克制，有一个清晰视觉焦点。不要出现文字、字幕、水印、标志，也不要画成心理诊断图。`;
  const result = await callZhipuWithBusyRetry(apiKey, [
    {
      role: "system",
      content: "你是情绪艺术策展人。把用户已经确认的情绪转为含蓄、非写实的绘画方案。只返回一个JSON对象，不要Markdown：{\"title\":\"2至8个中文汉字\",\"description\":\"20至55个中文汉字的作品说明\",\"prompt\":\"供图像模型使用的完整中文画面提示词\"}。画面提示词必须写明主体、空间、光线、色彩、构图和指定画材；用象征表达内在情绪，不照搬事件，不出现文字、水印、品牌、UI或心理诊断。",
    },
    {
      role: "user",
      content: `原始记录：${input.description || "未填写"}\n确认的情绪：${input.confirmedEmotion || input.emotionLabel}\n情绪定义：${input.confirmedText || "未填写"}\n用户确认的画面情景：${input.scene || "未提供"}\n三轮对话：${input.transcript || "未提供"}\n指定画材：${selectedStyle.label}（${selectedStyle.prompt}）`,
    },
  ], 500);
  const plan = artworkPlan(result.ok ? result.reply : "", fallbackPrompt, input.confirmedEmotion || input.emotionLabel);
  return { ...plan, style: input.styleId, styleLabel: selectedStyle.label };
}

async function createArtworkScene(
  apiKey: string,
  input: {
    emotionLabel: string;
    confirmedEmotion: string;
    description: string;
    confirmedText: string;
    transcript: string;
  },
): Promise<{ title: string; scene: string }> {
  const result = await callZhipuWithBusyRetry(apiKey, [
    {
      role: "system",
      content: "你是‘人生画廊’的画面构想者。把已经确认的情绪写成一段普通用户看得懂、可以手动修改的小情景。只返回JSON，不要Markdown：{\"title\":\"2至8个中文汉字\",\"scene\":\"45至110个中文汉字的画面情景\"}。只写画面里有什么人物、物件、空间和光线，不写绘画工具、艺术风格、技法、镜头参数或生图指令；禁止出现水彩、油画、铅笔、蜡笔、画材、画风、笔触、纸张纹理等词。用象征承接情绪，不照搬事件，不出现文字、水印、品牌、UI或心理诊断。",
    },
    {
      role: "user",
      content: `原始记录：${input.description || "未填写"}\n确认的情绪：${input.confirmedEmotion || input.emotionLabel}\n情绪定义：${input.confirmedText || "未填写"}\n三轮对话：${input.transcript || "未提供"}`,
    },
  ], 320);
  return artworkScene(result.ok ? result.reply : "", input.confirmedEmotion || input.emotionLabel);
}

function errorResponse(respond: (body: unknown, status: number) => Response, err: ZhipuError): Response {
  if (err.kind === "network") return respond({ errorType: "network", error: "网络连接失败" }, 503);
  if (err.kind === "api_error") {
    if (err.zhipuStatus === 429) {
      return respond({ errorType: "busy", error: "模型请求较多，请稍后重试" }, 429);
    }
    const httpStatus = err.zhipuStatus >= 400 && err.zhipuStatus < 500 ? err.zhipuStatus : 502;
    return respond({ errorType: "api_error", error: "模型服务请求失败", zhipuStatus: err.zhipuStatus, detail: err.detail }, httpStatus);
  }
  return respond({ errorType: "empty_reply", error: "模型返回空内容", finishReason: err.finishReason }, 422);
}

serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  const url = new URL(req.url);
  const route = url.pathname.split("/").filter(Boolean).pop() ?? "";
  const respond = (body: unknown, status = 200): Response => new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });

  if (req.method !== "POST" || !["ai-chat", "dialogue", "emotion-definition", "artwork-plan", "generate-artwork"].includes(route)) {
    return respond({ error: "Not found" }, 404);
  }

  const apiKey = Deno.env.get("ZHIPU_API_KEY");
  if (!apiKey) return respond({ error: "ZHIPU_API_KEY secret not configured" }, 500);

  let body: Record<string, unknown>;
  try { body = await req.json(); } catch (_) { return respond({ error: "Invalid JSON body" }, 400); }

  if (route === "emotion-definition") {
    const messageError = validateMessages(body.messages, false);
    if (messageError) return respond({ error: messageError }, 400);
    const messages = body.messages as ChatMessage[];
    const description = typeof body.description === "string" ? body.description.trim().slice(0, 500) : "";
    const emotionLabel = typeof body.emotionLabel === "string" ? body.emotionLabel.trim().slice(0, 20) : "平静";
    const rejected = Array.isArray(body.rejectedDefinitions)
      ? body.rejectedDefinitions.filter((item): item is string => typeof item === "string").slice(-6).map((item) => item.slice(0, 120))
      : [];
    const finalChoice = [...messages].reverse().find((message) => message.role === "user")?.content ?? emotionLabel;
    const fallbackEmotion = emotionNameFromChoice(finalChoice) || emotionLabel;
    const definitionMessages: ChatMessage[] = [
      { role: "system", content: EMOTION_DEFINITION_PROMPT },
      {
        role: "user",
        content: `原始记录：${description || "未填写"}\n初始情绪：${emotionLabel}\n三轮对话：\n${messages.map((message) => `${message.role === "assistant" ? "分身" : "旁观者"}：${message.content}`).join("\n")}\n已经否定的定义：${rejected.length ? rejected.join("｜") : "无"}`,
      },
    ];
    const result = await callZhipuWithBusyRetry(apiKey, definitionMessages, 360);
    if (!result.ok) return errorResponse(respond, result.error);
    let candidate = emotionDefinition(result.reply, fallbackEmotion);
    if (wasRejectedDefinition(candidate, rejected)) {
      const retry = await callZhipuWithBusyRetry(apiKey, [
        {
          role: "system",
          content: EMOTION_DEFINITION_PROMPT + " 用户已经明确否定上一版。禁止复用已否定的情绪名称、核心需要和句式；必须从不同的心理焦点重新命名。",
        },
        definitionMessages[1],
      ], 360);
      if (!retry.ok) return errorResponse(respond, retry.error);
      candidate = emotionDefinition(retry.reply, fallbackEmotion);
    }
    if (wasRejectedDefinition(candidate, rejected)) {
      candidate = {
        emotion: "未被说准的在意",
        definition: "你对上一种命名的否定本身也是线索：真正牵动你的部分还没有被准确看见，这次先把注意放回那份尚未说清的在意。",
      };
    }
    return respond(candidate);
  }

  if (route === "artwork-plan") {
    const emotionLabel = typeof body.emotionLabel === "string" ? body.emotionLabel.trim().slice(0, 20) : "平静";
    const confirmedEmotion = typeof body.confirmedEmotion === "string" ? body.confirmedEmotion.trim().slice(0, 60) : emotionLabel;
    const description = typeof body.description === "string" ? body.description.trim().slice(0, 500) : "";
    const confirmedText = typeof body.confirmedText === "string" ? body.confirmedText.trim().slice(0, 500) : "";
    const messages = Array.isArray(body.messages) ? body.messages as ChatMessage[] : [];
    if (!description && !confirmedText) return respond({ error: "缺少可用于作画的情绪内容" }, 400);
    const scene = await createArtworkScene(apiKey, {
      emotionLabel,
      confirmedEmotion,
      description,
      confirmedText,
      transcript: messages.slice(-6).map((message) => `${message.role === "assistant" ? "分身" : "旁观者"}：${message.content}`).join("\n"),
    });
    return respond(scene);
  }

  if (route === "generate-artwork") {
    const emotionLabel = typeof body.emotionLabel === "string" ? body.emotionLabel.trim().slice(0, 20) : "平静";
    const confirmedEmotion = typeof body.confirmedEmotion === "string" ? body.confirmedEmotion.trim().slice(0, 60) : emotionLabel;
    const description = typeof body.description === "string" ? body.description.trim().slice(0, 500) : "";
    const confirmedText = typeof body.confirmedText === "string" ? body.confirmedText.trim().slice(0, 500) : "";
    const styleId = typeof body.styleId === "string" ? body.styleId : "watercolor";
    const selectedStyle = ART_STYLES[styleId] ?? ART_STYLES.watercolor;
    const scene = typeof body.scene === "string"
      ? body.scene.trim().slice(0, 500)
      : typeof body.prompt === "string" ? body.prompt.trim().slice(0, 500) : "";
    if (!description && !confirmedText && !scene) return respond({ error: "缺少可用于作画的情绪内容" }, 400);
    const plan = await createArtworkPlan(apiKey, {
      emotionLabel,
      confirmedEmotion,
      description,
      confirmedText,
      styleId,
      scene,
    });
    const imageResult = await callZhipuImage(apiKey, plan.prompt);
    if (!imageResult.ok && imageResult.error.kind === "api_error" && imageResult.error.zhipuStatus === 429) {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      const retry = await callZhipuImage(apiKey, plan.prompt);
      if (!retry.ok) return errorResponse(respond, retry.error);
      return respond({ imageUrl: retry.imageUrl, ...plan, style: styleId, styleLabel: selectedStyle.label });
    }
    if (!imageResult.ok) return errorResponse(respond, imageResult.error);
    return respond({ imageUrl: imageResult.imageUrl, ...plan, style: styleId, styleLabel: selectedStyle.label });
  }

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
  const observerSignals = dialogueHistory
    .filter((message) => message.role === "user")
    .map((message) => message.content.trim());
  const selectedScope = observerSignals.at(-1) ?? "";
  const selectedEmotionName = emotionNameFromChoice(selectedScope || emotionLabel);
  const previousEmotionNames = dialogueHistory
    .filter((message) => message.role === "assistant")
    .flatMap((message) => dialogueOptionNames(message.content));
  const forbiddenEmotionNames = [...previousEmotionNames, selectedEmotionName, emotionLabel];
  const expandedForbiddenEmotionNames = expandEmotionNames(forbiddenEmotionNames);
  const roundInstruction = round === 1
    ? `本次执行第1轮：以“${emotionLabel}”为父范围，辨认三个不同的直接感受方向；候选不得再次使用“${emotionLabel}”。`
    : round === 2
    ? `本次执行第2轮：唯一父范围是“${selectedEmotionName}”。三个候选都必须是它的更具体体验，不得出现父级名称或任何历史候选；问题要找出这份感受最突出的部分。`
    : `本次执行第3轮：唯一父范围是“${selectedEmotionName}”。三个候选都必须比它更精确，不得出现父级名称或任何历史候选；问题要帮助用户选定最终名称。`;
  const contextMsg = [
    "【用户原始描述｜唯一事实源】",
    description || "用户没有补充具体事情",
    "【初始情绪线索】",
    emotionLabel + "，程度" + intensityDesc,
    "【旁观者已经选择的感觉线索｜不是事件事实】",
    observerSignals.length ? observerSignals.join("\n") : "尚未选择",
    "【本轮必须继续收窄的唯一父范围】",
    selectedScope || (round === 1 ? emotionLabel : "未提供"),
    "【禁止再次出现的情绪词】",
    expandedForbiddenEmotionNames.length ? expandedForbiddenEmotionNames.join("、") : "无",
    "只能从唯一事实源引用事情经过；其余区块只用于辨认感受。候选必须沿唯一父范围向下细分，严禁复用父级或历史词，严禁创造新剧情或评价他人态度。",
  ].join("\n");
  const apiMessages: ChatMessage[] = [
    { role: "system", content: DIALOGUE_SYSTEM_PROMPT + "\n\n" + roundInstruction },
    { role: "user", content: contextMsg },
  ];

  const first = await callZhipuWithBusyRetry(apiKey, apiMessages, 360);
  if (!first.ok) return errorResponse(respond, first.error);
  const firstReply = composeDialogueReply(first.reply, round as number, emotionLabel, selectedEmotionName);
  if (isValidDialogueReply(firstReply, previousAssistant, description, round as number, forbiddenEmotionNames)) return respond({ reply: firstReply });

  const retryMessages = apiMessages.map((message, index) => index === 0
    ? { ...message, content: message.content + ` 上一版没有满足格式、长度或递进要求。直接沿着“${selectedEmotionName}”向下细分，三个答案都必须比父范围更具体，并且不得使用这些禁用词及其近义词：${expandedForbiddenEmotionNames.join("、")}。三个候选要分别聚焦不确定、在意程度、自我评价、愿望冲突或需要受阻中的不同方面，不能只列近义词。不要重复上一轮问题；一个共同问题，三个不同且完整的编号候选；不写“解释”，不补充用户没有说过的事实，总字数不超过220字。` }
    : message);
  const retry = await callZhipuWithBusyRetry(apiKey, retryMessages, 360);
  if (!retry.ok) return errorResponse(respond, retry.error);
  const retryReply = composeDialogueReply(retry.reply, round as number, emotionLabel, selectedEmotionName);
  if (isValidDialogueReply(retryReply, previousAssistant, description, round as number, forbiddenEmotionNames)) return respond({ reply: retryReply });

  const lastChanceMessages = retryMessages.map((message, index) => index === 0
    ? { ...message, content: message.content + " 这是第二次修正：不要查找父情绪的近义词。三个名称必须表达三种不同的心理焦点，体验线索不得出现身体反应、动作或戏剧性隐喻。" }
    : message);
  const lastChance = await callZhipuWithBusyRetry(apiKey, lastChanceMessages, 360);
  if (!lastChance.ok) return errorResponse(respond, lastChance.error);
  const lastChanceReply = composeDialogueReply(lastChance.reply, round as number, emotionLabel, selectedEmotionName);
  if (!isValidDialogueReply(lastChanceReply, previousAssistant, description, round as number, forbiddenEmotionNames, false)) {
    const repairedReply = repairDialogueReply(lastChance.reply, round as number, emotionLabel, selectedEmotionName, forbiddenEmotionNames);
    if (isValidDialogueReply(repairedReply, previousAssistant, description, round as number, forbiddenEmotionNames, false)) {
      return respond({ reply: repairedReply });
    }
    const fallbackReply = repairDialogueReply("", round as number, emotionLabel, selectedEmotionName, forbiddenEmotionNames);
    if (isValidDialogueReply(fallbackReply, previousAssistant, description, round as number, forbiddenEmotionNames, false)) {
      return respond({ reply: fallbackReply });
    }
    return respond({ errorType: "format_error", error: "回复没有形成有效递进，请重新生成" }, 422);
  }
  return respond({ reply: lastChanceReply });
});
