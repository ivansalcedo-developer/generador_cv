import type { Cv } from "@/types/cv";
import { runChecks } from "@/lib/checks";

export default function ChecksList({ cv }: { cv: Cv }) {
  return (
    <ul className="checklist">
      {runChecks(cv).map((c) => (
        <li key={c.text} className={c.ok ? "ok" : "no"}>
          <span className="ic">{c.ok ? "✓" : "!"}</span>
          <span>{c.text}</span>
        </li>
      ))}
    </ul>
  );
}
