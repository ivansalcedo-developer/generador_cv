"use client";

import Link from "next/link";
import { useState } from "react";
import { copyText } from "@/lib/clipboard";
import { fileName } from "@/lib/fileName";
import { importAtsText } from "@/lib/importAtsText";
import type { Cv } from "@/types/cv";
import CvPreview from "@/components/preview/CvPreview";
import StickyHeader from "@/components/ui/StickyHeader";

function getOcrPages(value: unknown): string[][] {
  if (typeof value !== "object" || value === null || !("ocrResults" in value)) return [];
  const results = value.ocrResults;
  if (!Array.isArray(results)) return [];

  return results.map((page) => {
    if (typeof page !== "object" || page === null || !("prunedResult" in page)) return [];
    const prunedResult = page.prunedResult;
    if (
      typeof prunedResult !== "object" ||
      prunedResult === null ||
      !("rec_texts" in prunedResult) ||
      !Array.isArray(prunedResult.rec_texts)
    ) {
      return [];
    }
    return prunedResult.rec_texts.filter(
      (line: unknown): line is string => typeof line === "string",
    );
  });
}

export default function ImportAtsEditor() {
  const [ocrEngine, setOcrEngine] = useState<"paddle" | "scribe">("paddle");
  const [text, setText] = useState("");
  const [previewText, setPreviewText] = useState("");
  const [previewCv, setPreviewCv] = useState<Cv | null>(null);
  const [view, setView] = useState<"doc" | "ats">("doc");
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [isExtracting, setIsExtracting] = useState(false);
  const [ocrPages, setOcrPages] = useState<string[][]>([]);
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

  const importFile = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    setIsExtracting(true);
    setOcrPages([]);
    setMessage("");
    try {
      const body = new FormData();
      body.append("file", file);
      body.append("engine", ocrEngine);
      const response = await fetch("/api/ocr", { method: "POST", body });
      const result = (await response.json()) as {
        text?: string;
        error?: string;
        result?: unknown;
      };
      if (!response.ok || !result.text) {
        throw new Error(result.error || "No se pudo extraer el texto del archivo.");
      }

      setOcrPages(getOcrPages(result.result));
      setText(result.text);
      setPreviewText(result.text);
      setPreviewCv(importAtsText(result.text));
      setView("doc");
      setMessage("Texto extraído. Revisa la vista previa y corrige los campos si es necesario.");
    } catch (error) {
      console.error("Error al importar el archivo para OCR.", error);
      setMessage(error instanceof Error ? error.message : "No se pudo procesar el archivo.");
    } finally {
      setIsExtracting(false);
    }
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
    <>
      <StickyHeader>
        <div className="import-heading-content">
          <p>Pega el texto o importa un archivo para revisarlo y descargarlo como PDF.</p>
        </div>
      </StickyHeader>

      <main className="import-page">
        <div className="import-layout">
          <section className="import-panel" aria-labelledby="paste-heading">
            <h2 id="paste-heading">1. Importa o pega el texto</h2>
            <fieldset className="ocr-engine-options" disabled={isExtracting}>
              <legend>Elige cómo importar el archivo</legend>
              <label className={`ocr-engine-option${ocrEngine === "paddle" ? " selected" : ""}`}>
                <input
                  type="radio"
                  name="ocr-engine"
                  value="paddle"
                  checked={ocrEngine === "paddle"}
                  onChange={() => setOcrEngine("paddle")}
                />
                <span>
                  <strong>PaddleOCR</strong>
                  <span>Procesa PDF e imágenes con el servicio OCR configurado.</span>
                </span>
              </label>
              <label className={`ocr-engine-option${ocrEngine === "scribe" ? " selected" : ""}`}>
                <input
                  type="radio"
                  name="ocr-engine"
                  value="scribe"
                  checked={ocrEngine === "scribe"}
                  onChange={() => setOcrEngine("scribe")}
                />
                <span>
                  <strong>Scribe.js-ocr</strong>
                  <span>Procesa en el servidor. Admite PDF, JPG y PNG.</span>
                </span>
              </label>
            </fieldset>
            <label htmlFor="ats-text">Texto plano del CV</label>
            <label className="btn import-file-button" htmlFor="ats-file">
              {isExtracting ? "Procesando archivo..." : "Seleccionar archivo"}
            </label>
            <input
              id="ats-file"
              className="import-file-input"
              type="file"
              accept={
                ocrEngine === "scribe"
                  ? ".pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png"
                  : ".pdf,.jpg,.jpeg,.png,.tif,.tiff,.webp,application/pdf,image/jpeg,image/png,image/tiff,image/webp"
              }
              disabled={isExtracting}
              onChange={importFile}
            />
            <textarea
              id="ats-text"
              className="import-textarea"
              value={text}
              onChange={(event) => {
                setText(event.target.value);
                setOcrPages([]);
              }}
              placeholder="Pega aquí el texto de tu CV..."
              maxLength={100_000}
            />
            {ocrPages.map((page, index) => (
              <section className="import-ocr-page" key={index}>
                <h3>Página {index + 1}</h3>
                <pre>{JSON.stringify(page, null, 2)}</pre>
              </section>
            ))}
            <div className="import-footer">
              <span className="hint">
                {isExtracting
                  ? "Extrayendo texto con OCR..."
                  : `${text.length.toLocaleString("es")} / 100 000 caracteres`}
              </span>
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
                El CV con formato Harvard aparecerá aquí cuando crees una vista previa o importes un archivo.
              </div>
            )}
          </section>
        </div>
        <p className="import-status" role="status" aria-live="polite">{message}</p>
      </main>
    </>
  );
}
