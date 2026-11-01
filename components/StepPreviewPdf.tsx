import React, { useRef, useState } from 'react';
import jsPDF from 'jspdf';
import { ExamConfig, GeneratedContent, QuestionType } from '../types';
import {
  Download,
  ArrowLeft,
  Printer,
  ZoomIn,
  ZoomOut,
  Sliders,
  CheckCircle2,
  FileText
} from 'lucide-react';

interface Props {
  config: ExamConfig;
  content: GeneratedContent;
  onUpdateConfig: (updates: Partial<ExamConfig>) => void;
  onBack: () => void;
}

export const StepPreviewPdf: React.FC<Props> = ({ config, content, onUpdateConfig, onBack }) => {
  const printPaperRef = useRef<HTMLDivElement>(null);
  const [zoom, setZoom] = useState(0.85);
  const [showAnswerKey, setShowAnswerKey] = useState(config.includeAnswerKey ?? true);
  const [showBubbleSheet, setShowBubbleSheet] = useState(config.includeBubbleSheet ?? true);
  const [showUrdu, setShowUrdu] = useState(config.medium === 'bilingual' || config.medium === 'urdu');
  const [paperStyle, setPaperStyle] = useState<'board' | 'compact' | 'lined'>('board');

  const selectedMcqs = content.mcqs.filter(q => q.selected);
  const selectedShort = content.shortQuestions.filter(q => q.selected);
  const selectedLong = content.longQuestions.filter(q => q.selected);
  const selectedNumericals = (content.numericals || []).filter(q => q.selected);

  const calcTotalMarks = (selectedMcqs.length * 1) +
    (selectedShort.length * 2) +
    (selectedLong.length * 5) +
    (selectedNumericals.length * 5);

  const displayTotalMarks = config.totalMarks || calcTotalMarks;

  // Browser Print trigger (Best quality vector output for physical printers / photocopiers)
  const handlePrint = () => {
    window.print();
  };

  // jsPDF file generation
  const handleDownloadPdf = () => {
    const doc = new jsPDF({ orientation: 'p', unit: 'mm', format: 'a4' });
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 12;
    const contentWidth = pageWidth - (margin * 2);
    let yPos = 16;

    const checkPageBreak = (neededHeight: number) => {
      if (yPos + neededHeight > pageHeight - margin) {
        doc.addPage();
        yPos = margin;
      }
    };

    const addText = (
      text: string,
      size: number,
      font: string = 'helvetica',
      style: string = 'normal',
      align: 'left' | 'center' | 'right' = 'left'
    ) => {
      doc.setFont(font, style);
      doc.setFontSize(size);
      const lines = doc.splitTextToSize(text, contentWidth);
      const lineHeight = size * 0.42;
      checkPageBreak(lines.length * lineHeight + 2);
      const x = align === 'center' ? pageWidth / 2 : align === 'right' ? pageWidth - margin : margin;
      doc.text(lines, x, yPos, { align });
      yPos += lines.length * lineHeight + 2;
    };

    const drawLine = () => {
      doc.setDrawColor(0);
      doc.setLineWidth(0.3);
      doc.line(margin, yPos, pageWidth - margin, yPos);
      yPos += 4;
    };

    // Header
    const instName = config.institutionName || 'PUNJAB EXAMINATION SYSTEM';
    addText(instName.toUpperCase(), 16, 'helvetica', 'bold', 'center');
    if (config.subHeading) {
      addText(config.subHeading, 10, 'helvetica', 'normal', 'center');
    }
    addText(`${config.paperHeading || 'Monthly Assessment'} — Session 2025-26`, 11, 'helvetica', 'bold', 'center');
    addText(`Class: ${config.className}  |  Subject: ${config.subject}`, 10, 'helvetica', 'normal', 'center');
    drawLine();

    // Exam Metadata Bar
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.text(`Time Allowed: ${config.timeAllowed || '1 Hour'}`, margin, yPos);
    doc.text(`Total Marks: ${displayTotalMarks}`, pageWidth - margin, yPos, { align: 'right' });
    yPos += 5;

    // Student Info Strip
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.text('Student Name: _______________________', margin, yPos);
    doc.text('Roll No: [   |   |   |   |   ]', margin + 70, yPos);
    doc.text('Section: ________', pageWidth - margin, yPos, { align: 'right' });
    yPos += 6;
    drawLine();

    // Bubble Sheet on PDF if enabled
    if (showBubbleSheet && selectedMcqs.length > 0) {
      addText('OMR ANSWER SHEET (Fill circles with Black/Blue pen)', 9, 'helvetica', 'bold', 'center');
      yPos += 1;
      let bx = margin + 5;
      let by = yPos;
      doc.setFontSize(7);

      selectedMcqs.forEach((_, i) => {
        if (i > 0 && i % 15 === 0) {
          bx += 60;
          by = yPos;
        }
        doc.text(`${i + 1}.`, bx, by + 1);
        ['A', 'B', 'C', 'D'].forEach((opt, j) => {
          const cx = bx + 8 + (j * 7);
          doc.circle(cx, by, 2.2);
          doc.text(opt, cx, by + 0.8, { align: 'center' });
        });
        by += 5.5;
      });
      yPos = Math.max(by + 3, yPos + 18);
      drawLine();
    }

    // Section A: MCQs
    if (selectedMcqs.length > 0) {
      addText(`SECTION - A (Objective / Multiple Choice Questions) — Marks: ${selectedMcqs.length * 1}`, 11, 'helvetica', 'bold');
      doc.setFontSize(8);
      doc.setFont('helvetica', 'italic');
      doc.text('Note: Each question has four possible answers. Choose the correct option.', margin, yPos);
      yPos += 4;

      selectedMcqs.forEach((q, i) => {
        checkPageBreak(12);
        addText(`Q.1 (${i + 1})  ${q.text}`, 9.5, 'helvetica', 'bold');
        if (q.options && q.options.length > 0) {
          const optWidth = contentWidth / 4;
          q.options.forEach((opt, j) => {
            const letter = String.fromCharCode(65 + j);
            doc.setFont('helvetica', 'normal');
            doc.setFontSize(8.5);
            doc.text(`(${letter}) ${opt}`, margin + (j * optWidth), yPos);
          });
          yPos += 5;
        }
        yPos += 1.5;
      });
      yPos += 3;
      drawLine();
    }

    // Section B: Short Questions
    if (selectedShort.length > 0) {
      const shortMarks = selectedShort.length * 2;
      addText(`SECTION - B (Short Questions) — Marks: ${shortMarks}`, 11, 'helvetica', 'bold');
      doc.setFontSize(8);
      doc.setFont('helvetica', 'italic');
      doc.text(`Note: Write concise answers (3-5 lines). Each question carries 2 marks.`, margin, yPos);
      yPos += 4;

      selectedShort.forEach((q, i) => {
        checkPageBreak(paperStyle === 'lined' ? 18 : 8);
        addText(`Q.2 (${i + 1})  ${q.text}  [2]`, 9.5, 'helvetica', 'bold');
        if (paperStyle === 'lined') {
          doc.setDrawColor(220);
          doc.line(margin, yPos + 4, pageWidth - margin, yPos + 4);
          doc.line(margin, yPos + 9, pageWidth - margin, yPos + 9);
          yPos += 12;
        } else {
          yPos += 3;
        }
      });
      yPos += 3;
      drawLine();
    }

    // Section C: Long Questions
    if (selectedLong.length > 0) {
      const longMarks = selectedLong.length * 5;
      addText(`SECTION - C (Extensive / Detailed Questions) — Marks: ${longMarks}`, 11, 'helvetica', 'bold');
      doc.setFontSize(8);
      doc.setFont('helvetica', 'italic');
      doc.text(`Note: Attempt detailed answers with diagrams and derivations where applicable.`, margin, yPos);
      yPos += 4;

      selectedLong.forEach((q, i) => {
        checkPageBreak(paperStyle === 'lined' ? 24 : 10);
        addText(`Q.3 (${i + 1})  ${q.text}  [5]`, 9.5, 'helvetica', 'bold');
        if (paperStyle === 'lined') {
          doc.setDrawColor(220);
          doc.line(margin, yPos + 4, pageWidth - margin, yPos + 4);
          doc.line(margin, yPos + 9, pageWidth - margin, yPos + 9);
          doc.line(margin, yPos + 14, pageWidth - margin, yPos + 14);
          yPos += 18;
        } else {
          yPos += 4;
        }
      });
      yPos += 3;
      drawLine();
    }

    // Section D: Numericals
    if (selectedNumericals.length > 0) {
      const numMarks = selectedNumericals.length * 5;
      addText(`SECTION - D (Numerical Problems) — Marks: ${numMarks}`, 11, 'helvetica', 'bold');
      selectedNumericals.forEach((q, i) => {
        checkPageBreak(paperStyle === 'lined' ? 20 : 10);
        addText(`N.1 (${i + 1})  ${q.text}  [5]`, 9.5, 'helvetica', 'bold');
        yPos += paperStyle === 'lined' ? 14 : 4;
      });
      yPos += 3;
      drawLine();
    }

    // Teacher & Invigilator Signatures
    checkPageBreak(15);
    yPos += 6;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.text('Subject Teacher: ____________________', margin, yPos);
    doc.text('Examiner / Principal: ____________________', pageWidth - margin, yPos, { align: 'right' });

    // Answer Key Sheet (Optional Teacher's Page)
    if (showAnswerKey && selectedMcqs.length > 0) {
      doc.addPage();
      yPos = 16;
      addText('TEACHER\'S EVALUATION & ANSWER KEY (OFFICIAL)', 14, 'helvetica', 'bold', 'center');
      addText(`${config.className} — ${config.subject} (${config.paperHeading})`, 10, 'helvetica', 'normal', 'center');
      drawLine();

      addText('Section A: MCQs Correct Answers', 11, 'helvetica', 'bold');
      let kx = margin;
      let ky = yPos;
      selectedMcqs.forEach((q, i) => {
        const correct = q.correctOption || 'A';
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9);
        doc.text(`Q.${i + 1}: [ ${correct} ]`, kx, ky);
        ky += 5.5;
        if (ky > pageHeight - 30) {
          kx += 50;
          ky = yPos;
        }
      });
    }

    const filename = `${config.className}_${config.subject}_Exam.pdf`.replace(/\s+/g, '_');
    doc.save(filename);
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 max-w-7xl mx-auto">
      {/* Controls / Customization Side Panel */}
      <div className="w-full lg:w-80 shrink-0 space-y-4 no-print">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold tracking-tight text-slate-900">
            Paper & Print
          </h2>
          <button
            type="button"
            onClick={onBack}
            className="text-xs text-slate-500 hover:text-slate-800 font-medium flex items-center gap-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Edit Bank
          </button>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={handlePrint}
            className="flex items-center justify-center gap-1.5 bg-emerald-700 hover:bg-emerald-800 text-white py-2.5 px-3 rounded-xl font-semibold text-xs transition-colors shadow-sm"
          >
            <Printer className="w-4 h-4" /> Print Paper
          </button>
          <button
            type="button"
            onClick={handleDownloadPdf}
            className="flex items-center justify-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-white py-2.5 px-3 rounded-xl font-semibold text-xs transition-colors shadow-sm"
          >
            <Download className="w-4 h-4" /> Download PDF
          </button>
        </div>

        {/* Paper Customization Box */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-3.5 text-xs">
          <div className="flex items-center gap-1.5 font-semibold text-slate-800 pb-2 border-b border-slate-100">
            <Sliders className="w-3.5 h-3.5 text-emerald-600" />
            Paper Settings
          </div>

          <div>
            <label className="text-slate-500 font-medium block mb-1">Institution Name</label>
            <input
              type="text"
              value={config.institutionName}
              onChange={(e) => onUpdateConfig({ institutionName: e.target.value })}
              className="w-full px-2.5 py-1.5 border border-slate-200 rounded-md bg-slate-50 focus:bg-white focus:outline-none focus:border-emerald-600"
            />
          </div>

          <div>
            <label className="text-slate-500 font-medium block mb-1">Campus / Subheading</label>
            <input
              type="text"
              value={config.subHeading || ''}
              onChange={(e) => onUpdateConfig({ subHeading: e.target.value })}
              placeholder="e.g. Science Wing / Main Campus"
              className="w-full px-2.5 py-1.5 border border-slate-200 rounded-md bg-slate-50 focus:bg-white focus:outline-none focus:border-emerald-600"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-slate-500 font-medium block mb-1">Time Allowed</label>
              <input
                type="text"
                value={config.timeAllowed}
                onChange={(e) => onUpdateConfig({ timeAllowed: e.target.value })}
                className="w-full px-2.5 py-1.5 border border-slate-200 rounded-md bg-slate-50 focus:bg-white focus:outline-none focus:border-emerald-600"
              />
            </div>
            <div>
              <label className="text-slate-500 font-medium block mb-1">Total Marks</label>
              <input
                type="number"
                value={config.totalMarks || calcTotalMarks}
                onChange={(e) => onUpdateConfig({ totalMarks: Number(e.target.value) })}
                className="w-full px-2.5 py-1.5 border border-slate-200 rounded-md bg-slate-50 focus:bg-white focus:outline-none focus:border-emerald-600 font-mono"
              />
            </div>
          </div>

          {/* Paper Layout Style */}
          <div>
            <label className="text-slate-500 font-medium block mb-1">Layout Format</label>
            <div className="grid grid-cols-3 gap-1">
              {[
                { id: 'board', label: 'Board Style' },
                { id: 'compact', label: 'Compact' },
                { id: 'lined', label: 'With Lines' }
              ].map(st => (
                <button
                  key={st.id}
                  type="button"
                  onClick={() => setPaperStyle(st.id as any)}
                  className={`py-1.5 text-[11px] rounded border font-medium transition-colors ${
                    paperStyle === st.id
                      ? 'border-emerald-600 bg-emerald-50 text-emerald-900'
                      : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {st.label}
                </button>
              ))}
            </div>
          </div>

          {/* Toggles */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={showBubbleSheet}
                onChange={(e) => setShowBubbleSheet(e.target.checked)}
                className="accent-emerald-600 rounded"
              />
              <span className="text-slate-700 font-medium">Include OMR Bubble Sheet</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={showAnswerKey}
                onChange={(e) => setShowAnswerKey(e.target.checked)}
                className="accent-emerald-600 rounded"
              />
              <span className="text-slate-700 font-medium">Include Answer Key Sheet</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={showUrdu}
                onChange={(e) => setShowUrdu(e.target.checked)}
                className="accent-emerald-600 rounded"
              />
              <span className="text-slate-700 font-medium">Bilingual Urdu Subtext</span>
            </label>
          </div>

          {/* Summary */}
          <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-500 space-y-1">
            <div className="flex justify-between">
              <span>MCQs ({selectedMcqs.length}):</span>
              <span className="font-mono">{selectedMcqs.length * 1} Marks</span>
            </div>
            <div className="flex justify-between">
              <span>Short Qs ({selectedShort.length}):</span>
              <span className="font-mono">{selectedShort.length * 2} Marks</span>
            </div>
            <div className="flex justify-between">
              <span>Long Qs ({selectedLong.length}):</span>
              <span className="font-mono">{selectedLong.length * 5} Marks</span>
            </div>
            {selectedNumericals.length > 0 && (
              <div className="flex justify-between">
                <span>Numericals ({selectedNumericals.length}):</span>
                <span className="font-mono">{selectedNumericals.length * 5} Marks</span>
              </div>
            )}
            <div className="flex justify-between font-bold text-slate-800 pt-1 border-t border-slate-100">
              <span>Grand Total:</span>
              <span className="font-mono">{calcTotalMarks} Marks</span>
            </div>
          </div>
        </div>
      </div>

      {/* Preview Viewport */}
      <div className="flex-1 bg-slate-200/70 p-4 sm:p-8 rounded-2xl border border-slate-300 relative overflow-hidden flex flex-col items-center">
        {/* Zoom Bar */}
        <div className="absolute top-4 right-4 z-20 flex items-center gap-1.5 bg-white/90 backdrop-blur-xs p-1.5 rounded-xl shadow-md border border-slate-200 text-xs no-print">
          <button
            type="button"
            onClick={() => setZoom(z => Math.max(0.4, Number((z - 0.1).toFixed(2))))}
            className="p-1 hover:bg-slate-100 rounded text-slate-600"
            title="Zoom Out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <span className="font-mono font-medium px-1 text-slate-700">
            {Math.round(zoom * 100)}%
          </span>
          <button
            type="button"
            onClick={() => setZoom(z => Math.min(1.4, Number((z + 0.1).toFixed(2))))}
            className="p-1 hover:bg-slate-100 rounded text-slate-600"
            title="Zoom In"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
        </div>

        {/* Paper Container */}
        <div className="w-full overflow-auto flex justify-center py-4">
          <div
            ref={printPaperRef}
            className="bg-white shadow-xl origin-top transition-transform duration-100 text-slate-900 print-container"
            style={{
              width: '210mm',
              minHeight: '297mm',
              padding: '16mm 14mm',
              transform: `scale(${zoom})`,
              marginBottom: '100px'
            }}
          >
            {/* Header Section */}
            <div className="text-center pb-3 border-b-2 border-slate-900">
              <h1 className="text-xl sm:text-2xl font-black uppercase tracking-wider text-slate-900">
                {config.institutionName || 'PUNJAB EXAMINATION SYSTEM'}
              </h1>
              {config.subHeading && (
                <p className="text-xs font-semibold text-slate-600 uppercase tracking-widest mt-0.5">
                  {config.subHeading}
                </p>
              )}
              <h2 className="text-sm font-bold text-slate-800 mt-1 uppercase tracking-tight">
                {config.paperHeading || 'Monthly Assessment'} — Session 2025-26
              </h2>
              <div className="flex justify-center items-center gap-4 text-xs font-semibold text-slate-700 mt-1">
                <span>CLASS: <strong>{config.className}</strong></span>
                <span>·</span>
                <span>SUBJECT: <strong>{config.subject}</strong></span>
                <span>·</span>
                <span>MEDIUM: <strong>{config.medium.toUpperCase()}</strong></span>
              </div>
            </div>

            {/* Time / Marks / Date Grid */}
            <div className="flex justify-between items-center py-2 border-b border-slate-900 text-xs font-bold font-mono">
              <div>TIME ALLOWED: {config.timeAllowed || '1 Hour'}</div>
              <div>DATE: {config.examDate || new Date().toISOString().split('T')[0]}</div>
              <div>TOTAL MARKS: {displayTotalMarks}</div>
            </div>

            {/* Student Roll Number & Name Slip */}
            <div className="grid grid-cols-12 gap-2 py-2 border-b border-slate-300 text-xs items-center">
              <div className="col-span-5 flex items-center gap-1.5">
                <span className="font-semibold shrink-0">Name:</span>
                <span className="border-b border-dotted border-slate-400 flex-1 h-4"></span>
              </div>
              <div className="col-span-4 flex items-center gap-1.5">
                <span className="font-semibold shrink-0">Roll No:</span>
                <div className="flex border border-slate-900 font-mono text-center">
                  {[1, 2, 3, 4, 5, 6].map(b => (
                    <span key={b} className="w-4 h-4 border-r last:border-r-0 border-slate-900"></span>
                  ))}
                </div>
              </div>
              <div className="col-span-3 flex items-center gap-1.5 justify-end">
                <span className="font-semibold shrink-0">Section:</span>
                <span className="border-b border-dotted border-slate-400 w-16 h-4"></span>
              </div>
            </div>

            {/* OMR Bubble Sheet Grid */}
            {showBubbleSheet && selectedMcqs.length > 0 && (
              <div className="my-4 p-3 border border-slate-300 rounded-lg bg-slate-50/50">
                <div className="text-center font-bold text-[10px] uppercase tracking-wider text-slate-600 mb-2">
                  OMR Bubble Answer Sheet (Fill bubbles completely with Black/Blue Pen)
                </div>
                <div className="grid grid-cols-5 gap-y-2 gap-x-4 text-[10px]">
                  {selectedMcqs.map((_, i) => (
                    <div key={i} className="flex items-center gap-1">
                      <span className="font-bold text-slate-500 w-4 font-mono">{i + 1}.</span>
                      {['A', 'B', 'C', 'D'].map(o => (
                        <span
                          key={o}
                          className="w-4 h-4 rounded-full border border-slate-400 flex items-center justify-center text-[8px] font-bold text-slate-600 bg-white"
                        >
                          {o}
                        </span>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Section A: MCQs */}
            {selectedMcqs.length > 0 && (
              <div className="my-5">
                <div className="flex justify-between items-center bg-slate-900 text-white px-2.5 py-1 text-xs font-bold uppercase tracking-wider mb-3">
                  <span>SECTION - A (Multiple Choice Questions)</span>
                  <span className="font-mono">Marks: {selectedMcqs.length * 1}</span>
                </div>
                <p className="text-[11px] italic text-slate-600 mb-3">
                  Q.1: Choose the correct option for each question. Cutting, overwriting or using multiple options is invalid.
                </p>

                <div className="space-y-3">
                  {selectedMcqs.map((q, i) => (
                    <div key={i} className="text-xs">
                      <div className="flex items-start gap-1 font-semibold text-slate-900">
                        <span className="font-mono shrink-0">({i + 1})</span>
                        <span className="flex-1">{q.text}</span>
                      </div>

                      {showUrdu && q.urduText && (
                        <div className="font-urdu text-right text-emerald-950 text-xs pr-4 mt-0.5">
                          {q.urduText}
                        </div>
                      )}

                      {q.options && q.options.length > 0 && (
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-1.5 pl-4 text-slate-800 text-[11px]">
                          {q.options.map((opt, j) => (
                            <div key={j} className="flex items-center gap-1">
                              <span className="font-bold font-mono">({String.fromCharCode(65 + j)})</span>
                              <span>{opt}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Section B: Short Questions */}
            {selectedShort.length > 0 && (
              <div className="my-6">
                <div className="flex justify-between items-center bg-slate-900 text-white px-2.5 py-1 text-xs font-bold uppercase tracking-wider mb-3">
                  <span>SECTION - B (Short Questions)</span>
                  <span className="font-mono">Marks: {selectedShort.length * 2}</span>
                </div>
                <p className="text-[11px] italic text-slate-600 mb-3">
                  Q.2: Write concise answers to the following questions. Each carries 2 marks.
                </p>

                <div className="space-y-3.5">
                  {selectedShort.map((q, i) => (
                    <div key={i} className="text-xs">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-start gap-1 font-semibold text-slate-900">
                          <span className="font-mono shrink-0">({i + 1})</span>
                          <span>{q.text}</span>
                        </div>
                        <span className="font-mono text-[11px] text-slate-600 shrink-0 font-bold">[2]</span>
                      </div>

                      {showUrdu && q.urduText && (
                        <div className="font-urdu text-right text-emerald-950 text-xs pr-4 mt-0.5">
                          {q.urduText}
                        </div>
                      )}

                      {paperStyle === 'lined' && (
                        <div className="mt-2 space-y-2 pl-4">
                          <div className="border-b border-dashed border-slate-200 h-3"></div>
                          <div className="border-b border-dashed border-slate-200 h-3"></div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Section C: Long Questions */}
            {selectedLong.length > 0 && (
              <div className="my-6">
                <div className="flex justify-between items-center bg-slate-900 text-white px-2.5 py-1 text-xs font-bold uppercase tracking-wider mb-3">
                  <span>SECTION - C (Extensive / Long Questions)</span>
                  <span className="font-mono">Marks: {selectedLong.length * 5}</span>
                </div>
                <p className="text-[11px] italic text-slate-600 mb-3">
                  Q.3: Answer the following questions in detail with diagrams and equations where required.
                </p>

                <div className="space-y-4">
                  {selectedLong.map((q, i) => (
                    <div key={i} className="text-xs">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-start gap-1 font-semibold text-slate-900">
                          <span className="font-mono shrink-0">({i + 1})</span>
                          <span>{q.text}</span>
                        </div>
                        <span className="font-mono text-[11px] text-slate-600 shrink-0 font-bold">[5]</span>
                      </div>

                      {showUrdu && q.urduText && (
                        <div className="font-urdu text-right text-emerald-950 text-xs pr-4 mt-0.5">
                          {q.urduText}
                        </div>
                      )}

                      {paperStyle === 'lined' && (
                        <div className="mt-2 space-y-2 pl-4">
                          <div className="border-b border-dashed border-slate-200 h-3"></div>
                          <div className="border-b border-dashed border-slate-200 h-3"></div>
                          <div className="border-b border-dashed border-slate-200 h-3"></div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Section D: Numericals */}
            {selectedNumericals.length > 0 && (
              <div className="my-6">
                <div className="flex justify-between items-center bg-slate-900 text-white px-2.5 py-1 text-xs font-bold uppercase tracking-wider mb-3">
                  <span>SECTION - D (Numerical Problems)</span>
                  <span className="font-mono">Marks: {selectedNumericals.length * 5}</span>
                </div>
                <div className="space-y-4">
                  {selectedNumericals.map((q, i) => (
                    <div key={i} className="text-xs">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-start gap-1 font-semibold text-slate-900">
                          <span className="font-mono shrink-0">N.({i + 1})</span>
                          <span>{q.text}</span>
                        </div>
                        <span className="font-mono text-[11px] text-slate-600 shrink-0 font-bold">[5]</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Footer / Teacher Signatures */}
            <div className="pt-8 mt-6 border-t border-slate-300 flex justify-between text-xs font-bold text-slate-700">
              <div>Subject Teacher: ________________________</div>
              <div>Principal / Controller: ________________________</div>
            </div>

            {/* Answer Key Sheet on Print Preview if enabled */}
            {showAnswerKey && selectedMcqs.length > 0 && (
              <div className="mt-12 pt-6 border-t-2 border-dashed border-slate-400 page-break">
                <div className="text-center pb-2">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900">
                    Official Answer Key & Evaluation Guide (Teacher Copy)
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    {config.className} · {config.subject} · {config.paperHeading}
                  </p>
                </div>

                <div className="mt-3 p-3 bg-slate-50 border border-slate-200 rounded-lg">
                  <div className="text-xs font-bold text-slate-700 mb-2">Section A: MCQs Key</div>
                  <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 text-xs font-mono">
                    {selectedMcqs.map((q, i) => (
                      <div key={i} className="p-1.5 bg-white border border-slate-200 rounded text-center">
                        <span className="text-slate-400 text-[10px]">Q.{i + 1}: </span>
                        <strong className="text-emerald-700">{q.correctOption || 'A'}</strong>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};