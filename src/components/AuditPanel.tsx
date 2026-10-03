import { CircleCheck, ShieldAlert, ShieldCheck } from 'lucide-react';
import { REDACTION_CATEGORIES } from '../lib/categories';
import type { CategoryId, RedactionStats } from '../types';

const CRITICAL_CATEGORY_IDS: CategoryId[] = ['NAME', 'EMAIL', 'PHONE', 'ADDRESS', 'FINANCIAL'];

export default function AuditPanel({
  stats,
  enabledCategories,
  customRedactedWordsCount,
}: {
  stats: RedactionStats;
  enabledCategories: Set<string>;
  customRedactedWordsCount: number;
}) {
  const disabledCriticalCategories = REDACTION_CATEGORIES.filter(
    (category) =>
      !enabledCategories.has(category.id) && CRITICAL_CATEGORY_IDS.includes(category.id),
  );
  const riskScore = stats.riskScore;
  const complianceScore = stats.complianceScore;

  return (
    <div className="bg-white/95 border-l-4 border-[#003B5C] p-5 shadow-md rounded-none space-y-6">
      <div className="flex justify-between items-center pb-4 border-b border-gray-200">
        <div>
          <span className="text-[9px] font-mono font-bold text-gray-500 uppercase tracking-widest">
            Security Diagnostics
          </span>
          <h3 className="font-serif text-base font-bold text-[#003B5C] mt-0.5">
            Anonymization Audit
          </h3>
        </div>
        <div className="text-right">
          <span className="text-[9px] font-mono font-bold text-gray-500 block uppercase tracking-widest">
            Categories Enabled
          </span>
          <span className="font-serif text-xl font-bold text-[#003B5C]">{complianceScore}%</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-gray-50 border border-gray-200 rounded-none p-3.5 text-center flex flex-col justify-between h-28">
          <span className="text-[10px] font-mono uppercase text-[#003B5C] block font-bold tracking-wider">
            Sanitization Level
          </span>
          <div className="my-1 flex items-center justify-center gap-1.5">
            {complianceScore === 100 ? (
              <ShieldCheck className="w-7 h-7 text-green-600 animate-bounce" />
            ) : (
              <ShieldAlert className="w-7 h-7 text-amber-600" />
            )}
            <span className="text-xl font-serif font-extrabold text-[#003B5C]">
              {complianceScore}%
            </span>
          </div>
          <span className="text-[9px] text-gray-500 leading-tight">
            {complianceScore === 100
              ? 'All redaction categories are enabled.'
              : 'Some redaction categories are turned off.'}
          </span>
        </div>

        <div className="bg-gray-50 border border-gray-200 rounded-none p-3.5 text-center flex flex-col justify-between h-28">
          <span className="text-[10px] font-mono uppercase text-[#003B5C] block font-bold tracking-wider">
            PII Leak Risk
          </span>
          <div className="my-1">
            <span
              className={`text-xs font-mono font-bold px-3 py-1 rounded-none border inline-block ${riskScore === 'LOW' ? 'bg-green-50 text-green-700 border-green-200' : riskScore === 'MEDIUM' ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-red-50 text-red-700 border-red-200'}`}
            >
              {riskScore} RISK
            </span>
          </div>
          <span className="text-[9px] text-gray-500 leading-tight">
            {riskScore === 'LOW'
              ? 'All vital data-fields isolated securely.'
              : 'Some identifiers remain unmasked.'}
          </span>
        </div>
      </div>

      <div className="space-y-2.5">
        <h4 className="text-[10px] font-mono text-[#003B5C] uppercase tracking-wider font-bold">
          Redaction Summary
        </h4>
        <div className="space-y-2">
          {REDACTION_CATEGORIES.map((category) => {
            const count = stats.byCategory[category.id] || 0;
            const isEnabled = enabledCategories.has(category.id);
            const color = category.color;
            return (
              <div key={category.id} className="flex justify-between items-center text-xs">
                <div className="flex items-center gap-2 min-w-0">
                  <div
                    className={`w-2.5 h-2.5 rounded-none ${color.split(' ')[0]} border border-gray-200`}
                  />
                  <span
                    className={`font-semibold truncate ${isEnabled ? 'text-gray-900' : 'text-stone-300 line-through'}`}
                  >
                    {category.name}
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span
                    className={`font-mono text-[11px] font-bold ${count > 0 && isEnabled ? 'text-[#003B5C]' : 'text-gray-400'}`}
                  >
                    {isEnabled ? `${count} redacted` : 'inactive'}
                  </span>
                </div>
              </div>
            );
          })}
          <div className="flex justify-between items-center text-xs border-t border-gray-200 pt-2 mt-1">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-none bg-amber-100 border border-amber-300" />
              <span className="font-semibold text-gray-900">Custom Manual Filters</span>
            </div>
            <span className="font-mono text-[11px] font-bold text-gray-900">
              {customRedactedWordsCount} words masked
            </span>
          </div>
        </div>
      </div>

      {disabledCriticalCategories.length > 0 && (
        <div className="p-3 bg-amber-50 border border-amber-200 rounded-none text-amber-800 text-[11px]">
          <span className="font-bold block mb-0.5">⚠️ Unmasked Vulnerabilities:</span>
          <span className="font-bold">
            {disabledCriticalCategories.map((category) => category.name).join(', ')}
          </span>
          {
            ' will pass through unredacted — turn this category on before sharing a document that contains it.'
          }
        </div>
      )}

      <div className="bg-[#003B5C] text-white p-3.5 rounded-none text-center flex items-center justify-center gap-2 text-[10px] tracking-widest font-mono font-bold uppercase shadow-sm">
        <CircleCheck className="w-4 h-4 text-white" />
        <span>Processed 100% Locally In Your Browser</span>
      </div>
    </div>
  );
}
