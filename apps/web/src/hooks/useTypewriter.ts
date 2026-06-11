import { useState, useEffect, useRef } from 'react';

const WORDS = ['AUDIOS.', 'VIDEOS.'];
const TYPE_SPEED  = 80;
const ERASE_SPEED = 50;
const HOLD_MS     = 3000;
const PAUSE_MS    = 1000;

type Phase = 'hold' | 'erase' | 'type';

export function useTypewriter(): string {
  const [text, setText] = useState('AUDIOS.');
  const wordIdx = useRef(0);
  const [phase, setPhase] = useState<Phase>('hold');

  useEffect(() => {
    if (phase === 'hold') {
      const t = setTimeout(() => setPhase('erase'), HOLD_MS);
      return () => clearTimeout(t);
    }

    if (phase === 'erase') {
      if (text.length > 0) {
        const t = setTimeout(() => setText(text.slice(0, -1)), ERASE_SPEED);
        return () => clearTimeout(t);
      } else {
        wordIdx.current = (wordIdx.current + 1) % WORDS.length;
        const t = setTimeout(() => setPhase('type'), PAUSE_MS);
        return () => clearTimeout(t);
      }
    }

    if (phase === 'type') {
      const word = WORDS[wordIdx.current];
      if (text.length < word.length) {
        const t = setTimeout(() => setText(word.slice(0, text.length + 1)), TYPE_SPEED);
        return () => clearTimeout(t);
      } else {
        setPhase('hold');
      }
    }
  }, [phase, text]);

  return text;
}
