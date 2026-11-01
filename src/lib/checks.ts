import type { Cv } from "@/types/cv";
import { fullName } from "./cvToText";
import { lines, norm } from "./text";
import { VSET } from "./verbs";

export type Check = { ok: boolean; text: string };

export function runChecks(cv: Cv): Check[] {
  const out: Check[] = [];
  const add = (ok: boolean, text: string) => out.push({ ok, text });
  const b = cv.b;

  add(!!fullName(cv), "Nombre completo");
  add(!!b.email && /^\S+@\S+\.\S+$/.test(b.email), "Correo electrónico válido");
  add(!!b.telefono, "Teléfono de contacto");
  add(
    cv.resumen.trim().split(/\s+/).filter(Boolean).length >= 25,
    "Perfil profesional de al menos 25 palabras"
  );

  const exps = cv.exp.filter((e) => e.puesto && e.empresa);
  add(exps.length > 0, "Al menos una experiencia con empresa y puesto");
  add(
    exps.length > 0 && exps.every((e) => e.desde && (e.actual || e.hasta)),
    "Fechas completas en cada experiencia (con el mismo formato)"
  );
  add(
    exps.length > 0 &&
      exps.every((e) => lines(e.desc).length + lines(e.logros).length >= 2),
    "Al menos 2 funciones o logros por experiencia"
  );
  add(cv.edu.some((e) => e.titulo && e.centro), "Formación con institución y carrera");
  add(
    cv.skills.length >= 1 && lines(cv.herr).length >= 1,
    "Competencias técnicas y herramientas"
  );

  const all = cv.exp.flatMap((e) => [...lines(e.desc), ...lines(e.logros)]);
  const withVerb = all.filter((l) => VSET.has(norm(l.split(/\s+/)[0] ?? "").replace(/[^a-z]/g, ""))).length;
  add(
    all.length > 0 && withVerb / all.length >= 0.7,
    `Funciones y logros empiezan con verbo de acción (${withVerb} de ${all.length})`
  );
  add(
    cv.exp.some((e) => /\d/.test(e.logros)),
    "Al menos un logro con resultado medible (solo si es real)"
  );
  return out;
}
