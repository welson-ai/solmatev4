import { Navbar } from '@/components/solmate/Navbar'
import { Hero } from '@/components/solmate/Hero'
import { About } from '@/components/solmate/About'
import { HowItWorks } from '@/components/solmate/HowItWorks'
import { Protocols } from '@/components/solmate/Protocols'
import { Opportunity } from '@/components/solmate/Opportunity'

export default function Home() {
  return (
    <main className="w-full min-h-screen bg-solmate-black">
      <Navbar />
      <Hero />
      <About />
      <HowItWorks />
      <Protocols />
      <Opportunity />
      
      {/* Footer */}
      <footer className="w-full bg-solmate-black border-t border-solmate-dark-card py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            <div>
              <h4 className="text-white font-bold mb-4">Product</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="#" className="hover:text-white transition">Features</a></li>
                <li><a href="#" className="hover:text-white transition">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition">Security</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4">Developers</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="#" className="hover:text-white transition">Documentation</a></li>
                <li><a href="#" className="hover:text-white transition">API Reference</a></li>
                <li><a href="#" className="hover:text-white transition">GitHub</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4">Community</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="#" className="hover:text-white transition">Discord</a></li>
                <li><a href="#" className="hover:text-white transition">Twitter</a></li>
                <li><a href="#" className="hover:text-white transition">Blog</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4">Legal</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="#" className="hover:text-white transition">Terms</a></li>
                <li><a href="#" className="hover:text-white transition">Privacy</a></li>
                <li><a href="#" className="hover:text-white transition">Contact</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-solmate-dark-card pt-8">
            <p className="text-gray-500 text-sm text-center">
              © 2024 Solmate. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </main>
  )
}
