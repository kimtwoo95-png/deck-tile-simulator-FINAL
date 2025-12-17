"use client";

import { useMemo, useState } from "react";

/* =========================================================
   타입
========================================================= */
type ProductType = "buddy" | "dot";

type BuddyColorKey = "ivory" | "lightgray" | "beige" | "butter";
type DotColorKey = "ivory" | "lightgray" | "beige" | "butter";

type DotPattern = "AAAA" | "ABBA" | "ABBC";
type DotSymbol = "A" | "B" | "C";

/* =========================================================
   색상 옵션 (버디/도트 동일 4색)
========================================================= */
const colorOptions: { key: BuddyColorKey; label: string; hex: string }[] = [
  { key: "ivory", label: "아이보리", hex: "#FDF8EE" },
  { key: "lightgray", label: "라이트그레이", hex: "#D4D4D8" },
  { key: "beige", label: "베이지", hex: "#EBD9B4" },
  { key: "butter", label: "버터", hex: "#FFE9A7" },
];

/* =========================================================
   도트 패턴 (2×2)
========================================================= */
const dotPatternCells: Record<DotPattern, DotSymbol[]> = {
  AAAA: ["A", "A", "A", "A"],
  ABBA: ["A", "B", "B", "A"],
  ABBC: ["A", "B", "B", "C"],
};

/* =========================================================
   박스 계산 (그리디 + 남으면 최소 팩 1개 추가)
========================================================= */
function calcPacks(totalNeeded: number, packSizes: number[]) {
  const sorted = [...packSizes].sort((a, b) => b - a);
  const smallest = sorted[sorted.length - 1];

  const packCounts: Record<number, number> = {};
  let remaining = totalNeeded;

  for (const size of sorted) {
    const cnt = Math.floor(remaining / size);
    packCounts[size] = cnt;
    remaining -= cnt * size;
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
   유틸
========================================================= */
function clampNumber(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function safeNumber(v: number) {
  if (!Number.isFinite(v)) return 0;
  return v;
}

export default function Page() {
  /* =========================================================
     상태
  ========================================================= */
  const [productType, setProductType] = useState<ProductType>("dot");

  // 공간 (cm)
  const [widthCm, setWidthCm] = useState<number>(300);
  const [heightCm, setHeightCm] = useState<number>(300);

  // 버디 색상
  const [buddyColor, setBuddyColor] = useState<BuddyColorKey>("ivory");

  // 도트 옵션
  const [dotPattern, setDotPattern] = useState<DotPattern>("ABBA");
  const [dotColorA, setDotColorA] = useState<DotColorKey>("ivory");
  const [dotColorB, setDotColorB] = useState<DotColorKey>("beige");
  const [dotColorC, setDotColorC] = useState<DotColorKey>("ivory");

  /* =========================================================
     파생 값
  ========================================================= */
  const colorMap = useMemo(() => {
    const m: Record<string, string> = {};
    for (const c of colorOptions) m[c.key] = c.hex;
    return m as Record<BuddyColorKey, string> & Record<DotColorKey, string>;
  }, []);

  const normalizedWidth = safeNumber(widthCm);
  const normalizedHeight = safeNumber(heightCm);

  // 타일 규격
  const buddyTileCm = 30;
  const dotTileCm = 10;

  // 계산: 버디
  const buddyX = Math.ceil(normalizedWidth / buddyTileCm);
  const buddyY = Math.ceil(normalizedHeight / buddyTileCm);
  const buddyNeeded = buddyX * buddyY;
  const buddyPack = useMemo(() => calcPacks(buddyNeeded, [36, 9, 2]), [buddyNeeded]);

  // 계산: 도트
  const dotX = Math.ceil(normalizedWidth / dotTileCm);
  const dotY = Math.ceil(normalizedHeight / dotTileCm);
  const dotNeeded = dotX * dotY;
  const dotPack = useMemo(() => calcPacks(dotNeeded, [120, 40]), [dotNeeded]);

  // 도트 색상 심볼 → 실제 색
  const getDotColorHex = (symbol: DotSymbol) => {
    if (symbol === "A") return colorMap[dotColorA];
    if (symbol === "B") return colorMap[dotColorB];
    return colorMap[dotColorC];
  };

  // 패턴별로 실제로 필요한 슬롯만 활성화
  const dotNeedsB = dotPattern !== "AAAA";
  const dotNeedsC = dotPattern === "ABBC";

  /* =========================================================
     미리보기 (성능/가독성)
     - 화면에 “그리드”가 제대로 보이게: 고정 픽셀 타일 + 스크롤
  ========================================================= */
  const maxPreviewTiles = 60; // 가로/세로 최대 미리보기 타일 수
  const previewBuddyX = clampNumber(buddyX, 1, maxPreviewTiles);
  const previewBuddyY = clampNumber(buddyY, 1, maxPreviewTiles);
  const previewDotX = clampNumber(dotX, 1, maxPreviewTiles);
  const previewDotY = clampNumber(dotY, 1, maxPreviewTiles);

  // 타일 픽셀 사이즈 (미리보기용)
  const buddyPx = 18;
  const dotPx = 10;

  /* =========================================================
     UI 컴포넌트 (간단 재사용)
  ========================================================= */
  const SectionTitle = ({ children }: { children: React.ReactNode }) => (
    <div className="flex items-end justify-between gap-3">
      <h2 className="text-[15px] font-bold text-slate-900">{children}</h2>
    </div>
  );

  const Card = ({ children }: { children: React.ReactNode }) => (
    <section className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
      {children}
    </section>
  );

  const SelectTileButton = ({
    active,
    title,
    subtitle,
    onClick,
  }: {
    active: boolean;
    title: string;
    subtitle: string;
    onClick: () => void;
  }) => (
    <button
      onClick={onClick}
      className={[
        "w-full text-left rounded-2xl border p-4 transition",
        active
          ? "border-emerald-500 bg-emerald-50"
          : "border-slate-200 bg-white hover:border-emerald-200",
      ].join(" ")}
      type="button"
    >
      <div className="font-extrabold text-slate-900">{title}</div>
      <div className="text-xs text-slate-500 mt-1">{subtitle}</div>
    </button>
  );

  const ColorCard = ({
    active,
    label,
    hex,
    onClick,
    disabled,
  }: {
    active: boolean;
    label: string;
    hex: string;
    onClick: () => void;
    disabled?: boolean;
  }) => (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={[
        "w-full rounded-2xl border p-3 transition text-center",
        disabled ? "opacity-40 cursor-not-allowed" : "",
        active
          ? "border-emerald-500 bg-emerald-50"
          : "border-slate-200 bg-white hover:border-emerald-200",
      ].join(" ")}
    >
      <div
        className="h-10 rounded-lg border"
        style={{ backgroundColor: hex, borderColor: "#CBD5E1" }}
      />
      <div className="mt-2 text-xs font-semibold text-slate-800">{label}</div>
    </button>
  );

  const PatternCard = ({
    pattern,
    active,
    onClick,
  }: {
    pattern: DotPattern;
    active: boolean;
    onClick: () => void;
  }) => {
    const cells = dotPatternCells[pattern];
    return (
      <button
        type="button"
        onClick={onClick}
        className={[
          "w-full rounded-2xl border p-4 transition",
          active
            ? "border-emerald-500 bg-emerald-50"
            : "border-slate-200 bg-white hover:border-emerald-200",
        ].join(" ")}
      >
        {/* 2×2 미리보기: 4칸 붙어서 보이도록 gap 0 */}
        <div className="mx-auto w-fit">
          <div
            className="grid"
            style={{
              gridTemplateColumns: "repeat(2, 34px)",
              gridTemplateRows: "repeat(2, 34px)",
              gap: 0,
            }}
          >
            {cells.map((sym, i) => (
              <div
                key={i}
                className="border"
                style={{
                  backgroundColor: getDotColorHex(sym),
                  borderColor: "#94A3B8",
                }}
              />
            ))}
          </div>
        </div>
        <div className="mt-2 text-center text-xs font-extrabold text-slate-900">
          {pattern}
        </div>
      </button>
    );
  };

  /* =========================================================
     렌더
  ========================================================= */
  return (
    <div className="min-h-screen bg-white px-4 py-8 text-slate-900">
      <div className="max-w-6xl mx-auto space-y-8">
        <h1 className="text-4xl font-black tracking-tight text-emerald-700">
          ALIVES 타일 계산기
        </h1>

        {/* 1. 데크타일 종류 선택 */}
        <Card>
          <SectionTitle>1. 데크타일 종류 선택</SectionTitle>
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <SelectTileButton
              active={productType === "buddy"}
              title="버디 데크타일"
              subtitle="30 × 30 cm / 4색상"
              onClick={() => setProductType("buddy")}
            />
            <SelectTileButton
              active={productType === "dot"}
              title="도트 데크타일"
              subtitle="10 × 10 cm / 4색상 / 패턴 AAAA·ABBA·ABBC"
              onClick={() => setProductType("dot")}
            />
          </div>
        </Card>

        {/* 2~4: 입력/옵션/미리보기 */}
        <Card>
          <div className="grid lg:grid-cols-[1fr_1.15fr] gap-6">
            {/* 왼쪽: 2,3 */}
            <div className="space-y-6">
              {/* 2. 공간 사이즈 입력 */}
              <div>
                <SectionTitle>2. 공간 사이즈 입력 (cm)</SectionTitle>
                <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <div className="text-xs font-semibold text-slate-600">
                      가로 (cm)
                    </div>
                    <input
                      type="number"
                      value={widthCm}
                      onChange={(e) => setWidthCm(Number(e.target.value))}
                      className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
                      placeholder="가로(cm)"
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="text-xs font-semibold text-slate-600">
                      세로 (cm)
                    </div>
                    <input
                      type="number"
                      value={heightCm}
                      onChange={(e) => setHeightCm(Number(e.target.value))}
                      className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
                      placeholder="세로(cm)"
                    />
                  </div>
                </div>
              </div>

              {/* 3. 옵션 */}
              {productType === "buddy" && (
                <div>
                  <SectionTitle>3. 버디 색상 선택</SectionTitle>
                  <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {colorOptions.map((c) => (
                      <ColorCard
                        key={c.key}
                        active={buddyColor === c.key}
                        label={c.label}
                        hex={c.hex}
                        onClick={() => setBuddyColor(c.key)}
                      />
                    ))}
                  </div>
                </div>
              )}

              {productType === "dot" && (
                <div className="space-y-6">
                  <div>
                    <SectionTitle>3. 도트 패턴</SectionTitle>
                    <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
                      {(Object.keys(dotPatternCells) as DotPattern[]).map(
                        (p) => (
                          <PatternCard
                            key={p}
                            pattern={p}
                            active={dotPattern === p}
                            onClick={() => setDotPattern(p)}
                          />
                        )
                      )}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <SectionTitle>도트 색상 선택</SectionTitle>

                    {/* 색상 A */}
                    <div className="space-y-2">
                      <div className="text-sm font-extrabold text-slate-900">
                        색상 A
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {colorOptions.map((c) => (
                          <ColorCard
                            key={`A-${c.key}`}
                            active={dotColorA === c.key}
                            label={c.label}
                            hex={c.hex}
                            onClick={() => setDotColorA(c.key)}
                          />
                        ))}
                      </div>
                    </div>

                    {/* 색상 B */}
                    <div className="space-y-2">
                      <div className="text-sm font-extrabold text-slate-900">
                        색상 B
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {colorOptions.map((c) => (
                          <ColorCard
                            key={`B-${c.key}`}
                            active={dotColorB === c.key}
                            label={c.label}
                            hex={c.hex}
                            onClick={() => setDotColorB(c.key)}
                            disabled={!dotNeedsB}
                          />
                        ))}
                      </div>
                      {!dotNeedsB && (
                        <div className="text-xs text-slate-500">
                          AAAA 패턴에서는 B 색상을 사용하지 않습니다.
                        </div>
                      )}
                    </div>

                    {/* 색상 C */}
                    <div className="space-y-2">
                      <div className="text-sm font-extrabold text-slate-900">
                        색상 C
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {colorOptions.map((c) => (
                          <ColorCard
                            key={`C-${c.key}`}
                            active={dotColorC === c.key}
                            label={c.label}
                            hex={c.hex}
                            onClick={() => setDotColorC(c.key)}
                            disabled={!dotNeedsC}
                          />
                        ))}
                      </div>
                      {!dotNeedsC && (
                        <div className="text-xs text-slate-500">
                          ABBC 패턴에서만 C 색상을 사용합니다.
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* 오른쪽: 4. 미리보기 */}
            <div className="space-y-3">
              <SectionTitle>4. 미리보기</SectionTitle>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <div className="text-xs text-slate-500 mb-3">
                  실제 전체가 아니라, 성능을 위해 최대 {maxPreviewTiles}×
                  {maxPreviewTiles} 범위만 표시됩니다. (스크롤 가능)
                </div>

                <div className="max-h-[460px] overflow-auto rounded-xl border border-slate-200 bg-white p-3">
                  {/* 버디 미리보기 */}
                  {productType === "buddy" && (
                    <div
                      className="inline-grid"
                      style={{
                        gridTemplateColumns: `repeat(${previewBuddyX}, ${buddyPx}px)`,
                        gridAutoRows: `${buddyPx}px`,
                        gap: 0,
                      }}
                    >
                      {Array.from({
                        length: previewBuddyX * previewBuddyY,
                      }).map((_, i) => (
                        <div
                          key={i}
                          className="border"
                          style={{
                            backgroundColor: colorMap[buddyColor],
                            // 라이트그레이 타일과 겹쳐도 “칸”이 보이도록 진한 윤곽선
                            borderColor: "#64748B",
                          }}
                        />
                      ))}
                    </div>
                  )}

                  {/* 도트 미리보기 */}
                  {productType === "dot" && (
                    <div
                      className="inline-grid"
                      style={{
                        gridTemplateColumns: `repeat(${previewDotX}, ${dotPx}px)`,
                        gridAutoRows: `${dotPx}px`,
                        gap: 0,
                      }}
                    >
                      {Array.from({ length: previewDotX * previewDotY }).map(
                        (_, idx) => {
                          const x = idx % previewDotX;
                          const y = Math.floor(idx / previewDotX);

                          // 2×2 반복 패턴 인덱스
                          const patternIndex = (y % 2) * 2 + (x % 2);
                          const symbol = dotPatternCells[dotPattern][patternIndex];

                          return (
                            <div
                              key={idx}
                              className="border"
                              style={{
                                backgroundColor: getDotColorHex(symbol),
                                borderColor: "#94A3B8",
                              }}
                            />
                          );
                        }
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* 5. 수량 & 박스 계산 */}
        <Card>
          <SectionTitle>5. 수량 &amp; 박스 계산</SectionTitle>

          {productType === "buddy" && (
            <div className="mt-4 space-y-2">
              <div className="text-lg font-black">
                필요 개수:{" "}
                <span className="text-2xl font-black text-emerald-700">
                  {buddyNeeded}
                </span>{" "}
                <span className="text-sm font-semibold text-slate-500">
                  ({buddyX} × {buddyY})
                </span>
              </div>

              <div className="mt-3 text-sm font-semibold text-slate-700">
                포장 구성 (36p / 9p / 2p)
              </div>
              <div className="text-sm">36p: {buddyPack.packCounts[36] || 0} 박스</div>
              <div className="text-sm">9p: {buddyPack.packCounts[9] || 0} 박스</div>
              <div className="text-sm">2p: {buddyPack.packCounts[2] || 0} 박스</div>

              <div className="mt-3 text-sm">
                총 개수: <b className="text-slate-900">{buddyPack.totalPieces}</b> 장
              </div>
              <div className="text-sm">
                남는 수량: <b className="text-slate-900">{buddyPack.leftover}</b> 장
              </div>
            </div>
          )}

          {productType === "dot" && (
            <div className="mt-4 space-y-2">
              <div className="text-lg font-black">
                필요 개수:{" "}
                <span className="text-2xl font-black text-emerald-700">
                  {dotNeeded}
                </span>{" "}
                <span className="text-sm font-semibold text-slate-500">
                  ({dotX} × {dotY})
                </span>
              </div>

              <div className="mt-3 text-sm font-semibold text-slate-700">
                포장 구성 (120p / 40p)
              </div>
              <div className="text-sm">120p: {dotPack.packCounts[120] || 0} 박스</div>
              <div className="text-sm">40p: {dotPack.packCounts[40] || 0} 박스</div>

              <div className="mt-3 text-sm">
                총 개수: <b className="text-slate-900">{dotPack.totalPieces}</b> 개
              </div>
              <div className="text-sm">
                남는 수량: <b className="text-slate-900">{dotPack.leftover}</b> 개
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
