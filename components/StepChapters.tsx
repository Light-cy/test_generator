import React, { useState } from 'react';
import { getChapters } from '../constants';
import { ExamConfig } from '../types';
import { CheckSquare, Square, ArrowRight, ArrowLeft, Search, SlidersHorizontal, Sparkles } from 'lucide-react';

interface Props {
  config: ExamConfig;
  onUpdate: (updates: Partial<ExamConfig>) => void;
  onNext: () => void;
  onBack: () => void;
}

export const StepChapters: React.FC<Props> = ({ config, onUpdate, onNext, onBack }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [difficulty, setDifficulty] = useState('Standard Board Pattern');
  const availableChapters = getChapters(config.className, config.subject);

  const filteredChapters = availableChapters.filter(ch =>
    ch.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleChapter = (chapter: string) => {
    const current = new Set(config.selectedChapters);
    if (current.has(chapter)) {
      current.delete(chapter);
    } else {
      current.add(chapter);
    }
    onUpdate({ selectedChapters: Array.from(current) });
  };

  const selectAll = () => {
    if (config.selectedChapters.length === availableChapters.length) {
      onUpdate({ selectedChapters: [] });
    } else {
      onUpdate({ selectedChapters: [...availableChapters] });
    }
  };

  const selectFirstHalf = () => {
    const half = Math.ceil(availableChapters.length / 2);
    onUpdate({ selectedChapters: availableChapters.slice(0, half) });
  };

  const selectSecondHalf = () => {
    const half = Math.ceil(availableChapters.length / 2);
    onUpdate({ selectedChapters: availableChapters.slice(half) });
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-100">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">
            Select Syllabus Chapters
          </h2>
          <p className="text-sm text-slate-500">
            {config.className} · {config.subject} · {availableChapters.length} Total Chapters
          </p>
        </div>

        {/* Search bar */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search chapters..."
            className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-600 focus:bg-white transition-colors"
          />
        </div>
      </div>

      {/* Quick Selection Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200">
        <div className="flex items-center gap-2 text-xs">
          <span className="font-semibold text-slate-700">
            {config.selectedChapters.length} of {availableChapters.length} Selected
          </span>
          {config.selectedChapters.length > 0 && (
            <span className="text-slate-400">· Ready for question extraction</span>
          )}
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={selectAll}
            className="text-xs font-semibold px-2.5 py-1 rounded-md text-emerald-700 hover:bg-emerald-100/60 transition-colors"
          >
            {config.selectedChapters.length === availableChapters.length ? 'Deselect All' : 'Select All'}
          </button>
          <span className="text-slate-300">|</span>
          <button
            type="button"
            onClick={selectFirstHalf}
            className="text-xs text-slate-600 hover:text-slate-900 px-2 py-1 rounded transition-colors"
          >
            1st Half Book
          </button>
          <span className="text-slate-300">|</span>
          <button
            type="button"
            onClick={selectSecondHalf}
            className="text-xs text-slate-600 hover:text-slate-900 px-2 py-1 rounded transition-colors"
          >
            2nd Half Book
          </button>
        </div>
      </div>

      {/* Chapters Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 max-h-[50vh] overflow-y-auto pr-1">
        {filteredChapters.map((chapter) => {
          const isSelected = config.selectedChapters.includes(chapter);
          return (
            <div
              key={chapter}
              onClick={() => toggleChapter(chapter)}
              className={`flex items-start p-3.5 rounded-xl border cursor-pointer transition-all select-none ${
                isSelected
                  ? 'border-emerald-600 bg-emerald-50/70 shadow-sm'
                  : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/50'
              }`}
            >
              <div className={`mt-0.5 mr-3 shrink-0 ${isSelected ? 'text-emerald-700' : 'text-slate-300'}`}>
                {isSelected ? <CheckSquare className="w-5 h-5" /> : <Square className="w-5 h-5" />}
              </div>
              <div className="flex-1 min-w-0">
                <span className={`text-sm leading-snug block ${isSelected ? 'text-emerald-950 font-medium' : 'text-slate-700'}`}>
                  {chapter}
                </span>
              </div>
            </div>
          );
        })}
        {filteredChapters.length === 0 && (
          <div className="col-span-2 py-8 text-center text-sm text-slate-400">
            No chapters match &quot;{searchQuery}&quot;
          </div>
        )}
      </div>

      {/* Generation Options Drawer */}
      <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 text-slate-600">
          <SlidersHorizontal className="w-4 h-4 text-emerald-600" />
          <span className="font-semibold text-slate-800">Generation Pattern:</span>
          <select
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
            className="bg-white border border-slate-200 rounded px-2 py-1 text-slate-700 focus:outline-none focus:border-emerald-600"
          >
            <option value="Standard Board Pattern">BISE Board Standard (SLO + Exercise)</option>
            <option value="Past 5-Year Board Papers">Past 5-Year Board Papers Focus</option>
            <option value="Conceptual & SLO Intensive">Conceptual & Critical Thinking (SLO)</option>
            <option value="Textbook Exercise Only">Textbook Exercise Questions Only</option>
          </select>
        </div>

        <div className="flex items-center gap-1.5 text-slate-500">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span>Server-side AI Extraction + Instant Local Bank</span>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="flex items-center justify-between pt-4 border-t border-slate-100">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-1.5 text-slate-600 hover:text-slate-900 px-3 py-2 font-medium text-sm transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Subject
        </button>

        <button
          type="button"
          onClick={onNext}
          disabled={config.selectedChapters.length === 0}
          className="flex items-center gap-2 bg-emerald-700 hover:bg-emerald-800 disabled:bg-slate-300 disabled:cursor-not-allowed text-white px-6 py-2.5 rounded-lg font-medium text-sm transition-colors shadow-sm"
        >
          Extract Questions ({config.selectedChapters.length} Ch) <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
