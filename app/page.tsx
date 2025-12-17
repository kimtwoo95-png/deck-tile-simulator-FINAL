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

const dotColorOptions = buddyColorOptions;

/* =========================================================
   도트 패턴
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
  let remain = total;
  const result: Record<number, number> = {};

  for (const size of sorted) {
    const count = Math.floor(remain / size);
    result[size] = count;
    remain -= count * size;
  }

  if (remain > 0) {
    result[sorted[sorted.length - 1]] += 1;
  }

  const totalPieces = sorted.reduce(
    (sum, s) => sum + s * (result[s] || 0),
    0
  );

  return { result, totalPieces, leftover: totalPieces - total };
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

  const maxPreview = 40;

  /* ---------------- 계산 ---------------- */
  const buddyX = Math.ceil(widthCm / 30);
  const buddyY = Math.ceil(heightCm / 30);
  const buddyNeed = buddyX * buddyY;
  const buddyPack = calcPacks(buddyNeed, [36, 9, 2]);

  const dotX = Math.ceil(widthCm / 10);
  const dotY = Math.ceil(heightCm / 10);
  const dotNeed = dotX * dotY;
  const dotPack = calcPacks(dotNeed, [120, 40]);

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

        {/* 제품 선택 */}
        <section className="border rounded-xl p-4 grid grid-cols-2 gap-4">
          {(["buddy", "dot"] as ProductType[]).map((t) => (
            <button
              key={t}
              onClick={() => setProductType(t)}
              className={`border rounded-lg py-4 ${
                productType === t ? "bg-emerald-50 border-emerald-500" : ""
              }`}
            >
              {t === "buddy" ? "버디" : "도트"}
            </button>
          ))}
        </section>

        {/* 사이즈 */}
        <section className="border rounded-xl p-4 flex gap-4 items-center">
          <input
            type="number"
            value={widthCm}
            onChange={(e) => setWidthCm(+e.target.value)}
            className="border rounded px-3 py-2 w-full"
          />
          <span>cm</span>
          <input
            type="number"
            value={heightCm}
            onChange={(e) => setHeightCm(+e.target.value)}
            className="border rounded px-3 py-2 w-full"
          />
          <span>cm</span>
        </section>

        {/* 옵션 */}
        <section className="border rounded-xl p-5 space-y-6">
          {productType === "buddy" &&
            buddyColorOptions.map((c) => (
              <button
                key={c.key}
                onClick={() => setBuddyColor(c.key)}
                className={`flex items-center gap-3 border p-3 rounded-lg ${
                  buddyColor === c.key ? "border-emerald-500" : ""
                }`}
              >
                <div
                  className="w-6 h-6 rounded-full border"
                  style={{ backgroundColor: c.color }}
                />
                {c.label}
              </button>
            ))}

          {productType === "dot" && (
            <>
              {/* 패턴 */}
              <div className="grid grid-cols-3 gap-4">
                {(Object.keys(dotPatternCells) as DotPattern[]).map((p) => (
                  <button
                    key={p}
                    onClick={() => setDotPattern(p)}
                    className={`border p-3 rounded-lg ${
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

              {/* 색상 A */}
              <div className="flex items-center gap-2">
                <b>A</b>
                {dotColorOptions.map((c) => (
                  <button
                    key={c.key}
                    onClick={() => setDotColorA(c.key)}
                    className={`w-6 h-6 rounded-full border ${
                      dotColorA === c.key ? "ring-2 ring-emerald-500" : ""
                    }`}
                    style={{ backgroundColor: c.color }}
                  />
                ))}
              </div>

              {/* 색상 B */}
              {dotPattern !== "AAAA" && (
                <div className="flex items-center gap-2">
                  <b>B</b>
                  {dotColorOptions.map((c) => (
                    <button
                      key={c.key}
                      onClick={() => setDotColorB(c.key)}
                      className={`w-6 h-6 rounded-full border ${
                        dotColorB === c.key ? "ring-2 ring-emerald-500" : ""
                      }`}
                      style={{ backgroundColor: c.color }}
                    />
                  ))}
                </div>
              )}

              {/* 색상 C */}
              {dotPattern === "ABBC" && (
                <div className="flex items-center gap-2">
                  <b>C</b>
                  {dotColorOptions.map((c) => (
                    <button
                      key={c.key}
                      onClick={() => setDotColorC(c.key)}
                      className={`w-6 h-6 rounded-full border ${
                        dotColorC === c.key ? "ring-2 ring-emerald-500" : ""
                      }`}
                      style={{ backgroundColor: c.color }}
                    />
                  ))}
                </div>
              )}
            </>
          )}
        </section>

        {/* 미리보기 */}
        <section className="border rounded-xl p-5">
          <h2 className="font-semibold mb-2">미리보기</h2>

          {productType === "buddy" && (
            <div
              className="inline-grid"
              style={{ gridTemplateColumns: `repeat(${Math.min(buddyX, maxPreview)}, 20px)` }}
            >
              {Array.from({ length: Math.min(buddyX, maxPreview) * Math.min(buddyY, maxPreview) }).map(
                (_, i) => (
                  <div
                    key={i}
                    className="border border-slate-300"
                    style={{
                      backgroundColor:
                        buddyColorOptions.find((b) => b.key === buddyColor)?.color,
                    }}
                  />
                )
              )}
            </div>
          )}

          {productType === "dot" && (
            <div
              className="inline-grid"
              style={{ gridTemplateColumns: `repeat(${Math.min(dotX, maxPreview)}, 10px)` }}
            >
              {Array.from({ length: Math.min(dotX, maxPreview) * Math.min(dotY, maxPreview) }).map(
                (_, i) => {
                  const x = i % Math.min(dotX, maxPreview);
                  const y = Math.floor(i / Math.min(dotX, maxPreview));
                  const idx = (y % 2) * 2 + (x % 2);
                  return (
                    <div
                      key={i}
                      className="border border-slate-300"
                      style={{ backgroundColor: getDotColor(dotPatternCells[dotPattern][idx]) }}
                    />
                  );
                }
              )}
            </div>
          )}
        </section>

        {/* 수량 */}
        <section className="border rounded-xl p-5 text-sm">
          {productType === "buddy" && (
            <>
              <div>필요 수량: {buddyNeed}</div>
              <div>36p: {buddyPack.result[36] || 0}</div>
              <div>9p: {buddyPack.result[9] || 0}</div>
              <div>2p: {buddyPack.result[2] || 0}</div>
            </>
          )}

          {productType === "dot" && (
            <>
              <div>필요 수량: {dotNeed}</div>
              <div>120p: {dotPack.result[120] || 0}</div>
              <div>40p: {dotPack.result[40] || 0}</div>
            </>
          )}
        </section>
      </div>
    </div>
  );
}
