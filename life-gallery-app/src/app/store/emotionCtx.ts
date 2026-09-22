const STORAGE_KEY = "life-gallery-emotion-context";

const defaultEmotionCtx = {
  label: "平静",
  intensity: 50,
  description: "",
  aiFollowUp: "",
  confirmedEmotion: "",
  confirmedText: "",
  generatedImageUrl: "",
  generatedPrompt: "",
  generatedTitle: "",
  generatedDescription: "",
  generatedStyle: "watercolor",
  generatedStyleLabel: "水彩画",
};

function restoreEmotionCtx() {
  if (typeof window === "undefined") return { ...defaultEmotionCtx };
  try {
    const saved = window.sessionStorage.getItem(STORAGE_KEY);
    return saved ? { ...defaultEmotionCtx, ...JSON.parse(saved) } : { ...defaultEmotionCtx };
  } catch (_) {
    return { ...defaultEmotionCtx };
  }
}

function persistEmotionCtx() {
  if (typeof window === "undefined") return;
  window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(emotionCtx));
}

export const emotionCtx = restoreEmotionCtx();

export function setEmotionCtx(
  label: string,
  intensity: number,
  description: string,
  aiFollowUp = ""
) {
  emotionCtx.label = label;
  emotionCtx.intensity = intensity;
  emotionCtx.description = description;
  emotionCtx.aiFollowUp = aiFollowUp;
  emotionCtx.confirmedEmotion = "";
  emotionCtx.confirmedText = "";
  emotionCtx.generatedImageUrl = "";
  emotionCtx.generatedPrompt = "";
  emotionCtx.generatedTitle = "";
  emotionCtx.generatedDescription = "";
  persistEmotionCtx();
}

export function setConfirmedEmotion(emotion: string, text: string) {
  emotionCtx.confirmedEmotion = emotion;
  emotionCtx.confirmedText = text;
  persistEmotionCtx();
}

export function setGeneratedArtwork(artwork: {
  imageUrl: string;
  prompt: string;
  title: string;
  description: string;
  style: string;
  styleLabel: string;
}) {
  emotionCtx.generatedImageUrl = artwork.imageUrl;
  emotionCtx.generatedPrompt = artwork.prompt;
  emotionCtx.generatedTitle = artwork.title;
  emotionCtx.generatedDescription = artwork.description;
  emotionCtx.generatedStyle = artwork.style;
  emotionCtx.generatedStyleLabel = artwork.styleLabel;
  persistEmotionCtx();
}
