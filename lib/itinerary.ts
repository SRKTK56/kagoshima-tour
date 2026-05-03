export type SpotType = "tour" | "meal" | "hotel" | "transport" | "free";

export interface ItinerarySpot {
  time: string;
  name: string;
  description: string;
  type: SpotType;
  imageUrl?: string;
  mapQuery?: string;
  price?: number;
  bookingUrl?: string;
}

export interface ItineraryDay {
  day: number;
  date?: string;
  title: string;
  spots: ItinerarySpot[];
}

export interface ChildCost {
  age: number;
  transport: number;
  tours: number;
  accommodation: number;
  subtotal: number;
}

export interface ItineraryBudget {
  transport: number;         // 交通費（大人1人・往復）
  tours: number;             // ツアー合計（大人1人）
  accommodation: number;     // 宿泊費合計（大人1人）
  total: number;             // 合計（大人1人）
  partySize?: number;        // 旅行人数（全員）
  totalForParty?: number;    // 全員合計（子供料金込み）
  childBreakdown?: ChildCost[];  // 子供ごとの費用内訳
}

export interface Itinerary {
  title: string;
  destination: string;
  departure: string;
  nights: number;
  days: ItineraryDay[];
  budget?: ItineraryBudget;
}

export const SPOT_COLORS: Record<SpotType, string> = {
  tour:      "bg-sky-100 text-sky-700",
  meal:      "bg-orange-100 text-orange-700",
  hotel:     "bg-purple-100 text-purple-700",
  transport: "bg-gray-100 text-gray-600",
  free:      "bg-green-100 text-green-700",
};

export const SPOT_LABELS: Record<SpotType, string> = {
  tour:      "ツアー",
  meal:      "食事",
  hotel:     "宿泊",
  transport: "移動",
  free:      "自由",
};

export const SPOT_ICONS: Record<SpotType, string> = {
  tour:      "🎯",
  meal:      "🍽️",
  hotel:     "🏨",
  transport: "🚄",
  free:      "🕐",
};
