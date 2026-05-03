export interface ViatorProduct {
  productCode: string;
  title: string;
  description: string;
  price: number;
  currency: string;
  duration: string;
  durationMinutes: number;
  rating: number;
  reviewCount: number;
  tags: string[];
  productUrl: string;
  imageUrl: string;
  location: string;
  companions: string[];   // "solo"|"couple"|"family"|"friends" のどれに向いているか
  pace: "active" | "relaxed" | "balanced";
  alcoholRelated: boolean;
  physicalDemand: "low" | "medium" | "high";
}

export type Companions = "solo" | "couple" | "family_with_kids" | "family_no_kids" | "friends";
export type Pace = "active" | "relaxed" | "balanced";

export interface SearchOptions {
  interests: string[];
  maxPricePerPerson?: number;
  companions?: Companions;
  pace?: Pace;
  nights?: number;
  month?: number; // 1-12
  childAges?: number[]; // 子供の年齢リスト
}

export interface SearchResult {
  products: ViatorProduct[];
  found: boolean;
  budgetInsufficient?: boolean;
}

const MOCK_PRODUCTS: ViatorProduct[] = [
  {
    productCode: "KAG-001",
    title: "桜島火山トレッキング & 溶岩展望ツアー",
    description: "活火山・桜島を地元ガイドと歩くダイナミックな体験。溶岩台地を歩き、錦江湾越しに鹿児島市街を一望。地球の鼓動を感じる絶景体験。",
    price: 8500,
    currency: "JPY",
    duration: "4時間",
    durationMinutes: 240,
    rating: 4.8,
    reviewCount: 342,
    tags: ["アドベンチャー", "自然", "火山", "ガイド付き", "絶景"],
    productUrl: "https://www.viator.com/tours/Kagoshima/Sakurajima-Volcano-Trekking",
    imageUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800",
    location: "桜島",
    companions: ["solo", "couple", "friends"],
    pace: "active",
    alcoholRelated: false,
    physicalDemand: "high",
  },
  {
    productCode: "KAG-002",
    title: "指宿砂むし温泉 & 開聞岳プライベートツアー",
    description: "日本唯一の天然砂むし温泉で身体の芯から温まる。薩摩富士と呼ばれる開聞岳を望む絶景ランチ付き。指宿の魅力を1日で体験。",
    price: 12000,
    currency: "JPY",
    duration: "8時間",
    durationMinutes: 480,
    rating: 4.9,
    reviewCount: 218,
    tags: ["温泉", "文化", "リラクゼーション", "ランチ付き", "プライベート"],
    productUrl: "https://www.viator.com/tours/Kagoshima/Ibusuki-Sand-Bath",
    imageUrl: "https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=800",
    location: "指宿市",
    companions: ["solo", "couple", "family", "friends"],
    pace: "relaxed",
    alcoholRelated: false,
    physicalDemand: "low",
  },
  {
    productCode: "KAG-003",
    title: "鹿児島グルメ食べ歩きツアー（黒豚・薩摩揚げ・焼酎）",
    description: "地元市場と老舗を巡る食の冒険。本場の黒豚しゃぶしゃぶ、揚げたての薩摩揚げ、蔵元直送の焼酎試飲。食を通じて鹿児島の文化を体験。",
    price: 6500,
    currency: "JPY",
    duration: "3時間",
    durationMinutes: 180,
    rating: 4.7,
    reviewCount: 156,
    tags: ["グルメ", "文化", "少人数制", "焼酎", "黒豚"],
    productUrl: "https://www.viator.com/tours/Kagoshima/Food-Tour",
    imageUrl: "https://images.unsplash.com/photo-1617196034183-421b4040ed20?w=800",
    location: "鹿児島市中央",
    companions: ["solo", "couple", "friends"],
    pace: "relaxed",
    alcoholRelated: true,
    physicalDemand: "low",
  },
  {
    productCode: "KAG-004",
    title: "屋久島 縄文杉トレッキング 1日ガイドツアー",
    description: "樹齢7200年の縄文杉まで往復10時間の感動トレッキング。世界自然遺産の原始林を専門ガイドが案内。携行食・レインギア貸出付き。",
    price: 18000,
    currency: "JPY",
    duration: "10時間",
    durationMinutes: 600,
    rating: 4.9,
    reviewCount: 489,
    tags: ["世界遺産", "トレッキング", "自然", "ガイド付き"],
    productUrl: "https://www.viator.com/tours/Kagoshima/Yakushima-Jomon-Sugi",
    imageUrl: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800",
    location: "屋久島",
    companions: ["solo", "couple", "friends"],
    pace: "active",
    alcoholRelated: false,
    physicalDemand: "high",
  },
  {
    productCode: "KAG-005",
    title: "薩摩焼酎 蔵元見学 & テイスティングツアー",
    description: "創業150年の老舗蔵元で焼酎の製造工程を見学。芋・麦・米の飲み比べ、伝統の甕壺仕込みを体験。お土産付き。英語ガイド対応可。",
    price: 5000,
    currency: "JPY",
    duration: "2時間30分",
    durationMinutes: 150,
    rating: 4.6,
    reviewCount: 94,
    tags: ["焼酎", "文化", "試飲", "英語対応"],
    productUrl: "https://www.viator.com/tours/Kagoshima/Shochu-Brewery-Tour",
    imageUrl: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800",
    location: "鹿児島市",
    companions: ["solo", "couple", "friends"],
    pace: "relaxed",
    alcoholRelated: true,
    physicalDemand: "low",
  },
  {
    productCode: "KAG-006",
    title: "知覧特攻平和会館 & 武家屋敷庭園 歴史ツアー",
    description: "日本近代史の重要スポット・知覧特攻平和会館を訪問。国の名勝に指定された武家屋敷の石垣と庭園を巡る。歴史と文化の深い旅。",
    price: 9500,
    currency: "JPY",
    duration: "5時間",
    durationMinutes: 300,
    rating: 4.8,
    reviewCount: 203,
    tags: ["歴史", "文化", "庭園", "半日ツアー"],
    productUrl: "https://www.viator.com/tours/Kagoshima/Chiran-Peace-Museum",
    imageUrl: "https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=800",
    location: "南九州市知覧町",
    companions: ["solo", "couple", "family", "friends"],
    pace: "balanced",
    alcoholRelated: false,
    physicalDemand: "low",
  },
];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapProduct(p: any, currency: string): ViatorProduct {
  const image = p.images?.[0]?.variants?.find(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (v: any) => v.width >= 400
  )?.url ?? p.images?.[0]?.variants?.[0]?.url ?? "";

  const durationMinutes = (() => {
    const d = p.duration?.fixedDurationInMinutes;
    const min = p.duration?.variableDurationFromMinutes;
    return d ?? min ?? 0;
  })();

  const durationFixed = (() => {
    const d = p.duration?.fixedDurationInMinutes;
    const min = p.duration?.variableDurationFromMinutes;
    const max = p.duration?.variableDurationToMinutes;
    if (d) return `${Math.floor(d / 60) > 0 ? `${Math.floor(d / 60)}時間` : ""}${d % 60 > 0 ? `${d % 60}分` : ""}`;
    if (min && max) return `${min}〜${max}分`;
    return "";
  })();

  return {
    productCode: p.productCode,
    title: p.title ?? "",
    description: p.description ?? "",
    price: p.pricing?.summary?.fromPrice ?? 0,
    currency,
    duration: durationFixed,
    durationMinutes,
    rating: p.reviews?.combinedAverageRating ?? 0,
    reviewCount: p.reviews?.totalReviews ?? 0,
    tags: [],
    productUrl: p.productUrl ?? `https://www.viator.com/tours/${p.productCode}`,
    imageUrl: image,
    location: p.destinations?.[0]?.name ?? "鹿児島",
    companions: ["solo", "couple", "family", "friends"],
    pace: durationMinutes >= 360 ? "active" : durationMinutes <= 180 ? "relaxed" : "balanced",
    alcoholRelated: false,
    physicalDemand: durationMinutes >= 480 ? "high" : durationMinutes >= 240 ? "medium" : "low",
  };
}

function getCustomTours(): ViatorProduct[] {
  try {
    const { getAllTours } = require("@/lib/db");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return getAllTours().map((t: any) => ({
      productCode: t.product_code,
      title: t.title,
      description: t.description,
      price: t.price,
      currency: t.currency,
      duration: t.duration,
      durationMinutes: 0,
      rating: t.rating,
      reviewCount: t.review_count,
      tags: JSON.parse(t.tags || "[]"),
      productUrl: t.product_url,
      imageUrl: t.image_url,
      location: t.location,
      companions: ["solo", "couple", "family", "friends"],
      pace: "balanced" as const,
      alcoholRelated: false,
      physicalDemand: "low" as const,
    }));
  } catch {
    return [];
  }
}

const KAGOSHIMA_DEST_ID = "4663";

function applyFilters(products: ViatorProduct[], opts: SearchOptions): ViatorProduct[] {
  return products.filter((p) => {
    // 予算フィルター
    if (opts.maxPricePerPerson != null && p.price > 0 && p.price > opts.maxPricePerPerson) return false;

    // 同行者フィルター
    if (opts.companions) {
      const base = opts.companions === "family_with_kids" ? "family"
        : opts.companions === "family_no_kids" ? "couple"
        : opts.companions;

      if (!p.companions.includes(base) && !p.companions.includes("solo")) return false;

      // 子連れの場合は体力負荷が高いものと酒類関連を除外
      if (opts.companions === "family_with_kids") {
        if (p.physicalDemand === "high") return false;
        if (p.alcoholRelated) return false;
      }
    }

    // ペースフィルター
    if (opts.pace) {
      if (opts.pace === "active" && p.pace === "relaxed" && p.durationMinutes < 180) return false;
      if (opts.pace === "relaxed" && p.physicalDemand === "high") return false;
    }

    // 夏（7〜8月）の高体力ツアーは注意が必要（除外はしないがスコアで下げる用途で残す）

    return true;
  });
}

function buildViatorFiltering(opts: SearchOptions): Record<string, unknown> {
  const filtering: Record<string, unknown> = {
    destination: KAGOSHIMA_DEST_ID,
  };

  if (opts.maxPricePerPerson != null && opts.maxPricePerPerson > 0) {
    filtering.highestPrice = opts.maxPricePerPerson;
  }

  // ペースに応じた所要時間フィルター
  if (opts.pace === "relaxed") {
    filtering.durationInMinutes = { from: 0, to: 360 };
  } else if (opts.pace === "active") {
    filtering.durationInMinutes = { from: 180, to: 999 };
  }

  // プライベートツアー優先（カップル・家族向け）
  if (opts.companions === "couple" || opts.companions?.startsWith("family")) {
    filtering.flags = ["PRIVATE_TOUR"];
  }

  return filtering;
}

function buildInterestsWithContext(opts: SearchOptions): string[] {
  const kw = [...opts.interests];

  if (opts.companions === "family_with_kids") kw.push("子供", "ファミリー", "キッズ");
  if (opts.companions === "couple") kw.push("カップル", "プライベート", "ロマンチック");
  if (opts.pace === "active") kw.push("アドベンチャー", "トレッキング");
  if (opts.pace === "relaxed") kw.push("温泉", "のんびり");

  // 夏のキーワード補完
  if (opts.month && [6, 7, 8].includes(opts.month)) kw.push("夏", "涼しい");

  return [...new Set(kw)];
}

export async function searchViatorProducts(opts: SearchOptions): Promise<SearchResult> {
  if (opts.maxPricePerPerson != null && opts.maxPricePerPerson <= 0) {
    return { products: [], found: false, budgetInsufficient: true };
  }

  const apiKey = process.env.VIATOR_API_KEY;
  const currency = "JPY";
  const customTours = applyFilters(getCustomTours(), opts);

  if (apiKey) {
    try {
      const response = await fetch(
        "https://api.viator.com/partner/products/search",
        {
          method: "POST",
          headers: {
            "exp-api-key": apiKey,
            "Accept": "application/json;version=2.0",
            "Accept-Language": "ja",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            filtering: buildViatorFiltering(opts),
            sorting: { sort: "TRAVELER_RATING", order: "DESCENDING" },
            pagination: { start: 1, count: 8 },
            currency,
          }),
        }
      );
      if (response.ok) {
        const data = await response.json();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const viatorProducts = applyFilters(
          (data.products ?? []).map((p: any) => mapProduct(p, currency)),
          opts
        );
        const all = [...customTours, ...viatorProducts];
        return { products: all, found: all.length > 0 };
      }
    } catch {
      // fall through to mock
    }
  }

  // モックフォールバック
  const keywords = buildInterestsWithContext(opts);
  const mockFiltered = applyFilters(
    opts.interests.length === 0
      ? MOCK_PRODUCTS
      : MOCK_PRODUCTS.filter((p) => keywords.some((k) => p.tags.some((t) => t.includes(k)))),
    opts
  );

  const all = [...customTours, ...mockFiltered];
  return { products: all, found: all.length > 0 };
}
