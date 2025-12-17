'use client';

import { useState } from 'react';

/* =====================================================
   타입
===================================================== */
type TileType = 'dot' | 'buddy';
type DotPattern = 'AAAA' | 'ABBA' | 'ABBC';
type ColorKey = 'ivory' | 'lightgray' | 'beige' | 'butter';

/* =====================================================
   색상 정의 (4색)
===================================================== */
const COLORS: { key: ColorKey; label: string; hex: string }[] = [
  { key: 'ivory', label: '아이보리', hex: '#FDF8EE' },
  { key: 'lightgray', label: '라이트 그레이', hex: '#D4D4D8' },
  { key: 'beige', label: '베이지', hex: '#EBD9B4' },
  { key: 'butter', label: '버터', hex: '#FFE9A7' },
];

const PATTERNS: DotPattern[] = ['AAAA', 'ABBA', 'ABBC'];

const patternCells: Record<DotPattern, ('A' | 'B' | 'C')[]> = {
  AAAA: ['A', 'A', 'A', 'A'],
  ABBA: ['A', 'B', 'B', 'A'],
  ABBC: ['A', 'B', 'B', 'C'],
};

/* =====================================================
   박스 계산
===================================================== */
function calcPacks(total: number, packs: number[]) {
  const sorted = [...packs].sort((a, b) => b - a);
  let remain = total;
  const result: Record<number, number> = {};

  for (const size of sorted) {
    result[size] = Math.floor(remain / size);
    remain %= size;
  }

  if (remain > 0) result[sorted[sorted.length - 1]]++;

  const totalPieces = sorted.reduce(
    (sum, s) => sum + s * (result[s] || 0),
    0
  );

  return { result, totalPieces, leftover: totalPieces - total };
}

/* =====================================================
   페이지
===================================================== */
export default function Page() {
  const [tileType, setTileType] = useState<TileType>('dot');

  const [width, setWidth] = useState(300);
  const [height, setHeight] = useState(300);

  const [pattern, setPattern] = useState<DotPattern>('ABBA');

  const [colorA, setColorA] = useState<ColorKey>('ivory');
  const [colorB, setColorB] = useState<ColorKey>('butter');
  const [colorC, setColorC] = useState<ColorKey>('beige');

  const tileSize = tileType === 'dot' ? 10 : 30;
  const tilesX = Math.ceil(width / tileSize);
  const tilesY = Math.ceil(height / tileSize);
  const totalTiles = tilesX * tilesY;

  const packInfo =
    tileType === 'dot'
      ? calcPacks(totalTiles, [120, 40])
      : calcPacks(totalTiles, [36, 9, 2]);

  const colorMap = Object.fromEntries(
    COLORS.map((c) => [c.key, c.hex])
  ) as Record<ColorKey, string>;

  const getDotColor = (x: number, y: number) => {
    const idx = (y % 2) * 2 + (x % 2);
    const symbol = patternCells[pattern][idx];
    if (symbol === 'A') return colorMap[colorA];
    if (symbol === 'B') return colorMap[colorB];
    return colorMap[colorC];
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="max-w-6xl mx-auto space-y-10">

        <h1 className="text-3xl font-black text-emerald-700">
          ALIVES 타일 계산기
        </h1>

        {/* 1. 타일 종류 */}
        <section className="bg-white p-6 rounded-xl border">
          <h2 className="font-semibold mb-4">1. 타일 종류 선택</h2>
          <div className="grid grid-cols-2 gap-4">
            {(['buddy', 'dot'] as TileType[]).map((t) => (
              <button
                key={t}
                onClick={() => setTileType(t)}
                className={`p-4 rounded-xl border ${
                  tileType === t
                    ? 'border-emerald-500 bg-emerald-50'
                    : 'hover:border-emerald-300'
                }`}
              >
                <div className="font-bold">
                  {t === 'buddy' ? '버디 데크타일' : '도트 데크타일'}
                </div>
                <div className="text-xs text-slate-500">
                  {t === 'buddy' ? '30 × 30 cm' : '10 × 10 cm'}
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* 2. 공간 크기 */}
        <section className="bg-white p-6 rounded-xl border">
          <h2 className="font-semibold mb-4">2. 공간 크기 (cm)</h2>
          <div className="flex gap-4">
            <input
              type="number"
              value={width}
              onChange={(e) => setWidth(+e.target.value)}
              className="border rounded px-3 py-2 w-full"
              placeholder="가로"
            />
            <input
              type="number"
              value={height}
              onChange={(e) => setHeight(+e.target.value)}
              className="border rounded px-3 py-2 w-full"
              placeholder="세로"
            />
          </div>
        </section>

        {/* 3. 색상 & 패턴 */}
        <section className="bg-white p-6 rounded-xl border space-y-6">
          {tileType === 'dot' && (
            <>
              <div>
                <h2 className="font-semibold mb-2">3. 도트 패턴 선택</h2>
                <div className="grid grid-cols-3 gap-4">
                  {PATTERNS.map((p) => (
                    <button
                      key={p}
                      onClick={() => setPattern(p)}
                      className={`p-4 border rounded-xl ${
                        pattern === p
                          ? 'border-emerald-500 bg-emerald-50'
                          : ''
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              {(['A', 'B', 'C'] as const).map((k) => (
                <div key={k}>
                  <div className="font-semibold mb-2">{k} 색상</div>
                  <div className="flex gap-3">
                    {COLORS.map((c) => (
                      <button
                        key={c.key + k}
                        onClick={() =>
                          k === 'A'
                            ? setColorA(c.key)
                            : k === 'B'
                            ? setColorB(c.key)
                            : setColorC(c.key)
                        }
                        className="w-10 h-10 rounded border"
                        style={{ backgroundColor: c.hex }}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </>
          )}
        </section>

        {/* 4. 미리보기 */}
        <section className="bg-white p-6 rounded-xl border">
          <h2 className="font-semibold mb-4">4. 타일 배치 미리보기</h2>

          <div
            className="inline-grid"
            style={{
              gridTemplateColumns: `repeat(${Math.min(tilesX, 40)}, ${
                tileType === 'dot' ? 10 : 20
              }px)`,
            }}
          >
            {Array.from({
              length: Math.min(tilesX, 40) * Math.min(tilesY, 40),
            }).map((_, i) => {
              const x = i % Math.min(tilesX, 40);
              const y = Math.floor(i / Math.min(tilesX, 40));

              return (
                <div
                  key={i}
                  className="border border-slate-300"
                  style={{
                    backgroundColor:
                      tileType === 'dot'
                        ? getDotColor(x, y)
                        : colorMap[colorA],
                  }}
                />
              );
            })}
          </div>
        </section>

        {/* 5. 계산 결과 */}
        <section className="bg-white p-6 rounded-xl border text-sm space-y-1">
          <h2 className="font-semibold mb-2">5. 수량 & 박스 계산</h2>
          <div>필요 수량: {totalTiles}</div>
          {Object.entries(packInfo.result).map(([k, v]) => (
            <div key={k}>
              {k}p: {v} 박스
            </div>
          ))}
          <div>남는 수량: {packInfo.leftover}</div>
        </section>
      </div>
    </div>
  );
}
