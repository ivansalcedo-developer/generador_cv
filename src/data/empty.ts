import type { Cv, Education, Experience } from "@/types/cv";
import { uid } from "@/lib/id";

export const emptyExp = (): Experience => ({
  id: uid(),
  empresa: "",
  puesto: "",
  lugar: "",
  desde: "",
  hasta: "",
  actual: false,
  desc: "",
  logros: "",
});

export const emptyEdu = (): Education => ({
  id: uid(),
  centro: "",
  titulo: "",
  desde: "",
  hasta: "",
  detalle: "",
});

export const emptyCv = (includeInitialItems = true): Cv => ({
  b: {
    nombre: "",
    apellidos: "",
    cargo: "",
    email: "",
    telefono: "",
    ciudad: "",
    pais: "",
    linkedin: "",
  },
  exp: includeInitialItems ? [emptyExp()] : [],
  edu: includeInitialItems ? [emptyEdu()] : [],
  cursos: "",
  herr: "",
  skills: [],
  pers: "",
  resumen: "",
  oferta: "",
  area: "",
});

/** Completa datos guardados con valores por defecto (por si faltan campos) */
export function normalizeCv(p: Partial<Cv> | undefined): Cv {
  const base = emptyCv();
  if (!p) return base;
  return {
    ...base,
    ...p,
    b: { ...base.b, ...(p.b ?? {}) },
    exp: p.exp?.length
      ? p.exp.map((e) => ({ ...emptyExp(), ...e, id: e.id || uid() }))
      : base.exp,
    edu: p.edu?.length
      ? p.edu.map((e) => ({ ...emptyEdu(), ...e, id: e.id || uid() }))
      : base.edu,
    skills: Array.isArray(p.skills) ? p.skills : [],
  };
}
