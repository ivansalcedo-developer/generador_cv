"use client";

import { useCallback, useEffect, useState } from "react";
import type { Basics, Cv, Education, Experience, TextKey } from "@/types/cv";
import { emptyCv, emptyEdu, emptyExp, normalizeCv } from "@/data/empty";
import { sampleCv } from "@/data/sample";
import { STEPS } from "@/lib/steps";

const KEY = "cv-generator:v2";
const clampStep = (n: number) => Math.max(0, Math.min(STEPS.length - 1, n));

export function useCv() {
  const [cv, setCv] = useState<Cv>(() => emptyCv(false));
  const [step, setStepState] = useState(0);
  const [ready, setReady] = useState(false);

  // Cargar lo guardado en el navegador (solo una vez, al abrir)
  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) {
        const d = JSON.parse(raw) as { cv?: Partial<Cv>; step?: number };
        if (d.cv) setCv(normalizeCv(d.cv));
        if (typeof d.step === "number") setStepState(clampStep(d.step));
      } else {
        setCv(emptyCv());
      }
    } catch {
      /* si el almacenamiento falla, se empieza vacío */
    }
    setReady(true);
  }, []);

  // Guardado automático
  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem(KEY, JSON.stringify({ cv, step }));
    } catch {
      /* ignorar */
    }
  }, [cv, step, ready]);

  const setStep = useCallback((n: number) => setStepState(clampStep(n)), []);

  const setB = useCallback(
    (k: keyof Basics, v: string) => setCv((c) => ({ ...c, b: { ...c.b, [k]: v } })),
    []
  );

  const setText = useCallback(
    (k: TextKey, v: string) => setCv((c) => ({ ...c, [k]: v })),
    []
  );

  const setSkills = useCallback(
    (skills: string[]) => setCv((c) => ({ ...c, skills })),
    []
  );

  const updateExp = useCallback(
    (id: string, p: Partial<Experience>) =>
      setCv((c) => ({ ...c, exp: c.exp.map((e) => (e.id === id ? { ...e, ...p } : e)) })),
    []
  );
  const addExp = useCallback(
    () => setCv((c) => ({ ...c, exp: [...c.exp, emptyExp()] })),
    []
  );
  const removeExp = useCallback(
    (id: string) => setCv((c) => ({ ...c, exp: c.exp.filter((e) => e.id !== id) })),
    []
  );

  const updateEdu = useCallback(
    (id: string, p: Partial<Education>) =>
      setCv((c) => ({ ...c, edu: c.edu.map((e) => (e.id === id ? { ...e, ...p } : e)) })),
    []
  );
  const addEdu = useCallback(
    () => setCv((c) => ({ ...c, edu: [...c.edu, emptyEdu()] })),
    []
  );
  const removeEdu = useCallback(
    (id: string) => setCv((c) => ({ ...c, edu: c.edu.filter((e) => e.id !== id) })),
    []
  );

  const replaceCv = useCallback((next: Cv) => setCv(normalizeCv(next)), []);
  const loadSample = useCallback(() => setCv(sampleCv()), []);
  const reset = useCallback(() => setCv(emptyCv()), []);

  return {
    cv, step, ready, setStep,
    setB, setText, setSkills,
    updateExp, addExp, removeExp,
    updateEdu, addEdu, removeEdu,
    replaceCv, loadSample, reset,
  };
}

export type CvApi = ReturnType<typeof useCv>;
