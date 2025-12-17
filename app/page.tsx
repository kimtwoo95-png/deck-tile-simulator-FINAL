"use client";

import { useState } from "react";

/* =========================================================
   타입 정의
========================================================= */
type ProductType = "buddy" | "dot";
type BuddyColor = "ivory" | "lightgray" | "beige" | "butter";
type DotColorKey = "ivory" | "lightgray" | "beige" | "butter";
type DotPattern = "AAAA" | "ABBA" | "ABBC";

/* =========================================================
   색상 옵션
========================================================= */
const buddyColorOptions = [
  { key: "ivory", label: "아이보리", color: "#FDF8EE" },
  { key: "lightgray", label: "라이트그레이", color: "#D4D4D8" },
  { key: "beige", label: "베이지", color: "#EBD9B4" },
  { key: "butter", label: "버터", color: "#FFE9A7" },
] as const;

const dotColorOptions = [
  { key: "ivory", label: "아이보리", color: "#FDF8EE" },
  { key: "lightgray", label: "라이트그레이", color: "#D4D4D8" },
  { key: "beige", label: "베이지", color: "#EBD9B4" },
  { key: "butter", label: "버터", color: "#FFE9A7" },
] as const;

/* =========================================================
   도트 패턴 (2×2)
========================================================= */
const dotPatternCells: Record<DotPattern, ("A" | "B" | "C")[]> = {
  AAAA: ["A", "A", "A", "A"],
  ABBA: ["A", "B", "B", "A"],
  ABBC: ["A", "B", "B", "C"],
};

/* =========================================================
   박스 계산 함수
========================================================= */
function calcPacks(totalNeeded: number, packSizes: number[]) {
  const sorted = [...packSizes].sort((a, b) => b - a);
  const smallest = sorted[sorted.length - 1];

  const packCounts: Record<number, number> = {};
  let remaining = totalNeeded;

  for (const size of sorted) {
    const count = Math.floor(remaining / size);
    packCounts[size] = count;
    remaining -= count * size;
  }

  if (remaining > 0) {
    packCounts[smallest] = (packCounts[smallest] || 0) + 1;
  }

  const totalPieces = sorted.reduce(
    (sum, size) => sum + size * (packCounts[size] || 0),
    0
  );

  return {
    packCounts,
    totalPieces,
    leftover: totalPieces - totalNeeded,
  };
}

/* =========================================================
   메인 컴포넌트
========================================================= */
export default function Page() {
  const [productType, setProductType] = useState<ProductType>("buddy");

  const [widthCm, setWidthCm] = useState(300);
  const [heightCm, setHeightCm] = useState(300);

  const [buddyColor, setBuddyColor] = useState<BuddyColor>("ivory");

  const [dotPattern, setDotPattern] = useState<DotPattern>("AAAA");
  const [dotColorA, setDotColorA] = useState<DotColorKey>("ivory");
  const [dotColorB, setDotColorB] = useState<DotColorKey>("butter");
  const [dotColorC, setDotColorC] = useState<DotColorKey>("beige");

  const maxPreviewTiles = 40;

  /* ---------------- 계산 ---------------- */
  const buddyX = Math.ceil(widthCm / 30);
  const buddyY = Math.ceil(heightCm / 30);
  const buddyNeeded = buddyX * buddyY;
  const buddyPack = calcPacks(buddyNeeded, [36, 9, 2]);

  const dotX = Math.ceil(widthCm / 10);
  const dotY = Math.ceil(heightCm / 10);
  const dotNeeded = dotX * dotY;
  const dotPack = calcPacks(dotNeeded, [120, 40]);

  const previewBuddyX = Math.min(buddyX, maxPreviewTiles);
  const previewBuddyY = Math.min(buddyY, maxPreviewTiles);
  const previewDotX = Math.min(dotX, maxPreviewTiles);
  const previewDotY = Math.min(dotY, maxPreviewTiles);

  const colorMap: Record<DotColorKey, string> = Object.fromEntries(
    dotColorOptions.map((c) => [c.key, c.color])
  ) as Record<DotColorKey, string>;

  const getDotColor = (symbol: "A" | "B" | "C") =>
    symbol === "A"
      ? colorMap[dotColorA]
      : symbol === "B"
      ? colorMap[dotColorB]
      : colorMap[dotColorC];

  /* =========================================================
     UI
  ========================================================= */
  return (
    <div className="min-h-screen bg-white px-4 py-6 text-slate-900">
      <div className="max-w-6xl mx-auto space-y-10">
        <h1 className="text-3xl font-black tracking-tight text-emerald-700">
          ALIVES 타일 계산기
        </h1>

        {/* ================================================= */}
        {/* 1. 제품 선택 */}
        {/* ================================================= */}
        <section className="border rounded-xl p-5">
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => setProductType("buddy")}
              className={`rounded-lg border py-4 ${
                productType === "buddy"
                  ? "bg-emerald-50 border-emerald-500"
                  : ""
              }`}
            >
              버디
            </button>
            <button
              onClick={() => setProductType("dot")}
              className={`rounded-lg border py-4 ${
                productType === "dot"
                  ? "bg-emerald-50 border-emerald-500"
                  : ""
              }`}
            >
              도트
            </button>
          </div>
        </section>

        {/* ================================================= */}
        {/* 2. 사이즈 입력 */}
        {/* ================================================= */}
        <section className="border rounded-xl p-5">
          <div className="flex gap-4">
            <input
              type="number"
              value={widthCm}
              onChange={(e) => setWidthCm(+e.target.value)}
              className="border rounded px-3 py-2 w-full"
            />
            <input
              type="number"
              value={heightCm}
              onChange={(e) => setHeightCm(+e.target.value)}
              className="border rounded px-3 py-2 w-full"
            />
            <span className="flex items-center text-sm text-slate-500">cm</span>
          </div>
        </section>

        {/* ================================================= */}
        {/* 3. 옵션 */}
        {/* ================================================= */}
        <section className="border rounded-xl p-5 space-y-6">
          {productType === "buddy" && (
            <div className="grid grid-cols-2 gap-3">
              {buddyColorOptions.map((c) => (
                <button
                  key={c.key}
                  onClick={() => setBuddyColor(c.key)}
                  className={`border rounded-lg p-3 ${
                    buddyColor === c.key ? "border-emerald-500" : ""
                  }`}
                >
                  <div
                    className="w-full h-10 border"
                    style={{ backgroundColor: c.color }}
                  />
                  <div className="text-sm mt-1">{c.label}</div>
                </button>
              ))}
            </div>
          )}

          {productType === "dot" && (
            <>
              <div className="grid grid-cols-3 gap-4">
                {(Object.keys(dotPatternCells) as DotPattern[]).map((p) => (
                  <button
                    key={p}
                    onClick={() => setDotPattern(p)}
                    className={`border p-3 ${
                      dotPattern === p ? "border-emerald-500" : ""
                    }`}
                  >
                    <div className="grid grid-cols-2">
                      {dotPatternCells[p].map((s, i) => (
                        <div
                          key={i}
                          className="w-8 h-8 border"
                          style={{ backgroundColor: getDotColor(s) }}
                        />
                      ))}
                    </div>
                    <div className="text-xs mt-1">{p}</div>
                  </button>
                ))}
              </div>

              {[["A", dotColorA, setDotColorA],
                ["B", dotColorB, setDotColorB],
                ["C", dotColorC, setDotColorC]].map(
                ([label, value, setter]) => (
                  <div key={label as string} className="flex gap-2 flex-wrap">
                    <span className="w-6">{label}</span>
                    {dotColorOptions.map((c) => (
                      <button
                        key={c.key + label}
                        onClick={() => setter(c.key)}
                        className={`border rounded px-2 py-1 text-xs ${
                          value === c.key ? "border-emerald-500" : ""
                        }`}
                      >
                        {c.label}
                      </button>
                    ))}
                  </div>
                )
              )}
            </>
          )}
        </section>

        {/* ================================================= */}
        {/* 4. 미리보기 */}
        {/* ================================================= */}
        <section className="border rounded-xl p-5">
          <h2 className="font-semibold mb-2">미리보기</h2>

          {productType === "buddy" && (
            <div
              className="inline-grid"
              style={{
                gridTemplateColumns: `repeat(${previewBuddyX}, 20px)`,
              }}
            >
              {Array.from({ length: previewBuddyX * previewBuddyY }).map(
                (_, i) => (
                  <div
                    key={i}
                    className="border border-slate-400"
                    style={{
                      backgroundColor:
                        buddyColorOptions.find((b) => b.key === buddyColor)
                          ?.color,
                    }}
                  />
                )
              )}
            </div>
          )}

          {productType === "dot" && (
            <div
              className="inline-grid"
              style={{
                gridTemplateColumns: `repeat(${previewDotX}, 10px)`,
              }}
            >
              {Array.from({ length: previewDotX * previewDotY }).map((_, i) => {
                const x = i % previewDotX;
                const y = Math.floor(i / previewDotX);
                const idx = (y % 2) * 2 + (x % 2);
                const symbol = dotPatternCells[dotPattern][idx];
                return (
                  <div
                    key={i}
                    className="border border-slate-300"
                    style={{ backgroundColor: getDotColor(symbol) }}
                  />
                );
              })}
            </div>
          )}
        </section>

        {/* ================================================= */}
        {/* 5. 수량 */}
        {/* ================================================= */}
        <section className="border rounded-xl p-5 text-sm space-y-1">
          {productType === "buddy" && (
            <>
              <div>필요 수량: {buddyNeeded}</div>
              <div>36p: {buddyPack.packCounts[36] || 0}</div>
              <div>9p: {buddyPack.packCounts[9] || 0}</div>
              <div>2p: {buddyPack.packCounts[2] || 0}</div>
            </>
          )}

          {productType === "dot" && (
            <>
              <div>필요 수량: {dotNeeded}</div>
              <div>120p: {dotPack.packCounts[120] || 0}</div>
              <div>40p: {dotPack.packCounts[40] || 0}</div>
            </>
          )}
        </section>
      </div>
    </div>
  );
}
