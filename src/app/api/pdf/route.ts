import { existsSync } from "node:fs";
import path from "node:path";
import chromium from "@sparticuz/chromium";
import puppeteer from "puppeteer-core";
import { renderHarvardHtml } from "@/templates/renderHarvardHtml";
import { HARVARD_CSS } from "@/templates/harvardCss";
import { fileName } from "@/lib/fileName";
import type { Cv } from "@/types/cv";

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const isStringRecord = (value: unknown, fields: string[]) =>
  isRecord(value) && fields.every((field) => typeof value[field] === "string");

function isCv(value: unknown): value is Cv {
  if (!isRecord(value)) return false;
  const basicFields = [
    "nombre", "apellidos", "cargo", "email", "telefono", "ciudad", "pais", "linkedin",
  ];
  const expFields = [
    "id", "empresa", "puesto", "lugar", "desde", "hasta", "desc", "logros",
  ];
  const eduFields = ["id", "centro", "titulo", "desde", "hasta", "detalle"];
  const textFields = ["cursos", "herr", "pers", "resumen", "oferta", "area"];

  return (
    isStringRecord(value.b, basicFields) &&
    isStringRecord(value, textFields) &&
    Array.isArray(value.exp) &&
    value.exp.every(
      (entry) => isStringRecord(entry, expFields) && typeof entry.actual === "boolean"
    ) &&
    Array.isArray(value.edu) &&
    value.edu.every((entry) => isStringRecord(entry, eduFields)) &&
    Array.isArray(value.skills) &&
    value.skills.every((skill) => typeof skill === "string")
  );
}

function getWindowsBrowserPath(): string {
  const candidates = [
    process.env.PUPPETEER_EXECUTABLE_PATH,
    process.env.PROGRAMFILES && path.join(process.env.PROGRAMFILES, "Microsoft", "Edge", "Application", "msedge.exe"),
    process.env["PROGRAMFILES(X86)"] && path.join(process.env["PROGRAMFILES(X86)"], "Microsoft", "Edge", "Application", "msedge.exe"),
    process.env.PROGRAMFILES && path.join(process.env.PROGRAMFILES, "Google", "Chrome", "Application", "chrome.exe"),
    process.env["PROGRAMFILES(X86)"] && path.join(process.env["PROGRAMFILES(X86)"], "Google", "Chrome", "Application", "chrome.exe"),
    process.env.LOCALAPPDATA && path.join(process.env.LOCALAPPDATA, "Microsoft", "Edge", "Application", "msedge.exe"),
    process.env.LOCALAPPDATA && path.join(process.env.LOCALAPPDATA, "Google", "Chrome", "Application", "chrome.exe"),
  ];
  const browserPath = candidates.find((candidate) => candidate && existsSync(candidate));
  if (!browserPath) {
    throw new Error("No se encontró Chrome o Edge para generar el PDF.");
  }
  return browserPath;
}

export async function POST(request: Request) {
  const contentLength = Number(request.headers.get("content-length") || 0);
  if (contentLength > 1_000_000) {
    return Response.json({ error: "El contenido del CV excede el tamaño permitido." }, { status: 413 });
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return Response.json({ error: "La solicitud no contiene JSON válido." }, { status: 400 });
  }

  if (!isRecord(payload) || !isCv(payload.cv)) {
    return Response.json({ error: "Los datos del CV no tienen un formato válido." }, { status: 400 });
  }

  let browser: Awaited<ReturnType<typeof puppeteer.launch>> | undefined;
  try {
    browser =
      process.platform === "win32"
        ? await puppeteer.launch({
            executablePath: getWindowsBrowserPath(),
            headless: true,
            args: ["--no-sandbox", "--disable-setuid-sandbox"],
          })
        : await puppeteer.launch({
            args: chromium.args,
            executablePath: await chromium.executablePath(),
            headless: true,
          });

    const page = await browser.newPage();
    const markup = renderHarvardHtml(payload.cv);
    await page.setContent(
      `<!doctype html><html lang="es"><head><meta charset="utf-8"><style>` +
        `@page{size:A4;margin:15mm 17mm}` +
        `html,body{margin:0;padding:0;background:#fff;height:auto;overflow:visible}` +
        HARVARD_CSS +
        `.cv{padding:0!important;width:auto!important;min-height:0!important}` +
        `</style></head><body><div class="cv">${markup}</div></body></html>`,
      { waitUntil: "load" }
    );
    const pdf = await page.pdf({
      format: "A4",
      printBackground: true,
      preferCSSPageSize: true,
      margin: { top: "15mm", right: "17mm", bottom: "15mm", left: "17mm" },
    });

    return new Response(Buffer.from(pdf), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${fileName(payload.cv)}"`,
        "Cache-Control": "private, no-store",
      },
    });
  } catch (error) {
    console.error("No se pudo generar el PDF del CV.", error);
    return Response.json(
      { error: "No se pudo generar el PDF. Verifica que Chrome o Edge esté instalado e inténtalo de nuevo." },
      { status: 500 }
    );
  } finally {
    await browser?.close();
  }
}
