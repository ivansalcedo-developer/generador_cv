"use client";

import { useEffect, useRef, useState } from "react";
import type { Cv } from "@/types/cv";
import Harvard from "@/templates/Harvard";
import { HARVARD_CSS } from "@/templates/harvardCss";
import { cvToText } from "@/lib/cvToText";

const PAPER_W = 794;
const PAPER_H = 1123;
const PAGE_MARGIN_Y = (15 / 25.4) * 96;
const PAGE_MARGIN_X = (17 / 25.4) * 96;
const PRINTABLE_PAGE_H = PAPER_H - PAGE_MARGIN_Y * 2;

type Props = {
  cv: Cv;
  view: "doc" | "ats";
  onView: (v: "doc" | "ats") => void;
  onDownloadPdf: () => void;
  isGeneratingPdf: boolean;
  onCopy: () => void;
};

export default function CvPreview({
  cv,
  view,
  onView,
  onDownloadPdf,
  isGeneratingPdf,
  onCopy,
}: Props) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const paperRef = useRef<HTMLDivElement>(null);
  const measureRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [pageCount, setPageCount] = useState(1);
  const [currentPage, setCurrentPage] = useState(0);

  useEffect(() => {
    const wrap = wrapRef.current;
    const measure = measureRef.current?.querySelector(".cv");
    if (!wrap || !measure) return;
    const calc = () => {
      const s = Math.min(1, (wrap.clientWidth || PAPER_W) / PAPER_W);
      const rawH = measure.scrollHeight || PAPER_H;
      const pages = Math.max(
        1,
        Math.ceil((rawH - PAGE_MARGIN_Y) / PRINTABLE_PAGE_H)
      );
      setScale(s);
      setPageCount(pages);
      setCurrentPage((page) => Math.min(page, pages - 1));
    };
    calc();
    const ro = new ResizeObserver(calc);
    ro.observe(wrap);
    ro.observe(measure);
    return () => ro.disconnect();
  }, [cv]);

  return (
    <>
      <div className="preview-bar">
        <span>{view === "doc" ? "Se actualiza mientras escribes" : "Texto plano tal como lo extrae un ATS"}</span>
        <div className="preview-controls">
          <button
            type="button"
            className="btn primary"
            onClick={onDownloadPdf}
            disabled={isGeneratingPdf}
          >
            {isGeneratingPdf ? "Generando PDF..." : "Descargar PDF"}
          </button>
          <button type="button" className="btn" onClick={onCopy}>
            Copiar texto plano
          </button>
          <div className="view-toggle" role="group" aria-label="Tipo de vista">
            <button type="button" aria-pressed={view === "doc"} onClick={() => onView("doc")}>Diseño</button>
            <button type="button" aria-pressed={view === "ats"} onClick={() => onView("ats")}>Lo que lee el ATS</button>
          </div>
        </div>
      </div>

      <div className="paper-viewer">
        {view === "doc" && (
          <div className="page-navigation" role="group" aria-label="Páginas de la vista previa">
            {Array.from({ length: pageCount }, (_, page) => (
              <button
                key={page}
                type="button"
                aria-current={currentPage === page ? "page" : undefined}
                aria-label={`Ver página ${page + 1} de ${pageCount}`}
                onClick={() => setCurrentPage(page)}
              >
                {page + 1}
              </button>
            ))}
          </div>
        )}
        <div className="paper-wrap">
          <style>{HARVARD_CSS}</style>
          <style>{`
            .paper-paged .cv {
              box-sizing: border-box;
              width: ${pageCount * PAPER_W}px;
              height: ${PAPER_H}px;
              column-count: ${pageCount};
              column-gap: ${PAGE_MARGIN_X * 2}px;
              column-fill: auto;
            }
          `}</style>
          <div
            ref={wrapRef}
            className="paper-scale"
            style={{
              minHeight: PAPER_H * scale,
              display: view === "doc" ? "block" : "none",
            }}
          >
            <div
              className="paper-page"
              style={{
                width: PAPER_W * scale,
                height: PAPER_H * scale,
                minHeight: PAPER_H * scale,
              }}
            >
              <div
                ref={paperRef}
                className="paper paper-paged"
                style={{
                  width: PAPER_W * pageCount,
                  height: PAPER_H,
                  transform: `scale(${scale}) translateX(-${currentPage * PAPER_W}px)`,
                }}
              >
                <div id="cv-source">
                  <Harvard cv={cv} />
                </div>
              </div>
            </div>
          </div>
          {view === "ats" && <pre className="ats">{cvToText(cv)}</pre>}
        </div>
      </div>
      <div ref={measureRef} className="paper-measure" aria-hidden="true">
        <Harvard cv={cv} />
      </div>
    </>
  );
}
