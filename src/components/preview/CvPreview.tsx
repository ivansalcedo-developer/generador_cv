"use client";

import { useEffect, useRef, useState } from "react";
import type { Cv } from "@/types/cv";
import Harvard from "@/templates/Harvard";
import { HARVARD_CSS } from "@/templates/harvardCss";
import { cvToText } from "@/lib/cvToText";

const PAPER_W = 874;
const PAPER_H = 1123;

type Props = { cv: Cv; view: "doc" | "ats"; onView: (v: "doc" | "ats") => void };

export default function CvPreview({ cv, view, onView }: Props) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const paperRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [height, setHeight] = useState(PAPER_H);

  useEffect(() => {
    const wrap = wrapRef.current;
    const paper = paperRef.current;
    if (!wrap || !paper) return;
    const calc = () => {
      const s = Math.min(1, (wrap.clientWidth || PAPER_W) / PAPER_W);
      setScale(s);
      setHeight(Math.max(paper.scrollHeight, PAPER_H) * s);
    };
    calc();
    const ro = new ResizeObserver(calc);
    ro.observe(wrap);
    ro.observe(paper);
    return () => ro.disconnect();
  }, []);

  return (
    <>
      <div className="preview-bar">
        <span>{view === "doc" ? "Se actualiza mientras escribes" : "Texto plano tal como lo extrae un ATS"}</span>
        <div className="view-toggle" role="group" aria-label="Tipo de vista">
          <button type="button" aria-pressed={view === "doc"} onClick={() => onView("doc")}>Diseño</button>
          <button type="button" aria-pressed={view === "ats"} onClick={() => onView("ats")}>Lo que lee el ATS</button>
        </div>
      </div>

      <div className="paper-wrap">
        <style>{HARVARD_CSS}</style>
        <div
          ref={wrapRef}
          className="paper-scale"
          style={{ height, display: view === "doc" ? "block" : "none" }}
        >
          <div ref={paperRef} className="paper" style={{ transform: `scale(${scale})` }}>
            {/* El PDF se genera a partir del HTML de este contenedor */}
            <div id="cv-source">
              <Harvard cv={cv} />
            </div>
          </div>
        </div>
        {view === "ats" && <pre className="ats">{cvToText(cv)}</pre>}
      </div>
    </>
  );
}
