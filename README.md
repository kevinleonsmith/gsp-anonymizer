# GSP Anonymizer (Beta)

Client-side document redaction for legal, real estate, and corporate files. Everything runs in the browser — no document text is sent to a server.

**Live:** https://gsp-anonymizer.vercel.app

> Beta evaluation build, not a certified compliance product. Detection is pattern-based and can miss or over-match content — review every redaction before relying on an exported document.

## Features

- Load `.txt`, `.pdf` (text layer), and `.docx` files, or paste text — up to 5 custom documents plus 3 sample presets
- Toggle detection for names, emails, phones, addresses, financial figures, organizations, and dates
- Click highlights to whitelist them, or click words to redact them everywhere
- Mask styles: blackout, label tokens, underline, blur
- Export: copy, `.txt` download, printable summary report, and a password-protected (AES-256) ZIP of all documents

## Development

```sh
npm install
npm run dev      # local dev server
npm run build    # typecheck + production build to dist/
```

Stack: React 19, TypeScript, Vite, Tailwind CSS v4, pdf.js, mammoth, zip.js.

Pushes to `main` deploy to production on Vercel automatically.

## Layout

- `src/App.tsx` — app state and page layout
- `src/components/` — input, criteria, viewer, audit, and export panels
- `src/lib/categories.ts` — detection patterns
- `src/lib/redaction.ts` — segmentation and mask rendering
- `src/lib/extract.ts` — PDF/DOCX text extraction
- `reference-bundle/` — prettified original production bundle this source was reconstructed from
