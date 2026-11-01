import Link from "next/link";

export default function Home() {
  return (
    <main className="home">
      <h1>Crea un CV que los sistemas ATS lean bien</h1>
      <p>
        Formato Harvard de una columna, texto real en el PDF, verbos de acción por área y
        comparador con la oferta de trabajo.
      </p>
      <div className="home-actions">
        <Link href="/editor" className="btn primary">
          Crear CV manual
        </Link>
        <Link href="/importar-ats" className="btn primary">
          Importar desde ATS
        </Link>
        <a
          href="https://www.zerogpt.com/"
          className="btn primary"
          target="_blank"
          rel="noopener noreferrer"
        >
          Ortografía
        </a>
      </div>
    </main>
  );
}
