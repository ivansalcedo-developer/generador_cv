import type { Cv } from "@/types/cv";
import { renderHarvardHtml } from "./renderHarvardHtml";

/** Plantilla Harvard: una columna, texto real, sin tablas ni íconos (compatible con ATS) */
export default function Harvard({ cv }: { cv: Cv }) {
  return <div className="cv" dangerouslySetInnerHTML={{ __html: renderHarvardHtml(cv) }} />;
}
