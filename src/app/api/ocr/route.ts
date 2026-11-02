import { Buffer } from "node:buffer";

const MAX_FILE_SIZE = 20 * 1024 * 1024;
const ALLOWED_TYPES = new Set([
  "application/pdf",
  "image/jpeg",
  "image/png",
  "image/tiff",
  "image/webp",
]);

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function extractText(value: unknown): string {
  if (typeof value === "string") return value.trim();
  if (Array.isArray(value)) {
    return value.map(extractText).filter(Boolean).join("\n");
  }
  if (!isRecord(value)) return "";

  for (const key of [
    "markdown",
    "text",
    "rec_texts",
    "ocrResults",
    "prunedResult",
    "texts",
    "result",
    "results",
    "data",
    "pages",
  ]) {
    if (key in value) {
      const text = extractText(value[key]);
      if (text) return text;
    }
  }
  return "";
}

export async function POST(request: Request) {
  const contentLength = Number(request.headers.get("content-length") || 0);
  if (contentLength > MAX_FILE_SIZE + 100_000) {
    return Response.json({ error: "El archivo supera el límite de 20 MB." }, { status: 413 });
  }

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return Response.json({ error: "No se pudo leer el archivo enviado." }, { status: 400 });
  }

  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) {
    return Response.json({ error: "Selecciona un PDF o una imagen para importar." }, { status: 400 });
  }

  const requestedEngine = formData.get("engine");
  const engine = requestedEngine === null ? "paddle" : requestedEngine;
  if (engine !== "paddle" && engine !== "scribe") {
    return Response.json({ error: "Selecciona un motor OCR válido." }, { status: 400 });
  }

  if (file.size > MAX_FILE_SIZE) {
    return Response.json({ error: "El archivo supera el límite de 20 MB." }, { status: 413 });
  }

  const extension = file.name.toLowerCase();
  const isPdf = file.type === "application/pdf" || extension.endsWith(".pdf");
  const supported = ALLOWED_TYPES.has(file.type) || /\.(pdf|jpe?g|png|tiff?|webp)$/.test(extension);
  if (!supported) {
    return Response.json(
      { error: "Formato no compatible. Usa PDF, JPG, PNG, TIFF o WEBP." },
      { status: 415 },
    );
  }

  if (
    engine === "scribe" &&
    !(/\.(pdf|jpe?g|png)$/.test(extension) ||
      ["application/pdf", "image/jpeg", "image/png"].includes(file.type))
  ) {
    return Response.json(
      { error: "Scribe.js-ocr admite PDF, JPG y PNG. Para TIFF o WEBP, selecciona PaddleOCR." },
      { status: 415 },
    );
  }

  try {
    if (engine === "scribe") {
      const { default: scribe } = await import("scribe.js-ocr");
      const document = await scribe.openDocument([file]);
      try {
        await document.recognize({ langs: ["spa", "eng"] });
        const extracted = await document.exportData("txt");
        const text = typeof extracted === "string" ? extracted.trim() : "";
        if (!text) {
          return Response.json(
            { error: "Scribe.js-ocr no encontró texto en el archivo." },
            { status: 422 },
          );
        }
        return Response.json({ text, engine });
      } finally {
        await document.close();
      }
    }

    const ocrUrl = process.env.PADDLEOCR_URL;
    if (!ocrUrl) {
      return Response.json(
        { error: "Falta configurar PADDLEOCR_URL con la dirección del servicio PaddleOCR." },
        { status: 503 },
      );
    }

    const body = {
      file: Buffer.from(await file.arrayBuffer()).toString("base64"),
      fileType: isPdf ? 0 : 1,
      visualize: false,
    };
    const response = await fetch(ocrUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(600_000),
    });
    const responseBody = await response.text();

    let result: unknown;
    try {
      result = JSON.parse(responseBody) as unknown;
    } catch {
      result = responseBody;
    }

    if (!response.ok) {
      console.error(`PaddleOCR respondió con HTTP ${response.status}.`);
      const message =
        isRecord(result) && typeof result.errorMsg === "string"
          ? result.errorMsg
          : `HTTP ${response.status}`;
      return Response.json(
        { error: `El servicio PaddleOCR respondió con un error: ${message}.` },
        { status: 502 },
      );
    }

    if (isRecord(result) && typeof result.errorCode === "number" && result.errorCode !== 0) {
      const message =
        typeof result.errorMsg === "string" ? result.errorMsg : "error desconocido";
      return Response.json(
        { error: `El servicio PaddleOCR respondió con un error: ${message}.` },
        { status: 502 },
      );
    }

    const text = extractText(result);
    if (!text) {
      return Response.json(
        { error: "PaddleOCR no devolvió texto. Prueba con otro archivo." },
        { status: 422 },
      );
    }

    return Response.json({
      text,
      engine,
      result: isRecord(result) ? result.result : undefined,
    });
  } catch (error) {
    console.error(`Error al procesar el documento con ${engine}.`, error);

    if (error instanceof Error && error.name === "TimeoutError") {
      return Response.json(
        { error: `${engine === "paddle" ? "PaddleOCR" : "Scribe.js-ocr"} tardó demasiado en procesar el documento.` },
        { status: 504 },
      );
    }

    return Response.json(
      {
        error:
          engine === "paddle"
            ? "No se pudo conectar con PaddleOCR. Revisa la URL y que el servicio esté activo."
            : "Scribe.js-ocr no pudo procesar el documento.",
      },
      { status: 502 },
    );
  }
}
