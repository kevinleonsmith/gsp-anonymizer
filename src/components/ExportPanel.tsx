import { useState } from 'react';
import {
  Archive,
  Check,
  CircleAlert,
  Copy,
  Download,
  Lock,
  LockOpen,
  Printer,
  ShieldAlert,
  Sparkles,
} from 'lucide-react';
import { BlobWriter, TextReader, ZipWriter } from '@zip.js/zip.js';
import type { ZipWriterAddDataOptions } from '@zip.js/zip.js';
import { renderRedactedText, resolveDocumentSegments } from '../lib/redaction';
import type {
  RedactionStats,
  RedactionStyle,
  SandboxDocument,
  Segment,
} from '../types';

interface ExportPanelProps {
  title: string;
  segments: Segment[];
  redactionStyle: RedactionStyle;
  stats: RedactionStats;
  documents: SandboxDocument[];
  enabledCategories: Set<string>;
}

const toFileSlug = (title: string) =>
  title.toLowerCase().replace(/[^a-z0-9]+/g, '_');

export default function ExportPanel({
  title,
  segments,
  redactionStyle,
  stats,
  documents,
  enabledCategories,
}: ExportPanelProps) {
  const [copied, setCopied] = useState(false);
  const [showReport, setShowReport] = useState(false);
  const [zipPassword, setZipPassword] = useState('');
  const [isZipping, setIsZipping] = useState(false);
  const [zipError, setZipError] = useState<string | null>(null);
  const [zipSuccess, setZipSuccess] = useState<string | null>(null);
  const [encryptArchive, setEncryptArchive] = useState(true);

  const renderDocumentText = (doc: SandboxDocument) =>
    renderRedactedText(
      resolveDocumentSegments(doc, enabledCategories),
      redactionStyle,
    );

  const getCleanText = () => renderRedactedText(segments, redactionStyle);

  const handleCopy = () => {
    const text = getCleanText();
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadTxt = () => {
    const text = getCleanText();
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${toFileSlug(title)}_anonymized.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleBatchZipExport = async () => {
    if (documents.length === 0) {
      setZipError('No documents available in the sandbox.');
      return;
    }
    try {
      setIsZipping(true);
      setZipError(null);
      setZipSuccess(null);

      const usePassword = encryptArchive && zipPassword.trim() !== '';
      const buildEntryOptions = (): ZipWriterAddDataOptions => {
        const options: ZipWriterAddDataOptions = {};
        if (usePassword) {
          options.password = zipPassword;
          options.encryptionStrength = 3;
        }
        return options;
      };

      const blobWriter = new BlobWriter('application/zip');
      const zipWriter = new ZipWriter(blobWriter, { useWebWorkers: false });

      for (const doc of documents) {
        const redactedText = renderDocumentText(doc);
        const fileName = `${toFileSlug(doc.title)}_anonymized.txt`;
        const reader = new TextReader(redactedText);
        await zipWriter.add(fileName, reader, buildEntryOptions());
      }

      let summary = '==================================================\n';
      summary += 'GSP REDACTION SUMMARY (BETA)\n';
      summary += '==================================================\n';
      summary += `Export Date: ${new Date().toUTCString()}\n`;
      summary += `Total Bundled Documents: ${documents.length}\n`;
      summary += `Encryption Status: ${usePassword ? 'AES-256 Password-Protected' : 'Unencrypted ZIP'}\n`;
      summary += `Selected Redaction Style: ${redactionStyle}\n\n`;
      summary += 'Archive Contents Details:\n';
      documents.forEach((doc, index) => {
        const redactedCount = resolveDocumentSegments(
          doc,
          enabledCategories,
        ).filter((segment) => segment.isRedacted).length;
        summary += `  [${index + 1}] File: ${doc.title}\n`;
        summary += `      - Redactions: ${redactedCount} entities masked\n`;
        summary += `      - Manual overrides: ${doc.whitelistedSegmentIds.size} terms whitelisted\n`;
      });
      summary += '\n==================================================\n';
      summary += 'PROCESSING NOTE\n';
      summary += '--------------------------------------------------\n';
      summary +=
        'This ZIP archive was compiled and encrypted locally in your browser. No document plaintext or keys were transmitted over a network.\n\n';
      summary +=
        'This is a beta evaluation tool, not a certified compliance product. Detection is pattern-based and can miss or over-match content — review every redaction before relying on or sharing this document.\n';
      summary += '==================================================\n';

      const summaryReader = new TextReader(summary);
      await zipWriter.add(
        'redaction_summary.txt',
        summaryReader,
        buildEntryOptions(),
      );

      const zipBlob = await zipWriter.close();
      const url = URL.createObjectURL(zipBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `gsp_batch_redacted_${Date.now()}.zip`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      setZipSuccess(
        `Archived and encrypted ${documents.length} document(s) successfully!`,
      );
    } catch (error) {
      console.error(error);
      setZipError(
        (error as Error | null)?.message ||
          'Error occurred during secure batch compression.',
      );
    } finally {
      setIsZipping(false);
    }
  };

  const processedDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZoneName: 'short',
  });

  return (
    <div className="bg-white/95 border-l-4 border-[#003B5C] p-5 shadow-md rounded-none space-y-4">
      <div>
        <h3 className="font-serif text-sm font-bold text-[#003B5C]">
          03. Document Export
        </h3>
        <p className="text-[11px] text-gray-500 leading-snug mt-1 font-medium">
          Export your fully anonymized content safely. All processing stays
          100% in local memory, meeting strict data privacy standards.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-2.5">
        <button
          onClick={handleCopy}
          className="flex-1 bg-gray-50 hover:bg-gray-100 text-[#003B5C] border border-[#003B5C]/20 py-2.5 px-3 rounded-none text-xs font-bold tracking-wider uppercase flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-xs"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-green-700" />
              COPIED!
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              Copy Clean Text
            </>
          )}
        </button>
        <button
          onClick={handleDownloadTxt}
          className="flex-1 bg-[#003B5C] hover:brightness-110 text-white py-2.5 px-3 rounded-none text-xs font-bold tracking-wider uppercase flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-md"
        >
          <Download className="w-3.5 h-3.5" />
          Download .TXT File
        </button>
      </div>

      <button
        onClick={() => setShowReport(true)}
        className="w-full bg-gray-100 hover:bg-gray-200 text-[#003B5C] border border-gray-300 py-3 px-3 rounded-none text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-1.5 transition-all cursor-pointer"
      >
        <Printer className="w-3.5 h-3.5" />
        Generate Redaction Summary Report
      </button>

      <div className="relative flex py-1.5 items-center">
        <div className="flex-grow border-t border-gray-200" />
        <span className="flex-shrink mx-2 text-[9px] font-mono uppercase tracking-widest text-gray-400 font-bold">
          Secure Bulk Export
        </span>
        <div className="flex-grow border-t border-gray-200" />
      </div>

      <div className="space-y-3 p-3 bg-gray-50 border border-gray-200 rounded-none text-left">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-sans font-bold text-gray-800 flex items-center gap-1">
            <Archive className="w-3.5 h-3.5 text-[#003B5C]" />
            Package Sandbox ({documents.length} Files)
          </span>
          <span className="text-[9px] font-mono font-bold text-gray-400">
            AES-256 ZIP
          </span>
        </div>

        <div className="flex items-center justify-between text-xs">
          <label className="flex items-center gap-1.5 text-gray-600 font-medium cursor-pointer select-none">
            <input
              type="checkbox"
              checked={encryptArchive}
              onChange={(e) => setEncryptArchive(e.target.checked)}
              className="accent-[#003B5C] h-3.5 w-3.5 border-gray-300 focus:ring-0"
            />
            Password Encrypt Archive
          </label>
          <span className="text-[9px] font-mono text-gray-400">
            Highly Recommended
          </span>
        </div>

        {encryptArchive && (
          <div className="space-y-1">
            <div className="relative">
              <input
                type="text"
                value={zipPassword}
                onChange={(e) => setZipPassword(e.target.value)}
                placeholder="Enter password to encrypt..."
                className="w-full text-xs p-2 pr-8 rounded-none border border-gray-300 bg-white text-[#1a1a1a] focus:ring-1 focus:ring-[#003B5C] focus:border-[#003B5C] outline-none font-mono"
              />
              <div className="absolute top-2.5 right-2 text-gray-400">
                {zipPassword.trim() ? (
                  <Lock className="w-3.5 h-3.5 text-amber-600" />
                ) : (
                  <LockOpen className="w-3.5 h-3.5 text-gray-400" />
                )}
              </div>
            </div>
            <p className="text-[9px] text-gray-400 font-medium">
              * Needed when extracting standard archives on client OS. Keep key
              safe.
            </p>
          </div>
        )}

        <button
          onClick={handleBatchZipExport}
          disabled={isZipping || documents.length === 0}
          className="w-full bg-[#003B5C] hover:brightness-110 disabled:bg-gray-300 disabled:cursor-not-allowed text-white py-2.5 px-3 rounded-none text-xs font-bold tracking-wider uppercase flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-md"
        >
          {isZipping ? (
            <>
              <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Encrypting &amp; Compiling...
            </>
          ) : (
            <>
              <Download className="w-3.5 h-3.5" />
              Download Encrypted ZIP ({documents.length} Docs)
            </>
          )}
        </button>

        {zipError && (
          <div className="p-2 bg-red-50 border border-red-200 rounded-none text-red-700 text-[11px] flex items-start gap-1.5 mt-2">
            <CircleAlert className="w-3.5 h-3.5 shrink-0 mt-0.5" />
            <span className="font-medium">{zipError}</span>
          </div>
        )}

        {zipSuccess && (
          <div className="p-2 bg-green-50 border border-green-200 rounded-none text-green-700 text-[11px] flex items-start gap-1.5 mt-2">
            <Check className="w-3.5 h-3.5 shrink-0 mt-0.5" />
            <span className="font-semibold">{zipSuccess}</span>
          </div>
        )}
      </div>

      {showReport && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-[1000] p-4 overflow-y-auto">
          <div className="bg-white border-t-8 border-[#003B5C] rounded-none max-w-3xl w-full p-6 md:p-8 shadow-2xl relative my-8 animate-in fade-in zoom-in-95 duration-150 text-gray-900">
            <button
              onClick={() => setShowReport(false)}
              className="absolute top-4 right-4 text-stone-400 hover:text-stone-600 font-mono text-xs cursor-pointer select-none bg-stone-100 rounded-none px-2 py-1"
            >
              [Close]
            </button>

            <div id="printable-area" className="space-y-8 font-sans">
              <div className="border-b-2 border-gray-200 pb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-serif text-2xl font-bold tracking-tight text-[#003B5C]">
                      GSP Redaction Summary
                    </span>
                  </div>
                  <p className="text-[9px] font-mono text-gray-500 uppercase mt-1 tracking-widest font-bold">
                    Beta Evaluation Report — Not a Compliance Certification
                  </p>
                </div>
                <div className="bg-gray-50 border border-gray-200 rounded-none p-3 text-right shrink-0">
                  <span className="text-[9px] font-mono block text-[#003B5C] uppercase tracking-wider font-extrabold">
                    Categories Enabled
                  </span>
                  <span className="text-lg font-serif font-extrabold text-[#003B5C]">
                    {stats.complianceScore}%
                  </span>
                </div>
              </div>

              <div className="bg-gray-50 border border-gray-200 rounded-none p-5">
                <h4 className="font-serif text-sm font-bold text-[#003B5C] mb-3 flex items-center gap-1.5 uppercase tracking-wide">
                  <Sparkles className="w-4 h-4 text-[#003B5C]" />
                  Redaction Summary
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="space-y-2">
                    <div>
                      <span className="text-[10px] font-mono text-gray-400 uppercase block">
                        Document Name
                      </span>
                      <span className="font-bold text-gray-950">{title}</span>
                    </div>
                    <div>
                      <span className="text-[10px] font-mono text-gray-400 uppercase block">
                        Processed
                      </span>
                      <span className="font-semibold text-gray-950 font-mono">
                        {processedDate}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] font-mono text-gray-400 uppercase block">
                        Assigned Risk Rating
                      </span>
                      <span className="font-bold text-green-700">
                        {stats.riskScore}
                      </span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div>
                      <span className="text-[10px] font-mono text-gray-400 uppercase block">
                        Anonymized Category Metrics
                      </span>
                      <ul className="text-[11px] text-gray-700 space-y-0.5 mt-0.5 font-mono">
                        <li>• Names Redacted: {stats.byCategory.NAME || 0}</li>
                        <li>
                          • Locations Redacted: {stats.byCategory.ADDRESS || 0}
                        </li>
                        <li>
                          • Finances Redacted: {stats.byCategory.FINANCIAL || 0}
                        </li>
                        <li>
                          • Contact Coordinates:{' '}
                          {(stats.byCategory.EMAIL || 0) +
                            (stats.byCategory.PHONE || 0)}
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
                <p className="text-[10px] text-gray-500 mt-4 italic border-t border-gray-200 pt-3 font-medium">
                  This document was processed using pattern-matching algorithms
                  entirely in your browser. No document plaintext was
                  transmitted over a network or stored on a server. This is a
                  beta tool, not a certified compliance product — always have a
                  licensed professional review redactions before relying on or
                  sharing this document.
                </p>
              </div>

              <div>
                <h4 className="font-serif text-xs font-bold text-[#003B5C] uppercase tracking-widest border-b border-gray-200 pb-2 mb-4">
                  Anonymized Document Body Representation
                </h4>
                <div className="bg-stone-50 border border-stone-200 rounded-none p-6 font-mono text-xs text-stone-800 leading-relaxed whitespace-pre-wrap select-text max-h-[300px] overflow-y-auto">
                  {getCleanText()}
                </div>
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-stone-200 flex justify-between gap-3">
              <span className="text-[10px] text-stone-400 font-mono flex items-center gap-1">
                <ShieldAlert className="w-3.5 h-3.5" />
                Beta — verify before relying on this
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowReport(false)}
                  className="px-4 py-2 border border-stone-300 rounded-none text-xs font-bold uppercase hover:bg-stone-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handlePrint}
                  className="bg-[#003B5C] hover:brightness-110 text-white px-5 py-2.5 rounded-none text-xs font-bold uppercase tracking-wider flex items-center gap-2 cursor-pointer shadow-md"
                >
                  <Printer className="w-4 h-4" />
                  Print Report / Save as PDF
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
