#!/bin/bash
set -e

echo "[install] Installing yt-dlp..."

# Method 1: pip via python3
if command -v python3 &>/dev/null; then
  echo "[install] Trying: python3 -m pip install yt-dlp"
  python3 -m pip install yt-dlp && INSTALLED=1
fi

# Method 2: pip directly
if [ -z "$INSTALLED" ] && command -v pip &>/dev/null; then
  echo "[install] Trying: pip install yt-dlp"
  pip install yt-dlp && INSTALLED=1
fi

# Method 3: curl binary to bin/
if [ -z "$INSTALLED" ]; then
  echo "[install] Trying: download binary to bin/yt-dlp"
  mkdir -p bin
  curl -sL https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp -o bin/yt-dlp
  chmod +x bin/yt-dlp
  INSTALLED=1
fi

echo "[install] Verifying..."
if command -v yt-dlp &>/dev/null; then
  echo "[install] yt-dlp found at $(command -v yt-dlp): $(yt-dlp --version)"
elif [ -f bin/yt-dlp ]; then
  echo "[install] yt-dlp at ./bin/yt-dlp: $(./bin/yt-dlp --version)"
elif [ -f /usr/local/bin/yt-dlp ]; then
  echo "[install] yt-dlp at /usr/local/bin/yt-dlp: $(/usr/local/bin/yt-dlp --version)"
else
  echo "[install] WARNING: yt-dlp not found in PATH. Set YTDLP_PATH manually."
  echo "[install] Common locations checked: /usr/local/bin, /usr/bin, ./bin"
fi
