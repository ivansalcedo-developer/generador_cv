"use client";

import { useCallback, useRef, useState } from "react";
import Link from "next/link";
import { useCv } from "@/hooks/useCv";
import Stepper from "./Stepper";
import StepHeader from "./StepHeader";
import StepExperience from "./StepExperience";
import StepEducation from "./StepEducation";
import StepSkills from "./StepSkills";
import StepSummary from "./StepSummary";
import StepFinish from "./StepFinish";
import CvPreview from "@/components/preview/CvPreview";
import Toast from "@/components/ui/Toast";
import { HARVARD_CSS } from "@/templates/harvardCss";
import { cvToText } from "@/lib/cvToText";
import { copyText } from "@/lib/clipboard";
import { fileName } from "@/lib/fileName";
import { printPdf } from "@/lib/printPdf";

export default function Editor() {
  const api = useCv();
  const { cv, step, ready, setStep } = api;

  const [view, setView] = useState<"doc" | "ats">("doc");
  const [mobile, setMobile] = useState<"edit" | "preview">("edit");
  const [toast, setToast] = useState("");
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const notify = useCallback((m: string) => {
    setToast(m);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setToast(""), 2200);
  }, []);

  const go = useCallback(
    (n: number) => {
      setStep(n);
      window.scrollTo({ top: 0, behavior: "smooth" });
    },
    [setStep]
  );

  const onPrint = () => {
    const el = document.getElementById("cv-source");
    if (!el) {
      notify("No se encontró el CV para imprimir");
      return;
    }
    printPdf({ html: el.innerHTML, css: HARVARD_CSS, fileName: fileName(cv) });
  };

  const onCopy = async () => {
    notify((await copyText(cvToText(cv))) ? "Texto copiado" : "No se pudo copiar");
  };

  const onShowAts = () => {
    setView("ats");
    setMobile("preview");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const onSample = () => {
    api.loadSample();
    notify("Ejemplo cargado");
  };

  const onReset = () => api.reset();

  if (!ready) {
    return (
      <div className="app">
        <p className="loading">Cargando…</p>
      </div>
    );
  }

  return (
    <div className={`app m-${mobile}`}>
      <header className="top">
        <div className="top-in">
          <Link href="/" className="brand">
            Creación de CV Harvard
          </Link>
          <Stepper step={step} onGo={go} />
        </div>
      </header>

      <div className="mobile-tabs">
        <button type="button" aria-pressed={mobile === "edit"} onClick={() => setMobile("edit")}>
          Editar
        </button>
        <button type="button" aria-pressed={mobile === "preview"} onClick={() => setMobile("preview")}>
          Vista previa
        </button>
      </div>

      <main className="layout">
        <section className="editor">
          {step === 0 && (
            <StepHeader b={cv.b} setB={api.setB} onNext={() => go(1)} onSample={onSample} onReset={onReset} />
          )}
          {step === 1 && (
            <StepExperience
              cv={cv}
              step={step}
              go={go}
              updateExp={api.updateExp}
              addExp={api.addExp}
              removeExp={api.removeExp}
              notify={notify}
            />
          )}
          {step === 2 && (
            <StepEducation
              cv={cv}
              step={step}
              go={go}
              updateEdu={api.updateEdu}
              addEdu={api.addEdu}
              removeEdu={api.removeEdu}
              setCursos={(v) => api.setText("cursos", v)}
            />
          )}
          {step === 3 && (
            <StepSkills
              cv={cv}
              step={step}
              go={go}
              setHerr={(v) => api.setText("herr", v)}
              setPers={(v) => api.setText("pers", v)}
              setSkills={api.setSkills}
            />
          )}
          {step === 4 && (
            <StepSummary value={cv.resumen} onChange={(v) => api.setText("resumen", v)} step={step} go={go} />
          )}
          {step === 5 && (
            <StepFinish
              cv={cv}
              step={step}
              go={go}
              setOferta={(v) => api.setText("oferta", v)}
              setArea={(v) => api.setText("area", v)}
              onPrint={onPrint}
              onCopy={onCopy}
              onShowAts={onShowAts}
            />
          )}
        </section>

        <aside className="preview-col">
          <CvPreview cv={cv} view={view} onView={setView} />
        </aside>
      </main>

      <Toast message={toast} />
    </div>
  );
}
