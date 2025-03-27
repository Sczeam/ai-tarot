export type Card = {
  name: string;
  upright: string;
  reversed: string;
  imageUrl: string;
};

export type TarotCard = {
  name: string;
  meaning: string;
  orientation: "upright" | "reversed";
  // imageUrl: string;
};

export type CardInterpretation = {
  name: string;
  orientation: string;
  meaning: string;
  position: string;
  details: string;
  imageUrl?: string;
};

export type TarotInterpretation = {
  summary: string;
  focusPoints: string[];
  detailedInterpretation: CardInterpretation[];
  additionalInsights: string;
};

export type DrawnCard = {
  name: string;
  image: string;
  orientation: "upright" | "reversed";
  position: string;
  interpretation?: string;
  isRevealed: boolean;
  imageUrl: string;
};
