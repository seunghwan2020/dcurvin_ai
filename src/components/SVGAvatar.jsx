import { motion } from 'framer-motion'

const characters = {
  yujin: { outfitColor: '#3b5998', outfitAccent: '#4a6fb5', accentColor: '#6b8cce', glowColor: '#3b599840' },
  taehyun: { outfitColor: '#e67e22', outfitAccent: '#f39c12', accentColor: '#f5b041', glowColor: '#e67e2240' },
  seoyeon: { outfitColor: '#e84393', outfitAccent: '#fd79a8', accentColor: '#fab1d0', glowColor: '#e8439340' },
  minjun: { outfitColor: '#6c5ce7', outfitAccent: '#a29bfe', accentColor: '#b8b0fe', glowColor: '#6c5ce740' },
  haeun: { outfitColor: '#C4A661', outfitAccent: '#d4b96e', accentColor: '#e8d5a0', glowColor: '#C4A66140' },
  hanwei: { outfitColor: '#2d8a4e', outfitAccent: '#4ade80', accentColor: '#86efac', glowColor: '#2d8a4e40' },
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
        <circle cx="54" cy="46" r="1" fill="#C4A661" className="animate-eye-sparkle" style={{ animationDelay: '0s' }} />
        <circle cx="74" cy="46" r="1" fill="#C4A661" className="animate-eye-sparkle" style={{ animationDelay: '1.5s' }} />
      </g>
    )
  }
  return (
    <g>
      <ellipse cx="50" cy="50" rx="5.5" ry="6" fill="white" />
      <ellipse cx="70" cy="50" rx="5.5" ry="6" fill="white" />
      <ellipse cx="50" cy="47" rx="5" ry="2.5" fill={eyeColor} opacity="0.06" />
      <ellipse cx="70" cy="47" rx="5" ry="2.5" fill={eyeColor} opacity="0.06" />
      <ellipse cx="50" cy="50.5" rx="3.8" ry="4.2" fill={eyeColor} />
      <ellipse cx="70" cy="50.5" rx="3.8" ry="4.2" fill={eyeColor} />
      <ellipse cx="50" cy="51" rx="2.5" ry="3" fill={eyeColor} opacity="0.7" />
      <ellipse cx="70" cy="51" rx="2.5" ry="3" fill={eyeColor} opacity="0.7" />
      <circle cx="48" cy="48" r="1.8" fill="white" opacity="0.95" />
      <circle cx="68" cy="48" r="1.8" fill="white" opacity="0.95" />
      <circle cx="52" cy="52" r="0.8" fill="white" opacity="0.6" />
      <circle cx="72" cy="52" r="0.8" fill="white" opacity="0.6" />
      <circle cx="47.5" cy="47.5" r="0.7" fill="white" className="animate-eye-sparkle" style={{ animationDelay: '0.5s' }} />
      <circle cx="67.5" cy="47.5" r="0.7" fill="white" className="animate-eye-sparkle" style={{ animationDelay: '2s' }} />
    </g>
  )
}

/* 김유진 과장 - 안경 쓴 여성, 정장 블라우스, 서류 들고 있음 */
function YujinSVG({ size, expression }) {
  const id = 'yujin'
  return (
    <svg width={size} height={size} viewBox="0 0 120 120" fill="none">
      <SharedDefs id={id} outfitColor="#3b5998" outfitAccent="#4a6fb5" />
      {/* 정장 블라우스 */}
      <path d="M33 98 L39 77 Q60 70 81 77 L87 98 Q60 104 33 98Z" fill={`url(#${id}-outfit)`} filter={`url(#${id}-shadow)`} />
      <path d="M44 82 Q60 75 76 82 L74 78 Q60 73 46 78Z" fill="#5a7dc0" opacity="0.6" />
      {/* 블라우스 칼라 */}
      <path d="M48 77 L54 84 L60 78 L66 84 L72 77" stroke="white" strokeWidth="1.2" fill="white" opacity="0.3" />
      {/* 가슴 포켓 */}
      <rect x="65" y="83" width="8" height="6" rx="1" stroke="#2e4a82" strokeWidth="0.5" fill="none" opacity="0.2" />
      {/* 서류 들고 있는 손 (오른쪽) */}
      <g transform="translate(82, 82)">
        <rect x="0" y="-2" width="12" height="16" rx="1" fill="#f5f0e8" stroke="#d4c8a0" strokeWidth="0.8" />
        <line x1="2" y1="2" x2="10" y2="2" stroke="#c0b080" strokeWidth="0.5" opacity="0.4" />
        <line x1="2" y1="4.5" x2="10" y2="4.5" stroke="#c0b080" strokeWidth="0.5" opacity="0.4" />
        <line x1="2" y1="7" x2="8" y2="7" stroke="#c0b080" strokeWidth="0.5" opacity="0.4" />
        {/* 손 */}
        <ellipse cx="-1" cy="4" rx="4" ry="3" fill="#f8d4b0" />
      </g>
      {/* 넥 */}
      <rect x="52" y="71" width="16" height="10" rx="5" fill={`url(#${id}-skin)`} />
      <ellipse cx="60" cy="71" rx="8" ry="2" fill="#d4a574" opacity="0.15" />
      {/* 얼굴 */}
      <ellipse cx="60" cy="50" rx="26" ry="28" fill={`url(#${id}-skin)`} />
      <path d="M36 55 Q38 68 46 74 Q60 78 74 74 Q82 68 84 55" fill="#d4a574" opacity="0.08" />
      {/* 볼터치 */}
      <ellipse cx="40" cy="57" rx="6" ry="3.5" fill="#ffb3ba" opacity="0.25" />
      <ellipse cx="80" cy="57" rx="6" ry="3.5" fill="#ffb3ba" opacity="0.25" />
      {/* 눈 */}
      <GameEyes expression={expression} eyeColor="#2c1810" id={id} />
      {/* 눈썹 */}
      <path d="M43 42 Q48 38 55 41" stroke="#2c1810" strokeWidth="2" strokeLinecap="round" fill="none" />
      <path d="M65 41 Q72 38 77 42" stroke="#2c1810" strokeWidth="2" strokeLinecap="round" fill="none" />
      {/* 코 */}
      <path d="M57 56 Q60 60 63 56" stroke="#d4a574" strokeWidth="1.2" strokeLinecap="round" fill="none" />
      <circle cx="59" cy="55" r="0.5" fill="white" opacity="0.4" />
      {/* 입 */}
      {expression === 'happy' ? (
        <g>
          <path d="M52 62 Q60 69 68 62" stroke="#d35d6e" strokeWidth="2" strokeLinecap="round" fill="#ffeedd" opacity="0.6" />
          <path d="M54 62 Q60 66 66 62" fill="#ffeedd" opacity="0.4" />
        </g>
      ) : (
        <path d="M54 63 Q60 66 66 63" stroke="#d35d6e" strokeWidth="1.5" strokeLinecap="round" fill="none" />
      )}
      {/* 머리 - 단정한 직장인 스타일 */}
      <path d="M34 48 Q32 33 38 24 Q46 16 60 14 Q74 16 82 24 Q88 33 86 48 L84 40 Q82 28 72 22 Q60 18 48 22 Q38 28 36 40Z" fill="#2c1810" />
      <path d="M36 44 Q34 34 40 26 Q48 19 60 17 Q72 19 80 26 Q86 34 84 44 L82 38 Q80 28 72 23 Q60 20 48 23 Q40 28 38 38Z" fill="#3a2518" opacity="0.5" />
      <path d="M44 22 Q52 16 62 18" stroke="white" strokeWidth="2" strokeLinecap="round" opacity="0.12" fill="none" />
      {/* 사이드 머리 (깔끔하게 넘긴 스타일) */}
      <path d="M36 48 Q35 54 36 60 Q37 58 37 52 Q36 48 36 48Z" fill="#2c1810" />
      <path d="M84 48 Q85 54 84 60 Q83 58 83 52 Q84 48 84 48Z" fill="#2c1810" />
      {/* 안경 - 고급 프레임 */}
      <g filter={`url(#${id}-shadow)`}>
        <rect x="40" y="44" width="16" height="13" rx="6" stroke="#334155" strokeWidth="2.2" fill="rgba(200,220,255,0.06)" />
        <rect x="64" y="44" width="16" height="13" rx="6" stroke="#334155" strokeWidth="2.2" fill="rgba(200,220,255,0.06)" />
        <path d="M56 50 L64 50" stroke="#334155" strokeWidth="1.8" />
        <path d="M40 49 L34 47" stroke="#334155" strokeWidth="1.5" />
        <path d="M80 49 L86 47" stroke="#334155" strokeWidth="1.5" />
        <path d="M42 46 L48 48" stroke="white" strokeWidth="0.8" opacity="0.3" strokeLinecap="round" />
        <path d="M66 46 L72 48" stroke="white" strokeWidth="0.8" opacity="0.3" strokeLinecap="round" />
      </g>
    </svg>
  )
}

/* 이태현 대리 - 안전모, 작업조끼, 바코드 스캐너 */
function TaehyunSVG({ size, expression }) {
  const id = 'taehyun'
  return (
    <svg width={size} height={size} viewBox="0 0 120 120" fill="none">
      <SharedDefs id={id} outfitColor="#e67e22" outfitAccent="#f39c12" />
      {/* 작업조끼 */}
      <path d="M30 98 L37 75 Q60 68 83 75 L90 98 Q60 105 30 98Z" fill={`url(#${id}-outfit)`} filter={`url(#${id}-shadow)`} />
      <path d="M42 80 Q60 73 78 80 L76 76 Q60 71 44 76Z" fill="#f5b041" opacity="0.5" />
      {/* 반사 스트립 (안전조끼) */}
      <path d="M38 86 Q60 80 82 86" stroke="#f0e68c" strokeWidth="2.5" opacity="0.7" fill="none" />
      <path d="M36 92 Q60 86 84 92" stroke="#f0e68c" strokeWidth="2.5" opacity="0.7" fill="none" />
      {/* 조끼 포켓 */}
      <rect x="38" y="83" width="10" height="7" rx="1.5" stroke="#bf6516" strokeWidth="0.8" fill="#d35400" opacity="0.15" />
      <rect x="72" y="83" width="10" height="7" rx="1.5" stroke="#bf6516" strokeWidth="0.8" fill="#d35400" opacity="0.15" />
      {/* 바코드 스캐너 (왼쪽 손) */}
      <g transform="translate(18, 78)">
        <rect x="0" y="0" width="6" height="14" rx="1.5" fill="#334155" />
        <rect x="-2" y="-3" width="10" height="5" rx="1" fill="#475569" />
        <rect x="0" y="-2" width="6" height="2" rx="0.5" fill="#ef4444" opacity="0.6" />
        <ellipse cx="8" cy="5" rx="4" ry="3" fill="#f8d4b0" />
      </g>
      {/* 넥 */}
      <rect x="52" y="69" width="16" height="10" rx="5" fill={`url(#${id}-skin)`} />
      {/* 얼굴 */}
      <ellipse cx="60" cy="49" rx="25" ry="27" fill={`url(#${id}-skin)`} />
      <path d="M37 54 Q39 66 47 72 Q60 76 73 72 Q81 66 83 54" fill="#d4a574" opacity="0.07" />
      <ellipse cx="41" cy="55" rx="5" ry="3" fill="#ffcccb" opacity="0.22" />
      <ellipse cx="79" cy="55" rx="5" ry="3" fill="#ffcccb" opacity="0.22" />
      <GameEyes expression={expression} eyeColor="#2c1810" id={id} />
      {/* 굵은 눈썹 */}
      <path d="M43 41 Q48 37 55 40" stroke="#4a3728" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      <path d="M65 40 Q72 37 77 41" stroke="#4a3728" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      <path d="M57 55 Q60 58 63 55" stroke="#d4a574" strokeWidth="1.2" strokeLinecap="round" fill="none" />
      {expression === 'happy' ? (
        <g>
          <path d="M51 60 Q60 68 69 60" stroke="#d35d6e" strokeWidth="2" strokeLinecap="round" fill="none" />
          <path d="M54 61 Q60 65 66 61" fill="#ffeedd" opacity="0.3" />
        </g>
      ) : (
        <path d="M53 61 Q60 64 67 61" stroke="#d35d6e" strokeWidth="1.5" strokeLinecap="round" fill="none" />
      )}
      {/* 짧은 머리 (안전모 아래) */}
      <path d="M36 46 Q38 38 43 34 L45 46Z" fill="#4a3728" />
      <path d="M75 46 Q78 38 83 34 L78 46Z" fill="#4a3728" />
      {/* 안전모 - 밝은 주황 */}
      <path d="M28 37 Q30 20 60 16 Q90 20 92 37 L88 35 Q86 22 60 19 Q34 22 32 35Z" fill="#e67e22" />
      <path d="M28 37 Q30 20 60 16 Q90 20 92 37 L88 35 Q86 22 60 19 Q34 22 32 35Z" fill="url(#taehyun-hair-shine)" />
      {/* 안전모 밴드 */}
      <path d="M28 37 Q60 31 92 37 Q60 41 28 37Z" fill="#bf6516" />
      {/* 안전모 챙 */}
      <path d="M24 38 Q60 32 96 38 Q60 44 24 38Z" fill="#e67e22" filter={`url(#${id}-shadow)`} />
      <path d="M26 38 Q60 34 94 38 Q60 37 26 38Z" fill="#f5b041" opacity="0.3" />
      {/* 안전모 꼭대기 */}
      <ellipse cx="60" cy="22" rx="3.5" ry="3" fill="#f39c12" stroke="#e67e22" strokeWidth="0.5" />
      <circle cx="59" cy="21" r="0.8" fill="white" opacity="0.3" />
      {/* 안전모 스티커 */}
      <rect x="52" y="24" width="16" height="6" rx="1" fill="white" opacity="0.15" />
      <text x="60" y="29" textAnchor="middle" fill="white" fontSize="4" fontWeight="bold" opacity="0.5">SAFETY</text>
    </svg>
  )
}

/* 박서연 사원 - 헤드셋, 깔끔한 셔츠, 밝은 미소 */
function SeoyeonSVG({ size, expression }) {
  const id = 'seoyeon'
  return (
    <svg width={size} height={size} viewBox="0 0 120 120" fill="none">
      <SharedDefs id={id} outfitColor="#e84393" outfitAccent="#fd79a8" />
      {/* 깔끔한 셔츠 */}
      <path d="M33 98 L39 77 Q60 70 81 77 L87 98 Q60 104 33 98Z" fill={`url(#${id}-outfit)`} filter={`url(#${id}-shadow)`} />
      <path d="M47 80 Q60 74 73 80 V78 Q60 73 47 78Z" fill="#ff9ec5" opacity="0.4" />
      {/* 라운드 넥 */}
      <path d="M50 77 Q60 73 70 77" stroke="white" strokeWidth="1" fill="none" opacity="0.3" />
      {/* 사원증 (목걸이형) */}
      <line x1="60" y1="77" x2="60" y2="88" stroke="#9ca3af" strokeWidth="0.8" />
      <rect x="54" y="88" width="12" height="9" rx="1.5" fill="white" stroke="#d1d5db" strokeWidth="0.6" />
      <rect x="56" y="90" width="5" height="4" rx="0.5" fill="#e84393" opacity="0.3" />
      <line x1="56" y1="95" x2="64" y2="95" stroke="#d1d5db" strokeWidth="0.4" />
      {/* 넥 */}
      <rect x="53" y="71" width="14" height="9" rx="5" fill={`url(#${id}-skin)`} />
      {/* 얼굴 */}
      <ellipse cx="60" cy="49" rx="24" ry="27" fill={`url(#${id}-skin)`} />
      <path d="M38 54 Q40 66 48 72 Q60 76 72 72 Q80 66 82 54" fill="#d4a574" opacity="0.07" />
      {/* 볼터치 (밝은) */}
      <ellipse cx="40" cy="56" rx="6" ry="4" fill="#ffb3ba" opacity="0.35" />
      <ellipse cx="80" cy="56" rx="6" ry="4" fill="#ffb3ba" opacity="0.35" />
      {/* 눈 + 속눈썹 */}
      <GameEyes expression={expression} eyeColor="#2c1810" id={id} />
      {expression !== 'happy' && (
        <g>
          <line x1="44" y1="46" x2="42" y2="42" stroke="#2c1810" strokeWidth="1.2" strokeLinecap="round" />
          <line x1="46" y1="45" x2="44.5" y2="41.5" stroke="#2c1810" strokeWidth="0.8" strokeLinecap="round" />
          <line x1="76" y1="46" x2="78" y2="42" stroke="#2c1810" strokeWidth="1.2" strokeLinecap="round" />
          <line x1="74" y1="45" x2="75.5" y2="41.5" stroke="#2c1810" strokeWidth="0.8" strokeLinecap="round" />
        </g>
      )}
      {/* 눈썹 */}
      <path d="M43 41 Q50 36 56 41" stroke="#3d2314" strokeWidth="1.5" strokeLinecap="round" fill="none" />
      <path d="M64 41 Q70 36 77 41" stroke="#3d2314" strokeWidth="1.5" strokeLinecap="round" fill="none" />
      <path d="M58 55 Q60 58 62 55" stroke="#e0c0b0" strokeWidth="1" strokeLinecap="round" fill="none" />
      {/* 밝은 미소 */}
      {expression === 'happy' ? (
        <g>
          <path d="M53 61 Q60 68 67 61" stroke="#d35d6e" strokeWidth="2" strokeLinecap="round" fill="#ffeedd" opacity="0.5" />
          <path d="M55 62 Q60 65 65 62" fill="white" opacity="0.15" />
        </g>
      ) : (
        <g>
          <path d="M55 62 Q60 65 65 62" stroke="#d35d6e" strokeWidth="1.5" strokeLinecap="round" fill="none" />
          <circle cx="58" cy="62.5" r="0.5" fill="white" opacity="0.3" />
        </g>
      )}
      {/* 머리 - 깔끔한 단발/반묶음 */}
      <path d="M36 52 Q34 34 40 24 Q48 16 60 14 Q72 16 80 24 Q86 34 84 52 L82 42 Q80 28 72 22 Q60 18 48 22 Q40 28 38 42Z" fill="#3d2314" />
      <path d="M38 46 Q36 35 42 26 Q50 18 60 16 Q70 18 78 26 Q84 35 82 46 L80 40 Q78 30 72 24 Q60 20 48 24 Q42 30 40 40Z" fill="#4d3020" opacity="0.4" />
      {/* 앞머리 */}
      <path d="M38 40 Q42 26 52 22 L46 38Z" fill="#3d2314" />
      <path d="M40 38 Q44 28 50 24 L48 36Z" fill="#4d3020" opacity="0.3" />
      <path d="M50 22 Q56 20 60 22 L54 34Z" fill="#3d2314" opacity="0.95" />
      {/* 사이드 머리 (깔끔하게) */}
      <path d="M36 52 Q34 58 35 66 Q37 64 37 56 Q36 52 36 52Z" fill="#3d2314" />
      <path d="M84 52 Q86 58 85 66 Q83 64 83 56 Q84 52 84 52Z" fill="#3d2314" />
      {/* 머리 빛 */}
      <path d="M46 20 Q54 14 64 18" stroke="white" strokeWidth="1.5" strokeLinecap="round" opacity="0.1" fill="none" />
      {/* 헤드셋 */}
      <path d="M33 44 Q31 28 60 20 Q89 28 87 44" stroke="#475569" strokeWidth="3" fill="none" />
      <path d="M33 44 Q31 28 60 20 Q89 28 87 44" stroke="#64748b" strokeWidth="1" fill="none" opacity="0.4" />
      {/* 이어컵 */}
      <ellipse cx="33" cy="49" rx="5" ry="7" fill="#334155" />
      <ellipse cx="87" cy="49" rx="5" ry="7" fill="#334155" />
      <ellipse cx="33" cy="49" rx="3" ry="5" fill="#475569" />
      <ellipse cx="87" cy="49" rx="3" ry="5" fill="#475569" />
      <ellipse cx="32" cy="47" rx="1.5" ry="2.5" fill="white" opacity="0.1" />
      <ellipse cx="86" cy="47" rx="1.5" ry="2.5" fill="white" opacity="0.1" />
      {/* 마이크 */}
      <path d="M29 52 Q26 58 28 65" stroke="#475569" strokeWidth="2" strokeLinecap="round" fill="none" />
      <circle cx="28" cy="66" r="3" fill="#334155" />
      <circle cx="28" cy="66" r="1.5" fill="#475569" />
    </svg>
  )
}

/* 최민준 주임 - 후드집업 위에 사원증, 노트북 */
function MinjunSVG({ size, expression }) {
  const id = 'minjun'
  return (
    <svg width={size} height={size} viewBox="0 0 120 120" fill="none">
      <SharedDefs id={id} outfitColor="#6c5ce7" outfitAccent="#a29bfe" />
      {/* 후드집업 */}
      <path d="M28 98 L35 73 Q60 65 85 73 L92 98 Q60 106 28 98Z" fill={`url(#${id}-outfit)`} filter={`url(#${id}-shadow)`} />
      <path d="M44 78 Q60 71 76 78 L74 74 Q60 69 46 74Z" fill="#b8b0fe" opacity="0.4" />
      {/* 후드 */}
      <path d="M35 73 Q33 58 40 48 L45 56 Q38 64 35 73Z" fill="#5b4cdb" opacity="0.35" />
      <path d="M85 73 Q87 58 80 48 L75 56 Q82 64 85 73Z" fill="#5b4cdb" opacity="0.35" />
      {/* 지퍼 라인 */}
      <line x1="60" y1="78" x2="60" y2="98" stroke="#4834d4" strokeWidth="1.5" />
      {/* 사원증 (목에 걸린) */}
      <path d="M55 78 Q50 82 48 88" stroke="#4834d4" strokeWidth="0.8" fill="none" />
      <rect x="42" y="88" width="12" height="9" rx="1.5" fill="white" stroke="#d1d5db" strokeWidth="0.6" />
      <rect x="44" y="90" width="5" height="4" rx="0.5" fill="#6c5ce7" opacity="0.3" />
      <line x1="44" y1="95" x2="52" y2="95" stroke="#d1d5db" strokeWidth="0.4" />
      {/* 노트북 (오른쪽에 끼고 있음) */}
      <g transform="translate(84, 80)">
        <rect x="0" y="0" width="14" height="10" rx="1.5" fill="#1e1b4b" stroke="#4834d4" strokeWidth="0.6" />
        <rect x="1" y="1" width="12" height="7" rx="0.5" fill="#312e81" opacity="0.6" />
        {/* 화면 빛 */}
        <rect x="2" y="2" width="5" height="2" rx="0.3" fill="#a29bfe" opacity="0.3" />
        <rect x="2" y="5" width="8" height="1" rx="0.3" fill="#a29bfe" opacity="0.2" />
        {/* 손 */}
        <ellipse cx="-2" cy="4" rx="4" ry="3" fill="#f8d4b0" />
      </g>
      {/* 넥 */}
      <rect x="52" y="69" width="16" height="8" rx="5" fill={`url(#${id}-skin)`} />
      {/* 얼굴 */}
      <ellipse cx="60" cy="49" rx="24" ry="26" fill={`url(#${id}-skin)`} />
      <path d="M38 53 Q40 64 48 70 Q60 74 72 70 Q80 64 82 53" fill="#d4a574" opacity="0.06" />
      <ellipse cx="41" cy="55" rx="4.5" ry="2.5" fill="#ffcccb" opacity="0.2" />
      <ellipse cx="79" cy="55" rx="4.5" ry="2.5" fill="#ffcccb" opacity="0.2" />
      <GameEyes expression={expression} eyeColor="#1a1a2e" id={id} />
      {/* 편한 눈썹 */}
      <path d="M44 42 L55 40.5" stroke="#1a1a2e" strokeWidth="2" strokeLinecap="round" />
      <path d="M65 40.5 L76 42" stroke="#1a1a2e" strokeWidth="2" strokeLinecap="round" />
      <path d="M58 55 Q60 57 62 55" stroke="#d4a574" strokeWidth="1" strokeLinecap="round" fill="none" />
      {expression === 'happy' ? (
        <path d="M54 60 Q60 65 66 60" stroke="#d35d6e" strokeWidth="1.5" strokeLinecap="round" fill="none" />
      ) : (
        <path d="M55 61 Q60 63 65 61" stroke="#d35d6e" strokeWidth="1.3" strokeLinecap="round" fill="none" />
      )}
      {/* 머리 - 자유분방한 스타일 */}
      <path d="M36 47 Q34 32 42 23 Q50 16 60 15 Q70 16 78 23 Q86 32 84 47 L82 39 Q80 27 72 21 Q60 17 48 21 Q40 27 38 39Z" fill="#1a1a2e" />
      <path d="M38 43 Q36 33 44 25 Q52 18 60 17 Q68 18 76 25 Q84 33 82 43 L80 37 Q78 28 72 23 Q60 19 48 23 Q42 28 40 37Z" fill="#252550" opacity="0.4" />
      {/* 삐죽삐죽 */}
      <path d="M42 20 L37 11 L48 18Z" fill="#1a1a2e" />
      <path d="M54 16 L50 7 L60 14Z" fill="#1a1a2e" />
      <path d="M64 15 L67 6 L72 16Z" fill="#1a1a2e" />
      <path d="M78 22 L85 13 L81 24Z" fill="#1a1a2e" />
      <path d="M48 19 Q56 14 64 17" stroke="white" strokeWidth="1.5" strokeLinecap="round" opacity="0.08" fill="none" />
    </svg>
  )
}

/* 정하은 대리 - 단정한 정장, 태블릿+펜 */
function HaeunSVG({ size, expression }) {
  const id = 'haeun'
  return (
    <svg width={size} height={size} viewBox="0 0 120 120" fill="none">
      <SharedDefs id={id} outfitColor="#C4A661" outfitAccent="#d4b96e" />
      {/* 단정한 정장 재킷 */}
      <path d="M33 98 L39 77 Q60 70 81 77 L87 98 Q60 104 33 98Z" fill={`url(#${id}-outfit)`} filter={`url(#${id}-shadow)`} />
      <path d="M47 80 Q60 75 73 80 V78 Q60 73 47 78Z" fill="#e8d5a0" opacity="0.4" />
      {/* 라펠 */}
      <path d="M51 77 L55 90 L60 83" stroke="#8b7535" strokeWidth="0.8" fill="none" opacity="0.3" />
      <path d="M69 77 L65 90 L60 83" stroke="#8b7535" strokeWidth="0.8" fill="none" opacity="0.3" />
      {/* 태블릿 + 펜 (왼쪽에) */}
      <g transform="translate(14, 78)">
        <rect x="0" y="0" width="14" height="18" rx="2" fill="#1a1a2e" stroke="#334155" strokeWidth="0.6" />
        <rect x="1" y="1.5" width="12" height="14" rx="0.5" fill="#1e293b" />
        {/* 화면 내용 */}
        <rect x="2.5" y="3" width="9" height="1.5" rx="0.3" fill="#C4A661" opacity="0.4" />
        <rect x="2.5" y="5.5" width="7" height="1" rx="0.3" fill="#94a3b8" opacity="0.3" />
        <rect x="2.5" y="7.5" width="8" height="1" rx="0.3" fill="#94a3b8" opacity="0.3" />
        <rect x="2.5" y="9.5" width="5" height="1" rx="0.3" fill="#C4A661" opacity="0.3" />
        {/* 스타일러스 펜 */}
        <line x1="16" y1="2" x2="18" y2="16" stroke="#C4A661" strokeWidth="1.2" strokeLinecap="round" />
        <circle cx="18" cy="17" r="0.8" fill="#8b7535" />
        {/* 손 */}
        <ellipse cx="16" cy="8" rx="4" ry="3" fill="#f8d4b0" />
      </g>
      {/* 브로치 */}
      <circle cx="60" cy="82" r="2.5" fill="#e8d5a0" />
      <circle cx="60" cy="82" r="2.5" stroke="#C4A661" strokeWidth="1" />
      <circle cx="60" cy="82" r="1.2" fill="#C4A661" />
      <circle cx="59.2" cy="81.2" r="0.5" fill="white" opacity="0.6" />
      {/* 넥 */}
      <rect x="53" y="71" width="14" height="9" rx="5" fill={`url(#${id}-skin)`} />
      {/* 얼굴 */}
      <ellipse cx="60" cy="49" rx="24" ry="27" fill={`url(#${id}-skin)`} />
      <path d="M38 54 Q40 66 48 72 Q60 76 72 72 Q80 66 82 54" fill="#d4a574" opacity="0.07" />
      <ellipse cx="40" cy="56" rx="6" ry="3.5" fill="#ffb3ba" opacity="0.28" />
      <ellipse cx="80" cy="56" rx="6" ry="3.5" fill="#ffb3ba" opacity="0.28" />
      <GameEyes expression={expression} eyeColor="#2c1810" id={id} />
      {expression !== 'happy' && (
        <g>
          <line x1="44" y1="46" x2="43" y2="43" stroke="#2c1810" strokeWidth="1" strokeLinecap="round" />
          <line x1="76" y1="46" x2="77" y2="43" stroke="#2c1810" strokeWidth="1" strokeLinecap="round" />
        </g>
      )}
      <path d="M43 42 Q50 37 56 42" stroke="#2c1810" strokeWidth="1.5" strokeLinecap="round" fill="none" />
      <path d="M64 42 Q70 37 77 42" stroke="#2c1810" strokeWidth="1.5" strokeLinecap="round" fill="none" />
      <path d="M58 55 Q60 58 62 55" stroke="#e0c0b0" strokeWidth="1" strokeLinecap="round" fill="none" />
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
      {/* 머리 - 단정한 번 */}
      <path d="M36 52 Q34 34 40 24 Q48 16 60 14 Q72 16 80 24 Q86 34 84 52 L82 42 Q80 28 72 22 Q60 18 48 22 Q40 28 38 42Z" fill="#2c1810" />
      <path d="M38 46 Q36 35 42 26 Q50 19 60 17 Q70 19 78 26 Q84 35 82 46 L80 40 Q78 30 72 24 Q60 20 48 24 Q42 30 40 40Z" fill="#3a2518" opacity="0.4" />
      <path d="M38 42 Q41 28 52 22 L46 38Z" fill="#2c1810" />
      <path d="M50 22 Q56 20 59 22 L53 34Z" fill="#2c1810" opacity="0.95" />
      {/* 번 */}
      <ellipse cx="60" cy="14" rx="11" ry="9" fill="#2c1810" />
      <ellipse cx="60" cy="14" rx="8" ry="6.5" fill="#3a2518" opacity="0.25" />
      <ellipse cx="58" cy="12" rx="3" ry="2" fill="white" opacity="0.06" />
      {/* 골드 헤어핀 */}
      <line x1="53" y1="12" x2="48" y2="7" stroke="#C4A661" strokeWidth="2" strokeLinecap="round" />
      <circle cx="47" cy="6" r="3" fill="#C4A661" />
      <circle cx="47" cy="6" r="1.5" fill="#e8d5a0" />
      <circle cx="46.3" cy="5.3" r="0.6" fill="white" opacity="0.5" />
      <path d="M46 20 Q54 14 64 18" stroke="white" strokeWidth="1.5" strokeLinecap="round" opacity="0.1" fill="none" />
      {/* 골드 귀걸이 */}
      <circle cx="36" cy="57" r="1.2" fill="#C4A661" />
      <line x1="36" y1="58.2" x2="36" y2="61" stroke="#C4A661" strokeWidth="0.8" />
      <circle cx="36" cy="62" r="1.5" fill="#e8d5a0" stroke="#C4A661" strokeWidth="0.5" />
      <circle cx="84" cy="57" r="1.2" fill="#C4A661" />
      <line x1="84" y1="58.2" x2="84" y2="61" stroke="#C4A661" strokeWidth="0.8" />
      <circle cx="84" cy="62" r="1.5" fill="#e8d5a0" stroke="#C4A661" strokeWidth="0.5" />
    </svg>
  )
}

/* 한웨이 매니저 - 중국풍 작업복, 초록 톤 */
function HanweiSVG({ size, expression }) {
  const id = 'hanwei'
  return (
    <svg width={size} height={size} viewBox="0 0 120 120" fill="none">
      <SharedDefs id={id} outfitColor="#2d8a4e" outfitAccent="#4ade80" />
      {/* 작업복 */}
      <path d="M30 98 L37 75 Q60 68 83 75 L90 98 Q60 105 30 98Z" fill={`url(#${id}-outfit)`} filter={`url(#${id}-shadow)`} />
      <path d="M42 80 Q60 73 78 80 L76 76 Q60 71 44 76Z" fill="#86efac" opacity="0.4" />
      {/* 공장 마크 (가슴) */}
      <circle cx="72" cy="84" r="5" fill="#166534" opacity="0.3" />
      <text x="72" y="86" textAnchor="middle" fill="white" fontSize="5" fontWeight="bold" opacity="0.7">工</text>
      {/* 포켓 */}
      <rect x="40" y="84" width="10" height="7" rx="1.5" stroke="#166534" strokeWidth="0.8" fill="#15803d" opacity="0.15" />
      {/* 클립보드 (오른쪽) */}
      <g transform="translate(84, 78)">
        <rect x="0" y="0" width="11" height="15" rx="1" fill="#92400e" stroke="#78350f" strokeWidth="0.5" />
        <rect x="3" y="-2" width="5" height="3" rx="0.5" fill="#78350f" />
        <rect x="1.5" y="3" width="8" height="1" rx="0.3" fill="white" opacity="0.5" />
        <rect x="1.5" y="5" width="8" height="1" rx="0.3" fill="white" opacity="0.4" />
        <rect x="1.5" y="7" width="6" height="1" rx="0.3" fill="white" opacity="0.3" />
        <rect x="1.5" y="9" width="7" height="1" rx="0.3" fill="#4ade80" opacity="0.4" />
        <ellipse cx="-2" cy="6" rx="4" ry="3" fill="#f0d4a0" />
      </g>
      {/* 넥 */}
      <rect x="52" y="69" width="16" height="10" rx="5" fill="#f0d4a0" />
      {/* 얼굴 (약간 다른 피부톤) */}
      <ellipse cx="60" cy="49" rx="25" ry="27" fill="#f0d4a0" />
      <path d="M37 54 Q39 66 47 72 Q60 76 73 72 Q81 66 83 54" fill="#c4a060" opacity="0.07" />
      <ellipse cx="41" cy="55" rx="5" ry="3" fill="#ffcccb" opacity="0.18" />
      <ellipse cx="79" cy="55" rx="5" ry="3" fill="#ffcccb" opacity="0.18" />
      <GameEyes expression={expression} eyeColor="#1a1a2e" id={id} />
      {/* 눈썹 */}
      <path d="M43 41 Q48 38 55 41" stroke="#1a1a2e" strokeWidth="2.2" strokeLinecap="round" fill="none" />
      <path d="M65 41 Q72 38 77 41" stroke="#1a1a2e" strokeWidth="2.2" strokeLinecap="round" fill="none" />
      <path d="M57 55 Q60 58 63 55" stroke="#c4a060" strokeWidth="1.2" strokeLinecap="round" fill="none" />
      {expression === 'happy' ? (
        <g>
          <path d="M51 61 Q60 68 69 61" stroke="#d35d6e" strokeWidth="2" strokeLinecap="round" fill="none" />
          <path d="M54 62 Q60 65 66 62" fill="#ffeedd" opacity="0.3" />
        </g>
      ) : (
        <path d="M53 62 Q60 65 67 62" stroke="#d35d6e" strokeWidth="1.5" strokeLinecap="round" fill="none" />
      )}
      {/* 머리 - 짧고 단정한 스타일 */}
      <path d="M36 46 Q34 32 42 23 Q50 17 60 16 Q70 17 78 23 Q86 32 84 46 L82 38 Q80 27 72 21 Q60 18 48 21 Q40 27 38 38Z" fill="#1a1a2e" />
      <path d="M38 42 Q36 33 44 25 Q52 19 60 18 Q68 19 76 25 Q84 33 82 42 L80 36 Q78 28 72 23 Q60 20 48 23 Q42 28 40 36Z" fill="#252540" opacity="0.4" />
      {/* 깔끔하게 빗은 머리 */}
      <path d="M42 22 Q50 16 60 16 Q70 16 78 22 L76 24 Q68 18 60 18 Q52 18 44 24Z" fill="#1a1a2e" />
      <path d="M44 22 Q52 17 62 18" stroke="white" strokeWidth="1.5" strokeLinecap="round" opacity="0.08" fill="none" />
    </svg>
  )
}

const svgComponents = { yujin: YujinSVG, taehyun: TaehyunSVG, seoyeon: SeoyeonSVG, minjun: MinjunSVG, haeun: HaeunSVG, hanwei: HanweiSVG }

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
