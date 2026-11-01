import type { Cv } from "@/types/cv";
import { cvToText } from "@/lib/cvToText";
import { matchKeywords } from "@/lib/keywords";

export default function OfferMatcher({ cv, onChange }: { cv: Cv; onChange: (v: string) => void }) {
  const { total, have, miss } = matchKeywords(cv.oferta, cvToText(cv));
  return (
    <div className="item">
      <div className="item-head">
        <span>Compara tu CV con la oferta</span>
      </div>
      <div className="field">
        <label htmlFor="oferta">Pega aquí la oferta de trabajo</label>
        <span className="hint">Verás qué términos de la oferta ya aparecen en tu CV.</span>
        <textarea id="oferta" rows={5} value={cv.oferta} onChange={(e) => onChange(e.target.value)} />
      </div>
      {total > 0 && (
        <div className="kw">
          <p className="hint">
            {have.length} de {total} términos de la oferta aparecen en tu CV.
          </p>
          <div className="chips">
            {have.map((k) => (
              <span key={k.n} className="chip kw-ok">✓ {k.w}</span>
            ))}
            {miss.map((k) => (
              <span key={k.n} className="chip kw-no">! {k.w}</span>
            ))}
          </div>
          {miss.length > 0 && (
            <p className="hint">
              Los marcados con ! no aparecen. Inclúyelos solo si reflejan tu experiencia real.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
