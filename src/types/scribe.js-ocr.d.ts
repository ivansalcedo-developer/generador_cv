declare module "scribe.js-ocr" {
  interface ScribeDocument {
    recognize(options: { langs: string[] }): Promise<void>;
    exportData(format: "txt"): Promise<string | ArrayBuffer>;
    close(): Promise<void>;
  }

  interface Scribe {
    openDocument(files: File[]): Promise<ScribeDocument>;
  }

  const scribe: Scribe;
  export default scribe;
}
