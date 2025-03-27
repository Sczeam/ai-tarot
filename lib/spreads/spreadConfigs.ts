import { Moon, RotateCcw, Sun } from "lucide-react";

export const SPREAD_CONFIGS = {
  quickGuidance: {
    name: "Quick Guidance",
    cardCount: 1,
    description: "A quick look into your destiny",
    positions: ["Present situation and guidance"],
    icon: RotateCcw,
  },
  threeCard: {
    name: "3 Cards Spread",
    cardCount: 3,
    description: "Reveals insights about your past, present, and future",
    positions: ["Past", "Present", "Future"],
    icon: Moon,
  },
  celticCross: {
    name: "Celtic Cross Spread",
    cardCount: 10,
    description:
      "A comprehensive reading covering multiple aspects of your situation",
    positions: [
      "Present situation",
      "Challenge or obstacle",
      "Past foundation",
      "Recent past",
      "Potential outcome",
      "Near future",
      "Your current approach",
      "External influences",
      "Hopes and fears",
      "Final outcome",
    ],
    icon: Sun,
  },
} as const;

export type SpreadType = keyof typeof SPREAD_CONFIGS;
