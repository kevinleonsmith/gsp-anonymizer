function bp() {
  return d.jsxs("header", {
    className:
      "w-full bg-[#003B5C] text-white border-b border-white/10 sticky top-0 z-50 shadow-lg shrink-0",
    children: [
      d.jsxs("div", {
        className:
          "bg-[#002236] text-white/80 py-1.5 px-4 text-[10px] uppercase tracking-widest font-mono flex justify-between items-center",
        children: [
          d.jsxs("div", {
            className: "flex items-center gap-2",
            children: [
              d.jsx("span", {
                className:
                  "w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse",
              }),
              d.jsx("span", {
                children: "100% Client-Side — Nothing Leaves Your Browser",
              }),
            ],
          }),
          d.jsxs("div", {
            className: "hidden md:flex items-center gap-4",
            children: [
              d.jsx("span", {
                children: "Beta — Review Every Redaction Before Relying On It",
              }),
              d.jsx("span", { children: "•" }),
              d.jsx("span", { children: "No Data Transmitted to Server" }),
            ],
          }),
        ],
      }),
      d.jsxs("div", {
        className:
          "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row justify-between items-center gap-4",
        children: [
          d.jsxs("div", {
            className: "flex items-center gap-3",
            children: [
              d.jsx("div", {
                className:
                  "w-8 h-8 bg-white rounded-xs flex items-center justify-center font-bold text-[#003B5C] text-lg select-none",
                children: "V",
              }),
              d.jsxs("div", {
                children: [
                  d.jsxs("div", {
                    className: "flex items-center gap-2",
                    children: [
                      d.jsx("span", {
                        className:
                          "font-serif text-2xl font-bold tracking-tight text-white italic",
                        children: "Veridact Anonymizer",
                      }),
                      d.jsx("span", {
                        className:
                          "text-[10px] bg-white/20 text-white font-mono px-2 py-0.5 rounded-sm border border-white/10",
                        children: "Beta Preview",
                      }),
                    ],
                  }),
                  d.jsx("p", {
                    className: "text-xs text-white/70 font-medium mt-0.5",
                    children:
                      "Document Anonymization & Redaction Console — evaluation build, not a certified compliance product",
                  }),
                ],
              }),
            ],
          }),
          d.jsxs("div", {
            className: "flex items-center gap-3 text-xs font-sans",
            children: [
              d.jsxs("div", {
                className:
                  "flex items-center gap-1.5 px-3 py-1.5 bg-white/10 border border-white/10 rounded-sm text-white/95",
                children: [
                  d.jsx(Sm, { className: "w-3.5 h-3.5 text-white/80" }),
                  d.jsx("span", {
                    className: "font-mono text-[11px] font-medium",
                    children: "100% Client-Side Engine",
                  }),
                ],
              }),
              d.jsxs("div", {
                className:
                  "flex items-center gap-1.5 px-3 py-1.5 bg-[#747d63]/80 border border-white/15 rounded-sm text-white font-bold",
                children: [
                  d.jsx(hr, { className: "w-3.5 h-3.5 text-white" }),
                  d.jsx("span", {
                    className: "font-mono text-[11px]",
                    children: "Human Review Required",
                  }),
                ],
              }),
            ],
          }),
        ],
      }),
    ],
  });
}
const wp = "modulepreload",
  Sp = function (s) {
    return "/" + s;
  },
  kd = {},
  Dm = function (c, r, A) {
    let u = Promise.resolve();
    if (r && r.length > 0) {
      let f = function (m) {
        return Promise.all(
          m.map((x) =>
            Promise.resolve(x).then(
              (p) => ({ status: "fulfilled", value: p }),
              (p) => ({ status: "rejected", reason: p }),
            ),
          ),
        );
      };
      document.getElementsByTagName("link");
      const B = document.querySelector("meta[property=csp-nonce]"),
        E =
          (B == null ? void 0 : B.nonce) ||
          (B == null ? void 0 : B.getAttribute("nonce"));
      u = f(
        r.map((m) => {
          if (((m = Sp(m)), m in kd)) return;
          kd[m] = !0;
          const x = m.endsWith(".css"),
            p = x ? '[rel="stylesheet"]' : "";
          if (document.querySelector(`link[href="${m}"]${p}`)) return;
          const b = document.createElement("link");
          if (
            ((b.rel = x ? "stylesheet" : wp),
            x || (b.as = "script"),
            (b.crossOrigin = ""),
            (b.href = m),
            E && b.setAttribute("nonce", E),
            document.head.appendChild(b),
            x)
          )
            return new Promise((N, I) => {
              (b.addEventListener("load", N),
                b.addEventListener("error", () =>
                  I(new Error(`Unable to preload CSS for ${m}`)),
                ));
            });
        }),
      );
    }
    function g(f) {
      const B = new Event("vite:preloadError", { cancelable: !0 });
      if (((B.payload = f), window.dispatchEvent(B), !B.defaultPrevented))
        throw f;
    }
    return u.then((f) => {
      for (const B of f || []) B.status === "rejected" && g(B.reason);
      return c().catch(g);
    });
  },
  Ip = "/assets/pdf.worker-CPbhI6B3.mjs";
async function Dp(s) {
  const c = await Dm(() => import("./pdf-Y4YPUwDk.js"), []);
  c.GlobalWorkerOptions.workerSrc = Ip;
  const r = await s.arrayBuffer(),
    A = await c.getDocument({ data: r }).promise,
    u = [];
  for (let f = 1; f <= A.numPages; f++) {
    const m = (await (await A.getPage(f)).getTextContent()).items
      .map((x) => ("str" in x ? x.str : ""))
      .join(" ");
    u.push(m);
  }
  const g = u
    .join(
      `

`,
    )
    .replace(/[ \t]+/g, " ")
    .trim();
  if (!g)
    throw new Error(
      `"${s.name}" has no extractable text layer (likely a scanned image). Try an OCR'd PDF or paste the text directly.`,
    );
  return g;
}
async function Qp(s) {
  const c = await Dm(
      () => import("./mammoth.browser-5CKOyQim.js").then((g) => g.m),
      [],
    ),
    r = await s.arrayBuffer(),
    u = (await c.extractRawText({ arrayBuffer: r })).value.trim();
  if (!u) throw new Error(`"${s.name}" contains no extractable text.`);
  return u;
}
function Tp({
  documents: s,
  activeDocId: c,
  onSelectDocument: r,
  onAddDocuments: A,
  onDeleteDocument: u,
}) {
  const [g, f] = De.useState(""),
    [B, E] = De.useState("Pasted Contract Agreement"),
    [m, x] = De.useState(!1),
    [p, b] = De.useState(null),
    [N, I] = De.useState(null),
    F = De.useRef(null),
    W = s.filter((X) => !X.isCustom),
    te = s.filter((X) => X.isCustom),
    U = te.length,
    q = (X) => {
      if (!X) return "Pasted Text";
      if (X < 1024) return `${X} B`;
      const Y = X / 1024;
      return Y < 1024 ? `${Y.toFixed(1)} KB` : `${(Y / 1024).toFixed(1)} MB`;
    },
    P = async (X) => {
      (b(null), I(null));
      const Y = Array.from(X);
      if (Y.length === 0) return;
      const J = 5 - U;
      if (J <= 0) {
        b(
          "Workspace capacity reached (5/5 files). Please delete an existing file first.",
        );
        return;
      }
      const H = Y.slice(0, J),
        K = Y.length - H.length,
        $ = [],
        D = async (k) => {
          var C;
          const le =
            (C = k.name.split(".").pop()) == null ? void 0 : C.toLowerCase();
          if (le === "txt") {
            const S = await k.text();
            if (!S.trim()) throw new Error(`"${k.name}" is empty.`);
            return {
              title: k.name.replace(/\.txt$/i, ""),
              rawText: S,
              size: k.size,
            };
          }
          if (le === "pdf") {
            const S = await Dp(k);
            return {
              title: k.name.replace(/\.pdf$/i, ""),
              rawText: S,
              size: k.size,
            };
          }
          if (le === "docx") {
            const S = await Qp(k);
            return {
              title: k.name.replace(/\.docx$/i, ""),
              rawText: S,
              size: k.size,
            };
          }
          throw le === "doc"
            ? new Error(
                `"${k.name}" is a legacy .doc file, which isn't supported — please save it as .docx or paste the text directly.`,
              )
            : new Error(`"${k.name}" has an unsupported format.`);
        },
        j = await Promise.allSettled(H.map(D)),
        ee = [];
      if (
        (j.forEach((k) => {
          k.status === "fulfilled"
            ? $.push(k.value)
            : ee.push(k.reason.message);
        }),
        $.length > 0)
      ) {
        A($);
        let k = `Successfully loaded ${$.length} file(s) into sandbox buffer.`;
        (K > 0 &&
          (k += ` Skipped ${K} file(s) due to workspace limit (max 5 custom docs).`),
          I(k));
      }
      ee.length > 0 && b(`Errors: ${ee.join("; ")}`);
    },
    ue = (X) => {
      (X.preventDefault(), x(!0));
    },
    Z = () => {
      x(!1);
    },
    V = (X) => {
      (X.preventDefault(),
        x(!1),
        X.dataTransfer.files && P(X.dataTransfer.files));
    },
    ne = (X) => {
      X.target.files && P(X.target.files);
    },
    fe = (X) => {
      if ((X.preventDefault(), !g.trim())) {
        b("Please enter some text in the custom document area.");
        return;
      }
      if (U >= 5) {
        b(
          "Workspace is at capacity (5/5 custom documents). Please delete an existing file first.",
        );
        return;
      }
      (A([{ title: B || "Pasted Contract Agreement", rawText: g }]),
        I("Custom text loaded successfully to local buffer."),
        b(null),
        f(""));
    };
  return d.jsxs("div", {
    className: "space-y-6",
    children: [
      d.jsxs("div", {
        children: [
          d.jsxs("h3", {
            className:
              "text-xs font-bold uppercase tracking-widest text-[#003B5C] font-mono flex items-center gap-1.5 mb-3",
            children: [
              d.jsx(Er, { className: "w-4 h-4 text-[#003B5C]" }),
              "01. Document Input",
            ],
          }),
          d.jsx("p", {
            className: "text-xs text-gray-600 leading-relaxed font-medium",
            children:
              "Upload up to 5 custom documents simultaneously or select corporate presets to perform high-finance anonymization.",
          }),
        ],
      }),
      d.jsxs("div", {
        className: "space-y-2",
        children: [
          d.jsx("span", {
            className:
              "text-[9px] font-mono uppercase text-gray-400 font-bold tracking-wider",
            children: "Corporate Presets",
          }),
          d.jsx("div", {
            className: "grid grid-cols-1 gap-2",
            children: W.map((X) => {
              const Y = c === X.id;
              return d.jsxs(
                "button",
                {
                  onClick: () => {
                    (r(X.id), I(null), b(null));
                  },
                  className: `w-full text-left p-3 rounded-none border transition-all flex items-start gap-3 group ${Y ? "bg-white border-[#003B5C] shadow-xs ring-1 ring-[#003B5C]" : "bg-gray-50 border-gray-200 hover:bg-white hover:border-[#003B5C]"}`,
                  children: [
                    d.jsx("div", {
                      className: `p-2 rounded-none ${Y ? "bg-[#003B5C]/10 text-[#003B5C]" : "bg-white border border-gray-200 text-gray-500 group-hover:bg-gray-50"}`,
                      children: d.jsx(uc, { className: "w-4 h-4" }),
                    }),
                    d.jsxs("div", {
                      className: "flex-1 min-w-0",
                      children: [
                        d.jsxs("div", {
                          className: "flex justify-between items-center gap-2",
                          children: [
                            d.jsx("span", {
                              className:
                                "font-serif text-[13px] font-bold text-[#003B5C] truncate",
                              children: X.title,
                            }),
                            d.jsx("span", {
                              className:
                                "text-[9px] font-mono bg-white px-1.5 py-0.5 rounded-none border border-gray-200 text-gray-500 uppercase tracking-wide",
                              children: "Preset",
                            }),
                          ],
                        }),
                        d.jsx("p", {
                          className:
                            "text-[11px] text-gray-500 mt-0.5 leading-snug truncate",
                          children:
                            "Verify client-side legal redactions on corporate sample files.",
                        }),
                      ],
                    }),
                  ],
                },
                X.id,
              );
            }),
          }),
        ],
      }),
      d.jsxs("div", {
        className: "space-y-2 border-t border-gray-100 pt-4",
        children: [
          d.jsxs("div", {
            className:
              "flex justify-between items-center text-[9px] font-mono uppercase font-bold tracking-wider",
            children: [
              d.jsx("span", {
                className: "text-gray-400",
                children: "Sandbox Buffer Uploads",
              }),
              d.jsxs("span", {
                className: U >= 5 ? "text-amber-600" : "text-[#003B5C]",
                children: [U, " / 5 Slots used"],
              }),
            ],
          }),
          te.length === 0
            ? d.jsx("div", {
                className:
                  "p-3 border border-dashed border-gray-200 text-center text-[11px] text-gray-400 font-medium",
                children: "No custom files loaded. Drag up to 5 files below.",
              })
            : d.jsx("div", {
                className:
                  "grid grid-cols-1 gap-2 max-h-56 overflow-y-auto pr-1",
                children: te.map((X) => {
                  const Y = c === X.id;
                  return d.jsxs(
                    "div",
                    {
                      onClick: () => {
                        (r(X.id), I(null), b(null));
                      },
                      className: `w-full text-left p-2.5 rounded-none border transition-all flex items-center justify-between gap-3 group cursor-pointer ${Y ? "bg-white border-[#003B5C] shadow-xs ring-1 ring-[#003B5C]" : "bg-gray-50 border-gray-200 hover:bg-white hover:border-[#003B5C]"}`,
                      children: [
                        d.jsxs("div", {
                          className: "flex items-center gap-2.5 min-w-0 flex-1",
                          children: [
                            d.jsx("div", {
                              className: `p-1.5 rounded-none shrink-0 ${Y ? "bg-[#003B5C]/10 text-[#003B5C]" : "bg-white border border-gray-200 text-gray-400"}`,
                              children: d.jsx(uc, { className: "w-3.5 h-3.5" }),
                            }),
                            d.jsxs("div", {
                              className: "min-w-0 flex-1",
                              children: [
                                d.jsx("p", {
                                  className:
                                    "font-sans text-[12px] font-bold text-gray-800 truncate leading-tight",
                                  children: X.title,
                                }),
                                d.jsx("p", {
                                  className:
                                    "font-mono text-[9px] text-gray-400 mt-0.5",
                                  children: q(X.size),
                                }),
                              ],
                            }),
                          ],
                        }),
                        d.jsx("button", {
                          onClick: (J) => {
                            (J.stopPropagation(), u(X.id));
                          },
                          title: "Remove from sandbox",
                          className:
                            "p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer shrink-0",
                          children: d.jsx(yp, { className: "w-3.5 h-3.5" }),
                        }),
                      ],
                    },
                    X.id,
                  );
                }),
              }),
        ],
      }),
      d.jsxs("div", {
        className: "relative flex py-1 items-center",
        children: [
          d.jsx("div", { className: "flex-grow border-t border-gray-200" }),
          d.jsx("span", {
            className:
              "flex-shrink mx-3 text-[10px] font-mono uppercase tracking-widest text-gray-500 font-bold",
            children: "Secure Bulk Upload",
          }),
          d.jsx("div", { className: "flex-grow border-t border-gray-200" }),
        ],
      }),
      d.jsxs("div", {
        onDragOver: ue,
        onDragLeave: Z,
        onDrop: V,
        onClick: () => {
          var X;
          return (X = F.current) == null ? void 0 : X.click();
        },
        className: `border-2 border-dashed rounded-none p-5 text-center cursor-pointer transition-all duration-200 ${m ? "border-[#003B5C] bg-[#747d63]/10 scale-[0.99]" : "border-[#003B5C]/30 bg-[#747d63]/5 hover:bg-[#747d63]/10"}`,
        children: [
          d.jsx("input", {
            type: "file",
            ref: F,
            onChange: ne,
            accept: ".txt,.pdf,.docx",
            multiple: !0,
            className: "hidden",
          }),
          d.jsx(vp, {
            className:
              "w-7 h-7 mx-auto text-[#003B5C] mb-2 group-hover:scale-110 transition-transform",
          }),
          d.jsx("span", {
            className:
              "block text-[11px] font-bold text-[#003B5C] uppercase tracking-wider mb-0.5",
            children: "DRAG & DROP SECURE FILES",
          }),
          d.jsx("span", {
            className:
              "block text-[10px] text-gray-500 mb-1 font-mono uppercase",
            children: "PDF, DOCX, TXT • SELECT UP TO 5",
          }),
        ],
      }),
      p &&
        d.jsxs("div", {
          className:
            "p-3 bg-red-50 border border-red-200 rounded-none text-red-700 text-xs flex items-start gap-2",
          children: [
            d.jsx(wm, { className: "w-4 h-4 shrink-0 mt-0.5" }),
            d.jsx("span", { className: "font-medium", children: p }),
          ],
        }),
      N &&
        d.jsxs("div", {
          className:
            "p-3 bg-green-50 border border-green-200 rounded-none text-green-700 text-xs flex items-start gap-2",
          children: [
            d.jsx(er, { className: "w-4 h-4 shrink-0 mt-0.5" }),
            d.jsx("span", { className: "font-semibold", children: N }),
          ],
        }),
      d.jsxs("div", {
        className: "relative flex py-1 items-center",
        children: [
          d.jsx("div", { className: "flex-grow border-t border-gray-200" }),
          d.jsx("span", {
            className:
              "flex-shrink mx-3 text-[10px] font-mono uppercase tracking-widest text-gray-500 font-bold",
            children: "Or Paste Text",
          }),
          d.jsx("div", { className: "flex-grow border-t border-gray-200" }),
        ],
      }),
      d.jsxs("form", {
        onSubmit: fe,
        className: "space-y-3",
        children: [
          d.jsxs("div", {
            className: "space-y-1.5",
            children: [
              d.jsx("label", {
                className:
                  "text-[10px] font-mono uppercase text-gray-500 font-bold",
                children: "Document Header / Title",
              }),
              d.jsx("input", {
                type: "text",
                value: B,
                onChange: (X) => E(X.target.value),
                className:
                  "w-full text-xs p-2 rounded-none border border-gray-300 bg-white text-[#1a1a1a] focus:ring-1 focus:ring-[#003B5C] focus:border-[#003B5C] outline-none font-medium",
                placeholder: "e.g. Vendor Agreement Addendum",
              }),
            ],
          }),
          d.jsxs("div", {
            className: "space-y-1.5",
            children: [
              d.jsx("label", {
                className:
                  "text-[10px] font-mono uppercase text-gray-500 font-bold",
                children: "Pasted Clauses",
              }),
              d.jsx("textarea", {
                value: g,
                onChange: (X) => f(X.target.value),
                rows: 4,
                className:
                  "w-full text-xs p-2.5 rounded-none border border-gray-300 bg-white text-[#1a1a1a] focus:ring-1 focus:ring-[#003B5C] focus:border-[#003B5C] outline-none resize-none font-mono",
                placeholder:
                  "Paste raw contract clauses, agreements, or confidential letters here...",
              }),
            ],
          }),
          d.jsxs("button", {
            type: "submit",
            className:
              "w-full bg-[#003B5C] hover:brightness-110 text-white py-3.5 px-3 rounded-none text-xs font-bold tracking-widest uppercase shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer",
            children: [
              d.jsx(XB, { className: "w-3.5 h-3.5" }),
              "Load to Sandbox Buffer",
            ],
          }),
        ],
      }),
    ],
  });
}
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */ const Nl = [
    {
      id: "NAME",
      name: "Personal Names",
      color: "bg-[#D2E2FF] border-[#ADC8FF]",
      textColor: "text-[#002D80]",
      description: "Full names, initials, surnames, and professional titles.",
      icon: "User",
      pattern:
        /\b([A-Z][a-z]+(?:\s+[A-Z]\.?\s+|\s+)[A-Z][a-z]+(?:,\s*[A-Z](?:[A-Z\s]*[A-Z])?)?)\b/g,
    },
    {
      id: "EMAIL",
      name: "Email Addresses",
      color: "bg-[#D2F4E2] border-[#A2E9C1]",
      textColor: "text-[#065A31]",
      description: "Corporate and personal contact email addresses.",
      icon: "Mail",
      pattern: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/g,
    },
    {
      id: "PHONE",
      name: "Phone Numbers",
      color: "bg-[#FFE6C2] border-[#FFD08A]",
      textColor: "text-[#7D4600]",
      description: "Direct telephone, facsimile, and mobile dial-lines.",
      icon: "Phone",
      pattern: /(?:\+?\d{1,3}[-. ]?)?\(?\d{3}\)?[-. ]?\d{3}[-. ]?\d{4}\b/g,
    },
    {
      id: "ADDRESS",
      name: "Locations & Addresses",
      color: "bg-[#F2E4FF] border-[#E0C2FF]",
      textColor: "text-[#5000A1]",
      description:
        "Streets, corporate offices, cities, states, and postal codes.",
      icon: "MapPin",
      pattern:
        /\b\d+\s+[A-Za-z0-9\s.,#-]+(?:Street|St|Avenue|Ave|Road|Rd|Drive|Dr|Lane|Ln|Boulevard|Blvd|Plaza|Plz|Suite|Ste|Floor|Fl|New York|Springfield|Chicago|Houston|Miami|SF|NY|CA|OR|TX|FL|IL)\b/gi,
    },
    {
      id: "FINANCIAL",
      name: "Financial Values",
      color: "bg-[#CCF7F4] border-[#99EFE8]",
      textColor: "text-[#00524C]",
      description:
        "Salaries, purchase prices, escrows, interest rates, and bank accounts.",
      icon: "DollarSign",
      pattern:
        /\$\s*\d{1,3}(?:,\d{3})*(?:\.\d{2})?|\b\d+(?:\.\d+)?%(?:\s*(?:APR|interest|rate))?/gi,
    },
    {
      id: "ORGANIZATION",
      name: "Organizations & Firms",
      color: "bg-[#FFE2E2] border-[#FFBDBD]",
      textColor: "text-[#850000]",
      description:
        "Companies, LLCs, legal counsels, and financial institutions.",
      icon: "Briefcase",
      pattern:
        /\b([A-Z][a-zA-Z0-9&]*(?:\s+[A-Z][a-zA-Z0-9&]*)*\s+(?:Corporation|Corp|LLC|Inc|LLP|Partners|Holdings|Bank|Co|Company))\b/g,
    },
    {
      id: "DATE",
      name: "Dates & Stamps",
      color: "bg-[#F9F0D6] border-[#ECDCB0]",
      textColor: "text-[#634E0C]",
      description:
        "Specific dates, calendar months, signing periods, and fiscal deadlines.",
      icon: "Calendar",
      pattern:
        /\b(?:\d{1,2}[-/]\d{1,2}[-/]\d{2,4}|(?:January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{1,2}(?:st|nd|rd|th)?,\s+\d{4})\b/gi,
    },
  ],
  Lo = [
    {
      id: "real-estate",
      title: "Real Estate Purchase & Escrow Agreement",
      category: "Real Estate",
      description:
        "Standard residential property acquisition document with buyer, seller, address, and financial contingencies.",
      rawText: `REAL ESTATE PURCHASE AND ESCROW CONTRACT

This Agreement is made on October 14, 2026, by and between Robert J. Vance and Eleanor Vance, residing at 1400 Crestview Drive, Springfield, OR (hereinafter referred to as the "Buyer"), and Marcus Brody, representing Brody Estates Trust (hereinafter referred to as the "Seller").

1. PURCHASED PROPERTY: Seller agrees to sell, and Buyer agrees to purchase, the residential single-family home located at 742 Evergreen Terrace, Springfield, OR 97477.

2. FINANCIAL TERM & EARNEST MONEY:
The total agreed purchase price for the property is $1,250,000 (One Million Two Hundred Fifty Thousand Dollars).
The Buyer shall deposit an earnest money amount of $125,000 (representing a 10% earnest deposit) into escrow within 3 business days of signing. Escrow shall be held by Evergreen Escrow & Title Inc. at their main office located at 100 Main Street, Suite 400, Springfield, OR.

3. FINANCING CONTINGENCY:
Buyer is obtaining a conventional mortgage with an interest rate of 6.25% APR from Sterling Trust Bank. If Buyer cannot secure financing by November 1, 2026, this contract may be terminated with escrow returned to the Buyer.

4. REPRESENTATION:
Buyer is represented in this transaction by Arthur Pendelton, Esq., of Pendelton & Associates LLP. Seller is represented by legal advisor Rachel Green at Green & Geller Legal Services.

For inquiries, please reach the Title Officer via email at contact@evergreenescrow.com or call direct-line +1 (555) 019-2834.

IN WITNESS WHEREOF, the parties hereto have executed this contract.

_________________________
Buyer: Robert J. Vance

_________________________
Seller: Marcus Brody`,
    },
    {
      id: "executive-offer",
      title: "Executive Employment Offer Letter",
      category: "HR",
      description:
        "Confidential executive appointment letter outlining compensation, performance incentives, and contact info.",
      rawText: `CONFIDENTIAL EXECUTIVE OFFER LETTER

Date: July 10, 2026

Dear Sarah Jenkins,

On behalf of Quantum Analytics Corp, I am absolutely thrilled to offer you the position of Vice President of Technical Architecture. We are impressed by your credentials and believe your leadership will drive our engineering department's success.

1. COMPENSATION & START DATE:
Your base compensation will be $245,000 per annum, paid in semi-monthly installments starting August 1, 2026. You will report directly to Dr. Alistair Sterling, Chief Executive Officer, at our primary tech hub at 450 Innovation Parkway, Suite 100, SF, CA.

2. STOCK INCENTIVES:
Subject to approval by the Board of Directors, you will be granted 15,000 stock options of Quantum Analytics Corp, vesting over a standard 4-year period with a 1-year cliff.

3. DIRECT CONTACTS:
For onboarding questions, please reach our HR Business Partner, Marcus Flint, at mflint@quantum-analytica.io or call the office at (212) 555-0182. All completed documents should be returned to onboarding@quantum-analytica.io.

Please sign and return this offer by July 15, 2026.

Sincerely,

Dr. Alistair Sterling
CEO, Quantum Analytics Corp

---
I ACCEPT THE OFFER UNDER THE TERMS OUTLINED:

_________________________
Sarah Jenkins
Date Signed: ____________`,
    },
    {
      id: "ma-term-sheet",
      title: "Acquisition Term Sheet (M&A Memo)",
      category: "Finance",
      description:
        "High-value private equity corporate acquisition proposal listing company names, valuations, and legal representation.",
      rawText: `MEMORANDUM OF UNDERSTANDING / ACQUISITION TERM SHEET

This highly confidential Memorandum of Understanding (the "MOU") outlines the preliminary terms for the acquisition of Titan Freight Solutions by Apex Logistics International Inc.

1. TRANSACTION STRUCTURE & VALUATION:
Apex Logistics International Inc. shall acquire 100% of the outstanding shares of Titan Freight Solutions for a total cash-free, debt-free enterprise valuation of $42,000,000 (Forty-Two Million Dollars).
The transaction consideration shall consist of:
- 70% cash payment ($29,400,000) at closing.
- 30% equity rollover ($12,600,000) into Apex Holdings LLC.

2. SIGNING PARTIES & DELEGATION:
This proposal is signed by Charles Montgomery, Managing Director of Apex Logistics International Inc., and Beatrix Kiddo, Founder & CEO of Titan Freight Solutions.

3. ADVISORY AND FEES:
Both companies have retained legal counsel for the execution of this transaction. Apex Logistics International Inc. is represented by Latham & Watkins LLP, led by partner Harvey Specter. Titan Freight Solutions is represented by Pearson Specter LLP, with lead office at One Chase Manhattan Plaza, New York, NY.

4. BREAK FEE & EXCLUSIVITY:
The parties agree to a 45-day exclusivity period beginning August 20, 2026. A non-compliance break-up fee of $1,500,000 shall be payable by either party violating exclusivity.

For communications regarding financial escrow, contact the escrow officer at trust-division@apexholdings.com or dial +1 (212) 555-9000.

_________________________
Charles Montgomery
Managing Director, Apex Logistics International Inc.

_________________________
Beatrix Kiddo
CEO, Titan Freight Solutions`,
    },
  ];
function Rp({
  enabledCategories: s,
  onCategoriesChange: c,
  redactionStyle: r,
  onStyleChange: A,
}) {
  const u = (E) => {
      const m = new Set(s);
      (m.has(E) ? m.delete(E) : m.add(E), c(m));
    },
    g = () => {
      const E = new Set(Nl.map((m) => m.id));
      c(E);
    },
    f = () => {
      c(new Set());
    },
    B = [
      {
        id: "BLACKOUT",
        label: "Solid Blackout Bar",
        description: "Permanent pixel-perfect blackout overlay.",
        preview: "███████████",
      },
      {
        id: "LABEL",
        label: "Descriptive Token Tag",
        description: "Replaces sensitive text with brackets like [NAME_1].",
        preview: "[REDACTED_NAME]",
      },
      {
        id: "UNDERLINE",
        label: "Document Underline",
        description: "Leaves a clean, empty placeholder line.",
        preview: "_________________",
      },
      {
        id: "BLUR",
        label: "Live CSS Text Blur",
        description: "Blurs the actual characters on hover/export.",
        preview: "Confidential Info",
      },
    ];
  return d.jsxs("div", {
    className: "space-y-6",
    children: [
      d.jsxs("div", {
        children: [
          d.jsxs("h3", {
            className:
              "text-xs font-bold uppercase tracking-widest text-[#003B5C] font-mono flex items-center gap-1.5 mb-3",
            children: [
              d.jsx(dp, { className: "w-4 h-4 text-[#003B5C]" }),
              "02. Redaction Criteria",
            ],
          }),
          d.jsx("p", {
            className: "text-xs text-gray-600 leading-relaxed font-medium",
            children:
              "Define which classes of corporate, financial, or personal identifiers are flagged for automatic masking. Toggle rules in real time.",
          }),
        ],
      }),
      d.jsxs("div", {
        className:
          "flex gap-2 text-[10px] font-mono font-bold uppercase tracking-wider",
        children: [
          d.jsx("button", {
            onClick: g,
            className:
              "flex-1 py-2 px-2 border border-[#003B5C]/20 rounded-none bg-white text-[#003B5C] hover:bg-[#003B5C]/5 transition-colors cursor-pointer text-center",
            children: "Select All",
          }),
          d.jsx("button", {
            onClick: f,
            className:
              "flex-1 py-2 px-2 border border-[#003B5C]/20 rounded-none bg-white text-[#003B5C] hover:bg-[#003B5C]/5 transition-colors cursor-pointer text-center",
            children: "Deselect All",
          }),
        ],
      }),
      d.jsx("div", {
        className: "space-y-2",
        children: Nl.map((E) => {
          const m = s.has(E.id);
          return d.jsxs(
            "div",
            {
              onClick: () => u(E.id),
              className: `p-2.5 rounded-none border transition-all cursor-pointer flex items-center gap-3 ${m ? "bg-white border-[#003B5C] shadow-xs" : "bg-gray-50/40 border-gray-100 opacity-70 hover:opacity-100 hover:bg-white hover:border-gray-300"}`,
              children: [
                d.jsx("div", {
                  className: "text-[#003B5C]",
                  children: m
                    ? d.jsx(Ep, { className: "w-4 h-4 text-[#003B5C]" })
                    : d.jsx(pp, { className: "w-4 h-4 text-gray-300" }),
                }),
                d.jsxs("div", {
                  className: "flex-1 min-w-0",
                  children: [
                    d.jsx("div", {
                      className: "flex items-center gap-2",
                      children: d.jsx("span", {
                        className: `text-[10px] font-mono font-bold ${E.textColor} ${E.color} px-2 py-0.5 rounded-none border border-current/25`,
                        children: E.name,
                      }),
                    }),
                    d.jsx("p", {
                      className:
                        "text-[10px] text-gray-500 mt-0.5 leading-snug",
                      children: E.description,
                    }),
                  ],
                }),
              ],
            },
            E.id,
          );
        }),
      }),
      d.jsxs("div", {
        className: "relative flex py-1 items-center",
        children: [
          d.jsx("div", { className: "flex-grow border-t border-gray-200" }),
          d.jsx("span", {
            className:
              "flex-shrink mx-3 text-[10px] font-mono uppercase tracking-widest text-gray-500 font-bold",
            children: "Mask Style",
          }),
          d.jsx("div", { className: "flex-grow border-t border-gray-200" }),
        ],
      }),
      d.jsx("div", {
        className: "grid grid-cols-1 gap-2",
        children: B.map((E) => {
          const m = r === E.id;
          return d.jsx(
            "button",
            {
              onClick: () => A(E.id),
              className: `w-full text-left p-2.5 rounded-none border transition-all flex items-start gap-2.5 ${m ? "bg-white border-[#003B5C] shadow-xs ring-1 ring-[#003B5C]" : "bg-gray-50 border-gray-200 hover:bg-white hover:border-[#003B5C]"}`,
              children: d.jsxs("div", {
                className: "flex-1 min-w-0",
                children: [
                  d.jsxs("div", {
                    className: "flex justify-between items-center gap-2",
                    children: [
                      d.jsx("span", {
                        className: "text-[12px] font-bold text-[#003B5C]",
                        children: E.label,
                      }),
                      d.jsx("div", {
                        className:
                          "text-[10px] font-mono text-gray-500 bg-gray-50 px-2 py-0.5 rounded-none border border-gray-200",
                        children:
                          E.id === "BLUR"
                            ? d.jsx("span", {
                                className:
                                  "blur-[1.5px] hover:blur-none select-none transition-all",
                                children: E.preview,
                              })
                            : d.jsx("span", { children: E.preview }),
                      }),
                    ],
                  }),
                  d.jsx("p", {
                    className: "text-[10px] text-gray-500 mt-0.5 leading-snug",
                    children: E.description,
                  }),
                ],
              }),
            },
            E.id,
          );
        }),
      }),
    ],
  });
}
function Mp({
  title: s,
  segments: c,
  redactionStyle: r,
  onToggleSegmentRedaction: A,
  onAddCustomRedaction: u,
  onRemoveCustomRedaction: g,
  customRedactedWords: f,
  onResetDocument: B,
  isAnalyzing: E = !1,
  analysisProgress: m = 0,
}) {
  var q, P, ue;
  const [x, p] = De.useState("REVIEW"),
    [b, N] = De.useState(null),
    [I, F] = De.useState(null),
    W = (Z) => {
      const V = Z.text;
      switch (r) {
        case "BLACKOUT":
          return d.jsx("span", {
            className:
              "bg-[#1a1a1a] text-[#1a1a1a] select-none font-mono rounded-none px-1",
            children: "█".repeat(Math.max(4, Math.min(12, V.length))),
          });
        case "LABEL":
          return d.jsxs("span", {
            className:
              "bg-[#003B5C] text-white font-mono text-[9px] px-2 py-0.5 rounded-none font-bold uppercase tracking-wider select-none border border-white/20",
            children: ["[", Z.category || "REDACTED", "]"],
          });
        case "UNDERLINE":
          return d.jsx("span", {
            className:
              "font-mono text-gray-500 border-b-2 border-gray-900 font-bold select-none px-1",
            children: "‗".repeat(Math.max(5, Math.min(10, V.length))),
          });
        case "BLUR":
          return d.jsx("span", {
            className:
              "blur-[4px] bg-gray-100 px-1 rounded-none select-none hover:blur-[1px] transition-all duration-200",
            children: V,
          });
        default:
          return d.jsx("span", {
            className: "bg-[#1a1a1a] text-[#1a1a1a] select-none",
            children: "█████",
          });
      }
    },
    te = (Z, V) => {
      V.stopPropagation();
      const ne = Z.trim()
        .replace(/[.,;:()'"?!]/g, "")
        .toLowerCase();
      ne && (f.has(ne) ? g(ne) : u(ne));
    },
    U = (Z) =>
      Z
        ? Nl.find((V) => V.id === Z) || {
            name: "Custom User Redaction",
            color: "bg-amber-100 border-amber-300",
            textColor: "text-amber-900",
          }
        : null;
  return d.jsxs("div", {
    className:
      "bg-white/95 border-l-4 border-[#003B5C] p-4 md:p-6 shadow-md rounded-none flex flex-col h-full min-h-[500px]",
    children: [
      d.jsxs("div", {
        className:
          "flex flex-col sm:flex-row justify-between items-start sm:items-center pb-4 border-b border-gray-200 gap-3 mb-4",
        children: [
          d.jsxs("div", {
            children: [
              d.jsx("span", {
                className:
                  "text-[9px] font-mono font-bold text-gray-500 uppercase tracking-widest",
                children: "Active Workspace",
              }),
              d.jsx("h2", {
                className:
                  "font-serif text-lg font-bold text-[#003B5C] leading-tight mt-0.5",
                children: s || "Unnamed Document Sandbox",
              }),
            ],
          }),
          d.jsxs("div", {
            className:
              "flex gap-1 bg-gray-100 p-1 rounded-none border border-gray-200 self-stretch sm:self-auto flex-wrap",
            children: [
              d.jsxs("button", {
                onClick: () => p("REVIEW"),
                className: `flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-none text-xs font-bold tracking-widest uppercase transition-all cursor-pointer ${x === "REVIEW" ? "bg-[#003B5C] text-white shadow-xs" : "text-gray-500 hover:text-[#003B5C]"}`,
                children: [
                  d.jsx(tp, { className: "w-3.5 h-3.5" }),
                  "Interactive Audit",
                ],
              }),
              d.jsxs("button", {
                onClick: () => p("PREVIEW"),
                className: `flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-none text-xs font-bold tracking-widest uppercase transition-all cursor-pointer ${x === "PREVIEW" ? "bg-[#003B5C] text-white shadow-xs" : "text-gray-500 hover:text-[#003B5C]"}`,
                children: [
                  d.jsx(Hd, { className: "w-3.5 h-3.5" }),
                  "Anonymized View",
                ],
              }),
              d.jsxs("button", {
                onClick: () => p("RAW"),
                className: `flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-none text-xs font-bold tracking-widest uppercase transition-all cursor-pointer ${x === "RAW" ? "bg-[#003B5C] text-white shadow-xs" : "text-gray-500 hover:text-[#003B5C]"}`,
                children: [
                  d.jsx(uc, { className: "w-3.5 h-3.5" }),
                  "Show Raw Text",
                ],
              }),
            ],
          }),
        ],
      }),
      x === "REVIEW" &&
        d.jsxs("div", {
          className:
            "bg-gray-50 border border-gray-200 rounded-none p-3.5 text-xs mb-4 flex items-start gap-2.5 transition-all",
          children: [
            d.jsx("div", {
              className:
                "p-1.5 bg-[#003B5C]/10 rounded-none text-[#003B5C] shrink-0 mt-0.5",
              children: d.jsx(lp, { className: "w-4 h-4" }),
            }),
            d.jsx("div", {
              className: "flex-1 min-w-0",
              children: b
                ? d.jsxs("div", {
                    children: [
                      d.jsx("span", {
                        className:
                          "font-mono text-[9px] uppercase text-gray-500 block tracking-widest font-bold",
                        children: "Inspecting Flagged PII",
                      }),
                      d.jsxs("div", {
                        className: "flex items-center gap-2 mt-0.5",
                        children: [
                          d.jsxs("span", {
                            className: "font-bold text-gray-900",
                            children: ['"', b.originalText, '"'],
                          }),
                          d.jsx("span", {
                            className: `text-[10px] font-mono font-bold px-2 py-0.5 rounded-none border ${(q = U(b.category)) == null ? void 0 : q.color} ${(P = U(b.category)) == null ? void 0 : P.textColor}`,
                            children:
                              (ue = U(b.category)) == null ? void 0 : ue.name,
                          }),
                          d.jsxs("span", {
                            className: `text-[10px] font-semibold font-mono ${b.isRedacted ? "text-red-600" : "text-green-600"}`,
                            children: [
                              "• ",
                              b.isRedacted ? "Currently Redacted" : "Excluded",
                            ],
                          }),
                        ],
                      }),
                      d.jsx("p", {
                        className: "text-[11px] text-gray-500 mt-1 font-medium",
                        children:
                          b.category === "CUSTOM"
                            ? "Manually flagged as custom confidential term. Click to whitelist."
                            : "Identified by legal heuristic parser. Click this block to exclude from redaction.",
                      }),
                    ],
                  })
                : I
                  ? d.jsxs("div", {
                      children: [
                        d.jsx("span", {
                          className:
                            "font-mono text-[9px] uppercase text-gray-500 block tracking-widest font-bold",
                          children: "Standard Text Hovered",
                        }),
                        d.jsxs("p", {
                          className: "text-gray-900 font-bold mt-0.5",
                          children: ['Word Token: "', I, '"'],
                        }),
                        d.jsx("p", {
                          className:
                            "text-[11px] text-gray-500 mt-0.5 leading-relaxed font-medium",
                          children:
                            "Click to redact this phrase globally across the entire document buffer.",
                        }),
                      ],
                    })
                  : d.jsxs("div", {
                      children: [
                        d.jsx("span", {
                          className:
                            "font-mono text-[9px] uppercase text-[#003B5C] block tracking-widest font-bold",
                          children: "Audit Mode Active",
                        }),
                        d.jsxs("p", {
                          className:
                            "text-gray-600 mt-0.5 leading-relaxed font-medium",
                          children: [
                            "Hover over highlighted matches to inspect categories. ",
                            d.jsx("span", {
                              className: "font-bold text-[#003B5C]",
                              children: "Click highlights",
                            }),
                            " to whitelist them, or ",
                            d.jsx("span", {
                              className: "font-bold text-[#003B5C]",
                              children: "click standard words",
                            }),
                            " to redact them globally.",
                          ],
                        }),
                      ],
                    }),
            }),
            d.jsx("button", {
              onClick: B,
              title: "Reset to default document",
              className:
                "p-1.5 text-gray-400 hover:text-red-600 hover:bg-gray-100 rounded-none transition-all cursor-pointer shrink-0",
              children: d.jsx(rp, { className: "w-3.5 h-3.5" }),
            }),
          ],
        }),
      d.jsxs("div", {
        className:
          "flex items-center justify-between px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-none mb-3",
        children: [
          d.jsxs("div", {
            className: "flex items-center gap-2",
            children: [
              d.jsx("span", {
                className:
                  "text-[10px] font-mono font-bold text-gray-500 uppercase tracking-wider",
                children: "Quick Toggle View:",
              }),
              d.jsx("span", {
                className: `text-[10px] font-sans font-extrabold px-2 py-0.5 rounded-none border ${x === "RAW" ? "bg-amber-50 text-amber-900 border-amber-300" : x === "PREVIEW" ? "bg-green-50 text-green-900 border-green-300" : "bg-[#003B5C]/5 text-[#003B5C] border-[#003B5C]/20"}`,
                children:
                  x === "RAW"
                    ? "SHOW RAW TEXT"
                    : x === "PREVIEW"
                      ? "FINAL ANONYMIZED VIEW"
                      : "INTERACTIVE AUDIT",
              }),
            ],
          }),
          d.jsx("button", {
            onClick: () => {
              p((Z) => (Z === "RAW" ? "PREVIEW" : "RAW"));
            },
            className:
              "flex items-center gap-1.5 px-3 py-1 bg-white border border-gray-300 hover:border-[#003B5C] hover:bg-gray-50 text-[10px] font-sans font-bold text-gray-700 uppercase tracking-wider transition-all shadow-xs cursor-pointer select-none",
            children:
              x === "RAW"
                ? d.jsxs(d.Fragment, {
                    children: [
                      d.jsx(Hd, { className: "w-3.5 h-3.5 text-[#003B5C]" }),
                      "Switch to Final Anonymized View",
                    ],
                  })
                : d.jsxs(d.Fragment, {
                    children: [
                      d.jsx(uc, { className: "w-3.5 h-3.5 text-amber-600" }),
                      "Switch to Show Raw Text",
                    ],
                  }),
          }),
        ],
      }),
      d.jsxs("div", {
        className:
          "flex-1 bg-white border border-gray-200 rounded-none p-6 md:p-8 font-sans document-page max-h-[600px] overflow-y-auto relative select-text",
        children: [
          d.jsx("div", {
            className:
              "absolute top-3 right-3 select-none flex items-center gap-1 opacity-40 hover:opacity-100 transition-opacity",
            children: d.jsx("span", {
              className:
                "text-[9px] font-mono font-bold text-gray-500 tracking-widest uppercase",
              children: "Secured Page Buffer",
            }),
          }),
          E
            ? d.jsxs("div", {
                className:
                  "flex flex-col items-center justify-center py-20 px-4 text-center h-full min-h-[300px]",
                children: [
                  d.jsxs("div", {
                    className:
                      "w-16 h-16 rounded-none bg-[#003B5C]/10 flex items-center justify-center mb-6 relative",
                    children: [
                      d.jsx(Er, {
                        className: "w-8 h-8 text-[#003B5C] animate-pulse",
                      }),
                      d.jsx("div", {
                        className:
                          "absolute inset-0 border-2 border-[#003B5C] border-t-transparent rounded-none animate-spin",
                      }),
                    ],
                  }),
                  d.jsxs("div", {
                    className: "space-y-1.5 max-w-md",
                    children: [
                      d.jsx("span", {
                        className:
                          "text-[10px] font-mono font-bold text-[#003B5C] uppercase tracking-widest block animate-pulse",
                        children: "Heuristic AI Engine Parsing",
                      }),
                      d.jsxs("h4", {
                        className: "font-serif text-lg font-bold text-gray-900",
                        children: ['Anonymizing "', s, '"'],
                      }),
                      d.jsx("p", {
                        className:
                          "text-[11px] text-gray-500 font-mono font-medium",
                        children:
                          m < 30
                            ? ">> Scanning clauses for personal identifiable names..."
                            : m < 60
                              ? ">> Evaluating financials, currency tokens, and values..."
                              : m < 85
                                ? ">> Running semantic pattern checks on dates & markers..."
                                : ">> Finalizing redaction map...",
                      }),
                    ],
                  }),
                  d.jsx("div", {
                    className:
                      "w-full max-w-sm bg-gray-100 h-2 border border-gray-200 mt-6 relative overflow-hidden",
                    children: d.jsx("div", {
                      className:
                        "bg-[#003B5C] h-full transition-all duration-300 ease-out",
                      style: { width: `${m}%` },
                    }),
                  }),
                  d.jsxs("div", {
                    className:
                      "flex justify-between w-full max-w-sm mt-2 text-[10px] font-mono font-bold text-gray-400",
                    children: [
                      d.jsx("span", { children: "SANDBOX PROCESSING" }),
                      d.jsxs("span", {
                        className: "text-[#003B5C]",
                        children: [m, "%"],
                      }),
                    ],
                  }),
                ],
              })
            : d.jsx("div", {
                className:
                  "text-sm text-[#1a1a1a] leading-relaxed whitespace-pre-wrap font-sans",
                children: c.map((Z) => {
                  if (x === "RAW")
                    return d.jsx(
                      "span",
                      { children: Z.originalText || Z.text },
                      Z.id,
                    );
                  const V = U(Z.category);
                  if (V) {
                    const ne = Z.isRedacted;
                    return x === "PREVIEW"
                      ? ne
                        ? d.jsx("span", { children: W(Z) }, Z.id)
                        : d.jsx("span", { children: Z.text }, Z.id)
                      : d.jsxs(
                          "button",
                          {
                            onClick: () => A(Z.id),
                            onMouseEnter: () => N(Z),
                            onMouseLeave: () => N(null),
                            className: `inline-block mx-0.5 rounded-none px-1.5 py-0.5 border cursor-pointer select-none transition-all duration-150 align-baseline ${ne ? `${V.color} hover:brightness-95 hover:shadow-xs border-current/25 relative` : "bg-gray-100/50 border-gray-200 text-gray-400 hover:bg-gray-200/50 line-through"}`,
                            style: { contentVisibility: "auto" },
                            children: [
                              d.jsx("span", {
                                className: "font-bold",
                                children: Z.text,
                              }),
                              ne &&
                                d.jsx("span", {
                                  className:
                                    "text-[8px] uppercase tracking-wider font-mono font-extrabold ml-1 border-l border-current/30 pl-1 opacity-70",
                                  children:
                                    Z.category === "CUSTOM"
                                      ? "User"
                                      : Z.category,
                                }),
                            ],
                          },
                          Z.id,
                        );
                  }
                  return x === "REVIEW"
                    ? Z.text.split(/(\s+)/).map((fe, X) => {
                        const Y = fe.trim().replace(/[.,;:()'"?!]/g, "");
                        if (!Y)
                          return d.jsx(
                            "span",
                            { children: fe },
                            `${Z.id}-${X}`,
                          );
                        const H = f.has(Y.toLowerCase());
                        return d.jsx(
                          "span",
                          {
                            onClick: (K) => te(Y, K),
                            onMouseEnter: () => F(Y),
                            onMouseLeave: () => F(null),
                            className: `cursor-pointer rounded-none px-0.5 transition-colors ${H ? "bg-amber-100 text-amber-900 border border-amber-300 font-bold" : "hover:bg-gray-100 hover:text-[#003B5C]"}`,
                            children: fe,
                          },
                          `${Z.id}-${X}`,
                        );
                      })
                    : d.jsx("span", { children: Z.text }, Z.id);
                }),
              }),
        ],
      }),
    ],
  });
}
function Np({ stats: s, enabledCategories: c, customRedactedWordsCount: r }) {
  const A = Nl.filter(
      (f) =>
        !c.has(f.id) &&
        ["NAME", "EMAIL", "PHONE", "ADDRESS", "FINANCIAL"].includes(f.id),
    ),
    u = s.riskScore,
    g = s.complianceScore;
  return d.jsxs("div", {
    className:
      "bg-white/95 border-l-4 border-[#003B5C] p-5 shadow-md rounded-none space-y-6",
    children: [
      d.jsxs("div", {
        className:
          "flex justify-between items-center pb-4 border-b border-gray-200",
        children: [
          d.jsxs("div", {
            children: [
              d.jsx("span", {
                className:
                  "text-[9px] font-mono font-bold text-gray-500 uppercase tracking-widest",
                children: "Security Diagnostics",
              }),
              d.jsx("h3", {
                className:
                  "font-serif text-base font-bold text-[#003B5C] mt-0.5",
                children: "Anonymization Audit",
              }),
            ],
          }),
          d.jsxs("div", {
            className: "text-right",
            children: [
              d.jsx("span", {
                className:
                  "text-[9px] font-mono font-bold text-gray-500 block uppercase tracking-widest",
                children: "Categories Enabled",
              }),
              d.jsxs("span", {
                className: "font-serif text-xl font-bold text-[#003B5C]",
                children: [g, "%"],
              }),
            ],
          }),
        ],
      }),
      d.jsxs("div", {
        className: "grid grid-cols-2 gap-4",
        children: [
          d.jsxs("div", {
            className:
              "bg-gray-50 border border-gray-200 rounded-none p-3.5 text-center flex flex-col justify-between h-28",
            children: [
              d.jsx("span", {
                className:
                  "text-[10px] font-mono uppercase text-[#003B5C] block font-bold tracking-wider",
                children: "Sanitization Level",
              }),
              d.jsxs("div", {
                className: "my-1 flex items-center justify-center gap-1.5",
                children: [
                  g === 100
                    ? d.jsx(hr, {
                        className: "w-7 h-7 text-green-600 animate-bounce",
                      })
                    : d.jsx(Im, { className: "w-7 h-7 text-amber-600" }),
                  d.jsxs("span", {
                    className:
                      "text-xl font-serif font-extrabold text-[#003B5C]",
                    children: [g, "%"],
                  }),
                ],
              }),
              d.jsx("span", {
                className: "text-[9px] text-gray-500 leading-tight",
                children:
                  g === 100
                    ? "All redaction categories are enabled."
                    : "Some redaction categories are turned off.",
              }),
            ],
          }),
          d.jsxs("div", {
            className:
              "bg-gray-50 border border-gray-200 rounded-none p-3.5 text-center flex flex-col justify-between h-28",
            children: [
              d.jsx("span", {
                className:
                  "text-[10px] font-mono uppercase text-[#003B5C] block font-bold tracking-wider",
                children: "PII Leak Risk",
              }),
              d.jsx("div", {
                className: "my-1",
                children: d.jsxs("span", {
                  className: `text-xs font-mono font-bold px-3 py-1 rounded-none border inline-block ${u === "LOW" ? "bg-green-50 text-green-700 border-green-200" : u === "MEDIUM" ? "bg-amber-50 text-amber-700 border-amber-200" : "bg-red-50 text-red-700 border-red-200"}`,
                  children: [u, " RISK"],
                }),
              }),
              d.jsx("span", {
                className: "text-[9px] text-gray-500 leading-tight",
                children:
                  u === "LOW"
                    ? "All vital data-fields isolated securely."
                    : "Some identifiers remain unmasked.",
              }),
            ],
          }),
        ],
      }),
      d.jsxs("div", {
        className: "space-y-2.5",
        children: [
          d.jsx("h4", {
            className:
              "text-[10px] font-mono text-[#003B5C] uppercase tracking-wider font-bold",
            children: "Redaction Summary",
          }),
          d.jsxs("div", {
            className: "space-y-2",
            children: [
              Nl.map((f) => {
                const B = s.byCategory[f.id] || 0,
                  E = c.has(f.id);
                return d.jsxs(
                  "div",
                  {
                    className: "flex justify-between items-center text-xs",
                    children: [
                      d.jsxs("div", {
                        className: "flex items-center gap-2 min-w-0",
                        children: [
                          d.jsx("div", {
                            className: `w-2.5 h-2.5 rounded-none ${f.color.split(" ")[0]} border border-gray-200`,
                          }),
                          d.jsx("span", {
                            className: `font-semibold truncate ${E ? "text-gray-900" : "text-stone-300 line-through"}`,
                            children: f.name,
                          }),
                        ],
                      }),
                      d.jsx("div", {
                        className: "flex items-center gap-1.5",
                        children: d.jsx("span", {
                          className: `font-mono text-[11px] font-bold ${B > 0 && E ? "text-[#003B5C]" : "text-gray-400"}`,
                          children: E ? `${B} redacted` : "inactive",
                        }),
                      }),
                    ],
                  },
                  f.id,
                );
              }),
              d.jsxs("div", {
                className:
                  "flex justify-between items-center text-xs border-t border-gray-200 pt-2 mt-1",
                children: [
                  d.jsxs("div", {
                    className: "flex items-center gap-2",
                    children: [
                      d.jsx("div", {
                        className:
                          "w-2.5 h-2.5 rounded-none bg-amber-100 border border-amber-300",
                      }),
                      d.jsx("span", {
                        className: "font-semibold text-gray-900",
                        children: "Custom Manual Filters",
                      }),
                    ],
                  }),
                  d.jsxs("span", {
                    className: "font-mono text-[11px] font-bold text-gray-900",
                    children: [r, " words masked"],
                  }),
                ],
              }),
            ],
          }),
        ],
      }),
      A.length > 0 &&
        d.jsxs("div", {
          className:
            "p-3 bg-amber-50 border border-amber-200 rounded-none text-amber-800 text-[11px]",
          children: [
            d.jsx("span", {
              className: "font-bold block mb-0.5",
              children: "⚠️ Unmasked Vulnerabilities:",
            }),
            d.jsx("span", {
              className: "font-bold",
              children: A.map((f) => f.name).join(", "),
            }),
            " will pass through unredacted — turn this category on before sharing a document that contains it.",
          ],
        }),
      d.jsxs("div", {
        className:
          "bg-[#003B5C] text-white p-3.5 rounded-none text-center flex items-center justify-center gap-2 text-[10px] tracking-widest font-mono font-bold uppercase shadow-sm",
        children: [
          d.jsx(JB, { className: "w-4 h-4 text-white" }),
          d.jsx("span", { children: "Processed 100% Locally In Your Browser" }),
        ],
      }),
    ],
  });
}
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */ function tr(s, c, r) {
  if (!s) return [];
  const A = [];
  (Nl.forEach((m) => {
    if (!c.has(m.id)) return;
    m.pattern.lastIndex = 0;
    let x;
    for (; (x = m.pattern.exec(s)) !== null;) {
      x.index === m.pattern.lastIndex && m.pattern.lastIndex++;
      const p = x[0];
      A.push({
        start: x.index,
        end: x.index + p.length,
        text: p,
        category: m.id,
      });
    }
  }),
    A.sort((m, x) =>
      m.start !== x.start
        ? m.start - x.start
        : x.end - x.start - (m.end - m.start),
    ));
  const u = [];
  let g = 0;
  for (const m of A) m.start >= g && (u.push(m), (g = m.end));
  const f = [];
  let B = 0,
    E = 1;
  if (
    (u.forEach((m) => {
      if (m.start > B) {
        const x = s.substring(B, m.start);
        f.push(...Kd(x, r, () => `plain-${E++}`));
      }
      (f.push({
        id: `entity-${E++}`,
        text: m.text,
        originalText: m.text,
        category: m.category,
        isRedacted: !0,
        explanation: `Matched: ${_p(m.category)}`,
      }),
        (B = m.end));
    }),
    B < s.length)
  ) {
    const m = s.substring(B);
    f.push(...Kd(m, r, () => `plain-${E++}`));
  }
  return f;
}
function Kd(s, c, r) {
  if (!s) return [];
  const A = s.split(/(\s+|\b)/g).filter(Boolean),
    u = [];
  for (const g of A) {
    const f = g.trim().replace(/[.,;:()'"?!]/g, "");
    f && c.has(f.toLowerCase())
      ? u.push({
          id: r(),
          text: g,
          originalText: g,
          category: "CUSTOM",
          isRedacted: !0,
          explanation: "Manually redacted by user",
        })
      : u.push({ id: r(), text: g, originalText: g, isRedacted: !1 });
  }
  return u;
}
function _p(s) {
  switch (s) {
    case "NAME":
      return "Personal Name";
    case "EMAIL":
      return "Email Address";
    case "PHONE":
      return "Phone Number";
    case "ADDRESS":
      return "Location Address";
    case "FINANCIAL":
      return "Financial Figure";
    case "ORGANIZATION":
      return "Organization/Firm";
    case "DATE":
      return "Date/Timestamp";
    case "CUSTOM":
      return "User Custom Selection";
    default:
      return "Sensitive Entity";
  }
}
