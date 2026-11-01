export type Basics = {
  nombre: string;
  apellidos: string;
  cargo: string;
  email: string;
  telefono: string;
  ciudad: string;
  pais: string;
  linkedin: string;
};

export type Experience = {
  id: string;
  empresa: string;
  puesto: string;
  lugar: string;
  desde: string;
  hasta: string;
  actual: boolean;
  desc: string;
  logros: string;
};

export type Education = {
  id: string;
  centro: string;
  titulo: string;
  desde: string;
  hasta: string;
  detalle: string;
};

export type Cv = {
  b: Basics;
  exp: Experience[];
  edu: Education[];
  cursos: string;
  herr: string;
  skills: string[];
  pers: string;
  resumen: string;
  oferta: string;
  area: string;
};

/** Campos de texto simples de nivel superior */
export type TextKey = "cursos" | "herr" | "pers" | "resumen" | "oferta" | "area";
