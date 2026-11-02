import { STEPS } from "@/lib/steps";
import type { Cv } from "@/types/cv";

function hasText(values: string[]) {
  return values.some((value) => value.trim().length > 0);
}

function isStepComplete(cv: Cv, step: number) {
  switch (step) {
    case 0:
      return hasText(Object.values(cv.b));
    case 1:
      return cv.exp.some((experience) =>
        hasText([
          experience.empresa,
          experience.puesto,
          experience.lugar,
          experience.desde,
          experience.hasta,
          experience.desc,
          experience.logros,
        ])
      );
    case 2:
      return cv.edu.some((education) =>
        hasText([
          education.centro,
          education.titulo,
          education.desde,
          education.hasta,
          education.detalle,
        ])
      );
    case 3:
      return hasText([...cv.skills, cv.cursos, cv.herr, cv.pers]);
    case 4:
      return hasText([cv.resumen]);
    case 5:
      return hasText([cv.oferta, cv.area]);
    default:
      return false;
  }
}

export default function Stepper({
  cv,
  step,
  onGo,
}: {
  cv: Cv;
  step: number;
  onGo: (n: number) => void;
}) {
  return (
    <nav className="steps" aria-label="Pasos">
      {STEPS.map((s, i) => (
        <button
          key={s}
          type="button"
          className={`step${isStepComplete(cv, i) ? " complete" : " incomplete"}`}
          aria-current={i === step ? "step" : undefined}
          onClick={() => onGo(i)}
        >
          <span className="n">{isStepComplete(cv, i) ? "✓" : i + 1}</span>
          <span className="lbl-t">{s}</span>
        </button>
      ))}
    </nav>
  );
}
