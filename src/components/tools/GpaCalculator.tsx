import React, { useState, useMemo } from 'react';
import {
  GraduationCap,
  Plus,
  Trash2,
  Check,
  Copy
} from 'lucide-react';

interface CourseRow {
  id: string;
  name: string;
  grade: string;
  credits: number;
}

const GRADE_MAP_4: Record<string, number> = {
  'A+': 4.0,
  'A': 4.0,
  'A-': 3.7,
  'B+': 3.5,
  'B': 3.0,
  'B-': 2.7,
  'C+': 2.5,
  'C': 2.0,
  'C-': 1.7,
  'D+': 1.5,
  'D': 1.0,
  'F': 0.0,
};

const GRADE_MAP_10: Record<string, number> = {
  'A+': 9.5,
  'A': 8.8,
  'A-': 8.2,
  'B+': 7.8,
  'B': 7.2,
  'B-': 6.7,
  'C+': 6.2,
  'C': 5.7,
  'C-': 5.2,
  'D+': 4.5,
  'D': 4.0,
  'F': 2.0,
};

export const GpaCalculator: React.FC = () => {
  const [courses, setCourses] = useState<CourseRow[]>([
    { id: '1', name: 'Toán cao cấp', grade: 'A', credits: 4 },
    { id: '2', name: 'Lập trình căn bản', grade: 'A+', credits: 3 },
    { id: '3', name: 'Xác suất thống kê', grade: 'B+', credits: 3 },
    { id: '4', name: 'Tiếng Anh chuyên ngành', grade: 'A-', credits: 2 },
    { id: '5', name: 'Kinh tế vi mô', grade: 'B', credits: 3 },
  ]);

  const [copied, setCopied] = useState<boolean>(false);

  const addCourse = () => {
    const newCourse: CourseRow = {
      id: Date.now().toString(),
      name: `Môn học ${courses.length + 1}`,
      grade: 'B+',
      credits: 3
    };
    setCourses([...courses, newCourse]);
  };

  const removeCourse = (id: string) => {
    if (courses.length <= 1) return;
    setCourses(courses.filter(c => c.id !== id));
  };

  const updateCourse = (id: string, field: keyof CourseRow, value: any) => {
    setCourses(courses.map(c => c.id === id ? { ...c, [field]: value } : c));
  };

  const calculations = useMemo(() => {
    let totalCredits = 0;
    let totalPoints4 = 0;
    let totalPoints10 = 0;

    courses.forEach(c => {
      const cr = Number(c.credits) || 0;
      const pt4 = GRADE_MAP_4[c.grade] ?? 0;
      const pt10 = GRADE_MAP_10[c.grade] ?? 0;

      totalCredits += cr;
      totalPoints4 += pt4 * cr;
      totalPoints10 += pt10 * cr;
    });

    const gpa4 = totalCredits > 0 ? Number((totalPoints4 / totalCredits).toFixed(2)) : 0;
    const gpa10 = totalCredits > 0 ? Number((totalPoints10 / totalCredits).toFixed(2)) : 0;

    // Classification
    let honors = '';
    let honorsColor = '';
    if (gpa4 >= 3.6) {
      honors = 'Xuất sắc (Summa Cum Laude)';
      honorsColor = 'text-amber-600 bg-amber-50 border-amber-200';
    } else if (gpa4 >= 3.2) {
      honors = 'Giỏi (Magna Cum Laude)';
      honorsColor = 'text-emerald-600 bg-emerald-50 border-emerald-200';
    } else if (gpa4 >= 2.5) {
      honors = 'Khá (Good)';
      honorsColor = 'text-blue-600 bg-blue-50 border-blue-200';
    } else if (gpa4 >= 2.0) {
      honors = 'Trung bình (Average)';
      honorsColor = 'text-slate-700 bg-slate-100 border-slate-200';
    } else {
      honors = 'Yếu / Kém (Academic Warning)';
      honorsColor = 'text-rose-600 bg-rose-50 border-rose-200';
    }

    return {
      totalCredits,
      gpa4,
      gpa10,
      honors,
      honorsColor
    };
  }, [courses]);

  const handleCopy = () => {
    const text = `Kết quả tính điểm GPA:
- Tổng số tín chỉ: ${calculations.totalCredits} tín chỉ
- Điểm GPA hệ 4.0: ${calculations.gpa4} / 4.0
- Điểm GPA hệ 10.0: ${calculations.gpa10} / 10.0
- Xếp loại học lực: ${calculations.honors}`;
    navigator.clipboard?.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div id="gpa-calculator" className="p-4 sm:p-7 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-purple-50 text-purple-600 border border-purple-100">
              <GraduationCap className="w-5 h-5" />
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              GPA Calculator (Tính Điểm Trung Bình Tích Lũy)
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Tính điểm GPA theo thang điểm 4.0 chuẩn quốc tế và thang điểm 10.0, tự động xếp hạng học lực.
          </p>
        </div>

        <button
          onClick={handleCopy}
          className="self-start sm:self-auto flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors active:scale-95"
        >
          {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4 text-slate-500" />}
          <span>{copied ? 'Đã sao chép' : 'Sao chép kết quả'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Table */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-slate-50 p-4 sm:p-5 rounded-3xl border border-slate-200 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Danh sách môn học ({courses.length} môn)
              </span>
              <button
                type="button"
                onClick={addCourse}
                className="flex items-center gap-1 px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold transition-all active:scale-95"
              >
                <Plus className="w-3.5 h-3.5" /> Thêm môn học
              </button>
            </div>

            <div className="space-y-2">
              {courses.map((c, idx) => (
                <div key={c.id} className="flex items-center gap-2 p-2 bg-white rounded-2xl border border-slate-200 text-xs">
                  <span className="w-5 text-center font-bold text-slate-400">#{idx + 1}</span>
                  <input
                    type="text"
                    value={c.name}
                    onChange={(e) => updateCourse(c.id, 'name', e.target.value)}
                    className="flex-1 p-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-800"
                    placeholder="Tên môn học"
                  />
                  <select
                    value={c.grade}
                    onChange={(e) => updateCourse(c.id, 'grade', e.target.value)}
                    className="w-20 p-2 bg-slate-50 border border-slate-200 rounded-xl font-black text-slate-900 font-mono"
                  >
                    {Object.keys(GRADE_MAP_4).map(g => (
                      <option key={g} value={g}>{g} ({GRADE_MAP_4[g]})</option>
                    ))}
                  </select>
                  <div className="flex items-center gap-1">
                    <input
                      type="number"
                      min={1}
                      max={12}
                      value={c.credits}
                      onChange={(e) => updateCourse(c.id, 'credits', Number(e.target.value))}
                      className="w-14 p-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-center text-slate-900"
                      title="Số tín chỉ"
                    />
                    <span className="text-[11px] text-slate-400 hidden sm:inline">tín</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeCourse(c.id)}
                    disabled={courses.length <= 1}
                    className="p-2 text-slate-400 hover:text-rose-600 disabled:opacity-30"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Output */}
        <div className="lg:col-span-5 space-y-4">
          {/* Main Hero GPA */}
          <div className="bg-white dark:bg-gradient-to-br dark:from-purple-900 dark:via-slate-900 dark:to-indigo-950 p-6 rounded-3xl border border-slate-200 dark:border-transparent text-slate-900 dark:text-white shadow-xs dark:shadow-xl space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-purple-700 dark:text-purple-300">
              Điểm GPA Hệ 4.0
            </span>

            <div className="flex items-baseline gap-2">
              <span className="text-5xl sm:text-7xl font-black font-mono tracking-tight text-slate-900 dark:text-white">
                {calculations.gpa4}
              </span>
              <span className="text-lg font-semibold text-slate-600 dark:text-purple-200">/ 4.0</span>
            </div>

            <div className={`p-3 rounded-2xl border text-xs font-bold ${calculations.honorsColor}`}>
              Xếp loại: {calculations.honors}
            </div>
          </div>

          {/* Secondary Stats */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
              <span className="text-xs text-slate-500 block mb-1">GPA Thang Điểm 10</span>
              <span className="text-2xl font-black text-indigo-600 font-mono">
                {calculations.gpa10}
              </span>
              <span className="text-xs text-slate-400 block mt-0.5">/ 10.0</span>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
              <span className="text-xs text-slate-500 block mb-1">Tổng số tín chỉ</span>
              <span className="text-2xl font-black text-slate-900 font-mono">
                {calculations.totalCredits}
              </span>
              <span className="text-xs text-slate-400 block mt-0.5">tín chỉ tích lũy</span>
            </div>
          </div>

          {/* Scale Guidance */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs text-slate-600 space-y-1.5">
            <span className="font-bold text-slate-800 uppercase tracking-wider block">Thang điểm chuẩn:</span>
            <div className="flex justify-between"><span>A (3.6 - 4.0):</span><span className="font-semibold text-emerald-600">Xuất sắc / Giỏi</span></div>
            <div className="flex justify-between"><span>B (2.5 - 3.5):</span><span className="font-semibold text-blue-600">Khá</span></div>
            <div className="flex justify-between"><span>C (2.0 - 2.4):</span><span className="font-semibold text-slate-700">Trung bình</span></div>
            <div className="flex justify-between"><span>D (&lt; 2.0):</span><span className="font-semibold text-rose-600">Cảnh báo học vụ</span></div>
          </div>
        </div>
      </div>
    </div>
  );
};
