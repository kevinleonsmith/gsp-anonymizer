/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import type {
  CategoryId,
  RedactionStyle,
  SandboxDocument,
  Segment,
} from '../types';
import { REDACTION_CATEGORIES } from './categories';

interface EntityMatch {
  start: number;
  end: number;
  text: string;
  category: CategoryId;
}

/**
 * Splits text into plain and redacted segments using the enabled pattern
 * categories plus any user-supplied custom redaction words.
 */
export function segmentText(
  text: string,
  enabledCategories: Set<string>,
  customRedactedWords: Set<string>,
): Segment[] {
  if (!text) return [];

  const matches: EntityMatch[] = [];
  REDACTION_CATEGORIES.forEach((category) => {
    if (!enabledCategories.has(category.id)) return;
    const pattern = category.pattern;
    pattern.lastIndex = 0;
    let match: RegExpExecArray | null;
    while ((match = pattern.exec(text)) !== null) {
      // Avoid infinite loops on zero-length matches.
      if (match.index === pattern.lastIndex) pattern.lastIndex++;
      const matchedText = match[0];
      matches.push({
        start: match.index,
        end: match.index + matchedText.length,
        text: matchedText,
        category: category.id,
      });
    }
  });

  // Earliest first; for equal starts, longest first.
  matches.sort((a, b) =>
    a.start !== b.start ? a.start - b.start : b.end - b.start - (a.end - a.start),
  );

  // Drop overlapping matches.
  const nonOverlapping: EntityMatch[] = [];
  let lastEnd = 0;
  for (const match of matches) {
    if (match.start >= lastEnd) {
      nonOverlapping.push(match);
      lastEnd = match.end;
    }
  }

  const segments: Segment[] = [];
  let cursor = 0;
  let nextId = 1;

  nonOverlapping.forEach((match) => {
    if (match.start > cursor) {
      const plain = text.substring(cursor, match.start);
      segments.push(...tokenizePlainText(plain, customRedactedWords, () => `plain-${nextId++}`));
    }
    segments.push({
      id: `entity-${nextId++}`,
      text: match.text,
      originalText: match.text,
      category: match.category,
      isRedacted: true,
      explanation: `Matched: ${getCategoryLabel(match.category)}`,
    });
    cursor = match.end;
  });

  if (cursor < text.length) {
    const rest = text.substring(cursor);
    segments.push(...tokenizePlainText(rest, customRedactedWords, () => `plain-${nextId++}`));
  }

  return segments;
}

function tokenizePlainText(
  text: string,
  customRedactedWords: Set<string>,
  createId: () => string,
): Segment[] {
  if (!text) return [];
  const tokens = text.split(/(\s+|\b)/g).filter(Boolean);
  const segments: Segment[] = [];
  for (const token of tokens) {
    const normalized = token.trim().replace(/[.,;:()'"?!]/g, '');
    if (normalized && customRedactedWords.has(normalized.toLowerCase())) {
      segments.push({
        id: createId(),
        text: token,
        originalText: token,
        category: 'CUSTOM',
        isRedacted: true,
        explanation: 'Manually redacted by user',
      });
    } else {
      segments.push({ id: createId(), text: token, originalText: token, isRedacted: false });
    }
  }
  return segments;
}

export function getCategoryLabel(category?: string): string {
  switch (category) {
    case 'NAME':
      return 'Personal Name';
    case 'EMAIL':
      return 'Email Address';
    case 'PHONE':
      return 'Phone Number';
    case 'ADDRESS':
      return 'Location Address';
    case 'FINANCIAL':
      return 'Financial Figure';
    case 'ORGANIZATION':
      return 'Organization/Firm';
    case 'DATE':
      return 'Date/Timestamp';
    case 'CUSTOM':
      return 'User Custom Selection';
    default:
      return 'Sensitive Entity';
  }
}

/** Segments a sandbox document and restores any segments the user whitelisted. */
export function resolveDocumentSegments(
  doc: SandboxDocument,
  enabledCategories: Set<string>,
): Segment[] {
  return segmentText(doc.rawText, enabledCategories, doc.customRedactedWords).map((segment) =>
    doc.whitelistedSegmentIds.has(segment.id) ? { ...segment, isRedacted: false } : segment,
  );
}

/** Renders segments to plain text, masking redacted segments in the given style. */
export function renderRedactedText(segments: Segment[], style: RedactionStyle): string {
  return segments
    .map((segment) => {
      if (!segment.isRedacted) return segment.text;
      const text = segment.text;
      switch (style) {
        case 'BLACKOUT':
          return '█'.repeat(Math.max(4, Math.min(12, text.length)));
        case 'LABEL':
          return `[REDACTED_${segment.category || 'INFO'}]`;
        case 'UNDERLINE':
          return '_'.repeat(Math.max(6, Math.min(12, text.length)));
        case 'BLUR':
          return `[BLURRED: ${text}]`;
        default:
          return '[REDACTED]';
      }
    })
    .join('');
}
