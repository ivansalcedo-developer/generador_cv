import Link from "next/link";

export default function Home() {
  return (
    <main className="home">
      <h1>Crea un CV que los sistemas ATS lean bien</h1>
      <p>
        Formato Harvard de una columna, texto real en el PDF, verbos de acción por área y
        comparador con la oferta de trabajo.
      </p>
      <Link href="/editor" className="btn primary">
        Crear mi CV
      </Link>
    </main>
  );
}
