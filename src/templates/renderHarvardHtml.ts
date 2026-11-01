import type { Cv } from "@/types/cv";
import { contactParts, eduList, expList, fullName, period } from "@/lib/cvToText";
import { lines } from "@/lib/text";

const escapeHtml = (value: string) =>
  value.replace(/[&<>"']/g, (character) => {
    switch (character) {
      case "&": return "&amp;";
      case "<": return "&lt;";
      case ">": return "&gt;";
      case '"': return "&quot;";
      default: return "&#39;";
    }
  });

const bullets = (items: string[]) =>
  items.length ? `<ul>${items.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>` : "";

export function renderHarvardHtml(cv: Cv): string {
  const name = fullName(cv);
  const contacts = contactParts(cv);
  const experiences = expList(cv);
  const education = eduList(cv);
  const sections: string[] = [
    `<div class="name">${name ? escapeHtml(name) : '<span class="ph">Nombre Apellidos</span>'}</div>`,
  ];

  if (cv.b.cargo) sections.push(`<div class="role">${escapeHtml(cv.b.cargo)}</div>`);
  sections.push(
    `<div class="contact">${
      contacts.length
        ? contacts.map((contact, index) =>
            `${index ? " | " : ""}${contact.label ? `<b>${escapeHtml(contact.label)}: </b>` : ""}${escapeHtml(contact.value)}`
          ).join("")
        : '<span class="ph">Cel: | Email: | Ciudad | LinkedIn:</span>'
    }</div>`
  );

  if (cv.resumen.trim()) {
    sections.push(`<h2>Perfil profesional</h2><p>${escapeHtml(cv.resumen.trim())}</p>`);
  }
  if (experiences.length) {
    sections.push("<h2>Experiencia profesional</h2>");
    for (const experience of experiences) {
      const experiencePeriod = period(experience);
      const achievements = lines(experience.logros);
      sections.push(
        `<div class="entry"><div class="org">${escapeHtml(experience.empresa || "Empresa")}</div>` +
          `<div class="pos"><span class="t">${escapeHtml(experience.puesto || "Puesto")}</span>` +
          `${experiencePeriod ? ` | ${escapeHtml(experiencePeriod)}` : ""}` +
          `${experience.lugar ? ` | ${escapeHtml(experience.lugar)}` : ""}</div>` +
          `${bullets(lines(experience.desc))}` +
          `${achievements.length ? `<div class="lg">Logros:</div>${bullets(achievements)}` : ""}</div>`
      );
    }
  }
  if (education.length) {
    sections.push("<h2>Formación académica</h2>");
    for (const item of education) {
      const dates = [item.desde, item.hasta].filter(Boolean).join(" – ");
      sections.push(
        `<div class="entry"><div class="org">${escapeHtml(item.centro || "Institución")}</div>` +
          `${item.titulo ? `<div class="pos">${escapeHtml(item.titulo)}</div>` : ""}` +
          `${dates ? `<div class="pos">${escapeHtml(dates)}</div>` : ""}` +
          `${bullets(lines(item.detalle))}</div>`
      );
    }
  }

  const addBulletSection = (title: string, items: string[]) => {
    if (items.length) sections.push(`<h2>${title}</h2>${bullets(items)}`);
  };
  addBulletSection("Cursos y certificaciones", lines(cv.cursos));
  addBulletSection("Herramientas informáticas e idiomas", lines(cv.herr));
  addBulletSection("Competencias técnicas", cv.skills);
  const personalSkills = lines(cv.pers);
  if (personalSkills.length) {
    addBulletSection("Competencias personales", [personalSkills.join(" | ")]);
  }

  return sections.join("");
}
