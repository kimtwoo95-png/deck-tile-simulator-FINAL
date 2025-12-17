'use client';

import { useState } from 'react';

/* =====================================================
   타입
===================================================== */
type TileType = 'buddy' | 'dot';
type DotPattern = 'AAAA' | 'ABBA' | 'ABBC';
type ColorKey = 'ivory' | 'lightgray' | 'beige' | 'butter';

/* =====================================================
   색상 정의
===================================================== */
const COLORS: { key: ColorKey; label: string; hex: string }[] = [
  { key: 'ivory', label: '아이보리', hex: '#FDF8EE' },
  { key: 'lightgray', label: '라이트 그레이', hex: '#D4D4D8' },
  { key: 'beige', label: '베이지', hex: '#EBD9B4' },
  { key: 'butter', label: '버터', hex: '#FFE9A7' },
];

const DOT_PATTERNS: Record<DotPattern, ('A' | 'B' | 'C')[]> = {
  AAAA: ['A', 'A', 'A', 'A'],
  ABBA: ['A', 'B', 'B', 'A'],
  ABBC: ['A', 'B', 'B', 'C'],
};

/* =====================================================
   박스 계산
===================================================== */
function calcPacks(total: number, packs: number[]) {
  const result: Record<number, number> = {};
  let remain = total;

  packs.forEach((size) => {
    result[size] = Math.floor(remain / size);
    remain -= result[size] * size;
  });

  if (remain > 0) {
    result[packs[packs.length - 1]] += 1;
  }

  const totalPieces = packs.reduce(
    (s, p) => s + p * (result[p] || 0),
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

  const [buddyColor, setBuddyColor] = useState<ColorKey>('ivory');

  const [pattern, setPattern] = useState<DotPattern>('ABBA');
  const [colorA, setColorA] = useState<ColorKey>('ivory');
  const [colorB, setColorB] = useState<ColorKey>('butter');
  const [colorC, setColorC] = useState<ColorKey>('beige');

  /* 계산 */
  const tileSize = tileType === 'buddy' ? 30 : 10;
  const x = Math.ceil(width / tileSize);
  const y = Math.ceil(height / tileSize);
  const needed = x * y;

  const packs =
    tileType === 'buddy'
      ? calcPacks(needed, [36, 9, 2])
      : calcPacks(needed, [120, 40]);

  /* 미리보기 제한 */
  const PREVIEW_LIMIT = 40;
  const px = Math.min(x, PREVIEW_LIMIT);
  const py = Math.min(y, PREVIEW_LIMIT);
  const TILE_PX = tileType === 'buddy' ? 20 : 10;

  const colorMap = Object.fromEntries(
    COLORS.map((c) => [c.key, c.hex])
  );

  const getDotColor = (i: number) => {
    const cx = i % px;
    const cy = Math.floor(i / px);
    const idx = (cy % 2) * 2 + (cx % 2);
    const sym = DOT_PATTERNS[pattern][idx];
    if (sym === 'A') return colorMap[colorA];
    if (sym === 'B') return colorMap[colorB];
    return colorMap[colorC];
  };

  return (
    <div className="min-h-screen bg-white px-4 py-8 text-slate-900">
      <div className="max-w-6xl mx-auto space-y-10">
        <h1 className="text-3xl font-black text-emerald-700">
          ALIVES 타일 계산기
        </h1>

        {/* 공간 크기 */}
        <section className="border rounded-xl p-5 space-y-3">
          <h2 className="font-semibold">공간 크기 (cm)</h2>
          <div className="flex gap-3">
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

        {/* 타일 종류 */}
        <section className="border rounded-xl p-5">
          <h2 className="font-semibold mb-3">타일 종류</h2>
          <div className="grid grid-cols-2 gap-4">
            {(['buddy', 'dot'] as TileType[]).map((t) => (
              <button
                key={t}
                onClick={() => setTileType(t)}
                className={`border rounded-xl p-4 ${
                  tileType === t
                    ? 'border-emerald-500 bg-emerald-50'
                    : ''
                }`}
              >
                {t === 'buddy' ? '버디 데크타일' : '도트 데크타일'}
              </button>
            ))}
          </div>
        </section>

        {/* 옵션 */}
        <section className="border rounded-xl p-5 space-y-6">
          {tileType === 'buddy' && (
            <>
              <h2 className="font-semibold">버디 색상</h2>
              <div className="grid grid-cols-4 gap-3">
                {COLORS.map((c) => (
                  <button
                    key={c.key}
                    onClick={() => setBuddyColor(c.key)}
                    className={`border rounded-lg p-3 ${
                      buddyColor === c.key
                        ? 'border-emerald-500'
                        : ''
                    }`}
                  >
                    <div
                      className="h-8 rounded"
                      style={{ background: c.hex }}
                    />
                    <div className="text-xs mt-1">{c.label}</div>
                  </button>
                ))}
              </div>
            </>
          )}

          {tileType === 'dot' && (
            <>
              <h2 className="font-semibold">도트 패턴</h2>
              <div className="grid grid-cols-3 gap-4">
                {(Object.keys(DOT_PATTERNS) as DotPattern[]).map(
                  (p) => (
                    <button
                      key={p}
                      onClick={() => setPattern(p)}
                      className={`border rounded-xl p-3 ${
                        pattern === p
                          ? 'border-emerald-500 bg-emerald-50'
                          : ''
                      }`}
                    >
                      <div className="grid grid-cols-2">
                        {DOT_PATTERNS[p].map((s, i) => (
                          <div
                            key={i}
                            className="w-8 h-8 border"
                            style={{
                              background:
                                s === 'A'
                                  ? colorMap[colorA]
                                  : s === 'B'
                                  ? colorMap[colorB]
                                  : colorMap[colorC],
                            }}
                          />
                        ))}
                      </div>
                      <div className="text-xs mt-2">{p}</div>
                    </button>
                  )
                )}
              </div>

              {(['A', 'B', 'C'] as const).map((k) => (
                <div key={k}>
                  <div className="font-semibold mb-1">{k}</div>
                  <div className="grid grid-cols-4 gap-2">
                    {COLORS.map((c) => (
                      <button
                        key={c.key}
                        onClick={() =>
                          k === 'A'
                            ? setColorA(c.key)
                            : k === 'B'
                            ? setColorB(c.key)
                            : setColorC(c.key)
                        }
                        className="border rounded p-2"
                      >
                        <div
                          className="h-6 rounded"
                          style={{ background: c.hex }}
                        />
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </>
          )}
        </section>

        {/* 미리보기 */}
        <section className="border rounded-xl p-5">
          <h2 className="font-semibold mb-3">타일 배치 미리보기</h2>

          <div
            className="inline-grid"
            style={{
              gridTemplateColumns: `repeat(${px}, ${TILE_PX}px)`,
            }}
          >
            {Array.from({ length: px * py }).map((_, i) => (
              <div
                key={i}
                className="border border-slate-300"
                style={{
                  width: TILE_PX,
                  height: TILE_PX,
                  background:
                    tileType === 'buddy'
                      ? colorMap[buddyColor]
                      : getDotColor(i),
                }}
              />
            ))}
          </div>
        </section>

        {/* 결과 */}
        <section className="border rounded-xl p-5 text-sm space-y-1">
          <div>필요 수량: {needed}</div>
          {Object.entries(packs.result).map(([k, v]) => (
            <div key={k}>
              {k}p: {v}
            </div>
          ))}
          <div>남는 수량: {packs.leftover}</div>
        </section>
      </div>
    </div>
  );
}
