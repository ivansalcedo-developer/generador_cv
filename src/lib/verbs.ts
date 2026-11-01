import { norm } from "./text";

/** Verbos de acción por área (Guía CERTUS) */
export const VERBOS: Record<string, string[]> = {
  "Los más recomendados": ["Gestioné", "Lideré", "Implementé", "Coordiné", "Ejecuté", "Desarrollé", "Optimicé", "Analicé", "Supervisé", "Evalué", "Incrementé", "Reduje", "Logré", "Mejoré", "Diseñé"],
  "Reclutamiento y selección": ["Gestioné", "Ejecuté", "Coordiné", "Lideré", "Desarrollé", "Implementé"],
  Entrevistas: ["Realicé", "Conduje", "Apliqué", "Evalué", "Entrevisté", "Seleccioné"],
  "Evaluación de candidatos": ["Evalué", "Analicé", "Filtré", "Preseleccioné", "Validé", "Verifiqué"],
  Convocatorias: ["Publiqué", "Difundí", "Promoví", "Ejecuté", "Gestioné", "Coordiné"],
  "Recursos humanos": ["Gestioné", "Administré", "Coordiné", "Desarrollé", "Implementé", "Supervisé"],
  Administración: ["Gestioné", "Organicé", "Administré", "Coordiné", "Controlé", "Optimicé"],
  "Logística y operaciones": ["Gestioné", "Supervisé", "Coordiné", "Planifiqué", "Optimicé", "Controlé"],
  "Ventas y comercial": ["Incrementé", "Desarrollé", "Negocié", "Capté", "Fidelicé", "Impulsé"],
  "Atención al cliente": ["Atendí", "Gestioné", "Resolví", "Asesoré", "Orienté", "Fidelicé"],
  Liderazgo: ["Lideré", "Dirigí", "Supervisé", "Coordiné", "Desarrollé", "Delegué"],
  Proyectos: ["Lideré", "Planifiqué", "Implementé", "Ejecuté", "Coordiné", "Supervisé"],
  Finanzas: ["Analicé", "Gestioné", "Controlé", "Presupuesté", "Proyecté", "Optimicé"],
  Marketing: ["Diseñé", "Desarrollé", "Implementé", "Posicioné", "Analicé", "Ejecuté"],
  "Indicadores y reportes": ["Analicé", "Monitoreé", "Medí", "Consolidé", "Elaboré", "Reporté"],
  "Mejora de procesos": ["Optimicé", "Mejoré", "Implementé", "Reduje", "Estandaricé", "Automaticé"],
  "Tecnología y datos": ["Desarrollé", "Implementé", "Automaticé", "Analicé", "Programé", "Optimicé"],
  "Logros y resultados": ["Incrementé", "Reduje", "Mejoré", "Optimicé", "Logré", "Aumenté"],
};

export const AREAS = Object.keys(VERBOS);

/** Verbos adicionales que también cuentan como verbo de acción en la revisión */
const EXTRA = [
  "Registré", "Digité", "Recibí", "Audité", "Ordené", "Codifiqué", "Revisé",
  "Apoyé", "Participé", "Colaboré", "Digitalicé", "Utilicé", "Elaboré", "Redacté", "Capacité",
];

export const VSET: Set<string> = new Set(
  [...Object.values(VERBOS).flat(), ...EXTRA].map(norm)
);
