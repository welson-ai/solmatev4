'use client'

import { AnimatedFlywheel } from './AnimatedFlywheel'

export function HowItWorks() {
  return (
    <section id="how-it-works" className="w-full bg-gradient-to-br from-solmate-black via-[#0a1a1a] to-[#0d2d2d] py-20 md:py-32 relative overflow-hidden">
      {/* Enhanced green glow background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,200,150,0.2)_0%,transparent_70%)] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Section Label */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-2 leading-tight">
            The <span className="text-[#00C896]">Intelligence</span> <span className="text-[#00C896]">Loop</span>™
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Our AI monitors your positions continuously and suggests optimizations in real-time
          </p>
        </div>

        {/* Content Grid with Flywheel in Middle */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
          {/* Left Content */}
          <div className="text-center md:text-right">
            <h3 className="text-2xl font-bold text-white mb-4">Monitor Positions in Real-Time</h3>
            <p className="text-gray-400 leading-relaxed">
              Our AI continuously analyzes market conditions, yield opportunities, and protocol health 
              across Avalanche's entire DeFi ecosystem to find the best opportunities for your portfolio.
            </p>
          </div>

          {/* Animated Flywheel - Center Column */}
          <div className="flex justify-center">
            <AnimatedFlywheel />
          </div>

          {/* Right Content */}
          <div className="text-center md:text-left">
            <h3 className="text-2xl font-bold text-white mb-4">Execute Yield Strategies</h3>
            <p className="text-gray-400 leading-relaxed">
              When optimizations are identified, Solmate suggests strategies that maximize your returns 
              while maintaining your risk profile. You always have complete control and approval.
            </p>
          </div>
        </div>

        {/* User Approval Section - Below Wheel */}
        <div className="text-center mt-16">
          <p className="text-solmate-green font-bold text-lg">User Approves Every Transaction</p>
          <p className="text-gray-400 leading-relaxed max-w-md mx-auto mt-3">
            You maintain complete control. Every optimization suggestion requires your approval before execution.
          </p>
        </div>
      </div>
    </section>
  )
}
