"use client";

import { useState } from "react";

/* --------------------------------------------
   타입 정의
-------------------------------------------- */
type ProductType = "buddy" | "dot";

type TileColor = "ivory" | "lightgray" | "beige" | "butter";

type DotPattern = "AAAA" | "ABBA" | "ABBC";

/* --------------------------------------------
   공통 색상 (버디 + 도트 공용)
-------------------------------------------- */
const colorOptions: { key: TileColor; label: string; color: string }[] = [
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

  // 버디 색상
  const [buddyColor, setBuddyColor] = useState<TileColor>("ivory");

  // 도트 옵션
  const [dotPattern, setDotPattern] = useState<DotPattern>("AAAA");
  const [dotColorA, setDotColorA] = useState<TileColor>("ivory");
  const [dotColorB, setDotColorB] = useState<TileColor>("lightgray");
  const [dotColorC, setDotColorC] = useState<TileColor>("beige");

  const maxPreviewTiles = 40;

  /* --------------------------------------------
     계산
  -------------------------------------------- */
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

  const colorMap: Record<TileColor, string> = Object.fromEntries(
    colorOptions.map((c) => [c.key, c.color])
  ) as Record<TileColor, string>;

  const getDotColor = (symbol: "A" | "B" | "C") =>
    symbol === "A"
      ? colorMap[dotColorA]
      : symbol === "B"
      ? colorMap[dotColorB]
      : colorMap[dotColorC];

  /* --------------------------------------------
     UI
  -------------------------------------------- */
  return (
    <div className="min-h-screen bg-white px-4 py-6 text-slate-900">
      <div className="max-w-6xl mx-auto space-y-8">
        <h1 className="text-3xl font-black text-emerald-700">
          ALIVES 타일 계산기
        </h1>

        {/* 타입 선택 */}
        <section className="border rounded-xl p-5">
          <div className="grid md:grid-cols-2 gap-4">
            <button
              onClick={() => setProductType("buddy")}
              className={`p-4 rounded-xl border ${
                productType === "buddy"
                  ? "border-emerald-500 bg-emerald-50"
                  : "border-slate-300"
              }`}
            >
              버디 데크타일 (30×30)
            </button>

            <button
              onClick={() => setProductType("dot")}
              className={`p-4 rounded-xl border ${
                productType === "dot"
                  ? "border-emerald-500 bg-emerald-50"
                  : "border-slate-300"
              }`}
            >
              도트 데크타일 (10×10 → 패턴)
            </button>
          </div>
        </section>

        {/* 입력 */}
        <section className="border rounded-xl p-5">
          <div className="flex gap-3">
            <input
              type="number"
              value={widthCm}
              onChange={(e) => setWidthCm(Number(e.target.value))}
              className="border px-3 py-2 rounded w-full"
              placeholder="가로(cm)"
            />
            <input
              type="number"
              value={heightCm}
              onChange={(e) => setHeightCm(Number(e.target.value))}
              className="border px-3 py-2 rounded w-full"
              placeholder="세로(cm)"
            />
          </div>

          {/* 버디 색상 */}
          {productType === "buddy" && (
            <div className="grid grid-cols-2 gap-3 mt-4">
              {colorOptions.map((c) => (
                <button
                  key={c.key}
                  onClick={() => setBuddyColor(c.key)}
                  className={`border p-3 rounded flex items-center gap-3 ${
                    buddyColor === c.key
                      ? "border-emerald-500 bg-emerald-50"
                      : "border-slate-300"
                  }`}
                >
                  <div
                    className="w-6 h-6 border"
                    style={{ backgroundColor: c.color }}
                  />
                  {c.label}
                </button>
              ))}
            </div>
          )}

          {/* 도트 옵션 */}
          {productType === "dot" && (
            <div className="space-y-4 mt-6">
              <div className="grid grid-cols-3 gap-3">
                {(["AAAA", "ABBA", "ABBC"] as DotPattern[]).map((p) => (
                  <button
                    key={p}
                    onClick={() => setDotPattern(p)}
                    className={`border p-3 rounded ${
                      dotPattern === p
                        ? "border-emerald-500 bg-emerald-50"
                        : "border-slate-300"
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>

              {(["A", "B", "C"] as const).map((slot) =>
                slot === "C" && dotPattern !== "ABBC" ? null : (
                  <div key={slot} className="flex gap-2 items-center">
                    <b>{slot}</b>
                    {colorOptions.map((c) => (
                      <button
                        key={c.key + slot}
                        onClick={() =>
                          slot === "A"
                            ? setDotColorA(c.key)
                            : slot === "B"
                            ? setDotColorB(c.key)
                            : setDotColorC(c.key)
                        }
                        className="border px-2 py-1 rounded text-xs"
                      >
                        {c.label}
                      </button>
                    ))}
                  </div>
                )
              )}
            </div>
          )}
        </section>

        {/* 미리보기 */}
        <section className="border rounded-xl p-5">
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
                    style={{ backgroundColor: colorMap[buddyColor] }}
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
              {Array.from({ length: previewDotX * previewDotY }).map(
                (_, i) => {
                  const x = i % previewDotX;
                  const y = Math.floor(i / previewDotX);
                  const symbol =
                    dotPatternCells[dotPattern][(y % 2) * 2 + (x % 2)];

                  return (
                    <div
                      key={i}
                      className="border border-slate-400"
                      style={{ backgroundColor: getDotColor(symbol) }}
                    />
                  );
                }
              )}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
