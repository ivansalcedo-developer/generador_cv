import type { Cv } from "@/types/cv";
import { fileName } from "@/lib/fileName";
import ChecksList from "./ChecksList";
import OfferMatcher from "./OfferMatcher";
import Field from "@/components/ui/Field";
import Nav from "./Nav";

type Props = {
  cv: Cv;
  step: number;
  go: (n: number) => void;
  setOferta: (v: string) => void;
  setArea: (v: string) => void;
  onPrint: () => void;
  onCopy: () => void;
  onShowAts: () => void;
};

export default function StepFinish({ cv, step, go, setOferta, setArea, onPrint, onCopy, onShowAts }: Props) {
  return (
    <>
      <h1>Tu CV está listo para revisar</h1>
      <p className="lead">
        Revisa los puntos de abajo y descarga el PDF. El archivo contiene texto real, por eso las
        páginas de empleo pueden leer cada dato.
      </p>

      <ChecksList cv={cv} />
      <OfferMatcher cv={cv} onChange={setOferta} />

      <div className="item">
        <div className="grid">
          <Field
            label="Área o puesto (para el nombre del archivo)"
            full
            value={cv.area}
            placeholder="Administración"
            hint="Nombre de archivo sugerido, se usa al guardar el PDF:"
            onChange={setArea}
          />
        </div>
        <code className="fname">{fileName(cv)}</code>
      </div>

      <div className="tips" style={{ margin: "0 0 18px" }}>
        <strong>Antes de enviar:</strong> personaliza el CV para cada postulación, revisa si la
        oferta pide Word o PDF, y no inventes cifras ni funciones.
      </div>

      <div className="nav" style={{ marginTop: 8 }}>
        <button type="button" className="btn primary" onClick={onPrint}>Descargar PDF</button>
        <button type="button" className="btn" onClick={onCopy}>Copiar texto plano</button>
        <button type="button" className="btn" onClick={onShowAts}>Ver lo que lee el ATS</button>
      </div>
      <p className="hint" style={{ marginTop: 14 }}>
        En la ventana de impresión elige «Guardar como PDF» y desactiva «Encabezados y pies de
        página».
      </p>
      <Nav step={step} go={go} />
    </>
  );
}
