"use client";

import { useState } from "react";

/* --------------------------------------------
   타입 정의
-------------------------------------------- */
type ProductType = "buddy" | "dot";
type BuddyColor = "ivory" | "lightgray" | "beige" | "butter";

/** 도트 색상 → 버디와 동일한 4색 */
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
   도트 색상 (4색)
-------------------------------------------- */
const dotColorOptions: { key: DotColorKey; label: string; color: string }[] = [
  { key: "ivory", label: "아이보리", color: "#FDF8EE" },
  { key: "lightgray", label: "라이트그레이", color: "#D4D4D8" },
  { key: "beige", label: "베이지", color: "#EBD9B4" },
  { key: "butter", label: "버터", color: "#FFE9A7" },
];

/* --------------------------------------------
   도트 패턴
-------------------------------------------- */
const dotPatternCells: Record<DotPattern, ("A" | "B" | "C")[]> = {
  AAAA: ["A", "A", "A", "A"],
  ABBA: ["A", "B", "B", "A"],
  ABBC: ["A", "B", "B", "C"],
};

/* --------------------------------------------
   박스 계산
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

  const getDotColor = (s: "A" | "B" | "C") =>
    s === "A" ? colorMap[dotColorA] : s === "B" ? colorMap[dotColorB] : colorMap[dotColorC];

  return (
    <div className="min-h-screen bg-white px-4 py-6 text-slate-900">
      <div className="max-w-6xl mx-auto space-y-8">
        <h1 className="text-3xl font-black text-emerald-700">ALIVES 타일 계산기</h1>

        {/* 1. 타입 선택 */}
        <section className="border rounded-xl p-5">
          <div className="grid grid-cols-2 gap-4">
            <button onClick={() => setProductType("buddy")}>버디</button>
            <button onClick={() => setProductType("dot")}>도트</button>
          </div>
        </section>

        {/* 2. 입력 */}
        <section className="border rounded-xl p-5 grid md:grid-cols-2 gap-6">
          <div>
            <input value={widthCm} onChange={e => setWidthCm(+e.target.value)} />
            <input value={heightCm} onChange={e => setHeightCm(+e.target.value)} />
          </div>

          {/* 미리보기 */}
          <div>
            {productType === "dot" && (
              <div
                className="inline-grid"
                style={{
                  gridTemplateColumns: `repeat(${previewDotX}, 10px)`,
                }}
              >
                {Array.from({ length: previewDotX * previewDotY }).map((_, i) => {
                  const symbol =
                    dotPatternCells[dotPattern][((Math.floor(i / previewDotX) % 2) * 2 + (i % 2))];
                  return (
                    <div
                      key={i}
                      style={{ width: 10, height: 10, backgroundColor: getDotColor(symbol) }}
                    />
                  );
                })}
              </div>
            )}
          </div>
        </section>

        {/* 결과 */}
        <section className="border rounded-xl p-5">
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
