import { useTypewriter } from '../hooks/useTypewriter';

export default function TypewriterWord() {
  const word = useTypewriter();
  return <span>{word}</span>;
}
