import type { Cv } from "@/types/cv";
import { contactParts, eduList, expList, fullName, period } from "@/lib/cvToText";
import { lines } from "@/lib/text";

function Bullets({ items }: { items: string[] }) {
  if (!items.length) return null;
  return (
    <ul>
      {items.map((t, i) => (
        <li key={i}>{t}</li>
      ))}
    </ul>
  );
}

/** Plantilla Harvard: una columna, texto real, sin tablas ni íconos (compatible con ATS) */
export default function Harvard({ cv }: { cv: Cv }) {
  const name = fullName(cv);
  const cp = contactParts(cv);
  const exps = expList(cv);
  const edus = eduList(cv);
  const cursos = lines(cv.cursos);
  const herr = lines(cv.herr);
  const pers = lines(cv.pers);

  return (
    <div className="cv">
      <div className="name">{name || <span className="ph">Nombre Apellidos</span>}</div>
      {cv.b.cargo && <div className="role">{cv.b.cargo}</div>}
      <div className="contact">
        {cp.length ? (
          cp.map((c, i) => (
            <span key={i}>
              {i > 0 && " | "}
              {c.label && <b>{c.label}: </b>}
              {c.value}
            </span>
          ))
        ) : (
          <span className="ph">Cel: | Email: | Ciudad | LinkedIn:</span>
        )}
      </div>

      {cv.resumen.trim() && (
        <>
          <h2>Perfil profesional</h2>
          <p>{cv.resumen.trim()}</p>
        </>
      )}

      {exps.length > 0 && (
        <>
          <h2>Experiencia profesional</h2>
          {exps.map((e) => {
            const pr = period(e);
            const logros = lines(e.logros);
            return (
              <div className="entry" key={e.id}>
                <div className="org">{e.empresa || "Empresa"}</div>
                <div className="pos">
                  <span className="t">{e.puesto || "Puesto"}</span>
                  {pr && ` | ${pr}`}
                  {e.lugar && ` | ${e.lugar}`}
                </div>
                <Bullets items={lines(e.desc)} />
                {logros.length > 0 && (
                  <>
                    <div className="lg">Logros:</div>
                    <Bullets items={logros} />
                  </>
                )}
              </div>
            );
          })}
        </>
      )}

      {edus.length > 0 && (
        <>
          <h2>Formación académica</h2>
          {edus.map((e) => {
            const per = [e.desde, e.hasta].filter(Boolean).join(" – ");
            return (
              <div className="entry" key={e.id}>
                <div className="org">{e.centro || "Institución"}</div>
                {e.titulo && <div className="pos">{e.titulo}</div>}
                {per && <div className="pos">{per}</div>}
                <Bullets items={lines(e.detalle)} />
              </div>
            );
          })}
        </>
      )}

      {cursos.length > 0 && (
        <>
          <h2>Cursos y certificaciones</h2>
          <Bullets items={cursos} />
        </>
      )}
      {herr.length > 0 && (
        <>
          <h2>Herramientas informáticas e idiomas</h2>
          <Bullets items={herr} />
        </>
      )}
      {cv.skills.length > 0 && (
        <>
          <h2>Competencias técnicas</h2>
          <Bullets items={cv.skills} />
        </>
      )}
      {pers.length > 0 && (
        <>
          <h2>Competencias personales</h2>
          <Bullets items={[pers.join(" | ")]} />
        </>
      )}
    </div>
  );
}
