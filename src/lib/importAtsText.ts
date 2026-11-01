import { emptyCv } from "@/data/empty";
import type { Cv, Education, Experience } from "@/types/cv";

type Section =
  | "header"
  | "summary"
  | "experience"
  | "education"
  | "courses"
  | "tools"
  | "skills"
  | "personal"
  | "other";

const normalize = (value: string) =>
  value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9 ]/g, " ").trim();

function getSection(line: string): Section | null {
  const heading = normalize(line).replace(/\s+/g, " ");
  if (/^(perfil profesional|resumen profesional|resumen|sobre mi|objetivo profesional|professional summary|summary|objective)$/.test(heading)) return "summary";
  if (/^(experiencia|experiencia laboral|experiencia profesional|historial laboral|work experience|professional experience|employment history)$/.test(heading)) return "experience";
  if (/^(educacion|formacion academica|estudios|education|academic background)$/.test(heading)) return "education";
  if (/^(cursos|certificaciones|cursos y certificaciones|certifications|courses)$/.test(heading)) return "courses";
  if (/^(herramientas|idiomas|herramientas e idiomas|software|languages|tools)$/.test(heading)) return "tools";
  if (/^(habilidades|competencias|competencias tecnicas|habilidades tecnicas|skills|technical skills|competencies)$/.test(heading)) return "skills";
  if (/^(competencias personales|habilidades blandas|soft skills)$/.test(heading)) return "personal";
  return null;
}

function cleanLine(line: string) {
  return line.trim().replace(/^(?:[-*•▪◦‣]|\d+[.)])\s*/, "");
}

function splitBlocks(lines: string[]) {
  const blocks: string[][] = [];
  let current: string[] = [];
  for (const rawLine of lines) {
    const line = cleanLine(rawLine);
    if (!line) {
      if (current.length) blocks.push(current);
      current = [];
      continue;
    }
    current.push(line);
  }
  if (current.length) blocks.push(current);
  return blocks;
}

function extractDates(value: string) {
  const datePattern = /\b(?:\d{1,2}[/-]\d{2,4}|(?:ene|feb|mar|abr|may|jun|jul|ago|sep|oct|nov|dic)[a-z]*\.?\s+\d{4}|(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\.?\s+\d{4}|19\d{2}|20\d{2}|actualidad|presente|present|current)\b/gi;
  const dates = value.match(datePattern) ?? [];
  const remaining = value.replace(datePattern, "").replace(/\s*[-–—|,]\s*/g, " ").trim();
  return { dates, remaining };
}

function makeExperience(block: string[], index: number): Experience {
  const first = block[0] ?? "Experiencia";
  const secondHasDates = Boolean(block[1] && extractDates(block[1]).dates.length);
  const headerLines = block.slice(0, secondHasDates ? 2 : 1);
  const { dates, remaining } = extractDates(headerLines.join(" | "));
  const parts = remaining.split(/\s+[|–—]\s+|\s+-\s+|,\s+/).filter(Boolean);
  const description = block.slice(headerLines.length).map(cleanLine).filter(Boolean);
  const current = dates.some((date) => /actualidad|presente|present|current/i.test(date));
  const regularDates = dates.filter((date) => !/actualidad|presente|present|current/i.test(date));

  return {
    id: `ats-exp-${index + 1}`,
    empresa: parts[0] || first,
    puesto: parts.slice(1).join(" | "),
    lugar: "",
    desde: regularDates[0] ?? "",
    hasta: current ? "" : regularDates[1] ?? "",
    actual: current,
    desc: description.join("\n") || block.slice(1).join("\n"),
    logros: "",
  };
}

function makeEducation(block: string[], index: number): Education {
  const first = block[0] ?? "Formación";
  const secondHasDates = Boolean(block[1] && extractDates(block[1]).dates.length);
  const headerLines = block.slice(0, secondHasDates ? 2 : 1);
  const { dates, remaining } = extractDates(headerLines.join(" | "));
  const parts = remaining.split(/\s+[|–—]\s+|\s+-\s+|,\s+/).filter(Boolean);
  return {
    id: `ats-edu-${index + 1}`,
    centro: parts[0] || first,
    titulo: parts.slice(1).join(" | "),
    desde: dates[0] ?? "",
    hasta: dates[1] ?? "",
    detalle: block.slice(headerLines.length).join("\n"),
  };
}

export function importAtsText(text: string): Cv {
  const cv = emptyCv(false);
  const sections: Record<Section, string[]> = {
    header: [],
    summary: [],
    experience: [],
    education: [],
    courses: [],
    tools: [],
    skills: [],
    personal: [],
    other: [],
  };
  let active: Section = "header";

  for (const line of text.replace(/\r\n?/g, "\n").split("\n")) {
    const section = getSection(line);
    if (section) {
      active = section;
    } else {
      sections[active].push(line);
    }
  }

  const headerLines = sections.header.map(cleanLine).filter(Boolean);
  const email = text.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i)?.[0] ?? "";
  const phone = text.match(/(?:\+\d{1,3}[\s.-]?)?(?:\(?\d{2,4}\)?[\s.-]?)?\d[\d\s().-]{6,}\d/)?.[0]?.trim() ?? "";
  const linkedin = text.match(/(?:https?:\/\/)?(?:www\.)?linkedin\.com\/[^\s|,;]+/i)?.[0] ?? "";
  const nameLine = headerLines.find((line) => !/[@]|linkedin|telefono|tel[eé]fono|celular|phone|correo|email/i.test(line)) ?? "";

  if (nameLine) {
    const nameParts = nameLine.replace(/^(nombre|name)\s*:\s*/i, "").split(/\s+/);
    cv.b.nombre = nameParts.shift() ?? "";
    cv.b.apellidos = nameParts.join(" ");
  }
  cv.b.email = email;
  cv.b.telefono = phone;
  cv.b.linkedin = linkedin;

  const roleLine = headerLines.find((line) =>
    line !== nameLine && !line.includes("@") && !/linkedin|telefono|tel[eé]fono|celular|phone|correo|email/i.test(line)
  );
  if (roleLine) cv.b.cargo = roleLine.replace(/^(cargo|puesto|title|position)\s*:\s*/i, "");
  cv.area = cv.b.cargo;

  const summaryLines = sections.summary.map(cleanLine).filter(Boolean);
  if (summaryLines.length) {
    cv.resumen = summaryLines.join(" ");
  } else if (sections.other.length) {
    cv.resumen = sections.other.map(cleanLine).filter(Boolean).join("\n");
  }

  cv.exp = splitBlocks(sections.experience).map(makeExperience);
  cv.edu = splitBlocks(sections.education).map(makeEducation);
  cv.cursos = sections.courses.map(cleanLine).filter(Boolean).join("\n");
  cv.herr = sections.tools.map(cleanLine).filter(Boolean).join("\n");
  cv.skills = sections.skills.map(cleanLine).filter(Boolean);
  cv.pers = sections.personal.map(cleanLine).filter(Boolean).join("\n");
  return cv;
}
