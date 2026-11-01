import { STEPS } from "@/lib/steps";

export default function Stepper({ step, onGo }: { step: number; onGo: (n: number) => void }) {
  return (
    <nav className="steps" aria-label="Pasos">
      {STEPS.map((s, i) => (
        <button
          key={s}
          type="button"
          className={`step${i < step ? " done" : ""}`}
          aria-current={i === step ? "step" : undefined}
          onClick={() => onGo(i)}
        >
          <span className="n">{i < step ? "✓" : i + 1}</span>
          <span className="lbl-t">{s}</span>
        </button>
      ))}
    </nav>
  );
}
