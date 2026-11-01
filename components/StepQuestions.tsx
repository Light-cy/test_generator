import React, { useState, useEffect } from 'react';
import { GeneratedContent, Question, QuestionType } from '../types';
import {
  Check,
  ArrowRight,
  ArrowLeft,
  Plus,
  Trash2,
  Edit2,
  Sparkles,
  Shuffle,
  Layers,
  CheckCircle2,
  Languages
} from 'lucide-react';

interface Props {
  content: GeneratedContent;
  subject: string;
  medium?: 'english' | 'urdu' | 'bilingual';
  onUpdateContent: (content: GeneratedContent) => void;
  onNext: () => void;
  onBack: () => void;
  isGenerating: boolean;
  onRegenerate?: () => void;
}

export const StepQuestions: React.FC<Props> = ({
  content,
  subject,
  medium = 'english',
  onUpdateContent,
  onNext,
  onBack,
  isGenerating,
  onRegenerate
}) => {
  const [activeTab, setActiveTab] = useState<QuestionType>(QuestionType.MCQ);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [showUrduText, setShowUrduText] = useState(medium === 'bilingual' || medium === 'urdu');

  // New question form state
  const [newText, setNewText] = useState('');
  const [newUrduText, setNewUrduText] = useState('');
  const [newOptions, setNewOptions] = useState(['', '', '', '']);
  const [newCorrectOption, setNewCorrectOption] = useState('');
  const [newMarks, setNewMarks] = useState(1);

  const isPhysics = subject.toLowerCase().includes('physics');
  const isChemistry = subject.toLowerCase().includes('chemistry');
  const canHaveNumericals = isPhysics || isChemistry;

  useEffect(() => {
    if (activeTab === QuestionType.NUMERICAL && !canHaveNumericals) {
      setActiveTab(QuestionType.MCQ);
    }
  }, [subject, activeTab, canHaveNumericals]);

  const getListKey = (type: QuestionType): keyof GeneratedContent => {
    switch (type) {
      case QuestionType.MCQ: return 'mcqs';
      case QuestionType.SHORT: return 'shortQuestions';
      case QuestionType.LONG: return 'longQuestions';
      case QuestionType.NUMERICAL: return 'numericals';
    }
  };

  const toggleQuestion = (type: QuestionType, id: string) => {
    const key = getListKey(type);
    const updated = content[key].map(q => q.id === id ? { ...q, selected: !q.selected } : q);
    onUpdateContent({ ...content, [key]: updated });
  };

  const deleteQuestion = (type: QuestionType, id: string) => {
    const key = getListKey(type);
    const updated = content[key].filter(q => q.id !== id);
    onUpdateContent({ ...content, [key]: updated });
  };

  const selectAllInTab = () => {
    const key = getListKey(activeTab);
    const allSelected = content[key].every(q => q.selected);
    const updated = content[key].map(q => ({ ...q, selected: !allSelected }));
    onUpdateContent({ ...content, [key]: updated });
  };

  // Auto-Select to target marks
  const autoSelectMarks = (target: number) => {
    // Standard BISE distributions:
    let targetMcqs = 5;
    let targetShort = 5;
    let targetLong = 1;
    let targetNum = canHaveNumericals ? 1 : 0;

    if (target === 25) {
      targetMcqs = 5;
      targetShort = 5; // 10m
      targetLong = 1; // 5m
      targetNum = canHaveNumericals ? 1 : 0; // 5m
    } else if (target === 50) {
      targetMcqs = 10; // 10m
      targetShort = 12; // 24m
      targetLong = 2; // 10m
      targetNum = canHaveNumericals ? 1 : 0; // 5m
    } else if (target >= 60) {
      targetMcqs = 12; // 12m
      targetShort = 15; // 30m
      targetLong = 3; // 15m
      targetNum = canHaveNumericals ? 2 : 0;
    }

    const selectN = (list: Question[], count: number) =>
      list.map((q, idx) => ({ ...q, selected: idx < count }));

    onUpdateContent({
      mcqs: selectN(content.mcqs, targetMcqs),
      shortQuestions: selectN(content.shortQuestions, targetShort),
      longQuestions: selectN(content.longQuestions, targetLong),
      numericals: selectN(content.numericals || [], targetNum)
    });
  };

  // Shuffle questions in current tab
  const shuffleTab = () => {
    const key = getListKey(activeTab);
    const shuffled = [...content[key]].sort(() => Math.random() - 0.5);
    onUpdateContent({ ...content, [key]: shuffled });
  };

  const handleSaveQuestion = () => {
    if (!newText.trim()) return;

    if (editingQuestion) {
      const key = getListKey(editingQuestion.type);
      const updated = content[key].map(q =>
        q.id === editingQuestion.id
          ? {
              ...q,
              text: newText.trim(),
              urduText: newUrduText.trim() || undefined,
              options: editingQuestion.type === QuestionType.MCQ ? newOptions.filter(o => o.trim()) : undefined,
              correctOption: editingQuestion.type === QuestionType.MCQ ? newCorrectOption : undefined,
              marks: newMarks
            }
          : q
      );
      onUpdateContent({ ...content, [key]: updated });
      setEditingQuestion(null);
    } else {
      const newQ: Question = {
        id: crypto.randomUUID(),
        type: activeTab,
        text: newText.trim(),
        urduText: newUrduText.trim() || undefined,
        options: activeTab === QuestionType.MCQ ? newOptions.filter(o => o.trim()) : undefined,
        correctOption: activeTab === QuestionType.MCQ ? newCorrectOption : undefined,
        selected: true,
        marks: newMarks
      };
      const key = getListKey(activeTab);
      onUpdateContent({ ...content, [key]: [newQ, ...content[key]] });
    }

    // Reset form
    setNewText('');
    setNewUrduText('');
    setNewOptions(['', '', '', '']);
    setNewCorrectOption('');
    setShowAddModal(false);
  };

  const startEditQuestion = (q: Question) => {
    setEditingQuestion(q);
    setNewText(q.text);
    setNewUrduText(q.urduText || '');
    if (q.options && q.options.length === 4) {
      setNewOptions([...q.options]);
    } else {
      setNewOptions(['', '', '', '']);
    }
    setNewCorrectOption(q.correctOption || '');
    setNewMarks(q.marks || (q.type === QuestionType.MCQ ? 1 : q.type === QuestionType.SHORT ? 2 : 5));
    setShowAddModal(true);
  };

  const openCreateModal = () => {
    setEditingQuestion(null);
    setNewText('');
    setNewUrduText('');
    setNewOptions(['', '', '', '']);
    setNewCorrectOption('');
    setNewMarks(activeTab === QuestionType.MCQ ? 1 : activeTab === QuestionType.SHORT ? 2 : 5);
    setShowAddModal(true);
  };

  const getList = (type: QuestionType) => {
    switch (type) {
      case QuestionType.MCQ: return content.mcqs;
      case QuestionType.SHORT: return content.shortQuestions;
      case QuestionType.LONG: return content.longQuestions;
      case QuestionType.NUMERICAL: return content.numericals || [];
    }
  };

  const counts = {
    [QuestionType.MCQ]: content.mcqs.filter(q => q.selected).length,
    [QuestionType.SHORT]: content.shortQuestions.filter(q => q.selected).length,
    [QuestionType.LONG]: content.longQuestions.filter(q => q.selected).length,
    [QuestionType.NUMERICAL]: (content.numericals || []).filter(q => q.selected).length
  };

  const totals = {
    [QuestionType.MCQ]: content.mcqs.length,
    [QuestionType.SHORT]: content.shortQuestions.length,
    [QuestionType.LONG]: content.longQuestions.length,
    [QuestionType.NUMERICAL]: (content.numericals || []).length
  };

  const estimatedMarks = (counts[QuestionType.MCQ] * 1) +
    (counts[QuestionType.SHORT] * 2) +
    (counts[QuestionType.LONG] * 5) +
    (counts[QuestionType.NUMERICAL] * 5);

  const totalSelected = Object.values(counts).reduce((a, b) => a + b, 0);

  const availableTabs = [
    { type: QuestionType.MCQ, label: 'Section A: MCQs (1 Mark)', count: counts[QuestionType.MCQ], total: totals[QuestionType.MCQ] },
    { type: QuestionType.SHORT, label: 'Section B: Short Qs (2 Marks)', count: counts[QuestionType.SHORT], total: totals[QuestionType.SHORT] },
    { type: QuestionType.LONG, label: 'Section C: Long Qs (5 Marks)', count: counts[QuestionType.LONG], total: totals[QuestionType.LONG] }
  ];

  if (canHaveNumericals) {
    availableTabs.push({
      type: QuestionType.NUMERICAL,
      label: 'Section D: Numericals (5 Marks)',
      count: counts[QuestionType.NUMERICAL],
      total: totals[QuestionType.NUMERICAL]
    });
  }

  if (isGenerating) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center max-w-lg mx-auto space-y-4">
        <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-200 animate-pulse">
          <Sparkles className="w-6 h-6 animate-spin" />
        </div>
        <h3 className="text-xl font-bold tracking-tight text-slate-900">
          Generating Board Examination Questions
        </h3>
        <p className="text-sm text-slate-500 leading-relaxed">
          Extracting standard textbook exercises, past board questions, and SLO-based conceptual problems for <strong className="text-slate-800">{subject}</strong>.
        </p>
        <div className="flex items-center gap-1.5 pt-2">
          <span className="w-2 h-2 rounded-full bg-emerald-600 animate-ping" />
          <span className="text-xs font-mono text-slate-400">Connecting to PTB Curriculum Engine</span>
        </div>
      </div>
    );
  }

  const currentQuestions = getList(activeTab);

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Top Bar with Marks Summary */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">
            Exam Question Bank
          </h2>
          <p className="text-sm text-slate-500">
            Select, customize, or add questions for your test paper.
          </p>
        </div>

        {/* Live Estimated Marks Indicator */}
        <div className="flex items-center gap-3">
          <div className="bg-slate-50 border border-slate-200 px-3.5 py-1.5 rounded-xl text-right">
            <div className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">Marks Estimate</div>
            <div className="text-xl font-bold text-emerald-800 font-mono tabular-nums leading-tight">
              {estimatedMarks} <span className="text-xs text-slate-400 font-normal">Marks</span>
            </div>
          </div>
          <div className="bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl text-right hidden sm:block">
            <div className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">Total Questions</div>
            <div className="text-sm font-bold text-slate-700 font-mono tabular-nums">
              {totalSelected} Selected
            </div>
          </div>
        </div>
      </div>

      {/* Auto-Select & Preset Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs">
        <div className="flex items-center gap-1.5">
          <span className="text-slate-500 font-semibold mr-1">Auto-Select:</span>
          <button
            type="button"
            onClick={() => autoSelectMarks(25)}
            className="px-2.5 py-1 bg-white hover:bg-slate-100 border border-slate-200 rounded-md font-medium text-slate-700 transition-colors"
          >
            25 Marks Test
          </button>
          <button
            type="button"
            onClick={() => autoSelectMarks(50)}
            className="px-2.5 py-1 bg-white hover:bg-slate-100 border border-slate-200 rounded-md font-medium text-slate-700 transition-colors"
          >
            50 Marks Test
          </button>
          <button
            type="button"
            onClick={() => autoSelectMarks(60)}
            className="px-2.5 py-1 bg-white hover:bg-slate-100 border border-slate-200 rounded-md font-medium text-slate-700 transition-colors"
          >
            Board Standard
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowUrduText(!showUrduText)}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-md border text-xs transition-colors ${
              showUrduText
                ? 'bg-emerald-50 text-emerald-800 border-emerald-300 font-medium'
                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
            }`}
          >
            <Languages className="w-3.5 h-3.5" />
            {showUrduText ? 'Urdu Subtext: On' : 'Urdu Subtext: Off'}
          </button>

          <button
            type="button"
            onClick={shuffleTab}
            title="Randomize question sequence"
            className="flex items-center gap-1 px-2 py-1 bg-white hover:bg-slate-100 border border-slate-200 rounded-md text-slate-600 transition-colors"
          >
            <Shuffle className="w-3.5 h-3.5" /> Shuffle
          </button>

          <button
            type="button"
            onClick={openCreateModal}
            className="flex items-center gap-1 px-3 py-1 bg-emerald-700 hover:bg-emerald-800 text-white rounded-md font-medium transition-colors shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" /> Add Question
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-slate-200 overflow-x-auto pb-px">
        {availableTabs.map((tab) => {
          const isActive = activeTab === tab.type;
          return (
            <button
              key={tab.type}
              type="button"
              onClick={() => setActiveTab(tab.type)}
              className={`px-4 py-2.5 text-xs font-semibold whitespace-nowrap shrink-0 border-b-2 transition-all flex items-center gap-2 ${
                isActive
                  ? 'border-emerald-700 text-emerald-800 bg-emerald-50/50'
                  : 'border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-50'
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`px-1.5 py-0.5 rounded text-[11px] font-mono tabular-nums ${
                  isActive ? 'bg-emerald-700 text-white' : 'bg-slate-200 text-slate-600'
                }`}
              >
                {tab.count}/{tab.total}
              </span>
            </button>
          );
        })}
      </div>

      {/* Action strip for current tab */}
      <div className="flex items-center justify-between text-xs text-slate-500 px-1">
        <span>
          Showing {currentQuestions.length} questions in this section
        </span>
        <button
          type="button"
          onClick={selectAllInTab}
          className="text-emerald-700 font-semibold hover:underline"
        >
          {currentQuestions.length > 0 && currentQuestions.every(q => q.selected) ? 'Deselect All in Section' : 'Select All in Section'}
        </button>
      </div>

      {/* Questions List */}
      <div className="space-y-2.5 max-h-[52vh] overflow-y-auto pr-1">
        {currentQuestions.map((q, idx) => (
          <div
            key={q.id}
            className={`p-3.5 rounded-xl border transition-all ${
              q.selected
                ? 'border-emerald-500 bg-emerald-50/30 shadow-sm'
                : 'border-slate-200 bg-white hover:border-slate-300'
            }`}
          >
            <div className="flex items-start gap-3">
              {/* Checkbox */}
              <button
                type="button"
                onClick={() => toggleQuestion(activeTab, q.id)}
                className={`mt-0.5 w-5 h-5 rounded border flex items-center justify-center shrink-0 transition-colors ${
                  q.selected
                    ? 'bg-emerald-700 border-emerald-700 text-white'
                    : 'bg-white border-slate-300 hover:border-slate-400'
                }`}
              >
                {q.selected && <Check className="w-3.5 h-3.5" />}
              </button>

              {/* Question Body */}
              <div className="flex-1 min-w-0" onClick={() => toggleQuestion(activeTab, q.id)}>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-mono text-[11px] font-bold text-slate-400 uppercase">
                    Q{idx + 1}
                  </span>
                  {q.chapter && (
                    <span className="text-[11px] text-slate-500 truncate max-w-xs">
                      · {q.chapter}
                    </span>
                  )}
                  <span className="text-[11px] text-emerald-800 font-mono ml-auto">
                    [{q.marks || (activeTab === QuestionType.MCQ ? 1 : activeTab === QuestionType.SHORT ? 2 : 5)} M]
                  </span>
                </div>

                <p className={`text-sm leading-relaxed ${q.selected ? 'text-slate-900 font-medium' : 'text-slate-700'}`}>
                  {q.text}
                </p>

                {/* Urdu translation if enabled */}
                {showUrduText && q.urduText && (
                  <p className="font-urdu text-right text-emerald-950 text-sm mt-1 pt-1 border-t border-slate-100">
                    {q.urduText}
                  </p>
                )}

                {/* MCQ Options Display */}
                {activeTab === QuestionType.MCQ && q.options && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2.5 pt-2 border-t border-slate-100 text-xs">
                    {q.options.map((opt, i) => {
                      const isCorrect = q.correctOption === opt;
                      const letter = String.fromCharCode(65 + i);
                      return (
                        <div
                          key={i}
                          className={`px-2.5 py-1.5 rounded-lg border flex items-center gap-2 ${
                            isCorrect
                              ? 'border-emerald-300 bg-emerald-100/70 text-emerald-950 font-medium'
                              : 'border-slate-200 bg-slate-50/70 text-slate-600'
                          }`}
                        >
                          <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold font-mono ${
                            isCorrect ? 'bg-emerald-700 text-white' : 'bg-slate-200 text-slate-600'
                          }`}>
                            {letter}
                          </span>
                          <span className="truncate">{opt}</span>
                          {isCorrect && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700 ml-auto shrink-0" />}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Action Buttons: Edit / Delete */}
              <div className="flex items-center gap-1 shrink-0 ml-2">
                <button
                  type="button"
                  title="Edit question"
                  onClick={(e) => {
                    e.stopPropagation();
                    startEditQuestion(q);
                  }}
                  className="p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded transition-colors"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  title="Remove from bank"
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteQuestion(activeTab, q.id);
                  }}
                  className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}

        {currentQuestions.length === 0 && (
          <div className="text-center py-12 bg-slate-50 rounded-xl border border-dashed border-slate-200 text-slate-400">
            <Layers className="w-8 h-8 mx-auto mb-2 opacity-30" />
            <p className="text-sm font-medium">No questions currently in this section.</p>
            <button
              type="button"
              onClick={openCreateModal}
              className="mt-3 text-xs text-emerald-700 hover:underline font-semibold"
            >
              + Add a question manually
            </button>
          </div>
        )}
      </div>

      {/* Navigation Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-slate-100">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-1.5 text-slate-600 hover:text-slate-900 px-3 py-2 font-medium text-sm transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Chapters
        </button>

        <div className="flex items-center gap-4">
          <div className="text-right hidden sm:block">
            <span className="text-xs text-slate-400">Total Selected: </span>
            <strong className="text-sm text-slate-800 font-mono">{totalSelected}</strong>
            <span className="text-xs text-slate-400"> ({estimatedMarks} Marks)</span>
          </div>
          <button
            type="button"
            onClick={onNext}
            disabled={totalSelected === 0}
            className="flex items-center gap-2 bg-emerald-700 hover:bg-emerald-800 disabled:bg-slate-300 disabled:cursor-not-allowed text-white px-7 py-2.5 rounded-lg font-medium text-sm transition-colors shadow-sm"
          >
            Preview & Print Exam <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Add / Edit Question Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 max-w-lg w-full p-6 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-base">
                {editingQuestion ? 'Edit Question' : `Add Question to ${activeTab}`}
              </h3>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-600 text-lg leading-none"
              >
                &times;
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Question Text (English or Urdu)
                </label>
                <textarea
                  rows={3}
                  value={newText}
                  onChange={(e) => setNewText(e.target.value)}
                  placeholder="e.g. Define acceleration and write its SI unit."
                  className="w-full p-2.5 border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-none focus:border-emerald-600"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Urdu Translation / Text (Optional)
                </label>
                <input
                  type="text"
                  value={newUrduText}
                  onChange={(e) => setNewUrduText(e.target.value)}
                  placeholder="اردو عبارت یہاں لکھیں"
                  className="w-full p-2 border border-slate-200 rounded-lg text-sm font-urdu text-right focus:outline-none focus:border-emerald-600"
                />
              </div>

              {/* Marks Allocation */}
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Marks</label>
                <input
                  type="number"
                  min={1}
                  max={20}
                  value={newMarks}
                  onChange={(e) => setNewMarks(Number(e.target.value))}
                  className="w-24 p-2 border border-slate-200 rounded-lg text-sm font-mono focus:outline-none focus:border-emerald-600"
                />
              </div>

              {/* Options for MCQ */}
              {activeTab === QuestionType.MCQ && (
                <div className="space-y-2 pt-2 border-t border-slate-100">
                  <label className="font-semibold text-slate-700 block">MCQ Options (4 choices)</label>
                  {newOptions.map((opt, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <span className="w-5 text-center font-bold text-slate-400 font-mono">
                        {String.fromCharCode(65 + i)}
                      </span>
                      <input
                        type="text"
                        value={opt}
                        onChange={(e) => {
                          const updated = [...newOptions];
                          updated[i] = e.target.value;
                          setNewOptions(updated);
                        }}
                        placeholder={`Option ${String.fromCharCode(65 + i)}`}
                        className="flex-1 p-2 border border-slate-200 rounded-md text-xs focus:outline-none focus:border-emerald-600"
                      />
                      <input
                        type="radio"
                        name="correctOpt"
                        checked={newCorrectOption === opt && opt !== ''}
                        onChange={() => setNewCorrectOption(opt)}
                        title="Mark as correct answer"
                        className="accent-emerald-600 cursor-pointer"
                      />
                    </div>
                  ))}
                  <div className="text-[11px] text-slate-400">
                    Select the radio button beside the correct option for the Answer Key.
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveQuestion}
                disabled={!newText.trim()}
                className="px-5 py-2 text-xs font-semibold bg-emerald-700 hover:bg-emerald-800 disabled:bg-slate-300 text-white rounded-lg transition-colors shadow-sm"
              >
                {editingQuestion ? 'Update Question' : 'Add to Test'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};