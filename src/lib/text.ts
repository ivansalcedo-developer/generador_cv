/** Minúsculas y sin acentos, para comparar texto */
export function norm(t: string): string {
  return String(t ?? "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

/** Convierte un bloque de texto en líneas limpias (sin viñetas ni vacías) */
export function lines(t: string): string[] {
  return String(t || "")
    .split(/\n+/)
    .map((x) => x.replace(/^[\s\-•*]+/, "").trim())
    .filter(Boolean);
}
