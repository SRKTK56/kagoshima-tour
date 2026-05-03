export interface TransportOption {
  means: string;      // 交通手段
  duration: string;   // 所要時間
  cost: number;       // 概算片道（円）
  tip?: string;       // お得情報
}

export interface CityTransport {
  city: string;
  prefecture: string;
  options: TransportOption[];
  cheapest: number;   // 最安値（片道）
}

const TRANSPORT_TABLE: Record<string, CityTransport> = {
  // 北海道・東北
  "札幌": { city: "札幌", prefecture: "北海道", cheapest: 12000, options: [
    { means: "飛行機（新千歳→鹿児島）", duration: "約2時間30分", cost: 20000, tip: "LCC利用で12,000円〜" },
  ]},
  "仙台": { city: "仙台", prefecture: "宮城県", cheapest: 14000, options: [
    { means: "飛行機（仙台→鹿児島）", duration: "約1時間50分", cost: 22000, tip: "早割で14,000円〜" },
  ]},

  // 関東
  "東京": { city: "東京", prefecture: "東京都", cheapest: 10000, options: [
    { means: "飛行機（羽田→鹿児島）", duration: "約1時間45分", cost: 16000, tip: "LCC（Peach・ジェットスター）で10,000円〜" },
    { means: "飛行機（成田→鹿児島）", duration: "約1時間50分", cost: 12000, tip: "ジェットスター利用で最安値" },
    { means: "新幹線（東京→鹿児島中央）", duration: "約7時間", cost: 28000, tip: "のぞみ＋さくら乗継。飛行機が断然お得" },
  ]},
  "横浜": { city: "横浜", prefecture: "神奈川県", cheapest: 10000, options: [
    { means: "飛行機（羽田→鹿児島）", duration: "約1時間55分", cost: 16000, tip: "羽田まで京急で約30分。LCCで10,000円〜" },
  ]},
  "さいたま": { city: "さいたま", prefecture: "埼玉県", cheapest: 10000, options: [
    { means: "飛行機（羽田→鹿児島）", duration: "約2時間", cost: 16000, tip: "羽田or成田どちらも利用可" },
  ]},

  // 中部
  "名古屋": { city: "名古屋", prefecture: "愛知県", cheapest: 9000, options: [
    { means: "飛行機（中部→鹿児島）", duration: "約1時間25分", cost: 15000, tip: "早割で9,000円〜。フライト数多め" },
    { means: "新幹線（名古屋→鹿児島中央）", duration: "約5時間30分", cost: 24000, tip: "飛行機の方が速くて安い" },
  ]},
  "静岡": { city: "静岡", prefecture: "静岡県", cheapest: 11000, options: [
    { means: "飛行機（静岡→鹿児島）", duration: "約1時間20分", cost: 14000, tip: "静岡空港発あり。早割で11,000円〜" },
  ]},

  // 関西
  "大阪": { city: "大阪", prefecture: "大阪府", cheapest: 7000, options: [
    { means: "飛行機（伊丹→鹿児島）", duration: "約1時間10分", cost: 13000, tip: "1日10便以上で使いやすい" },
    { means: "飛行機（関西→鹿児島）", duration: "約1時間15分", cost: 9000, tip: "Peachで7,000円〜（最安）" },
    { means: "新幹線（新大阪→鹿児島中央）", duration: "約3時間45分", cost: 20000, tip: "さくら利用。距離的に新幹線も選択肢" },
  ]},
  "神戸": { city: "神戸", prefecture: "兵庫県", cheapest: 7000, options: [
    { means: "飛行機（神戸→鹿児島）", duration: "約1時間15分", cost: 10000, tip: "神戸空港からPeach利用で7,000円〜" },
  ]},
  "京都": { city: "京都", prefecture: "京都府", cheapest: 7000, options: [
    { means: "飛行機（伊丹 or 関西→鹿児島）", duration: "約1時間30分〜", cost: 12000, tip: "新大阪経由で関西・伊丹どちらも便利" },
    { means: "新幹線（京都→鹿児島中央）", duration: "約3時間30分", cost: 19000, tip: "さくら1本で行ける" },
  ]},

  // 中国・四国
  "広島": { city: "広島", prefecture: "広島県", cheapest: 6000, options: [
    { means: "飛行機（広島→鹿児島）", duration: "約50分", cost: 11000, tip: "早割で6,000円〜" },
    { means: "新幹線（広島→鹿児島中央）", duration: "約2時間30分", cost: 14000, tip: "さくら利用。近いので新幹線も快適" },
  ]},
  "岡山": { city: "岡山", prefecture: "岡山県", cheapest: 12000, options: [
    { means: "新幹線（岡山→鹿児島中央）", duration: "約3時間", cost: 17000, tip: "さくら利用" },
  ]},

  // 九州（近隣）
  "福岡": { city: "福岡", prefecture: "福岡県", cheapest: 3000, options: [
    { means: "高速バス（博多→鹿児島中央）", duration: "約3時間30分", cost: 3000, tip: "最安3,000円〜。事前予約で格安" },
    { means: "新幹線（博多→鹿児島中央）", duration: "約1時間20分", cost: 7000, tip: "さくら利用。速くて快適" },
    { means: "飛行機（福岡→鹿児島）", duration: "約45分", cost: 8000, tip: "空港アクセス含めると新幹線と大差なし" },
  ]},
  "熊本": { city: "熊本", prefecture: "熊本県", cheapest: 2500, options: [
    { means: "高速バス（熊本→鹿児島）", duration: "約2時間30分", cost: 2500, tip: "最安値。事前予約推奨" },
    { means: "新幹線（熊本→鹿児島中央）", duration: "約47分", cost: 5000, tip: "最速ルート" },
  ]},
  "宮崎": { city: "宮崎", prefecture: "宮崎県", cheapest: 2000, options: [
    { means: "高速バス（宮崎→鹿児島）", duration: "約2時間", cost: 2000, tip: "最安値。本数も多い" },
    { means: "特急きりしま（宮崎→鹿児島中央）", duration: "約2時間", cost: 3500, tip: "乗り換えなしで快適" },
  ]},
  "長崎": { city: "長崎", prefecture: "長崎県", cheapest: 4000, options: [
    { means: "高速バス（長崎→鹿児島）", duration: "約3時間30分", cost: 4000, tip: "乗り換えなし" },
    { means: "新幹線＋さくら（長崎→博多→鹿児島）", duration: "約2時間30分", cost: 12000, tip: "速いが料金高め" },
  ]},
  "大分": { city: "大分", prefecture: "大分県", cheapest: 3500, options: [
    { means: "高速バス（大分→鹿児島）", duration: "約3時間30分", cost: 3500, tip: "直行バスあり" },
  ]},
  "佐賀": { city: "佐賀", prefecture: "佐賀県", cheapest: 3500, options: [
    { means: "高速バス or 新幹線＋乗継", duration: "約2時間〜", cost: 3500, tip: "福岡経由が便利" },
  ]},

  // 沖縄
  "那覇": { city: "那覇", prefecture: "沖縄県", cheapest: 8000, options: [
    { means: "飛行機（那覇→鹿児島）", duration: "約1時間30分", cost: 13000, tip: "LCCで8,000円〜" },
  ]},
};

export function getTransportInfo(cityName: string): CityTransport | null {
  const key = Object.keys(TRANSPORT_TABLE).find(
    (k) => cityName.includes(k) || k.includes(cityName.replace(/市|区|都|道|府|県/g, ""))
  );
  return key ? TRANSPORT_TABLE[key] : null;
}

export function formatTransportSummary(city: CityTransport): string {
  const lines = [
    `**${city.city}→鹿児島の交通費（片道目安）**`,
    `最安値: 約¥${city.cheapest.toLocaleString()}〜`,
    "",
    ...city.options.map((o) =>
      `• ${o.means}（${o.duration}）: 約¥${o.cost.toLocaleString()}` +
      (o.tip ? `\n  💡 ${o.tip}` : "")
    ),
  ];
  return lines.join("\n");
}
