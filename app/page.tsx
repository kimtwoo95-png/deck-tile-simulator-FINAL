"use client";

import { useState } from "react";

/* =========================
   타입 정의
========================= */
type ProductType = "buddy" | "dot";
type ColorKey = "ivory" | "lightgray" | "beige" | "butter";
type DotPattern = "AAAA" | "ABBA" | "ABBC";

/* =========================
   공통 색상 (버디 / 도트 동일)
========================= */
const COLOR_OPTIONS: {
  key: ColorKey;
  label: string;
  hex: string;
}[] = [
  { key: "ivory", label: "아이보리", hex: "#FDF8EE" },
  { key: "lightgray", label: "라이트그레이", hex: "#D6D6D6" },
  { key: "beige", label: "베이지", hex: "#E7D3B0" },
  { key: "butter", label: "버터", hex: "#FFE8A3" },
];

/* =========================
   도트 패턴 (2×2 = 1세트)
========================= */
const DOT_PATTERN_MAP: Record<DotPattern, ("A" | "B" | "C")[]> = {
  AAAA: ["A", "A", "A", "A"],
  ABBA: ["A", "B", "B", "A"],
  ABBC: ["A", "B", "B", "C"],
};

/* =========================
   박스 계산 함수
========================= */
function calcPacks(need: number, packs: number[]) {
  const sorted = [...packs].sort((a, b) => b - a);
  const result: Record<number, number> = {};
  let remain = need;

  for (const size of sorted) {
    const cnt = Math.floor(remain / size);
    result[size] = cnt;
    remain -= cnt * size;
  }

  if (remain > 0) {
    const smallest = sorted[sorted.length - 1];
    result[smallest] += 1;
    remain = 0;
  }

  const total = sorted.reduce(
    (sum, s) => sum + s * (result[s] || 0),
    0
  );

  return { result, total, leftover: total - need };
}

/* =========================
   메인 컴포넌트
========================= */
export default function Page() {
  const [product, setProduct] = useState<ProductType>("buddy");

  /* 공간 (cm) */
  const [width, setWidth] = useState(300);
  const [height, setHeight] = useState(300);

  /* 버디 */
  const [buddyColor, setBuddyColor] = useState<ColorKey>("ivory");

  /* 도트 */
  const [dotPattern, setDotPattern] = useState<DotPattern>("AAAA");
  const [colorA, setColorA] = useState<ColorKey>("ivory");
  const [colorB, setColorB] = useState<ColorKey>("beige");
  const [colorC, setColorC] = useState<ColorKey>("butter");

  /* =========================
     계산
  ========================= */
  const buddyX = Math.ceil(width / 30);
  const buddyY = Math.ceil(height / 30);
  const buddyNeed = buddyX * buddyY;
  const buddyPack = calcPacks(buddyNeed, [36, 9, 2]);

  const dotX = Math.ceil(width / 10);
  const dotY = Math.ceil(height / 10);
  const dotNeed = dotX * dotY;
  const dotPack = calcPacks(dotNeed, [120, 40]);

  const colorMap: Record<ColorKey, string> = Object.fromEntries(
    COLOR_OPTIONS.map((c) => [c.key, c.hex])
  ) as Record<ColorKey, string>;

  function getDotColor(symbol: "A" | "B" | "C") {
    if (symbol === "A") return colorMap[colorA];
    if (symbol === "B") return colorMap[colorB];
    return colorMap[colorC];
  }

  /* =========================
     렌더
  ========================= */
  return (
    <div className="min-h-screen bg-slate-50 px-4 py-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* 타이틀 */}
        <header className="text-center space-y-1">
          <h1 className="text-3xl font-bold text-slate-900">
            ALIVES 타일 계산기
          </h1>
          <p className="text-sm text-slate-500">
            공간 사이즈 입력 → 패턴 / 색상 선택 → 수량 자동 계산
          </p>
        </header>

        {/* 제품 선택 */}
        <section className="bg-white rounded-xl p-4 shadow">
          <div className="flex gap-3">
            {(["buddy", "dot"] as ProductType[]).map((t) => (
              <button
                key={t}
                onClick={() => setProduct(t)}
                className={`flex-1 rounded-lg border p-4 text-left ${
                  product === t
                    ? "border-emerald-500 bg-emerald-50"
                    : "border-slate-200"
                }`}
              >
                <div className="font-semibold">
                  {t === "buddy" ? "버디 데크타일" : "도트 데크타일"}
                </div>
                <div className="text-xs text-slate-500">
                  {t === "buddy" ? "30 × 30 cm" : "10 × 10 cm"}
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* 공간 입력 */}
        <section className="bg-white rounded-xl p-4 shadow">
          <div className="grid grid-cols-2 gap-4">
            <input
              type="number"
              value={width}
              onChange={(e) => setWidth(Number(e.target.value) || 0)}
              className="border rounded-lg px-3 py-2"
              placeholder="가로(cm)"
            />
            <input
              type="number"
              value={height}
              onChange={(e) => setHeight(Number(e.target.value) || 0)}
              className="border rounded-lg px-3 py-2"
              placeholder="세로(cm)"
            />
          </div>
        </section>

        {/* 색상 선택 */}
        <section className="bg-white rounded-xl p-4 shadow space-y-3">
          <div className="font-semibold">색상 선택</div>
          <div className="grid grid-cols-4 gap-3">
            {COLOR_OPTIONS.map((c) => (
              <button
                key={c.key}
                onClick={() =>
                  product === "buddy"
                    ? setBuddyColor(c.key)
                    : setColorA(c.key)
                }
                className="flex flex-col items-center gap-1"
              >
                <div
                  className="w-10 h-10 rounded border"
                  style={{ backgroundColor: c.hex }}
                />
                <span className="text-xs">{c.label}</span>
              </button>
            ))}
          </div>
        </section>

        {/* 미리보기 */}
        <section className="bg-white rounded-xl p-4 shadow">
          <div className="font-semibold mb-2">미리보기</div>

          {product === "buddy" ? (
            <div
              className="inline-grid"
              style={{
                gridTemplateColumns: `repeat(${buddyX}, 14px)`,
              }}
            >
              {Array.from({ length: buddyNeed }).map((_, i) => (
                <div
                  key={i}
                  style={{
                    backgroundColor: colorMap[buddyColor],
                    border: "1px solid #B0B0B0",
                    width: 14,
                    height: 14,
                  }}
                />
              ))}
            </div>
          ) : (
            <div
              className="inline-grid"
              style={{
                gridTemplateColumns: `repeat(${dotX}, 8px)`,
              }}
            >
              {Array.from({ length: dotNeed }).map((_, i) => {
                const x = i % dotX;
                const y = Math.floor(i / dotX);
                const idx = (y % 2) * 2 + (x % 2);
                const symbol = DOT_PATTERN_MAP[dotPattern][idx];

                return (
                  <div
                    key={i}
                    style={{
                      backgroundColor: getDotColor(symbol),
                      border: "1px solid #999",
                      width: 8,
                      height: 8,
                    }}
                  />
                );
              })}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
