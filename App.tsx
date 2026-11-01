import React, { useState } from 'react';
import { Step, ExamConfig, GeneratedContent } from './types';
import { generateExamQuestions } from './services/geminiService';
import { getQuestionsFromDatabase } from './database';
import { StepClassSubject } from './components/StepClassSubject';
import { StepChapters } from './components/StepChapters';
import { StepQuestions } from './components/StepQuestions';
import { StepPreviewPdf } from './components/StepPreviewPdf';
import { AlertCircle, RotateCcw } from 'lucide-react';

const INITIAL_CONFIG: ExamConfig = {
  className: '9th Class',
  subject: 'Physics',
  selectedChapters: ['Ch 1: Physical Quantities and Measurement'],
  institutionName: 'Punjab College',
  subHeading: 'Department of Science',
  paperHeading: 'Monthly Assessment',
  timeAllowed: '1 Hour',
  totalMarks: 35,
  includeAnswerKey: true,
  includeBubbleSheet: true,
  medium: 'english',
  layoutStyle: 'bise-board',
  fontSize: 'medium',
  watermarkText: '',
  instructions: 'Note: Section A is compulsory. Cutting and overwriting is not allowed.',
  examDate: new Date().toISOString().split('T')[0]
};

// Pre-seed with initial Physics Ch 1 questions
const INITIAL_CONTENT: GeneratedContent = getQuestionsFromDatabase(
  '9th Class',
  'Physics',
  ['Ch 1: Physical Quantities and Measurement']
);

const App: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<Step>('CLASS_SUBJECT');
  const [config, setConfig] = useState<ExamConfig>(INITIAL_CONFIG);
  const [content, setContent] = useState<GeneratedContent>(INITIAL_CONTENT);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateConfig = (updates: Partial<ExamConfig>) => {
    setConfig(prev => ({ ...prev, ...updates }));
    setError(null);
  };

  const handleGenerate = async () => {
    setCurrentStep('SELECT_QUESTIONS');
    setIsGenerating(true);
    setError(null);

    try {
      const data = await generateExamQuestions(
        config.className,
        config.subject,
        config.selectedChapters,
        config.medium,
        'Standard Board Pattern'
      );
      setContent(data);
    } catch (err: any) {
      console.warn("Question generation issue, using local database fallback:", err);
      const fallback = getQuestionsFromDatabase(config.className, config.subject, config.selectedChapters);
      setContent(fallback);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleReset = () => {
    setConfig(INITIAL_CONFIG);
    setContent(getQuestionsFromDatabase('9th Class', 'Physics', ['Ch 1: Physical Quantities and Measurement']));
    setCurrentStep('CLASS_SUBJECT');
    setError(null);
  };

  const stepList: Array<{ id: Step; label: string; number: number }> = [
    { id: 'CLASS_SUBJECT', label: 'Class & Subject', number: 1 },
    { id: 'CHAPTERS', label: 'Chapters', number: 2 },
    { id: 'SELECT_QUESTIONS', label: 'Questions', number: 3 },
    { id: 'PREVIEW_PDF', label: 'Print & PDF', number: 4 }
  ];

  const currentStepIdx = stepList.findIndex(s => s.id === currentStep);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans">
      {/* Top Bar following Top Bar Contract: 3 zones separated by gap-8 */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40 no-print">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-8">
          {/* Zone 1: Single text wordmark */}
          <a
            href="/"
            onClick={(e) => { e.preventDefault(); handleReset(); }}
            className="text-lg font-bold tracking-tight text-slate-900 whitespace-nowrap shrink-0 hover:text-emerald-800 transition-colors"
          >
            PTB Exam Generator
          </a>

          {/* Zone 2: Navigation Links / Step Breadcrumbs */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
            {stepList.map((step, idx) => {
              const isPast = currentStepIdx > idx;
              const isCurrent = currentStepIdx === idx;
              return (
                <button
                  key={step.id}
                  type="button"
                  onClick={() => {
                    if (isPast) setCurrentStep(step.id);
                  }}
                  disabled={!isPast && !isCurrent}
                  className={`flex items-center gap-2 whitespace-nowrap shrink-0 transition-colors text-xs font-semibold ${
                    isCurrent
                      ? 'text-emerald-800'
                      : isPast
                      ? 'text-slate-600 hover:text-slate-900 cursor-pointer'
                      : 'text-slate-300 cursor-not-allowed'
                  }`}
                >
                  <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-mono ${
                    isCurrent
                      ? 'bg-emerald-700 text-white'
                      : isPast
                      ? 'bg-slate-200 text-slate-700'
                      : 'bg-slate-100 text-slate-400'
                  }`}>
                    {step.number}
                  </span>
                  <span>{step.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Zone 3: 1 Primary Action */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={handleReset}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors whitespace-nowrap shrink-0"
              title="Reset test configuration"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Workspace */}
      <main className="flex-1 max-w-7xl mx-auto w-full p-4 sm:p-6 lg:p-8">
        {error && (
          <div className="mb-6 bg-amber-50 border border-amber-200 text-amber-900 px-4 py-3 rounded-xl flex items-center gap-2.5 text-sm no-print">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-xs border border-slate-200/80 p-5 sm:p-7 min-h-[620px]">
          {currentStep === 'CLASS_SUBJECT' && (
            <StepClassSubject
              config={config}
              onUpdate={updateConfig}
              onNext={() => setCurrentStep('CHAPTERS')}
            />
          )}

          {currentStep === 'CHAPTERS' && (
            <StepChapters
              config={config}
              onUpdate={updateConfig}
              onNext={handleGenerate}
              onBack={() => setCurrentStep('CLASS_SUBJECT')}
            />
          )}

          {currentStep === 'SELECT_QUESTIONS' && (
            <StepQuestions
              content={content}
              subject={config.subject}
              medium={config.medium}
              onUpdateContent={setContent}
              isGenerating={isGenerating}
              onRegenerate={handleGenerate}
              onNext={() => setCurrentStep('PREVIEW_PDF')}
              onBack={() => setCurrentStep('CHAPTERS')}
            />
          )}

          {currentStep === 'PREVIEW_PDF' && (
            <StepPreviewPdf
              config={config}
              content={content}
              onUpdateConfig={updateConfig}
              onBack={() => setCurrentStep('SELECT_QUESTIONS')}
            />
          )}
        </div>
      </main>

      {/* Quiet Footer */}
      <footer className="bg-white border-t border-slate-200 py-4 text-center text-slate-400 text-xs no-print">
        <p>&copy; {new Date().getFullYear()} Punjab Textbook Board Exam Paper Generator · Curriculum Aligned with BISE Punjab</p>
      </footer>
    </div>
  );
};

export default App;