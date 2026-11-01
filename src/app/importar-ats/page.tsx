import type { Metadata } from "next";
import ImportAtsEditor from "./ImportAtsEditor";

export const metadata: Metadata = {
  title: "Importar desde ATS",
};

export default function ImportFromAtsPage() {
  return <ImportAtsEditor />;
}
