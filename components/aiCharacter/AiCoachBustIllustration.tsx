import Svg, { Ellipse, Path, Rect } from 'react-native-svg';

interface AiCoachBustIllustrationProps {
  state: 'idle' | 'speaking';
  width: number;
  height: number;
}

export function AiCoachBustIllustration({ state, width, height }: AiCoachBustIllustrationProps) {
  const isSpeaking = state === 'speaking';
  const suitDark = '#0c1f38';
  const suitMid = '#163a5f';
  const suitHighlight = '#1e4d7b';
  const shirt = '#f8fafc';
  const tie = isSpeaking ? '#60a5fa' : '#3b82f6';
  const tieDeep = isSpeaking ? '#2563eb' : '#1e40af';
  const lapelGlow = isSpeaking ? 'rgba(96, 165, 250, 0.4)' : 'rgba(59, 130, 246, 0.22)';

  return (
    <Svg width={width} height={height} viewBox="0 0 100 120" fill="none">
      <Ellipse cx="50" cy="118" rx="32" ry="4.5" fill="rgba(15, 23, 42, 0.5)" />

      {/* Col chemise — coupe nette sans tête */}
      <Path d="M34 22 C34 18 42 16 50 16 C58 16 66 18 66 22 L66 30 L34 30 Z" fill={shirt} />
      <Path d="M43 22 L50 31 L57 22 L53 19 L47 19 Z" fill={shirt} />

      {/* Cravate */}
      <Path d="M47 31 L53 31 L51.5 74 L48.5 74 Z" fill={tieDeep} />
      <Path d="M48 31 L52 31 L50.5 72 L49.5 72 Z" fill={tie} />

      {/* Veste — épaules et buste */}
      <Path
        d="M6 36 C6 26 22 20 50 20 C78 20 94 26 94 36 L94 120 L6 120 Z"
        fill={suitDark}
      />
      <Path d="M20 28 L50 38 L80 28 L74 120 L26 120 Z" fill={suitMid} />
      <Path d="M20 28 L50 38 L38 120 L26 120 Z" fill={suitHighlight} />
      <Path d="M80 28 L50 38 L62 120 L74 120 Z" fill={suitHighlight} />
      <Path d="M44 35 L50 40 L56 35 L54 120 L46 120 Z" fill={suitDark} />

      {/* Revers */}
      <Path d="M20 28 L50 38 L40 56 L26 46 Z" fill={lapelGlow} />
      <Path d="M80 28 L50 38 L60 56 L74 46 Z" fill={lapelGlow} />

      {/* Boutons */}
      <Rect x="47.5" y="50" width="5" height="5" rx="2.5" fill="#94a3b8" opacity={0.5} />
      <Rect x="47.5" y="62" width="5" height="5" rx="2.5" fill="#94a3b8" opacity={0.4} />
      <Rect x="47.5" y="74" width="5" height="5" rx="2.5" fill="#94a3b8" opacity={0.35} />

      {/* Poche */}
      <Path
        d="M62 68 H74 V70 C74 73 71 75 68 75 C65 75 62 73 62 70 Z"
        fill="rgba(255,255,255,0.05)"
        stroke="rgba(255,255,255,0.08)"
        strokeWidth={0.6}
      />
    </Svg>
  );
}
