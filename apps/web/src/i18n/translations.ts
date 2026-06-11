export type Lang = 'es' | 'en';

export const translations = {
  es: {
    langToggleLabel: 'Switch to English',
    langCode: 'ES',
    langToggleTooltip: 'Cambiar idioma a Inglés',
    themeLightTooltip: 'Activar modo claro',
    themeDarkTooltip: 'Activar modo oscuro',

    heroStaticTitle: 'DESCARGA TUS',
    heroSubtitle: 'RÁPIDO, SIMPLE Y SIN LÍMITES.',
    heroPrivacy: 'No se almacenará tu información ni los videos que descargues.',
    heroPlaceholder: 'Pega aquí el enlace del video o audio...',
    heroPlaceholderMobile: 'Pega el enlace...',
    analyzeBtn: 'ANALIZAR',
    analyzingBtn: 'ANALIZANDO',

    analyzing: 'Analizando enlace...',
    retryBtn: 'INTENTAR DE NUEVO',

    errorInvalidUrl: 'URL inválida. Verifica el enlace e intenta de nuevo.',
    errorUnsupported: 'Plataforma no soportada. Prueba con YouTube, TikTok, Instagram u otras.',
    errorPrivate: 'Este contenido es privado o requiere inicio de sesión.',
    errorGeo: 'Este contenido no está disponible en esta región.',
    errorDownload: 'No se pudo descargar el contenido. Intenta de nuevo.',
    errorConversion: 'Error al convertir el archivo. Intenta con otro formato.',
    errorRateLimit: 'Demasiadas solicitudes. Espera un momento e intenta de nuevo.',
    errorUnknown: 'Error desconocido. Intenta de nuevo.',

    downloadVideoBtn: 'DESCARGAR VIDEO',
    downloadAudioOnlyBtn: 'DESCARGAR SOLO AUDIO',
    downloadAudioBtn: 'DESCARGAR AUDIO',
    newSearchBtn: '⟳ NUEVA BÚSQUEDA',
    badgeVideo: 'VIDEO',
    badgeAudio: 'AUDIO',

    modalTitleVideo: 'DESCARGAR VIDEO',
    modalTitleAudio: 'DESCARGAR AUDIO',
    formatLabel: 'FORMATO',
    qualityLabel: 'CALIDAD',
    confirmDownloadBtn: 'DESCARGAR',
    downloading: 'DESCARGANDO...',
    cancelDownload: 'CANCELAR DESCARGA',
    activeDownloads: 'DESCARGAS ACTIVAS',
    completed: 'COMPLETADO',
    cancelled: 'CANCELADO',

    platformsTitle: 'PLATAFORMAS SOPORTADAS',
    platformsSubtitle: 'Descarga videos y audios desde tus plataformas favoritas.',

    footerRights: '© 2026 Sebastian Pinzón. Todos los derechos reservados.',
  },

  en: {
    langToggleLabel: 'Cambiar a Español',
    langCode: 'EN',
    langToggleTooltip: 'Switch to Spanish',
    themeLightTooltip: 'Switch to light mode',
    themeDarkTooltip: 'Switch to dark mode',

    heroStaticTitle: 'DOWNLOAD YOUR',
    heroSubtitle: 'FAST, SIMPLE AND LIMITLESS.',
    heroPrivacy: "Your information or the videos you download will not be stored.",
    heroPlaceholder: 'Paste the video or audio link here...',
    heroPlaceholderMobile: 'Paste the link...',
    analyzeBtn: 'ANALYZE',
    analyzingBtn: 'ANALYZING',

    analyzing: 'Analyzing link...',
    retryBtn: 'TRY AGAIN',

    errorInvalidUrl: 'Invalid URL. Check the link and try again.',
    errorUnsupported: 'Platform not supported. Try YouTube, TikTok, Instagram or others.',
    errorPrivate: 'This content is private or requires login.',
    errorGeo: 'This content is not available in this region.',
    errorDownload: 'Could not download the content. Try again.',
    errorConversion: 'File conversion error. Try a different format.',
    errorRateLimit: 'Too many requests. Wait a moment and try again.',
    errorUnknown: 'Unknown error. Please try again.',

    downloadVideoBtn: 'DOWNLOAD VIDEO',
    downloadAudioOnlyBtn: 'DOWNLOAD AUDIO ONLY',
    downloadAudioBtn: 'DOWNLOAD AUDIO',
    newSearchBtn: '⟳ NEW SEARCH',
    badgeVideo: 'VIDEO',
    badgeAudio: 'AUDIO',

    modalTitleVideo: 'DOWNLOAD VIDEO',
    modalTitleAudio: 'DOWNLOAD AUDIO',
    formatLabel: 'FORMAT',
    qualityLabel: 'QUALITY',
    confirmDownloadBtn: 'DOWNLOAD',
    downloading: 'DOWNLOADING...',
    cancelDownload: 'CANCEL DOWNLOAD',
    activeDownloads: 'ACTIVE DOWNLOADS',
    completed: 'COMPLETED',
    cancelled: 'CANCELLED',

    platformsTitle: 'SUPPORTED PLATFORMS',
    platformsSubtitle: 'Download videos and audios from your favorite platforms.',

    footerRights: '© 2026 Sebastian Pinzón. All rights reserved.',
  },
} as const;

export type TranslationKey = keyof typeof translations.es;
