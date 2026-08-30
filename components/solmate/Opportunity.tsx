'use client'

import Image from 'next/image'

export function Opportunity() {
  return (
    <section id="opportunity" className="w-full py-24 relative overflow-hidden">
      {/* ROW 1 - WHITE BACKGROUND */}
      <div className="relative bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-24">
          <div className="space-y-6 md:w-1/2 md:pr-16 min-h-[400px] flex flex-col justify-center">
              {/* Small green uppercase label */}
              <p className="text-[#00C896] font-bold text-sm tracking-widest">THE OPPORTUNITY</p>
              
              {/* Large bold dark heading */}
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
                The Capital of Capital.
              </h2>

              {/* Subtext */}
              <p className="text-gray-900/75 text-lg max-w-[500px] leading-relaxed">
                Capital flows to where it works hardest. Solmate puts yours 
                at the front of the line.
              </p>

              {/* 4 Stat Cards in a row */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {/* Card 1 */}
                <div className="p-4 rounded-lg border border-[#00C896]/30 bg-white hover:shadow-lg hover:shadow-[#00C896]/20 transition-all hover:scale-105">
                  <div className="text-2xl md:text-3xl font-bold text-[#00C896] mb-1">$2B+</div>
                  <div className="text-xs md:text-sm text-gray-700">Avalanche DeFi TVL</div>
                </div>
                
                {/* Card 2 */}
                <div className="p-4 rounded-lg border border-[#00C896]/30 bg-white hover:shadow-lg hover:shadow-[#00C896]/20 transition-all hover:scale-105">
                  <div className="text-2xl md:text-3xl font-bold text-[#00C896] mb-1">10–30%</div>
                  <div className="text-xs md:text-sm text-gray-700">APY Across Top Pools</div>
                </div>
                
                {/* Card 3 */}
                <div className="p-4 rounded-lg border border-[#00C896]/30 bg-white hover:shadow-lg hover:shadow-[#00C896]/20 transition-all hover:scale-105">
                  <div className="text-2xl md:text-3xl font-bold text-[#00C896] mb-1">$50M+</div>
                  <div className="text-xs md:text-sm text-gray-700">Daily Trader Joe Volume</div>
                </div>
                
                {/* Card 4 */}
                <div className="p-4 rounded-lg border border-[#00C896]/30 bg-white hover:shadow-lg hover:shadow-[#00C896]/20 transition-all hover:scale-105">
                  <div className="text-2xl md:text-3xl font-bold text-[#00C896] mb-1">{'<1s'}</div>
                  <div className="text-xs md:text-sm text-gray-700">Transaction Finality</div>
                </div>
              </div>
        </div>

        {/* RIGHT SIDE - Image - stretches to bottom & right edges */}
        <div className="hidden md:block absolute top-0 -bottom-px right-0 w-1/2">
          <Image
            src="/assets/cm.png"
            alt="The Capital of Capital"
            fill
            className="object-cover"
            quality={85}
          />
        </div>
      </div>
      </div>

      {/* ROW 2 - DARK BLACK BACKGROUND */}
      <div className="bg-[#050505] pt-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 min-h-[400px]">
            {/* LEFT SIDE - Image */}
            <div className="hidden md:block relative min-h-[400px] bg-white">
              <Image
                src="/assets/yield.png"
                alt="Stop leaving yield on the table"
                fill
                className="object-cover"
                quality={85}
              />
            </div>

            {/* RIGHT SIDE - Text Content */}
            <div className="space-y-6 px-6 md:pl-16 py-12 flex flex-col justify-center">
              {/* Small green uppercase label */}
              <p className="text-[#00C896] font-bold text-sm tracking-widest">YOUR EDGE</p>
              
              {/* Large bold white heading */}
              <h2 className="text-4xl md:text-5xl font-bold text-white leading-tight">
                Stop Leaving Yield On The Table.
              </h2>

              {/* Subtext */}
              <p className="text-white/75 text-lg max-w-[500px] leading-relaxed">
                Solmate monitors every position, executes the best strategy 
                and compounds your returns — while you do nothing.
              </p>

              {/* 4 Stat Cards in a row */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {/* Card 1 */}
                <div className="p-4 rounded-lg border border-[#00C896]/20 bg-black/50 hover:bg-black/70 transition-all hover:scale-105 hover:shadow-lg hover:shadow-[#00C896]/20">
                  <div className="text-2xl md:text-3xl font-bold text-[#00C896] mb-1">10–30%</div>
                  <div className="text-xs md:text-sm text-white/80">APY Available</div>
                </div>
                
                {/* Card 2 */}
                <div className="p-4 rounded-lg border border-[#00C896]/20 bg-black/50 hover:bg-black/70 transition-all hover:scale-105 hover:shadow-lg hover:shadow-[#00C896]/20">
                  <div className="text-2xl md:text-3xl font-bold text-[#00C896] mb-1">24/7</div>
                  <div className="text-xs md:text-sm text-white/80">Autonomous Monitoring</div>
                </div>
                
                {/* Card 3 */}
                <div className="p-4 rounded-lg border border-[#00C896]/20 bg-black/50 hover:bg-black/70 transition-all hover:scale-105 hover:shadow-lg hover:shadow-[#00C896]/20">
                  <div className="text-2xl md:text-3xl font-bold text-[#00C896] mb-1">9+</div>
                  <div className="text-xs md:text-sm text-white/80">Protocols Working For You</div>
                </div>
                
                {/* Card 4 */}
                <div className="p-4 rounded-lg border border-[#00C896]/20 bg-black/50 hover:bg-black/70 transition-all hover:scale-105 hover:shadow-lg hover:shadow-[#00C896]/20">
                  <div className="text-2xl md:text-3xl font-bold text-[#00C896] mb-1">100%</div>
                  <div className="text-xs md:text-sm text-white/80">Non-Custodial</div>
                </div>
              </div>

              {/* Green CTA button */}
              <div className="flex justify-center mt-8">
                <button className="px-8 py-3 bg-[#00C896] text-black font-bold rounded-full text-lg hover:bg-[#00a878] transition transform hover:scale-105 shadow-lg">
                  Launch App
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
