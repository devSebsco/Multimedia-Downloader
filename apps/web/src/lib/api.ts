import type { MediaInfo, DownloadRequest } from '../types/media';

const BASE = import.meta.env.PUBLIC_API_URL ?? '';

export class ApiError extends Error {
  code: string;
  constructor(code: string, message: string) {
    super(message);
    this.name = 'ApiError';
    this.code = code;
  }
}

const SPANISH_ERRORS: Record<string, string> = {
  INVALID_URL: 'URL inválida. Verifica el enlace e intenta de nuevo.',
  UNSUPPORTED_PLATFORM: 'Plataforma no soportada. Prueba con YouTube, TikTok, Instagram u otras.',
  PRIVATE_CONTENT: 'Este contenido es privado o requiere inicio de sesión.',
  GEO_RESTRICTED: 'Este contenido no está disponible en esta región.',
  DOWNLOAD_FAILED: 'No se pudo descargar el contenido. Intenta de nuevo.',
  CONVERSION_FAILED: 'Error al convertir el archivo. Intenta con otro formato.',
  RATE_LIMIT: 'Demasiadas solicitudes. Espera un momento e intenta de nuevo.',
  BACKEND_DOWN: 'El servicio no está disponible en este momento. Intenta de nuevo más tarde.',
};

export async function analyzeUrl(url: string): Promise<MediaInfo> {
  const res = await fetch(`${BASE}/analyze`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ url }),
  });

  const data = await res.json();

  if (!res.ok || !data.success) {
    const code = data?.error?.code as string;
    const msg = SPANISH_ERRORS[code] ?? (data?.error?.message ?? 'Error al analizar el enlace.');
    throw new ApiError(code, msg);
  }

  return data.data as MediaInfo;
}

export function triggerDownload(blob: Blob, filename: string): void {
  const objectUrl = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = objectUrl;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(objectUrl);
}

export async function downloadFile(
  params: DownloadRequest,
  signal?: AbortSignal
): Promise<{ filename: string; size: number; blob: Blob }> {
  const res = await fetch(`${BASE}/download`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
    signal,
  });

  if (!res.ok) {
    let message = 'Error al descargar el archivo.';
    let code = '';
    try {
      const err = await res.json();
      code = err?.error?.code as string;
      message = SPANISH_ERRORS[code] ?? (err?.error?.message ?? message);
    } catch {
      // ignore parse error
    }
    throw new ApiError(code, message);
  }

  const disposition = res.headers.get('Content-Disposition') ?? '';
  const match = disposition.match(/filename[^;=\n]*=\s*["']?([^"';\n]+)["']?/);
  const filename = match?.[1] ?? `download.${params.format}`;

  const blob = await res.blob();
  return { filename, size: blob.size, blob };
}
