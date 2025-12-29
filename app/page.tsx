'use client';

import { useState } from 'react';

/* =========================================================
   타입 정의
========================================================= */
type ProductType = 'buddy' | 'dot';
type BuddyColor = 'ivory' | 'lightgray' | 'beige' | 'butter';
type DotColorKey = BuddyColor;
type DotPattern = 'AAAA' | 'ABBA' | 'ABBC';

/* =========================================================
   색상 옵션 (라이트그레이 밝게 조정)
========================================================= */
const COLOR_MAP = {
  ivory: '#FDF8EE',
  lightgray: '#E5E7EB', // 🔥 더 밝게
  beige: '#EBD9B4',
  butter: '#FFE9A7',
};

const BORDER_COLOR = '#9CA3AF'; // 🔥 윤곽선 더 어둡게

const buddyColors = [
  { key: 'ivory', label: '아이보리' },
  { key: 'lightgray', label: '라이트그레이' },
  { key: 'beige', label: '베이지' },
  { key: 'butter', label: '버터' },
] as const;

/* =========================================================
   도트 패턴
========================================================= */
const dotPatternCells: Record<DotPattern, ('A' | 'B' | 'C')[]> = {
  AAAA: ['A', 'A', 'A', 'A'],
  ABBA: ['A', 'B', 'B', 'A'],
  ABBC: ['A', 'B', 'B', 'C'],
};

/* =========================================================
   박스 계산
========================================================= */
function calcPacks(total: number, sizes: number[]) {
  const sorted = [...sizes].sort((a, b) => b - a);
  const result: Record<number, number> = {};
  let remain = total;

  for (const s of sorted) {
    const c = Math.floor(remain / s);
    result[s] = c;
    remain -= c * s;
  }

  if (remain > 0) result[sorted.at(-1)!]++;

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
  const [product, setProduct] = useState<ProductType>('buddy');
  const [width, setWidth] = useState(400);
  const [height, setHeight] = useState(300);

  const [buddyColor, setBuddyColor] = useState<BuddyColor>('ivory');

  const [pattern, setPattern] = useState<DotPattern>('AAAA');
  const [colorA, setColorA] = useState<DotColorKey>('ivory');
  const [colorB, setColorB] = useState<DotColorKey>('butter');
  const [colorC, setColorC] = useState<DotColorKey>('beige');

  const tileSize = product === 'buddy' ? 30 : 10;
  const tilesX = Math.ceil(width / tileSize);
  const tilesY = Math.ceil(height / tileSize);
  const needed = tilesX * tilesY;

  const pack =
    product === 'buddy'
      ? calcPacks(needed, [36, 9, 2])
      : calcPacks(needed, [120, 40]);

  /* =========================================================
     렌더
  ========================================================= */
  return (
    <div className="min-h-screen bg-white px-3 py-4 text-slate-900">
      <div className="max-w-6xl mx-auto space-y-6">

        {/* ================= 미리보기 (상단 고정) ================= */}
        <div className="sticky top-0 z-20 bg-white pb-3">
          <h2 className="text-lg font-bold mb-2">미리보기</h2>

          <div
            className="inline-grid"
            style={{
              gridTemplateColumns: `repeat(${tilesX}, ${product === 'buddy' ? 16 : 8}px)`,
            }}
          >
            {Array.from({ length: tilesX * tilesY }).map((_, i) => {
              let bg = COLOR_MAP[buddyColor];

              if (product === 'dot') {
                const x = i % tilesX;
                const y = Math.floor(i / tilesX);
                const idx = (y % 2) * 2 + (x % 2);
                const key = dotPatternCells[pattern][idx];
                bg =
                  key === 'A'
                    ? COLOR_MAP[colorA]
                    : key === 'B'
                    ? COLOR_MAP[colorB]
                    : COLOR_MAP[colorC];
              }

              return (
                <div
                  key={i}
                  style={{
                    width: product === 'buddy' ? 16 : 8,
                    height: product === 'buddy' ? 16 : 8,
                    backgroundColor: bg,
                    border: `0.5px solid ${BORDER_COLOR}`, // 🔥 얇은 윤곽선
                  }}
                />
              );
            })}
          </div>
        </div>

        {/* ================= 옵션 ================= */}
        <section className="space-y-4">

          {/* 공간 입력 */}
          <div>
            <div className="font-semibold mb-1">공간 크기 (cm)</div>
            <div className="flex gap-2">
              <input
                type="number"
                value={width}
                onChange={(e) => setWidth(+e.target.value)}
                className="border rounded px-2 py-1 w-full text-sm"
                placeholder="가로"
              />
              <input
                type="number"
                value={height}
                onChange={(e) => setHeight(+e.target.value)}
                className="border rounded px-2 py-1 w-full text-sm"
                placeholder="세로"
              />
            </div>
          </div>

          {/* 타일 종류 */}
          <div className="flex gap-2">
            {['buddy', 'dot'].map((t) => (
              <button
                key={t}
                onClick={() => setProduct(t as ProductType)}
                className={`flex-1 border rounded py-1 text-sm ${
                  product === t ? 'border-emerald-500 bg-emerald-50' : ''
                }`}
              >
                {t === 'buddy' ? '버디 데크타일' : '도트 데크타일'}
              </button>
            ))}
          </div>

          {/* 색상 / 패턴 */}
          {product === 'buddy' && (
            <div className="grid grid-cols-4 gap-2">
              {buddyColors.map((c) => (
                <button
                  key={c.key}
                  onClick={() => setBuddyColor(c.key)}
                  className={`border rounded p-1 text-xs ${
                    buddyColor === c.key ? 'border-emerald-500' : ''
                  }`}
                >
                  <div
                    className="h-6 mb-1"
                    style={{ backgroundColor: COLOR_MAP[c.key] }}
                  />
                  {c.label}
                </button>
              ))}
            </div>
          )}

          {product === 'dot' && (
            <>
              <div className="grid grid-cols-3 gap-2">
                {(Object.keys(dotPatternCells) as DotPattern[]).map((p) => (
                  <button
                    key={p}
                    onClick={() => setPattern(p)}
                    className={`border rounded p-1 text-xs ${
                      pattern === p ? 'border-emerald-500' : ''
                    }`}
                  >
                    <div className="grid grid-cols-2">
                      {dotPatternCells[p].map((s, i) => (
                        <div
                          key={i}
                          className="w-4 h-4"
                          style={{
                            backgroundColor:
                              s === 'A'
                                ? COLOR_MAP[colorA]
                                : s === 'B'
                                ? COLOR_MAP[colorB]
                                : COLOR_MAP[colorC],
                            border: `0.5px solid ${BORDER_COLOR}`,
                          }}
                        />
                      ))}
                    </div>
                    {p}
                  </button>
                ))}
              </div>
            </>
          )}
        </section>

        {/* ================= 결과 ================= */}
        <section className="border rounded p-4">
          <div className="text-lg font-bold mb-2">
            필요 개수: <span className="text-2xl">{needed}</span>
          </div>

          {Object.entries(pack.result).map(([k, v]) => (
            <div key={k}>
              {k}p : <b>{v}</b>
            </div>
          ))}

          <div className="mt-1 text-sm text-slate-500">
            남는 수량: {pack.leftover}
          </div>
        </section>
      </div>
    </div>
  );
}
