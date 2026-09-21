import React, { useState, useMemo } from 'react';
import { Box, RotateCcw } from 'lucide-react';
import { VolumeVisualizer } from './geometry/VolumeVisualizer';

type SolidShape = 'cuboid' | 'cylinder' | 'sphere' | 'cone';

export const VolumeCalculator: React.FC = () => {
  const [solid, setSolid] = useState<SolidShape>('cuboid');
  const [d1, setD1] = useState<number>(10);
  const [d2, setD2] = useState<number>(5);
  const [d3, setD3] = useState<number>(4);

  const calculations = useMemo(() => {
    let volume = 0;
    let surfaceArea = 0;

    if (solid === 'cuboid') {
      // l, w, h
      volume = d1 * d2 * d3;
      surfaceArea = 2 * (d1 * d2 + d2 * d3 + d1 * d3);
    } else if (solid === 'cylinder') {
      // r, h
      volume = Math.PI * d1 * d1 * d2;
      surfaceArea = 2 * Math.PI * d1 * d2 + 2 * Math.PI * d1 * d1;
    } else if (solid === 'sphere') {
      // r
      volume = (4 / 3) * Math.PI * Math.pow(d1, 3);
      surfaceArea = 4 * Math.PI * d1 * d1;
    } else if (solid === 'cone') {
      // r, h
      volume = (1 / 3) * Math.PI * d1 * d1 * d2;
      const slant = Math.sqrt(d1 * d1 + d2 * d2);
      surfaceArea = Math.PI * d1 * slant + Math.PI * d1 * d1;
    }

    return {
      volume: Number(volume.toFixed(4)),
      surfaceArea: Number(surfaceArea.toFixed(4))
    };
  }, [solid, d1, d2, d3]);

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      <div className="p-4 sm:p-6 rounded-2xl bg-gradient-to-r from-blue-900/40 via-slate-800 to-slate-900 border border-blue-500/30 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-blue-600/20 text-blue-400 rounded-xl border border-blue-500/30">
            <Box className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">Volume Calculator – Tính Thể Tích Khối Hình Không Gian</h1>
            <p className="text-xs sm:text-sm text-slate-400">Tính thể tích và diện tích toàn phần của khối hộp, hình trụ, hình cầu và hình nón</p>
          </div>
        </div>
        <button
          id="volume-reset-btn"
          onClick={() => { setSolid('cuboid'); setD1(10); setD2(5); setD3(4); }}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Đặt lại</span>
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        {[
          { id: 'cuboid', label: 'Hình hộp chữ nhật' },
          { id: 'cylinder', label: 'Hình trụ tròn' },
          { id: 'sphere', label: 'Hình cầu' },
          { id: 'cone', label: 'Hình nón' },
        ].map((s) => (
          <button
            key={s.id}
            id={`volume-shape-${s.id}`}
            onClick={() => setSolid(s.id as SolidShape)}
            className={`px-3.5 py-2 text-xs rounded-xl border font-medium transition-all ${
              solid === s.id
                ? 'bg-blue-600 text-white border-blue-500 font-bold'
                : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-5 space-y-4 bg-slate-900/80 p-5 rounded-2xl border border-slate-800">
          <h2 className="text-base font-semibold text-white">Kích thước hình khối</h2>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              {solid === 'cuboid' ? 'Chiều dài' : 'Bán kính đáy r'}
            </label>
            <input
              id="volume-d1"
              type="number"
              value={d1}
              onChange={(e) => setD1(Number(e.target.value))}
              className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white font-sans focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          {solid !== 'sphere' && (
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                {solid === 'cuboid' ? 'Chiều rộng' : 'Chiều cao h'}
              </label>
              <input
                id="volume-d2"
                type="number"
                value={d2}
                onChange={(e) => setD2(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white font-sans focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          )}

          {solid === 'cuboid' && (
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Chiều cao h</label>
              <input
                id="volume-d3"
                type="number"
                value={d3}
                onChange={(e) => setD3(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white font-sans focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          )}
        </div>

        <div className="lg:col-span-7 space-y-4">
          <div className="p-6 rounded-2xl bg-gradient-to-b from-blue-950/40 to-slate-900 border border-blue-500/40 text-center space-y-2">
            <span className="text-xs uppercase tracking-wider text-blue-300 font-semibold">THỂ TÍCH KHỐI (VOLUME)</span>
            <div className="text-4xl sm:text-5xl font-extrabold text-blue-400 font-sans tabular-nums">
              {calculations.volume.toLocaleString()}
            </div>
            <p className="text-xs text-slate-400">
              Diện tích toàn phần bề mặt: <span className="text-white font-bold font-sans">{calculations.surfaceArea.toLocaleString()}</span>
            </p>
          </div>

          <VolumeVisualizer
            solid={solid}
            d1={d1}
            d2={d2}
            d3={d3}
            volume={calculations.volume}
            surfaceArea={calculations.surfaceArea}
          />
        </div>
      </div>
    </div>
  );
};
