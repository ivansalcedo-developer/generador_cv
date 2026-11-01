"use client";

import { useState } from "react";
import { AREAS, VERBOS } from "@/lib/verbs";

export default function VerbHelper({ onPick }: { onPick: (verb: string) => void }) {
  const [area, setArea] = useState<string>(AREAS[0]);
  return (
    <details className="helper" open>
      <summary>Ayuda para redactar logros</summary>
      <p style={{ margin: "10px 0 0" }}>
        <strong>Fórmula:</strong> verbo + acción + resultado.
      </p>
      <div className="ex">
        <div className="bad">
          <span>Menos efectivo</span>Responsable de atender clientes.
        </div>
        <div className="good">
          <span>Mejor redactado</span>Atendí a 50 clientes al día, manteniendo los estándares de servicio.
        </div>
      </div>
      <div className="field">
        <label htmlFor="verbArea">Verbos de acción por área</label>
        <select id="verbArea" value={area} onChange={(e) => setArea(e.target.value)}>
          {AREAS.map((a) => (
            <option key={a}>{a}</option>
          ))}
        </select>
      </div>
      <div className="chips">
        {VERBOS[area].map((v) => (
          <button
            key={v}
            type="button"
            className="vb"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => onPick(v)}
          >
            {v}
          </button>
        ))}
      </div>
      <p className="hint" style={{ margin: "10px 0 0" }}>
        Haz clic en Funciones o Logros y luego en un verbo para insertarlo. Usa solo funciones y
        cifras reales.
      </p>
    </details>
  );
}
