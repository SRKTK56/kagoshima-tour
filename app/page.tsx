"use client";

import { useChat } from "@ai-sdk/react";
import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { TourCard } from "@/components/tour-card";
import { ItineraryPanel } from "@/components/itinerary-panel";
import { QuestionCard } from "@/components/question-card";
import type { ViatorProduct } from "@/lib/viator";
import type { Itinerary } from "@/lib/itinerary";
import { MapIcon } from "lucide-react";

const SUGGESTIONS = [
  "桜島と温泉を楽しめるプランを教えて",
  "海外からの友人を連れて行くなら？",
  "1泊2日で鹿児島を満喫したい",
  "子供と一緒に楽しめる体験は？",
];

export default function Home() {
  const { messages, sendMessage, status } = useChat();
  const [input, setInput] = useState("");
  const [started, setStarted] = useState(false);
  const [selectedTours, setSelectedTours] = useState<Map<string, ViatorProduct>>(new Map());
  const [panelOpen, setPanelOpen] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // メッセージから最新の旅程データを抽出
  const itinerary = useMemo<Itinerary | null>(() => {
    for (let i = messages.length - 1; i >= 0; i--) {
      const msg = messages[i];
      for (const part of msg.parts) {
        if (
          part.type === "tool-updateItinerary" &&
          part.state === "output-available"
        ) {
          return part.output as Itinerary;
        }
      }
    }
    return null;
  }, [messages]);

  // 旅程が更新されたらパネルを自動で開く
  useEffect(() => {
    if (itinerary) setPanelOpen(true);
  }, [itinerary]);

  const toggleTour = useCallback((product: ViatorProduct) => {
    setSelectedTours((prev) => {
      const next = new Map(prev);
      next.has(product.productCode) ? next.delete(product.productCode) : next.set(product.productCode, product);
      return next;
    });
  }, []);

  const handleSuggestion = (text: string) => {
    setStarted(true);
    sendMessage({ text });
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    setStarted(true);
    sendMessage({ text: input });
    setInput("");
  };

  const handlePlanWithSelected = () => {
    const names = Array.from(selectedTours.values()).map((t) => `「${t.title}」`).join("と");
    setSelectedTours(new Map());
    setStarted(true);
    sendMessage({ text: `${names}を選びました。これらを組み込んだ旅程を旅程表に反映してください。` });
  };

  const isBusy = status === "submitted" || status === "streaming";

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur z-10 flex-shrink-0">
        <div className="px-4 py-3 flex items-center gap-3">
          <span className="text-2xl">🌋</span>
          <div className="flex-1">
            <h1 className="font-bold text-lg leading-none">鹿児島旅行コンシェルジュ</h1>
            <p className="text-xs text-muted-foreground">powered by Viator × AI</p>
          </div>
          {/* モバイル用パネルトグル */}
          <button
            onClick={() => setPanelOpen(!panelOpen)}
            className={`lg:hidden flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full border transition-colors ${
              itinerary ? "border-primary text-primary bg-primary/5" : "text-muted-foreground"
            }`}
          >
            <MapIcon className="w-3.5 h-3.5" />
            旅程表
            {itinerary && <span className="w-2 h-2 rounded-full bg-primary" />}
          </button>
        </div>
      </header>

      {/* Body */}
      <div className="flex flex-1 overflow-hidden">

        {/* ─── チャット ─────────────────────────── */}
        <div className="flex flex-col flex-1 overflow-hidden">
          <main className="flex-1 overflow-y-auto px-4 py-6 space-y-4 max-w-2xl w-full mx-auto">

            {/* Welcome */}
            {!started && messages.length === 0 && (
              <div className="text-center py-12 space-y-4">
                <div className="text-6xl">🌋🍶🌊</div>
                <h2 className="text-2xl font-bold">鹿児島へようこそ！</h2>
                <p className="text-muted-foreground">
                  桜島・黒豚・薩摩焼酎・屋久島…<br />
                  あなただけの鹿児島体験を一緒に見つけましょう
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-6">
                  {SUGGESTIONS.map((s) => (
                    <button
                      key={s}
                      onClick={() => handleSuggestion(s)}
                      className="text-left px-4 py-3 rounded-xl border bg-white hover:bg-sky-50 hover:border-sky-300 transition-colors text-sm"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Messages */}
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] space-y-3 ${
                    message.role === "user"
                      ? "bg-primary text-primary-foreground rounded-2xl rounded-tr-sm px-4 py-2.5"
                      : ""
                  }`}
                >
                  {(() => {
                    // askQuestion がある assistant メッセージはテキストを非表示
                    const hasQuestion = message.role === "assistant" && message.parts.some(
                      (p) => p.type === "tool-askQuestion"
                    );
                    return message.parts.map((part, i) => {
                    if (part.type === "text") {
                      if (hasQuestion) return null;
                      return (
                        <p key={i} className={`text-sm leading-relaxed whitespace-pre-wrap ${message.role === "assistant" ? "text-foreground" : ""}`}>
                          {part.text}
                        </p>
                      );
                    }

                    if (part.type === "tool-searchTours") {
                      if (part.state === "output-available") {
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        const output = part.output as any;
                        const products: ViatorProduct[] = Array.isArray(output) ? output : (output?.products ?? []);
                        if (products.length === 0) return null;
                        return (
                          <div key={i} className="space-y-2">
                            <p className="text-xs text-muted-foreground">気になるツアーをタップして選択できます</p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                              {products.map((product) => (
                                <TourCard
                                  key={product.productCode}
                                  product={product}
                                  selected={selectedTours.has(product.productCode)}
                                  onToggle={toggleTour}
                                />
                              ))}
                            </div>
                          </div>
                        );
                      }
                      if (part.state === "input-streaming" || part.state === "input-available") {
                        return <p key={i} className="text-xs text-muted-foreground animate-pulse">🔍 ツアーを検索中…</p>;
                      }
                    }

                    if (part.type === "tool-getTransport" && (part.state === "input-streaming" || part.state === "input-available")) {
                      return <p key={i} className="text-xs text-muted-foreground animate-pulse">🚄 交通情報を調べています…</p>;
                    }

                    if (part.type === "tool-askQuestion" && part.state === "output-available") {
                      // eslint-disable-next-line @typescript-eslint/no-explicit-any
                      const q = part.output as any;
                      const isLatestQuestion = (() => {
                        for (let mi = messages.length - 1; mi >= 0; mi--) {
                          for (const p of messages[mi].parts) {
                            if (p.type === "tool-askQuestion" && p.state === "output-available") {
                              return p === part;
                            }
                          }
                        }
                        return false;
                      })();
                      return (
                        <QuestionCard
                          key={i}
                          question={q.question}
                          options={q.options}
                          disabled={!isLatestQuestion || isBusy}
                          onSelect={(_value, label) => {
                            setStarted(true);
                            sendMessage({ text: label });
                          }}
                        />
                      );
                    }

                    if (part.type === "tool-updateItinerary") {
                      if (part.state === "input-streaming" || part.state === "input-available") {
                        return <p key={i} className="text-xs text-muted-foreground animate-pulse">🗓️ 旅程表を作成中…</p>;
                      }
                      if (part.state === "output-available") {
                        return (
                          <button
                            key={i}
                            onClick={() => setPanelOpen(true)}
                            className="flex items-center gap-2 text-xs text-primary border border-primary/30 bg-primary/5 rounded-lg px-3 py-2 hover:bg-primary/10 transition-colors"
                          >
                            <MapIcon className="w-3.5 h-3.5" />
                            旅程表を更新しました → 確認する
                          </button>
                        );
                      }
                    }

                    return null;
                  });
                  })()}
                </div>
              </div>
            ))}

            {isBusy && (
              <div className="flex justify-start">
                <div className="flex gap-1 px-4 py-3">
                  <span className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:0ms]" />
                  <span className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:150ms]" />
                  <span className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:300ms]" />
                </div>
              </div>
            )}

            {selectedTours.size > 0 && <div className="h-16" />}
            <div ref={bottomRef} />
          </main>

          {/* 選択バー */}
          {selectedTours.size > 0 && (
            <div className="flex-shrink-0 px-4 pb-2">
              <div className="max-w-2xl mx-auto bg-primary text-primary-foreground rounded-2xl shadow-xl px-4 py-3 flex items-center justify-between gap-3">
                <span className="text-sm font-medium">{selectedTours.size}件選択中</span>
                <div className="flex gap-2">
                  <button onClick={() => setSelectedTours(new Map())} className="text-xs opacity-70 hover:opacity-100 underline">クリア</button>
                  <button onClick={handlePlanWithSelected} className="text-sm bg-white text-primary font-semibold px-4 py-1.5 rounded-xl hover:opacity-90 transition-opacity">
                    このツアーでプランを作る →
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Input */}
          <footer className="flex-shrink-0 bg-white/80 backdrop-blur border-t">
            <form onSubmit={onSubmit} className="max-w-2xl mx-auto px-4 py-3 flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="鹿児島で何を体験したいですか？"
                className="flex-1 rounded-full"
                disabled={isBusy}
              />
              <button
                type="submit"
                disabled={!input.trim() || isBusy}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-full text-sm font-medium disabled:opacity-50 hover:opacity-90 transition-opacity"
              >
                送信
              </button>
            </form>
          </footer>
        </div>

        {/* ─── 旅程パネル ────────────────────────── */}
        {/* デスクトップ: 常時表示 */}
        <aside className="hidden lg:flex flex-col w-96 border-l bg-white overflow-hidden flex-shrink-0">
          <div className="flex items-center gap-2 px-4 py-3 border-b flex-shrink-0">
            <MapIcon className="w-4 h-4 text-primary" />
            <span className="font-semibold text-sm">旅程表</span>
            {itinerary && <span className="ml-auto text-xs text-primary bg-primary/10 px-2 py-0.5 rounded-full">更新済み</span>}
          </div>
          <div className="flex-1 overflow-hidden">
            <ItineraryPanel itinerary={itinerary} />
          </div>
        </aside>

        {/* モバイル: スライドオーバー */}
        {panelOpen && (
          <div className="lg:hidden fixed inset-0 z-30 flex">
            <div className="flex-1 bg-black/40" onClick={() => setPanelOpen(false)} />
            <div className="w-[85vw] max-w-sm bg-white flex flex-col shadow-2xl">
              <div className="flex items-center gap-2 px-4 py-3 border-b flex-shrink-0">
                <MapIcon className="w-4 h-4 text-primary" />
                <span className="font-semibold text-sm">旅程表</span>
                <button onClick={() => setPanelOpen(false)} className="ml-auto text-muted-foreground hover:text-foreground text-lg leading-none">✕</button>
              </div>
              <div className="flex-1 overflow-hidden">
                <ItineraryPanel itinerary={itinerary} />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
