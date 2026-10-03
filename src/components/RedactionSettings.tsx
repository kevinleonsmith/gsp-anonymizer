import { SlidersHorizontal, Square, SquareCheckBig } from 'lucide-react';
import type { RedactionStyle } from '../types';
import { REDACTION_CATEGORIES } from '../lib/categories';

interface RedactionSettingsProps {
  enabledCategories: Set<string>;
  onCategoriesChange: (next: Set<string>) => void;
  redactionStyle: RedactionStyle;
  onStyleChange: (style: RedactionStyle) => void;
}

interface StyleOption {
  id: RedactionStyle;
  label: string;
  description: string;
  preview: string;
}

const STYLE_OPTIONS: StyleOption[] = [
  {
    id: 'BLACKOUT',
    label: 'Solid Blackout Bar',
    description: 'Permanent pixel-perfect blackout overlay.',
    preview: '███████████',
  },
  {
    id: 'LABEL',
    label: 'Descriptive Token Tag',
    description: 'Replaces sensitive text with brackets like [NAME_1].',
    preview: '[REDACTED_NAME]',
  },
  {
    id: 'UNDERLINE',
    label: 'Document Underline',
    description: 'Leaves a clean, empty placeholder line.',
    preview: '_________________',
  },
  {
    id: 'BLUR',
    label: 'Live CSS Text Blur',
    description: 'Blurs the actual characters on hover/export.',
    preview: 'Confidential Info',
  },
];

export default function RedactionSettings({
  enabledCategories,
  onCategoriesChange,
  redactionStyle,
  onStyleChange,
}: RedactionSettingsProps) {
  const toggleCategory = (categoryId: string) => {
    const next = new Set(enabledCategories);
    if (next.has(categoryId)) {
      next.delete(categoryId);
    } else {
      next.add(categoryId);
    }
    onCategoriesChange(next);
  };

  const selectAll = () => {
    onCategoriesChange(new Set<string>(REDACTION_CATEGORIES.map((category) => category.id)));
  };

  const deselectAll = () => {
    onCategoriesChange(new Set<string>());
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xs font-bold uppercase tracking-widest text-[#003B5C] font-mono flex items-center gap-1.5 mb-3">
          <SlidersHorizontal className="w-4 h-4 text-[#003B5C]" />
          02. Redaction Criteria
        </h3>
        <p className="text-xs text-gray-600 leading-relaxed font-medium">
          Define which classes of corporate, financial, or personal identifiers are flagged for
          automatic masking. Toggle rules in real time.
        </p>
      </div>

      <div className="flex gap-2 text-[10px] font-mono font-bold uppercase tracking-wider">
        <button
          onClick={selectAll}
          className="flex-1 py-2 px-2 border border-[#003B5C]/20 rounded-none bg-white text-[#003B5C] hover:bg-[#003B5C]/5 transition-colors cursor-pointer text-center"
        >
          Select All
        </button>
        <button
          onClick={deselectAll}
          className="flex-1 py-2 px-2 border border-[#003B5C]/20 rounded-none bg-white text-[#003B5C] hover:bg-[#003B5C]/5 transition-colors cursor-pointer text-center"
        >
          Deselect All
        </button>
      </div>

      <div className="space-y-2">
        {REDACTION_CATEGORIES.map((category) => {
          const isEnabled = enabledCategories.has(category.id);
          return (
            <div
              key={category.id}
              onClick={() => toggleCategory(category.id)}
              className={`p-2.5 rounded-none border transition-all cursor-pointer flex items-center gap-3 ${isEnabled ? 'bg-white border-[#003B5C] shadow-xs' : 'bg-gray-50/40 border-gray-100 opacity-70 hover:opacity-100 hover:bg-white hover:border-gray-300'}`}
            >
              <div className="text-[#003B5C]">
                {isEnabled ? (
                  <SquareCheckBig className="w-4 h-4 text-[#003B5C]" />
                ) : (
                  <Square className="w-4 h-4 text-gray-300" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span
                    className={`text-[10px] font-mono font-bold ${category.textColor} ${category.color} px-2 py-0.5 rounded-none border border-current/25`}
                  >
                    {category.name}
                  </span>
                </div>
                <p className="text-[10px] text-gray-500 mt-0.5 leading-snug">
                  {category.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="relative flex py-1 items-center">
        <div className="flex-grow border-t border-gray-200" />
        <span className="flex-shrink mx-3 text-[10px] font-mono uppercase tracking-widest text-gray-500 font-bold">
          Mask Style
        </span>
        <div className="flex-grow border-t border-gray-200" />
      </div>

      <div className="grid grid-cols-1 gap-2">
        {STYLE_OPTIONS.map((option) => {
          const isSelected = redactionStyle === option.id;
          return (
            <button
              key={option.id}
              onClick={() => onStyleChange(option.id)}
              className={`w-full text-left p-2.5 rounded-none border transition-all flex items-start gap-2.5 ${isSelected ? 'bg-white border-[#003B5C] shadow-xs ring-1 ring-[#003B5C]' : 'bg-gray-50 border-gray-200 hover:bg-white hover:border-[#003B5C]'}`}
            >
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center gap-2">
                  <span className="text-[12px] font-bold text-[#003B5C]">{option.label}</span>
                  <div className="text-[10px] font-mono text-gray-500 bg-gray-50 px-2 py-0.5 rounded-none border border-gray-200">
                    {option.id === 'BLUR' ? (
                      <span className="blur-[1.5px] hover:blur-none select-none transition-all">
                        {option.preview}
                      </span>
                    ) : (
                      <span>{option.preview}</span>
                    )}
                  </div>
                </div>
                <p className="text-[10px] text-gray-500 mt-0.5 leading-snug">
                  {option.description}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
