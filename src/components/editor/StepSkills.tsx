"use client";

import { useState } from "react";
import type { Cv } from "@/types/cv";
import Field from "@/components/ui/Field";
import Nav from "./Nav";

const SUGGESTIONS = [
  "Google Workspace", "Microsoft Excel", "Power BI", "SQL",
  "Análisis de datos", "Automatización de procesos",
];

type Props = {
  cv: Cv;
  step: number;
  go: (n: number) => void;
  setHerr: (v: string) => void;
  setPers: (v: string) => void;
  setSkills: (s: string[]) => void;
};

export default function StepSkills({ cv, step, go, setHerr, setPers, setSkills }: Props) {
  const [draft, setDraft] = useState("");

  const add = (v: string) => {
    const t = v.trim();
    if (!t || cv.skills.some((s) => s.toLowerCase() === t.toLowerCase())) return;
    setSkills([...cv.skills, t]);
  };

  return (
    <>
      <Nav step={step} go={go} />
      <h1>Herramientas, idiomas y competencias</h1>
      <p className="lead">Usa los mismos términos que aparecen en las ofertas que te interesan.</p>

      <div className="grid">
        <Field
          label="Herramientas informáticas e idiomas"
          full
          area
          rows={3}
          value={cv.herr}
          placeholder={"Inglés a nivel básico (lectura técnica)\nMicrosoft Excel (tablas, funciones básicas)"}
          hint="Una por línea."
          onChange={setHerr}
        />
      </div>

      <div style={{ height: 20 }} />
      <div className="field">
        <label htmlFor="skillIn">Competencias técnicas</label>
        <span className="hint">Escribe una y presiona Enter.</span>
        <input
          id="skillIn"
          type="text"
          value={draft}
          placeholder="Ej.: Google Workspace"
          autoComplete="off"
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              add(draft);
              setDraft("");
            }
          }}
        />
      </div>

      <div className="chips">
        {cv.skills.length === 0 && <span className="hint">Aún no añadiste competencias.</span>}
        {cv.skills.map((s, i) => (
          <span className="chip" key={s}>
            {s}
            <button
              type="button"
              aria-label={`Quitar ${s}`}
              onClick={() => setSkills(cv.skills.filter((_, j) => j !== i))}
            >
              ×
            </button>
          </span>
        ))}
      </div>

      <div className="suggest">
        {SUGGESTIONS.filter((x) => !cv.skills.includes(x)).map((x) => (
          <button key={x} type="button" onClick={() => add(x)}>
            + {x}
          </button>
        ))}
      </div>

      <div style={{ height: 24 }} />
      <div className="grid">
        <Field
          label="Competencias personales"
          full
          area
          rows={4}
          value={cv.pers}
          placeholder={"Pensamiento analítico\nTrabajo en equipo"}
          hint="Una por línea; en el CV salen separadas por barras."
          onChange={setPers}
        />
      </div>
    </>
  );
}
