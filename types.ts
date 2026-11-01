export enum QuestionType {
  MCQ = 'MCQ',
  SHORT = 'SHORT',
  LONG = 'LONG',
  NUMERICAL = 'NUMERICAL'
}

export interface Question {
  id: string;
  type: QuestionType;
  text: string;
  urduText?: string;
  options?: string[]; // Only for MCQs
  correctOption?: string; // Only for MCQs (answer key)
  chapter?: string;
  selected: boolean;
  marks?: number;
}

export interface GeneratedContent {
  mcqs: Question[];
  shortQuestions: Question[];
  longQuestions: Question[];
  numericals: Question[];
}

export interface ExamConfig {
  className: string;
  subject: string;
  selectedChapters: string[];
  institutionName: string;
  subHeading: string;
  paperHeading: string;
  timeAllowed: string;
  totalMarks: number;
  includeAnswerKey: boolean;
  includeBubbleSheet: boolean;
  medium: 'english' | 'urdu' | 'bilingual';
  layoutStyle: 'standard' | 'bise-board' | 'compact';
  fontSize: 'small' | 'medium' | 'large';
  watermarkText: string;
  instructions: string;
  examDate: string;
}

export interface SyllabusData {
  classes: string[];
  subjects: Record<string, string[]>; // Map class to subjects
  chapters: Record<string, string[]>; // Map subject (composite key usually) to chapters
}

export type Step = 'CLASS_SUBJECT' | 'CHAPTERS' | 'SELECT_QUESTIONS' | 'PREVIEW_PDF';