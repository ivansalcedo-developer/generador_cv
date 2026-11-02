import type { Cv, Education } from "@/types/cv";
import Field from "@/components/ui/Field";
import Nav from "./Nav";

type Props = {
  cv: Cv;
  step: number;
  go: (n: number) => void;
  updateEdu: (id: string, p: Partial<Education>) => void;
  addEdu: () => void;
  removeEdu: (id: string) => void;
  setCursos: (v: string) => void;
};

export default function StepEducation({ cv, step, go, updateEdu, addEdu, removeEdu, setCursos }: Props) {
  return (
    <>
      <Nav step={step} go={go} />
      <h1>Formación, cursos y certificaciones</h1>
      <p className="lead">
        Incluye tu estudio principal primero. Si aún no terminas, escribe «En curso».
      </p>

      {cv.edu.map((e, i) => (
        <div className="item" key={e.id}>
          <div className="item-head">
            <span>Formación {i + 1}</span>
            {cv.edu.length > 1 && (
              <button type="button" className="btn link" onClick={() => removeEdu(e.id)}>
                Eliminar
              </button>
            )}
          </div>
          <div className="grid">
            <Field label="Institución" full value={e.centro} placeholder="Instituto CERTUS" onChange={(v) => updateEdu(e.id, { centro: v })} />
            <Field label="Carrera o programa" full value={e.titulo} onChange={(v) => updateEdu(e.id, { titulo: v })} />
            <Field label="Desde" value={e.desde} placeholder="2026" onChange={(v) => updateEdu(e.id, { desde: v })} />
            <Field label="Hasta" value={e.hasta} placeholder="En curso (Primer ciclo)" onChange={(v) => updateEdu(e.id, { hasta: v })} />
            <Field
              label="Contenido principal (opcional)"
              full
              area
              rows={3}
              value={e.detalle}
              placeholder={"Desarrollo de bases de datos SQL.\nSoporte técnico a computadoras."}
              hint="Una línea por tema; sale como viñetas."
              onChange={(v) => updateEdu(e.id, { detalle: v })}
            />
          </div>
        </div>
      ))}

      <button type="button" className="btn" onClick={addEdu}>
        + Añadir otra formación
      </button>

      <div style={{ height: 24 }} />
      <div className="grid">
        <Field
          label="Cursos y certificaciones"
          full
          area
          rows={4}
          value={cv.cursos}
          placeholder="Fundamentos de Excel | CERTUS (2026)"
          hint="Uno por línea: nombre | institución (año)."
          onChange={setCursos}
        />
      </div>
    </>
  );
}
