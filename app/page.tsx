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
   도트 패턴 정의 (2×2)
========================================================= */
const dotPatternCells: Record<DotPattern, ("A" | "B" | "C")[]> = {
  AAAA: ["A", "A", "A", "A"],
  ABBA: ["A", "B", "B", "A"],
  ABBC: ["A", "B", "B", "C"],
};

/* =========================================================
   박스 계산 로직
========================================================= */
function calcPacks(total: number, packs: number[]) {
  const sorted = [...packs].sort((a, b) => b - a);
  let remain = total;
  const result: Record<number, number> = {};

  for (const p of sorted) {
    const count = Math.floor(remain / p);
    result[p] = count;
    remain -= count * p;
  }

  if (remain > 0) {
    const smallest = sorted[sorted.length - 1];
    result[smallest] = (result[smallest] || 0) + 1;
  }

  const totalPieces = sorted.reduce(
    (sum, p) => sum + p * (result[p] || 0),
    0
  );

  return {
    result,
    totalPieces,
    leftover: totalPieces - total,
  };
}

/* =========================================================
   메인 페이지
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

  /* =========================================================
     계산
  ========================================================= */
  const buddyX = Math.ceil(widthCm / 30);
  const buddyY = Math.ceil(heightCm / 30);
  const buddyNeeded = buddyX * buddyY;
  const buddyPack = calcPacks(buddyNeeded, [36, 9, 2]);

  const dotX = Math.ceil(widthCm / 10);
  const dotY = Math.ceil(heightCm / 10);
  const dotNeeded = dotX * dotY;
  const dotPack = calcPacks(dotNeeded, [120, 40]);

  const previewLimit = 40;
  const previewBuddyX = Math.min(buddyX, previewLimit);
  const previewBuddyY = Math.min(buddyY, previewLimit);
  const previewDotX = Math.min(dotX, previewLimit);
  const previewDotY = Math.min(dotY, previewLimit);

  const dotColorMap: Record<DotColorKey, string> = {
    ivory: "#FDF8EE",
    lightgray: "#D4D4D8",
    beige: "#EBD9B4",
    butter: "#FFE9A7",
  };

  const getDotColor = (symbol: "A" | "B" | "C") => {
    if (symbol === "A") return dotColorMap[dotColorA];
    if (symbol === "B") return dotColorMap[dotColorB];
    return dotColorMap[dotColorC];
  };

  /* =========================================================
     UI
  ========================================================= */
  return (
    <div className="min-h-screen bg-white px-6 py-8 text-slate-900">
      <div className="max-w-6xl mx-auto space-y-10">
        <h1 className="text-3xl font-black text-emerald-700">
          ALIVES 타일 계산기
        </h1>

        {/* 타일 종류 */}
        <section className="border rounded-xl p-5">
          <div className="flex gap-4">
            <button
              onClick={() => setProductType("buddy")}
              className={`flex-1 border rounded-lg py-3 ${
                productType === "buddy"
                  ? "bg-emerald-50 border-emerald-500"
                  : ""
              }`}
            >
              버디
            </button>
            <button
              onClick={() => setProductType("dot")}
              className={`flex-1 border rounded-lg py-3 ${
                productType === "dot"
                  ? "bg-emerald-50 border-emerald-500"
                  : ""
              }`}
            >
              도트
            </button>
          </div>
        </section>

        {/* 공간 입력 */}
        <section className="border rounded-xl p-5">
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="text-sm">가로 (cm)</label>
              <input
                type="number"
                value={widthCm}
                onChange={(e) => setWidthCm(+e.target.value)}
                className="w-full border rounded px-3 py-2"
              />
            </div>
            <div className="flex-1">
              <label className="text-sm">세로 (cm)</label>
              <input
                type="number"
                value={heightCm}
                onChange={(e) => setHeightCm(+e.target.value)}
                className="w-full border rounded px-3 py-2"
              />
            </div>
          </div>
        </section>

        {/* 도트 옵션 */}
        {productType === "dot" && (
          <section className="border rounded-xl p-5 space-y-6">
            <h2 className="font-bold">도트 패턴</h2>
            <div className="flex gap-4">
              {(["AAAA", "ABBA", "ABBC"] as DotPattern[]).map((p) => (
                <button
                  key={p}
                  onClick={() => setDotPattern(p)}
                  className={`border p-3 rounded ${
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
                  <div className="text-xs mt-1 text-center">{p}</div>
                </button>
              ))}
            </div>
          </section>
        )}

        {/* 미리보기 */}
        <section className="border rounded-xl p-5">
          <h2 className="font-bold mb-3">미리보기</h2>

          {productType === "buddy" && (
            <div
              className="inline-grid"
              style={{
                gridTemplateColumns: `repeat(${previewBuddyX}, 18px)`,
              }}
            >
              {Array.from({ length: previewBuddyX * previewBuddyY }).map(
                (_, i) => (
                  <div
                    key={i}
                    className="border"
                    style={{
                      backgroundColor:
                        buddyColorOptions.find(
                          (c) => c.key === buddyColor
                        )?.color,
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
                    className="border"
                    style={{ backgroundColor: getDotColor(symbol) }}
                  />
                );
              })}
            </div>
          )}
        </section>

        {/* 결과 */}
        <section className="border rounded-xl p-5">
          {productType === "buddy" && (
            <>
              <div>필요 장수: {buddyNeeded}</div>
              <div>36p: {buddyPack.result[36] || 0}</div>
              <div>9p: {buddyPack.result[9] || 0}</div>
              <div>2p: {buddyPack.result[2] || 0}</div>
            </>
          )}

          {productType === "dot" && (
            <>
              <div>필요 수량: {dotNeeded}</div>
              <div>120p: {dotPack.result[120] || 0}</div>
              <div>40p: {dotPack.result[40] || 0}</div>
            </>
          )}
        </section>
      </div>
    </div>
  );
}
