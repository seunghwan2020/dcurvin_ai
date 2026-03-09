import { motion } from 'framer-motion'
import './CSSAvatar.css'

const avatarConfig = {
  yujin: {
    skin: '#fde8d0',
    hair: '#2c1810',
    hairStyle: 'short-neat',
    outfit: '#3b5998',
    outfitAccent: '#4a6fb5',
    accessory: 'glasses',
    eyeColor: '#2c1810',
  },
  taehyun: {
    skin: '#f5d6b8',
    hair: '#4a3728',
    hairStyle: 'cap',
    outfit: '#e67e22',
    outfitAccent: '#f39c12',
    accessory: 'cap',
    eyeColor: '#2c1810',
    capColor: '#e67e22',
  },
  seoyeon: {
    skin: '#fde8d8',
    hair: '#3d2314',
    hairStyle: 'long-wavy',
    outfit: '#e84393',
    outfitAccent: '#fd79a8',
    accessory: 'headset',
    eyeColor: '#2c1810',
  },
  minjun: {
    skin: '#f5d6c0',
    hair: '#1a1a2e',
    hairStyle: 'messy',
    outfit: '#6c5ce7',
    outfitAccent: '#a29bfe',
    accessory: 'hoodie',
    eyeColor: '#1a1a2e',
  },
  haeun: {
    skin: '#fde8d8',
    hair: '#2c1810',
    hairStyle: 'bun',
    outfit: '#C4A661',
    outfitAccent: '#d4b96e',
    accessory: 'tablet',
    eyeColor: '#2c1810',
  },
}

function Hair({ style, color, capColor }) {
  if (style === 'short-neat') {
    return (
      <div className="avatar-hair-short" style={{ background: color }}>
        <div className="avatar-hair-part" style={{ background: `linear-gradient(90deg, transparent 45%, rgba(255,255,255,0.15) 50%, transparent 55%)` }} />
      </div>
    )
  }
  if (style === 'cap') {
    return (
      <>
        <div className="avatar-hair-under-cap" style={{ background: color }} />
        <div className="avatar-cap" style={{ background: capColor || '#e67e22' }}>
          <div className="avatar-cap-brim" style={{ background: capColor || '#e67e22' }} />
        </div>
      </>
    )
  }
  if (style === 'long-wavy') {
    return (
      <div className="avatar-hair-long" style={{ background: color }}>
        <div className="avatar-hair-wave-l" style={{ background: color }} />
        <div className="avatar-hair-wave-r" style={{ background: color }} />
        <div className="avatar-hair-bangs" style={{ background: color }} />
      </div>
    )
  }
  if (style === 'messy') {
    return (
      <div className="avatar-hair-messy" style={{ background: color }}>
        <div className="avatar-hair-spike-1" style={{ background: color }} />
        <div className="avatar-hair-spike-2" style={{ background: color }} />
        <div className="avatar-hair-spike-3" style={{ background: color }} />
      </div>
    )
  }
  if (style === 'bun') {
    return (
      <div className="avatar-hair-bun-base" style={{ background: color }}>
        <div className="avatar-hair-bun-top" style={{ background: color }} />
        <div className="avatar-hair-bun-bangs" style={{ background: color }} />
      </div>
    )
  }
  return null
}

function Accessory({ type, color }) {
  if (type === 'glasses') {
    return (
      <div className="avatar-glasses">
        <div className="avatar-glasses-lens-l" />
        <div className="avatar-glasses-bridge" />
        <div className="avatar-glasses-lens-r" />
      </div>
    )
  }
  if (type === 'headset') {
    return (
      <div className="avatar-headset">
        <div className="avatar-headset-band" />
        <div className="avatar-headset-ear-l" />
        <div className="avatar-headset-ear-r" />
        <div className="avatar-headset-mic" />
      </div>
    )
  }
  return null
}

export default function CSSAvatar({ characterId, size = 'md', expression = 'neutral', onClick, className = '' }) {
  const config = avatarConfig[characterId]
  if (!config) return null

  const sizeMap = { sm: 64, md: 100, lg: 160, xl: 200 }
  const s = sizeMap[size] || 100
  const scale = s / 100

  return (
    <motion.div
      className={`avatar-container ${className}`}
      style={{ width: s, height: s * 1.3, cursor: onClick ? 'pointer' : 'default' }}
      onClick={onClick}
      whileHover={onClick ? { scale: 1.08 } : {}}
      whileTap={onClick ? { scale: 0.95 } : {}}
    >
      <div className="avatar-body" style={{ transform: `scale(${scale})`, transformOrigin: 'top center' }}>
        {/* Outfit / Body */}
        <div className="avatar-outfit" style={{ background: `linear-gradient(180deg, ${config.outfit} 0%, ${config.outfitAccent} 100%)` }}>
          <div className="avatar-collar" style={{ borderBottomColor: config.outfit }} />
          {config.accessory === 'hoodie' && (
            <div className="avatar-hoodie-strings">
              <div className="avatar-hoodie-string-l" />
              <div className="avatar-hoodie-string-r" />
            </div>
          )}
        </div>

        {/* Neck */}
        <div className="avatar-neck" style={{ background: config.skin }} />

        {/* Head */}
        <div className="avatar-head" style={{ background: config.skin }}>
          {/* Blush */}
          <div className="avatar-blush-l" />
          <div className="avatar-blush-r" />

          {/* Eyes */}
          <div className="avatar-eyes">
            <div className={`avatar-eye avatar-eye-l ${expression === 'happy' ? 'avatar-eye-happy' : ''}`}>
              <div className="avatar-pupil" style={{ background: config.eyeColor }}>
                <div className="avatar-eye-shine" />
              </div>
              <div className="avatar-eyelid" />
            </div>
            <div className={`avatar-eye avatar-eye-r ${expression === 'happy' ? 'avatar-eye-happy' : ''}`}>
              <div className="avatar-pupil" style={{ background: config.eyeColor }}>
                <div className="avatar-eye-shine" />
              </div>
              <div className="avatar-eyelid" />
            </div>
          </div>

          {/* Eyebrows */}
          <div className="avatar-eyebrows">
            <div className={`avatar-eyebrow-l ${expression === 'worried' ? 'avatar-brow-worried' : expression === 'surprised' ? 'avatar-brow-surprised' : ''}`} style={{ background: config.hair }} />
            <div className={`avatar-eyebrow-r ${expression === 'worried' ? 'avatar-brow-worried-r' : expression === 'surprised' ? 'avatar-brow-surprised' : ''}`} style={{ background: config.hair }} />
          </div>

          {/* Mouth */}
          <div className={`avatar-mouth avatar-mouth-${expression}`} />

          {/* Nose */}
          <div className="avatar-nose" />

          {/* Hair */}
          <Hair style={config.hairStyle} color={config.hair} capColor={config.capColor} />

          {/* Accessory */}
          <Accessory type={config.accessory} color={config.outfit} />
        </div>
      </div>
    </motion.div>
  )
}
