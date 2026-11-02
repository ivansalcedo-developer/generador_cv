import { STEPS } from "@/lib/steps";

export default function Nav({ step, go }: { step: number; go: (n: number) => void }) {
  return (
    <div className="nav nav-top">
      {step > 0 && (
        <button type="button" className="btn" onClick={() => go(step - 1)}>
          Atrás
        </button>
      )}
      {step < STEPS.length - 1 && (
        <button type="button" className="btn primary spacer" onClick={() => go(step + 1)}>
          Continuar
        </button>
      )}
    </div>
  );
}
