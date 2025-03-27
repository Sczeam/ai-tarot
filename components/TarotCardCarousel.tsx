"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { CardInterpretation } from "@/utils/types";
import { cn } from "@/lib/utils";
import { getImageUrl } from "@/lib/firestore/getImageUrl";

interface TarotCardCarouselProps {
  cards: CardInterpretation[];
  onCardClick: (card: CardInterpretation) => void;
}

export default function TarotCardCarousel({
  cards,
  onCardClick,
}: TarotCardCarouselProps) {
  const carouselRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const [cardImages, setCardImages] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    // Load all card images when component mounts
    cards.forEach(async (card) => {
      if (card.name) {
        const url = await getImageUrl(card.name);
        setCardImages((prev) => ({
          ...prev,
          [card.name]: url ?? "/placeholder.svg",
        }));
      }
    });
  }, [cards]);

  const checkScrollButtons = () => {
    if (!carouselRef.current) return;

    const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
    setCanScrollLeft(scrollLeft > 0);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10); // 10px buffer
  };

  useEffect(() => {
    checkScrollButtons();
    window.addEventListener("resize", checkScrollButtons);
    return () => window.removeEventListener("resize", checkScrollButtons);
  }, []);

  const scroll = (direction: "left" | "right") => {
    if (!carouselRef.current) return;

    const scrollAmount = 100; // Adjust as needed
    const newScrollLeft =
      direction === "left"
        ? carouselRef.current.scrollLeft - scrollAmount
        : carouselRef.current.scrollLeft + scrollAmount;

    carouselRef.current.scrollTo({
      left: newScrollLeft,
      behavior: "smooth",
    });

    // Update active index based on scroll position
    const cardWidth = carouselRef.current.clientWidth / 2.5; // Approximate width of visible card
    const newIndex = Math.round(newScrollLeft / cardWidth);
    setActiveIndex(Math.max(0, Math.min(newIndex, cards.length - 1)));

    setTimeout(checkScrollButtons, 300);
  };

  return (
    <div className="relative w-full py-6 my-4">
      {/* Background color strip */}
      <div className="absolute inset-0 bg-stone-100 rounded-lg -z-10"></div>

      {/* Left scroll button */}
      <button
        onClick={() => scroll("left")}
        className={cn(
          "absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-white/80 rounded-full p-1 shadow-md",
          !canScrollLeft && "opacity-50 cursor-not-allowed"
        )}
        disabled={!canScrollLeft}
        aria-label="Scroll left"
      >
        <ChevronLeft className="h-6 w-6 text-stone-800" />
      </button>

      {/* Carousel container */}
      <div
        ref={carouselRef}
        className="flex overflow-x-auto scrollbar-hide snap-x snap-mandatory py-4 px-8 gap-4"
        onScroll={checkScrollButtons}
      >
        {cards.map((card, index) => (
          <div
            key={index}
            className={cn(
              "flex-none w-[180px] h-[280px] snap-center relative rounded-lg overflow-hidden shadow-lg transition-all duration-300 transform",
              index === activeIndex ? "scale-105" : "scale-95 opacity-90"
            )}
            onClick={() => {
              setActiveIndex(index);
              onCardClick(card);
            }}
          >
            <div className="relative w-full h-full">
              {card.name ? (
                <Image
                  src={cardImages[card.name] || "/placeholder.svg"}
                  alt={card.name}
                  fill
                  className={cn(
                    "object-cover transition-transform duration-500",
                    card.orientation === "reversed" ? "rotate-180" : ""
                  )}
                />
              ) : (
                <div className="flex items-center justify-center w-full h-full bg-stone-200">
                  <span className="text-sm text-stone-500">No image</span>
                </div>
              )}
            </div>
            <div className="absolute bottom-0 left-0 right-0 bg-black/60 py-2 px-3">
              <p className="text-sm font-semibold text-white truncate">
                {card.name}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Right scroll button */}
      <button
        onClick={() => scroll("right")}
        className={cn(
          "absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-white/80 rounded-full p-1 shadow-md",
          !canScrollRight && "opacity-50 cursor-not-allowed"
        )}
        disabled={!canScrollRight}
        aria-label="Scroll right"
      >
        <ChevronRight className="h-6 w-6 text-stone-800" />
      </button>
    </div>
  );
}
