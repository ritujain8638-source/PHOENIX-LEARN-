import React from 'react';

interface PhoenixSVGProps {
  size?: number;
  animated?: boolean;
  mood?: 'idle' | 'happy' | 'excited' | 'thinking';
}

const PhoenixSVG: React.FC<PhoenixSVGProps> = ({
  size = 120,
  animated = true,
  mood = 'idle',
}) => {
  const id = React.useId().replace(/:/g, '');

  const wingSpread = mood === 'excited' ? 1.15 : 1;
  const headTilt = mood === 'thinking' ? 'rotate(-12 85 48)' : 'rotate(0)';

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 160 160"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Phoenix character"
      style={{ overflow: 'visible' }}
    >
      <defs>
        {/* ── Gradients ── */}
        <radialGradient id={`bodyGrad-${id}`} cx="50%" cy="45%" r="55%">
          <stop offset="0%" stopColor="#c0392b" />
          <stop offset="60%" stopColor="#922b21" />
          <stop offset="100%" stopColor="#641e16" />
        </radialGradient>

        <linearGradient id={`wingGradL-${id}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f39c12" />
          <stop offset="40%" stopColor="#e67e22" />
          <stop offset="100%" stopColor="#c0392b" />
        </linearGradient>

        <linearGradient id={`wingGradR-${id}`} x1="100%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#f1c40f" />
          <stop offset="40%" stopColor="#f39c12" />
          <stop offset="100%" stopColor="#e74c3c" />
        </linearGradient>

        <linearGradient id={`tailGrad-${id}`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#e74c3c" />
          <stop offset="50%" stopColor="#f39c12" />
          <stop offset="100%" stopColor="#f1c40f" stopOpacity="0.3" />
        </linearGradient>

        <linearGradient id={`crownGrad-${id}`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#f1c40f" />
          <stop offset="100%" stopColor="#e67e22" />
        </linearGradient>

        <radialGradient id={`eyeGrad-${id}`} cx="35%" cy="35%" r="60%">
          <stop offset="0%" stopColor="#fff9c4" />
          <stop offset="40%" stopColor="#f1c40f" />
          <stop offset="100%" stopColor="#f39c12" />
        </radialGradient>

        <radialGradient id={`eyeGlow-${id}`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#f1c40f" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#f39c12" stopOpacity="0" />
        </radialGradient>

        <radialGradient id={`emberGlow-${id}`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#f1c40f" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#e74c3c" stopOpacity="0" />
        </radialGradient>

        {/* ── Filters ── */}
        <filter id={`wingGlow-${id}`} x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        <filter id={`eyeGlowFilter-${id}`} x="-80%" y="-80%" width="360%" height="360%">
          <feGaussianBlur stdDeviation="2.5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        <filter id={`bodyGlow-${id}`} x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        {/* ── Animations ── */}
        {animated && (
          <style>{`
            @keyframes phoenixWingPulse-${id} {
              0%, 100% { transform: scaleY(1) scaleX(1); }
              50%       { transform: scaleY(1.06) scaleX(1.04); }
            }
            @keyframes phoenixFloat-${id} {
              0%, 100% { transform: translateY(0px); }
              50%       { transform: translateY(-4px); }
            }
            @keyframes phoenixEyeGlow-${id} {
              0%, 100% { opacity: 0.7; }
              50%       { opacity: 1; }
            }
            @keyframes phoenixTipFlicker-${id} {
              0%, 100% { opacity: 1;   transform: scaleY(1); }
              30%       { opacity: 0.7; transform: scaleY(0.88); }
              60%       { opacity: 0.9; transform: scaleY(1.08); }
            }
            @keyframes phoenixEmberSpin-${id} {
              0%   { transform: rotate(0deg)   scale(1); }
              50%  { transform: rotate(180deg) scale(1.1); }
              100% { transform: rotate(360deg) scale(1); }
            }
            @keyframes happyBob-${id} {
              0%, 100% { transform: translateY(0px) rotate(0deg); }
              25%       { transform: translateY(-3px) rotate(2deg); }
              75%       { transform: translateY(-3px) rotate(-2deg); }
            }
            .phoenix-body-${id} {
              animation: phoenixFloat-${id} 3s ease-in-out infinite;
            }
            .phoenix-wing-${id} {
              transform-origin: 80px 80px;
              animation: phoenixWingPulse-${id} 2.5s ease-in-out infinite;
            }
            .phoenix-eye-glow-${id} {
              animation: phoenixEyeGlow-${id} 1.8s ease-in-out infinite;
            }
            .phoenix-tip-${id} {
              animation: phoenixTipFlicker-${id} 1.2s ease-in-out infinite;
            }
            .phoenix-tip-${id}:nth-child(2) { animation-delay: 0.2s; }
            .phoenix-tip-${id}:nth-child(3) { animation-delay: 0.4s; }
            .phoenix-ember-${id} {
              animation: phoenixEmberSpin-${id} 4s linear infinite;
              transform-origin: 80px 80px;
            }
            ${mood === 'happy' ? `
              .phoenix-body-${id} {
                animation: happyBob-${id} 0.6s ease-in-out infinite;
              }
            ` : ''}
          `}</style>
        )}
      </defs>

      {/* ══════════════════════════════════ */}
      {/*  AMBIENT EMBER PARTICLES          */}
      {/* ══════════════════════════════════ */}
      {animated && (
        <g className={`phoenix-ember-${id}`} opacity="0.5">
          <circle cx="22" cy="115" r="2.5" fill="#f1c40f" opacity="0.7" />
          <circle cx="135" cy="108" r="1.8" fill="#e67e22" opacity="0.6" />
          <circle cx="30" cy="95" r="1.4" fill="#f39c12" opacity="0.5" />
          <circle cx="128" cy="95" r="2" fill="#e74c3c" opacity="0.5" />
        </g>
      )}

      {/* ══════════════════════════════════ */}
      {/*  TAIL PLUMES                      */}
      {/* ══════════════════════════════════ */}
      <g className={animated ? `phoenix-body-${id}` : ''}>
        {/* Central tail plume */}
        <path
          d="M80 128 C74 140 70 152 72 160 C76 155 80 148 80 160 C80 148 84 155 88 160 C90 152 86 140 80 128Z"
          fill={`url(#tailGrad-${id})`}
          opacity="0.9"
        />
        {/* Left tail plume */}
        <path
          d="M75 130 C65 142 58 154 62 162 C67 156 70 148 69 158 C74 150 76 142 75 130Z"
          fill={`url(#tailGrad-${id})`}
          opacity="0.75"
        />
        {/* Right tail plume */}
        <path
          d="M85 130 C95 142 102 154 98 162 C93 156 90 148 91 158 C86 150 84 142 85 130Z"
          fill={`url(#tailGrad-${id})`}
          opacity="0.75"
        />
        {/* Outer left plume */}
        <path
          d="M70 132 C56 146 50 160 55 168 C60 160 62 150 60 162 C66 152 68 144 70 132Z"
          fill={`url(#tailGrad-${id})`}
          opacity="0.5"
        />
        {/* Outer right plume */}
        <path
          d="M90 132 C104 146 110 160 105 168 C100 160 98 150 100 162 C94 152 92 144 90 132Z"
          fill={`url(#tailGrad-${id})`}
          opacity="0.5"
        />

        {/* ══════════════════════════════════ */}
        {/*  LEFT WING                        */}
        {/* ══════════════════════════════════ */}
        <g
          className={animated ? `phoenix-wing-${id}` : ''}
          transform={`scale(${wingSpread} 1)`}
          style={{ transformOrigin: '80px 85px' }}
          filter={`url(#wingGlow-${id})`}
        >
          {/* Main left wing body */}
          <path
            d="M76 88 C60 80 38 68 20 58 C10 52 4 46 8 42 C14 36 28 44 40 50 C28 40 22 30 28 26 C34 22 46 34 56 46 C46 32 44 20 52 18 C60 16 66 30 70 46 C66 28 68 14 76 14 C84 14 84 30 82 48 C84 32 90 20 96 24 C100 26 98 38 94 52 C94 52 88 72 80 88Z"
            fill={`url(#wingGradL-${id})`}
            opacity="0.95"
          />
          {/* Left wing accent feathers */}
          <path
            d="M56 46 C44 38 32 30 24 28 C18 26 14 28 16 32 C20 28 28 32 38 38Z"
            fill="#f1c40f"
            opacity="0.6"
          />
          <path
            d="M44 52 C30 46 16 42 10 44 C6 46 6 50 10 52 C14 48 22 48 34 52Z"
            fill="#f1c40f"
            opacity="0.45"
          />

          {/* Left wing flame tips */}
          <g className={animated ? `phoenix-tip-${id}` : ''}>
            <path d="M8 42 C2 36 -2 28 2 22 C6 28 8 34 8 42Z" fill="#f1c40f" opacity="0.8" />
          </g>
          <g className={animated ? `phoenix-tip-${id}` : ''}>
            <path d="M28 26 C22 18 20 8 26 4 C28 10 28 18 28 26Z" fill="#f39c12" opacity="0.7" />
          </g>
          <g className={animated ? `phoenix-tip-${id}` : ''}>
            <path d="M52 18 C48 10 48 0 54 -2 C56 4 54 12 52 18Z" fill="#f1c40f" opacity="0.75" />
          </g>
          <g className={animated ? `phoenix-tip-${id}` : ''}>
            <path d="M76 14 C74 6 76 -4 82 -6 C82 2 80 8 76 14Z" fill="#fff176" opacity="0.7" />
          </g>
          <g className={animated ? `phoenix-tip-${id}` : ''}>
            <path d="M96 24 C96 14 100 4 106 2 C104 10 100 18 96 24Z" fill="#f1c40f" opacity="0.65" />
          </g>
        </g>

        {/* ══════════════════════════════════ */}
        {/*  RIGHT WING                       */}
        {/* ══════════════════════════════════ */}
        <g
          className={animated ? `phoenix-wing-${id}` : ''}
          transform={`scale(${wingSpread} 1)`}
          style={{ transformOrigin: '80px 85px' }}
          filter={`url(#wingGlow-${id})`}
        >
          {/* Main right wing body */}
          <path
            d="M84 88 C100 80 122 68 140 58 C150 52 156 46 152 42 C146 36 132 44 120 50 C132 40 138 30 132 26 C126 22 114 34 104 46 C114 32 116 20 108 18 C100 16 94 30 90 46 C94 28 92 14 84 14 C76 14 76 30 78 48 C76 32 70 20 64 24 C60 26 62 38 66 52 C66 52 72 72 80 88Z"
            fill={`url(#wingGradR-${id})`}
            opacity="0.88"
          />
          {/* Right wing accent feathers */}
          <path
            d="M104 46 C116 38 128 30 136 28 C142 26 146 28 144 32 C140 28 132 32 122 38Z"
            fill="#f1c40f"
            opacity="0.55"
          />
          <path
            d="M116 52 C130 46 144 42 150 44 C154 46 154 50 150 52 C146 48 138 48 126 52Z"
            fill="#f1c40f"
            opacity="0.4"
          />

          {/* Right wing flame tips */}
          <g className={animated ? `phoenix-tip-${id}` : ''}>
            <path d="M152 42 C158 36 162 28 158 22 C154 28 152 34 152 42Z" fill="#f1c40f" opacity="0.75" />
          </g>
          <g className={animated ? `phoenix-tip-${id}` : ''}>
            <path d="M132 26 C138 18 140 8 134 4 C132 10 132 18 132 26Z" fill="#f39c12" opacity="0.65" />
          </g>
          <g className={animated ? `phoenix-tip-${id}` : ''}>
            <path d="M108 18 C112 10 112 0 106 -2 C104 4 106 12 108 18Z" fill="#f1c40f" opacity="0.7" />
          </g>
        </g>

        {/* ══════════════════════════════════ */}
        {/*  BODY                             */}
        {/* ══════════════════════════════════ */}
        <ellipse
          cx="80"
          cy="96"
          rx="18"
          ry="28"
          fill={`url(#bodyGrad-${id})`}
          filter={`url(#bodyGlow-${id})`}
        />
        {/* Breast highlight */}
        <ellipse cx="77" cy="90" rx="8" ry="12" fill="#e74c3c" opacity="0.4" />
        {/* Breast feather sheen */}
        <path
          d="M72 85 C74 82 78 82 80 85 C78 88 74 88 72 85Z"
          fill="#c0392b"
          opacity="0.5"
        />
        <path
          d="M72 91 C74 88 80 88 82 91 C80 94 74 94 72 91Z"
          fill="#a93226"
          opacity="0.4"
        />
        <path
          d="M73 97 C75 94 81 94 83 97 C81 100 75 100 73 97Z"
          fill="#922b21"
          opacity="0.3"
        />

        {/* ══════════════════════════════════ */}
        {/*  NECK & HEAD                      */}
        {/* ══════════════════════════════════ */}
        {/* Neck */}
        <path
          d="M76 76 C74 70 74 64 78 60 C82 56 86 58 88 64 C90 70 88 76 84 78Z"
          fill={`url(#bodyGrad-${id})`}
        />

        {/* HEAD (with mood transform) */}
        <g transform={headTilt}>
          {/* Head shape */}
          <ellipse
            cx="85"
            cy="52"
            rx="15"
            ry="13"
            fill={`url(#bodyGrad-${id})`}
            filter={`url(#bodyGlow-${id})`}
          />

          {/* ── CROWN FEATHERS ── */}
          <path
            d="M80 40 C78 30 80 22 84 18 C86 24 84 32 80 40Z"
            fill={`url(#crownGrad-${id})`}
          />
          <path
            d="M85 39 C86 29 90 22 94 20 C94 26 91 34 85 39Z"
            fill={`url(#crownGrad-${id})`}
            opacity="0.9"
          />
          <path
            d="M75 41 C72 32 72 24 76 20 C78 26 78 34 75 41Z"
            fill="#e67e22"
            opacity="0.8"
          />
          <path
            d="M90 40 C93 31 98 25 102 24 C100 30 96 37 90 40Z"
            fill="#f39c12"
            opacity="0.7"
          />

          {/* ── BEAK ── */}
          <path
            d="M99 52 C104 50 108 52 106 55 C103 57 99 56 99 52Z"
            fill="#f39c12"
          />
          <path
            d="M99 54 C104 53 107 55 105 57 C102 58 99 57 99 54Z"
            fill="#e67e22"
            opacity="0.8"
          />

          {/* ── EYE ── */}
          {/* Eye glow aura */}
          <circle
            cx="91"
            cy="50"
            r="7"
            fill={`url(#eyeGlow-${id})`}
            className={animated ? `phoenix-eye-glow-${id}` : ''}
            filter={`url(#eyeGlowFilter-${id})`}
          />
          {/* Eye white/iris */}
          <circle cx="91" cy="50" r="4.5" fill={`url(#eyeGrad-${id})`} />
          {/* Pupil */}
          <circle cx="92" cy="50" r="2" fill="#1a0a00" />
          {/* Pupil highlight */}
          <circle cx="93" cy="49" r="0.7" fill="white" opacity="0.9" />
          {/* Eye rim */}
          <circle cx="91" cy="50" r="4.5" fill="none" stroke="#f1c40f" strokeWidth="0.8" opacity="0.7" />

          {/* ── EYE MARKING ── */}
          <path
            d="M86 47 C88 45 92 45 94 47"
            stroke="#e67e22"
            strokeWidth="1"
            fill="none"
            opacity="0.6"
          />

          {/* ── HAPPY SMILE ── */}
          {mood === 'happy' && (
            <path
              d="M97 55 C100 57 102 57 104 55"
              stroke="#f39c12"
              strokeWidth="1.2"
              fill="none"
              strokeLinecap="round"
              opacity="0.7"
            />
          )}
        </g>

        {/* ══════════════════════════════════ */}
        {/*  TALONS / FEET                    */}
        {/* ══════════════════════════════════ */}
        {/* Left leg */}
        <path
          d="M74 122 C72 126 70 130 68 132 M70 130 C66 132 64 134 62 136 M70 130 C68 134 68 138 70 140 M70 130 C72 134 74 138 74 140"
          stroke="#922b21"
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
        />
        {/* Right leg */}
        <path
          d="M86 122 C88 126 90 130 92 132 M90 130 C94 132 96 134 98 136 M90 130 C92 134 92 138 90 140 M90 130 C88 134 86 138 86 140"
          stroke="#922b21"
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
        />
      </g>

      {/* ══════════════════════════════════ */}
      {/*  FLAME AURA (bottom glow)         */}
      {/* ══════════════════════════════════ */}
      <ellipse
        cx="80"
        cy="138"
        rx="22"
        ry="6"
        fill={`url(#emberGlow-${id})`}
        opacity={animated ? 0.6 : 0.3}
        className={animated ? `phoenix-eye-glow-${id}` : ''}
      />
    </svg>
  );
};

export default PhoenixSVG;
