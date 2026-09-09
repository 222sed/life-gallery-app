export interface AvatarConfig {
  faceShape: "soft" | "slim" | "round" | "neutral";
  skinTone: "ivory" | "warm" | "tan" | "deep";
  hairStyle: "short" | "medium" | "long" | "curly" | "updo";
  hairColor: "black" | "brown" | "ash" | "pink" | "flax" | "silver";
  eyes: "calm" | "gentle" | "wide";
  expression: "peaceful" | "soft_smile" | "thoughtful" | "sleepy";
  outfit: "sketch" | "curator" | "studio" | "ceremony";
  accessory: "none" | "glasses" | "earring" | "scarf" | "brooch";
  aura: "quiet" | "gentle" | "rational" | "sensitive" | "free" | "uncertain";
}

export const DEFAULT_AVATAR_CONFIG: AvatarConfig = {
  faceShape: "soft",
  skinTone: "ivory",
  hairStyle: "medium",
  hairColor: "brown",
  eyes: "calm",
  expression: "peaceful",
  outfit: "curator",
  accessory: "none",
  aura: "gentle",
};
