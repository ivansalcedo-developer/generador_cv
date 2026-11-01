type PrintOptions = { html: string; css: string; fileName: string };

const escapeHtml = (t: string) =>
  t.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c] as string));

/**
 * Genera el PDF imprimiendo un documento aparte que contiene solo el CV.
 * Así no influyen la altura, el encabezado ni los paneles de la página,
 * que eran la causa de que el PDF saliera cortado.
 */
export function printPdf({ html, css, fileName }: PrintOptions): void {
  const oldTitle = document.title;
  const name = fileName.replace(/\.pdf$/i, "");
  document.title = name;

  const frame = document.createElement("iframe");
  frame.setAttribute("aria-hidden", "true");
  frame.tabIndex = -1;
  frame.style.cssText =
    "position:fixed;left:-10000px;top:0;width:210mm;height:297mm;border:0";
  document.body.appendChild(frame);

  const win = frame.contentWindow;
  const doc = win?.document;
  if (!win || !doc) {
    document.title = oldTitle;
    frame.remove();
    window.print();
    return;
  }

  doc.open();
  doc.write(
    `<!DOCTYPE html><html lang="es"><head><meta charset="utf-8"><title>${escapeHtml(name)}</title><style>` +
      `@page{size:A4;margin:15mm 17mm}` +
      `html,body{margin:0;padding:0;background:#fff;height:auto;overflow:visible}` +
      css +
      `.cv{padding:0!important;width:auto!important;min-height:0!important}` +
      `</style></head><body>${html}</body></html>`
  );
  doc.close();

  let finished = false;
  const done = () => {
    if (finished) return;
    finished = true;
    document.title = oldTitle;
    setTimeout(() => frame.remove(), 500);
  };

  setTimeout(() => {
    try {
      win.focus();
      win.onafterprint = done;
      win.print();
      setTimeout(done, 60000);
    } catch {
      done();
      window.print();
    }
  }, 200);
}
