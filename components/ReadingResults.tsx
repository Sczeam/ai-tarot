"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import Image from "next/image";
import type { CardInterpretation, TarotInterpretation } from "@/utils/types";
import TarotCardCarousel from "./TarotCardCarousel";
import Link from "next/link";
import { getImageUrl } from "@/lib/firestore/getImageUrl";

interface ReadingResultsProps {
  tarotReading: TarotInterpretation | null;
}

export default function ReadingResults({ tarotReading }: ReadingResultsProps) {
  const [selectedCard, setSelectedCard] = useState<CardInterpretation | null>(
    null
  );
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [cardImageUrl, setCardImageUrl] = useState<string>("/placeholder.svg");

  useEffect(() => {
    if (selectedCard?.name) {
      getImageUrl(selectedCard.name).then((url) => {
        setCardImageUrl(url ?? "/placeholder.svg");
      });
    }
  }, [selectedCard]);

  const openCardDialog = (card: CardInterpretation) => {
    setSelectedCard(card);
    setIsDialogOpen(true);
  };

  if (!tarotReading) {
    return null;
  }

  return (
    <div className="p-4 sm:p-6 lg:max-w-3xl lg:mx-auto">
      <section className="mb-6">
        <h3 className="text-xl font-semibold text-primary mb-3">
          Your Tarot Reading
        </h3>
        <TarotCardCarousel
          cards={tarotReading.detailedInterpretation}
          onCardClick={openCardDialog}
        />
        <p className="text-sm text-center mt-2 text-stone-600">
          Swipe or use arrows to view all cards. Tap on a card for details.
        </p>
      </section>

      <section className="mb-6">
        <h4 className="text-lg font-semibold text-primary mb-2">Summary</h4>
        <p className="text-sm">{tarotReading.summary}</p>
      </section>

      <section className="mb-6">
        <h4 className="text-lg font-semibold text-primary mb-2">
          Focus Points
        </h4>
        <ul className="list-disc list-inside text-sm space-y-1">
          {tarotReading.focusPoints.map((point, index) => (
            <li key={index}>{point}</li>
          ))}
        </ul>
      </section>

      <section>
        <h4 className="text-lg font-semibold text-primary mb-2">
          Additional Insights
        </h4>
        <p className="text-sm">{tarotReading.additionalInsights}</p>
      </section>

      <div className="text-center mt-6">
        <Link href="/">
          <Button variant="default">Get New Reading</Button>
        </Link>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {selectedCard?.name} ({selectedCard?.orientation})
            </DialogTitle>
            <div>
              {selectedCard ? (
                <>
                  <div className="flex flex-col sm:flex-row gap-4 mb-4">
                    <div className="relative w-32 h-48 mx-auto sm:mx-0 flex-shrink-0">
                      {selectedCard.name ? (
                        <Image
                          src={cardImageUrl}
                          alt={selectedCard.name}
                          fill
                          className={`object-cover rounded-md ${
                            selectedCard.orientation === "reversed"
                              ? "rotate-180"
                              : ""
                          }`}
                        />
                      ) : (
                        <div className="flex items-center justify-center w-full h-full bg-gray-200 rounded-md">
                          <span className="text-sm text-gray-500">
                            No image
                          </span>
                        </div>
                      )}
                    </div>
                    <div>
                      <p className="text-sm mb-2">{selectedCard.meaning}</p>
                      <p className="text-sm mb-2">
                        <strong>This Card Represents:</strong>{" "}
                        {selectedCard.position}
                      </p>
                    </div>
                  </div>
                  <p className="text-sm">{selectedCard.details}</p>
                </>
              ) : (
                <p>No detailed interpretation available.</p>
              )}
            </div>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
