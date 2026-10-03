export type CategoryId =
  | 'NAME'
  | 'EMAIL'
  | 'PHONE'
  | 'ADDRESS'
  | 'FINANCIAL'
  | 'ORGANIZATION'
  | 'DATE';

export type SegmentCategory = CategoryId | 'CUSTOM';

export type RedactionStyle = 'BLACKOUT' | 'LABEL' | 'UNDERLINE' | 'BLUR';

export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH';

export interface RedactionCategory {
  id: CategoryId;
  name: string;
  color: string;
  textColor: string;
  description: string;
  icon: string;
  pattern: RegExp;
}

export interface Segment {
  id: string;
  text: string;
  originalText: string;
  isRedacted: boolean;
  category?: SegmentCategory;
  explanation?: string;
}

export interface SampleDocument {
  id: string;
  title: string;
  rawText: string;
  [key: string]: unknown;
}

export interface SandboxDocument {
  id: string;
  title: string;
  rawText: string;
  isCustom: boolean;
  size?: number;
  whitelistedSegmentIds: Set<string>;
  customRedactedWords: Set<string>;
}

/** Payload produced by the upload/paste panel before App assigns ids. */
export interface NewDocumentInput {
  title: string;
  rawText: string;
  size?: number;
}

export interface RedactionStats {
  totalRedacted: number;
  byCategory: Record<SegmentCategory, number>;
  complianceScore: number;
  riskScore: RiskLevel;
}
