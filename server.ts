import express from 'express';
import cors from 'cors';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  app.use(cors());
  app.use(express.json({ limit: '10mb' }));

  const apiKey = process.env.GEMINI_API_KEY || process.env.API_KEY;
  const ai = apiKey
    ? new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          },
        },
      })
    : null;

  app.post('/api/generate-questions', async (req, res) => {
    try {
      const { className, subject, chapters, medium, difficulty } = req.body;

      if (!chapters || !Array.isArray(chapters) || chapters.length === 0) {
        return res.status(400).json({ error: 'Chapters are required' });
      }

      if (!ai) {
        return res.status(503).json({
          error: 'Gemini API key is not configured on the server.',
          useFallback: true,
        });
      }

      const isPhysics = (subject || '').toLowerCase().includes('physics');
      const isChemistry = (subject || '').toLowerCase().includes('chemistry');
      const needNumericals = isPhysics || (isChemistry && (className.includes('11') || className.includes('12')));

      const questionSchema = {
        type: Type.OBJECT,
        properties: {
          mcqs: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                text: { type: Type.STRING },
                options: { type: Type.ARRAY, items: { type: Type.STRING } },
                correctOption: { type: Type.STRING },
                chapter: { type: Type.STRING },
                urduText: { type: Type.STRING }
              },
              required: ["text", "options", "correctOption"]
            }
          },
          shortQuestions: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                text: { type: Type.STRING },
                chapter: { type: Type.STRING },
                urduText: { type: Type.STRING }
              },
              required: ["text"]
            }
          },
          longQuestions: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                text: { type: Type.STRING },
                chapter: { type: Type.STRING },
                urduText: { type: Type.STRING }
              },
              required: ["text"]
            }
          },
          numericals: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                text: { type: Type.STRING },
                chapter: { type: Type.STRING }
              },
              required: ["text"]
            }
          }
        },
        required: ["mcqs", "shortQuestions", "longQuestions", "numericals"]
      };

      const languageInstruction = medium === 'urdu' 
        ? 'Generate questions primarily in authentic Urdu (Nastaliq style script or Urdu terminology) for Urdu medium students.'
        : medium === 'bilingual'
        ? 'Provide each question with its English text and accurate Urdu translation (in urduText) matching official BISE Punjab Board bilingual exam paper format.'
        : 'Generate questions in standard English medium textbook language. You may also provide urduText if convenient for bilingual preview.';

      const prompt = `You are a senior Punjab Textbook Board (PTB) and BISE examination paper setter for Punjab, Pakistan (Boards: Lahore, Rawalpindi, Faisalabad, Gujranwala, Multan, Sahiwal, Sargodha, Bahawalpur, DG Khan).

Target:
- Class/Grade: ${className}
- Subject: ${subject}
- Selected Chapters: ${chapters.join('; ')}
- Medium: ${medium || 'English'}
- Difficulty / Style: ${difficulty || 'Standard Board Exam (SLO & Exercise based)'}

${languageInstruction}

Task:
Generate a high-yield, authentic exam question bank:
1. 15-20 Multiple Choice Questions (MCQs) with 4 realistic options (A, B, C, D) and specify the exact correctOption.
2. 12-16 Conceptual and Exercise Short Questions (each worth 2 marks in board pattern).
3. 4-6 Comprehensive Long Questions (each worth 4-5 marks or part (a)/(b) extensive questions).
4. ${needNumericals ? '4-6 Exercise or past paper numerical problems with clear given values and units.' : 'Keep numericals empty array if not applicable.'}

Ensure strict adherence to Punjab Textbook Board syllabus, past board papers, and modern SLO (Student Learning Outcomes) guidelines.
Return valid JSON adhering to the provided schema.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: questionSchema,
          systemInstruction: 'You are an expert exam paper setter for Punjab Textbook Board (PTB) Pakistan. Generate accurate, error-free questions conforming strictly to the official syllabus.',
        }
      });

      const parsed = JSON.parse(response.text || '{}');
      return res.json({ success: true, data: parsed });
    } catch (err: any) {
      console.error('Server Gemini Generation Error:', err);
      return res.status(500).json({
        error: err.message || 'Failed to generate questions with AI.',
        useFallback: true
      });
    }
  });

  // Health check endpoint
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', hasKey: Boolean(apiKey) });
  });

  // Vite integration
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true, host: '0.0.0.0', port: PORT },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch(err => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
