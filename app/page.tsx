"use client";

import { useState } from "react";

/* --------------------------------------------
   타입 정의
-------------------------------------------- */
type ProductType = "buddy" | "dot";
type BuddyColor = "ivory" | "lightgray" | "beige" | "butter";

/** 🔥 도트 색상: 4색만 유지 */
type DotColorKey = "ivory" | "lightgray" | "beige" | "butter";
type DotPattern = "AAAA" | "ABBA" | "ABBC";

/* --------------------------------------------
   버디 색상
-------------------------------------------- */
const buddyColorOptions: { key: BuddyColor; label: string; color: string }[] = [
  { key: "ivory", label: "아이보리", color: "#FDF8EE" },
  { key: "lightgray", label: "라이트그레이", color: "#D4D4D8" },
  { key: "beige", label: "베이지", color: "#EBD9B4" },
  { key: "butter", label: "버터", color: "#FFE9A7" },
];

/* --------------------------------------------
   도트 색상 (🔥 6 → 4)
-------------------------------------------- */
const dotColorOptions: { key: DotColorKey; label: string; color: string }[] = [
  { key: "ivory", label: "아이보리", color: "#FDF8EE" },
  { key: "lightgray", label: "라이트그레이", color: "#D4D4D8" },
  { key: "beige", label: "베이지", color: "#EBD9B4" },
  { key: "butter", label: "버터", color: "#FFE9A7" },
];

/* --------------------------------------------
   도트 패턴 (2×2)
-------------------------------------------- */
const dotPatternCells: Record<DotPattern, ("A" | "B" | "C")[]> = {
  AAAA: ["A", "A", "A", "A"],
  ABBA: ["A", "B", "B", "A"],
  ABBC: ["A", "B", "B", "C"],
};

/* --------------------------------------------
   박스 계산 함수
-------------------------------------------- */
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

/* --------------------------------------------
   메인 컴포넌트
-------------------------------------------- */
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

  /* 계산 */
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

  return (
    <div className="min-h-screen bg-white px-4 py-6 text-slate-900">
      <div className="max-w-6xl mx-auto space-y-8">
        <h1 className="text-3xl font-black tracking-tight text-emerald-700">
          ALIVES 타일 계산기
        </h1>

        {/* 1. 데크타일 선택 */}
        <section className="border rounded-xl p-5">
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => setProductType("buddy")}
              className={`border rounded-xl p-4 ${
                productType === "buddy"
                  ? "border-emerald-500 bg-emerald-50"
                  : "border-slate-300"
              }`}
            >
              버디
            </button>
            <button
              onClick={() => setProductType("dot")}
              className={`border rounded-xl p-4 ${
                productType === "dot"
                  ? "border-emerald-500 bg-emerald-50"
                  : "border-slate-300"
              }`}
            >
              도트
            </button>
          </div>
        </section>

        {/* 2. 사이즈 입력 */}
        <section className="border rounded-xl p-5">
          <div className="flex gap-3">
            <input
              type="number"
              value={widthCm}
              onChange={(e) => setWidthCm(Number(e.target.value))}
              className="border px-3 py-2 rounded w-full"
            />
            <input
              type="number"
              value={heightCm}
              onChange={(e) => setHeightCm(Number(e.target.value))}
              className="border px-3 py-2 rounded w-full"
            />
          </div>
        </section>

        {/* 3. 옵션 + 미리보기 */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* 옵션 */}
          <div className="space-y-4">
            {productType === "buddy" &&
              buddyColorOptions.map((c) => (
                <button
                  key={c.key}
                  onClick={() => setBuddyColor(c.key)}
                  className="flex gap-2 items-center border p-2 rounded"
                >
                  <div
                    className="w-6 h-6 border"
                    style={{ backgroundColor: c.color }}
                  />
                  {c.label}
                </button>
              ))}

            {productType === "dot" &&
              dotColorOptions.map((c) => (
                <button
                  key={c.key}
                  onClick={() => setDotColorA(c.key)}
                  className="flex gap-2 items-center border p-2 rounded"
                >
                  <div
                    className="w-6 h-6 border"
                    style={{ backgroundColor: c.color }}
                  />
                  {c.label}
                </button>
              ))}
          </div>

          {/* 미리보기 */}
          <div className="border p-3 overflow-auto">
            {productType === "buddy" && (
              <div
                className="grid"
                style={{
                  gridTemplateColumns: `repeat(${previewBuddyX}, 20px)`,
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
                            (b) => b.key === buddyColor
                          )?.color,
                      }}
                    />
                  )
                )}
              </div>
            )}

            {productType === "dot" && (
              <div
                className="grid"
                style={{
                  gridTemplateColumns: `repeat(${previewDotX}, 10px)`,
                }}
              >
                {Array.from({ length: previewDotX * previewDotY }).map(
                  (_, i) => {
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
                  }
                )}
              </div>
            )}
          </div>
        </section>

        {/* 4. 결과 */}
        <section className="border rounded-xl p-5">
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
