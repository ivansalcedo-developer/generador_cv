import Nav from "./Nav";

type Props = { value: string; onChange: (v: string) => void; step: number; go: (n: number) => void };

export default function StepSummary({ value, onChange, step, go }: Props) {
  const words = value.trim() ? value.trim().split(/\s+/).length : 0;
  return (
    <>
      <Nav step={step} go={go} />
      <h1>Escribe tu perfil profesional</h1>
      <p className="lead">
        Tres o cuatro frases: quién eres, qué estudias o dominas y qué buscas.
      </p>
      <div className="field">
        <label htmlFor="resumen">Perfil profesional</label>
        <textarea
          id="resumen"
          rows={7}
          value={value}
          placeholder="Estudiante de... con interés en..."
          onChange={(e) => onChange(e.target.value)}
        />
        <div className="counter">{words} palabras</div>
      </div>
      <div className="tips">
        <strong>Una buena fórmula:</strong> tu situación actual + áreas de interés + 2 o 3
        fortalezas + el tipo de oportunidad que buscas. Entre 40 y 80 palabras funciona bien.
      </div>
    </>
  );
}
