"use client";

import { useState } from "react";

/* =====================
   타입 정의
===================== */
type ProductType = "buddy" | "dot";
type TileColor = "ivory" | "lightgray" | "beige" | "butter";
type DotPattern = "AAAA" | "ABBA" | "ABBC";

/* =====================
   공통 색상 (버디 = 도트)
===================== */
const TILE_COLORS: { key: TileColor; label: string; color: string }[] = [
  { key: "ivory", label: "아이보리", color: "#FDF8EE" },
  { key: "lightgray", label: "라이트그레이", color: "#D4D4D8" },
  { key: "beige", label: "베이지", color: "#EBD9B4" },
  { key: "butter", label: "버터", color: "#FFE9A7" },
];

/* =====================
   도트 패턴 (2×2)
===================== */
const DOT_PATTERN_MAP: Record<DotPattern, ("A" | "B" | "C")[]> = {
  AAAA: ["A", "A", "A", "A"],
  ABBA: ["A", "B", "B", "A"],
  ABBC: ["A", "B", "B", "C"],
};

/* =====================
   박스 계산
===================== */
function calcPacks(total: number, sizesDesc: number[]) {
  const sizes = [...sizesDesc].sort((a, b) => b - a);
  let remain = total;
  const counts: Record<number, number> = {};

  for (const s of sizes) {
    counts[s] = Math.floor(remain / s);
    remain -= counts[s] * s;
  }

  if (remain > 0) counts[sizes[sizes.length - 1]] += 1;

  const totalPieces = sizes.reduce(
    (sum, s) => sum + s * (counts[s] || 0),
    0
  );

  return { counts, totalPieces, leftover: totalPieces - total };
}

/* =====================
   메인 컴포넌트
===================== */
export default function Page() {
  const [product, setProduct] = useState<ProductType>("buddy");

  const [widthCm, setWidthCm] = useState(300);
  const [heightCm, setHeightCm] = useState(300);

  // 버디
  const [buddyColor, setBuddyColor] = useState<TileColor>("ivory");

  // 도트
  const [dotPattern, setDotPattern] = useState<DotPattern>("AAAA");
  const [dotA, setDotA] = useState<TileColor>("ivory");
  const [dotB, setDotB] = useState<TileColor>("beige");
  const [dotC, setDotC] = useState<TileColor>("butter");

  /* =====================
     계산
  ===================== */
  const buddyX = Math.ceil(widthCm / 30);
  const buddyY = Math.ceil(heightCm / 30);
  const buddyNeed = buddyX * buddyY;
  const buddyPack = calcPacks(buddyNeed, [36, 9, 2]);

  const dotX = Math.ceil(widthCm / 10);
  const dotY = Math.ceil(heightCm / 10);
  const dotNeed = dotX * dotY;
  const dotPack = calcPacks(dotNeed, [120, 40]);

  const colorMap: Record<TileColor, string> = Object.fromEntries(
    TILE_COLORS.map((c) => [c.key, c.color])
  ) as Record<TileColor, string>;

  const getDotColor = (s: "A" | "B" | "C") =>
    s === "A" ? colorMap[dotA] : s === "B" ? colorMap[dotB] : colorMap[dotC];

  const PREVIEW_MAX = 40;
  const pxBuddyX = Math.min(buddyX, PREVIEW_MAX);
  const pxBuddyY = Math.min(buddyY, PREVIEW_MAX);
  const pxDotX = Math.min(dotX, PREVIEW_MAX);
  const pxDotY = Math.min(dotY, PREVIEW_MAX);

  /* =====================
     렌더
  ===================== */
  return (
    <div className="min-h-screen bg-white px-4 py-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold text-slate-900">
          ALIVES 타일 계산기
        </h1>

        {/* 제품 선택 */}
        <section className="bg-slate-50 rounded-xl p-4 flex gap-3">
          {(["buddy", "dot"] as ProductType[]).map((t) => (
            <button
              key={t}
              onClick={() => setProduct(t)}
              className={`flex-1 rounded-lg p-4 border ${
                product === t
                  ? "border-emerald-500 bg-emerald-50"
                  : "border-slate-200"
              }`}
            >
              <b>{t === "buddy" ? "버디 데크타일" : "도트 데크타일"}</b>
            </button>
          ))}
        </section>

        {/* 사이즈 */}
        <section className="bg-slate-50 rounded-xl p-4 grid grid-cols-2 gap-3">
          <input
            type="number"
            value={widthCm}
            onChange={(e) => setWidthCm(Math.max(0, Number(e.target.value)))}
            className="border rounded px-3 py-2"
            placeholder="가로 cm"
          />
          <input
            type="number"
            value={heightCm}
            onChange={(e) => setHeightCm(Math.max(0, Number(e.target.value)))}
            className="border rounded px-3 py-2"
            placeholder="세로 cm"
          />
        </section>

        {/* 옵션 */}
        <section className="bg-slate-50 rounded-xl p-4 space-y-4">
          {product === "buddy" ? (
            <div className="grid grid-cols-2 gap-3">
              {TILE_COLORS.map((c) => (
                <button
                  key={c.key}
                  onClick={() => setBuddyColor(c.key)}
                  className={`p-3 rounded border flex items-center gap-2 ${
                    buddyColor === c.key
                      ? "border-emerald-500"
                      : "border-slate-200"
                  }`}
                >
                  <span
                    className="w-6 h-6 rounded border"
                    style={{ backgroundColor: c.color }}
                  />
                  {c.label}
                </button>
              ))}
            </div>
          ) : (
            <>
              {/* 패턴 */}
              <div className="flex gap-3">
                {(["AAAA", "ABBA", "ABBC"] as DotPattern[]).map((p) => (
                  <button
                    key={p}
                    onClick={() => setDotPattern(p)}
                    className={`p-3 rounded border ${
                      dotPattern === p
                        ? "border-emerald-500"
                        : "border-slate-200"
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>

              {/* A/B/C */}
              {(["A", "B", "C"] as const).map((slot) =>
                slot === "C" && dotPattern !== "ABBC" ? null : slot === "B" &&
                  dotPattern === "AAAA" ? null : (
                  <div key={slot} className="flex gap-2 items-center">
                    <b>{slot}</b>
                    {TILE_COLORS.map((c) => (
                      <button
                        key={c.key + slot}
                        onClick={() =>
                          slot === "A"
                            ? setDotA(c.key)
                            : slot === "B"
                            ? setDotB(c.key)
                            : setDotC(c.key)
                        }
                        className="w-6 h-6 rounded border"
                        style={{ backgroundColor: c.color }}
                      />
                    ))}
                  </div>
                )
              )}
            </>
          )}
        </section>

        {/* 미리보기 */}
        <section className="bg-slate-50 rounded-xl p-4 overflow-auto">
          {product === "buddy" ? (
            <div
              className="inline-grid"
              style={{
                gridTemplateColumns: `repeat(${pxBuddyX}, 16px)`,
              }}
            >
              {Array.from({ length: pxBuddyX * pxBuddyY }).map((_, i) => (
                <div
                  key={i}
                  style={{
                    backgroundColor: colorMap[buddyColor],
                    border: "1px solid #9CA3AF",
                  }}
                />
              ))}
            </div>
          ) : (
            <div
              className="inline-grid"
              style={{
                gridTemplateColumns: `repeat(${pxDotX}, 10px)`,
              }}
            >
              {Array.from({ length: pxDotX * pxDotY }).map((_, i) => {
                const x = i % pxDotX;
                const y = Math.floor(i / pxDotX);
                const idx = (y % 2) * 2 + (x % 2);
                const sym = DOT_PATTERN_MAP[dotPattern][idx];
                return (
                  <div
                    key={i}
                    style={{
                      backgroundColor: getDotColor(sym),
                      border: "1px solid #9CA3AF",
                    }}
                  />
                );
              })}
            </div>
          )}
        </section>

        {/* 수량 */}
        <section className="bg-slate-50 rounded-xl p-4 text-sm">
          {product === "buddy" ? (
            <>
              필요 수량: <b>{buddyNeed}</b> 장<br />
              36p: {buddyPack.counts[36] || 0} / 9p:{" "}
              {buddyPack.counts[9] || 0} / 2p:{" "}
              {buddyPack.counts[2] || 0}
              <br />
              남는 수량: <b>{buddyPack.leftover}</b>
            </>
          ) : (
            <>
              필요 수량: <b>{dotNeed}</b> 개<br />
              120p: {dotPack.counts[120] || 0} / 40p:{" "}
              {dotPack.counts[40] || 0}
              <br />
              남는 수량: <b>{dotPack.leftover}</b>
            </>
          )}
        </section>
      </div>
    </div>
  );
}
