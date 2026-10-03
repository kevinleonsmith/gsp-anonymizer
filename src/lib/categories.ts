/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import type { RedactionCategory } from '../types';

export const REDACTION_CATEGORIES: RedactionCategory[] = [
  {
    id: 'NAME',
    name: 'Personal Names',
    color: 'bg-[#D2E2FF] border-[#ADC8FF]',
    textColor: 'text-[#002D80]',
    description: 'Full names, initials, surnames, and professional titles.',
    icon: 'User',
    pattern:
      /\b([A-Z][a-z]+(?:\s+[A-Z]\.?\s+|\s+)[A-Z][a-z]+(?:,\s*[A-Z](?:[A-Z\s]*[A-Z])?)?)\b/g,
  },
  {
    id: 'EMAIL',
    name: 'Email Addresses',
    color: 'bg-[#D2F4E2] border-[#A2E9C1]',
    textColor: 'text-[#065A31]',
    description: 'Corporate and personal contact email addresses.',
    icon: 'Mail',
    pattern: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/g,
  },
  {
    id: 'PHONE',
    name: 'Phone Numbers',
    color: 'bg-[#FFE6C2] border-[#FFD08A]',
    textColor: 'text-[#7D4600]',
    description: 'Direct telephone, facsimile, and mobile dial-lines.',
    icon: 'Phone',
    pattern: /(?:\+?\d{1,3}[-. ]?)?\(?\d{3}\)?[-. ]?\d{3}[-. ]?\d{4}\b/g,
  },
  {
    id: 'ADDRESS',
    name: 'Locations & Addresses',
    color: 'bg-[#F2E4FF] border-[#E0C2FF]',
    textColor: 'text-[#5000A1]',
    description: 'Streets, corporate offices, cities, states, and postal codes.',
    icon: 'MapPin',
    pattern:
      /\b\d+\s+[A-Za-z0-9\s.,#-]+(?:Street|St|Avenue|Ave|Road|Rd|Drive|Dr|Lane|Ln|Boulevard|Blvd|Plaza|Plz|Suite|Ste|Floor|Fl|New York|Springfield|Chicago|Houston|Miami|SF|NY|CA|OR|TX|FL|IL)\b/gi,
  },
  {
    id: 'FINANCIAL',
    name: 'Financial Values',
    color: 'bg-[#CCF7F4] border-[#99EFE8]',
    textColor: 'text-[#00524C]',
    description: 'Salaries, purchase prices, escrows, interest rates, and bank accounts.',
    icon: 'DollarSign',
    pattern:
      /\$\s*\d{1,3}(?:,\d{3})*(?:\.\d{2})?|\b\d+(?:\.\d+)?%(?:\s*(?:APR|interest|rate))?/gi,
  },
  {
    id: 'ORGANIZATION',
    name: 'Organizations & Firms',
    color: 'bg-[#FFE2E2] border-[#FFBDBD]',
    textColor: 'text-[#850000]',
    description: 'Companies, LLCs, legal counsels, and financial institutions.',
    icon: 'Briefcase',
    pattern:
      /\b([A-Z][a-zA-Z0-9&]*(?:\s+[A-Z][a-zA-Z0-9&]*)*\s+(?:Corporation|Corp|LLC|Inc|LLP|Partners|Holdings|Bank|Co|Company))\b/g,
  },
  {
    id: 'DATE',
    name: 'Dates & Stamps',
    color: 'bg-[#F9F0D6] border-[#ECDCB0]',
    textColor: 'text-[#634E0C]',
    description: 'Specific dates, calendar months, signing periods, and fiscal deadlines.',
    icon: 'Calendar',
    pattern:
      /\b(?:\d{1,2}[-/]\d{1,2}[-/]\d{2,4}|(?:January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{1,2}(?:st|nd|rd|th)?,\s+\d{4})\b/gi,
  },
];
