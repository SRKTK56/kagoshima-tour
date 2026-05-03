import { streamText, convertToModelMessages, stepCountIs, hasToolCall } from "ai";
import { openai } from "@ai-sdk/openai";
import { z } from "zod";
import { searchViatorProducts } from "@/lib/viator";
import { getTransportInfo, formatTransportSummary } from "@/lib/transport";

export const maxDuration = 60;

const spotSchema = z.object({
  time: z.string().describe("時刻 例: '10:00'"),
  name: z.string(),
  description: z.string(),
  type: z.enum(["tour", "meal", "hotel", "transport", "free"]),
  imageUrl: z.string().optional().describe("写真URL（Viatorや実在するURLのみ）"),
  mapQuery: z.string().optional().describe("Google Maps検索クエリ 例: '桜島 鹿児島'"),
  price: z.number().optional().describe("1人あたり料金（円）"),
  bookingUrl: z.string().optional(),
});

const daySchema = z.object({
  day: z.number(),
  date: z.string().optional().describe("例: '6月14日(日)'"),
  title: z.string().describe("その日のテーマ 例: '鹿児島到着・桜島観光'"),
  spots: z.array(spotSchema),
});

export async function POST(req: Request) {
  const body = await req.json();
  const messages = Array.isArray(body) ? body : (body.messages ?? []);
  const modelMessages = await convertToModelMessages(messages);

  const result = streamText({
    model: openai("gpt-4o"),
    stopWhen: [hasToolCall("askQuestion"), stepCountIs(8)],
    system: `あなたは鹿児島専門のAI旅行コンシェルジュです。
ユーザーの旅の理想像を丁寧に深掘りしたうえで、最適なツアーと旅程を提案します。

━━━━━━━━━━━━━━━━━━━━━━
【絶対ルール①】質問は askQuestion ツールのみ
━━━━━━━━━━━━━━━━━━━━━━
- ユーザーへの質問は必ず askQuestion ツールで行う
- askQuestion を呼んだら**即座に応答を終了する**（追加のツール呼び出し・テキスト出力は一切しない）
- 1ターンに askQuestion は**1回だけ**。未確認の項目が複数あっても、1問ずつ順番に聞く
- テキストに質問文・選択肢・箇条書きを書くことは禁止
- 補足説明・共感・アドバイスはテキストでOK（質問を含めない）
- 選択肢は 3〜5個、必ず emoji を付ける

━━━━━━━━━━━━━━━━━━━━━━
【絶対ルール②】必須情報が全部揃うまでツアー提案・旅程作成禁止
━━━━━━━━━━━━━━━━━━━━━━
searchTours・updateItinerary を呼んでよいのは、以下の7項目がすべて判明してからのみ。

  [1] 出発地（都市名）
  [2] 旅行時期（何月ごろ）
  [3] 旅行日数（何泊何日）
  [4] 人数・同行者の属性（何人で / 一人旅 / カップル / 家族(子あり) / 友人グループ 等）
      ※ 必ず**具体的な人数**を把握する。「家族で」だけでは不十分。「何名ですか？」と追加確認する
  [4b] 子連れ（family_with_kids）の場合のみ：**子供の年齢**を全員分確認する
      ※ 年齢によって交通費・ツアー料金が大きく変わるため必須
  [5] 予算感（総額 or 1人あたり — どちらで答えてもよい。「家族全体で」なら総額として扱う）
  [6] 旅のテーマ・目的（例：絶景・グルメ・温泉・歴史・アクティビティ 等）
  [7] 体験の深さ・ペース（観光地を効率よく巡りたい / のんびり過ごしたい）

未確認の項目がある場合は、askQuestion で1つずつ聞いていく。
すべて揃ったら getTransport → searchTours → updateItinerary の順で呼び出す。

━━━━━━━━━━━━━━━━━━━━━━
質問の進め方
━━━━━━━━━━━━━━━━━━━━━━
- ユーザーが最初に情報を一部伝えてきた場合は、すでに判明している項目をスキップし、未確認のものだけ聞く
- [1]出発地 → [2]時期 → [3]日数 → [4]同行者 → [5]予算 → [6]テーマ → [7]ペース の順が自然
- ただし会話の流れで順序が前後してもよい
- 回答から複数項目が同時に判明した場合はまとめてスキップしてよい

━━━━━━━━━━━━━━━━━━━━━━
ツアー・旅程の提案ルール（7項目確認後）
━━━━━━━━━━━━━━━━━━━━━━
searchTours を呼ぶ際は以下の全パラメータを必ず設定すること：

  interests   : [6]テーマから導いたキーワード例 ["温泉","グルメ","歴史"]
  companions  : [4]同行者 → solo/couple/family_with_kids/family_no_kids/friends
  pace        : [7]ペース → active/relaxed/balanced
  nights      : [3]泊数（数値）
  month       : [2]旅行月（1〜12 の数値）
  childAges   : [4b]子供の年齢リスト（例: [8, 5]）。子連れ以外は空配列 []
  maxPricePerPerson : [5]予算計算（大人1人あたりのツアー上限）
    まず「旅行全体の総費用」を人数換算で計算する：
      子供の交通費係数（getTransport.cheapest を基準）：
        0〜2歳   = 0（無料）
        3〜5歳   = 0（無料 ※飛行機は座席使用時のみ有料）
        6〜11歳  = 0.5（半額）
        12歳以上 = 1.0（大人料金）
      総交通費 = cheapest × 2 × (大人人数 + Σ子供係数)
      宿泊費（1室想定）= 宿泊費単価 × 泊数 × 大人人数（幼児は無料が多い）
        単価目安：ビジネス=6000円 / 旅館=10000円 / リゾート=15000円
      ツアー予算残額 = 総予算 − 総交通費 − 宿泊費総額
      maxPricePerPerson（大人1人あたりツアー上限） = ツアー予算残額 ÷ 大人人数
    ≤ 0 の場合は searchTours を呼ばず askQuestion で予算か日数を再確認する

同行者によるフィルタリング：
  family_with_kids → 子連れ向けを interests に追加、酒類・高体力ツアーは除外
  couple          → プライベート・ロマンチック系を interests に追加
  active          → アドベンチャー・トレッキング系を interests に追加
  relaxed         → 温泉・グルメ・文化体験を interests に追加

結果の処理：
  budgetInsufficient=true → 予算不足をユーザーに伝え askQuestion で再確認
  found=false             → 「条件に合うツアーが見つかりませんでした」と伝え条件緩和を提案

updateItinerary：searchTours とセットで必ず呼ぶ。ツアー変更・追加のたびに更新する
  budget の設定ルール（子供の年齢を考慮した実費計算）：
    ツアー料金の子供係数：0〜2歳=0 / 3〜5歳=0.5 / 6〜11歳=0.5 / 12歳〜=1.0
    transport         = 大人1人往復交通費（getTransport.cheapest × 2）
    accommodation     = 宿泊費単価 × 泊数（大人1人）
    tours             = 選んだツアー料金合計（大人1人）
    total             = transport + accommodation + tours（大人1人合計）
    partySize         = 旅行人数（大人＋子供の全員数）
    totalForParty     = 大人人数 × total
                        + Σ(子供ごとに: transport×係数 + tours×係数 + accommodation×係数)
                        ※ 宿泊は幼児(0〜5歳)無料の場合が多い — 6歳以上は半額で計上
imageUrl：searchTours の Viator 画像 URL のみ使用（架空 URL 厳禁）
mapQuery：「スポット名 鹿児島」形式
type分類：tour=体験/観光, meal=食事, hotel=宿泊, transport=移動, free=自由時間

━━━━━━━━━━━━━━━━━━━━━━
鹿児島の主な見どころ
━━━━━━━━━━━━━━━━━━━━━━
- 桜島（火山・溶岩展望・フェリー）
- 指宿（砂むし温泉・開聞岳・薩摩富士）
- 屋久島（縄文杉・白谷雲水峡・世界遺産）
- 知覧（武家屋敷・特攻平和会館）
- グルメ（黒豚・薩摩揚げ・薩摩焼酎・きびなご・さつま汁）

対応言語：ユーザーの言語（日本語 / English）に合わせる
今日の日付: ${new Date().toLocaleDateString("ja-JP")}`,
    messages: modelMessages,
    tools: {
      searchTours: {
        description: "収集した全情報（予算・同行者・ペース・時期・日数・テーマ）をすべて渡してツアーを検索する。情報が揃ったら必ず全パラメータを設定すること。",
        inputSchema: z.object({
          interests: z.array(z.string()).describe("テーマ・目的から導いたキーワード（例: ['温泉','グルメ','歴史']）"),
          maxPricePerPerson: z.number().optional().describe("大人1人あたりのツアー上限（円）。子供の交通費を考慮した残額÷大人人数"),
          companions: z.enum(["solo", "couple", "family_with_kids", "family_no_kids", "friends"]).optional()
            .describe("同行者タイプ。family_with_kids=子連れ家族、family_no_kids=子なし家族"),
          pace: z.enum(["active", "relaxed", "balanced"]).optional()
            .describe("旅のペース。active=活動的, relaxed=のんびり, balanced=バランス"),
          nights: z.number().optional().describe("宿泊数"),
          month: z.number().min(1).max(12).optional().describe("旅行月（1〜12）"),
          childAges: z.array(z.number()).optional().describe("子供の年齢リスト（例: [8, 5]）。子連れ以外は省略"),
        }),
        execute: async ({ interests, maxPricePerPerson, companions, pace, nights, month, childAges }) =>
          searchViatorProducts({ interests, maxPricePerPerson, companions, pace, nights, month, childAges }),
      },
      getTransport: {
        description: "出発地から鹿児島への交通手段・料金・所要時間を取得する。",
        inputSchema: z.object({
          city: z.string().describe("出発地の都市名（例: '東京'）"),
        }),
        execute: async ({ city }) => {
          const info = getTransportInfo(city);
          if (!info) return { found: false, message: `${city}の交通情報はデータがありません。` };
          return { found: true, summary: formatTransportSummary(info), cheapest: info.cheapest, options: info.options };
        },
      },
      askQuestion: {
        description: "旅程を絞り込むために選択肢付きで質問する。テキストで質問する代わりに必ずこのツールを使う。",
        inputSchema: z.object({
          question: z.string().describe("ユーザーへの質問文"),
          options: z.array(z.object({
            label: z.string().describe("選択肢の表示テキスト"),
            value: z.string().describe("選択肢の識別値"),
            emoji: z.string().optional().describe("選択肢の絵文字"),
          })).min(2).max(5),
        }),
        execute: async (q) => q,
      },
      updateItinerary: {
        description: "旅程表を生成・更新する。ツアー提案時は必ずセットで呼び出す。",
        inputSchema: z.object({
          title: z.string().describe("旅程タイトル 例: '鹿児島 のんびり美食旅 2泊3日'"),
          destination: z.string().default("鹿児島"),
          departure: z.string().describe("出発地 例: '東京'"),
          nights: z.number().describe("泊数"),
          days: z.array(daySchema),
          budget: z.object({
            transport: z.number().describe("交通費（往復・大人1人）"),
            tours: z.number().describe("ツアー合計（大人1人）"),
            accommodation: z.number().describe("宿泊費合計（大人1人）"),
            total: z.number().describe("合計（大人1人）= transport + tours + accommodation"),
            partySize: z.number().optional().describe("旅行人数（大人＋子供の全員数）"),
            totalForParty: z.number().optional().describe("家族全員の合計費用（子供料金を年齢別に算出）"),
            childBreakdown: z.array(z.object({
              age: z.number().describe("子供の年齢"),
              transport: z.number().describe("交通費（往復）"),
              tours: z.number().describe("ツアー費用"),
              accommodation: z.number().describe("宿泊費"),
              subtotal: z.number().describe("小計"),
            })).optional().describe("子供ごとの費用内訳"),
          }).optional(),
        }),
        execute: async (plan) => plan,
      },
    },
  });

  return result.toUIMessageStreamResponse();
}
