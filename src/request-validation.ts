export type Mode = 'traducir_estandar' | 'traducir' | 'traducir_profesional' | 'traducir_coloquial' | 'resumir' | 'traducir_resumir';
export type SummaryLevel = 'breve' | 'normal' | 'detallado';
export type ExtraTool = 'keywords' | 'sentiment' | 'entities' | 'appbuilder';

export interface ProcessInput {
  texto: string;
  origen: string;
  destino: string;
  modo: Mode;
  nivelResumen: SummaryLevel;
}

export interface ExtrasInput {
  texto: string;
  herramienta: ExtraTool;
}

type Validation<T> = { ok: true; value: T } | { ok: false; error: string };
const MAX_TEXT_LENGTH = 20_000;
const modes: readonly string[] = ['traducir_estandar', 'traducir', 'traducir_profesional', 'traducir_coloquial', 'resumir', 'traducir_resumir'];
const levels: readonly string[] = ['breve', 'normal', 'detallado'];
const tools: readonly string[] = ['keywords', 'sentiment', 'entities', 'appbuilder'];
const languagePattern = /^[A-Za-z]{2,3}(?:-[A-Za-z0-9]{2,8}){0,3}$/;

function asRecord(value: unknown): Record<string, unknown> | null {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
    ? value as Record<string, unknown>
    : null;
}

function getText(raw: Record<string, unknown>): Validation<string> {
  if (typeof raw.texto !== 'string' || !raw.texto.trim()) {
    return { ok: false, error: 'El texto debe ser una cadena no vacía' };
  }
  if (raw.texto.length > MAX_TEXT_LENGTH) {
    return { ok: false, error: 'El texto supera el límite de 20000 caracteres' };
  }
  return { ok: true, value: raw.texto };
}

export function validateProcessInput(body: unknown): Validation<ProcessInput> {
  const raw = asRecord(body);
  if (!raw) return { ok: false, error: 'Se requiere un objeto JSON' };
  const text = getText(raw);
  if (!text.ok) return text;
  const origen = raw.origen === undefined ? 'auto' : raw.origen;
  const destino = raw.destino === undefined ? 'es' : raw.destino;
  const modo = raw.modo === undefined ? 'traducir_resumir' : raw.modo;
  const nivelResumen = raw.nivelResumen === undefined ? 'normal' : raw.nivelResumen;
  if (typeof origen !== 'string' || (origen !== 'auto' && !languagePattern.test(origen))) {
    return { ok: false, error: 'Idioma de origen no válido' };
  }
  if (typeof destino !== 'string' || !languagePattern.test(destino)) {
    return { ok: false, error: 'Idioma de destino no válido' };
  }
  if (typeof modo !== 'string' || !modes.includes(modo)) {
    return { ok: false, error: 'Modo de procesamiento no válido' };
  }
  if (typeof nivelResumen !== 'string' || !levels.includes(nivelResumen)) {
    return { ok: false, error: 'Nivel de resumen no válido' };
  }
  return {
    ok: true,
    value: { texto: text.value, origen, destino, modo: modo as Mode, nivelResumen: nivelResumen as SummaryLevel },
  };
}

export function validateExtrasInput(body: unknown): Validation<ExtrasInput> {
  const raw = asRecord(body);
  if (!raw) return { ok: false, error: 'Se requiere un objeto JSON' };
  const text = getText(raw);
  if (!text.ok) return text;
  if (typeof raw.herramienta !== 'string' || !tools.includes(raw.herramienta)) {
    return { ok: false, error: 'Herramienta no válida' };
  }
  return { ok: true, value: { texto: text.value, herramienta: raw.herramienta as ExtraTool } };
}
