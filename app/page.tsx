'use client';

import { useState } from 'react';

/* ======================================================
   타입
====================================================== */
type ProductType = 'buddy' | 'dot';
type DotPattern = 'AAAA' | 'ABBA' | 'ABBC';
type ColorKey = 'ivory' | 'lightgray' | 'beige' | 'butter';

/* ======================================================
   색상 정의
====================================================== */
const COLORS: { key: ColorKey; label: string; hex: string }[] = [
  { key: 'ivory', label: '아이보리', hex: '#FDF8EE' },
  { key: 'lightgray', label: '라이트그레이', hex: '#D4D4D8' },
  { key: 'beige', label: '베이지', hex: '#EBD9B4' },
  { key: 'butter', label: '버터', hex: '#FFE9A7' },
];

/* ======================================================
   도트 패턴 셀 (2x2 고정)
====================================================== */
const DOT_PATTERN: Record<DotPattern, ('A' | 'B' | 'C')[]> = {
  AAAA: ['A', 'A', 'A', 'A'],
  ABBA: ['A', 'B', 'B', 'A'],
  ABBC: ['A', 'B', 'B', 'C'],
};

/* ======================================================
   박스 계산
====================================================== */
function calcBoxes(need: number, sizes: number[]) {
  let remain = need;
  const result: Record<number, number> = {};

  for (const size of sizes) {
    result[size] = Math.floor(remain / size);
    remain -= result[size] * size;
  }

  if (remain > 0) {
    const smallest = sizes[sizes.length - 1];
    result[smallest] += 1;
    remain = 0;
  }

  const total = sizes.reduce(
    (sum, s) => sum + s * (result[s] || 0),
    0
  );

  return { result, total, leftover: total - need };
}

/* ======================================================
   페이지
====================================================== */
export default function Page() {
  const [type, setType] = useState<ProductType>('dot');

  const [width, setWidth] = useState(300);
  const [height, setHeight] = useState(300);

  const [pattern, setPattern] = useState<DotPattern>('ABBA');
  const [colorA, setColorA] = useState<ColorKey>('ivory');
  const [colorB, setColorB] = useState<ColorKey>('beige');
  const [colorC, setColorC] = useState<ColorKey>('ivory');

  /* ================= 계산 ================= */
  const tileSize = type === 'dot' ? 10 : 30;
  const xCount = Math.ceil(width / tileSize);
  const yCount = Math.ceil(height / tileSize);
  const needCount = xCount * yCount;

  const boxes =
    type === 'dot'
      ? calcBoxes(needCount, [120, 40])
      : calcBoxes(needCount, [36, 9, 2]);

  /* ================= 색상 맵 ================= */
  const colorMap = Object.fromEntries(
    COLORS.map(c => [c.key, c.hex])
  ) as Record<ColorKey, string>;

  /* ================= 미리보기 셀 ================= */
  const renderDotColor = (i: number) => {
    const x = i % xCount;
    const y = Math.floor(i / xCount);
    const idx = (y % 2) * 2 + (x % 2);
    const symbol = DOT_PATTERN[pattern][idx];

    if (symbol === 'A') return colorMap[colorA];
    if (symbol === 'B') return colorMap[colorB];
    return colorMap[colorC];
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-6xl mx-auto space-y-10">

        {/* ================= 제목 ================= */}
        <h1 className="text-3xl font-black text-emerald-700">
          ALIVES 타일 계산기
        </h1>

        {/* ================= 타일 종류 ================= */}
        <section className="border rounded-xl p-5">
          <h2 className="font-bold mb-3">1. 데크타일 종류</h2>
          <div className="grid grid-cols-2 gap-4">
            {(['buddy', 'dot'] as ProductType[]).map(t => (
              <button
                key={t}
                onClick={() => setType(t)}
                className={`border rounded-xl p-4 ${
                  type === t
                    ? 'border-emerald-500 bg-emerald-50'
                    : ''
                }`}
              >
                <b>{t === 'buddy' ? '버디' : '도트'} 데크타일</b>
                <div className="text-sm text-slate-500">
                  {t === 'buddy' ? '30×30cm' : '10×10cm / 패턴'}
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* ================= 사이즈 ================= */}
        <section className="border rounded-xl p-5">
          <h2 className="font-bold mb-3">2. 공간 크기 (cm)</h2>
          <div className="flex gap-4">
            <input
              type="number"
              value={width}
              onChange={e => setWidth(+e.target.value)}
              className="border rounded px-3 py-2 w-full"
              placeholder="가로"
            />
            <input
              type="number"
              value={height}
              onChange={e => setHeight(+e.target.value)}
              className="border rounded px-3 py-2 w-full"
              placeholder="세로"
            />
          </div>
        </section>

        {/* ================= 도트 옵션 ================= */}
        {type === 'dot' && (
          <section className="border rounded-xl p-5 space-y-6">
            <h2 className="font-bold">3. 도트 패턴 & 색상</h2>

            {/* 패턴 */}
            <div className="grid grid-cols-3 gap-4">
              {(Object.keys(DOT_PATTERN) as DotPattern[]).map(p => (
                <button
                  key={p}
                  onClick={() => setPattern(p)}
                  className={`border rounded-xl p-3 ${
                    pattern === p ? 'border-emerald-500 bg-emerald-50' : ''
                  }`}
                >
                  <div className="grid grid-cols-2 gap-0">
                    {DOT_PATTERN[p].map((s, i) => (
                      <div
                        key={i}
                        className="w-10 h-10 border"
                        style={{
                          backgroundColor:
                            s === 'A'
                              ? colorMap[colorA]
                              : s === 'B'
                              ? colorMap[colorB]
                              : colorMap[colorC],
                        }}
                      />
                    ))}
                  </div>
                  <div className="mt-2 font-semibold">{p}</div>
                </button>
              ))}
            </div>

            {/* 색상 선택 */}
            {(['A', 'B', 'C'] as const).map(k => (
              <div key={k}>
                <h3 className="font-bold mb-2">색상 {k}</h3>
                <div className="grid grid-cols-4 gap-3">
                  {COLORS.map(c => {
                    const selected =
                      (k === 'A' && colorA === c.key) ||
                      (k === 'B' && colorB === c.key) ||
                      (k === 'C' && colorC === c.key);

                    return (
                      <button
                        key={c.key}
                        onClick={() =>
                          k === 'A'
                            ? setColorA(c.key)
                            : k === 'B'
                            ? setColorB(c.key)
                            : setColorC(c.key)
                        }
                        className={`border rounded-xl p-2 ${
                          selected
                            ? 'border-emerald-500 bg-emerald-50'
                            : ''
                        }`}
                      >
                        <div
                          className="h-8 rounded"
                          style={{ backgroundColor: c.hex }}
                        />
                        <div className="text-sm mt-1">{c.label}</div>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </section>
        )}

        {/* ================= 미리보기 ================= */}
        <section className="border rounded-xl p-5">
          <h2 className="font-bold mb-3">4. 미리보기</h2>
          <div
            className="inline-grid"
            style={{
              gridTemplateColumns: `repeat(${xCount}, 12px)`,
            }}
          >
            {Array.from({ length: xCount * yCount }).map((_, i) => (
              <div
                key={i}
                className="border border-slate-400"
                style={{
                  backgroundColor:
                    type === 'buddy'
                      ? colorMap[colorA]
                      : renderDotColor(i),
                }}
              />
            ))}
          </div>
        </section>

        {/* ================= 결과 ================= */}
        <section className="border rounded-xl p-6 text-lg">
          <h2 className="font-bold mb-4 text-xl">5. 필요 개수</h2>
          <div className="text-2xl font-black mb-3">
            필요 수량: {needCount}
          </div>
          {Object.entries(boxes.result).map(([k, v]) => (
            <div key={k}>{k}p: {v} 박스</div>
          ))}
          <div className="mt-2">
            남는 수량: {boxes.leftover}
          </div>
        </section>

      </div>
    </div>
  );
}
