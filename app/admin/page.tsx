"use client";

import Link from "next/link";
import { MapPin, List, ArrowLeft } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const MENU = [
  {
    href: "/admin/tours",
    icon: List,
    label: "ツアー管理",
    description: "自前ツアーの追加・編集・削除",
  },
];

export default function AdminPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
          <Link href="/" className="text-muted-foreground hover:text-foreground">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-primary" />
            <h1 className="font-bold text-lg">管理画面</h1>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-10 space-y-4">
        <p className="text-sm text-muted-foreground">管理メニューを選択してください</p>
        {MENU.map(({ href, icon: Icon, label, description }) => (
          <Link key={href} href={href}>
            <Card className="hover:shadow-md hover:border-primary/40 transition-all cursor-pointer">
              <CardContent className="flex items-center gap-4 py-5">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Icon className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="font-semibold">{label}</p>
                  <p className="text-sm text-muted-foreground">{description}</p>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </main>
    </div>
  );
}
