import { Lock, ShieldCheck } from 'lucide-react';

export default function Header() {
  return (
    <header className="w-full bg-[#003B5C] text-white border-b border-white/10 sticky top-0 z-50 shadow-lg shrink-0">
      <div className="bg-[#002236] text-white/80 py-1.5 px-4 text-[10px] uppercase tracking-widest font-mono flex justify-between items-center">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
          <span>100% Client-Side — Nothing Leaves Your Browser</span>
        </div>
        <div className="hidden md:flex items-center gap-4">
          <span>Beta — Review Every Redaction Before Relying On It</span>
          <span>•</span>
          <span>No Data Transmitted to Server</span>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-white rounded-xs flex items-center justify-center font-bold text-[#003B5C] text-lg select-none">
            G
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-serif text-2xl font-bold tracking-tight text-white italic">
                GSP Anonymizer
              </span>
              <span className="text-[10px] bg-white/20 text-white font-mono px-2 py-0.5 rounded-sm border border-white/10">
                Beta Preview
              </span>
            </div>
            <p className="text-xs text-white/70 font-medium mt-0.5">
              {
                'Document Anonymization & Redaction Console — evaluation build, not a certified compliance product'
              }
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3 text-xs font-sans">
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white/10 border border-white/10 rounded-sm text-white/95">
            <Lock className="w-3.5 h-3.5 text-white/80" />
            <span className="font-mono text-[11px] font-medium">100% Client-Side Engine</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-[#747d63]/80 border border-white/15 rounded-sm text-white font-bold">
            <ShieldCheck className="w-3.5 h-3.5 text-white" />
            <span className="font-mono text-[11px]">Human Review Required</span>
          </div>
        </div>
      </div>
    </header>
  );
}
