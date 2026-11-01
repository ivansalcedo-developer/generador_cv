import type { Cv } from "@/types/cv";
import { norm } from "./text";

const slug = (t: string) =>
  norm(t)
    .split(/[^a-z0-9]+/)
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join("");

/** Nombre profesional del archivo: CV_NombreApellido_Area.pdf */
export function fileName(cv: Cv): string {
  const n = slug(cv.b.nombre.split(/\s+/)[0] ?? "");
  const a = slug(cv.b.apellidos.split(/\s+/)[0] ?? "");
  const area = slug(cv.area || cv.b.cargo || "");
  const parts = [n + a, area].filter(Boolean);
  return parts.length ? `CV_${parts.join("_")}.pdf` : "CV_Nombre_Area.pdf";
}
