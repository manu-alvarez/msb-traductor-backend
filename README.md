# API de traducción y resumen

Servicio Express en TypeScript. Extrae texto de documentos y utiliza la API de Groq para traducir, resumir o analizar el texto recibido.

## Arranque local

Ejecuta `npm ci`, copia [.env.example](.env.example) a `.env` y asigna tu clave de Groq a `GROQ_API_KEY`. Arranca el servidor con `npm run dev`. El puerto predeterminado es 3001. Para ejecutar la versión compilada utiliza `npm run build` y después `npm start`.

| Ruta POST | Entrada | Uso |
| --- | --- | --- |
| [/api/extract-text](src/routes/documents.ts) | Formulario multipart con el campo `file` (hasta 10 MiB) | Extrae texto de PDF, DOCX o texto UTF-8. |
| [/api/process](src/routes/process.ts) | JSON con `texto` y, opcionalmente, `origen`, `destino`, `modo` y `nivelResumen` | Por defecto detecta el idioma, traduce al español y resume. |
| [/api/extras](src/routes/extras.ts) | JSON con `texto` y `herramienta` | Aplica un análisis adicional, como extracción de palabras clave. |

La extracción procesa el archivo en memoria. Las rutas de traducción y análisis envían el texto a Groq. La clave se configura en el servidor.
