'use client'

import { LogoMark } from './LogoMark'

export function AnimatedFlywheel() {
  return (
    <div className="relative w-80 h-80 flex items-center justify-center">
      {/* Glowing Outer Circle - Added */}
      <svg
        width={360}
        height={360}
        viewBox="0 0 360 360"
        className="absolute animate-spin-slow"
        style={{
          filter: 'drop-shadow(0 0 30px rgba(0, 200, 150, 0.9))',
          left: '-20px',
          top: '-20px',
          animationDirection: 'reverse',
          transformOrigin: '180px 180px',
        }}
      >
        <defs>
          <linearGradient id="glowGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00C896" />
            <stop offset="100%" stopColor="#00A876" />
          </linearGradient>
        </defs>

        {/* Glowing outer circle */}
        <circle
          cx="180"
          cy="180"
          r="175"
          fill="none"
          stroke="url(#glowGradient)"
          strokeWidth="4"
          opacity="1"
        />

        {/* Enhanced moving elements on outer circle */}
        <g className="animate-spin-slow" style={{ transformOrigin: '180px 180px', animationDirection: 'reverse' }}>
          {/* Larger glowing dots */}
          <circle cx="180" cy="5" r="6" fill="#00C896" opacity="1" filter="drop-shadow(0 0 8px rgba(0, 200, 150, 0.8))" />
          <circle cx="355" cy="180" r="6" fill="#00C896" opacity="1" filter="drop-shadow(0 0 8px rgba(0, 200, 150, 0.8))" />
          <circle cx="180" cy="355" r="6" fill="#00C896" opacity="1" filter="drop-shadow(0 0 8px rgba(0, 200, 150, 0.8))" />
          <circle cx="5" cy="180" r="6" fill="#00C896" opacity="1" filter="drop-shadow(0 0 8px rgba(0, 200, 150, 0.8))" />
          
          {/* Diagonal elements */}
          <circle cx="260" cy="100" r="4" fill="#00C896" opacity="0.7" />
          <circle cx="100" cy="100" r="4" fill="#00C896" opacity="0.7" />
          <circle cx="260" cy="260" r="4" fill="#00C896" opacity="0.7" />
          <circle cx="100" cy="260" r="4" fill="#00C896" opacity="0.7" />
        </g>

        {/* Arc segments for movement effect */}
        <g className="animate-spin-slow" style={{ transformOrigin: '180px 180px', animationDirection: 'reverse' }}>
          <path d="M 180 10 A 170 170 0 0 1 350 180" stroke="#00C896" strokeWidth="3" fill="none" opacity="0.6" />
          <path d="M 350 180 A 170 170 0 0 1 180 350" stroke="#00C896" strokeWidth="3" fill="none" opacity="0.6" />
        </g>
      </svg>

      {/* Original Spinning Wheel - Untouched */}
      <svg
        width={320}
        height={320}
        viewBox="0 0 320 320"
        className="absolute animate-spin-slow"
        style={{
          filter: 'drop-shadow(0 0 30px rgba(0, 200, 150, 0.3))',
          transformOrigin: '160px 160px',
        }}
      >
        <defs>
          <linearGradient id="arrowGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00C896" />
            <stop offset="100%" stopColor="#00A876" />
          </linearGradient>
        </defs>

        {/* Background circle */}
        <circle
          cx="160"
          cy="160"
          r="150"
          fill="none"
          stroke="#00C896"
          strokeWidth="1"
          opacity="0.3"
        />

        {/* Arrow 1 - Top */}
        <path
          d="M 160 20 Q 220 60 240 120"
          fill="none"
          stroke="url(#arrowGradient)"
          strokeWidth="3"
          strokeLinecap="round"
          markerEnd="url(#arrowhead)"
        />
        {/* Arrowhead for Arrow 1 */}
        <defs>
          <marker
            id="arrowhead"
            markerWidth="10"
            markerHeight="10"
            refX="9"
            refY="3"
            orient="auto"
          >
            <polygon points="0 0, 10 3, 0 6" fill="#00C896" />
          </marker>
        </defs>

        {/* Arrow 2 - Right */}
        <path
          d="M 240 120 Q 260 180 200 240"
          fill="none"
          stroke="url(#arrowGradient)"
          strokeWidth="3"
          strokeLinecap="round"
          markerEnd="url(#arrowhead)"
        />

        {/* Arrow 3 - Left */}
        <path
          d="M 200 240 Q 100 260 80 160"
          fill="none"
          stroke="url(#arrowGradient)"
          strokeWidth="3"
          strokeLinecap="round"
          markerEnd="url(#arrowhead)"
        />

        {/* Center circle */}
        <circle
          cx="160"
          cy="160"
          r="80"
          fill="rgba(0, 200, 150, 0.05)"
          stroke="#00C896"
          strokeWidth="2"
        />
      </svg>

      {/* Connection Lines - Added */}
      <svg
        width={700}
        height={500}
        viewBox="0 0 700 500"
        className="absolute"
        style={{ left: '-190px', top: '-90px' }}
      >
        <defs>
          <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#00C896" stopOpacity="0.2" />
            <stop offset="30%" stopColor="#00C896" stopOpacity="0.6" />
            <stop offset="70%" stopColor="#00C896" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#00C896" stopOpacity="0.2" />
          </linearGradient>
        </defs>

        {/* Left outlet - to Monitor Positions */}
        <path
          d="M 180 200 L 80 200"
          fill="none"
          stroke="url(#lineGradient)"
          strokeWidth="3"
          strokeLinecap="round"
          opacity="0.8"
        />

        {/* Right outlet - to Execute Yield Strategies */}
        <path
          d="M 180 200 L 280 200"
          fill="none"
          stroke="url(#lineGradient)"
          strokeWidth="3"
          strokeLinecap="round"
          opacity="0.8"
        />

        {/* Bottom outlet - to User Approval */}
        <path
          d="M 180 200 L 180 350"
          fill="none"
          stroke="url(#lineGradient)"
          strokeWidth="3"
          strokeLinecap="round"
          opacity="0.8"
        />
      </svg>

      {/* Center Logo */}
      <div className="absolute z-10 flex items-center justify-center">
        <LogoMark size={80} />
      </div>
    </div>
  )
}
