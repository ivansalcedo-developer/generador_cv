import type { Cv, Experience } from "@/types/cv";
import { lines } from "./text";

export const fullName = (cv: Cv): string =>
  `${cv.b.nombre} ${cv.b.apellidos}`.trim();

export function period(e: Pick<Experience, "desde" | "hasta" | "actual">): string {
  const d = e.desde || "";
  const h = e.actual ? "Actualidad" : e.hasta || "";
  if (!d && !h) return "";
  if (d && h && d === h) return d;
  return d && h ? `${d} – ${h}` : d || h;
}

export type ContactPart = { label: string; value: string };

export function contactParts(cv: Cv): ContactPart[] {
  const b = cv.b;
  const out: ContactPart[] = [];
  if (b.telefono) out.push({ label: "Cel", value: b.telefono });
  if (b.email) out.push({ label: "Email", value: b.email });
  const loc = [b.ciudad, b.pais].filter(Boolean).join(", ");
  if (loc) out.push({ label: "", value: loc });
  if (b.linkedin) out.push({ label: "LinkedIn", value: b.linkedin });
  return out;
}

export const expList = (cv: Cv) =>
  cv.exp.filter((e) => e.puesto || e.empresa || e.desc || e.logros);

export const eduList = (cv: Cv) => cv.edu.filter((e) => e.titulo || e.centro);

/** Texto plano tal como lo extrae un ATS */
export function cvToText(cv: Cv): string {
  const b = cv.b;
  const t: string[] = [];
  const dash = (x: string) => `- ${x}`;
  t.push((fullName(cv) || "NOMBRE APELLIDOS").toUpperCase());
  if (b.cargo) t.push(b.cargo);
  const cp = contactParts(cv).map((c) => (c.label ? `${c.label}: ` : "") + c.value);
  if (cp.length) t.push(cp.join(" | "));

  if (cv.resumen.trim()) t.push("", "PERFIL PROFESIONAL", cv.resumen.trim());

  const exps = expList(cv);
  if (exps.length) {
    t.push("", "EXPERIENCIA PROFESIONAL");
    exps.forEach((e, i) => {
      if (i) t.push("");
      t.push((e.empresa || "").toUpperCase());
      t.push(
        [(e.puesto || "").toUpperCase(), period(e), e.lugar]
          .filter(Boolean)
          .join(" | ")
      );
      lines(e.desc).forEach((l) => t.push(dash(l)));
      const lg = lines(e.logros);
      if (lg.length) {
        t.push("Logros:");
        lg.forEach((l) => t.push(dash(l)));
      }
    });
  }

  const edus = eduList(cv);
  if (edus.length) {
    t.push("", "FORMACIÓN ACADÉMICA");
    edus.forEach((e, i) => {
      if (i) t.push("");
      t.push((e.centro || "").toUpperCase());
      if (e.titulo) t.push(e.titulo);
      const per = [e.desde, e.hasta].filter(Boolean).join(" – ");
      if (per) t.push(per);
      lines(e.detalle).forEach((l) => t.push(dash(l)));
    });
  }

  const sec = (title: string, arr: string[]) => {
    if (arr.length) {
      t.push("", title);
      arr.forEach((x) => t.push(dash(x)));
    }
  };
  sec("CURSOS Y CERTIFICACIONES", lines(cv.cursos));
  sec("HERRAMIENTAS INFORMÁTICAS E IDIOMAS", lines(cv.herr));
  sec("COMPETENCIAS TÉCNICAS", cv.skills);
  const pe = lines(cv.pers);
  if (pe.length) sec("COMPETENCIAS PERSONALES", [pe.join(" | ")]);

  return t.join("\n");
}
