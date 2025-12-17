'use client';

import { useState } from 'react';

export default function Page() {
  const [roomLength, setRoomLength] = useState('400'); // 방 길이 (cm)
  const [roomWidth, setRoomWidth] = useState('300');   // 방 너비 (cm)
  const [wastePercent, setWastePercent] = useState('10'); // 여분율 (%)
  const [tileType, setTileType] = useState('dot'); // 'dot' or 'buddy'

  // 색상 옵션
  const colors = ['아이보리', '라이트 그레이', '베이지', '버터'];
  const [colorA, setColorA] = useState(colors[0]);
  const [colorB, setColorB] = useState('');
  const [colorC, setColorC] = useState('');

  // 패턴 (dot만)
  const patterns = ['aaaa', 'abba', 'abbc'];
  const [pattern, setPattern] = useState(patterns[0]);

  const colorMap: Record<string, string> = {
    아이보리: 'bg-gray-100',
    '라이트 그레이': 'bg-gray-300',
    베이지: 'bg-yellow-100',
    버터: 'bg-yellow-200',
  };

  // 타일 크기
  const tileSize = tileType === 'dot' ? 10 : 30;

  // 팩 크기
  const packSizes = tileType === 'dot' ? [120, 40, 10] : [36, 9, 2]; // descending order

  // 계산 로직
  const l = parseFloat(roomLength) || 0;
  const w = parseFloat(roomWidth) || 0;
  const wasteRate = (parseFloat(wastePercent) || 10) / 100;

  const tilesAlongLength = Math.ceil(l / tileSize);
  const tilesAlongWidth = Math.ceil(w / tileSize);
  const baseTiles = tilesAlongLength * tilesAlongWidth;
  const required = Math.ceil(baseTiles * (1 + wasteRate));

  // 최적 팩 조합 찾기 (min leftover, then min total packs)
  let minLeftover = Infinity;
  let minTotalPacks = Infinity;
  let bestPackCounts = packSizes.reduce((acc, size) => ({ ...acc, [size]: 0 }), {});

  const maxLarge = Math.ceil(required / packSizes[0]) + 5; // 여유
  for (let p1 = 0; p1 <= maxLarge; p1++) {
    const maxMed = Math.ceil((required - p1 * packSizes[0]) / packSizes[1]) + 5;
    for (let p2 = 0; p2 <= maxMed; p2++) {
      const remaining = required - (p1 * packSizes[0] + p2 * packSizes[1]);
      let p3 = 0;
      if (remaining > 0) {
        p3 = Math.ceil(remaining / packSizes[2]);
      }
      const totalTiles = p1 * packSizes[0] + p2 * packSizes[1] + p3 * packSizes[2];
      const leftover = totalTiles - required;

      if (leftover >= 0) {
        const totalPacks = p1 + p2 + p3;
        if (leftover < minLeftover || (leftover === minLeftover && totalPacks < minTotalPacks)) {
          minLeftover = leftover;
          minTotalPacks = totalPacks;
          bestPackCounts = {
            [packSizes[0]]: p1,
            [packSizes[1]]: p2,
            [packSizes[2]]: p3,
          };
        }
      }
    }
  }

  // 미리보기 비율
  const previewWidth = 600;
  const previewHeight = l > 0 ? (w / l) * previewWidth : previewWidth * 0.75;

  // 패턴 기반 색상 getter
  const getTileColor = (row: number, col: number) => {
    if (tileType !== 'dot') return colorMap[colorA] || 'bg-gray-200';

    const pat = pattern.toLowerCase();
    const modRow = row % 2;
    const modCol = col % 2;

    if (pat === 'aaaa') return colorMap[colorA] || 'bg-gray-200';
    if (pat === 'abba') {
      if (modRow === 0 && modCol === 0) return colorMap[colorA] || 'bg-gray-200';
      if (modRow === 0 && modCol === 1) return colorMap[colorB] || colorMap[colorA];
      if (modRow === 1 && modCol === 0) return colorMap[colorB] || colorMap[colorA];
      if (modRow === 1 && modCol === 1) return colorMap[colorA] || 'bg-gray-200';
    }
    if (pat === 'abbc') {
      if (modRow === 0 && modCol === 0) return colorMap[colorA] || 'bg-gray-200';
      if (modRow === 0 && modCol === 1) return colorMap[colorB] || colorMap[colorA];
      if (modRow === 1 && modCol === 0) return colorMap[colorB] || colorMap[colorA];
      if (modRow === 1 && modCol === 1) return colorMap[colorC] || colorMap[colorA];
    }
    return colorMap[colorA] || 'bg-gray-200';
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-12">프로메이드 타일 시뮬레이터</h1>

        {/* 입력 영역 */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div className="bg-white p-8 rounded-lg shadow">
            <h2 className="text-2xl font-semibold mb-6">공간 및 타일 설정</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">방 길이 (cm)</label>
                <input
                  type="number"
                  value={roomLength}
                  onChange={(e) => setRoomLength(e.target.value)}
                  className="w-full border border-gray-300 rounded px-4 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">방 너비 (cm)</label>
                <input
                  type="number"
                  value={roomWidth}
                  onChange={(e) => setRoomWidth(e.target.value)}
                  className="w-full border border-gray-300 rounded px-4 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">여분율 (%)</label>
                <input
                  type="number"
                  value={wastePercent}
                  onChange={(e) => setWastePercent(e.target.value)}
                  className="w-full border border-gray-300 rounded px-4 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">타일 타입</label>
                <select
                  value={tileType}
                  onChange={(e) => setTileType(e.target.value)}
                  className="w-full border border-gray-300 rounded px-4 py-2"
                >
                  <option value="dot">도트 데크타일 (10x10cm)</option>
                  <option value="buddy">버디 데크타일 (30x30cm)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">색상 A</label>
                <select
                  value={colorA}
                  onChange={(e) => setColorA(e.target.value)}
                  className="w-full border border-gray-300 rounded px-4 py-2"
                >
                  {colors.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              {tileType === 'dot' && (
                <>
                  <div>
                    <label className="block text-sm font-medium mb-1">패턴</label>
                    <select
                      value={pattern}
                      onChange={(e) => setPattern(e.target.value)}
                      className="w-full border border-gray-300 rounded px-4 py-2"
                    >
                      {patterns.map(p => <option key={p}>{p}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">색상 B (선택)</label>
                    <select
                      value={colorB}
                      onChange={(e) => setColorB(e.target.value)}
                      className="w-full border border-gray-300 rounded px-4 py-2"
                    >
                      <option value="">없음</option>
                      {colors.map(c => <option key={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">색상 C (선택)</label>
                    <select
                      value={colorC}
                      onChange={(e) => setColorC(e.target.value)}
                      className="w-full border border-gray-300 rounded px-4 py-2"
                    >
                      <option value="">없음</option>
                      {colors.map(c => <option key={c}>{c}</option>)}
                    </select>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* 결과 영역 */}
          <div className="bg-white p-8 rounded-lg shadow">
            <h2 className="text-2xl font-semibold mb-6">계산 결과</h2>
            <div className="text-lg space-y-3">
              <div>필요 개수: <span className="font-bold">{required}</span></div>
              {packSizes.map(size => (
                <div key={size}>{size}p: <span className="font-bold">{bestPackCounts[size]}</span></div>
              ))}
              <div>남는 수량: <span className="font-bold">{minLeftover}</span></div>
            </div>
          </div>
        </div>

        {/* 배치 미리보기 */}
        {l > 0 && w > 0 && (
          <div className="bg-white p-8 rounded-lg shadow">
            <h2 className="text-2xl font-semibold mb-6">타일 배치 미리보기</h2>
            <div className="flex justify-center">
              <div
                className="border-4 border-gray-800 rounded overflow-hidden"
                style={{ width: `${previewWidth}px`, height: `${previewHeight}px` }}
              >
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: `repeat(${tilesAlongLength}, 1fr)`,
                    gridTemplateRows: `repeat(${tilesAlongWidth}, 1fr)`,
                    width: '100%',
                    height: '100%',
                  }}
                >
                  {Array.from({ length: tilesAlongLength * tilesAlongWidth }).map((_, idx) => {
                    const row = Math.floor(idx / tilesAlongLength);
                    const col = idx % tilesAlongLength;
                    return (
                      <div
                        key={idx}
                        className={`border border-gray-400 ${getTileColor(row, col)}`}
                      />
                    );
                  })}
                </div>
              </div>
            </div>
            <p className="text-center mt-4 text-gray-600">
              가로 {tilesAlongLength}개 × 세로 {tilesAlongWidth}개 = 총 {baseTiles}장 (절단 포함)
            </p>
          </div>
        )}
      </div>
    </div>
  );
}