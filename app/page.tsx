"use client";

import { useMemo, useState } from "react";

/* =========================================================
   타입
========================================================= */
type ProductType = "buddy" | "dot";
type BuddyColor = "ivory" | "lightgray" | "beige" | "butter";
type DotColorKey = "ivory" | "lightgray" | "beige" | "butter";
type DotPattern = "AAAA" | "ABBA" | "ABBC";

type ColorOption<T extends string> = { key: T; label: string; color: string };

/* =========================================================
   옵션 (버디 4색 / 도트 4색 동일)
========================================================= */
const buddyColorOptions: ColorOption<BuddyColor>[] = [
  { key: "ivory", label: "아이보리", color: "#FDF8EE" },
  { key: "lightgray", label: "라이트그레이", color: "#D4D4D8" },
  { key: "beige", label: "베이지", color: "#EBD9B4" },
  { key: "butter", label: "버터", color: "#FFE9A7" },
];

const dotColorOptions: ColorOption<DotColorKey>[] = [
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
   박스 계산 (기존 로직 유지)
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
   작은 UI 유틸
========================================================= */
function clampNumber(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function getOptionColor<T extends string>(
  options: ColorOption<T>[],
  key: T
): string {
  return options.find((o) => o.key === key)?.color ?? "#EEE";
}

function ChipButton(props: {
  active: boolean;
  onClick: () => void;
  title: string;
  subtitle?: string;
}) {
  const { active, onClick, title, subtitle } = props;
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "w-full rounded-lg border text-left transition",
        "px-3 py-2 md:px-4 md:py-3",
        "text-sm md:text-base",
        active
          ? "border-emerald-500 bg-emerald-50 ring-1 ring-emerald-200"
          : "border-slate-200 bg-white hover:border-emerald-300",
      ].join(" ")}
    >
      <div className="font-semibold">{title}</div>
      {subtitle ? (
        <div className="text-[11px] md:text-xs text-slate-500 mt-0.5">
          {subtitle}
        </div>
      ) : null}
    </button>
  );
}

function ColorPickButton(props: {
  active: boolean;
  onClick: () => void;
  label: string;
  hex: string;
  compact?: boolean;
}) {
  const { active, onClick, label, hex, compact } = props;

  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "rounded-lg border transition",
        compact ? "p-2" : "p-3",
        active
          ? "border-emerald-500 bg-emerald-50 ring-1 ring-emerald-200"
          : "border-slate-200 bg-white hover:border-emerald-300",
      ].join(" ")}
    >
      <div className="flex items-center gap-2">
        <span
          className={[
            "inline-block rounded-md border",
            compact ? "w-7 h-7" : "w-9 h-9",
          ].join(" ")}
          style={{
            backgroundColor: hex,
            borderColor: "rgba(0,0,0,0.18)",
          }}
        />
        <div className="text-left">
          <div className={compact ? "text-xs font-semibold" : "text-sm font-semibold"}>
            {label}
          </div>
          <div className="text-[10px] text-slate-500">{hex}</div>
        </div>
      </div>

      {active ? (
        <div className="mt-2 text-[11px] font-semibold text-emerald-700">
          ✓ 선택됨
        </div>
      ) : (
        <div className="mt-2 text-[11px] text-slate-400">선택</div>
      )}
    </button>
  );
}

/* =========================================================
   메인
========================================================= */
export default function Page() {
  const [productType, setProductType] = useState<ProductType>("buddy");

  // 공간 (cm)
  const [widthCm, setWidthCm] = useState<number>(400);
  const [heightCm, setHeightCm] = useState<number>(300);

  // 버디 색
  const [buddyColor, setBuddyColor] = useState<BuddyColor>("ivory");

  // 도트 패턴 + A/B/C
  const [dotPattern, setDotPattern] = useState<DotPattern>("AAAA");
  const [dotColorA, setDotColorA] = useState<DotColorKey>("ivory");
  const [dotColorB, setDotColorB] = useState<DotColorKey>("butter");
  const [dotColorC, setDotColorC] = useState<DotColorKey>("beige");

  // 미리보기 최대 타일 수 (성능)
  const maxPreviewTiles = 44;

  /* ---------------- 계산 ---------------- */
  const buddyX = Math.ceil(widthCm / 30);
  const buddyY = Math.ceil(heightCm / 30);
  const buddyNeeded = buddyX * buddyY;
  const buddyPack = calcPacks(buddyNeeded, [36, 9, 2]);

  const dotX = Math.ceil(widthCm / 10);
  const dotY = Math.ceil(heightCm / 10);
  const dotNeeded = dotX * dotY;
  const dotPack = calcPacks(dotNeeded, [120, 40]);

  const previewBuddyX = clampNumber(buddyX, 1, maxPreviewTiles);
  const previewBuddyY = clampNumber(buddyY, 1, maxPreviewTiles);
  const previewDotX = clampNumber(dotX, 1, maxPreviewTiles);
  const previewDotY = clampNumber(dotY, 1, maxPreviewTiles);

  const dotColorMap: Record<DotColorKey, string> = useMemo(() => {
    return Object.fromEntries(dotColorOptions.map((c) => [c.key, c.color])) as Record<
      DotColorKey,
      string
    >;
  }, []);

  const getDotColor = (symbol: "A" | "B" | "C") =>
    symbol === "A"
      ? dotColorMap[dotColorA]
      : symbol === "B"
      ? dotColorMap[dotColorB]
      : dotColorMap[dotColorC];

  /* ---------------- 미리보기 타일 렌더 ---------------- */
  const buddyTileColor = getOptionColor(buddyColorOptions, buddyColor);

  const previewTitle = productType === "buddy" ? "버디 데크타일 미리보기" : "도트 데크타일 미리보기";
  const neededBigNumber = productType === "buddy" ? buddyNeeded : dotNeeded;

  return (
    <div className="min-h-screen bg-white text-slate-900">
      {/* =================================================
          상단 고정(스티키) 미리보기
          - 모바일에서 “항상 보이게” 우선
          - 배경/보더 넣어서 떠있는 느낌
      ================================================== */}
      <div className="sticky top-0 z-30 bg-white/95 backdrop-blur border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 py-3">
          <div className="flex items-end justify-between gap-3">
            <div>
              <h1 className="text-lg md:text-2xl font-black tracking-tight text-emerald-700">
                ALIVES 타일 계산기
              </h1>
              <div className="text-[11px] md:text-xs text-slate-500 mt-0.5">
                공간 크기: {widthCm}cm × {heightCm}cm · {productType === "buddy" ? "버디(30×30)" : "도트(10×10)"}
              </div>
            </div>

            {/* 필요 개수 크게 */}
            <div className="text-right">
              <div className="text-[11px] md:text-xs text-slate-500">필요 개수</div>
              <div className="text-2xl md:text-3xl font-black tracking-tight">
                {neededBigNumber.toLocaleString()}
              </div>
            </div>
          </div>

          {/* 미리보기 박스 */}
          <div className="mt-3 rounded-xl border border-slate-200 bg-slate-50 p-3">
            <div className="flex items-center justify-between gap-3">
              <div className="font-semibold text-sm md:text-base">{previewTitle}</div>
              <div className="text-[11px] md:text-xs text-slate-500">
                (미리보기는 최대 {maxPreviewTiles}×{maxPreviewTiles}까지만 표시)
              </div>
            </div>

            <div className="mt-2 overflow-auto">
              {/* 버디 */}
              {productType === "buddy" && (
                <div
                  className="inline-grid"
                  style={{
                    gridTemplateColumns: `repeat(${previewBuddyX}, 18px)`,
                    gridAutoRows: "18px",
                  }}
                >
                  {Array.from({ length: previewBuddyX * previewBuddyY }).map((_, i) => (
                    <div
                      key={i}
                      className="border-[0.5px] border-slate-400"
                      style={{
                        backgroundColor: buddyTileColor,
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
                    gridTemplateColumns: `repeat(${previewDotX}, 10px)`,
                    gridAutoRows: "10px",
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
                        className="border-[0.5px] border-slate-300"
                        style={{ backgroundColor: getDotColor(symbol) }}
                      />
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* =================================================
          아래: 옵션/결과 (모바일에서 스크롤 영역)
      ================================================== */}
      <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
        {/* 1. 데크타일 종류 */}
        <section className="rounded-2xl border border-slate-200 bg-white p-4 md:p-5 shadow-sm">
          <div className="flex items-end justify-between gap-3">
            <h2 className="text-base md:text-lg font-bold">1. 데크타일 종류</h2>
            <div className="text-[11px] md:text-xs text-slate-500">
              {productType === "buddy" ? "버디" : "도트"} 선택됨
            </div>
          </div>

          <div className="mt-3 grid grid-cols-2 gap-3">
            <ChipButton
              active={productType === "buddy"}
              onClick={() => setProductType("buddy")}
              title="버디 데크타일"
              subtitle="30 × 30 cm / 4색상"
            />
            <ChipButton
              active={productType === "dot"}
              onClick={() => setProductType("dot")}
              title="도트 데크타일"
              subtitle="10 × 10 cm / 4색상 / 패턴 AAAA·ABBA·ABBC"
            />
          </div>
        </section>

        {/* 2. 공간 크기 */}
        <section className="rounded-2xl border border-slate-200 bg-white p-4 md:p-5 shadow-sm">
          <h2 className="text-base md:text-lg font-bold">2. 공간 크기 (cm)</h2>

          <div className="mt-3 grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <div className="text-xs text-slate-600">가로</div>
              <input
                type="number"
                value={widthCm}
                onChange={(e) => setWidthCm(Number(e.target.value))}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-400"
                placeholder="가로(cm)"
              />
            </div>

            <div className="space-y-1">
              <div className="text-xs text-slate-600">세로</div>
              <input
                type="number"
                value={heightCm}
                onChange={(e) => setHeightCm(Number(e.target.value))}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-400"
                placeholder="세로(cm)"
              />
            </div>
          </div>

          <div className="mt-2 text-[11px] text-slate-500">
            입력값 기준으로 필요한 타일 수를 올림 계산합니다.
          </div>
        </section>

        {/* 3. 옵션 (모바일: 접기/펼치기) */}
        <section className="rounded-2xl border border-slate-200 bg-white p-0 shadow-sm overflow-hidden">
          <details open className="group">
            <summary className="list-none cursor-pointer select-none p-4 md:p-5 flex items-center justify-between">
              <div>
                <div className="text-base md:text-lg font-bold">3. 색상 / 패턴</div>
                <div className="text-[11px] md:text-xs text-slate-500 mt-0.5">
                  모바일에서 스크롤 줄이려면 이 섹션을 접어두셔도 됩니다.
                </div>
              </div>
              <div className="text-xs text-emerald-700 font-semibold group-open:rotate-180 transition">
                ▼
              </div>
            </summary>

            <div className="border-t border-slate-200 p-4 md:p-5 space-y-6">
              {/* 버디 옵션 */}
              {productType === "buddy" && (
                <div className="space-y-3">
                  <div className="flex items-end justify-between">
                    <h3 className="font-bold">버디 색상</h3>
                    <div className="text-[11px] text-slate-500">
                      선택: {buddyColorOptions.find((c) => c.key === buddyColor)?.label}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3">
                    {buddyColorOptions.map((c) => (
                      <ColorPickButton
                        key={c.key}
                        active={buddyColor === c.key}
                        onClick={() => setBuddyColor(c.key)}
                        label={c.label}
                        hex={c.color}
                        compact
                      />
                    ))}
                  </div>

                  <div className="text-[11px] text-slate-500">
                    버디 미리보기 윤곽선은 색상과 구분되도록 더 진한 회색 라인을 사용합니다.
                  </div>
                </div>
              )}

              {/* 도트 옵션 */}
              {productType === "dot" && (
                <div className="space-y-6">
                  {/* 패턴 */}
                  <div className="space-y-3">
                    <div className="flex items-end justify-between">
                      <h3 className="font-bold">도트 패턴</h3>
                      <div className="text-[11px] text-slate-500">선택: {dotPattern}</div>
                    </div>

                    <div className="grid grid-cols-3 gap-2 md:gap-3">
                      {(Object.keys(dotPatternCells) as DotPattern[]).map((p) => (
                        <button
                          key={p}
                          type="button"
                          onClick={() => setDotPattern(p)}
                          className={[
                            "rounded-xl border bg-white p-2 md:p-3 transition text-center",
                            dotPattern === p
                              ? "border-emerald-500 bg-emerald-50 ring-1 ring-emerald-200"
                              : "border-slate-200 hover:border-emerald-300",
                          ].join(" ")}
                        >
                          {/* 2×2 패턴은 “붙어있게” 보이도록 gap 0 */}
                          <div className="mx-auto inline-grid grid-cols-2 gap-0">
                            {dotPatternCells[p].map((sym, i) => (
                              <div
                                key={i}
                                className="w-8 h-8 md:w-9 md:h-9 border-[0.5px] border-slate-300"
                                style={{ backgroundColor: getDotColor(sym) }}
                              />
                            ))}
                          </div>
                          <div className="mt-1 text-[11px] md:text-xs font-bold">{p}</div>
                          {dotPattern === p ? (
                            <div className="mt-1 text-[11px] font-semibold text-emerald-700">
                              ✓ 선택됨
                            </div>
                          ) : (
                            <div className="mt-1 text-[11px] text-slate-400">선택</div>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* 색상 A/B/C */}
                  <div className="space-y-5">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="font-bold">
                          A 색상 <span className="text-[11px] text-slate-500">(항상 사용)</span>
                        </div>
                        <div className="text-[11px] text-slate-500">
                          선택: {dotColorOptions.find((c) => c.key === dotColorA)?.label}
                        </div>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3">
                        {dotColorOptions.map((c) => (
                          <ColorPickButton
                            key={"A-" + c.key}
                            active={dotColorA === c.key}
                            onClick={() => setDotColorA(c.key)}
                            label={c.label}
                            hex={c.color}
                            compact
                          />
                        ))}
                      </div>
                    </div>

                    {dotPattern !== "AAAA" && (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="font-bold">
                            B 색상{" "}
                            <span className="text-[11px] text-slate-500">(ABBA/ABBC)</span>
                          </div>
                          <div className="text-[11px] text-slate-500">
                            선택: {dotColorOptions.find((c) => c.key === dotColorB)?.label}
                          </div>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3">
                          {dotColorOptions.map((c) => (
                            <ColorPickButton
                              key={"B-" + c.key}
                              active={dotColorB === c.key}
                              onClick={() => setDotColorB(c.key)}
                              label={c.label}
                              hex={c.color}
                              compact
                            />
                          ))}
                        </div>
                      </div>
                    )}

                    {dotPattern === "ABBC" && (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="font-bold">
                            C 색상 <span className="text-[11px] text-slate-500">(ABBC)</span>
                          </div>
                          <div className="text-[11px] text-slate-500">
                            선택: {dotColorOptions.find((c) => c.key === dotColorC)?.label}
                          </div>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3">
                          {dotColorOptions.map((c) => (
                            <ColorPickButton
                              key={"C-" + c.key}
                              active={dotColorC === c.key}
                              onClick={() => setDotColorC(c.key)}
                              label={c.label}
                              hex={c.color}
                              compact
                            />
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </details>
        </section>

        {/* 4. 수량 & 박스 계산 */}
        <section className="rounded-2xl border border-slate-200 bg-white p-4 md:p-5 shadow-sm">
          <h2 className="text-base md:text-lg font-bold">4. 수량 & 박스 계산</h2>

          {productType === "buddy" && (
            <div className="mt-3 text-sm space-y-2">
              <div className="flex items-center justify-between">
                <div className="text-slate-600">필요 장수</div>
                <div className="text-lg font-black">{buddyNeeded.toLocaleString()}</div>
              </div>
              <div className="text-[11px] text-slate-500">
                타일 배치: {buddyX} × {buddyY} (30×30cm 기준)
              </div>

              <div className="mt-3 rounded-xl border border-slate-200 bg-slate-50 p-3">
                <div className="font-semibold mb-2">포장 구성 (36p / 9p / 2p)</div>
                <div className="grid grid-cols-3 gap-2 text-sm">
                  <div className="rounded-lg border border-slate-200 bg-white p-2">
                    <div className="text-xs text-slate-500">36p</div>
                    <div className="font-bold">{buddyPack.packCounts[36] || 0} 박스</div>
                  </div>
                  <div className="rounded-lg border border-slate-200 bg-white p-2">
                    <div className="text-xs text-slate-500">9p</div>
                    <div className="font-bold">{buddyPack.packCounts[9] || 0} 박스</div>
                  </div>
                  <div className="rounded-lg border border-slate-200 bg-white p-2">
                    <div className="text-xs text-slate-500">2p</div>
                    <div className="font-bold">{buddyPack.packCounts[2] || 0} 박스</div>
                  </div>
                </div>

                <div className="mt-3 text-sm">
                  총 장수: <b>{buddyPack.totalPieces.toLocaleString()}</b> · 남는 장수:{" "}
                  <b>{buddyPack.leftover.toLocaleString()}</b>
                </div>
              </div>
            </div>
          )}

          {productType === "dot" && (
            <div className="mt-3 text-sm space-y-2">
              <div className="flex items-center justify-between">
                <div className="text-slate-600">필요 1P</div>
                <div className="text-lg font-black">{dotNeeded.toLocaleString()}</div>
              </div>
              <div className="text-[11px] text-slate-500">
                타일 배치: {dotX} × {dotY} (10×10cm 기준) · 패턴 {dotPattern}
              </div>

              <div className="mt-3 rounded-xl border border-slate-200 bg-slate-50 p-3">
                <div className="font-semibold mb-2">포장 구성 (120p / 40p)</div>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="rounded-lg border border-slate-200 bg-white p-2">
                    <div className="text-xs text-slate-500">120p</div>
                    <div className="font-bold">{dotPack.packCounts[120] || 0} 박스</div>
                  </div>
                  <div className="rounded-lg border border-slate-200 bg-white p-2">
                    <div className="text-xs text-slate-500">40p</div>
                    <div className="font-bold">{dotPack.packCounts[40] || 0} 박스</div>
                  </div>
                </div>

                <div className="mt-3 text-sm">
                  총 개수: <b>{dotPack.totalPieces.toLocaleString()}</b> · 남는 수량:{" "}
                  <b>{dotPack.leftover.toLocaleString()}</b>
                </div>
              </div>
            </div>
          )}
        </section>

        {/* 하단 여백 */}
        <div className="h-10" />
      </div>
    </div>
  );
}
