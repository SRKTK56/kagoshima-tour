"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Itinerary, ItineraryDay, ItinerarySpot, ChildCost,
  SPOT_COLORS, SPOT_LABELS, SPOT_ICONS,
} from "@/lib/itinerary";
import { MapPin, ExternalLink, Wallet, ChevronDown, ChevronUp } from "lucide-react";

/* ── 地図モーダル ─────────────────────── */
function MapModal({ query, onClose }: { query: string; onClose: () => void }) {
  const src = `https://maps.google.com/maps?q=${encodeURIComponent(query)}&output=embed&hl=ja`;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={onClose}>
      <div className="w-full max-w-xl h-[70vh] bg-white rounded-2xl overflow-hidden shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between px-4 py-2 border-b">
          <span className="text-sm font-medium">{query}</span>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground text-lg leading-none">✕</button>
        </div>
        <iframe src={src} className="w-full h-full border-0" title="地図" loading="lazy" />
      </div>
    </div>
  );
}

/* ── スポットカード ───────────────────── */
function SpotCard({ spot }: { spot: ItinerarySpot }) {
  const [mapOpen, setMapOpen] = useState(false);
  return (
    <>
      <div className="flex gap-3">
        {/* 時間 */}
        <div className="flex flex-col items-center">
          <span className="text-xs font-mono text-muted-foreground whitespace-nowrap">{spot.time}</span>
          <div className="w-px flex-1 bg-border mt-1" />
        </div>
        {/* コンテンツ */}
        <div className="flex-1 pb-4 min-w-0">
          <div className="flex items-center gap-1.5 mb-1">
            <span>{SPOT_ICONS[spot.type]}</span>
            <Badge variant="secondary" className={`text-xs px-1.5 py-0 ${SPOT_COLORS[spot.type]}`}>
              {SPOT_LABELS[spot.type]}
            </Badge>
          </div>
          <p className="font-semibold text-sm leading-snug">{spot.name}</p>
          {spot.imageUrl && (
            <img
              src={spot.imageUrl}
              alt={spot.name}
              className="w-full h-28 object-cover rounded-lg mt-2 mb-2"
            />
          )}
          <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{spot.description}</p>
          <div className="flex items-center gap-2 mt-1.5 flex-wrap">
            {spot.price !== undefined && spot.price > 0 && (
              <span className="text-xs font-medium">¥{spot.price.toLocaleString()}</span>
            )}
            {spot.mapQuery && (
              <button
                onClick={() => setMapOpen(true)}
                className="flex items-center gap-0.5 text-xs text-blue-600 hover:underline"
              >
                <MapPin className="w-3 h-3" />地図
              </button>
            )}
            {spot.bookingUrl && (
              <a
                href={spot.bookingUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-0.5 text-xs text-primary hover:underline"
              >
                <ExternalLink className="w-3 h-3" />予約
              </a>
            )}
          </div>
        </div>
      </div>
      {mapOpen && spot.mapQuery && (
        <MapModal query={spot.mapQuery} onClose={() => setMapOpen(false)} />
      )}
    </>
  );
}

/* ── 1日分 ───────────────────────────── */
function DaySection({ day, defaultOpen }: { day: ItineraryDay; defaultOpen: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-3 bg-muted/40 hover:bg-muted/60 transition-colors"
      >
        <div className="text-left">
          <span className="text-xs text-muted-foreground font-medium">DAY {day.day}{day.date ? ` · ${day.date}` : ""}</span>
          <p className="font-semibold text-sm">{day.title}</p>
        </div>
        {open ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
      </button>
      {open && (
        <div className="px-4 pt-3">
          {day.spots.map((spot, i) => <SpotCard key={i} spot={spot} />)}
        </div>
      )}
    </div>
  );
}

/* ── メインパネル ─────────────────────── */
export function ItineraryPanel({ itinerary }: { itinerary: Itinerary | null }) {
  if (!itinerary) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center px-6 py-12 text-muted-foreground space-y-3">
        <div className="text-5xl">🗓️</div>
        <p className="font-semibold text-sm">旅程表</p>
        <p className="text-xs leading-relaxed">
          出発地・日程・ご希望を教えると<br />ここにリアルタイムで旅程が表示されます
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full overflow-y-auto">
      {/* ヘッダー */}
      <div className="px-4 py-4 border-b bg-gradient-to-r from-sky-50 to-white sticky top-0 z-10">
        <p className="text-xs text-muted-foreground">{itinerary.departure} → {itinerary.destination}</p>
        <h2 className="font-bold text-base leading-snug">{itinerary.title}</h2>
        <p className="text-xs text-muted-foreground mt-0.5">{itinerary.nights}泊{itinerary.nights + 1}日</p>
      </div>

      {/* 日程 */}
      <div className="px-4 py-3 space-y-3 flex-1">
        {itinerary.days.map((day) => (
          <DaySection key={day.day} day={day} defaultOpen={day.day === 1} />
        ))}
      </div>

      {/* 予算 */}
      {itinerary.budget && (
        <div className="px-4 py-4 border-t mt-2">
          <div className="flex items-center gap-1.5 mb-2">
            <Wallet className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm font-semibold">予算概算</span>
          </div>
          <Card>
            <CardContent className="py-3 px-4 space-y-1.5 text-sm">
              {/* 1人あたり内訳 */}
              <p className="text-xs text-muted-foreground font-medium">1人あたり</p>
              {[
                { label: "交通費（往復）", value: itinerary.budget.transport },
                { label: "ツアー費用",     value: itinerary.budget.tours },
                { label: "宿泊費",         value: itinerary.budget.accommodation },
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between text-xs">
                  <span className="text-muted-foreground pl-2">{label}</span>
                  <span>¥{value.toLocaleString()}</span>
                </div>
              ))}
              <div className="flex justify-between font-semibold border-t pt-1.5 text-xs">
                <span>1人合計</span>
                <span>¥{itinerary.budget.total.toLocaleString()}</span>
              </div>

              {/* 子供ごとの内訳 */}
              {itinerary.budget.childBreakdown && itinerary.budget.childBreakdown.length > 0 && (
                <div className="border-t pt-2 mt-1 space-y-1">
                  <p className="text-xs text-muted-foreground font-medium">子供（年齢別）</p>
                  {itinerary.budget.childBreakdown.map((c: ChildCost, i: number) => (
                    <div key={i} className="flex justify-between text-xs">
                      <span className="text-muted-foreground pl-2">
                        {c.age}歳
                        <span className="ml-1 text-[10px]">
                          （交通{c.transport > 0 ? `¥${c.transport.toLocaleString()}` : "無料"}
                          / ツアー{c.tours > 0 ? `¥${c.tours.toLocaleString()}` : "無料"}）
                        </span>
                      </span>
                      <span>¥{c.subtotal.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* 全員合計（2人以上のとき表示） */}
              {itinerary.budget.partySize && itinerary.budget.partySize > 1 && itinerary.budget.totalForParty && (
                <div className="flex justify-between font-bold border-t-2 pt-2 text-sm bg-primary/5 -mx-4 px-4 pb-1 mt-1">
                  <span className="flex items-center gap-1">
                    全員合計
                    <span className="text-xs font-normal text-muted-foreground">
                      （{itinerary.budget.partySize}名）
                    </span>
                  </span>
                  <span className="text-primary text-base">
                    ¥{itinerary.budget.totalForParty.toLocaleString()}
                  </span>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
