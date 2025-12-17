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
function calcPacks(total: number, sizes: number[]) {
  const sorted = [...sizes].sort((a, b) => b - a);
  const counts: Record<number, number> = {};
  let remain = total;

  for (const s of sorted) {
    counts[s] = Math.floor(remain / s);
    remain -= counts[s] * s;
  }

  if (remain > 0) {
    const smallest = sorted[sorted.length - 1];
    counts[smallest] += 1;
  }

  const totalPieces = sorted.reduce(
    (sum, s) => sum + s * (counts[s] || 0),
    0
  );

  return {
    counts,
    totalPieces,
    leftover: totalPieces - total,
  };
}

/* =========================================================
   메인
========================================================= */
export default function Page() {
  const [productType, setProductType] = useState<ProductType>("dot");

  const [widthCm, setWidthCm] = useState(300);
  const [heightCm, setHeightCm] = useState(300);

  const [buddyColor, setBuddyColor] = useState<BuddyColor>("ivory");

  const [dotPattern, setDotPattern] = useState<DotPattern>("ABBA");
  const [dotColorA, setDotColorA] = useState<DotColorKey>("ivory");
  const [dotColorB, setDotColorB] = useState<DotColorKey>("butter");
  const [dotColorC, setDotColorC] = useState<DotColorKey>("beige");

  /* ---------------- 계산 ---------------- */
  const buddyX = Math.ceil(widthCm / 30);
  const buddyY = Math.ceil(heightCm / 30);
  const buddyNeeded = buddyX * buddyY;
  const buddyPack = calcPacks(buddyNeeded, [36, 9, 2]);

  const dotX = Math.ceil(widthCm / 10);
  const dotY = Math.ceil(heightCm / 10);
  const dotNeeded = dotX * dotY;
  const dotPack = calcPacks(dotNeeded, [120, 40]);

  const previewX = Math.min(productType === "buddy" ? buddyX : dotX, 40);
  const previewY = Math.min(productType === "buddy" ? buddyY : dotY, 40);

  const colorMap = Object.fromEntries(
    dotColorOptions.map((c) => [c.key, c.color])
  ) as Record<DotColorKey, string>;

  const getDotColor = (s: "A" | "B" | "C") =>
    s === "A" ? colorMap[dotColorA] : s === "B" ? colorMap[dotColorB] : colorMap[dotColorC];

  /* =========================================================
     UI
  ========================================================= */
  return (
    <div className="min-h-screen bg-white px-4 py-6 text-slate-900">
      <div className="max-w-6xl mx-auto space-y-10">
        <h1 className="text-3xl font-black text-emerald-700">
          ALIVES 타일 계산기
        </h1>

        {/* 1. 제품 선택 */}
        <section className="border rounded-xl p-5">
          <div className="grid grid-cols-2 gap-4">
            {(["buddy", "dot"] as ProductType[]).map((t) => (
              <button
                key={t}
                onClick={() => setProductType(t)}
                className={`border rounded-xl p-4 ${
                  productType === t ? "bg-emerald-50 border-emerald-500" : ""
                }`}
              >
                <div className="font-bold">{t === "buddy" ? "버디 데크타일" : "도트 데크타일"}</div>
                <div className="text-xs text-slate-500">
                  {t === "buddy"
                    ? "30 × 30 cm / 4색상"
                    : "10 × 10 cm / 4색상 / 패턴 AAAA·ABBA·ABBC"}
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* 2. 사이즈 */}
        <section className="border rounded-xl p-5">
          <h2 className="font-semibold mb-2">2. 공간 사이즈 (cm)</h2>
          <div className="flex gap-3">
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
          </div>
        </section>

        {/* 3. 옵션 */}
        <section className="border rounded-xl p-5 space-y-6">
          {productType === "buddy" && (
            <div className="grid grid-cols-2 gap-3">
              {buddyColorOptions.map((c) => (
                <button
                  key={c.key}
                  onClick={() => setBuddyColor(c.key)}
                  className={`border rounded p-3 ${
                    buddyColor === c.key ? "border-emerald-500" : ""
                  }`}
                >
                  <div
                    className="h-10 border"
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
                    className={`border rounded p-3 ${
                      dotPattern === p ? "border-emerald-500 bg-emerald-50" : ""
                    }`}
                  >
                    <div className="grid grid-cols-2">
                      {dotPatternCells[p].map((s, i) => (
                        <div
                          key={i}
                          className="w-10 h-10 border"
                          style={{ backgroundColor: getDotColor(s) }}
                        />
                      ))}
                    </div>
                    <div className="text-xs mt-2 font-semibold">{p}</div>
                  </button>
                ))}
              </div>

              {([
                { label: "A", value: dotColorA, set: setDotColorA },
                { label: "B", value: dotColorB, set: setDotColorB },
                ...(dotPattern === "ABBC"
                  ? [{ label: "C", value: dotColorC, set: setDotColorC }]
                  : []),
              ] as {
                label: "A" | "B" | "C";
                value: DotColorKey;
                set: (v: DotColorKey) => void;
              }[]).map(({ label, value, set }) => (
                <div key={label} className="flex items-center gap-2 flex-wrap">
                  <span className="w-6 font-bold">{label}</span>
                  {dotColorOptions.map((c) => (
                    <button
                      key={c.key + label}
                      onClick={() => set(c.key)}
                      className={`border rounded-full px-3 py-1 text-xs ${
                        value === c.key ? "border-emerald-500 bg-emerald-50" : ""
                      }`}
                    >
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
          <h2 className="font-semibold mb-3">4. 미리보기</h2>

          <div
            className="inline-grid"
            style={{
              gridTemplateColumns: `repeat(${previewX}, ${
                productType === "buddy" ? "20px" : "10px"
              })`,
            }}
          >
            {Array.from({ length: previewX * previewY }).map((_, i) => {
              if (productType === "buddy") {
                return (
                  <div
                    key={i}
                    className="border"
                    style={{
                      backgroundColor:
                        buddyColorOptions.find((b) => b.key === buddyColor)
                          ?.color,
                    }}
                  />
                );
              }
              const x = i % previewX;
              const y = Math.floor(i / previewX);
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
        </section>

        {/* 5. 수량 */}
        <section className="border rounded-xl p-5 text-sm space-y-1">
          {productType === "buddy" && (
            <>
              <div>필요 수량: {buddyNeeded}</div>
              <div>36p: {buddyPack.counts[36] || 0}</div>
              <div>9p: {buddyPack.counts[9] || 0}</div>
              <div>2p: {buddyPack.counts[2] || 0}</div>
            </>
          )}
          {productType === "dot" && (
            <>
              <div>필요 수량: {dotNeeded}</div>
              <div>120p: {dotPack.counts[120] || 0}</div>
              <div>40p: {dotPack.counts[40] || 0}</div>
            </>
          )}
        </section>
      </div>
    </div>
  );
}
