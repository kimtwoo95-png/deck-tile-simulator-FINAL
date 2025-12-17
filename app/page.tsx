"use client";

import { useState } from "react";

/* --------------------------------------------
   타입 정의
-------------------------------------------- */
type ProductType = "buddy" | "dot";
type BuddyColor = "ivory" | "lightgray" | "beige" | "butter";

/** 🔥 도트 색상 → 4색 */
type DotColorKey = "ivory" | "lightgray" | "beige" | "butter";
type DotPattern = "AAAA" | "ABBA" | "ABBC";

/* --------------------------------------------
   버디 색상
-------------------------------------------- */
const buddyColorOptions = [
  { key: "ivory", label: "아이보리", color: "#FDF8EE" },
  { key: "lightgray", label: "라이트그레이", color: "#D4D4D8" },
  { key: "beige", label: "베이지", color: "#EBD9B4" },
  { key: "butter", label: "버터", color: "#FFE9A7" },
] as const;

/* --------------------------------------------
   도트 색상 (4색)
-------------------------------------------- */
const dotColorOptions = [
  { key: "ivory", label: "아이보리", color: "#FDF8EE" },
  { key: "lightgray", label: "라이트그레이", color: "#D4D4D8" },
  { key: "beige", label: "베이지", color: "#EBD9B4" },
  { key: "butter", label: "버터", color: "#FFE9A7" },
] as const;

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

  return { packCounts, totalPieces, leftover: totalPieces - totalNeeded };
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

  const previewDotX = Math.min(dotX, maxPreviewTiles);
  const previewDotY = Math.min(dotY, maxPreviewTiles);

  const colorMap = Object.fromEntries(
    dotColorOptions.map((c) => [c.key, c.color])
  ) as Record<DotColorKey, string>;

  const getDotColor = (s: "A" | "B" | "C") =>
    s === "A" ? colorMap[dotColorA] : s === "B" ? colorMap[dotColorB] : colorMap[dotColorC];

  /* UI */
  return (
    <div className="min-h-screen bg-white p-6 text-slate-900">
      <h1 className="text-3xl font-black text-emerald-700 mb-6">
        ALIVES 타일 계산기
      </h1>

      <button
        className="mb-4 px-4 py-2 border rounded"
        onClick={() =>
          setProductType(productType === "buddy" ? "dot" : "buddy")
        }
      >
        {productType === "buddy" ? "도트 보기" : "버디 보기"}
      </button>

      {productType === "dot" && (
        <div
          className="grid"
          style={{
            gridTemplateColumns: `repeat(${previewDotX}, 12px)`,
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
                className="w-3 h-3 border"
                style={{ backgroundColor: getDotColor(symbol) }}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
