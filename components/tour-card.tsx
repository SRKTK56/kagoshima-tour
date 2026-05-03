"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Star, Clock, Check } from "lucide-react";
import type { ViatorProduct } from "@/lib/viator";

interface TourCardProps {
  product: ViatorProduct;
  selected?: boolean;
  onToggle?: (product: ViatorProduct) => void;
}

export function TourCard({ product, selected = false, onToggle }: TourCardProps) {
  return (
    <Card
      className={`overflow-hidden transition-all cursor-pointer ${
        selected
          ? "ring-2 ring-primary shadow-lg"
          : "hover:shadow-md"
      }`}
      onClick={() => onToggle?.(product)}
    >
      <div className="relative">
        {product.imageUrl && (
          <img
            src={product.imageUrl}
            alt={product.title}
            className="w-full h-40 object-cover"
          />
        )}
        {/* チェックボックス */}
        <div
          className={`absolute top-2 right-2 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
            selected
              ? "bg-primary border-primary text-white"
              : "bg-white/80 border-gray-300"
          }`}
        >
          {selected && <Check className="w-3.5 h-3.5" />}
        </div>
      </div>

      <CardHeader className="pb-2">
        <CardTitle className="text-base leading-snug">{product.title}</CardTitle>
        <div className="flex items-center gap-3 text-sm text-muted-foreground">
          <span className="flex items-center gap-1">
            <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
            {product.rating} ({product.reviewCount})
          </span>
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            {product.duration}
          </span>
        </div>
      </CardHeader>

      <CardContent className="pt-0 space-y-3">
        <p className="text-sm text-muted-foreground line-clamp-2">
          {product.description}
        </p>
        <div className="flex flex-wrap gap-1">
          {product.tags.slice(0, 3).map((tag) => (
            <Badge key={tag} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
        <div className="flex items-center justify-between pt-1">
          <span className="font-bold text-lg">
            ¥{product.price.toLocaleString()}
            <span className="text-sm font-normal text-muted-foreground">/人〜</span>
          </span>
          <a
            href={product.productUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="flex items-center gap-1 text-sm bg-primary text-primary-foreground px-3 py-1.5 rounded-md hover:opacity-90 transition-opacity"
          >
            予約する
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </CardContent>
    </Card>
  );
}
