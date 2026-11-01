import { norm } from "./text";

const STOP = new Set(
  "de la que el en y a los del se las por un para con no una su al lo como más pero sus le ya o este sí porque esta entre cuando muy sin sobre también me hasta hay donde quien desde todo nos durante todos uno les ni contra otros ese eso ante ellos e esto antes algunos qué unos yo otro otras otra él tanto esa estos mucho nada muchos cual poco ella estar estas algunas algo mi mis tú te ti tu tus ser son es será tener tiene tienen buscamos requisitos ofrecemos empresa postula postular puesto cargo deseable años año persona personas nivel funciones oferta laboral"
    .split(" ")
    .map(norm)
);

export type Keyword = { n: string; w: string };

export function offerKeywords(txt: string): Keyword[] {
  const re = /[A-Za-zÁÉÍÓÚÜÑáéíóúüñ0-9+#]{3,}/g;
  const count: Record<string, number> = {};
  const orig: Record<string, string> = {};
  const order: string[] = [];
  for (const m of txt.matchAll(re)) {
    const n = norm(m[0]);
    if (STOP.has(n) || /^\d+$/.test(n)) continue;
    if (!count[n]) {
      count[n] = 0;
      orig[n] = m[0];
      order.push(n);
    }
    count[n]++;
  }
  const pos = new Map(order.map((n, i) => [n, i] as const));
  order.sort((a, b) => count[b] - count[a] || (pos.get(a) ?? 0) - (pos.get(b) ?? 0));
  return order.slice(0, 15).map((n) => ({ n, w: orig[n] }));
}

export function matchKeywords(offer: string, cvText: string) {
  const kws = offerKeywords(offer);
  const cv = norm(cvText);
  return {
    total: kws.length,
    have: kws.filter((k) => cv.includes(k.n)),
    miss: kws.filter((k) => !cv.includes(k.n)),
  };
}
