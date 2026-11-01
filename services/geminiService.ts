import { Question, QuestionType, GeneratedContent } from '../types';
import { getQuestionsFromDatabase } from '../database';

export const generateExamQuestions = async (
  className: string,
  subject: string,
  chapters: string[],
  medium: 'english' | 'urdu' | 'bilingual' = 'english',
  difficulty: string = 'Standard Board Pattern'
): Promise<GeneratedContent> => {
  // 1. Fetch available questions from local database immediately
  const dbData = getQuestionsFromDatabase(className, subject, chapters);
  const isPhysics = subject.toLowerCase().includes('physics');

  try {
    const response = await fetch('/api/generate-questions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        className,
        subject,
        chapters,
        medium,
        difficulty,
      }),
    });

    if (!response.ok) {
      console.warn('AI generation endpoint returned non-200, using local question bank.', response.status);
      return dbData;
    }

    const json = await response.json();
    if (!json.success || !json.data) {
      return dbData;
    }

    const parsedData = json.data;

    const map = (items: any[], type: QuestionType, defaultMarks: number) =>
      (items || []).map((i: any) => ({
        ...i,
        id: crypto.randomUUID(),
        type,
        selected: true,
        chapter: i.chapter || chapters[0],
        marks: i.marks || defaultMarks,
        urduText: i.urduText || undefined
      }));

    const merge = (local: Question[], aiGenerated: Question[]) => {
      const seen = new Set(local.map(q => q.text.toLowerCase().trim()));
      return [...local, ...aiGenerated.filter(q => !seen.has(q.text.toLowerCase().trim()))];
    };

    return {
      mcqs: merge(dbData.mcqs, map(parsedData.mcqs, QuestionType.MCQ, 1)),
      shortQuestions: merge(dbData.shortQuestions, map(parsedData.shortQuestions, QuestionType.SHORT, 2)),
      longQuestions: merge(dbData.longQuestions, map(parsedData.longQuestions, QuestionType.LONG, 5)),
      numericals: isPhysics ? merge(dbData.numericals, map(parsedData.numericals, QuestionType.NUMERICAL, 5)) : []
    };
  } catch (error) {
    console.warn('Network error reaching AI endpoint, falling back to local database:', error);
    return dbData;
  }
};