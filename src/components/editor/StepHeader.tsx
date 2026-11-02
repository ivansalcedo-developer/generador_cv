import type { Basics } from "@/types/cv";
import Field from "@/components/ui/Field";

type Props = {
  b: Basics;
  setB: (k: keyof Basics, v: string) => void;
  onNext: () => void;
  onSample: () => void;
};

export default function StepHeader({ b, setB, onNext, onSample }: Props) {
  return (
    <>
      <div className="nav nav-top">
        <button type="button" className="btn" onClick={onSample}>Cargar un ejemplo</button>
        <button type="button" className="btn primary spacer" onClick={onNext}>Continuar</button>
      </div>
      <h1>Empecemos por tus datos de contacto</h1>
      <p className="lead">
        Escribe tu nombre completo y al menos una forma de contacto. Todo se refleja de
        inmediato en la vista previa.
      </p>

      <div className="grid">
        <Field label="Nombre" value={b.nombre} onChange={(v) => setB("nombre", v)} autoComplete="given-name" />
        <Field label="Apellidos" value={b.apellidos} onChange={(v) => setB("apellidos", v)} autoComplete="family-name" />
        <Field
          label="Puesto al que aspiras"
          value={b.cargo}
          onChange={(v) => setB("cargo", v)}
          full
          placeholder="Ej.: Analista de Marketing Digital"
          hint="Aparece bajo tu nombre y ayuda a que te encuentren por palabra clave."
        />
        <Field label="Correo electrónico" type="email" value={b.email} onChange={(v) => setB("email", v)} autoComplete="email" />
        <Field label="Teléfono" type="tel" value={b.telefono} onChange={(v) => setB("telefono", v)} autoComplete="tel" placeholder="+51 999 123 456" />
        <Field label="Ciudad" value={b.ciudad} onChange={(v) => setB("ciudad", v)} autoComplete="address-level2" />
        <Field label="País" value={b.pais} onChange={(v) => setB("pais", v)} autoComplete="country-name" />
        <Field
          label="LinkedIn (opcional)"
          value={b.linkedin}
          onChange={(v) => setB("linkedin", v)}
          full
          placeholder="linkedin.com/in/tu-perfil"
          hint="Escríbelo completo, como texto. Los íconos no los lee el ATS."
        />
      </div>

      <div className="tips">
        <strong>Sin foto, a propósito.</strong> La mayoría de los ATS ignoran las imágenes y
        algunas empresas prefieren no recibirla.
      </div>

    </>
  );
}
