import { useEffect, useMemo, useState } from 'react';
import { ShieldCheck } from 'lucide-react';
import Header from './components/Header';
import DocumentInputPanel from './components/DocumentInputPanel';
import RedactionSettings from './components/RedactionSettings';
import DocumentViewer from './components/DocumentViewer';
import AuditPanel from './components/AuditPanel';
import ExportPanel from './components/ExportPanel';
import { SAMPLE_DOCUMENTS } from './data/sampleDocuments';
import { segmentText } from './lib/redaction';
import type {
  NewDocumentInput,
  RedactionStats,
  RedactionStyle,
  RiskLevel,
  SandboxDocument,
  Segment,
  SegmentCategory,
} from './types';

const MAX_CUSTOM_DOCUMENTS = 5;
const TOTAL_CATEGORY_COUNT = 7;

export default function App() {
  const [documents, setDocuments] = useState<SandboxDocument[]>(() =>
    SAMPLE_DOCUMENTS.map((sample) => ({
      id: sample.id,
      title: sample.title,
      rawText: sample.rawText,
      isCustom: false,
      whitelistedSegmentIds: new Set<string>(),
      customRedactedWords: new Set<string>(),
    })),
  );
  const [activeDocId, setActiveDocId] = useState<string>(SAMPLE_DOCUMENTS[0].id);
  const [enabledCategories, setEnabledCategories] = useState<Set<string>>(
    new Set([
      'NAME',
      'EMAIL',
      'PHONE',
      'ADDRESS',
      'FINANCIAL',
      'ORGANIZATION',
      'DATE',
    ]),
  );
  const [redactionStyle, setRedactionStyle] = useState<RedactionStyle>('BLACKOUT');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);

  const activeDocument = useMemo(
    () => documents.find((doc) => doc.id === activeDocId) || documents[0],
    [documents, activeDocId],
  );
  const rawText = activeDocument.rawText;
  const title = activeDocument.title;
  const customRedactedWords = activeDocument.customRedactedWords;
  const whitelistedSegmentIds = activeDocument.whitelistedSegmentIds;

  // Simulated analysis progress bar whenever the document or categories change.
  useEffect(() => {
    if (!activeDocId) return;
    setIsAnalyzing(true);
    setAnalysisProgress(0);
    let progress = 0;
    const tickMs = Math.min(1000, Math.max(400, Math.round(rawText.length / 5))) / 10;
    const intervalId = setInterval(() => {
      progress += Math.floor(Math.random() * 12) + 8;
      if (progress >= 100) {
        progress = 100;
        clearInterval(intervalId);
        setTimeout(() => {
          setIsAnalyzing(false);
        }, 150);
      }
      setAnalysisProgress(progress);
    }, tickMs);
    return () => {
      clearInterval(intervalId);
    };
  }, [activeDocId, enabledCategories, rawText]);

  const segments = useMemo<Segment[]>(
    () =>
      segmentText(rawText, enabledCategories, customRedactedWords).map((segment) =>
        whitelistedSegmentIds.has(segment.id) ? { ...segment, isRedacted: false } : segment,
      ),
    [rawText, enabledCategories, customRedactedWords, whitelistedSegmentIds],
  );

  const [manifestChecksum, setManifestChecksum] = useState('');

  const stats = useMemo<RedactionStats>(() => {
    const byCategory: Record<SegmentCategory, number> = {
      NAME: 0,
      EMAIL: 0,
      PHONE: 0,
      ADDRESS: 0,
      FINANCIAL: 0,
      ORGANIZATION: 0,
      DATE: 0,
      CUSTOM: 0,
    };
    let totalRedacted = 0;
    segments.forEach((segment) => {
      if (segment.isRedacted && segment.category) {
        byCategory[segment.category] = (byCategory[segment.category] || 0) + 1;
        totalRedacted++;
      }
    });
    const enabledCount = enabledCategories.size;
    const complianceScore = Math.round((enabledCount / TOTAL_CATEGORY_COUNT) * 100);
    let riskScore: RiskLevel = 'LOW';
    if (complianceScore >= 85) riskScore = 'LOW';
    else if (complianceScore >= 55) riskScore = 'MEDIUM';
    else riskScore = 'HIGH';
    return { totalRedacted, byCategory, complianceScore, riskScore };
  }, [segments, enabledCategories]);

  // SHA-256 fingerprint of the redaction manifest, computed locally.
  useEffect(() => {
    let cancelled = false;
    const manifest = JSON.stringify({
      title,
      totalRedacted: stats.totalRedacted,
      byCategory: stats.byCategory,
    });
    (async () => {
      const encoded = new TextEncoder().encode(manifest);
      const digest = await crypto.subtle.digest('SHA-256', encoded);
      const hex = Array.from(new Uint8Array(digest))
        .map((byte) => byte.toString(16).padStart(2, '0'))
        .join('');
      if (!cancelled) setManifestChecksum('0x' + hex.slice(0, 24) + '…');
    })();
    return () => {
      cancelled = true;
    };
  }, [title, stats]);

  const handleToggleSegmentRedaction = (segmentId: string) => {
    setDocuments((prev) =>
      prev.map((doc) => {
        if (doc.id === activeDocId) {
          const next = new Set(doc.whitelistedSegmentIds);
          if (next.has(segmentId)) next.delete(segmentId);
          else next.add(segmentId);
          return { ...doc, whitelistedSegmentIds: next };
        }
        return doc;
      }),
    );
  };

  const handleAddCustomRedaction = (word: string) => {
    setDocuments((prev) =>
      prev.map((doc) => {
        if (doc.id === activeDocId) {
          const next = new Set(doc.customRedactedWords);
          next.add(word.toLowerCase());
          return { ...doc, customRedactedWords: next };
        }
        return doc;
      }),
    );
  };

  const handleRemoveCustomRedaction = (word: string) => {
    setDocuments((prev) =>
      prev.map((doc) => {
        if (doc.id === activeDocId) {
          const next = new Set(doc.customRedactedWords);
          next.delete(word.toLowerCase());
          return { ...doc, customRedactedWords: next };
        }
        return doc;
      }),
    );
  };

  const handleSelectDocument = (docId: string) => {
    setActiveDocId(docId);
  };

  const handleAddDocuments = (newDocs: NewDocumentInput[]) => {
    setDocuments((prev) => {
      const remainingSlots = MAX_CUSTOM_DOCUMENTS - prev.filter((doc) => doc.isCustom).length;
      if (remainingSlots <= 0) return prev;
      const added: SandboxDocument[] = newDocs.slice(0, remainingSlots).map((input, index) => ({
        id: `upload-${Date.now()}-${index}-${Math.random().toString(36).slice(2, 6)}`,
        title: input.title,
        rawText: input.rawText,
        isCustom: true,
        size: input.size,
        whitelistedSegmentIds: new Set<string>(),
        customRedactedWords: new Set<string>(),
      }));
      const updated = [...prev, ...added];
      if (added.length > 0) setTimeout(() => setActiveDocId(added[0].id), 0);
      return updated;
    });
  };

  const handleDeleteDocument = (docId: string) => {
    setDocuments((prev) => {
      const remaining = prev.filter((doc) => doc.id !== docId);
      if (activeDocId === docId && remaining.length > 0) setActiveDocId(remaining[0].id);
      return remaining;
    });
  };

  const handleResetDocument = () => {
    setDocuments((prev) =>
      prev.map((doc) => {
        if (doc.id === activeDocId) {
          if (!doc.isCustom) {
            const sample = SAMPLE_DOCUMENTS.find((s) => s.id === doc.id);
            if (sample)
              return {
                ...doc,
                rawText: sample.rawText,
                title: sample.title,
                whitelistedSegmentIds: new Set<string>(),
                customRedactedWords: new Set<string>(),
              };
          }
          return {
            ...doc,
            whitelistedSegmentIds: new Set<string>(),
            customRedactedWords: new Set<string>(),
          };
        }
        return doc;
      }),
    );
  };

  return (
    <div className="min-h-screen bg-[#747d63] flex flex-col text-[#1a1a1a] font-sans">
      <Header />
      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-6">
        <div className="bg-white/95 border-l-4 border-[#003B5C] p-6 shadow-md rounded-none flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 transition-all">
          <div className="space-y-1">
            <h1 className="font-serif text-xl font-bold text-[#003B5C] tracking-tight">
              Double-Pass Legal Sanitization Workstation
            </h1>
            <p className="text-xs text-gray-600 leading-relaxed max-w-2xl font-medium">
              Upload agreements, purchase agreements, or corporate memos to strip names, emails,
              financial values, and location coordinates instantly. Review matches inside our
              interactive audit canvas or click custom clauses before secure download.
            </p>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-[#003B5C]/10 border border-[#003B5C]/20 rounded-none shrink-0 text-xs font-mono font-bold text-[#003B5C]">
            <ShieldCheck className="w-4 h-4" />
            <span>SECURE LOCAL BUFFER</span>
          </div>
        </div>

        <div className="bg-amber-50 border-l-4 border-amber-400 px-5 py-3 text-xs text-amber-900 leading-relaxed">
          <span className="font-bold uppercase tracking-wide">What to watch for:</span>
          {
            " this tool is tuned to over-redact — you'll likely see harmless phrases like “This Agreement” or “One Million” flagged as a name. That's expected caution, not a bug worth reporting."
          }{' '}
          <span className="font-bold">What matters is the opposite</span>
          {' — any real name, contact info, address, or figure that is '}
          <span className="underline">not</span>
          {' highlighted. Please flag those via the feedback link in the footer.'}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white/95 p-6 border-l-4 border-[#003B5C] shadow-md rounded-none">
              <DocumentInputPanel
                documents={documents}
                activeDocId={activeDocId}
                onSelectDocument={handleSelectDocument}
                onAddDocuments={handleAddDocuments}
                onDeleteDocument={handleDeleteDocument}
              />
            </div>
            <div className="bg-white/95 p-6 border-l-4 border-[#003B5C] shadow-md rounded-none">
              <RedactionSettings
                enabledCategories={enabledCategories}
                onCategoriesChange={setEnabledCategories}
                redactionStyle={redactionStyle}
                onStyleChange={setRedactionStyle}
              />
            </div>
          </div>

          <div className="lg:col-span-8 space-y-6 h-full flex flex-col">
            <div className="flex-1">
              <DocumentViewer
                title={title}
                segments={segments}
                redactionStyle={redactionStyle}
                onToggleSegmentRedaction={handleToggleSegmentRedaction}
                onAddCustomRedaction={handleAddCustomRedaction}
                onRemoveCustomRedaction={handleRemoveCustomRedaction}
                customRedactedWords={customRedactedWords}
                onResetDocument={handleResetDocument}
                isAnalyzing={isAnalyzing}
                analysisProgress={analysisProgress}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <AuditPanel
                stats={stats}
                enabledCategories={enabledCategories}
                customRedactedWordsCount={customRedactedWords.size}
              />
              <ExportPanel
                title={title}
                segments={segments}
                redactionStyle={redactionStyle}
                stats={stats}
                documents={documents}
                enabledCategories={enabledCategories}
              />
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-[#003B5C]/20 text-white/90 border-t border-white/10 py-4 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col gap-2">
          <div className="flex flex-col md:flex-row justify-between items-center gap-2 text-[10px] font-mono font-bold tracking-wider uppercase">
            <div className="flex items-center gap-4 flex-wrap">
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-400" />
                {' RUNS ENTIRELY IN YOUR BROWSER'}
              </span>
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-400" />
                {' OPTIONAL AES-256 ZIP EXPORT'}
              </span>
              <span
                className="flex items-center gap-2"
                title="SHA-256 of the current redaction manifest, computed locally in your browser — not a blockchain record"
              >
                <span className="w-2 h-2 rounded-full bg-green-400" />
                {' MANIFEST CHECKSUM: '}
                {manifestChecksum || '…'}
                <span className="normal-case font-sans font-semibold tracking-normal bg-green-400/20 text-green-300 px-1.5 py-0.5 rounded-none">
                  local
                </span>
              </span>
            </div>
            <div className="flex gap-4 normal-case font-sans font-semibold tracking-normal">
              <a
                href="mailto:negus.naga.network@gmail.com?subject=GSP%20Anonymizer%20feedback"
                className="hover:text-white underline"
              >
                Report an issue / feedback
              </a>
            </div>
          </div>
          <div className="text-[10px] text-white/60 text-center md:text-left">
            Beta evaluation build. Not legal advice and not a substitute for review by a licensed
            professional — always verify redactions before relying on or sharing an exported
            document.
          </div>
        </div>
      </footer>
    </div>
  );
}
