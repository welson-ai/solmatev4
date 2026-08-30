'use client'

import { Brain, Shield, Zap } from 'lucide-react'

export function About() {
  const features = [
    {
      icon: Brain,
      title: 'Always Watching, Always Optimizing',
      description: 'Advanced AI monitors your positions across 9+ Avalanche protocols 24/7 — identifying yield opportunities the moment they appear.',
    },
    {
      icon: Shield,
      title: 'Your Keys. Your Assets. Always.',
      description: 'Solmate never holds your funds or has custody. Every transaction requires your explicit approval — you stay in full control.',
    },
    {
      icon: Zap,
      title: 'Execute at Avalanche Speed.',
      description: 'Sub-second transaction finality, fees under $0.10. Solmate executes strategies faster than any manual trade — at a fraction of the cost.',
    },
  ]

  return (
    <section id="about" className="w-full bg-white pt-8 pb-20 md:pt-12 md:pb-32 rounded-section-top rounded-section-bottom">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Label */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-black mb-6 leading-tight">
            Built for DeFi. <span className="text-[#00C896]">Powered by AI.</span>
          </h2>
          <p className="text-gray-600 text-lg max-w-[600px] mx-auto opacity-70 leading-relaxed">
            One intelligent assistant connecting you to the deepest 
            liquidity across Avalanche DeFi — monitoring positions, executing 
            yield strategies, and compounding your returns across Benqi, 
            Trader Joe, GMX, Pangolin, Aave and more. All automatically, 
            all with you in control.
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <div
                key={index}
                className="relative group h-full"
              >
                {/* Card */}
                <div className="p-8 border-l-4 border-solmate-green hover:bg-gray-50 transition h-full flex flex-col">
                  <div className="mb-4">
                    <Icon className="w-10 h-10 text-[#00C896]" strokeWidth={2.5} />
                  </div>
                  <h3 className="text-xl font-bold text-black mb-3">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed flex-grow">{feature.description}</p>
                </div>
                
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
