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
const buddyColorOptions: {
  key: BuddyColor;
  label: string;
  color: string;
}[] = [
  { key: "ivory", label: "아이보리", color: "#FDF8EE" },
  { key: "lightgray", label: "라이트그레이", color: "#D4D4D8" },
  { key: "beige", label: "베이지", color: "#EBD9B4" },
  { key: "butter", label: "버터", color: "#FFE9A7" },
];

const dotColorOptions: {
  key: DotColorKey;
  label: string;
  color: string;
}[] = [
  { key: "ivory", label: "아이보리", color: "#FDF8EE" },
  { key: "lightgray", label: "라이트그레이", color: "#D4D4D8" },
  { key: "beige", label: "베이지", color: "#EBD9B4" },
  { key: "butter", label: "버터", color: "#FFE9A7" },
];

/* =========================================================
   도트 패턴 (2×2)
========================================================= */
const dotPatternCells: Record<DotPattern, ("A" | "B" | "C")[]> = {
  AAAA: ["A", "A", "A", "A"],
  ABBA: ["A", "B", "B", "A"],
  ABBC: ["A", "B", "B", "C"],
};

/* =========================================================
   박스 계산
========================================================= */
function calcPacks(total: number, packs: number[]) {
  const sorted = [...packs].sort((a, b) => b - a);
  const result: Record<number, number> = {};
  let remain = total;

  for (const p of sorted) {
    const count = Math.floor(remain / p);
    result[p] = count;
    remain -= count * p;
  }

  if (remain > 0) {
    const smallest = sorted[sorted.length - 1];
    result[smallest] += 1;
  }

  const totalPieces = sorted.reduce(
    (sum, p) => sum + p * result[p],
    0
  );

  return {
    packCounts: result,
    totalPieces,
    leftover: totalPieces - total,
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

  const getDotColor = (s: "A" | "B" | "C") => {
    if (s === "A") return dotColorMap[dotColorA];
    if (s === "B") return dotColorMap[dotColorB];
    return dotColorMap[dotColorC];
  };

  /* =========================================================
     UI
  ========================================================= */
  return (
    <div className="min-h-screen bg-white px-4 py-6 text-slate-900">
      <div className="max-w-6xl mx-auto space-y-10">
        <h1 className="text-3xl font-black text-emerald-700">
          ALIVES 타일 계산기
        </h1>

        {/* 제품 선택 */}
        <section className="border rounded-xl p-4 grid grid-cols-2 gap-3">
          {(["buddy", "dot"] as ProductType[]).map((t) => (
            <button
              key={t}
              onClick={() => setProductType(t)}
              className={`border rounded-lg py-3 ${
                productType === t
                  ? "border-emerald-500 bg-emerald-50"
                  : ""
              }`}
            >
              {t === "buddy" ? "버디" : "도트"}
            </button>
          ))}
        </section>

        {/* 사이즈 */}
        <section className="border rounded-xl p-4 flex gap-3">
          <input
            type="number"
            value={widthCm}
            onChange={(e) => setWidthCm(+e.target.value)}
            className="border rounded px-3 py-2 w-full"
            placeholder="가로 (cm)"
          />
          <input
            type="number"
            value={heightCm}
            onChange={(e) => setHeightCm(+e.target.value)}
            className="border rounded px-3 py-2 w-full"
            placeholder="세로 (cm)"
          />
          <span className="flex items-center text-sm text-slate-500">cm</span>
        </section>

        {/* 옵션 */}
        <section className="border rounded-xl p-4 space-y-6">
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
                    className="h-8 border"
                    style={{ backgroundColor: c.color }}
                  />
                  <div className="text-sm mt-1">{c.label}</div>
                </button>
              ))}
            </div>
          )}

          {productType === "dot" && (
            <>
              {/* 패턴 */}
              <div className="grid grid-cols-3 gap-3">
                {(Object.keys(dotPatternCells) as DotPattern[]).map((p) => (
                  <button
                    key={p}
                    onClick={() => setDotPattern(p)}
                    className={`border rounded-lg p-3 ${
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

              {/* 색상 */}
              {(
                [
                  ["A", dotColorA, setDotColorA],
                  ["B", dotColorB, setDotColorB],
                  ["C", dotColorC, setDotColorC],
                ] as const
              ).map(([label, value, setter]) => (
                <div key={label} className="flex gap-2 items-center flex-wrap">
                  <span className="w-6 font-bold">{label}</span>
                  {dotColorOptions.map((c) => (
                    <button
                      key={c.key + label}
                      onClick={() => setter(c.key)}
                      className={`border rounded-full px-2 py-1 text-xs flex items-center gap-1 ${
                        value === c.key ? "border-emerald-500" : ""
                      }`}
                    >
                      <span
                        className="w-3 h-3 rounded-full border"
                        style={{ backgroundColor: c.color }}
                      />
                      {c.label}
                    </button>
                  ))}
                </div>
              ))}
            </>
          )}
        </section>

        {/* 미리보기 */}
        <section className="border rounded-xl p-4">
          <h2 className="font-semibold mb-2">미리보기</h2>

          {productType === "buddy" && (
            <div
              className="inline-grid"
              style={{
                gridTemplateColumns: `repeat(${previewBuddyX}, 20px)`,
              }}
            >
              {Array.from({
                length: previewBuddyX * previewBuddyY,
              }).map((_, i) => (
                <div
                  key={i}
                  className="border"
                  style={{
                    backgroundColor:
                      buddyColorOptions.find((b) => b.key === buddyColor)
                        ?.color,
                  }}
                />
              ))}
            </div>
          )}

          {productType === "dot" && (
            <div
              className="inline-grid"
              style={{
                gridTemplateColumns: `repeat(${previewDotX}, 10px)`,
              }}
            >
              {Array.from({
                length: previewDotX * previewDotY,
              }).map((_, i) => {
                const x = i % previewDotX;
                const y = Math.floor(i / previewDotX);
                const idx = (y % 2) * 2 + (x % 2);
                const s = dotPatternCells[dotPattern][idx];
                return (
                  <div
                    key={i}
                    className="border"
                    style={{ backgroundColor: getDotColor(s) }}
                  />
                );
              })}
            </div>
          )}
        </section>

        {/* 수량 */}
        <section className="border rounded-xl p-4 text-sm space-y-1">
          {productType === "buddy" && (
            <>
              <div>필요 수량: {buddyNeeded}</div>
              <div>36p: {buddyPack.packCounts[36]}</div>
              <div>9p: {buddyPack.packCounts[9]}</div>
              <div>2p: {buddyPack.packCounts[2]}</div>
            </>
          )}

          {productType === "dot" && (
            <>
              <div>필요 수량: {dotNeeded}</div>
              <div>120p: {dotPack.packCounts[120]}</div>
              <div>40p: {dotPack.packCounts[40]}</div>
            </>
          )}
        </section>
      </div>
    </div>
  );
}
