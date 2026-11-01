"use client";

import { useState } from "react";
import type { Cv, Experience } from "@/types/cv";
import Field from "@/components/ui/Field";
import VerbHelper from "./VerbHelper";
import Nav from "./Nav";

type Props = {
  cv: Cv;
  step: number;
  go: (n: number) => void;
  updateExp: (id: string, p: Partial<Experience>) => void;
  addExp: () => void;
  removeExp: (id: string) => void;
  notify: (m: string) => void;
};

type Target = { id: string; key: "desc" | "logros" };

export default function StepExperience({ cv, step, go, updateExp, addExp, removeExp, notify }: Props) {
  const [target, setTarget] = useState<Target | null>(null);

  const pick = (verb: string) => {
    const e = target ? cv.exp.find((x) => x.id === target.id) : undefined;
    if (!target || !e) {
      notify("Primero haz clic en Funciones o Logros");
      return;
    }
    const cur = e[target.key];
    const next = (cur && !cur.endsWith("\n") ? cur + "\n" : cur) + verb + " ";
    updateExp(e.id, target.key === "desc" ? { desc: next } : { logros: next });
  };

  return (
    <>
      <h1>Cuéntanos tu experiencia profesional</h1>
      <p className="lead">
        Empieza por el trabajo más reciente. Escribe una función o un logro por línea; cada línea
        se convierte en una viñeta.
      </p>

      <VerbHelper onPick={pick} />

      {cv.exp.map((e, i) => (
        <div className="item" key={e.id}>
          <div className="item-head">
            <span>Experiencia {i + 1}</span>
            {cv.exp.length > 1 && (
              <button type="button" className="btn link" onClick={() => removeExp(e.id)}>
                Eliminar
              </button>
            )}
          </div>
          <div className="grid">
            <Field label="Empresa" full value={e.empresa} onChange={(v) => updateExp(e.id, { empresa: v })} />
            <Field label="Puesto" value={e.puesto} onChange={(v) => updateExp(e.id, { puesto: v })} />
            <Field label="Ciudad y país (opcional)" value={e.lugar} onChange={(v) => updateExp(e.id, { lugar: v })} />
            <Field label="Desde" value={e.desde} placeholder="03/2021" onChange={(v) => updateExp(e.id, { desde: v })} />
            <Field label="Hasta" value={e.hasta} placeholder="12/2023" onChange={(v) => updateExp(e.id, { hasta: v })} />
            <div className="field full">
              <label className="check">
                <input
                  type="checkbox"
                  checked={e.actual}
                  onChange={(ev) => updateExp(e.id, { actual: ev.target.checked })}
                />
                Trabajo aquí actualmente
              </label>
            </div>
            <Field
              label="Funciones"
              full
              area
              rows={4}
              value={e.desc}
              placeholder={"Organicé la información en Google Drive.\nGestioné las redes sociales del negocio."}
              hint="Una por línea: verbo + acción + resultado."
              onChange={(v) => updateExp(e.id, { desc: v })}
              onFocus={() => setTarget({ id: e.id, key: "desc" })}
            />
            <Field
              label="Logros"
              full
              area
              rows={3}
              value={e.logros}
              placeholder="Digitalicé más de 500 registros físicos."
              hint="Una por línea. Incluye cifras cuando puedas."
              onChange={(v) => updateExp(e.id, { logros: v })}
              onFocus={() => setTarget({ id: e.id, key: "logros" })}
            />
          </div>
        </div>
      ))}

      <button type="button" className="btn" onClick={addExp}>
        + Añadir otra experiencia
      </button>
      <Nav step={step} go={go} />
    </>
  );
}
