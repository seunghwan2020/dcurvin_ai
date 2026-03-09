import { motion } from 'framer-motion'

const characters = {
  yujin: { outfitColor: '#3b5998', outfitAccent: '#4a6fb5', accentColor: '#6b8cce', glowColor: '#3b599840' },
  taehyun: { outfitColor: '#e67e22', outfitAccent: '#f39c12', accentColor: '#f5b041', glowColor: '#e67e2240' },
  seoyeon: { outfitColor: '#e84393', outfitAccent: '#fd79a8', accentColor: '#fab1d0', glowColor: '#e8439340' },
  minjun: { outfitColor: '#6c5ce7', outfitAccent: '#a29bfe', accentColor: '#b8b0fe', glowColor: '#6c5ce740' },
  haeun: { outfitColor: '#C4A661', outfitAccent: '#d4b96e', accentColor: '#e8d5a0', glowColor: '#C4A66140' },
}

/* Shared SVG defs for filters + gradients */
function SharedDefs({ id, outfitColor, outfitAccent }) {
  return (
    <defs>
      <radialGradient id={`${id}-skin`} cx="45%" cy="35%">
        <stop offset="0%" stopColor="#ffe8d0" />
        <stop offset="60%" stopColor="#f8d4b0" />
        <stop offset="100%" stopColor="#e8c0a0" />
      </radialGradient>
      <linearGradient id={`${id}-outfit`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor={outfitAccent} />
        <stop offset="50%" stopColor={outfitColor} />
        <stop offset="100%" stopColor={outfitColor} stopOpacity="0.85" />
      </linearGradient>
      <linearGradient id={`${id}-hair-shine`} x1="0.3" y1="0" x2="0.7" y2="1">
        <stop offset="0%" stopColor="white" stopOpacity="0.25" />
        <stop offset="50%" stopColor="white" stopOpacity="0" />
        <stop offset="100%" stopColor="white" stopOpacity="0.08" />
      </linearGradient>
      <filter id={`${id}-shadow`}>
        <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#00000020" />
      </filter>
      <filter id={`${id}-inner-glow`}>
        <feGaussianBlur in="SourceAlpha" stdDeviation="2" result="blur" />
        <feFlood floodColor={outfitColor} floodOpacity="0.15" />
        <feComposite in2="blur" operator="in" />
        <feMerge><feMergeNode /><feMergeNode in="SourceGraphic" /></feMerge>
      </filter>
      <radialGradient id={`${id}-eye-light`} cx="35%" cy="30%">
        <stop offset="0%" stopColor="white" stopOpacity="0.9" />
        <stop offset="100%" stopColor="white" stopOpacity="0" />
      </radialGradient>
    </defs>
  )
}

/* Shared eye component with sparkle */
function GameEyes({ expression, eyeColor = '#2c1810', id }) {
  if (expression === 'happy') {
    return (
      <g>
        <path d="M46 50 Q50 45 54 50" stroke={eyeColor} strokeWidth="2.8" strokeLinecap="round" fill="none" />
        <path d="M66 50 Q70 45 74 50" stroke={eyeColor} strokeWidth="2.8" strokeLinecap="round" fill="none" />
        {/* Happy sparkle */}
        <circle cx="54" cy="46" r="1" fill="#C4A661" className="animate-eye-sparkle" style={{ animationDelay: '0s' }} />
        <circle cx="74" cy="46" r="1" fill="#C4A661" className="animate-eye-sparkle" style={{ animationDelay: '1.5s' }} />
      </g>
    )
  }
  return (
    <g>
      {/* Eye whites with slight shadow */}
      <ellipse cx="50" cy="50" rx="5.5" ry="6" fill="white" />
      <ellipse cx="70" cy="50" rx="5.5" ry="6" fill="white" />
      {/* Upper eyelid shadow */}
      <ellipse cx="50" cy="47" rx="5" ry="2.5" fill={eyeColor} opacity="0.06" />
      <ellipse cx="70" cy="47" rx="5" ry="2.5" fill={eyeColor} opacity="0.06" />
      {/* Iris */}
      <ellipse cx="50" cy="50.5" rx="3.8" ry="4.2" fill={eyeColor} />
      <ellipse cx="70" cy="50.5" rx="3.8" ry="4.2" fill={eyeColor} />
      {/* Iris gradient detail */}
      <ellipse cx="50" cy="51" rx="2.5" ry="3" fill={eyeColor} opacity="0.7" />
      <ellipse cx="70" cy="51" rx="2.5" ry="3" fill={eyeColor} opacity="0.7" />
      {/* Primary highlight */}
      <circle cx="48" cy="48" r="1.8" fill="white" opacity="0.95" />
      <circle cx="68" cy="48" r="1.8" fill="white" opacity="0.95" />
      {/* Secondary highlight (smaller, offset) */}
      <circle cx="52" cy="52" r="0.8" fill="white" opacity="0.6" />
      <circle cx="72" cy="52" r="0.8" fill="white" opacity="0.6" />
      {/* Sparkle animation */}
      <circle cx="47.5" cy="47.5" r="0.7" fill="white" className="animate-eye-sparkle" style={{ animationDelay: '0.5s' }} />
      <circle cx="67.5" cy="47.5" r="0.7" fill="white" className="animate-eye-sparkle" style={{ animationDelay: '2s' }} />
    </g>
  )
}

function YujinSVG({ size }) {
  const id = 'yujin'
  const expression = arguments[0].expression
  return (
    <svg width={size} height={size} viewBox="0 0 120 120" fill="none">
      <SharedDefs id={id} outfitColor="#3b5998" outfitAccent="#4a6fb5" />
      {/* Outfit with wrinkle detail */}
      <path d="M33 98 L39 77 Q60 70 81 77 L87 98 Q60 104 33 98Z" fill={`url(#${id}-outfit)`} filter={`url(#${id}-shadow)`} />
      <path d="M44 82 Q60 75 76 82 L74 78 Q60 73 46 78Z" fill="#5a7dc0" opacity="0.6" />
      {/* Shirt wrinkle lines */}
      <path d="M50 82 Q52 88 50 94" stroke="#2e4a82" strokeWidth="0.5" opacity="0.2" fill="none" />
      <path d="M70 82 Q68 88 70 94" stroke="#2e4a82" strokeWidth="0.5" opacity="0.2" fill="none" />
      {/* Collar */}
      <path d="M50 77 L54 82 L60 79 L66 82 L70 77" stroke="#5a7dc0" strokeWidth="1" fill="none" opacity="0.5" />
      {/* Neck with shadow */}
      <rect x="52" y="71" width="16" height="10" rx="5" fill={`url(#${id}-skin)`} />
      <ellipse cx="60" cy="71" rx="8" ry="2" fill="#d4a574" opacity="0.15" />
      {/* Head with gradient */}
      <ellipse cx="60" cy="50" rx="26" ry="28" fill={`url(#${id}-skin)`} />
      {/* Face contour shadow */}
      <path d="M36 55 Q38 68 46 74 Q60 78 74 74 Q82 68 84 55" fill="#d4a574" opacity="0.08" />
      {/* Blush */}
      <ellipse cx="40" cy="57" rx="6" ry="3.5" fill="#ffb3ba" opacity="0.25" />
      <ellipse cx="80" cy="57" rx="6" ry="3.5" fill="#ffb3ba" opacity="0.25" />
      {/* Eyes */}
      <GameEyes expression={expression} eyeColor="#2c1810" id={id} />
      {/* Eyebrows with thickness variation */}
      <path d="M43 42 Q48 38 55 41" stroke="#2c1810" strokeWidth="2" strokeLinecap="round" fill="none" />
      <path d="M65 41 Q72 38 77 42" stroke="#2c1810" strokeWidth="2" strokeLinecap="round" fill="none" />
      {/* Nose with highlight */}
      <path d="M57 56 Q60 60 63 56" stroke="#d4a574" strokeWidth="1.2" strokeLinecap="round" fill="none" />
      <circle cx="59" cy="55" r="0.5" fill="white" opacity="0.4" />
      {/* Mouth */}
      {expression === 'happy' ? (
        <g>
          <path d="M52 62 Q60 69 68 62" stroke="#d35d6e" strokeWidth="2" strokeLinecap="round" fill="#ffeedd" opacity="0.6" />
          <path d="M54 62 Q60 66 66 62" fill="#ffeedd" opacity="0.4" />
        </g>
      ) : (
        <path d="M54 63 Q60 66 66 63" stroke="#d35d6e" strokeWidth="1.5" strokeLinecap="round" fill="none" />
      )}
      {/* Hair - multi layer */}
      <path d="M34 48 Q32 33 38 24 Q46 16 60 14 Q74 16 82 24 Q88 33 86 48 L84 40 Q82 28 72 22 Q60 18 48 22 Q38 28 36 40Z" fill="#2c1810" />
      {/* Hair second layer (depth) */}
      <path d="M36 44 Q34 34 40 26 Q48 19 60 17 Q72 19 80 26 Q86 34 84 44 L82 38 Q80 28 72 23 Q60 20 48 23 Q40 28 38 38Z" fill="#3a2518" opacity="0.5" />
      {/* Hair shine streak */}
      <path d="M44 22 Q52 16 62 18" stroke="white" strokeWidth="2" strokeLinecap="round" opacity="0.12" fill="none" />
      <path d="M46 26 Q54 20 64 22" stroke="white" strokeWidth="1" strokeLinecap="round" opacity="0.08" fill="none" />
      {/* Glasses with reflection */}
      <g filter={`url(#${id}-shadow)`}>
        <rect x="40" y="44" width="16" height="13" rx="6" stroke="#475569" strokeWidth="2" fill="rgba(200,220,255,0.08)" />
        <rect x="64" y="44" width="16" height="13" rx="6" stroke="#475569" strokeWidth="2" fill="rgba(200,220,255,0.08)" />
        <path d="M56 50 L64 50" stroke="#475569" strokeWidth="1.5" />
        <path d="M40 49 L34 47" stroke="#475569" strokeWidth="1.3" />
        <path d="M80 49 L86 47" stroke="#475569" strokeWidth="1.3" />
        {/* Lens reflection */}
        <path d="M42 46 L48 48" stroke="white" strokeWidth="0.8" opacity="0.3" strokeLinecap="round" />
        <path d="M66 46 L72 48" stroke="white" strokeWidth="0.8" opacity="0.3" strokeLinecap="round" />
      </g>
    </svg>
  )
}

function TaehyunSVG({ size }) {
  const id = 'taehyun'
  const expression = arguments[0].expression
  return (
    <svg width={size} height={size} viewBox="0 0 120 120" fill="none">
      <SharedDefs id={id} outfitColor="#e67e22" outfitAccent="#f39c12" />
      {/* Outfit - cargo style */}
      <path d="M30 98 L37 75 Q60 68 83 75 L90 98 Q60 105 30 98Z" fill={`url(#${id}-outfit)`} filter={`url(#${id}-shadow)`} />
      <path d="M42 80 Q60 73 78 80 L76 76 Q60 71 44 76Z" fill="#f5b041" opacity="0.5" />
      {/* Cargo pockets with stitching */}
      <rect x="38" y="84" width="12" height="8" rx="2" stroke="#bf6516" strokeWidth="0.8" fill="#d35400" opacity="0.15" />
      <rect x="70" y="84" width="12" height="8" rx="2" stroke="#bf6516" strokeWidth="0.8" fill="#d35400" opacity="0.15" />
      <line x1="44" y1="86" x2="44" y2="90" stroke="#bf6516" strokeWidth="0.5" opacity="0.3" />
      <line x1="76" y1="86" x2="76" y2="90" stroke="#bf6516" strokeWidth="0.5" opacity="0.3" />
      {/* Outfit wrinkle */}
      <path d="M55 80 Q56 90 55 96" stroke="#bf6516" strokeWidth="0.4" opacity="0.15" fill="none" />
      {/* Neck */}
      <rect x="52" y="69" width="16" height="10" rx="5" fill={`url(#${id}-skin)`} />
      {/* Head */}
      <ellipse cx="60" cy="49" rx="25" ry="27" fill={`url(#${id}-skin)`} />
      {/* Face contour */}
      <path d="M37 54 Q39 66 47 72 Q60 76 73 72 Q81 66 83 54" fill="#d4a574" opacity="0.07" />
      {/* Blush */}
      <ellipse cx="41" cy="55" rx="5" ry="3" fill="#ffcccb" opacity="0.22" />
      <ellipse cx="79" cy="55" rx="5" ry="3" fill="#ffcccb" opacity="0.22" />
      {/* Eyes */}
      <GameEyes expression={expression} eyeColor="#2c1810" id={id} />
      {/* Bold eyebrows */}
      <path d="M43 41 Q48 37 55 40" stroke="#4a3728" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      <path d="M65 40 Q72 37 77 41" stroke="#4a3728" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      {/* Nose */}
      <path d="M57 55 Q60 58 63 55" stroke="#d4a574" strokeWidth="1.2" strokeLinecap="round" fill="none" />
      {/* Mouth - confident */}
      {expression === 'happy' ? (
        <g>
          <path d="M51 60 Q60 68 69 60" stroke="#d35d6e" strokeWidth="2" strokeLinecap="round" fill="none" />
          <path d="M54 61 Q60 65 66 61" fill="#ffeedd" opacity="0.3" />
        </g>
      ) : (
        <path d="M53 61 Q60 64 67 61" stroke="#d35d6e" strokeWidth="1.5" strokeLinecap="round" fill="none" />
      )}
      {/* Hair under cap */}
      <path d="M36 46 Q38 38 43 34 L45 46Z" fill="#4a3728" />
      <path d="M75 46 Q78 38 83 34 L78 46Z" fill="#4a3728" />
      {/* Cap - multi-layer with shading */}
      <path d="M28 37 Q30 20 60 16 Q90 20 92 37 L88 35 Q86 22 60 19 Q34 22 32 35Z" fill="#e67e22" />
      <path d="M28 37 Q30 20 60 16 Q90 20 92 37 L88 35 Q86 22 60 19 Q34 22 32 35Z" fill="url(#taehyun-hair-shine)" />
      {/* Cap band */}
      <path d="M28 37 Q60 31 92 37 Q60 41 28 37Z" fill="#bf6516" />
      {/* Cap brim with shadow */}
      <path d="M24 38 Q60 32 96 38 Q60 44 24 38Z" fill="#e67e22" filter={`url(#${id}-shadow)`} />
      <path d="M26 38 Q60 34 94 38 Q60 37 26 38Z" fill="#f5b041" opacity="0.3" />
      {/* Cap button */}
      <ellipse cx="60" cy="22" rx="3.5" ry="3" fill="#f39c12" stroke="#e67e22" strokeWidth="0.5" />
      <circle cx="59" cy="21" r="0.8" fill="white" opacity="0.3" />
    </svg>
  )
}

function SeoyeonSVG({ size }) {
  const id = 'seoyeon'
  const expression = arguments[0].expression
  return (
    <svg width={size} height={size} viewBox="0 0 120 120" fill="none">
      <SharedDefs id={id} outfitColor="#e84393" outfitAccent="#fd79a8" />
      {/* Outfit */}
      <path d="M33 98 L39 77 Q60 70 81 77 L87 98 Q60 104 33 98Z" fill={`url(#${id}-outfit)`} filter={`url(#${id}-shadow)`} />
      <path d="M47 80 Q60 74 73 80 V78 Q60 73 47 78Z" fill="#ff9ec5" opacity="0.4" />
      {/* V-neck with shading */}
      <path d="M52 77 L60 87 L68 77" stroke="#c0392b" strokeWidth="0.6" fill="none" opacity="0.2" />
      <path d="M54 78 L60 84 L66 78" fill="#c0392b" opacity="0.04" />
      {/* Fabric wrinkles */}
      <path d="M48 82 Q50 90 48 96" stroke="#b83280" strokeWidth="0.4" opacity="0.12" fill="none" />
      <path d="M72 82 Q70 90 72 96" stroke="#b83280" strokeWidth="0.4" opacity="0.12" fill="none" />
      {/* Neck */}
      <rect x="53" y="71" width="14" height="9" rx="5" fill={`url(#${id}-skin)`} />
      {/* Head */}
      <ellipse cx="60" cy="49" rx="24" ry="27" fill={`url(#${id}-skin)`} />
      {/* Face contour */}
      <path d="M38 54 Q40 66 48 72 Q60 76 72 72 Q80 66 82 54" fill="#d4a574" opacity="0.07" />
      {/* Blush - more prominent */}
      <ellipse cx="40" cy="56" rx="6" ry="4" fill="#ffb3ba" opacity="0.3" />
      <ellipse cx="80" cy="56" rx="6" ry="4" fill="#ffb3ba" opacity="0.3" />
      {/* Eyes with lashes */}
      <GameEyes expression={expression} eyeColor="#2c1810" id={id} />
      {/* Eyelashes - detailed */}
      {expression !== 'happy' && (
        <g>
          <line x1="44" y1="46" x2="42" y2="42" stroke="#2c1810" strokeWidth="1.2" strokeLinecap="round" />
          <line x1="46" y1="45" x2="44.5" y2="41.5" stroke="#2c1810" strokeWidth="0.8" strokeLinecap="round" />
          <line x1="76" y1="46" x2="78" y2="42" stroke="#2c1810" strokeWidth="1.2" strokeLinecap="round" />
          <line x1="74" y1="45" x2="75.5" y2="41.5" stroke="#2c1810" strokeWidth="0.8" strokeLinecap="round" />
        </g>
      )}
      {/* Elegant eyebrows */}
      <path d="M43 41 Q50 36 56 41" stroke="#3d2314" strokeWidth="1.5" strokeLinecap="round" fill="none" />
      <path d="M64 41 Q70 36 77 41" stroke="#3d2314" strokeWidth="1.5" strokeLinecap="round" fill="none" />
      {/* Nose */}
      <path d="M58 55 Q60 58 62 55" stroke="#e0c0b0" strokeWidth="1" strokeLinecap="round" fill="none" />
      {/* Mouth - cute */}
      {expression === 'happy' ? (
        <g>
          <path d="M53 61 Q60 68 67 61" stroke="#d35d6e" strokeWidth="2" strokeLinecap="round" fill="#ffeedd" opacity="0.5" />
          <path d="M55 62 Q60 65 65 62" fill="white" opacity="0.15" />
        </g>
      ) : (
        <g>
          <path d="M55 62 Q60 65 65 62" stroke="#d35d6e" strokeWidth="1.5" strokeLinecap="round" fill="none" />
          {/* Lip shine */}
          <circle cx="58" cy="62.5" r="0.5" fill="white" opacity="0.3" />
        </g>
      )}
      {/* Hair - long wavy, multi-layer */}
      <path d="M36 52 Q34 34 40 24 Q48 16 60 14 Q72 16 80 24 Q86 34 84 52 L82 42 Q80 28 72 22 Q60 18 48 22 Q40 28 38 42Z" fill="#3d2314" />
      {/* Hair second layer */}
      <path d="M38 46 Q36 35 42 26 Q50 18 60 16 Q70 18 78 26 Q84 35 82 46 L80 40 Q78 30 72 24 Q60 20 48 24 Q42 30 40 40Z" fill="#4d3020" opacity="0.4" />
      {/* Bangs with volume */}
      <path d="M38 40 Q42 26 52 22 L46 38Z" fill="#3d2314" />
      <path d="M40 38 Q44 28 50 24 L48 36Z" fill="#4d3020" opacity="0.3" />
      <path d="M50 22 Q56 20 60 22 L54 34Z" fill="#3d2314" opacity="0.95" />
      {/* Side hair with wave */}
      <path d="M36 52 Q34 60 33 70 Q31 80 33 84 Q36 82 37 74 Q38 64 36 52Z" fill="#3d2314" />
      <path d="M84 52 Q86 60 87 70 Q89 80 87 84 Q84 82 83 74 Q82 64 84 52Z" fill="#3d2314" />
      {/* Hair waves */}
      <path d="M33 70 Q31 74 33 78" stroke="#4d3020" strokeWidth="0.8" opacity="0.2" fill="none" />
      <path d="M87 70 Q89 74 87 78" stroke="#4d3020" strokeWidth="0.8" opacity="0.2" fill="none" />
      {/* Hair shine */}
      <path d="M46 20 Q54 14 64 18" stroke="white" strokeWidth="1.5" strokeLinecap="round" opacity="0.1" fill="none" />
      {/* Headset - metallic */}
      <path d="M33 44 Q31 28 60 20 Q89 28 87 44" stroke="#475569" strokeWidth="3" fill="none" />
      <path d="M33 44 Q31 28 60 20 Q89 28 87 44" stroke="#64748b" strokeWidth="1" fill="none" opacity="0.4" />
      {/* Ear cups with detail */}
      <ellipse cx="33" cy="49" rx="5" ry="7" fill="#334155" />
      <ellipse cx="87" cy="49" rx="5" ry="7" fill="#334155" />
      <ellipse cx="33" cy="49" rx="3" ry="5" fill="#475569" />
      <ellipse cx="87" cy="49" rx="3" ry="5" fill="#475569" />
      {/* Cup highlight */}
      <ellipse cx="32" cy="47" rx="1.5" ry="2.5" fill="white" opacity="0.1" />
      <ellipse cx="86" cy="47" rx="1.5" ry="2.5" fill="white" opacity="0.1" />
      {/* Mic arm + head */}
      <path d="M29 52 Q26 58 28 65" stroke="#475569" strokeWidth="2" strokeLinecap="round" fill="none" />
      <circle cx="28" cy="66" r="3" fill="#334155" />
      <circle cx="28" cy="66" r="1.5" fill="#475569" />
    </svg>
  )
}

function MinjunSVG({ size }) {
  const id = 'minjun'
  const expression = arguments[0].expression
  return (
    <svg width={size} height={size} viewBox="0 0 120 120" fill="none">
      <SharedDefs id={id} outfitColor="#6c5ce7" outfitAccent="#a29bfe" />
      {/* Hoodie */}
      <path d="M28 98 L35 73 Q60 65 85 73 L92 98 Q60 106 28 98Z" fill={`url(#${id}-outfit)`} filter={`url(#${id}-shadow)`} />
      <path d="M44 78 Q60 71 76 78 L74 74 Q60 69 46 74Z" fill="#b8b0fe" opacity="0.4" />
      {/* Hood shape behind */}
      <path d="M35 73 Q33 58 40 48 L45 56 Q38 64 35 73Z" fill="#5b4cdb" opacity="0.35" />
      <path d="M85 73 Q87 58 80 48 L75 56 Q82 64 85 73Z" fill="#5b4cdb" opacity="0.35" />
      {/* Hoodie strings */}
      <line x1="55" y1="78" x2="53" y2="90" stroke="#4834d4" strokeWidth="1.2" strokeLinecap="round" />
      <line x1="65" y1="78" x2="67" y2="90" stroke="#4834d4" strokeWidth="1.2" strokeLinecap="round" />
      <circle cx="53" cy="91" r="2" fill="#4834d4" />
      <circle cx="67" cy="91" r="2" fill="#4834d4" />
      {/* Kangaroo pocket */}
      <path d="M44 86 Q60 82 76 86 Q76 94 60 96 Q44 94 44 86Z" stroke="#4834d4" strokeWidth="0.6" fill="#5b4cdb" opacity="0.12" />
      {/* Neck */}
      <rect x="52" y="69" width="16" height="8" rx="5" fill={`url(#${id}-skin)`} />
      {/* Head */}
      <ellipse cx="60" cy="49" rx="24" ry="26" fill={`url(#${id}-skin)`} />
      {/* Face contour */}
      <path d="M38 53 Q40 64 48 70 Q60 74 72 70 Q80 64 82 53" fill="#d4a574" opacity="0.06" />
      {/* Blush */}
      <ellipse cx="41" cy="55" rx="4.5" ry="2.5" fill="#ffcccb" opacity="0.2" />
      <ellipse cx="79" cy="55" rx="4.5" ry="2.5" fill="#ffcccb" opacity="0.2" />
      {/* Eyes */}
      <GameEyes expression={expression} eyeColor="#1a1a2e" id={id} />
      {/* Relaxed eyebrows */}
      <path d="M44 42 L55 40.5" stroke="#1a1a2e" strokeWidth="2" strokeLinecap="round" />
      <path d="M65 40.5 L76 42" stroke="#1a1a2e" strokeWidth="2" strokeLinecap="round" />
      {/* Nose */}
      <path d="M58 55 Q60 57 62 55" stroke="#d4a574" strokeWidth="1" strokeLinecap="round" fill="none" />
      {/* Mouth */}
      {expression === 'happy' ? (
        <path d="M54 60 Q60 65 66 60" stroke="#d35d6e" strokeWidth="1.5" strokeLinecap="round" fill="none" />
      ) : (
        <path d="M55 61 Q60 63 65 61" stroke="#d35d6e" strokeWidth="1.3" strokeLinecap="round" fill="none" />
      )}
      {/* Hair - messy multi-layer */}
      <path d="M36 47 Q34 32 42 23 Q50 16 60 15 Q70 16 78 23 Q86 32 84 47 L82 39 Q80 27 72 21 Q60 17 48 21 Q40 27 38 39Z" fill="#1a1a2e" />
      <path d="M38 43 Q36 33 44 25 Q52 18 60 17 Q68 18 76 25 Q84 33 82 43 L80 37 Q78 28 72 23 Q60 19 48 23 Q42 28 40 37Z" fill="#252550" opacity="0.4" />
      {/* Messy spikes - multi-layer */}
      <path d="M42 20 L37 11 L48 18Z" fill="#1a1a2e" />
      <path d="M43 18 L39 13 L47 17Z" fill="#252550" opacity="0.3" />
      <path d="M54 16 L50 7 L60 14Z" fill="#1a1a2e" />
      <path d="M55 14 L52 9 L59 13Z" fill="#252550" opacity="0.3" />
      <path d="M64 15 L67 6 L72 16Z" fill="#1a1a2e" />
      <path d="M78 22 L85 13 L81 24Z" fill="#1a1a2e" />
      <path d="M79 20 L83 15 L80 22Z" fill="#252550" opacity="0.3" />
      {/* Hair shine */}
      <path d="M48 19 Q56 14 64 17" stroke="white" strokeWidth="1.5" strokeLinecap="round" opacity="0.08" fill="none" />
      <path d="M44 24 Q50 20 56 22" stroke="white" strokeWidth="0.8" strokeLinecap="round" opacity="0.06" fill="none" />
    </svg>
  )
}

function HaeunSVG({ size }) {
  const id = 'haeun'
  const expression = arguments[0].expression
  return (
    <svg width={size} height={size} viewBox="0 0 120 120" fill="none">
      <SharedDefs id={id} outfitColor="#C4A661" outfitAccent="#d4b96e" />
      {/* Blazer - premium */}
      <path d="M33 98 L39 77 Q60 70 81 77 L87 98 Q60 104 33 98Z" fill={`url(#${id}-outfit)`} filter={`url(#${id}-shadow)`} />
      <path d="M47 80 Q60 75 73 80 V78 Q60 73 47 78Z" fill="#e8d5a0" opacity="0.4" />
      {/* Lapel with shadow */}
      <path d="M51 77 L55 90 L60 83" stroke="#8b7535" strokeWidth="0.8" fill="none" opacity="0.3" />
      <path d="M69 77 L65 90 L60 83" stroke="#8b7535" strokeWidth="0.8" fill="none" opacity="0.3" />
      {/* Fabric wrinkles */}
      <path d="M48 82 Q49 90 48 96" stroke="#8b7535" strokeWidth="0.3" opacity="0.15" fill="none" />
      <path d="M72 82 Q71 90 72 96" stroke="#8b7535" strokeWidth="0.3" opacity="0.15" fill="none" />
      {/* Brooch - gemstone */}
      <circle cx="60" cy="82" r="2.5" fill="#e8d5a0" />
      <circle cx="60" cy="82" r="2.5" stroke="#C4A661" strokeWidth="1" />
      <circle cx="60" cy="82" r="1.2" fill="#C4A661" />
      <circle cx="59.2" cy="81.2" r="0.5" fill="white" opacity="0.6" />
      {/* Neck */}
      <rect x="53" y="71" width="14" height="9" rx="5" fill={`url(#${id}-skin)`} />
      {/* Head */}
      <ellipse cx="60" cy="49" rx="24" ry="27" fill={`url(#${id}-skin)`} />
      {/* Face contour */}
      <path d="M38 54 Q40 66 48 72 Q60 76 72 72 Q80 66 82 54" fill="#d4a574" opacity="0.07" />
      {/* Blush */}
      <ellipse cx="40" cy="56" rx="6" ry="3.5" fill="#ffb3ba" opacity="0.28" />
      <ellipse cx="80" cy="56" rx="6" ry="3.5" fill="#ffb3ba" opacity="0.28" />
      {/* Eyes */}
      <GameEyes expression={expression} eyeColor="#2c1810" id={id} />
      {/* Eyelashes */}
      {expression !== 'happy' && (
        <g>
          <line x1="44" y1="46" x2="43" y2="43" stroke="#2c1810" strokeWidth="1" strokeLinecap="round" />
          <line x1="76" y1="46" x2="77" y2="43" stroke="#2c1810" strokeWidth="1" strokeLinecap="round" />
        </g>
      )}
      {/* Elegant eyebrows */}
      <path d="M43 42 Q50 37 56 42" stroke="#2c1810" strokeWidth="1.5" strokeLinecap="round" fill="none" />
      <path d="M64 42 Q70 37 77 42" stroke="#2c1810" strokeWidth="1.5" strokeLinecap="round" fill="none" />
      {/* Nose */}
      <path d="M58 55 Q60 58 62 55" stroke="#e0c0b0" strokeWidth="1" strokeLinecap="round" fill="none" />
      {/* Mouth */}
      {expression === 'happy' ? (
        <g>
          <path d="M53 61 Q60 68 67 61" stroke="#d35d6e" strokeWidth="1.8" strokeLinecap="round" fill="#ffe8e8" opacity="0.5" />
          <circle cx="58" cy="62" r="0.4" fill="white" opacity="0.4" />
        </g>
      ) : (
        <g>
          <path d="M55 62 Q60 65 65 62" stroke="#d35d6e" strokeWidth="1.5" strokeLinecap="round" fill="none" />
          <circle cx="58" cy="62.5" r="0.4" fill="white" opacity="0.3" />
        </g>
      )}
      {/* Hair - neat bun, multi-layer */}
      <path d="M36 52 Q34 34 40 24 Q48 16 60 14 Q72 16 80 24 Q86 34 84 52 L82 42 Q80 28 72 22 Q60 18 48 22 Q40 28 38 42Z" fill="#2c1810" />
      <path d="M38 46 Q36 35 42 26 Q50 19 60 17 Q70 19 78 26 Q84 35 82 46 L80 40 Q78 30 72 24 Q60 20 48 24 Q42 30 40 40Z" fill="#3a2518" opacity="0.4" />
      {/* Bangs */}
      <path d="M38 42 Q41 28 52 22 L46 38Z" fill="#2c1810" />
      <path d="M40 38 Q43 30 50 24 L48 36Z" fill="#3a2518" opacity="0.3" />
      <path d="M50 22 Q56 20 59 22 L53 34Z" fill="#2c1810" opacity="0.95" />
      {/* Bun with volume */}
      <ellipse cx="60" cy="14" rx="11" ry="9" fill="#2c1810" />
      <ellipse cx="60" cy="14" rx="8" ry="6.5" fill="#3a2518" opacity="0.25" />
      <ellipse cx="58" cy="12" rx="3" ry="2" fill="white" opacity="0.06" />
      {/* Hair pin - gold gem */}
      <line x1="53" y1="12" x2="48" y2="7" stroke="#C4A661" strokeWidth="2" strokeLinecap="round" />
      <circle cx="47" cy="6" r="3" fill="#C4A661" />
      <circle cx="47" cy="6" r="1.5" fill="#e8d5a0" />
      <circle cx="46.3" cy="5.3" r="0.6" fill="white" opacity="0.5" />
      {/* Hair shine */}
      <path d="M46 20 Q54 14 64 18" stroke="white" strokeWidth="1.5" strokeLinecap="round" opacity="0.1" fill="none" />
      {/* Gold earrings with dangle */}
      <circle cx="36" cy="57" r="1.2" fill="#C4A661" />
      <line x1="36" y1="58.2" x2="36" y2="61" stroke="#C4A661" strokeWidth="0.8" />
      <circle cx="36" cy="62" r="1.5" fill="#e8d5a0" stroke="#C4A661" strokeWidth="0.5" />
      <circle cx="84" cy="57" r="1.2" fill="#C4A661" />
      <line x1="84" y1="58.2" x2="84" y2="61" stroke="#C4A661" strokeWidth="0.8" />
      <circle cx="84" cy="62" r="1.5" fill="#e8d5a0" stroke="#C4A661" strokeWidth="0.5" />
    </svg>
  )
}

const svgComponents = { yujin: YujinSVG, taehyun: TaehyunSVG, seoyeon: SeoyeonSVG, minjun: MinjunSVG, haeun: HaeunSVG }

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
      {/* Outer pulse glow */}
      <div className="absolute inset-[-15%] rounded-full animate-pulse-glow" style={{
        background: `radial-gradient(circle, ${config.glowColor} 0%, transparent 70%)`,
      }} />
      {/* Inner gradient glow */}
      <div className="absolute inset-0 rounded-full" style={{
        background: `radial-gradient(circle at 50% 45%, ${config.accentColor}30 0%, ${config.outfitColor}10 40%, transparent 70%)`,
      }} />
      {/* Character */}
      <div className="relative z-10">
        <SVGComponent size={size} expression={expression} />
      </div>
    </motion.div>
  )
}
