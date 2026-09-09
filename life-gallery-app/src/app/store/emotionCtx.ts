export const emotionCtx = {
  label: "平静",
  intensity: 50,
  description: "",
  aiFollowUp: "",
  confirmedEmotion: "",
  confirmedText: "",
};

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
}

export function setConfirmedEmotion(emotion: string, text: string) {
  emotionCtx.confirmedEmotion = emotion;
  emotionCtx.confirmedText = text;
}