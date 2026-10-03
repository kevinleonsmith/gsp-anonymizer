import { useState } from 'react';
import type { MouseEvent, ReactNode } from 'react';
import { Eye, FilePen, FileText, Info, RefreshCw, Sparkles } from 'lucide-react';
import { REDACTION_CATEGORIES } from '../lib/categories';
import type { RedactionStyle, Segment, SegmentCategory } from '../types';

type ViewMode = 'REVIEW' | 'PREVIEW' | 'RAW';

interface CategoryDisplayInfo {
  name: string;
  color?: string;
  textColor?: string;
}

export interface DocumentViewerProps {
  title: string;
  segments: Segment[];
  redactionStyle: RedactionStyle;
  onToggleSegmentRedaction: (segmentId: string) => void;
  onAddCustomRedaction: (word: string) => void;
  onRemoveCustomRedaction: (word: string) => void;
  customRedactedWords: Set<string>;
  onResetDocument: () => void;
  isAnalyzing?: boolean;
  analysisProgress?: number;
}

const PUNCTUATION_REGEX = /[.,;:()'"?!]/g;

export default function DocumentViewer({
  title,
  segments,
  redactionStyle,
  onToggleSegmentRedaction,
  onAddCustomRedaction,
  onRemoveCustomRedaction,
  customRedactedWords,
  onResetDocument,
  isAnalyzing = false,
  analysisProgress = 0,
}: DocumentViewerProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('REVIEW');
  const [hoveredSegment, setHoveredSegment] = useState<Segment | null>(null);
  const [hoveredWord, setHoveredWord] = useState<string | null>(null);

  const renderRedactedSegment = (segment: Segment): ReactNode => {
    const text = segment.text;
    switch (redactionStyle) {
      case 'BLACKOUT':
        return (
          <span className="bg-[#1a1a1a] text-[#1a1a1a] select-none font-mono rounded-none px-1">
            {'█'.repeat(Math.max(4, Math.min(12, text.length)))}
          </span>
        );
      case 'LABEL':
        return (
          <span className="bg-[#003B5C] text-white font-mono text-[9px] px-2 py-0.5 rounded-none font-bold uppercase tracking-wider select-none border border-white/20">
            [{segment.category || 'REDACTED'}]
          </span>
        );
      case 'UNDERLINE':
        return (
          <span className="font-mono text-gray-500 border-b-2 border-gray-900 font-bold select-none px-1">
            {'‗'.repeat(Math.max(5, Math.min(10, text.length)))}
          </span>
        );
      case 'BLUR':
        return (
          <span className="blur-[4px] bg-gray-100 px-1 rounded-none select-none hover:blur-[1px] transition-all duration-200">
            {text}
          </span>
        );
      default:
        return <span className="bg-[#1a1a1a] text-[#1a1a1a] select-none">█████</span>;
    }
  };

  const handleWordClick = (word: string, event: MouseEvent) => {
    event.stopPropagation();
    const normalizedWord = word.trim().replace(PUNCTUATION_REGEX, '').toLowerCase();
    if (!normalizedWord) return;
    if (customRedactedWords.has(normalizedWord)) {
      onRemoveCustomRedaction(normalizedWord);
    } else {
      onAddCustomRedaction(normalizedWord);
    }
  };

  const getCategoryInfo = (category?: SegmentCategory): CategoryDisplayInfo | null => {
    if (!category) return null;
    const match = REDACTION_CATEGORIES.find((c) => c.id === category);
    if (match) {
      return {
        name: match.name,
        color: match.color,
        textColor: match.textColor,
      };
    }
    return {
      name: 'Custom User Redaction',
      color: 'bg-amber-100 border-amber-300',
      textColor: 'text-amber-900',
    };
  };

  const hoveredCategoryInfo = hoveredSegment ? getCategoryInfo(hoveredSegment.category) : null;

  const tabClass = (mode: ViewMode) =>
    `flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-none text-xs font-bold tracking-widest uppercase transition-all cursor-pointer ${
      viewMode === mode ? 'bg-[#003B5C] text-white shadow-xs' : 'text-gray-500 hover:text-[#003B5C]'
    }`;

  return (
    <div className="bg-white/95 border-l-4 border-[#003B5C] p-4 md:p-6 shadow-md rounded-none flex flex-col h-full min-h-[500px]">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-4 border-b border-gray-200 gap-3 mb-4">
        <div>
          <span className="text-[9px] font-mono font-bold text-gray-500 uppercase tracking-widest">
            Active Workspace
          </span>
          <h2 className="font-serif text-lg font-bold text-[#003B5C] leading-tight mt-0.5">
            {title || 'Unnamed Document Sandbox'}
          </h2>
        </div>
        <div className="flex gap-1 bg-gray-100 p-1 rounded-none border border-gray-200 self-stretch sm:self-auto flex-wrap">
          <button onClick={() => setViewMode('REVIEW')} className={tabClass('REVIEW')}>
            <FilePen className="w-3.5 h-3.5" />
            Interactive Audit
          </button>
          <button onClick={() => setViewMode('PREVIEW')} className={tabClass('PREVIEW')}>
            <Eye className="w-3.5 h-3.5" />
            Anonymized View
          </button>
          <button onClick={() => setViewMode('RAW')} className={tabClass('RAW')}>
            <FileText className="w-3.5 h-3.5" />
            Show Raw Text
          </button>
        </div>
      </div>

      {viewMode === 'REVIEW' && (
        <div className="bg-gray-50 border border-gray-200 rounded-none p-3.5 text-xs mb-4 flex items-start gap-2.5 transition-all">
          <div className="p-1.5 bg-[#003B5C]/10 rounded-none text-[#003B5C] shrink-0 mt-0.5">
            <Info className="w-4 h-4" />
          </div>
          <div className="flex-1 min-w-0">
            {hoveredSegment ? (
              <div>
                <span className="font-mono text-[9px] uppercase text-gray-500 block tracking-widest font-bold">
                  Inspecting Flagged PII
                </span>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="font-bold text-gray-900">"{hoveredSegment.originalText}"</span>
                  <span
                    className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-none border ${hoveredCategoryInfo?.color} ${hoveredCategoryInfo?.textColor}`}
                  >
                    {hoveredCategoryInfo?.name}
                  </span>
                  <span
                    className={`text-[10px] font-semibold font-mono ${hoveredSegment.isRedacted ? 'text-red-600' : 'text-green-600'}`}
                  >
                    • {hoveredSegment.isRedacted ? 'Currently Redacted' : 'Excluded'}
                  </span>
                </div>
                <p className="text-[11px] text-gray-500 mt-1 font-medium">
                  {hoveredSegment.category === 'CUSTOM'
                    ? 'Manually flagged as custom confidential term. Click to whitelist.'
                    : 'Identified by legal heuristic parser. Click this block to exclude from redaction.'}
                </p>
              </div>
            ) : hoveredWord ? (
              <div>
                <span className="font-mono text-[9px] uppercase text-gray-500 block tracking-widest font-bold">
                  Standard Text Hovered
                </span>
                <p className="text-gray-900 font-bold mt-0.5">Word Token: "{hoveredWord}"</p>
                <p className="text-[11px] text-gray-500 mt-0.5 leading-relaxed font-medium">
                  Click to redact this phrase globally across the entire document buffer.
                </p>
              </div>
            ) : (
              <div>
                <span className="font-mono text-[9px] uppercase text-[#003B5C] block tracking-widest font-bold">
                  Audit Mode Active
                </span>
                <p className="text-gray-600 mt-0.5 leading-relaxed font-medium">
                  Hover over highlighted matches to inspect categories.{' '}
                  <span className="font-bold text-[#003B5C]">Click highlights</span> to whitelist them, or{' '}
                  <span className="font-bold text-[#003B5C]">click standard words</span> to redact them
                  globally.
                </p>
              </div>
            )}
          </div>
          <button
            onClick={onResetDocument}
            title="Reset to default document"
            className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-gray-100 rounded-none transition-all cursor-pointer shrink-0"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      <div className="flex items-center justify-between px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-none mb-3">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono font-bold text-gray-500 uppercase tracking-wider">
            Quick Toggle View:
          </span>
          <span
            className={`text-[10px] font-sans font-extrabold px-2 py-0.5 rounded-none border ${
              viewMode === 'RAW'
                ? 'bg-amber-50 text-amber-900 border-amber-300'
                : viewMode === 'PREVIEW'
                  ? 'bg-green-50 text-green-900 border-green-300'
                  : 'bg-[#003B5C]/5 text-[#003B5C] border-[#003B5C]/20'
            }`}
          >
            {viewMode === 'RAW'
              ? 'SHOW RAW TEXT'
              : viewMode === 'PREVIEW'
                ? 'FINAL ANONYMIZED VIEW'
                : 'INTERACTIVE AUDIT'}
          </span>
        </div>
        <button
          onClick={() => {
            setViewMode((mode) => (mode === 'RAW' ? 'PREVIEW' : 'RAW'));
          }}
          className="flex items-center gap-1.5 px-3 py-1 bg-white border border-gray-300 hover:border-[#003B5C] hover:bg-gray-50 text-[10px] font-sans font-bold text-gray-700 uppercase tracking-wider transition-all shadow-xs cursor-pointer select-none"
        >
          {viewMode === 'RAW' ? (
            <>
              <Eye className="w-3.5 h-3.5 text-[#003B5C]" />
              Switch to Final Anonymized View
            </>
          ) : (
            <>
              <FileText className="w-3.5 h-3.5 text-amber-600" />
              Switch to Show Raw Text
            </>
          )}
        </button>
      </div>

      <div className="flex-1 bg-white border border-gray-200 rounded-none p-6 md:p-8 font-sans document-page max-h-[600px] overflow-y-auto relative select-text">
        <div className="absolute top-3 right-3 select-none flex items-center gap-1 opacity-40 hover:opacity-100 transition-opacity">
          <span className="text-[9px] font-mono font-bold text-gray-500 tracking-widest uppercase">
            Secured Page Buffer
          </span>
        </div>
        {isAnalyzing ? (
          <div className="flex flex-col items-center justify-center py-20 px-4 text-center h-full min-h-[300px]">
            <div className="w-16 h-16 rounded-none bg-[#003B5C]/10 flex items-center justify-center mb-6 relative">
              <Sparkles className="w-8 h-8 text-[#003B5C] animate-pulse" />
              <div className="absolute inset-0 border-2 border-[#003B5C] border-t-transparent rounded-none animate-spin" />
            </div>
            <div className="space-y-1.5 max-w-md">
              <span className="text-[10px] font-mono font-bold text-[#003B5C] uppercase tracking-widest block animate-pulse">
                Heuristic AI Engine Parsing
              </span>
              <h4 className="font-serif text-lg font-bold text-gray-900">Anonymizing "{title}"</h4>
              <p className="text-[11px] text-gray-500 font-mono font-medium">
                {analysisProgress < 30
                  ? '>> Scanning clauses for personal identifiable names...'
                  : analysisProgress < 60
                    ? '>> Evaluating financials, currency tokens, and values...'
                    : analysisProgress < 85
                      ? '>> Running semantic pattern checks on dates & markers...'
                      : '>> Finalizing redaction map...'}
              </p>
            </div>
            <div className="w-full max-w-sm bg-gray-100 h-2 border border-gray-200 mt-6 relative overflow-hidden">
              <div
                className="bg-[#003B5C] h-full transition-all duration-300 ease-out"
                style={{ width: `${analysisProgress}%` }}
              />
            </div>
            <div className="flex justify-between w-full max-w-sm mt-2 text-[10px] font-mono font-bold text-gray-400">
              <span>SANDBOX PROCESSING</span>
              <span className="text-[#003B5C]">{analysisProgress}%</span>
            </div>
          </div>
        ) : (
          <div className="text-sm text-[#1a1a1a] leading-relaxed whitespace-pre-wrap font-sans">
            {segments.map((segment) => {
              if (viewMode === 'RAW') {
                return <span key={segment.id}>{segment.originalText || segment.text}</span>;
              }

              const categoryInfo = getCategoryInfo(segment.category);
              if (categoryInfo) {
                const isRedacted = segment.isRedacted;
                if (viewMode === 'PREVIEW') {
                  return isRedacted ? (
                    <span key={segment.id}>{renderRedactedSegment(segment)}</span>
                  ) : (
                    <span key={segment.id}>{segment.text}</span>
                  );
                }
                return (
                  <button
                    key={segment.id}
                    onClick={() => onToggleSegmentRedaction(segment.id)}
                    onMouseEnter={() => setHoveredSegment(segment)}
                    onMouseLeave={() => setHoveredSegment(null)}
                    className={`inline-block mx-0.5 rounded-none px-1.5 py-0.5 border cursor-pointer select-none transition-all duration-150 align-baseline ${
                      isRedacted
                        ? `${categoryInfo.color} hover:brightness-95 hover:shadow-xs border-current/25 relative`
                        : 'bg-gray-100/50 border-gray-200 text-gray-400 hover:bg-gray-200/50 line-through'
                    }`}
                    style={{ contentVisibility: 'auto' }}
                  >
                    <span className="font-bold">{segment.text}</span>
                    {isRedacted && (
                      <span className="text-[8px] uppercase tracking-wider font-mono font-extrabold ml-1 border-l border-current/30 pl-1 opacity-70">
                        {segment.category === 'CUSTOM' ? 'User' : segment.category}
                      </span>
                    )}
                  </button>
                );
              }

              if (viewMode === 'REVIEW') {
                return segment.text.split(/(\s+)/).map((token, tokenIndex) => {
                  const cleanWord = token.trim().replace(PUNCTUATION_REGEX, '');
                  const tokenKey = `${segment.id}-${tokenIndex}`;
                  if (!cleanWord) {
                    return <span key={tokenKey}>{token}</span>;
                  }
                  const isCustomRedacted = customRedactedWords.has(cleanWord.toLowerCase());
                  return (
                    <span
                      key={tokenKey}
                      onClick={(event) => handleWordClick(cleanWord, event)}
                      onMouseEnter={() => setHoveredWord(cleanWord)}
                      onMouseLeave={() => setHoveredWord(null)}
                      className={`cursor-pointer rounded-none px-0.5 transition-colors ${
                        isCustomRedacted
                          ? 'bg-amber-100 text-amber-900 border border-amber-300 font-bold'
                          : 'hover:bg-gray-100 hover:text-[#003B5C]'
                      }`}
                    >
                      {token}
                    </span>
                  );
                });
              }

              return <span key={segment.id}>{segment.text}</span>;
            })}
          </div>
        )}
      </div>
    </div>
  );
}
