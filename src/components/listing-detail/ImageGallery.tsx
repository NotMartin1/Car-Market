"use client";

import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";

export function ImageGallery({
  images,
  activeImage,
  setActiveImage,
  saved,
  onToggleSaved,
}: {
  images: string[];
  activeImage: number;
  setActiveImage: (i: number) => void;
  saved: boolean;
  onToggleSaved: () => void;
}) {
  return (
    <div className="bg-card p-2 rounded-3xl border border-border/50 shadow-sm">
      <div className="aspect-[4/3] sm:aspect-[16/9] rounded-2xl overflow-hidden mb-2 relative bg-muted">
        <img src={images[activeImage]} alt="Car" className="w-full h-full object-cover" />
        <button
          onClick={onToggleSaved}
          className={cn(
            "absolute top-3 right-3 w-10 h-10 rounded-full flex items-center justify-center shadow-lg border transition-colors",
            saved ? "bg-red-500 border-red-500 text-white" : "bg-white/90 border-white/60 text-foreground/70 hover:text-red-500",
          )}
        >
          <Heart className={cn("w-5 h-5", saved && "fill-current")} />
        </button>
      </div>
      {images.length > 1 && (
        <div className="flex overflow-x-auto gap-2 p-2 no-scrollbar">
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => setActiveImage(i)}
              className={`relative w-24 h-16 shrink-0 rounded-xl overflow-hidden transition-all ${activeImage === i ? "ring-2 ring-accent ring-offset-2 scale-95" : "opacity-70 hover:opacity-100"}`}
            >
              <img src={img} alt="Thumbnail" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
