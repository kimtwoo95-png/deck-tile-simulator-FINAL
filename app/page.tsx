'use client';

import { useState } from 'react';

/* =====================================================
   타입
===================================================== */
type ProductType = 'buddy' | 'dot';
type BuddyColor = 'ivory' | 'lightgray' | 'beige' | 'butter';
type DotColor = BuddyColor;
type DotPattern = 'AAAA' | 'ABBA' | 'ABBC';

/* =====================================================
   색상 정의
===================================================== */
const COLORS: Record<BuddyColor, { label: string; hex: string }> = {
  ivory: { label: '아이보리', hex: '#FDF8EE' },
  lightgray: { label: '라이트그레이', hex: '#D4D4D8' },
  beige: { label: '베이지', hex: '#EBD9B4' },
  butter: { label: '버터', hex: '#FFE9A7' },
};

/* =====================================================
   도트 패턴 (2x2)
===================================================== */
const DOT_PATTERN: Record<DotPattern, ('A' | 'B' | 'C')[]> = {
  AAAA: ['A', 'A', 'A', 'A'],
  ABBA: ['A', 'B', 'B', 'A'],
  ABBC: ['A', 'B', 'B', 'C'],
};

/* =====================================================
   박스 계산
===================================================== */
function calcPacks(total: number, sizes: number[]) {
  const sorted = [...sizes].sort((a, b) => b - a);
  const result: Record<number, number> = {};
  let remain = total;

  for (const s of sorted) {
    result[s] = Math.floor(remain / s);
    remain -= result[s] * s;
  }

  if (remain > 0) result[sorted[sorted.length - 1]] += 1;

  const totalPieces = Object.entries(result).reduce(
    (sum, [k, v]) => sum + Number(k) * v,
    0
  );

  return {
    result,
    totalPieces,
    leftover: totalPieces - total,
  };
}

/* =====================================================
   페이지
===================================================== */
export default function Page() {
  const [width, setWidth] = useState(300);
  const [height, setHeight] = useState(300);
  const [product, setProduct] = useState<ProductType>('buddy');

  const [buddyColor, setBuddyColor] = useState<BuddyColor>('ivory');

  const [pattern, setPattern] = useState<DotPattern>('AAAA');
  const [colorA, setColorA] = useState<DotColor>('ivory');
  const [colorB, setColorB] = useState<DotColor>('beige');
  const [colorC, setColorC] = useState<DotColor>('butter');

  /* 계산 */
  const buddyX = Math.ceil(width / 30);
  const buddyY = Math.ceil(height / 30);
  const buddyNeed = buddyX * buddyY;
  const buddyPack = calcPacks(buddyNeed, [36, 9, 2]);

  const dotX = Math.ceil(width / 10);
  const dotY = Math.ceil(height / 10);
  const dotNeed = dotX * dotY;
  const dotPack = calcPacks(dotNeed, [120, 40]);

  const getDotColor = (s: 'A' | 'B' | 'C') =>
    s === 'A' ? COLORS[colorA].hex : s === 'B' ? COLORS[colorB].hex : COLORS[colorC].hex;

  /* =====================================================
     UI
  ===================================================== */
  return (
    <div className="min-h-screen bg-white px-4 py-10 text-slate-900">
      <div className="max-w-6xl mx-auto space-y-10">

        {/* 타이틀 */}
        <h1 className="text-3xl font-black text-emerald-700">
          ALIVES 타일 계산기
        </h1>

        {/* 1. 공간 크기 */}
        <section className="border rounded-xl p-5 space-y-3">
          <h2 className="font-semibold">1. 공간 크기 (cm)</h2>
          <div className="flex gap-3">
            <input
              type="number"
              value={width}
              onChange={(e) => setWidth(+e.target.value)}
              className="border rounded px-3 py-2 w-full"
              placeholder="가로(cm)"
            />
            <input
              type="number"
              value={height}
              onChange={(e) => setHeight(+e.target.value)}
              className="border rounded px-3 py-2 w-full"
              placeholder="세로(cm)"
            />
          </div>
        </section>

        {/* 2. 타일 종류 */}
        <section className="border rounded-xl p-5">
          <h2 className="font-semibold mb-3">2. 데크타일 종류</h2>
          <div className="grid grid-cols-2 gap-4">
            {(['buddy', 'dot'] as ProductType[]).map((t) => (
              <button
                key={t}
                onClick={() => setProduct(t)}
                className={`border rounded-xl p-4 text-left ${
                  product === t
                    ? 'border-emerald-500 bg-emerald-50'
                    : 'hover:border-emerald-300'
                }`}
              >
                <div className="font-bold">
                  {t === 'buddy' ? '버디 데크타일' : '도트 데크타일'}
                </div>
                <div className="text-xs text-slate-500">
                  {t === 'buddy' ? '30×30cm / 4색상' : '10×10cm / 패턴 AAAA·ABBA·ABBC'}
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* 3. 옵션 */}
        <section className="border rounded-xl p-5 space-y-6">
          {/* 버디 색상 */}
          {product === 'buddy' && (
            <>
              <h2 className="font-semibold">3. 버디 색상 선택</h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {(Object.keys(COLORS) as BuddyColor[]).map((c) => (
                  <button
                    key={c}
                    onClick={() => setBuddyColor(c)}
                    className={`border rounded-xl p-3 text-sm ${
                      buddyColor === c
                        ? 'border-emerald-500 bg-emerald-50'
                        : ''
                    }`}
                  >
                    <div
                      className="h-8 rounded border mb-1"
                      style={{ backgroundColor: COLORS[c].hex }}
                    />
                    {COLORS[c].label}
                  </button>
                ))}
              </div>
            </>
          )}

          {/* 도트 패턴 & 색상 */}
          {product === 'dot' && (
            <>
              <h2 className="font-semibold">3. 도트 패턴</h2>
              <div className="grid grid-cols-3 gap-4">
                {(Object.keys(DOT_PATTERN) as DotPattern[]).map((p) => (
                  <button
                    key={p}
                    onClick={() => setPattern(p)}
                    className={`border rounded-xl p-3 ${
                      pattern === p ? 'border-emerald-500 bg-emerald-50' : ''
                    }`}
                  >
                    <div className="grid grid-cols-2">
                      {DOT_PATTERN[p].map((s, i) => (
                        <div
                          key={i}
                          className="w-8 h-8 border"
                          style={{ backgroundColor: getDotColor(s) }}
                        />
                      ))}
                    </div>
                    <div className="text-xs mt-1 font-semibold">{p}</div>
                  </button>
                ))}
              </div>

              {(['A', 'B', 'C'] as const).map((slot) => (
                <div key={slot}>
                  <div className="font-semibold mb-1">색상 {slot}</div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {(Object.keys(COLORS) as DotColor[]).map((c) => {
                      const selected =
                        (slot === 'A' && colorA === c) ||
                        (slot === 'B' && colorB === c) ||
                        (slot === 'C' && colorC === c);

                      return (
                        <button
                          key={c}
                          onClick={() =>
                            slot === 'A'
                              ? setColorA(c)
                              : slot === 'B'
                              ? setColorB(c)
                              : setColorC(c)
                          }
                          className={`border rounded-xl p-2 text-xs ${
                            selected ? 'border-emerald-500 bg-emerald-50' : ''
                          }`}
                        >
                          <div
                            className="h-6 rounded border mb-1"
                            style={{ backgroundColor: COLORS[c].hex }}
                          />
                          {COLORS[c].label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </>
          )}
        </section>

        {/* 4. 미리보기 */}
        <section className="border rounded-xl p-5">
          <h2 className="font-semibold mb-3">4. 미리보기</h2>

          {product === 'buddy' && (
            <div
              className="inline-grid"
              style={{ gridTemplateColumns: `repeat(${Math.min(buddyX, 30)}, 20px)` }}
            >
              {Array.from({ length: Math.min(buddyX * buddyY, 900) }).map((_, i) => (
                <div
                  key={i}
                  className="border border-slate-500"
                  style={{ backgroundColor: COLORS[buddyColor].hex }}
                />
              ))}
            </div>
          )}

          {product === 'dot' && (
            <div
              className="inline-grid"
              style={{ gridTemplateColumns: `repeat(${Math.min(dotX, 40)}, 10px)` }}
            >
              {Array.from({ length: Math.min(dotX * dotY, 1600) }).map((_, i) => {
                const x = i % dotX;
                const y = Math.floor(i / dotX);
                const idx = (y % 2) * 2 + (x % 2);
                return (
                  <div
                    key={i}
                    className="border border-slate-400"
                    style={{ backgroundColor: getDotColor(DOT_PATTERN[pattern][idx]) }}
                  />
                );
              })}
            </div>
          )}
        </section>

        {/* 5. 수량 & 박스 */}
        <section className="border rounded-xl p-5 text-sm space-y-1">
          {product === 'buddy' && (
            <>
              <div>필요 장수: <b>{buddyNeed}</b></div>
              <div>36p: {buddyPack.result[36]} / 9p: {buddyPack.result[9]} / 2p: {buddyPack.result[2]}</div>
              <div>남는 장수: {buddyPack.leftover}</div>
            </>
          )}

          {product === 'dot' && (
            <>
              <div>필요 개수: <b>{dotNeed}</b></div>
              <div>120p: {dotPack.result[120]} / 40p: {dotPack.result[40]}</div>
              <div>남는 수량: {dotPack.leftover}</div>
            </>
          )}
        </section>
      </div>
    </div>
  );
}
