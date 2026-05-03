"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Trash2, Plus, ArrowLeft } from "lucide-react";
import Link from "next/link";

interface Tour {
  id: number;
  product_code: string;
  title: string;
  description: string;
  price: number;
  currency: string;
  duration: string;
  rating: number;
  tags: string;
  product_url: string;
  image_url: string;
  location: string;
  created_at: string;
}

const EMPTY_FORM = {
  title: "",
  description: "",
  price: "",
  duration: "",
  location: "鹿児島市",
  tags: "",
  product_url: "",
  image_url: "",
};

export default function AdminPage() {
  const [tours, setTours] = useState<Tour[]>([]);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function fetchTours() {
    const res = await fetch("/api/tours");
    setTours(await res.json());
  }

  useEffect(() => { fetchTours(); }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSaving(true);
    try {
      const res = await fetch("/api/tours", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          price: Number(form.price),
          tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean),
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error ?? "保存に失敗しました");
        return;
      }
      setForm(EMPTY_FORM);
      await fetchTours();
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: number) {
    if (!confirm("このツアーを削除しますか？")) return;
    await fetch(`/api/tours/${id}`, { method: "DELETE" });
    await fetchTours();
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center gap-3">
          <Link href="/admin" className="text-muted-foreground hover:text-foreground">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="font-bold text-lg">ツアー管理</h1>
          <Badge variant="secondary">{tours.length}件</Badge>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-8 space-y-8">
        {/* 追加フォーム */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Plus className="w-4 h-4" />
              新規ツアーを追加
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="text-sm font-medium">ツアー名 *</label>
                  <Input
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    placeholder="例：桜島サンセットカヤック体験"
                    required
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="text-sm font-medium">説明文 *</label>
                  <textarea
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    placeholder="ツアーの魅力を詳しく書いてください"
                    required
                    rows={3}
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">料金（円） *</label>
                  <Input
                    type="number"
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                    placeholder="例：8000"
                    required
                    min={0}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">所要時間 *</label>
                  <Input
                    value={form.duration}
                    onChange={(e) => setForm({ ...form, duration: e.target.value })}
                    placeholder="例：3時間"
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">開催場所</label>
                  <Input
                    value={form.location}
                    onChange={(e) => setForm({ ...form, location: e.target.value })}
                    placeholder="例：桜島"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">タグ（カンマ区切り）</label>
                  <Input
                    value={form.tags}
                    onChange={(e) => setForm({ ...form, tags: e.target.value })}
                    placeholder="例：自然, アドベンチャー, 少人数"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="text-sm font-medium">予約URL</label>
                  <Input
                    value={form.product_url}
                    onChange={(e) => setForm({ ...form, product_url: e.target.value })}
                    placeholder="https://..."
                    type="url"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="text-sm font-medium">サムネイル画像URL</label>
                  <Input
                    value={form.image_url}
                    onChange={(e) => setForm({ ...form, image_url: e.target.value })}
                    placeholder="https://..."
                    type="url"
                  />
                </div>
              </div>

              {error && <p className="text-sm text-red-500">{error}</p>}

              <button
                type="submit"
                disabled={saving}
                className="w-full py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium disabled:opacity-50 hover:opacity-90 transition-opacity"
              >
                {saving ? "保存中…" : "ツアーを追加する"}
              </button>
            </form>
          </CardContent>
        </Card>

        {/* ツアー一覧 */}
        <div className="space-y-3">
          <h2 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
            登録済みツアー
          </h2>
          {tours.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">
              まだツアーが登録されていません
            </p>
          ) : (
            tours.map((tour) => (
              <Card key={tour.id}>
                <CardContent className="pt-4 flex gap-4">
                  {tour.image_url && (
                    <img
                      src={tour.image_url}
                      alt={tour.title}
                      className="w-20 h-20 object-cover rounded-md flex-shrink-0"
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-medium text-sm leading-snug">{tour.title}</h3>
                      <button
                        onClick={() => handleDelete(tour.id)}
                        className="text-muted-foreground hover:text-red-500 transition-colors flex-shrink-0"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{tour.description}</p>
                    <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                      <span>¥{tour.price.toLocaleString()}</span>
                      <span>{tour.duration}</span>
                      <span>{tour.location}</span>
                    </div>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {JSON.parse(tour.tags || "[]").map((tag: string) => (
                        <Badge key={tag} variant="secondary" className="text-xs">{tag}</Badge>
                      ))}
                      <Badge variant="outline" className="text-xs text-blue-600">自前ツアー</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </main>
    </div>
  );
}
