"use client";

import { useMemo, useState } from "react";

/* =========================================================
   타입 정의
========================================================= */
type ProductType = "buddy" | "dot";
type BuddyColor = "ivory" | "lightgray" | "beige" | "butter";

/** 도트 색상 8개 */
type DotColorKey =
  | "ivory"
  | "lightgray"
  | "beige"
  | "butter"
  | "tealGreen"
  | "lemon"
  | "toffee"
  | "lavender";

type DotPattern = "AAAA" | "ABBA" | "ABBC";

/* =========================================================
   색상 옵션
   - 라이트그레이: 약간 더 밝게 (#E5E7EB)
========================================================= */
const buddyColorOptions: { key: BuddyColor; label: string; color: string }[] = [
  { key: "ivory", label: "아이보리", color: "#FDF8EE" },
  { key: "lightgray", label: "라이트그레이", color: "#E5E7EB" }, // 밝게
  { key: "beige", label: "베이지", color: "#EBD9B4" },
  { key: "butter", label: "버터", color: "#FFE9A7" },
];

const dotColorOptions: { key: DotColorKey; label: string; color: string }[] = [
  { key: "ivory", label: "아이보리", color: "#FDF8EE" },
  { key: "lightgray", label: "라이트그레이", color: "#E5E7EB" }, // 밝게
  { key: "beige", label: "베이지", color: "#EBD9B4" },
  { key: "butter", label: "버터", color: "#FFE9A7" },

  // 추가 4색
  { key: "tealGreen", label: "틸그린", color: "#2AA39A" },
  { key: "lemon", label: "레몬", color: "#FFE066" },
  { key: "toffee", label: "토피", color: "#B07A4A" },
  { key: "lavender", label: "라벤더", color: "#B9A7FF" },
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
   박스 계산 (기존 방식 유지)
========================================================= */
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

/* =========================================================
   UI 조각
========================================================= */
function ColorChipButton(props: {
  label: string;
  color: string;
  selected: boolean;
  onClick: () => void;
  compact?: boolean;
}) {
  const { label, color, selected, onClick, compact } = props;

  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "group w-full rounded-xl border transition",
        selected
          ? "border-emerald-500 bg-emerald-50"
          : "border-slate-200 bg-white hover:border-emerald-200 hover:bg-slate-50",
        compact ? "p-2" : "p-3",
      ].join(" ")}
    >
      <div className="flex items-center gap-2">
        <div
          className={[
            "rounded-lg border",
            compact ? "h-6 w-6" : "h-8 w-8",
          ].join(" ")}
          style={{
            backgroundColor: color,
            borderColor: "#94A3B8",
          }}
        />
        <div className="min-w-0 flex-1 text-left">
          <div className={["font-semibold truncate", compact ? "text-xs" : "text-sm"].join(" ")}>
            {label}
          </div>
          <div className={["text-[11px] text-slate-500", compact ? "leading-tight" : ""].join(" ")}>
            {selected ? "선택됨" : " "}
          </div>
        </div>

        <div
          className={[
            "shrink-0 rounded-full px-2 py-1 text-[11px] font-bold",
            selected ? "bg-emerald-600 text-white" : "bg-slate-100 text-slate-500",
          ].join(" ")}
        >
          {selected ? "✓" : ""}
        </div>
      </div>
    </button>
  );
}

function PatternButton(props: {
  pattern: DotPattern;
  selected: boolean;
  getColor: (s: "A" | "B" | "C") => string;
  onClick: () => void;
}) {
  const { pattern, selected, getColor, onClick } = props;

  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "rounded-xl border p-3 transition",
        selected
          ? "border-emerald-500 bg-emerald-50"
          : "border-slate-200 bg-white hover:border-emerald-200 hover:bg-slate-50",
      ].join(" ")}
    >
      <div className="flex items-center justify-center">
        {/* gap-0 + border로 4칸 붙게 */}
        <div className="grid grid-cols-2 gap-0 overflow-hidden rounded-lg border border-slate-300">
          {dotPatternCells[pattern].map((sym, i) => (
            <div
              key={i}
              style={{
                width: 28,
                height: 28,
                backgroundColor: getColor(sym),
                border: "0.5px solid #9AA3AF",
              }}
            />
          ))}
        </div>
      </div>
      <div className="mt-2 text-center text-xs font-black tracking-wide text-slate-700">
        {pattern}
      </div>
    </button>
  );
}

/* =========================================================
   메인
========================================================= */
export default function Page() {
  const [productType, setProductType] = useState<ProductType>("buddy");

  // 공간
  const [widthCm, setWidthCm] = useState<number>(400);  // 가로
  const [heightCm, setHeightCm] = useState<number>(300); // 세로

  // 버디
  const [buddyColor, setBuddyColor] = useState<BuddyColor>("ivory");

  // 도트
  const [dotPattern, setDotPattern] = useState<DotPattern>("AAAA");
  const [dotColorA, setDotColorA] = useState<DotColorKey>("ivory");
  const [dotColorB, setDotColorB] = useState<DotColorKey>("butter");
  const [dotColorC, setDotColorC] = useState<DotColorKey>("beige");

  // 성능 보호
  const maxPreviewTiles = 48;

  // 윤곽선(요청: 더 얇게 + 더 어둡게)
  const outlineColor = "#6B7280"; // 더 어둡게(회색)
  const outlineThin = "0.5px";

  /* ---------------- 계산 ---------------- */
  const buddyX = Math.ceil(Math.max(0, widthCm) / 30);
  const buddyY = Math.ceil(Math.max(0, heightCm) / 30);
  const buddyNeeded = Math.max(0, buddyX * buddyY);
  const buddyPack = useMemo(() => calcPacks(buddyNeeded, [36, 9, 2]), [buddyNeeded]);

  const dotX = Math.ceil(Math.max(0, widthCm) / 10);
  const dotY = Math.ceil(Math.max(0, heightCm) / 10);
  const dotNeeded = Math.max(0, dotX * dotY);
  const dotPack = useMemo(() => calcPacks(dotNeeded, [120, 40]), [dotNeeded]);

  const previewBuddyX = Math.min(buddyX || 0, maxPreviewTiles);
  const previewBuddyY = Math.min(buddyY || 0, maxPreviewTiles);
  const previewDotX = Math.min(dotX || 0, maxPreviewTiles);
  const previewDotY = Math.min(dotY || 0, maxPreviewTiles);

  /* ---------------- 색상 맵 ---------------- */
  const dotColorMap: Record<DotColorKey, string> = useMemo(() => {
    const m = {} as Record<DotColorKey, string>;
    for (const c of dotColorOptions) m[c.key] = c.color;
    return m;
  }, []);

  const buddyColorMap: Record<BuddyColor, string> = useMemo(() => {
    const m = {} as Record<BuddyColor, string>;
    for (const c of buddyColorOptions) m[c.key] = c.color;
    return m;
  }, []);

  const getDotColor = (symbol: "A" | "B" | "C") =>
    symbol === "A"
      ? dotColorMap[dotColorA]
      : symbol === "B"
      ? dotColorMap[dotColorB]
      : dotColorMap[dotColorC];

  /* ---------------- 미리보기 타일 픽셀(모바일 고려) ---------------- */
  const buddyTilePx = 14;
  const dotTilePx = 8;

  return (
    <div className="min-h-screen bg-white text-slate-900">
      {/* =========================
          상단 고정 미리보기 (요청: 맨 위, 항상 보이게)
         ========================= */}
      <div className="sticky top-0 z-20 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto max-w-6xl px-4 py-3">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h1 className="truncate text-lg font-black tracking-tight text-emerald-700 sm:text-xl">
                ALIVES 타일 계산기
              </h1>
              <div className="text-xs text-slate-500">
                공간: {widthCm}cm × {heightCm}cm
              </div>
            </div>

            <div className="shrink-0 text-right">
              <div className="text-[11px] text-slate-500">필요 개수</div>
              <div className="text-2xl font-black leading-none text-slate-900">
                {productType === "buddy" ? buddyNeeded : dotNeeded}
              </div>
            </div>
          </div>

          {/* 미리보기 */}
          <div className="mt-3 rounded-xl border border-slate-200 bg-slate-50 p-2">
            <div className="mb-2 flex items-center justify-between">
              <div className="text-sm font-bold text-slate-800">미리보기</div>
              <div className="text-[11px] text-slate-500">
                (큰 공간은 {maxPreviewTiles}×{maxPreviewTiles}까지만 표시)
              </div>
            </div>

            <div className="max-h-[220px] overflow-auto rounded-lg bg-white p-2">
              {/* 버디 */}
              {productType === "buddy" && (
                <div
                  className="inline-grid"
                  style={{
                    gridTemplateColumns: `repeat(${previewBuddyX}, ${buddyTilePx}px)`,
                    gridAutoRows: `${buddyTilePx}px`,
                  }}
                >
                  {Array.from({ length: previewBuddyX * previewBuddyY }).map((_, i) => (
                    <div
                      key={i}
                      style={{
                        backgroundColor: buddyColorMap[buddyColor],
                        border: `${outlineThin} solid ${outlineColor}`,
                        boxSizing: "border-box",
                      }}
                    />
                  ))}
                </div>
              )}

              {/* 도트 */}
              {productType === "dot" && (
                <div
                  className="inline-grid"
                  style={{
                    gridTemplateColumns: `repeat(${previewDotX}, ${dotTilePx}px)`,
                    gridAutoRows: `${dotTilePx}px`,
                  }}
                >
                  {Array.from({ length: previewDotX * previewDotY }).map((_, idx) => {
                    const x = idx % previewDotX;
                    const y = Math.floor(idx / previewDotX);
                    const patternIndex = (y % 2) * 2 + (x % 2);
                    const symbol = dotPatternCells[dotPattern][patternIndex];

                    return (
                      <div
                        key={idx}
                        style={{
                          backgroundColor: getDotColor(symbol),
                          border: `${outlineThin} solid ${outlineColor}`,
                          boxSizing: "border-box",
                        }}
                      />
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* =========================
          옵션 + 결과
         ========================= */}
      <div className="mx-auto max-w-6xl space-y-5 px-4 py-5">
        {/* 1) 타일 종류 */}
        <section className="rounded-2xl border border-slate-200 bg-white p-4">
          <div className="mb-2 text-sm font-black text-slate-800">1. 타일 종류</div>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setProductType("buddy")}
              className={[
                "rounded-xl border px-3 py-3 text-left text-sm font-bold transition",
                productType === "buddy"
                  ? "border-emerald-500 bg-emerald-50"
                  : "border-slate-200 bg-white hover:border-emerald-200 hover:bg-slate-50",
              ].join(" ")}
            >
              <div>버디 데크타일</div>
              <div className="mt-1 text-[11px] font-medium text-slate-500">30×30cm · 4색</div>
            </button>

            <button
              type="button"
              onClick={() => setProductType("dot")}
              className={[
                "rounded-xl border px-3 py-3 text-left text-sm font-bold transition",
                productType === "dot"
                  ? "border-emerald-500 bg-emerald-50"
                  : "border-slate-200 bg-white hover:border-emerald-200 hover:bg-slate-50",
              ].join(" ")}
            >
              <div>도트 데크타일</div>
              <div className="mt-1 text-[11px] font-medium text-slate-500">
                10×10cm · 8색 · AAAA/ABBA/ABBC
              </div>
            </button>
          </div>
        </section>

        {/* 2) 공간 입력 */}
        <section className="rounded-2xl border border-slate-200 bg-white p-4">
          <div className="mb-2 text-sm font-black text-slate-800">2. 공간 크기 (cm)</div>
          <div className="grid grid-cols-2 gap-2">
            <div className="rounded-xl border border-slate-200 p-2">
              <div className="text-[11px] font-semibold text-slate-500">가로</div>
              <input
                type="number"
                value={widthCm}
                onChange={(e) => setWidthCm(Number(e.target.value))}
                className="mt-1 w-full rounded-lg border border-slate-200 px-2 py-2 text-sm outline-none focus:border-emerald-400"
                inputMode="numeric"
              />
            </div>

            <div className="rounded-xl border border-slate-200 p-2">
              <div className="text-[11px] font-semibold text-slate-500">세로</div>
              <input
                type="number"
                value={heightCm}
                onChange={(e) => setHeightCm(Number(e.target.value))}
                className="mt-1 w-full rounded-lg border border-slate-200 px-2 py-2 text-sm outline-none focus:border-emerald-400"
                inputMode="numeric"
              />
            </div>
          </div>
        </section>

        {/* 3) 옵션 */}
        <section className="rounded-2xl border border-slate-200 bg-white p-4">
          <div className="mb-3 text-sm font-black text-slate-800">3. 옵션 선택</div>

          {/* 버디 색상 */}
          {productType === "buddy" && (
            <div>
              <div className="mb-2 text-xs font-bold text-slate-600">버디 색상</div>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                {buddyColorOptions.map((c) => (
                  <ColorChipButton
                    key={c.key}
                    label={c.label}
                    color={c.color}
                    selected={buddyColor === c.key}
                    onClick={() => setBuddyColor(c.key)}
                    compact
                  />
                ))}
              </div>
            </div>
          )}

          {/* 도트: 패턴 + A/B/C */}
          {productType === "dot" && (
            <div className="space-y-4">
              {/* 패턴 */}
              <div>
                <div className="mb-2 text-xs font-bold text-slate-600">도트 패턴</div>
                <div className="grid grid-cols-3 gap-2">
                  {(["AAAA", "ABBA", "ABBC"] as DotPattern[]).map((p) => (
                    <PatternButton
                      key={p}
                      pattern={p}
                      selected={dotPattern === p}
                      getColor={getDotColor}
                      onClick={() => setDotPattern(p)}
                    />
                  ))}
                </div>
              </div>

              {/* A/B/C 색상 */}
              <div className="space-y-3">
                <div>
                  <div className="mb-2 text-xs font-black text-slate-700">A 색상</div>
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                    {dotColorOptions.map((c) => (
                      <ColorChipButton
                        key={"A-" + c.key}
                        label={c.label}
                        color={c.color}
                        selected={dotColorA === c.key}
                        onClick={() => setDotColorA(c.key)}
                        compact
                      />
                    ))}
                  </div>
                </div>

                {dotPattern !== "AAAA" && (
                  <div>
                    <div className="mb-2 text-xs font-black text-slate-700">B 색상</div>
                    <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                      {dotColorOptions.map((c) => (
                        <ColorChipButton
                          key={"B-" + c.key}
                          label={c.label}
                          color={c.color}
                          selected={dotColorB === c.key}
                          onClick={() => setDotColorB(c.key)}
                          compact
                        />
                      ))}
                    </div>
                  </div>
                )}

                {dotPattern === "ABBC" && (
                  <div>
                    <div className="mb-2 text-xs font-black text-slate-700">C 색상</div>
                    <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                      {dotColorOptions.map((c) => (
                        <ColorChipButton
                          key={"C-" + c.key}
                          label={c.label}
                          color={c.color}
                          selected={dotColorC === c.key}
                          onClick={() => setDotColorC(c.key)}
                          compact
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </section>

        {/* 4) 계산 결과 */}
        <section className="rounded-2xl border border-slate-200 bg-white p-4">
          <div className="mb-2 text-sm font-black text-slate-800">4. 수량 & 박스 계산</div>

          {productType === "buddy" && (
            <div className="space-y-2">
              <div className="flex items-end justify-between rounded-xl border border-slate-200 bg-slate-50 p-3">
                <div>
                  <div className="text-xs font-semibold text-slate-500">필요 장수</div>
                  <div className="text-3xl font-black">{buddyNeeded}</div>
                </div>
                <div className="text-right text-xs text-slate-600">
                  {buddyX} × {buddyY} (30×30cm)
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 text-sm">
                <div className="rounded-xl border border-slate-200 p-3">
                  <div className="text-xs font-semibold text-slate-500">36p</div>
                  <div className="text-xl font-black">{buddyPack.packCounts[36] || 0}</div>
                </div>
                <div className="rounded-xl border border-slate-200 p-3">
                  <div className="text-xs font-semibold text-slate-500">9p</div>
                  <div className="text-xl font-black">{buddyPack.packCounts[9] || 0}</div>
                </div>
                <div className="rounded-xl border border-slate-200 p-3">
                  <div className="text-xs font-semibold text-slate-500">2p</div>
                  <div className="text-xl font-black">{buddyPack.packCounts[2] || 0}</div>
                </div>
              </div>

              <div className="rounded-xl border border-slate-200 bg-white p-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-600">총 장수</span>
                  <b>{buddyPack.totalPieces}</b>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">남는 장수</span>
                  <b>{buddyPack.leftover}</b>
                </div>
              </div>
            </div>
          )}

          {productType === "dot" && (
            <div className="space-y-2">
              <div className="flex items-end justify-between rounded-xl border border-slate-200 bg-slate-50 p-3">
                <div>
                  <div className="text-xs font-semibold text-slate-500">필요 개수</div>
                  <div className="text-3xl font-black">{dotNeeded}</div>
                </div>
                <div className="text-right text-xs text-slate-600">
                  {dotX} × {dotY} (10×10cm)
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="rounded-xl border border-slate-200 p-3">
                  <div className="text-xs font-semibold text-slate-500">120p</div>
                  <div className="text-xl font-black">{dotPack.packCounts[120] || 0}</div>
                </div>
                <div className="rounded-xl border border-slate-200 p-3">
                  <div className="text-xs font-semibold text-slate-500">40p</div>
                  <div className="text-xl font-black">{dotPack.packCounts[40] || 0}</div>
                </div>
              </div>

              <div className="rounded-xl border border-slate-200 bg-white p-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-600">총 개수</span>
                  <b>{dotPack.totalPieces}</b>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">남는 수량</span>
                  <b>{dotPack.leftover}</b>
                </div>
              </div>
            </div>
          )}
        </section>

        {/* 하단 여백 */}
        <div className="h-4" />
      </div>
    </div>
  );
}
