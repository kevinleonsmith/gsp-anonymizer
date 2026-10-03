function pC({
  title: s,
  segments: c,
  redactionStyle: r,
  stats: A,
  documents: u,
  enabledCategories: g,
}) {
  const [f, B] = De.useState(!1),
    [E, m] = De.useState(!1),
    [x, p] = De.useState(""),
    [b, N] = De.useState(!1),
    [I, F] = De.useState(null),
    [W, te] = De.useState(null),
    [U, q] = De.useState(!0),
    P = (Y) =>
      tr(Y.rawText, g, Y.customRedactedWords)
        .map((K) =>
          Y.whitelistedSegmentIds.has(K.id) ? { ...K, isRedacted: !1 } : K,
        )
        .map((K) => {
          if (!K.isRedacted) return K.text;
          const $ = K.text;
          switch (r) {
            case "BLACKOUT":
              return "█".repeat(Math.max(4, Math.min(12, $.length)));
            case "LABEL":
              return `[REDACTED_${K.category || "INFO"}]`;
            case "UNDERLINE":
              return "_".repeat(Math.max(6, Math.min(12, $.length)));
            case "BLUR":
              return `[BLURRED: ${$}]`;
            default:
              return "[REDACTED]";
          }
        })
        .join(""),
    ue = () =>
      c
        .map((Y) => {
          if (!Y.isRedacted) return Y.text;
          const J = Y.text;
          switch (r) {
            case "BLACKOUT":
              return "█".repeat(Math.max(4, Math.min(12, J.length)));
            case "LABEL":
              return `[REDACTED_${Y.category || "INFO"}]`;
            case "UNDERLINE":
              return "_".repeat(Math.max(6, Math.min(12, J.length)));
            case "BLUR":
              return `[BLURRED: ${J}]`;
            default:
              return "[REDACTED]";
          }
        })
        .join(""),
    Z = () => {
      const Y = ue();
      (navigator.clipboard.writeText(Y), B(!0), setTimeout(() => B(!1), 2e3));
    },
    V = () => {
      const Y = ue(),
        J = new Blob([Y], { type: "text/plain;charset=utf-8" }),
        H = URL.createObjectURL(J),
        K = document.createElement("a");
      ((K.href = H),
        (K.download = `${s.toLowerCase().replace(/[^a-z0-9]+/g, "_")}_anonymized.txt`),
        document.body.appendChild(K),
        K.click(),
        document.body.removeChild(K),
        URL.revokeObjectURL(H));
    },
    ne = () => {
      window.print();
    },
    fe = async () => {
      if (u.length === 0) {
        F("No documents available in the sandbox.");
        return;
      }
      try {
        (N(!0), F(null), te(null));
        const Y = new Ox("application/zip"),
          J = new aC(Y, { useWebWorkers: !1 });
        for (const k of u) {
          const le = P(k),
            C = `${k.title.toLowerCase().replace(/[^a-z0-9]+/g, "_")}_anonymized.txt`,
            S = new Am(le),
            z = {};
          (U && x.trim() && ((z.password = x), (z.encryptionStrength = 3)),
            await J.add(C, S, z));
        }
        let H = `==================================================
`;
        ((H += `VERIDACT REDACTION SUMMARY (BETA)
`),
          (H += `==================================================
`),
          (H += `Export Date: ${new Date().toUTCString()}
`),
          (H += `Total Bundled Documents: ${u.length}
`),
          (H += `Encryption Status: ${U && x.trim() ? "AES-256 Password-Protected" : "Unencrypted ZIP"}
`),
          (H += `Selected Redaction Style: ${r}

`),
          (H += `Archive Contents Details:
`),
          u.forEach((k, le) => {
            const z = tr(k.rawText, g, k.customRedactedWords)
              .map((L) =>
                k.whitelistedSegmentIds.has(L.id)
                  ? { ...L, isRedacted: !1 }
                  : L,
              )
              .filter((L) => L.isRedacted).length;
            ((H += `  [${le + 1}] File: ${k.title}
`),
              (H += `      - Redactions: ${z} entities masked
`),
              (H += `      - Manual overrides: ${k.whitelistedSegmentIds.size} terms whitelisted
`));
          }),
          (H += `
==================================================
`),
          (H += `PROCESSING NOTE
`),
          (H += `--------------------------------------------------
`),
          (H += `This ZIP archive was compiled and encrypted locally in your browser. No document plaintext or keys were transmitted over a network.

`),
          (H += `This is a beta evaluation tool, not a certified compliance product. Detection is pattern-based and can miss or over-match content — review every redaction before relying on or sharing this document.
`),
          (H += `==================================================
`));
        const K = new Am(H),
          $ = {};
        (U && x.trim() && (($.password = x), ($.encryptionStrength = 3)),
          await J.add("redaction_summary.txt", K, $));
        const D = await J.close(),
          j = URL.createObjectURL(D),
          ee = document.createElement("a");
        ((ee.href = j),
          (ee.download = `veridact_batch_redacted_${Date.now()}.zip`),
          document.body.appendChild(ee),
          ee.click(),
          document.body.removeChild(ee),
          URL.revokeObjectURL(j),
          te(`Archived and encrypted ${u.length} document(s) successfully!`));
      } catch (Y) {
        (console.error(Y),
          F(
            (Y == null ? void 0 : Y.message) ||
              "Error occurred during secure batch compression.",
          ));
      } finally {
        N(!1);
      }
    },
    X = new Date().toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      timeZoneName: "short",
    });
  return d.jsxs("div", {
    className:
      "bg-white/95 border-l-4 border-[#003B5C] p-5 shadow-md rounded-none space-y-4",
    children: [
      d.jsxs("div", {
        children: [
          d.jsx("h3", {
            className: "font-serif text-sm font-bold text-[#003B5C]",
            children: "03. Document Export",
          }),
          d.jsx("p", {
            className:
              "text-[11px] text-gray-500 leading-snug mt-1 font-medium",
            children:
              "Export your fully anonymized content safely. All processing stays 100% in local memory, meeting strict data privacy standards.",
          }),
        ],
      }),
      d.jsxs("div", {
        className: "flex flex-col sm:flex-row gap-2.5",
        children: [
          d.jsx("button", {
            onClick: Z,
            className:
              "flex-1 bg-gray-50 hover:bg-gray-100 text-[#003B5C] border border-[#003B5C]/20 py-2.5 px-3 rounded-none text-xs font-bold tracking-wider uppercase flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-xs",
            children: f
              ? d.jsxs(d.Fragment, {
                  children: [
                    d.jsx(er, { className: "w-3.5 h-3.5 text-green-700" }),
                    "COPIED!",
                  ],
                })
              : d.jsxs(d.Fragment, {
                  children: [
                    d.jsx(WB, { className: "w-3.5 h-3.5" }),
                    "Copy Clean Text",
                  ],
                }),
          }),
          d.jsxs("button", {
            onClick: V,
            className:
              "flex-1 bg-[#003B5C] hover:brightness-110 text-white py-2.5 px-3 rounded-none text-xs font-bold tracking-wider uppercase flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-md",
            children: [
              d.jsx(Fd, { className: "w-3.5 h-3.5" }),
              "Download .TXT File",
            ],
          }),
        ],
      }),
      d.jsxs("button", {
        onClick: () => m(!0),
        className:
          "w-full bg-gray-100 hover:bg-gray-200 text-[#003B5C] border border-gray-300 py-3 px-3 rounded-none text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-1.5 transition-all cursor-pointer",
        children: [
          d.jsx(Ld, { className: "w-3.5 h-3.5" }),
          "Generate Redaction Summary Report",
        ],
      }),
      d.jsxs("div", {
        className: "relative flex py-1.5 items-center",
        children: [
          d.jsx("div", { className: "flex-grow border-t border-gray-200" }),
          d.jsx("span", {
            className:
              "flex-shrink mx-2 text-[9px] font-mono uppercase tracking-widest text-gray-400 font-bold",
            children: "Secure Bulk Export",
          }),
          d.jsx("div", { className: "flex-grow border-t border-gray-200" }),
        ],
      }),
      d.jsxs("div", {
        className:
          "space-y-3 p-3 bg-gray-50 border border-gray-200 rounded-none text-left",
        children: [
          d.jsxs("div", {
            className: "flex items-center justify-between",
            children: [
              d.jsxs("span", {
                className:
                  "text-[11px] font-sans font-bold text-gray-800 flex items-center gap-1",
                children: [
                  d.jsx(LB, { className: "w-3.5 h-3.5 text-[#003B5C]" }),
                  "Package Sandbox (",
                  u.length,
                  " Files)",
                ],
              }),
              d.jsx("span", {
                className: "text-[9px] font-mono font-bold text-gray-400",
                children: "AES-256 ZIP",
              }),
            ],
          }),
          d.jsxs("div", {
            className: "flex items-center justify-between text-xs",
            children: [
              d.jsxs("label", {
                className:
                  "flex items-center gap-1.5 text-gray-600 font-medium cursor-pointer select-none",
                children: [
                  d.jsx("input", {
                    type: "checkbox",
                    checked: U,
                    onChange: (Y) => q(Y.target.checked),
                    className:
                      "accent-[#003B5C] h-3.5 w-3.5 border-gray-300 focus:ring-0",
                  }),
                  "Password Encrypt Archive",
                ],
              }),
              d.jsx("span", {
                className: "text-[9px] font-mono text-gray-400",
                children: "Highly Recommended",
              }),
            ],
          }),
          U &&
            d.jsxs("div", {
              className: "space-y-1",
              children: [
                d.jsxs("div", {
                  className: "relative",
                  children: [
                    d.jsx("input", {
                      type: "text",
                      value: x,
                      onChange: (Y) => p(Y.target.value),
                      placeholder: "Enter password to encrypt...",
                      className:
                        "w-full text-xs p-2 pr-8 rounded-none border border-gray-300 bg-white text-[#1a1a1a] focus:ring-1 focus:ring-[#003B5C] focus:border-[#003B5C] outline-none font-mono",
                    }),
                    d.jsx("div", {
                      className: "absolute top-2.5 right-2 text-gray-400",
                      children: x.trim()
                        ? d.jsx(Sm, { className: "w-3.5 h-3.5 text-amber-600" })
                        : d.jsx(sp, { className: "w-3.5 h-3.5 text-gray-400" }),
                    }),
                  ],
                }),
                d.jsx("p", {
                  className: "text-[9px] text-gray-400 font-medium",
                  children:
                    "* Needed when extracting standard archives on client OS. Keep key safe.",
                }),
              ],
            }),
          d.jsx("button", {
            onClick: fe,
            disabled: b || u.length === 0,
            className:
              "w-full bg-[#003B5C] hover:brightness-110 disabled:bg-gray-300 disabled:cursor-not-allowed text-white py-2.5 px-3 rounded-none text-xs font-bold tracking-wider uppercase flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-md",
            children: b
              ? d.jsxs(d.Fragment, {
                  children: [
                    d.jsx("div", {
                      className:
                        "w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin",
                    }),
                    "Encrypting & Compiling...",
                  ],
                })
              : d.jsxs(d.Fragment, {
                  children: [
                    d.jsx(Fd, { className: "w-3.5 h-3.5" }),
                    "Download Encrypted ZIP (",
                    u.length,
                    " Docs)",
                  ],
                }),
          }),
          I &&
            d.jsxs("div", {
              className:
                "p-2 bg-red-50 border border-red-200 rounded-none text-red-700 text-[11px] flex items-start gap-1.5 mt-2",
              children: [
                d.jsx(wm, { className: "w-3.5 h-3.5 shrink-0 mt-0.5" }),
                d.jsx("span", { className: "font-medium", children: I }),
              ],
            }),
          W &&
            d.jsxs("div", {
              className:
                "p-2 bg-green-50 border border-green-200 rounded-none text-green-700 text-[11px] flex items-start gap-1.5 mt-2",
              children: [
                d.jsx(er, { className: "w-3.5 h-3.5 shrink-0 mt-0.5" }),
                d.jsx("span", { className: "font-semibold", children: W }),
              ],
            }),
        ],
      }),
      E &&
        d.jsx("div", {
          className:
            "fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-[1000] p-4 overflow-y-auto",
          children: d.jsxs("div", {
            className:
              "bg-white border-t-8 border-[#003B5C] rounded-none max-w-3xl w-full p-6 md:p-8 shadow-2xl relative my-8 animate-in fade-in zoom-in-95 duration-150 text-gray-900",
            children: [
              d.jsx("button", {
                onClick: () => m(!1),
                className:
                  "absolute top-4 right-4 text-stone-400 hover:text-stone-600 font-mono text-xs cursor-pointer select-none bg-stone-100 rounded-none px-2 py-1",
                children: "[Close]",
              }),
              d.jsxs("div", {
                id: "printable-area",
                className: "space-y-8 font-sans",
                children: [
                  d.jsxs("div", {
                    className:
                      "border-b-2 border-gray-200 pb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4",
                    children: [
                      d.jsxs("div", {
                        children: [
                          d.jsx("div", {
                            className: "flex items-center gap-2",
                            children: d.jsx("span", {
                              className:
                                "font-serif text-2xl font-bold tracking-tight text-[#003B5C]",
                              children: "Veridact Redaction Summary",
                            }),
                          }),
                          d.jsx("p", {
                            className:
                              "text-[9px] font-mono text-gray-500 uppercase mt-1 tracking-widest font-bold",
                            children:
                              "Beta Evaluation Report — Not a Compliance Certification",
                          }),
                        ],
                      }),
                      d.jsxs("div", {
                        className:
                          "bg-gray-50 border border-gray-200 rounded-none p-3 text-right shrink-0",
                        children: [
                          d.jsx("span", {
                            className:
                              "text-[9px] font-mono block text-[#003B5C] uppercase tracking-wider font-extrabold",
                            children: "Categories Enabled",
                          }),
                          d.jsxs("span", {
                            className:
                              "text-lg font-serif font-extrabold text-[#003B5C]",
                            children: [A.complianceScore, "%"],
                          }),
                        ],
                      }),
                    ],
                  }),
                  d.jsxs("div", {
                    className:
                      "bg-gray-50 border border-gray-200 rounded-none p-5",
                    children: [
                      d.jsxs("h4", {
                        className:
                          "font-serif text-sm font-bold text-[#003B5C] mb-3 flex items-center gap-1.5 uppercase tracking-wide",
                        children: [
                          d.jsx(Er, { className: "w-4 h-4 text-[#003B5C]" }),
                          "Redaction Summary",
                        ],
                      }),
                      d.jsxs("div", {
                        className:
                          "grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs",
                        children: [
                          d.jsxs("div", {
                            className: "space-y-2",
                            children: [
                              d.jsxs("div", {
                                children: [
                                  d.jsx("span", {
                                    className:
                                      "text-[10px] font-mono text-gray-400 uppercase block",
                                    children: "Document Name",
                                  }),
                                  d.jsx("span", {
                                    className: "font-bold text-gray-950",
                                    children: s,
                                  }),
                                ],
                              }),
                              d.jsxs("div", {
                                children: [
                                  d.jsx("span", {
                                    className:
                                      "text-[10px] font-mono text-gray-400 uppercase block",
                                    children: "Processed",
                                  }),
                                  d.jsx("span", {
                                    className:
                                      "font-semibold text-gray-950 font-mono",
                                    children: X,
                                  }),
                                ],
                              }),
                              d.jsxs("div", {
                                children: [
                                  d.jsx("span", {
                                    className:
                                      "text-[10px] font-mono text-gray-400 uppercase block",
                                    children: "Assigned Risk Rating",
                                  }),
                                  d.jsx("span", {
                                    className: "font-bold text-green-700",
                                    children: A.riskScore,
                                  }),
                                ],
                              }),
                            ],
                          }),
                          d.jsx("div", {
                            className: "space-y-2",
                            children: d.jsxs("div", {
                              children: [
                                d.jsx("span", {
                                  className:
                                    "text-[10px] font-mono text-gray-400 uppercase block",
                                  children: "Anonymized Category Metrics",
                                }),
                                d.jsxs("ul", {
                                  className:
                                    "text-[11px] text-gray-700 space-y-0.5 mt-0.5 font-mono",
                                  children: [
                                    d.jsxs("li", {
                                      children: [
                                        "• Names Redacted: ",
                                        A.byCategory.NAME || 0,
                                      ],
                                    }),
                                    d.jsxs("li", {
                                      children: [
                                        "• Locations Redacted: ",
                                        A.byCategory.ADDRESS || 0,
                                      ],
                                    }),
                                    d.jsxs("li", {
                                      children: [
                                        "• Finances Redacted: ",
                                        A.byCategory.FINANCIAL || 0,
                                      ],
                                    }),
                                    d.jsxs("li", {
                                      children: [
                                        "• Contact Coordinates: ",
                                        (A.byCategory.EMAIL || 0) +
                                          (A.byCategory.PHONE || 0),
                                      ],
                                    }),
                                  ],
                                }),
                              ],
                            }),
                          }),
                        ],
                      }),
                      d.jsx("p", {
                        className:
                          "text-[10px] text-gray-500 mt-4 italic border-t border-gray-200 pt-3 font-medium",
                        children:
                          "This document was processed using pattern-matching algorithms entirely in your browser. No document plaintext was transmitted over a network or stored on a server. This is a beta tool, not a certified compliance product — always have a licensed professional review redactions before relying on or sharing this document.",
                      }),
                    ],
                  }),
                  d.jsxs("div", {
                    children: [
                      d.jsx("h4", {
                        className:
                          "font-serif text-xs font-bold text-[#003B5C] uppercase tracking-widest border-b border-gray-200 pb-2 mb-4",
                        children: "Anonymized Document Body Representation",
                      }),
                      d.jsx("div", {
                        className:
                          "bg-stone-50 border border-stone-200 rounded-none p-6 font-mono text-xs text-stone-800 leading-relaxed whitespace-pre-wrap select-text max-h-[300px] overflow-y-auto",
                        children: ue(),
                      }),
                    ],
                  }),
                ],
              }),
              d.jsxs("div", {
                className:
                  "mt-8 pt-4 border-t border-stone-200 flex justify-between gap-3",
                children: [
                  d.jsxs("span", {
                    className:
                      "text-[10px] text-stone-400 font-mono flex items-center gap-1",
                    children: [
                      d.jsx(Im, { className: "w-3.5 h-3.5" }),
                      "Beta — verify before relying on this",
                    ],
                  }),
                  d.jsxs("div", {
                    className: "flex gap-2",
                    children: [
                      d.jsx("button", {
                        onClick: () => m(!1),
                        className:
                          "px-4 py-2 border border-stone-300 rounded-none text-xs font-bold uppercase hover:bg-stone-50 cursor-pointer",
                        children: "Cancel",
                      }),
                      d.jsxs("button", {
                        onClick: ne,
                        className:
                          "bg-[#003B5C] hover:brightness-110 text-white px-5 py-2.5 rounded-none text-xs font-bold uppercase tracking-wider flex items-center gap-2 cursor-pointer shadow-md",
                        children: [
                          d.jsx(Ld, { className: "w-4 h-4" }),
                          "Print Report / Save as PDF",
                        ],
                      }),
                    ],
                  }),
                ],
              }),
            ],
          }),
        }),
    ],
  });
}
function xC() {
  const [s, c] = De.useState(() =>
      Lo.map((J) => ({
        id: J.id,
        title: J.title,
        rawText: J.rawText,
        isCustom: !1,
        whitelistedSegmentIds: new Set(),
        customRedactedWords: new Set(),
      })),
    ),
    [r, A] = De.useState(Lo[0].id),
    [u, g] = De.useState(
      new Set([
        "NAME",
        "EMAIL",
        "PHONE",
        "ADDRESS",
        "FINANCIAL",
        "ORGANIZATION",
        "DATE",
      ]),
    ),
    [f, B] = De.useState("BLACKOUT"),
    [E, m] = De.useState(!1),
    [x, p] = De.useState(0),
    b = De.useMemo(() => s.find((J) => J.id === r) || s[0], [s, r]),
    N = b.rawText,
    I = b.title,
    F = b.customRedactedWords,
    W = b.whitelistedSegmentIds;
  (b.isCustom || b.id,
    De.useEffect(() => {
      if (!r) return;
      (m(!0), p(0));
      let J = 0;
      const $ = Math.min(1e3, Math.max(400, Math.round(N.length / 5))) / 10,
        D = setInterval(() => {
          ((J += Math.floor(Math.random() * 12) + 8),
            J >= 100 &&
              ((J = 100),
              clearInterval(D),
              setTimeout(() => {
                m(!1);
              }, 150)),
            p(J));
        }, $);
      return () => {
        clearInterval(D);
      };
    }, [r, u, N]));
  const te = De.useMemo(
      () =>
        tr(N, u, F).map((H) => (W.has(H.id) ? { ...H, isRedacted: !1 } : H)),
      [N, u, F, W],
    ),
    [U, q] = De.useState(""),
    P = De.useMemo(() => {
      const J = {
        NAME: 0,
        EMAIL: 0,
        PHONE: 0,
        ADDRESS: 0,
        FINANCIAL: 0,
        ORGANIZATION: 0,
        DATE: 0,
        CUSTOM: 0,
      };
      let H = 0;
      te.forEach((j) => {
        j.isRedacted &&
          j.category &&
          ((J[j.category] = (J[j.category] || 0) + 1), H++);
      });
      const K = u.size,
        $ = Math.round((K / 7) * 100);
      let D = "LOW";
      return (
        $ >= 85 ? (D = "LOW") : $ >= 55 ? (D = "MEDIUM") : (D = "HIGH"),
        { totalRedacted: H, byCategory: J, complianceScore: $, riskScore: D }
      );
    }, [te, u]);
  De.useEffect(() => {
    let J = !1;
    const H = JSON.stringify({
      title: I,
      totalRedacted: P.totalRedacted,
      byCategory: P.byCategory,
    });
    return (
      (async () => {
        const K = new TextEncoder().encode(H),
          $ = await crypto.subtle.digest("SHA-256", K),
          D = Array.from(new Uint8Array($))
            .map((j) => j.toString(16).padStart(2, "0"))
            .join("");
        J || q("0x" + D.slice(0, 24) + "…");
      })(),
      () => {
        J = !0;
      }
    );
  }, [I, P]);
  const ue = (J) => {
      c((H) =>
        H.map((K) => {
          if (K.id === r) {
            const $ = new Set(K.whitelistedSegmentIds);
            return (
              $.has(J) ? $.delete(J) : $.add(J),
              { ...K, whitelistedSegmentIds: $ }
            );
          }
          return K;
        }),
      );
    },
    Z = (J) => {
      c((H) =>
        H.map((K) => {
          if (K.id === r) {
            const $ = new Set(K.customRedactedWords);
            return ($.add(J.toLowerCase()), { ...K, customRedactedWords: $ });
          }
          return K;
        }),
      );
    },
    V = (J) => {
      c((H) =>
        H.map((K) => {
          if (K.id === r) {
            const $ = new Set(K.customRedactedWords);
            return (
              $.delete(J.toLowerCase()),
              { ...K, customRedactedWords: $ }
            );
          }
          return K;
        }),
      );
    },
    ne = (J) => {
      A(J);
    },
    fe = (J) => {
      c((H) => {
        const $ = 5 - H.filter((k) => k.isCustom).length;
        if ($ <= 0) return H;
        const j = J.slice(0, $).map((k, le) => ({
            id: `upload-${Date.now()}-${le}-${Math.random().toString(36).substr(2, 4)}`,
            title: k.title,
            rawText: k.rawText,
            isCustom: !0,
            size: k.size,
            whitelistedSegmentIds: new Set(),
            customRedactedWords: new Set(),
          })),
          ee = [...H, ...j];
        return (j.length > 0 && setTimeout(() => A(j[0].id), 0), ee);
      });
    },
    X = (J) => {
      c((H) => {
        const K = H.filter(($) => $.id !== J);
        return (r === J && K.length > 0 && A(K[0].id), K);
      });
    },
    Y = () => {
      c((J) =>
        J.map((H) => {
          if (H.id === r) {
            if (!H.isCustom) {
              const K = Lo.find(($) => $.id === H.id);
              if (K)
                return {
                  ...H,
                  rawText: K.rawText,
                  title: K.title,
                  whitelistedSegmentIds: new Set(),
                  customRedactedWords: new Set(),
                };
            }
            return {
              ...H,
              whitelistedSegmentIds: new Set(),
              customRedactedWords: new Set(),
            };
          }
          return H;
        }),
      );
    };
  return d.jsxs("div", {
    className:
      "min-h-screen bg-[#747d63] flex flex-col text-[#1a1a1a] font-sans",
    children: [
      d.jsx(bp, {}),
      d.jsxs("main", {
        className:
          "flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-6",
        children: [
          d.jsxs("div", {
            className:
              "bg-white/95 border-l-4 border-[#003B5C] p-6 shadow-md rounded-none flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 transition-all",
            children: [
              d.jsxs("div", {
                className: "space-y-1",
                children: [
                  d.jsx("h1", {
                    className:
                      "font-serif text-xl font-bold text-[#003B5C] tracking-tight",
                    children: "Double-Pass Legal Sanitization Workstation",
                  }),
                  d.jsx("p", {
                    className:
                      "text-xs text-gray-600 leading-relaxed max-w-2xl font-medium",
                    children:
                      "Upload agreements, purchase agreements, or corporate memos to strip names, emails, financial values, and location coordinates instantly. Review matches inside our interactive audit canvas or click custom clauses before secure download.",
                  }),
                ],
              }),
              d.jsxs("div", {
                className:
                  "flex items-center gap-2 px-3 py-1.5 bg-[#003B5C]/10 border border-[#003B5C]/20 rounded-none shrink-0 text-xs font-mono font-bold text-[#003B5C]",
                children: [
                  d.jsx(hr, { className: "w-4 h-4" }),
                  d.jsx("span", { children: "SECURE LOCAL BUFFER" }),
                ],
              }),
            ],
          }),
          d.jsxs("div", {
            className:
              "bg-amber-50 border-l-4 border-amber-400 px-5 py-3 text-xs text-amber-900 leading-relaxed",
            children: [
              d.jsx("span", {
                className: "font-bold uppercase tracking-wide",
                children: "What to watch for:",
              }),
              " this tool is tuned to over-redact — you'll likely see harmless phrases like “This Agreement” or “One Million” flagged as a name. That's expected caution, not a bug worth reporting.",
              " ",
              d.jsx("span", {
                className: "font-bold",
                children: "What matters is the opposite",
              }),
              " — any real name, contact info, address, or figure that is ",
              d.jsx("span", { className: "underline", children: "not" }),
              " highlighted. Please flag those via the feedback link in the footer.",
            ],
          }),
          d.jsxs("div", {
            className: "grid grid-cols-1 lg:grid-cols-12 gap-6 items-start",
            children: [
              d.jsxs("div", {
                className: "lg:col-span-4 space-y-6",
                children: [
                  d.jsx("div", {
                    className:
                      "bg-white/95 p-6 border-l-4 border-[#003B5C] shadow-md rounded-none",
                    children: d.jsx(Tp, {
                      documents: s,
                      activeDocId: r,
                      onSelectDocument: ne,
                      onAddDocuments: fe,
                      onDeleteDocument: X,
                    }),
                  }),
                  d.jsx("div", {
                    className:
                      "bg-white/95 p-6 border-l-4 border-[#003B5C] shadow-md rounded-none",
                    children: d.jsx(Rp, {
                      enabledCategories: u,
                      onCategoriesChange: g,
                      redactionStyle: f,
                      onStyleChange: B,
                    }),
                  }),
                ],
              }),
              d.jsxs("div", {
                className: "lg:col-span-8 space-y-6 h-full flex flex-col",
                children: [
                  d.jsx("div", {
                    className: "flex-1",
                    children: d.jsx(Mp, {
                      title: I,
                      segments: te,
                      redactionStyle: f,
                      onToggleSegmentRedaction: ue,
                      onAddCustomRedaction: Z,
                      onRemoveCustomRedaction: V,
                      customRedactedWords: F,
                      onResetDocument: Y,
                      isAnalyzing: E,
                      analysisProgress: x,
                    }),
                  }),
                  d.jsxs("div", {
                    className: "grid grid-cols-1 md:grid-cols-2 gap-6",
                    children: [
                      d.jsx(Np, {
                        stats: P,
                        enabledCategories: u,
                        customRedactedWordsCount: F.size,
                      }),
                      d.jsx(pC, {
                        title: I,
                        segments: te,
                        redactionStyle: f,
                        stats: P,
                        documents: s,
                        enabledCategories: u,
                      }),
                    ],
                  }),
                ],
              }),
            ],
          }),
        ],
      }),
      d.jsx("footer", {
        className:
          "bg-[#003B5C]/20 text-white/90 border-t border-white/10 py-4 mt-auto",
        children: d.jsxs("div", {
          className:
            "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col gap-2",
          children: [
            d.jsxs("div", {
              className:
                "flex flex-col md:flex-row justify-between items-center gap-2 text-[10px] font-mono font-bold tracking-wider uppercase",
              children: [
                d.jsxs("div", {
                  className: "flex items-center gap-4 flex-wrap",
                  children: [
                    d.jsxs("span", {
                      className: "flex items-center gap-2",
                      children: [
                        d.jsx("span", {
                          className: "w-2 h-2 rounded-full bg-green-400",
                        }),
                        " RUNS ENTIRELY IN YOUR BROWSER",
                      ],
                    }),
                    d.jsxs("span", {
                      className: "flex items-center gap-2",
                      children: [
                        d.jsx("span", {
                          className: "w-2 h-2 rounded-full bg-green-400",
                        }),
                        " OPTIONAL AES-256 ZIP EXPORT",
                      ],
                    }),
                    d.jsxs("span", {
                      className: "flex items-center gap-2",
                      title:
                        "SHA-256 of the current redaction manifest, computed locally in your browser — not a blockchain record",
                      children: [
                        d.jsx("span", {
                          className: "w-2 h-2 rounded-full bg-green-400",
                        }),
                        " MANIFEST CHECKSUM: ",
                        U || "…",
                        d.jsx("span", {
                          className:
                            "normal-case font-sans font-semibold tracking-normal bg-green-400/20 text-green-300 px-1.5 py-0.5 rounded-none",
                          children: "local",
                        }),
                      ],
                    }),
                  ],
                }),
                d.jsx("div", {
                  className:
                    "flex gap-4 normal-case font-sans font-semibold tracking-normal",
                  children: d.jsx("a", {
                    href: "mailto:negus.naga.network@gmail.com?subject=Veridact%20Anonymizer%20feedback",
                    className: "hover:text-white underline",
                    children: "Report an issue / feedback",
                  }),
                }),
              ],
            }),
            d.jsx("div", {
              className: "text-[10px] text-white/60 text-center md:text-left",
              children:
                "Beta evaluation build. Not legal advice and not a substitute for review by a licensed professional — always verify redactions before relying on or sharing an exported document.",
            }),
          ],
        }),
      }),
    ],
  });
}
YB.createRoot(document.getElementById("root")).render(
  d.jsx(De.StrictMode, { children: d.jsx(xC, {}) }),
);
