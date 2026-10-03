import { useRef, useState } from 'react';
import type { ChangeEvent, DragEvent, FormEvent } from 'react';
import {
  Check,
  CircleAlert,
  ClipboardCopy,
  FileText,
  Sparkles,
  Trash2,
  Upload,
} from 'lucide-react';
import type { NewDocumentInput, SandboxDocument } from '../types';
import { extractDocxText, extractPdfText } from '../lib/extract';

const MAX_CUSTOM_DOCS = 5;
const DEFAULT_PASTE_TITLE = 'Pasted Contract Agreement';

interface DocumentInputPanelProps {
  documents: SandboxDocument[];
  activeDocId: string;
  onSelectDocument: (id: string) => void;
  onAddDocuments: (docs: NewDocumentInput[]) => void;
  onDeleteDocument: (id: string) => void;
}

function formatFileSize(size?: number): string {
  if (!size) return 'Pasted Text';
  if (size < 1024) return `${size} B`;
  const kilobytes = size / 1024;
  return kilobytes < 1024
    ? `${kilobytes.toFixed(1)} KB`
    : `${(kilobytes / 1024).toFixed(1)} MB`;
}

async function readFileAsDocument(file: File): Promise<NewDocumentInput> {
  const extension = file.name.split('.').pop()?.toLowerCase();

  if (extension === 'txt') {
    const text = await file.text();
    if (!text.trim()) throw new Error(`"${file.name}" is empty.`);
    return {
      title: file.name.replace(/\.txt$/i, ''),
      rawText: text,
      size: file.size,
    };
  }

  if (extension === 'pdf') {
    const text = await extractPdfText(file);
    return {
      title: file.name.replace(/\.pdf$/i, ''),
      rawText: text,
      size: file.size,
    };
  }

  if (extension === 'docx') {
    const text = await extractDocxText(file);
    return {
      title: file.name.replace(/\.docx$/i, ''),
      rawText: text,
      size: file.size,
    };
  }

  throw extension === 'doc'
    ? new Error(
        `"${file.name}" is a legacy .doc file, which isn't supported — please save it as .docx or paste the text directly.`,
      )
    : new Error(`"${file.name}" has an unsupported format.`);
}

export default function DocumentInputPanel({
  documents,
  activeDocId,
  onSelectDocument,
  onAddDocuments,
  onDeleteDocument,
}: DocumentInputPanelProps) {
  const [pastedText, setPastedText] = useState('');
  const [pastedTitle, setPastedTitle] = useState(DEFAULT_PASTE_TITLE);
  const [isDragging, setIsDragging] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const presetDocuments = documents.filter((doc) => !doc.isCustom);
  const customDocuments = documents.filter((doc) => doc.isCustom);
  const customCount = customDocuments.length;

  const handleFiles = async (fileList: FileList) => {
    setErrorMessage(null);
    setSuccessMessage(null);

    const files = Array.from(fileList);
    if (files.length === 0) return;

    const remainingSlots = MAX_CUSTOM_DOCS - customCount;
    if (remainingSlots <= 0) {
      setErrorMessage(
        'Workspace capacity reached (5/5 files). Please delete an existing file first.',
      );
      return;
    }

    const acceptedFiles = files.slice(0, remainingSlots);
    const skippedCount = files.length - acceptedFiles.length;
    const loadedDocs: NewDocumentInput[] = [];
    const errors: string[] = [];

    const results = await Promise.allSettled(acceptedFiles.map(readFileAsDocument));
    results.forEach((result) => {
      if (result.status === 'fulfilled') {
        loadedDocs.push(result.value);
      } else {
        errors.push((result.reason as Error).message);
      }
    });

    if (loadedDocs.length > 0) {
      onAddDocuments(loadedDocs);
      let message = `Successfully loaded ${loadedDocs.length} file(s) into sandbox buffer.`;
      if (skippedCount > 0) {
        message += ` Skipped ${skippedCount} file(s) due to workspace limit (max 5 custom docs).`;
      }
      setSuccessMessage(message);
    }

    if (errors.length > 0) {
      setErrorMessage(`Errors: ${errors.join('; ')}`);
    }
  };

  const handleDragOver = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
    if (event.dataTransfer.files) void handleFiles(event.dataTransfer.files);
  };

  const handleFileInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) void handleFiles(event.target.files);
  };

  const handlePasteSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!pastedText.trim()) {
      setErrorMessage('Please enter some text in the custom document area.');
      return;
    }
    if (customCount >= MAX_CUSTOM_DOCS) {
      setErrorMessage(
        'Workspace is at capacity (5/5 custom documents). Please delete an existing file first.',
      );
      return;
    }
    onAddDocuments([{ title: pastedTitle || DEFAULT_PASTE_TITLE, rawText: pastedText }]);
    setSuccessMessage('Custom text loaded successfully to local buffer.');
    setErrorMessage(null);
    setPastedText('');
  };

  const selectDocument = (id: string) => {
    onSelectDocument(id);
    setSuccessMessage(null);
    setErrorMessage(null);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xs font-bold uppercase tracking-widest text-[#003B5C] font-mono flex items-center gap-1.5 mb-3">
          <Sparkles className="w-4 h-4 text-[#003B5C]" />
          01. Document Input
        </h3>
        <p className="text-xs text-gray-600 leading-relaxed font-medium">
          Upload up to 5 custom documents simultaneously or select corporate presets to perform
          high-finance anonymization.
        </p>
      </div>

      <div className="space-y-2">
        <span className="text-[9px] font-mono uppercase text-gray-400 font-bold tracking-wider">
          Corporate Presets
        </span>
        <div className="grid grid-cols-1 gap-2">
          {presetDocuments.map((doc) => {
            const isActive = activeDocId === doc.id;
            return (
              <button
                key={doc.id}
                onClick={() => selectDocument(doc.id)}
                className={`w-full text-left p-3 rounded-none border transition-all flex items-start gap-3 group ${isActive ? 'bg-white border-[#003B5C] shadow-xs ring-1 ring-[#003B5C]' : 'bg-gray-50 border-gray-200 hover:bg-white hover:border-[#003B5C]'}`}
              >
                <div
                  className={`p-2 rounded-none ${isActive ? 'bg-[#003B5C]/10 text-[#003B5C]' : 'bg-white border border-gray-200 text-gray-500 group-hover:bg-gray-50'}`}
                >
                  <FileText className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center gap-2">
                    <span className="font-serif text-[13px] font-bold text-[#003B5C] truncate">
                      {doc.title}
                    </span>
                    <span className="text-[9px] font-mono bg-white px-1.5 py-0.5 rounded-none border border-gray-200 text-gray-500 uppercase tracking-wide">
                      Preset
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-500 mt-0.5 leading-snug truncate">
                    Verify client-side legal redactions on corporate sample files.
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="space-y-2 border-t border-gray-100 pt-4">
        <div className="flex justify-between items-center text-[9px] font-mono uppercase font-bold tracking-wider">
          <span className="text-gray-400">Sandbox Buffer Uploads</span>
          <span className={customCount >= MAX_CUSTOM_DOCS ? 'text-amber-600' : 'text-[#003B5C]'}>
            {customCount} / 5 Slots used
          </span>
        </div>
        {customDocuments.length === 0 ? (
          <div className="p-3 border border-dashed border-gray-200 text-center text-[11px] text-gray-400 font-medium">
            No custom files loaded. Drag up to 5 files below.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-2 max-h-56 overflow-y-auto pr-1">
            {customDocuments.map((doc) => {
              const isActive = activeDocId === doc.id;
              return (
                <div
                  key={doc.id}
                  onClick={() => selectDocument(doc.id)}
                  className={`w-full text-left p-2.5 rounded-none border transition-all flex items-center justify-between gap-3 group cursor-pointer ${isActive ? 'bg-white border-[#003B5C] shadow-xs ring-1 ring-[#003B5C]' : 'bg-gray-50 border-gray-200 hover:bg-white hover:border-[#003B5C]'}`}
                >
                  <div className="flex items-center gap-2.5 min-w-0 flex-1">
                    <div
                      className={`p-1.5 rounded-none shrink-0 ${isActive ? 'bg-[#003B5C]/10 text-[#003B5C]' : 'bg-white border border-gray-200 text-gray-400'}`}
                    >
                      <FileText className="w-3.5 h-3.5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-sans text-[12px] font-bold text-gray-800 truncate leading-tight">
                        {doc.title}
                      </p>
                      <p className="font-mono text-[9px] text-gray-400 mt-0.5">
                        {formatFileSize(doc.size)}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={(event) => {
                      event.stopPropagation();
                      onDeleteDocument(doc.id);
                    }}
                    title="Remove from sandbox"
                    className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer shrink-0"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="relative flex py-1 items-center">
        <div className="flex-grow border-t border-gray-200" />
        <span className="flex-shrink mx-3 text-[10px] font-mono uppercase tracking-widest text-gray-500 font-bold">
          Secure Bulk Upload
        </span>
        <div className="flex-grow border-t border-gray-200" />
      </div>

      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-none p-5 text-center cursor-pointer transition-all duration-200 ${isDragging ? 'border-[#003B5C] bg-[#747d63]/10 scale-[0.99]' : 'border-[#003B5C]/30 bg-[#747d63]/5 hover:bg-[#747d63]/10'}`}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileInputChange}
          accept=".txt,.pdf,.docx"
          multiple
          className="hidden"
        />
        <Upload className="w-7 h-7 mx-auto text-[#003B5C] mb-2 group-hover:scale-110 transition-transform" />
        <span className="block text-[11px] font-bold text-[#003B5C] uppercase tracking-wider mb-0.5">
          DRAG &amp; DROP SECURE FILES
        </span>
        <span className="block text-[10px] text-gray-500 mb-1 font-mono uppercase">
          PDF, DOCX, TXT • SELECT UP TO 5
        </span>
      </div>

      {errorMessage && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-none text-red-700 text-xs flex items-start gap-2">
          <CircleAlert className="w-4 h-4 shrink-0 mt-0.5" />
          <span className="font-medium">{errorMessage}</span>
        </div>
      )}

      {successMessage && (
        <div className="p-3 bg-green-50 border border-green-200 rounded-none text-green-700 text-xs flex items-start gap-2">
          <Check className="w-4 h-4 shrink-0 mt-0.5" />
          <span className="font-semibold">{successMessage}</span>
        </div>
      )}

      <div className="relative flex py-1 items-center">
        <div className="flex-grow border-t border-gray-200" />
        <span className="flex-shrink mx-3 text-[10px] font-mono uppercase tracking-widest text-gray-500 font-bold">
          Or Paste Text
        </span>
        <div className="flex-grow border-t border-gray-200" />
      </div>

      <form onSubmit={handlePasteSubmit} className="space-y-3">
        <div className="space-y-1.5">
          <label className="text-[10px] font-mono uppercase text-gray-500 font-bold">
            Document Header / Title
          </label>
          <input
            type="text"
            value={pastedTitle}
            onChange={(event) => setPastedTitle(event.target.value)}
            className="w-full text-xs p-2 rounded-none border border-gray-300 bg-white text-[#1a1a1a] focus:ring-1 focus:ring-[#003B5C] focus:border-[#003B5C] outline-none font-medium"
            placeholder="e.g. Vendor Agreement Addendum"
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-[10px] font-mono uppercase text-gray-500 font-bold">
            Pasted Clauses
          </label>
          <textarea
            value={pastedText}
            onChange={(event) => setPastedText(event.target.value)}
            rows={4}
            className="w-full text-xs p-2.5 rounded-none border border-gray-300 bg-white text-[#1a1a1a] focus:ring-1 focus:ring-[#003B5C] focus:border-[#003B5C] outline-none resize-none font-mono"
            placeholder="Paste raw contract clauses, agreements, or confidential letters here..."
          />
        </div>
        <button
          type="submit"
          className="w-full bg-[#003B5C] hover:brightness-110 text-white py-3.5 px-3 rounded-none text-xs font-bold tracking-widest uppercase shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer"
        >
          <ClipboardCopy className="w-3.5 h-3.5" />
          Load to Sandbox Buffer
        </button>
      </form>
    </div>
  );
}
