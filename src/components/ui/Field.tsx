"use client";

import { useId } from "react";

type Props = {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: "text" | "email" | "tel";
  area?: boolean;
  rows?: number;
  placeholder?: string;
  hint?: string;
  full?: boolean;
  autoComplete?: string;
  onFocus?: () => void;
};

export default function Field({
  label, value, onChange, type = "text", area, rows = 4,
  placeholder, hint, full, autoComplete = "off", onFocus,
}: Props) {
  const id = useId();
  return (
    <div className={`field${full ? " full" : ""}`}>
      <label htmlFor={id}>{label}</label>
      {hint && <span className="hint">{hint}</span>}
      {area ? (
        <textarea
          id={id}
          rows={rows}
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
          onFocus={onFocus}
        />
      ) : (
        <input
          id={id}
          type={type}
          value={value}
          placeholder={placeholder}
          autoComplete={autoComplete}
          onChange={(e) => onChange(e.target.value)}
          onFocus={onFocus}
        />
      )}
    </div>
  );
}
