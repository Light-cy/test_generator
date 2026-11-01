import React from 'react';
import { SYLLABUS, BOARD_PRESETS, POPULAR_INSTITUTIONS } from '../constants';
import { ExamConfig } from '../types';
import { BookOpen, GraduationCap, ArrowRight, Languages, Sparkles } from 'lucide-react';

interface Props {
  config: ExamConfig;
  onUpdate: (updates: Partial<ExamConfig>) => void;
  onNext: () => void;
}

export const StepClassSubject: React.FC<Props> = ({ config, onUpdate, onNext }) => {
  const subjects = config.className ? SYLLABUS.subjects[config.className] || [] : [];

  const handleClassSelect = (cls: string) => {
    onUpdate({
      className: cls,
      subject: '',
      selectedChapters: []
    });
  };

  const handleSubjectSelect = (subj: string) => {
    onUpdate({
      subject: subj,
      selectedChapters: []
    });
  };

  const applyPreset = (preset: typeof BOARD_PRESETS[0]) => {
    onUpdate({
      paperHeading: preset.label,
      totalMarks: preset.marks,
      timeAllowed: preset.time
    });
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Step Header */}
      <div className="text-center space-y-1.5 pb-2">
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">
          Punjab Board Exam Configuration
        </h2>
        <p className="text-sm text-slate-500 max-w-xl mx-auto">
          Create standardized test papers strictly aligned with the Punjab Textbook Board (PTB) curriculum and BISE board patterns.
        </p>
      </div>

      {/* Class Level Selector */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-sm font-semibold text-slate-800 flex items-center gap-2">
            <GraduationCap className="w-4 h-4 text-emerald-600" />
            1. Select Class Level
          </label>
          <span className="text-xs text-slate-400">Classes 9 to 12</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {SYLLABUS.classes.map((cls) => {
            const isSelected = config.className === cls;
            return (
              <button
                key={cls}
                type="button"
                onClick={() => handleClassSelect(cls)}
                className={`py-3.5 px-4 rounded-xl border text-center transition-all ${
                  isSelected
                    ? 'border-emerald-600 bg-emerald-50/80 text-emerald-900 font-bold shadow-sm ring-1 ring-emerald-500'
                    : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50 text-slate-700'
                }`}
              >
                <div className="text-base tracking-tight">{cls}</div>
                <div className="text-[11px] text-slate-400 font-normal mt-0.5">
                  {cls.includes('9') ? 'Matric Part I' : cls.includes('10') ? 'Matric Part II' : cls.includes('11') ? 'Inter Part I' : 'Inter Part II'}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Subject Selector */}
      {config.className && (
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-semibold text-slate-800 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-emerald-600" />
              2. Select Subject ({config.className})
            </label>
            <span className="text-xs text-slate-400">PTB Official Syllabus</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
            {subjects.map((subj) => {
              const isSelected = config.subject === subj;
              return (
                <button
                  key={subj}
                  type="button"
                  onClick={() => handleSubjectSelect(subj)}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    isSelected
                      ? 'border-emerald-600 bg-emerald-600 text-white font-semibold shadow-sm'
                      : 'border-slate-200 bg-white hover:border-slate-300 text-slate-700'
                  }`}
                >
                  <div className="text-sm">{subj}</div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Test Medium & Institution Details */}
      {config.subject && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-100">
          {/* Medium Selection */}
          <div className="space-y-3">
            <label className="text-sm font-semibold text-slate-800 flex items-center gap-2">
              <Languages className="w-4 h-4 text-emerald-600" />
              Test Medium & Language
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'english', label: 'English', desc: 'English Medium' },
                { id: 'bilingual', label: 'Bilingual', desc: 'Eng + Urdu Board' },
                { id: 'urdu', label: 'Urdu', desc: 'اردو میڈیم' },
              ].map(med => (
                <button
                  key={med.id}
                  type="button"
                  onClick={() => onUpdate({ medium: med.id as any })}
                  className={`p-2.5 rounded-xl border text-center transition-all ${
                    config.medium === med.id
                      ? 'border-emerald-600 bg-emerald-50 text-emerald-900 font-semibold ring-1 ring-emerald-500'
                      : 'border-slate-200 bg-white hover:border-slate-300 text-slate-600'
                  }`}
                >
                  <div className="text-xs font-bold">{med.label}</div>
                  <div className="text-[10px] text-slate-400">{med.desc}</div>
                </button>
              ))}
            </div>

            {/* Quick Test Presets */}
            <div className="pt-2">
              <div className="text-xs font-semibold text-slate-500 mb-2 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                Quick Board Presets
              </div>
              <div className="grid grid-cols-2 gap-2">
                {BOARD_PRESETS.map((preset) => (
                  <button
                    key={preset.label}
                    type="button"
                    onClick={() => applyPreset(preset)}
                    className={`text-left p-2 rounded-lg border text-xs transition-colors ${
                      config.paperHeading === preset.label
                        ? 'border-emerald-500 bg-emerald-50/60 text-emerald-800'
                        : 'border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700'
                    }`}
                  >
                    <div className="font-semibold">{preset.label}</div>
                    <div className="text-[10px] text-slate-400 font-mono mt-0.5">{preset.marks} Marks · {preset.time}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Institution Header Details */}
          <div className="space-y-3">
            <label className="text-sm font-semibold text-slate-800">
              Institution & Paper Header
            </label>
            <div className="space-y-2.5">
              <div>
                <label className="text-xs text-slate-500 font-medium">Institution / Academy Name</label>
                <input
                  type="text"
                  value={config.institutionName}
                  onChange={(e) => onUpdate({ institutionName: e.target.value })}
                  placeholder="e.g. Punjab College / KIPS / Govt. High School"
                  className="w-full mt-1 px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-600"
                />
                <div className="flex flex-wrap gap-1.5 mt-1.5">
                  {POPULAR_INSTITUTIONS.slice(0, 3).map((inst) => (
                    <button
                      key={inst}
                      type="button"
                      onClick={() => onUpdate({ institutionName: inst })}
                      className="text-[10px] text-slate-500 bg-slate-100 hover:bg-slate-200 px-2 py-0.5 rounded transition-colors"
                    >
                      {inst.split('(')[0].trim()}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs text-slate-500 font-medium">Paper Heading</label>
                  <input
                    type="text"
                    value={config.paperHeading}
                    onChange={(e) => onUpdate({ paperHeading: e.target.value })}
                    placeholder="e.g. Monthly Test"
                    className="w-full mt-1 px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-600"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-500 font-medium">Time Allowed</label>
                  <input
                    type="text"
                    value={config.timeAllowed}
                    onChange={(e) => onUpdate({ timeAllowed: e.target.value })}
                    placeholder="e.g. 1 Hour"
                    className="w-full mt-1 px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-600"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Navigation footer */}
      <div className="pt-4 flex items-center justify-between border-t border-slate-100">
        <div className="text-xs text-slate-400">
          {config.className && config.subject ? (
            <span>Selected: <strong className="text-slate-700">{config.className}</strong> · <strong className="text-slate-700">{config.subject}</strong></span>
          ) : (
            <span>Select both class and subject to continue</span>
          )}
        </div>
        <button
          type="button"
          onClick={onNext}
          disabled={!config.className || !config.subject}
          className="flex items-center gap-2 bg-emerald-700 hover:bg-emerald-800 disabled:bg-slate-300 disabled:cursor-not-allowed text-white px-6 py-2.5 rounded-lg font-medium text-sm transition-colors shadow-sm"
        >
          Select Chapters <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
