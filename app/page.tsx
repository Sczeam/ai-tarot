"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Sparkles, RotateCcw } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

import { DrawnCard } from "@/utils/types";
import { shuffleDeck } from "@/lib/drawCard";
import { tarotDeck } from "@/utils/tarotData";
import { SpreadType, SPREAD_CONFIGS } from "@/lib/spreads/spreadConfigs";
import { toast } from "sonner";
import Image from "next/image";
import { getCardInterpretation } from "@/actions/getCardInterpretation";

const FOCUS_AREAS = [
  { value: "love", label: "Love" },
  { value: "career", label: "Career" },
  { value: "personal", label: "Personal Growth" },
  { value: "spiritual", label: "Spiritual Path" },
  { value: "health", label: "Health " },
  { value: "finances", label: "Finances" },
];

export default function Home() {
  const [selectedSpread, setSelectedSpread] = useState("");
  const [focusArea, setFocusArea] = useState("");
  const [question, setQuestion] = useState("");
  const [isShuffling, setIsShuffling] = useState(false);
  const [drawnCards, setDrawnCards] = useState<DrawnCard[]>([]);
  const [isReading, setIsReading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleShuffle = () => {
    if (!selectedSpread || !focusArea || !question.trim()) {
      toast("Please fill in all fields", {
        description: "Select a spread, focus area, and enter your question.",
      });
      return;
    }

    setIsShuffling(true);
    const shuffledDeck = shuffleDeck(tarotDeck);
    const spread = SPREAD_CONFIGS[selectedSpread as SpreadType];

    const cards = shuffledDeck
      .slice(0, spread.cardCount)
      .map((card, index) => ({
        ...card,
        position: spread.positions[index],
        isRevealed: false,
        image: card.imageUrl,
        orientation:
          Math.random() < 0.5 ? ("reversed" as const) : ("upright" as const),
      }));

    setTimeout(() => {
      setIsShuffling(false);
      setDrawnCards(cards);
      setIsReading(true);
    }, 2000);
  };

  const handleCardReveal = async (index: number) => {
    if (drawnCards[index].isRevealed || isLoading) return;

    setIsLoading(true);
    const updatedCards = [...drawnCards];
    const card = updatedCards[index];

    try {
      const interpretation = await getCardInterpretation(
        focusArea,
        question,
        card.name,
        card.orientation,
        card.position,
        SPREAD_CONFIGS[selectedSpread as SpreadType].name
      );

      updatedCards[index] = {
        ...card,
        interpretation,
        isRevealed: true,
      };

      setDrawnCards(updatedCards);
    } catch (error: unknown) {
      console.error("Failed to get interpretation:", error);
      if (error instanceof Error) {
        toast("Error", {
          description:
            error.message ||
            "Failed to get card interpretation. Please try again later.",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleRestart = () => {
    setSelectedSpread("");
    setFocusArea("");
    setQuestion("");
    setDrawnCards([]);
    setIsReading(false);
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-foreground via-foreground/95 to-accent/20 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="stars"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 py-16">
        <div className="text-center mb-16 space-y-6">
          <h1 className="text-5xl md:text-7xl font-serif font-bold mb-4 gradient-text tracking-tight">
            Mystic Tarot
          </h1>
          <p className="text-xl md:text-2xl text-background/80 font-light max-w-2xl mx-auto">
            Discover profound insights into your journey through the ancient
            wisdom of tarot
          </p>

          {!isReading && (
            <div className="max-w-md mx-auto space-y-8 mt-12">
              <Select onValueChange={setFocusArea}>
                <SelectTrigger className="glass-card h-12 text-lg w-full">
                  <SelectValue placeholder="Choose your focus area" />
                </SelectTrigger>
                <SelectContent>
                  {FOCUS_AREAS.map((area) => (
                    <SelectItem
                      key={area.value}
                      value={area.value}
                      className="text-base"
                    >
                      {area.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Input
                placeholder="Enter your question..."
                className="glass-card h-12 text-lg"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
              />

              <Select onValueChange={setSelectedSpread}>
                <SelectTrigger className="glass-card h-12 text-lg w-full">
                  <SelectValue placeholder="Choose your spread" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(SPREAD_CONFIGS).map(([key, spread]) => {
                    const Icon = spread.icon;
                    return (
                      <SelectItem key={key} value={key} className="text-base">
                        <div className="flex items-center gap-2">
                          <Icon className="w-4 h-4" />
                          {spread.name}
                        </div>
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>

              {selectedSpread && (
                <Card className="glass-card p-6 text-center">
                  <h3 className="text-lg font-serif mb-2 text-background/90">
                    {SPREAD_CONFIGS[selectedSpread as SpreadType].name}
                  </h3>
                  <p className="text-background/70">
                    {SPREAD_CONFIGS[selectedSpread as SpreadType].description}
                  </p>
                </Card>
              )}

              <Button
                size="lg"
                className="w-full h-12 text-lg gradient-border glass-card hover:bg-white/5"
                onClick={handleShuffle}
                disabled={!selectedSpread || isShuffling}
              >
                <Sparkles className="mr-2 h-5 w-5" />
                Shuffle & Draw Cards
              </Button>
            </div>
          )}
        </div>

        {isReading && (
          <div className="space-y-12">
            <Carousel
              opts={{
                align: "start",
                loop: true,
              }}
              className="w-full max-w-5xl mx-auto"
            >
              <CarouselContent>
                {drawnCards.map((card, index) => (
                  <CarouselItem
                    key={index}
                    className="md:basis-1/2 lg:basis-1/3"
                  >
                    <div
                      className={`relative aspect-[2/3] cursor-pointer card-flip ${
                        card.isRevealed ? "revealed" : ""
                      } ${!card.isRevealed ? "glass-card card-hover" : ""}`}
                      onClick={() => handleCardReveal(index)}
                    >
                      <div className="card-back" />
                      <div className={`card-front`}>
                        {card.isRevealed ? (
                          <div className="h-full space-y-4">
                            <div className="relative h-full rounded-lg overflow-hidden">
                              <Image
                                src={`/tarot-images/${card.name}.png`}
                                alt={card.name}
                                width={200}
                                height={300}
                                className={`w-full h-full object-cover ${
                                  card.orientation === "reversed"
                                    ? "rotate-180"
                                    : ""
                                }`}
                              />
                              <div className="absolute inset-0 bg-gradient-to-b from-black/80 to-transparent" />
                              {card.interpretation && (
                                <p className="absolute text-sm text-white/80 p-4 inset-0 rounded-lg">
                                  {card.interpretation}
                                </p>
                              )}
                              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                              <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                                <h3 className="font-serif text-lg font-semibold">
                                  {card.name}
                                </h3>
                                <p className="text-sm text-white/80">
                                  {card.position}
                                </p>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <p className="text-background/60 font-serif">
                              Click to Reveal
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="glass-card -left-12 hover:bg-white/5 border-white/10" />
              <CarouselNext className="glass-card -right-12 hover:bg-white/5 border-white/10" />
            </Carousel>

            <div className="text-center">
              <Button
                variant="outline"
                size="lg"
                className="glass-card hover:bg-white/5 hover:cursor-pointer hover:text-white"
                onClick={handleRestart}
              >
                <RotateCcw className="mr-2 h-4 w-4" />
                Start New Reading
              </Button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
