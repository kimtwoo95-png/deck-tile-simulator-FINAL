"use client";

import { useState } from "react";

/* =========================================================
   타입
========================================================= */
type ProductType = "buddy" | "dot";
type BuddyColor = "ivory" | "lightgray" | "beige" | "butter";
type DotColorKey = "ivory" | "lightgray" | "beige" | "butter";
type DotPattern = "AAAA" | "ABBA" | "ABBC";

/* =========================================================
   색상
========================================================= */
const buddyColors: { key: BuddyColor; label: string; color: string }[] = [
  { key: "ivory", label: "아이보리", color: "#FDF8EE" },
  { key: "lightgray", label: "라이트그레이", color: "#D4D4D8" },
  { key: "beige", label: "베이지", color: "#EBD9B4" },
  { key: "butter", label: "버터", color: "#FFE9A7" },
];

const dotColors: { key: DotColorKey; label: string; color: string }[] = [
  { key: "ivory", label: "아이보리", color: "#FDF8EE" },
  { key: "lightgray", label: "라이트그레이", color: "#D4D4D8" },
  { key: "beige", label: "베이지", color: "#EBD9B4" },
  { key: "butter", label: "버터", color: "#FFE9A7" },
];

/* =========================================================
   패턴 (2×2)
========================================================= */
const patternCells: Record<DotPattern, ("A" | "B" | "C")[]> = {
  AAAA: ["A", "A", "A", "A"],
  ABBA: ["A", "B", "B", "A"],
  ABBC: ["A", "B", "B", "C"],
};

/* =========================================================
   박스 계산
========================================================= */
function calcPacks(total: number, sizes: number[]) {
  const sorted = [...sizes].sort((a, b) => b - a);
  const result: Record<number, number> = {};
  let remain = total;

  for (const size of sorted) {
    const cnt = Math.floor(remain / size);
    result[size] = cnt;
    remain -= cnt * size;
  }

  if (remain > 0) {
    const last = sorted[sorted.length - 1];
    result[last] = (result[last] || 0) + 1;
  }

  const totalPieces = Object.entries(result).reduce(
    (sum, [k, v]) => sum + Number(k) * v,
    0
  );

  return {
    packCounts: result,
    totalPieces,
    leftover: totalPieces - total,
  };
}

/* =========================================================
   페이지
========================================================= */
export default function Page() {
  const [product, setProduct] = useState<ProductType>("dot");

  const [width, setWidth] = useState(300);
  const [height, setHeight] = useState(300);

  const [buddyColor, setBuddyColor] = useState<BuddyColor>("ivory");

  const [pattern, setPattern] = useState<DotPattern>("ABBA");
  const [colorA, setColorA] = useState<DotColorKey>("ivory");
  const [colorB, setColorB] = useState<DotColorKey>("butter");
  const [colorC, setColorC] = useState<DotColorKey>("beige");

  /* 계산 */
  const buddyX = Math.ceil(width / 30);
  const buddyY = Math.ceil(height / 30);
  const buddyNeed = buddyX * buddyY;
  const buddyPack = calcPacks(buddyNeed, [36, 9, 2]);

  const dotX = Math.ceil(width / 10);
  const dotY = Math.ceil(height / 10);
  const dotNeed = dotX * dotY;
  const dotPack = calcPacks(dotNeed, [120, 40]);

  const colorMap: Record<DotColorKey, string> = {
    ivory: "#FDF8EE",
    lightgray: "#D4D4D8",
    beige: "#EBD9B4",
    butter: "#FFE9A7",
  };

  const getDotColor = (s: "A" | "B" | "C") =>
    s === "A" ? colorMap[colorA] : s === "B" ? colorMap[colorB] : colorMap[colorC];

  /* ========================================================= */
  return (
    <div className="min-h-screen bg-white px-4 py-8 text-slate-900">
      <div className="max-w-6xl mx-auto space-y-10">
        <h1 className="text-3xl font-black text-emerald-700">
          ALIVES 타일 계산기
        </h1>

        {/* 1. 제품 */}
        <section className="border rounded-xl p-5 grid grid-cols-2 gap-4">
          {[
            { key: "buddy", label: "버디 데크타일", sub: "30×30 / 4색" },
            { key: "dot", label: "도트 데크타일", sub: "10×10 / 4색 / 패턴" },
          ].map((p) => (
            <button
              key={p.key}
              onClick={() => setProduct(p.key as ProductType)}
              className={`rounded-xl border p-4 text-left ${
                product === p.key
                  ? "border-emerald-500 bg-emerald-50"
                  : "border-slate-300"
              }`}
            >
              <div className="font-bold">{p.label}</div>
              <div className="text-xs text-slate-500">{p.sub}</div>
            </button>
          ))}
        </section>

        {/* 2. 사이즈 */}
        <section className="border rounded-xl p-5">
          <h2 className="font-semibold mb-3">공간 사이즈 (cm)</h2>
          <div className="flex gap-3">
            <input
              type="number"
              value={width}
              onChange={(e) => setWidth(+e.target.value)}
              className="border rounded px-3 py-2 w-full"
            />
            <input
              type="number"
              value={height}
              onChange={(e) => setHeight(+e.target.value)}
              className="border rounded px-3 py-2 w-full"
            />
          </div>
        </section>

        {/* 3. 옵션 */}
        <section className="border rounded-xl p-5 space-y-6">
          {product === "buddy" && (
            <div className="grid grid-cols-2 gap-3">
              {buddyColors.map((c) => (
                <button
                  key={c.key}
                  onClick={() => setBuddyColor(c.key)}
                  className={`border rounded-lg p-3 ${
                    buddyColor === c.key ? "border-emerald-500" : ""
                  }`}
                >
                  <div
                    className="h-10 rounded border"
                    style={{ background: c.color }}
                  />
                  <div className="text-sm mt-1">{c.label}</div>
                </button>
              ))}
            </div>
          )}

          {product === "dot" && (
            <>
              {/* 패턴 */}
              <div className="grid grid-cols-3 gap-4">
                {(Object.keys(patternCells) as DotPattern[]).map((p) => (
                  <button
                    key={p}
                    onClick={() => setPattern(p)}
                    className={`border rounded-xl p-4 ${
                      pattern === p ? "border-emerald-500 bg-emerald-50" : ""
                    }`}
                  >
                    <div className="grid grid-cols-2">
                      {patternCells[p].map((s, i) => (
                        <div
                          key={i}
                          className="w-8 h-8 border"
                          style={{ background: getDotColor(s) }}
                        />
                      ))}
                    </div>
                    <div className="text-xs mt-2 text-center">{p}</div>
                  </button>
                ))}
              </div>

              {/* 색상 */}
              {[
                { label: "A", value: colorA, set: setColorA },
                { label: "B", value: colorB, set: setColorB },
                ...(pattern === "ABBC"
                  ? [{ label: "C", value: colorC, set: setColorC }]
                  : []),
              ].map((row) => (
                <div key={row.label} className="flex gap-2 flex-wrap items-center">
                  <span className="w-6 font-bold">{row.label}</span>
                  {dotColors.map((c) => (
                    <button
                      key={c.key + row.label}
                      onClick={() => row.set(c.key)}
                      className={`flex items-center gap-1 border rounded-full px-2 py-1 text-xs ${
                        row.value === c.key
                          ? "border-emerald-500 bg-emerald-50"
                          : ""
                      }`}
                    >
                      <span
                        className="w-3 h-3 rounded-full border"
                        style={{ background: c.color }}
                      />
                      {c.label}
                    </button>
                  ))}
                </div>
              ))}
            </>
          )}
        </section>

        {/* 4. 미리보기 */}
        <section className="border rounded-xl p-5">
          <h2 className="font-semibold mb-2">미리보기</h2>

          {product === "buddy" && (
            <div
              className="inline-grid"
              style={{ gridTemplateColumns: `repeat(${Math.min(buddyX, 40)}, 20px)` }}
            >
              {Array.from({ length: Math.min(buddyX, 40) * Math.min(buddyY, 40) }).map(
                (_, i) => (
                  <div
                    key={i}
                    className="border border-slate-300"
                    style={{
                      background:
                        buddyColors.find((b) => b.key === buddyColor)?.color,
                    }}
                  />
                )
              )}
            </div>
          )}

          {product === "dot" && (
            <div
              className="inline-grid"
              style={{ gridTemplateColumns: `repeat(${Math.min(dotX, 40)}, 10px)` }}
            >
              {Array.from({ length: Math.min(dotX, 40) * Math.min(dotY, 40) }).map(
                (_, i) => {
                  const x = i % Math.min(dotX, 40);
                  const y = Math.floor(i / Math.min(dotX, 40));
                  const idx = (y % 2) * 2 + (x % 2);
                  const s = patternCells[pattern][idx];
                  return (
                    <div
                      key={i}
                      className="border border-slate-300"
                      style={{ background: getDotColor(s) }}
                    />
                  );
                }
              )}
            </div>
          )}
        </section>

        {/* 5. 수량 */}
        <section className="border rounded-xl p-5 text-sm space-y-1">
          {product === "buddy" && (
            <>
              <div>필요 장수: {buddyNeed}</div>
              <div>36p: {buddyPack.packCounts[36] || 0}</div>
              <div>9p: {buddyPack.packCounts[9] || 0}</div>
              <div>2p: {buddyPack.packCounts[2] || 0}</div>
              <div>남는 장수: {buddyPack.leftover}</div>
            </>
          )}

          {product === "dot" && (
            <>
              <div>필요 개수: {dotNeed}</div>
              <div>120p: {dotPack.packCounts[120] || 0}</div>
              <div>40p: {dotPack.packCounts[40] || 0}</div>
              <div>남는 수량: {dotPack.leftover}</div>
            </>
          )}
        </section>
      </div>
    </div>
  );
}
