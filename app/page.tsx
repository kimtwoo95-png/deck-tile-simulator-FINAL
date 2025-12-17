"use client";

import { useState } from "react";

/* --------------------------------------------
   타입 정의
-------------------------------------------- */
type ProductType = "buddy" | "dot";

type BuddyColor = "ivory" | "lightgray" | "beige" | "butter";

type DotColorKey =
  | "creamWhite"
  | "brickBrown"
  | "butter"
  | "mint"
  | "softBlue"
  | "deepGreen";

type DotPattern = "AAAA" | "ABBA" | "ABBC";

/* --------------------------------------------
   버디 색상
-------------------------------------------- */
const buddyColorOptions: { key: BuddyColor; label: string; color: string }[] = [
  { key: "ivory", label: "아이보리", color: "#FDF8EE" },
  { key: "lightgray", label: "라이트그레이", color: "#D4D4D8" },
  { key: "beige", label: "베이지", color: "#EBD9B4" },
  { key: "butter", label: "버터", color: "#FFE9A7" },
];

/* --------------------------------------------
   도트 색상
-------------------------------------------- */
const dotColorOptions: { key: DotColorKey; label: string; color: string }[] = [
  { key: "creamWhite", label: "크림 화이트", color: "#FDFBF5" },
  { key: "brickBrown", label: "브릭브라운", color: "#8B5A3C" },
  { key: "butter", label: "버터", color: "#FFE9A7" },
  { key: "mint", label: "민트", color: "#B9E6D3" },
  { key: "softBlue", label: "소프트 블루", color: "#C7E0FF" },
  { key: "deepGreen", label: "딥그린", color: "#29544B" },
];

/* --------------------------------------------
   도트 패턴 (2×2 구조)
-------------------------------------------- */
const dotPatternCells: Record<DotPattern, ("A" | "B" | "C")[]> = {
  AAAA: ["A", "A", "A", "A"],
  ABBA: ["A", "B", "B", "A"],
  ABBC: ["A", "B", "B", "C"],
};

/* --------------------------------------------
   박스 계산 함수
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
    remaining = 0;
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

/* --------------------------------------------
   메인 컴포넌트
-------------------------------------------- */
export default function Page() {
  const [productType, setProductType] = useState<ProductType>("buddy");

  const [widthCm, setWidthCm] = useState(300);
  const [heightCm, setHeightCm] = useState(300);

  const [buddyColor, setBuddyColor] = useState<BuddyColor>("ivory");

  const [dotPattern, setDotPattern] = useState<DotPattern>("AAAA");
  const [dotColorA, setDotColorA] = useState<DotColorKey>("creamWhite");
  const [dotColorB, setDotColorB] = useState<DotColorKey>("deepGreen");
  const [dotColorC, setDotColorC] = useState<DotColorKey>("mint");

  // 미리보기 최대 타일 수(성능 보호)
  const maxPreviewTiles = 40;

  /* --------------------------------------------
     버디 계산 (30×30cm)
  -------------------------------------------- */
  const buddyX = Math.ceil(widthCm / 30);
  const buddyY = Math.ceil(heightCm / 30);
  const buddyNeeded = buddyX * buddyY;
  const buddyPack = calcPacks(buddyNeeded, [36, 9, 2]);

  /* --------------------------------------------
     도트 계산 (10×10cm)
  -------------------------------------------- */
  const dotX = Math.ceil(widthCm / 10);
  const dotY = Math.ceil(heightCm / 10);
  const dotNeeded = dotX * dotY;
  const dotPack = calcPacks(dotNeeded, [120, 40]);

  const previewBuddyX = Math.min(buddyX, maxPreviewTiles);
  const previewBuddyY = Math.min(buddyY, maxPreviewTiles);

  const previewDotX = Math.min(dotX, maxPreviewTiles);
  const previewDotY = Math.min(dotY, maxPreviewTiles);

  /* --------------------------------------------
     도트 색상 가져오기
  -------------------------------------------- */
  const colorMap: Record<DotColorKey, string> = Object.fromEntries(
    dotColorOptions.map((c) => [c.key, c.color])
  ) as Record<DotColorKey, string>;

  const getDotColor = (symbol: "A" | "B" | "C") =>
    symbol === "A"
      ? colorMap[dotColorA]
      : symbol === "B"
      ? colorMap[dotColorB]
      : colorMap[dotColorC];

  /* --------------------------------------------
     UI 구성
  -------------------------------------------- */
  return (
    <div className="min-h-screen bg-white px-4 py-6 text-slate-900">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* 브랜드 타이틀 */}
        <h1 className="text-3xl font-black tracking-tight text-emerald-700">
          ALIVES 타일 계산기
        </h1>

        {/* --------------------------------------------
           1. 데크타일 종류
        -------------------------------------------- */}
        <section className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
          <h2 className="text-lg font-semibold mb-3">1. 데크타일 종류 선택</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* 버디 */}
            <button
              onClick={() => setProductType("buddy")}
              className={`border rounded-xl p-4 text-left transition ${
                productType === "buddy"
                  ? "border-emerald-500 bg-emerald-50"
                  : "border-slate-300 hover:border-emerald-300"
              }`}
            >
              <div className="font-bold text-base">버디 데크타일</div>
              <div className="text-xs text-slate-500">30 × 30 cm / 4색상</div>
            </button>

            {/* 도트 */}
            <button
              onClick={() => setProductType("dot")}
              className={`border rounded-xl p-4 text-left transition ${
                productType === "dot"
                  ? "border-emerald-500 bg-emerald-50"
                  : "border-slate-300 hover:border-emerald-300"
              }`}
            >
              <div className="font-bold text-base">도트 데크타일</div>
              <div className="text-xs text-slate-500">
                10 × 10 cm / 6색상 / 패턴 AAAA·ABBA·ABBC
              </div>
            </button>
          </div>
        </section>

        {/* --------------------------------------------
           2. 공간 입력 + 타입별 옵션
        -------------------------------------------- */}
        <section className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
          <div className="grid md:grid-cols-[1fr_1.2fr] gap-6">
            {/* 왼쪽 입력 */}
            <div className="space-y-6">
              {/* 공간 입력 */}
              <div>
                <h2 className="text-lg font-semibold mb-3">
                  2. 공간 사이즈 입력 (cm)
                </h2>

                <div className="flex gap-3">
                  <input
                    type="number"
                    value={widthCm}
                    onChange={(e) => setWidthCm(Number(e.target.value))}
                    className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-400"
                    placeholder="가로(cm)"
                  />
                  <input
                    type="number"
                    value={heightCm}
                    onChange={(e) => setHeightCm(Number(e.target.value))}
                    className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-400"
                    placeholder="세로(cm)"
                  />
                </div>
              </div>

              {/* ---------------------- 버디 옵션 ---------------------- */}
              {productType === "buddy" && (
                <div>
                  <h2 className="text-lg font-semibold mb-3">
                    3. 버디 색상 선택
                  </h2>

                  <div className="grid grid-cols-2 gap-3">
                    {buddyColorOptions.map((c) => (
                      <button
                        key={c.key}
                        onClick={() => setBuddyColor(c.key)}
                        className={`border rounded-xl p-3 flex gap-3 items-center transition ${
                          buddyColor === c.key
                            ? "border-emerald-500 bg-emerald-50"
                            : "border-slate-300 hover:border-emerald-300"
                        }`}
                      >
                        <div
                          className="w-8 h-8 rounded-md border border-slate-400"
                          style={{ backgroundColor: c.color }}
                        />
                        <span className="text-sm">{c.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* ---------------------- 도트 옵션 ---------------------- */}
              {productType === "dot" && (
                <div className="space-y-6">
                  <h2 className="text-lg font-semibold">
                    3. 도트 패턴 & 색상 선택
                  </h2>

                  {/* 패턴 선택 */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {(["AAAA", "ABBA", "ABBC"] as DotPattern[]).map(
                      (pattern) => (
                        <button
                          key={pattern}
                          onClick={() => setDotPattern(pattern)}
                          className={`border rounded-xl p-4 flex flex-col items-center transition ${
                            dotPattern === pattern
                              ? "border-emerald-500 bg-emerald-50"
                              : "border-slate-300 hover:border-emerald-300"
                          }`}
                        >
                          {/* 2×2 패턴 미리보기 */}
                          <div className="grid grid-cols-2 gap-0">
                            {dotPatternCells[pattern].map((symbol, i) => (
                              <div
                                key={i}
                                className="w-10 h-10 border border-slate-400"
                                style={{
                                  backgroundColor: getDotColor(symbol),
                                }}
                              ></div>
                            ))}
                          </div>

                          <span className="text-xs mt-2 font-semibold">
                            {pattern}
                          </span>
                        </button>
                      )
                    )}
                  </div>

                  {/* 색상 슬롯 */}
                  <div className="space-y-2 text-sm">
                    {/* A */}
                    <div className="flex gap-2 items-center">
                      <span className="font-bold">A</span>
                      <div className="flex flex-wrap gap-2">
                        {dotColorOptions.map((c) => (
                          <button
                            key={c.key + "-A"}
                            onClick={() => setDotColorA(c.key)}
                            className={`border rounded-full px-2 py-1 text-xs flex items-center gap-1 transition ${
                              dotColorA === c.key
                                ? "border-emerald-500 bg-emerald-50"
                                : "border-slate-300 hover:border-emerald-300"
                            }`}
                          >
                            <span
                              className="w-3 h-3 rounded-full border border-slate-400"
                              style={{ backgroundColor: c.color }}
                            />
                            {c.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* B */}
                    {dotPattern !== "AAAA" && (
                      <div className="flex gap-2 items-center">
                        <span className="font-bold">B</span>
                        <div className="flex flex-wrap gap-2">
                          {dotColorOptions.map((c) => (
                            <button
                              key={c.key + "-B"}
                              onClick={() => setDotColorB(c.key)}
                              className={`border rounded-full px-2 py-1 text-xs flex items-center gap-1 transition ${
                                dotColorB === c.key
                                  ? "border-emerald-500 bg-emerald-50"
                                  : "border-slate-300 hover:border-emerald-300"
                              }`}
                            >
                              <span
                                className="w-3 h-3 rounded-full border border-slate-400"
                                style={{ backgroundColor: c.color }}
                              />
                              {c.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* C */}
                    {dotPattern === "ABBC" && (
                      <div className="flex gap-2 items-center">
                        <span className="font-bold">C</span>
                        <div className="flex flex-wrap gap-2">
                          {dotColorOptions.map((c) => (
                            <button
                              key={c.key + "-C"}
                              onClick={() => setDotColorC(c.key)}
                              className={`border rounded-full px-2 py-1 text-xs flex items-center gap-1 transition ${
                                dotColorC === c.key
                                  ? "border-emerald-500 bg-emerald-50"
                                  : "border-slate-300 hover:border-emerald-300"
                              }`}
                            >
                              <span
                                className="w-3 h-3 rounded-full border border-slate-400"
                                style={{ backgroundColor: c.color }}
                              />
                              {c.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* --------------------------------------------
               오른쪽: 미리보기
            -------------------------------------------- */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold mb-2">4. 미리보기</h2>

              <div className="border border-slate-300 rounded-xl bg-slate-50 p-3 max-h-[420px] overflow-auto">
                {/* 버디 */}
                {productType === "buddy" && (
                  <div
                    className="inline-grid"
                    style={{
                      gridTemplateColumns: `repeat(${previewBuddyX}, 20px)`,
                      gridAutoRows: "20px",
                    }}
                  >
                    {Array.from({
                      length: previewBuddyX * previewBuddyY,
                    }).map((_, i) => (
                      <div
                        key={i}
                        className="border border-slate-500"
                        style={{
                          backgroundColor: buddyColorOptions.find(
                            (b) => b.key === buddyColor
                          )?.color,
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
                    {Array.from({
                      length: previewDotX * previewDotY,
                    }).map((_, idx) => {
                      const x = idx % previewDotX;
                      const y = Math.floor(idx / previewDotX);
                      const patternIndex = (y % 2) * 2 + (x % 2);
                      const symbol = dotPatternCells[dotPattern][patternIndex];

                      return (
                        <div
                          key={idx}
                          className="border border-slate-400"
                          style={{ backgroundColor: getDotColor(symbol) }}
                        />
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* --------------------------------------------
           5. 결과 계산
        -------------------------------------------- */}
        <section className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
          <h2 className="text-lg font-semibold mb-3">5. 수량 & 박스 계산</h2>

          {/* 버디 */}
          {productType === "buddy" && (
            <div className="text-sm space-y-1">
              <div>
                필요한 장수:{" "}
                <span className="font-bold">{buddyNeeded}</span> (
                {buddyX} × {buddyY})
              </div>

              <div className="mt-2 font-medium">포장 구성 (36p / 9p / 2p)</div>
              <div>36p: {buddyPack.packCounts[36] || 0} 박스</div>
              <div>9p: {buddyPack.packCounts[9] || 0} 박스</div>
              <div>2p: {buddyPack.packCounts[2] || 0} 박스</div>

              <div className="mt-2">
                총 장수: <b>{buddyPack.totalPieces}</b> 장
              </div>
              <div>
                남는 장수: <b>{buddyPack.leftover}</b> 장
              </div>
            </div>
          )}

          {/* 도트 */}
          {productType === "dot" && (
            <div className="text-sm space-y-1">
              <div>
                필요한 1P: <b>{dotNeeded}</b> ({dotX} × {dotY})
              </div>

              <div className="mt-2 font-medium">포장 구성 (120p / 40p)</div>
              <div>120p: {dotPack.packCounts[120] || 0} 박스</div>
              <div>40p: {dotPack.packCounts[40] || 0} 박스</div>

              <div className="mt-2">
                총 개수: <b>{dotPack.totalPieces}</b> 개
              </div>
              <div>
                남는 수량: <b>{dotPack.leftover}</b> 개
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
