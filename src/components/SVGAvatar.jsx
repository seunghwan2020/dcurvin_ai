import { motion } from 'framer-motion'

const characters = {
  yujin: {
    skinTone: '#fde8d0',
    hairColor: '#2c1810',
    outfitColor: '#3b5998',
    outfitAccent: '#4a6fb5',
    accentColor: '#6b8cce',
  },
  taehyun: {
    skinTone: '#f5d6b8',
    hairColor: '#4a3728',
    outfitColor: '#e67e22',
    outfitAccent: '#f39c12',
    accentColor: '#f5b041',
  },
  seoyeon: {
    skinTone: '#fde8d8',
    hairColor: '#3d2314',
    outfitColor: '#e84393',
    outfitAccent: '#fd79a8',
    accentColor: '#fab1d0',
  },
  minjun: {
    skinTone: '#f5d6c0',
    hairColor: '#1a1a2e',
    outfitColor: '#6c5ce7',
    outfitAccent: '#a29bfe',
    accentColor: '#b8b0fe',
  },
  haeun: {
    skinTone: '#fde8d8',
    hairColor: '#2c1810',
    outfitColor: '#C4A661',
    outfitAccent: '#d4b96e',
    accentColor: '#e8d5a0',
  },
}

function YujinSVG({ size, expression }) {
  return (
    <svg width={size} height={size} viewBox="0 0 120 120" fill="none">
      {/* Outfit / Collar */}
      <path d="M35 95 L40 78 Q60 72 80 78 L85 95 Q60 100 35 95Z" fill="#3b5998" />
      <path d="M45 82 Q60 76 75 82 L73 78 Q60 74 47 78Z" fill="#4a6fb5" />
      {/* Neck */}
      <rect x="52" y="72" width="16" height="10" rx="4" fill="#fde8d0" />
      {/* Head */}
      <ellipse cx="60" cy="52" rx="26" ry="28" fill="#fde8d0" />
      {/* Blush */}
      <ellipse cx="42" cy="56" rx="5" ry="3" fill="#ffcccb" opacity="0.35" />
      <ellipse cx="78" cy="56" rx="5" ry="3" fill="#ffcccb" opacity="0.35" />
      {/* Eyes */}
      {expression === 'happy' ? (
        <>
          <path d="M47 50 Q50 46 53 50" stroke="#2c1810" strokeWidth="2.5" strokeLinecap="round" fill="none" />
          <path d="M67 50 Q70 46 73 50" stroke="#2c1810" strokeWidth="2.5" strokeLinecap="round" fill="none" />
        </>
      ) : (
        <>
          <ellipse cx="50" cy="50" rx="3.5" ry="4" fill="#2c1810" />
          <ellipse cx="70" cy="50" rx="3.5" ry="4" fill="#2c1810" />
          <circle cx="48.5" cy="48.5" r="1.2" fill="white" />
          <circle cx="68.5" cy="48.5" r="1.2" fill="white" />
        </>
      )}
      {/* Eyebrows */}
      <path d="M45 42 Q50 39 55 42" stroke="#2c1810" strokeWidth="1.8" strokeLinecap="round" fill="none" />
      <path d="M65 42 Q70 39 75 42" stroke="#2c1810" strokeWidth="1.8" strokeLinecap="round" fill="none" />
      {/* Nose */}
      <path d="M58 55 Q60 58 62 55" stroke="#d4a574" strokeWidth="1.2" strokeLinecap="round" fill="none" />
      {/* Mouth */}
      {expression === 'happy' ? (
        <path d="M53 60 Q60 66 67 60" stroke="#e17055" strokeWidth="1.8" strokeLinecap="round" fill="none" />
      ) : (
        <path d="M55 61 Q60 64 65 61" stroke="#e17055" strokeWidth="1.5" strokeLinecap="round" fill="none" />
      )}
      {/* Hair - short neat with side part */}
      <path d="M34 48 Q32 35 38 26 Q45 18 60 16 Q75 18 82 26 Q88 35 86 48 L84 42 Q82 30 72 24 Q60 20 48 24 Q38 30 36 42Z" fill="#2c1810" />
      <path d="M42 25 Q50 18 62 17" stroke="#3d2e1e" strokeWidth="1" strokeLinecap="round" fill="none" opacity="0.3" />
      {/* Glasses */}
      <rect x="42" y="45" width="14" height="11" rx="5" stroke="#64748b" strokeWidth="1.8" fill="none" />
      <rect x="64" y="45" width="14" height="11" rx="5" stroke="#64748b" strokeWidth="1.8" fill="none" />
      <line x1="56" y1="50" x2="64" y2="50" stroke="#64748b" strokeWidth="1.5" />
      <line x1="42" y1="50" x2="36" y2="48" stroke="#64748b" strokeWidth="1.2" />
      <line x1="78" y1="50" x2="84" y2="48" stroke="#64748b" strokeWidth="1.2" />
    </svg>
  )
}

function TaehyunSVG({ size, expression }) {
  return (
    <svg width={size} height={size} viewBox="0 0 120 120" fill="none">
      {/* Outfit */}
      <path d="M32 95 L38 76 Q60 70 82 76 L88 95 Q60 100 32 95Z" fill="#e67e22" />
      <path d="M42 80 Q60 74 78 80 L76 76 Q60 72 44 76Z" fill="#f39c12" />
      {/* Cargo pocket detail */}
      <rect x="40" y="84" width="10" height="7" rx="1.5" stroke="#d35400" strokeWidth="1" fill="none" opacity="0.5" />
      <rect x="70" y="84" width="10" height="7" rx="1.5" stroke="#d35400" strokeWidth="1" fill="none" opacity="0.5" />
      {/* Neck */}
      <rect x="52" y="70" width="16" height="10" rx="4" fill="#f5d6b8" />
      {/* Head */}
      <ellipse cx="60" cy="50" rx="25" ry="27" fill="#f5d6b8" />
      {/* Blush */}
      <ellipse cx="42" cy="54" rx="5" ry="3" fill="#ffcccb" opacity="0.3" />
      <ellipse cx="78" cy="54" rx="5" ry="3" fill="#ffcccb" opacity="0.3" />
      {/* Eyes */}
      {expression === 'happy' ? (
        <>
          <path d="M47 48 Q50 44 53 48" stroke="#2c1810" strokeWidth="2.5" strokeLinecap="round" fill="none" />
          <path d="M67 48 Q70 44 73 48" stroke="#2c1810" strokeWidth="2.5" strokeLinecap="round" fill="none" />
        </>
      ) : (
        <>
          <ellipse cx="50" cy="48" rx="3.2" ry="3.8" fill="#2c1810" />
          <ellipse cx="70" cy="48" rx="3.2" ry="3.8" fill="#2c1810" />
          <circle cx="48.8" cy="46.5" r="1.2" fill="white" />
          <circle cx="68.8" cy="46.5" r="1.2" fill="white" />
        </>
      )}
      {/* Eyebrows - bold */}
      <path d="M45 40 L55 39" stroke="#4a3728" strokeWidth="2.2" strokeLinecap="round" />
      <path d="M65 39 L75 40" stroke="#4a3728" strokeWidth="2.2" strokeLinecap="round" />
      {/* Nose */}
      <path d="M58 53 Q60 56 62 53" stroke="#d4a574" strokeWidth="1.2" strokeLinecap="round" fill="none" />
      {/* Mouth - confident grin */}
      {expression === 'happy' ? (
        <path d="M52 58 Q60 65 68 58" stroke="#e17055" strokeWidth="2" strokeLinecap="round" fill="none" />
      ) : (
        <path d="M53 59 Q60 62 67 59" stroke="#e17055" strokeWidth="1.5" strokeLinecap="round" fill="none" />
      )}
      {/* Hair under cap */}
      <path d="M36 46 Q38 38 42 34 L44 46Z" fill="#4a3728" />
      <path d="M76 46 Q78 38 82 34 L78 46Z" fill="#4a3728" />
      {/* Cap */}
      <path d="M30 38 Q32 22 60 18 Q88 22 90 38 L86 36 Q84 24 60 22 Q36 24 34 36Z" fill="#e67e22" />
      <path d="M30 38 Q60 32 90 38 Q60 42 30 38Z" fill="#d35400" />
      {/* Cap brim */}
      <path d="M26 39 Q60 34 94 39 Q60 44 26 39Z" fill="#e67e22" />
      <ellipse cx="60" cy="24" rx="3" ry="2.5" fill="#f39c12" />
    </svg>
  )
}

function SeoyeonSVG({ size, expression }) {
  return (
    <svg width={size} height={size} viewBox="0 0 120 120" fill="none">
      {/* Outfit */}
      <path d="M34 95 L40 78 Q60 72 80 78 L86 95 Q60 100 34 95Z" fill="#e84393" />
      <path d="M48 80 Q60 76 72 80 V78 Q60 74 48 78Z" fill="#fd79a8" />
      {/* V-neck detail */}
      <path d="M52 78 L60 86 L68 78" stroke="#c0392b" strokeWidth="0.8" fill="none" opacity="0.3" />
      {/* Neck */}
      <rect x="53" y="72" width="14" height="9" rx="4" fill="#fde8d8" />
      {/* Head */}
      <ellipse cx="60" cy="50" rx="24" ry="27" fill="#fde8d8" />
      {/* Blush */}
      <ellipse cx="42" cy="55" rx="5" ry="3.5" fill="#ffb3ba" opacity="0.4" />
      <ellipse cx="78" cy="55" rx="5" ry="3.5" fill="#ffb3ba" opacity="0.4" />
      {/* Eyelashes + Eyes */}
      {expression === 'happy' ? (
        <>
          <path d="M46 49 Q50 44 54 49" stroke="#2c1810" strokeWidth="2.2" strokeLinecap="round" fill="none" />
          <path d="M66 49 Q70 44 74 49" stroke="#2c1810" strokeWidth="2.2" strokeLinecap="round" fill="none" />
          <line x1="45" y1="48" x2="43" y2="45" stroke="#2c1810" strokeWidth="1" strokeLinecap="round" />
          <line x1="75" y1="48" x2="77" y2="45" stroke="#2c1810" strokeWidth="1" strokeLinecap="round" />
        </>
      ) : (
        <>
          <ellipse cx="50" cy="49" rx="3" ry="4" fill="#2c1810" />
          <ellipse cx="70" cy="49" rx="3" ry="4" fill="#2c1810" />
          <circle cx="48.5" cy="47.5" r="1.3" fill="white" />
          <circle cx="68.5" cy="47.5" r="1.3" fill="white" />
          {/* Eyelashes */}
          <line x1="46" y1="46" x2="44" y2="43" stroke="#2c1810" strokeWidth="1" strokeLinecap="round" />
          <line x1="74" y1="46" x2="76" y2="43" stroke="#2c1810" strokeWidth="1" strokeLinecap="round" />
        </>
      )}
      {/* Eyebrows - arched */}
      <path d="M44 41 Q50 37 55 41" stroke="#3d2314" strokeWidth="1.5" strokeLinecap="round" fill="none" />
      <path d="M65 41 Q70 37 76 41" stroke="#3d2314" strokeWidth="1.5" strokeLinecap="round" fill="none" />
      {/* Nose */}
      <path d="M58 54 Q60 57 62 54" stroke="#e0c0b0" strokeWidth="1" strokeLinecap="round" fill="none" />
      {/* Mouth - cute */}
      {expression === 'happy' ? (
        <path d="M54 59 Q60 65 66 59" stroke="#e17055" strokeWidth="1.8" strokeLinecap="round" fill="#ffeedd" />
      ) : (
        <path d="M55 60 Q60 63 65 60" stroke="#e17055" strokeWidth="1.5" strokeLinecap="round" fill="none" />
      )}
      {/* Hair - long wavy */}
      <path d="M36 52 Q34 36 40 26 Q48 18 60 16 Q72 18 80 26 Q86 36 84 52 L82 44 Q80 30 72 24 Q60 20 48 24 Q40 30 38 44Z" fill="#3d2314" />
      {/* Bangs */}
      <path d="M38 40 Q42 28 50 24 L46 38Z" fill="#3d2314" />
      <path d="M50 24 Q56 22 60 24 L54 36Z" fill="#3d2314" opacity="0.95" />
      {/* Side hair */}
      <path d="M36 52 Q34 62 32 78 Q30 84 34 82 Q36 76 38 66 Q37 58 36 52Z" fill="#3d2314" />
      <path d="M84 52 Q86 62 88 78 Q90 84 86 82 Q84 76 82 66 Q83 58 84 52Z" fill="#3d2314" />
      {/* Headset */}
      <path d="M34 44 Q32 30 60 22 Q88 30 86 44" stroke="#64748b" strokeWidth="2.5" fill="none" />
      <ellipse cx="34" cy="48" rx="4" ry="6" fill="#475569" />
      <ellipse cx="86" cy="48" rx="4" ry="6" fill="#475569" />
      <ellipse cx="34" cy="48" rx="2.5" ry="4" fill="#64748b" />
      <ellipse cx="86" cy="48" rx="2.5" ry="4" fill="#64748b" />
      {/* Mic */}
      <path d="M30 50 Q28 56 30 62" stroke="#475569" strokeWidth="1.5" fill="none" />
      <circle cx="30" cy="63" r="2.5" fill="#475569" />
    </svg>
  )
}

function MinjunSVG({ size, expression }) {
  return (
    <svg width={size} height={size} viewBox="0 0 120 120" fill="none">
      {/* Hoodie */}
      <path d="M30 95 L36 74 Q60 66 84 74 L90 95 Q60 102 30 95Z" fill="#6c5ce7" />
      <path d="M45 78 Q60 72 75 78 L73 74 Q60 70 47 74Z" fill="#a29bfe" />
      {/* Hoodie details - strings */}
      <line x1="55" y1="78" x2="54" y2="88" stroke="#5b4cdb" strokeWidth="1" strokeLinecap="round" />
      <line x1="65" y1="78" x2="66" y2="88" stroke="#5b4cdb" strokeWidth="1" strokeLinecap="round" />
      <circle cx="54" cy="89" r="1.5" fill="#5b4cdb" />
      <circle cx="66" cy="89" r="1.5" fill="#5b4cdb" />
      {/* Hood behind */}
      <path d="M36 74 Q34 60 40 50 L44 58 Q38 66 36 74Z" fill="#5b4cdb" opacity="0.5" />
      <path d="M84 74 Q86 60 80 50 L76 58 Q82 66 84 74Z" fill="#5b4cdb" opacity="0.5" />
      {/* Neck */}
      <rect x="52" y="70" width="16" height="8" rx="4" fill="#f5d6c0" />
      {/* Head */}
      <ellipse cx="60" cy="50" rx="24" ry="26" fill="#f5d6c0" />
      {/* Blush */}
      <ellipse cx="42" cy="54" rx="4" ry="2.5" fill="#ffcccb" opacity="0.3" />
      <ellipse cx="78" cy="54" rx="4" ry="2.5" fill="#ffcccb" opacity="0.3" />
      {/* Eyes - slightly sleepy/smart look */}
      {expression === 'happy' ? (
        <>
          <path d="M47 49 Q50 45 53 49" stroke="#1a1a2e" strokeWidth="2.5" strokeLinecap="round" fill="none" />
          <path d="M67 49 Q70 45 73 49" stroke="#1a1a2e" strokeWidth="2.5" strokeLinecap="round" fill="none" />
        </>
      ) : (
        <>
          <ellipse cx="50" cy="49" rx="3" ry="3.5" fill="#1a1a2e" />
          <ellipse cx="70" cy="49" rx="3" ry="3.5" fill="#1a1a2e" />
          <circle cx="49" cy="47.5" r="1.2" fill="white" />
          <circle cx="69" cy="47.5" r="1.2" fill="white" />
        </>
      )}
      {/* Eyebrows - relaxed */}
      <path d="M45 42 L54 41" stroke="#1a1a2e" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M66 41 L75 42" stroke="#1a1a2e" strokeWidth="1.8" strokeLinecap="round" />
      {/* Nose */}
      <path d="M58 54 Q60 56 62 54" stroke="#d4a574" strokeWidth="1" strokeLinecap="round" fill="none" />
      {/* Mouth */}
      {expression === 'happy' ? (
        <path d="M54 58 Q60 63 66 58" stroke="#e17055" strokeWidth="1.5" strokeLinecap="round" fill="none" />
      ) : (
        <path d="M55 59 Q60 61 65 59" stroke="#e17055" strokeWidth="1.2" strokeLinecap="round" fill="none" />
      )}
      {/* Hair - messy with spikes */}
      <path d="M36 48 Q34 34 42 25 Q50 18 60 17 Q70 18 78 25 Q86 34 84 48 L82 40 Q80 28 72 22 Q60 18 48 22 Q40 28 38 40Z" fill="#1a1a2e" />
      {/* Messy spikes */}
      <path d="M42 22 L38 14 L48 20Z" fill="#1a1a2e" />
      <path d="M55 18 L52 10 L60 16Z" fill="#1a1a2e" />
      <path d="M65 17 L68 10 L72 18Z" fill="#1a1a2e" />
      <path d="M78 24 L84 16 L80 26Z" fill="#1a1a2e" />
      {/* Hair highlight */}
      <path d="M50 20 Q55 18 58 20" stroke="#2d2d4e" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.3" />
    </svg>
  )
}

function HaeunSVG({ size, expression }) {
  return (
    <svg width={size} height={size} viewBox="0 0 120 120" fill="none">
      {/* Outfit - elegant blazer */}
      <path d="M34 95 L40 78 Q60 72 80 78 L86 95 Q60 100 34 95Z" fill="#C4A661" />
      <path d="M48 80 Q60 76 72 80 V78 Q60 74 48 78Z" fill="#d4b96e" />
      {/* Lapel */}
      <path d="M52 78 L56 88 L60 82" stroke="#a68b3c" strokeWidth="0.8" fill="none" />
      <path d="M68 78 L64 88 L60 82" stroke="#a68b3c" strokeWidth="0.8" fill="none" />
      {/* Brooch */}
      <circle cx="60" cy="82" r="2" fill="#e8d5a0" stroke="#C4A661" strokeWidth="0.8" />
      {/* Neck */}
      <rect x="53" y="72" width="14" height="9" rx="4" fill="#fde8d8" />
      {/* Head */}
      <ellipse cx="60" cy="50" rx="24" ry="27" fill="#fde8d8" />
      {/* Blush */}
      <ellipse cx="42" cy="55" rx="5" ry="3" fill="#ffcccb" opacity="0.35" />
      <ellipse cx="78" cy="55" rx="5" ry="3" fill="#ffcccb" opacity="0.35" />
      {/* Eyes */}
      {expression === 'happy' ? (
        <>
          <path d="M46 49 Q50 45 54 49" stroke="#2c1810" strokeWidth="2.2" strokeLinecap="round" fill="none" />
          <path d="M66 49 Q70 45 74 49" stroke="#2c1810" strokeWidth="2.2" strokeLinecap="round" fill="none" />
        </>
      ) : (
        <>
          <ellipse cx="50" cy="49" rx="3" ry="4" fill="#2c1810" />
          <ellipse cx="70" cy="49" rx="3" ry="4" fill="#2c1810" />
          <circle cx="48.5" cy="47.5" r="1.3" fill="white" />
          <circle cx="68.5" cy="47.5" r="1.3" fill="white" />
        </>
      )}
      {/* Eyelashes */}
      <line x1="46" y1="46" x2="44" y2="44" stroke="#2c1810" strokeWidth="0.8" strokeLinecap="round" />
      <line x1="74" y1="46" x2="76" y2="44" stroke="#2c1810" strokeWidth="0.8" strokeLinecap="round" />
      {/* Eyebrows - elegant arch */}
      <path d="M44 42 Q50 38 55 42" stroke="#2c1810" strokeWidth="1.5" strokeLinecap="round" fill="none" />
      <path d="M65 42 Q70 38 76 42" stroke="#2c1810" strokeWidth="1.5" strokeLinecap="round" fill="none" />
      {/* Nose */}
      <path d="M58 54 Q60 57 62 54" stroke="#e0c0b0" strokeWidth="1" strokeLinecap="round" fill="none" />
      {/* Mouth */}
      {expression === 'happy' ? (
        <path d="M54 59 Q60 65 66 59" stroke="#d35d6e" strokeWidth="1.8" strokeLinecap="round" fill="#ffe8e8" />
      ) : (
        <path d="M55 60 Q60 63 65 60" stroke="#d35d6e" strokeWidth="1.5" strokeLinecap="round" fill="none" />
      )}
      {/* Hair - neat bun */}
      <path d="M36 52 Q34 36 40 26 Q48 18 60 16 Q72 18 80 26 Q86 36 84 52 L82 42 Q80 30 72 24 Q60 20 48 24 Q40 30 38 42Z" fill="#2c1810" />
      {/* Bangs - side swept */}
      <path d="M38 42 Q40 30 50 24 L44 38Z" fill="#2c1810" />
      <path d="M50 24 Q55 22 58 24 L52 34Z" fill="#2c1810" opacity="0.95" />
      {/* Bun */}
      <ellipse cx="60" cy="16" rx="10" ry="8" fill="#2c1810" />
      <ellipse cx="60" cy="16" rx="6" ry="5" fill="#3a2418" opacity="0.3" />
      {/* Hair pin */}
      <line x1="54" y1="14" x2="50" y2="10" stroke="#C4A661" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="49" cy="9" r="2" fill="#C4A661" />
      {/* Earring */}
      <circle cx="36" cy="56" r="1.5" fill="#C4A661" />
      <circle cx="84" cy="56" r="1.5" fill="#C4A661" />
    </svg>
  )
}

const svgComponents = {
  yujin: YujinSVG,
  taehyun: TaehyunSVG,
  seoyeon: SeoyeonSVG,
  minjun: MinjunSVG,
  haeun: HaeunSVG,
}

export default function SVGAvatar({ characterId, size = 120, expression = 'neutral', onClick, className = '' }) {
  const config = characters[characterId]
  const SVGComponent = svgComponents[characterId]
  if (!config || !SVGComponent) return null

  return (
    <motion.div
      className={`relative flex items-center justify-center ${className}`}
      style={{ width: size, height: size, cursor: onClick ? 'pointer' : 'default' }}
      onClick={onClick}
      whileHover={onClick ? { scale: 1.08, y: -4 } : {}}
      whileTap={onClick ? { scale: 0.95 } : {}}
    >
      {/* Circular gradient glow */}
      <div className="absolute inset-0 rounded-full" style={{
        background: `radial-gradient(circle at 50% 50%, ${config.accentColor}40 0%, ${config.outfitColor}15 40%, transparent 70%)`,
      }} />
      <div className="absolute inset-[6%] rounded-full" style={{
        background: `radial-gradient(circle at 50% 40%, ${config.accentColor}20 0%, transparent 60%)`,
      }} />
      {/* Character */}
      <div className="relative z-10">
        <SVGComponent size={size} expression={expression} />
      </div>
    </motion.div>
  )
}
