# LINKFETCH

**Descarga videos y audios desde múltiples plataformas en segundos.**

Pega un enlace, elige el formato y descarga. Sin registro, sin límites, sin almacenamiento de datos.

---

## Vista previa de la página web

<table>
  <tr>
    <td align="center"><b>Modo oscuro — Español</b></td>
    <td align="center"><b>Modo claro — Español</b></td>
  </tr>
  <tr>
    <td><img src=".github/screenshots/dark-es.png" alt="Modo oscuro en español" width="100%"/></td>
    <td><img src=".github/screenshots/light-es.png" alt="Modo claro en español" width="100%"/></td>
  </tr>
  <tr>
    <td align="center"><b>Modo oscuro — English</b></td>
    <td align="center"><b>Modo claro — English</b></td>
  </tr>
  <tr>
    <td><img src=".github/screenshots/dark-en.png" alt="Dark mode in English" width="100%"/></td>
    <td><img src=".github/screenshots/light-en.png" alt="Light mode in English" width="100%"/></td>
  </tr>
</table>

---

## Tecnologías Utilizadas

### Frontend
![Astro](https://img.shields.io/badge/Astro-FF5D01?style=flat&logo=astro&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=flat&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=flat&logo=tailwindcss&logoColor=white)
![Framer Motion](https://img.shields.io/badge/Framer_Motion-0055FF?style=flat&logo=framer&logoColor=white)

### Backend
![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat&logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?style=flat&logo=express&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat&logo=typescript&logoColor=white)

### Procesamiento multimedia
![yt-dlp](https://img.shields.io/badge/yt--dlp-FF0000?style=flat&logo=youtube&logoColor=white)
![FFmpeg](https://img.shields.io/badge/FFmpeg-007808?style=flat&logo=ffmpeg&logoColor=white)

### Seguridad y validación
![Zod](https://img.shields.io/badge/Zod-3E67B1?style=flat&logo=zod&logoColor=white)
![Helmet](https://img.shields.io/badge/Helmet-000000?style=flat)
![Rate Limit](https://img.shields.io/badge/Rate_Limit-FF6B6B?style=flat)

### Deploy
![Vercel](https://img.shields.io/badge/Vercel-000000?style=flat&logo=vercel&logoColor=white)
![Render](https://img.shields.io/badge/Render-46E3B7?style=flat&logo=render&logoColor=white)

---

## Características

- **Análisis de contenido** — Detecta automáticamente si el enlace es un video o audio
- **Múltiples formatos** — Descarga en `MP4`, `WEBM`, `MP3` o `WAV`
- **Selección de calidad** — Elige la resolución o bitrate disponible (1080p, 720p, 480p...)
- **6 plataformas soportadas** — YouTube, TikTok, Instagram, X (Twitter), Facebook, SoundCloud
- **Modo oscuro / claro** — Se puede alternar entre los dos temas
- **Bilingüe** — Interfaz disponible en español e inglés
- **Diseño responsive** — Adaptado para móvil, tablet y escritorio
- **Sin almacenamiento** — Los archivos se eliminan del servidor tras la descarga

---

## ¿Cómo funciona?

```
1. Pega el enlace del video o audio en el campo de entrada
2. Haz clic en ANALIZAR
3. Revisa la información del contenido detectado
4. Elige si descargar video o solo el audio
5. Selecciona el formato y la calidad
6. Haz clic en DESCARGAR — el archivo se descarga directamente
```

El frontend envía el enlace al backend, que utiliza **yt-dlp** para extraer la metadata y gestionar la descarga. Si se requiere conversión de formato, **FFmpeg** procesa el archivo antes de enviarlo al cliente. El archivo temporal se elimina del servidor automáticamente al finalizar.

---

## Plataformas soportadas

| Plataforma | Video | Audio |
|------------|-------|-------|
| YouTube | ☑ | ☑ |
| TikTok | ☑ | ☑ |
| Instagram | ☑ | ☑ |
| X (Twitter) | ☑ | ☑ |
| Facebook | ☑ | ☑ |
| SoundCloud | ☒  | ☑ |

---