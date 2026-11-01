import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Importar desde ATS",
};

export default function ImportFromAtsPage() {
  return (
    <main className="development">
      <h1>Importar desde ATS</h1>
      <p>Esta opción está en desarrollo. Pronto podrás importar tu CV desde un sistema ATS.</p>
      <Link href="/" className="btn primary">
        Volver al inicio
      </Link>
    </main>
  );
}
