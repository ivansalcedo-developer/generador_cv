"use client";

import Link from "next/link";
import { useState } from "react";
import { copyText } from "@/lib/clipboard";
import { fileName } from "@/lib/fileName";
import { importAtsText } from "@/lib/importAtsText";
import type { Cv } from "@/types/cv";
import CvPreview from "@/components/preview/CvPreview";

export default function ImportAtsEditor() {
  const [text, setText] = useState("");
  const [previewText, setPreviewText] = useState("");
  const [previewCv, setPreviewCv] = useState<Cv | null>(null);
  const [view, setView] = useState<"doc" | "ats">("doc");
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [message, setMessage] = useState("");

  const createPreview = () => {
    const trimmed = text.trim();
    if (!trimmed) {
      setMessage("Pega el texto de tu CV antes de crear la vista previa.");
      return;
    }
    setPreviewText(trimmed);
    setPreviewCv(importAtsText(trimmed));
    setView("doc");
    setMessage("Vista previa actualizada.");
  };

  const downloadPdf = async () => {
    if (!previewCv) return;
    setIsGeneratingPdf(true);
    try {
      const response = await fetch("/api/pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cv: previewCv }),
      });
      if (!response.ok) {
        const result = (await response.json()) as { error?: string };
        throw new Error(result.error || "No se pudo generar el PDF.");
      }

      const pdf = await response.blob();
      const url = URL.createObjectURL(pdf);
      const link = document.createElement("a");
      link.href = url;
      link.download = fileName(previewCv);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.setTimeout(() => URL.revokeObjectURL(url), 1000);
      setMessage("Descarga del PDF iniciada.");
    } catch (error) {
      console.error("Error al descargar el CV importado.", error);
      setMessage(error instanceof Error ? error.message : "No se pudo generar el PDF.");
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const copyPreview = async () => {
    if (!previewText) return;
    setMessage((await copyText(previewText)) ? "Texto copiado." : "No se pudo copiar el texto.");
  };

  return (
    <main className="import-page">
      <header className="import-heading">
        <div>
          <Link href="/" className="brand import-brand">Creación de CV Harvard</Link>
          <h1>Importar texto de CV</h1>
          <p>Pega el texto de tu CV para revisarlo y descargarlo como PDF.</p>
        </div>
        <Link href="/" className="btn">Volver al inicio</Link>
      </header>

      <div className="import-layout">
        <section className="import-panel" aria-labelledby="paste-heading">
          <h2 id="paste-heading">1. Pega el texto</h2>
          <label htmlFor="ats-text">Texto plano del CV</label>
          <textarea
            id="ats-text"
            className="import-textarea"
            value={text}
            onChange={(event) => setText(event.target.value)}
            placeholder="Pega aquí el texto de tu CV..."
            maxLength={100_000}
          />
          <div className="import-footer">
            <span className="hint">{text.length.toLocaleString("es")} / 100 000 caracteres</span>
            <button type="button" className="btn primary" onClick={createPreview}>
              Crear vista previa
            </button>
          </div>
        </section>

        <section className="import-panel" aria-labelledby="preview-heading">
          <h2 id="preview-heading">2. Vista previa</h2>
          {previewCv ? (
            <CvPreview
              cv={previewCv}
              view={view}
              onView={setView}
              onDownloadPdf={downloadPdf}
              isGeneratingPdf={isGeneratingPdf}
              onCopy={copyPreview}
            />
          ) : (
            <div className="import-empty">
              El CV con formato Harvard aparecerá aquí cuando pulses “Crear vista previa”.
            </div>
          )}
        </section>
      </div>
      <p className="import-status" role="status" aria-live="polite">{message}</p>
    </main>
  );
}
