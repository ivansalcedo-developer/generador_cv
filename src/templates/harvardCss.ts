/**
 * Estilos de la plantilla Harvard (una columna, solo texto).
 * Se usan en la vista previa y también dentro del documento que se imprime a PDF.
 */
export const HARVARD_CSS = `
.cv{font-family:Arial,Helvetica,sans-serif;font-size:14.25pt;line-height:1.4;color:#444;padding:48px 56px}
.cv .name{text-align:center;font-weight:700;font-size:13pt;color:#222;text-transform:uppercase;margin:0 0 4px}
.cv .role{text-align:center;color:#555;margin:0 0 4px}
.cv .contact{text-align:center;color:#555;font-size:10pt;line-height:1.5;margin:6px 0 22px}
.cv .contact b{color:#444}
.cv h2{font-size:11pt;font-weight:700;text-transform:uppercase;letter-spacing:0;color:#1a1a1a;border-bottom:1px solid #d0d0d0;padding-bottom:3px;margin:20px 0 8px}
.cv p{margin:0 0 6px;text-align:justify}
.cv .org{font-weight:700;text-transform:uppercase;color:#1a1a1a;margin-top:2px}
.cv .pos{color:#444}
.cv .pos .t{text-transform:uppercase}
.cv .lg{font-weight:700;color:#1a1a1a;margin-top:4px}
.cv ul{margin:3px 0 8px;padding-left:34px}
.cv li{margin-bottom:2px;text-align:justify}
.cv li::marker{color:#888}
.cv .entry{margin-bottom:12px}
.cv .ph{color:#9AA3AB}
.cv .entry,.cv li{break-inside:avoid}
.cv h2{break-after:avoid}
`;
