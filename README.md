# Generador de CV

Aplicación para crear CV compatibles con sistemas ATS, construida con Next.js. El código de la aplicación está en `src/`.

## Desarrollo

```bash
npm install
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000).

La página de inicio está en `src/app/page.tsx` y el editor en `src/app/editor/page.tsx`.
En `/importar-ats` puedes pegar el texto de un CV para crear una vista previa y descargarlo como PDF.
También puedes importar un PDF o una imagen con PaddleOCR o Scribe.js-ocr. PaddleOCR usa el servicio configurado en `.env.local`:

```env
PADDLEOCR_URL=http://127.0.0.1:8080/ocr
```

PaddleOCR admite PDF, JPG, PNG, TIFF y WEBP; Scribe.js-ocr admite PDF, JPG y PNG. El límite es de 20 MB. Scribe.js-ocr puede descargar los datos de idioma español e inglés en su primer uso.

## Producción

```bash
npm run build
npm start
```
