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
function calcPacks(total: number, sizes: number[]) {
  const sorted = [...sizes].sort((a, b) => b - a);
  const smallest = sorted[sorted.length - 1];

  let remain = total;
  const packs: Record<number, number> = {};

  for (const s of sorted) {
    const c = Math.floor(remain / s);
    packs[s] = c;
    remain -= c * s;
  }

  if (remain > 0) {
    packs[smallest] = (packs[smallest] || 0) + 1;
  }

  const totalPieces = Object.entries(packs).reduce(
    (sum, [k, v]) => sum + Number(k) * v,
    0
  );

  return {
    packs,
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

  const previewBuddyX = Math.min(buddyX, maxPreview);
  const previewBuddyY = Math.min(buddyY, maxPreview);
  const previewDotX = Math.min(dotX, maxPreview);
  const previewDotY = Math.min(dotY, maxPreview);

  const colorMap: Record<DotColorKey, string> = Object.fromEntries(
    dotColorOptions.map((c) => [c.key, c.color])
  ) as Record<DotColorKey, string>;

  const getDotColor = (s: "A" | "B" | "C") =>
    s === "A" ? colorMap[dotColorA] : s === "B" ? colorMap[dotColorB] : colorMap[dotColorC];

  /* =========================================================
     UI
  ========================================================= */
  return (
    <div className="min-h-screen bg-white px-6 py-8 text-slate-900">
      <div className="max-w-6xl mx-auto space-y-10">
        <h1 className="text-3xl font-black text-emerald-700">
          ALIVES 타일 계산기
        </h1>

        {/* 제품 선택 */}
        <section className="border rounded-xl p-5">
          <div className="grid grid-cols-2 gap-4">
            {(["buddy", "dot"] as ProductType[]).map((t) => (
              <button
                key={t}
                onClick={() => setProductType(t)}
                className={`border rounded-xl py-4 ${
                  productType === t ? "border-emerald-500 bg-emerald-50" : ""
                }`}
              >
                {t === "buddy" ? "버디" : "도트"}
              </button>
            ))}
          </div>
        </section>

        {/* 사이즈 */}
        <section className="border rounded-xl p-5">
          <div className="flex gap-3 items-center">
            <input
              type="number"
              value={widthCm}
              onChange={(e) => setWidthCm(+e.target.value)}
              className="border rounded px-3 py-2 w-full"
            />
            <span>×</span>
            <input
              type="number"
              value={heightCm}
              onChange={(e) => setHeightCm(+e.target.value)}
              className="border rounded px-3 py-2 w-full"
            />
            <span className="text-sm text-slate-500">cm</span>
          </div>
        </section>

        {/* 옵션 */}
        <section className="border rounded-xl p-5 space-y-6">
          {productType === "buddy" && (
            <div className="grid grid-cols-2 gap-3">
              {buddyColorOptions.map((c) => (
                <button
                  key={c.key}
                  onClick={() => setBuddyColor(c.key)}
                  className={`border rounded-xl p-3 ${
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
              {/* 패턴 */}
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

              {/* 색상 슬롯 */}
              {[
                { label: "A", value: dotColorA, set: setDotColorA },
                { label: "B", value: dotColorB, set: setDotColorB },
                { label: "C", value: dotColorC, set: setDotColorC },
              ].map((row) => (
                <div key={row.label} className="flex gap-2 flex-wrap items-center">
                  <span className="w-6 font-bold">{row.label}</span>
                  {dotColorOptions.map((c) => (
                    <button
                      key={row.label + c.key}
                      onClick={() => row.set(c.key)}
                      className={`border rounded px-2 py-1 text-xs ${
                        row.value === c.key ? "border-emerald-500" : ""
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

        {/* 미리보기 */}
        <section className="border rounded-xl p-5">
          <h2 className="font-semibold mb-2">미리보기</h2>

          {productType === "buddy" && (
            <div
              className="inline-grid"
              style={{ gridTemplateColumns: `repeat(${previewBuddyX}, 20px)` }}
            >
              {Array.from({ length: previewBuddyX * previewBuddyY }).map(
                (_, i) => (
                  <div
                    key={i}
                    className="border border-slate-300"
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
              style={{ gridTemplateColumns: `repeat(${previewDotX}, 10px)` }}
            >
              {Array.from({ length: previewDotX * previewDotY }).map((_, i) => {
                const x = i % previewDotX;
                const y = Math.floor(i / previewDotX);
                const idx = (y % 2) * 2 + (x % 2);
                const s = dotPatternCells[dotPattern][idx];
                return (
                  <div
                    key={i}
                    className="border border-slate-300"
                    style={{ backgroundColor: getDotColor(s) }}
                  />
                );
              })}
            </div>
          )}
        </section>

        {/* 수량 */}
        <section className="border rounded-xl p-5 text-sm space-y-1">
          {productType === "buddy" && (
            <>
              <div>필요 장수: {buddyNeed}</div>
              <div>36p: {buddyPack.packs[36] || 0}</div>
              <div>9p: {buddyPack.packs[9] || 0}</div>
              <div>2p: {buddyPack.packs[2] || 0}</div>
            </>
          )}

          {productType === "dot" && (
            <>
              <div>필요 개수: {dotNeed}</div>
              <div>120p: {dotPack.packs[120] || 0}</div>
              <div>40p: {dotPack.packs[40] || 0}</div>
            </>
          )}
        </section>
      </div>
    </div>
  );
}
