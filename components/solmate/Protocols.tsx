'use client'

import Image from 'next/image'

const protocols = [
  { name: 'Benqi', x: 50, y: 16 },
  { name: 'Trader Joe', x: 71.9, y: 24 },
  { name: 'GMX', x: 83.5, y: 44.1 },
  { name: 'Pangolin', x: 79.4, y: 67 },
  { name: 'Aave', x: 61.6, y: 81.9 },
  { name: 'Curve', x: 38.4, y: 81.9 },
  { name: 'Yield Yak', x: 20.6, y: 67 },
  { name: 'Silo', x: 16.5, y: 44.1 },
  { name: 'Balancer', x: 28.1, y: 24 },
]

export function Protocols() {
  return (
    <section id="protocols" className="w-full bg-solmate-black py-20 md:py-32 relative overflow-hidden">
      {/* Background gradient + glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-solmate-black via-[#0a1a1a] to-[#0d2d2d]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,200,150,0.15)_0%,transparent_70%)] pointer-events-none" />

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left Card Content */}
          <div
            className="p-8 md:p-12 rounded-2xl backdrop-blur-md"
            style={{ backgroundColor: 'rgba(8, 24, 20, 0.5)', border: '1px solid rgba(0, 200, 150, 0.25)', backdropFilter: 'blur(12px)' }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 leading-tight">
              All Protocols. <span className="text-[#00C896]">One Assistant.</span>
            </h2>

            <p className="text-gray-300 mb-8 leading-relaxed">
              Solmate connects to more than 9 major Avalanche protocols — monitoring positions, optimizing yield and executing strategies across the deepest liquidity in DeFi, all in one place.
            </p>

            {/* Bullet Points */}
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <span className="text-[#00C896] font-bold text-lg mt-1">—</span>
                <p className="text-gray-300">
                  <span className="font-bold text-white">Deep Protocol Coverage</span> — Benqi, Trader Joe, GMX, Pangolin, Aave, Curve, Yield Yak, Silo and Balancer
                </p>
              </div>
              <div className="flex items-start gap-4">
                <span className="text-[#00C896] font-bold text-lg mt-1">—</span>
                <p className="text-gray-300">
                  <span className="font-bold text-white">One Interface</span> — manage every position, swap, and yield strategy from a single AI-powered assistant
                </p>
              </div>
            </div>
          </div>

          {/* Right - Assistant at center network */}
          <div className="hidden md:flex relative w-full h-[480px] items-center justify-center">
            {/* Connection lines */}
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
              <defs>
                <marker id="pulseArrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto">
                  <path d="M0 0 L10 5 L0 10 z" fill="#00C896" />
                </marker>
              </defs>
              {protocols.map((p) => (
                <line
                  key={p.name}
                  x1={p.x}
                  y1={p.y}
                  x2="50"
                  y2="50"
                  stroke="#00C896"
                  strokeWidth="0.35"
                  strokeDasharray="2.2 18"
                  strokeLinecap="round"
                  className="animate-pump-flow"
                  strokeOpacity="0.55"
                  markerEnd="url(#pulseArrow)"
                />
              ))}
            </svg>

{protocols.map((p, i) => (
                <div
                  key={p.name}
                  className="absolute flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/50 backdrop-blur border border-[#00C896]/25 text-white text-xs font-medium hover:border-[#00C896]/70 hover:text-[#00C896] hover:scale-110 transition-all animate-chip-in"
                  style={{ left: `${p.x}%`, top: `${p.y}%`, transform: 'translate(-50%, -50%)', animationDelay: `${i * 120}ms` }}
                >
                <span className="w-1.5 h-1.5 rounded-full bg-[#00C896]" />
                {p.name}
              </div>
            ))}

            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center">
              <div className="absolute w-44 h-44 rounded-full border border-dashed border-[#00C896]/40 animate-flywheel-spin" />
              <div className="absolute w-32 h-32 rounded-full border border-[#00C896]/25 animate-flywheel-spin" style={{ animationDirection: 'reverse' }} />
              <div className="absolute w-24 h-24 rounded-full border border-[#00C896]/50 animate-ping-ring" />
              <div className="relative w-28 h-28 animate-heartbeat">
                <div className="absolute -inset-2 rounded-full bg-[#00C896]/30 blur-lg animate-glow-pulse" />
                <div
                  className="relative w-full h-full rounded-full overflow-hidden flex items-center justify-center"
                  style={{ backgroundColor: 'rgba(2, 12, 10, 0.9)', border: '1px solid rgba(0, 200, 150, 0.7)' }}
                >
                  <Image
                    src="/assets/logo.png"
                    alt="Solmate logo"
                    width={112}
                    height={112}
                    className="w-full h-full object-contain p-2"
                  />
                </div>
              </div>
              <span className="absolute top-full mt-4 text-[#00C896] font-bold text-sm tracking-[0.2em]">SOLMATE</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}