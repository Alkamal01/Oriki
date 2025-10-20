'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function LandingPage() {
  const [email, setEmail] = useState('')
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleWaitlist = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle waitlist signup
    alert('Thank you for your interest! We\'ll be in touch soon.')
    setEmail('')
  }

  return (
    <div className="min-h-screen bg-oriki-beige text-oriki-charcoal">
      {/* Navigation - Glassmorphism */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-oriki-beige/95 backdrop-blur-md shadow-lg' : ''}`}>
        <div className="max-w-[1600px] mx-auto px-6 lg:px-4 xl:px-32 py-5">
          <div className="flex items-center gap-6">
            {/* Logo - Left (Outside glassmorphism) */}
            <div className="flex items-center">
              <img
                src="/logo.png"
                alt="Oríkì"
                className="h-12 lg:h-14"
              />
            </div>

            {/* Navigation Links - Center (Inside glassmorphism) */}
            <div className="flex-1 flex justify-center">
              <div className="bg-gradient-to-r from-white/80 via-white/90 to-white/80 backdrop-blur-2xl rounded-full shadow-xl border border-oriki-brown/20 px-12 py-4 hover:shadow-2xl hover:border-oriki-gold/40 hover:scale-105 transition-all duration-300 relative overflow-hidden group">
                {/* Animated background glow on hover */}
                <div className="absolute inset-0 bg-gradient-to-r from-oriki-gold/0 via-oriki-gold/10 to-oriki-gold/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                <div className="hidden md:flex items-center space-x-12 relative z-10">
                  <a href="#features" className="text-oriki-brown hover:text-oriki-gold hover:scale-110 transition-all duration-200 font-semibold text-sm relative group/link">
                    Features
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-oriki-gold to-oriki-copper group-hover/link:w-full transition-all duration-300"></span>
                  </a>
                  <a href="#vision" className="text-oriki-brown hover:text-oriki-gold hover:scale-110 transition-all duration-200 font-semibold text-sm relative group/link">
                    Vision
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-oriki-gold to-oriki-copper group-hover/link:w-full transition-all duration-300"></span>
                  </a>
                  <a href="#technology" className="text-oriki-brown hover:text-oriki-gold hover:scale-110 transition-all duration-200 font-semibold text-sm relative group/link">
                    Technology
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-oriki-gold to-oriki-copper group-hover/link:w-full transition-all duration-300"></span>
                  </a>
                  <a href="#team" className="text-oriki-brown hover:text-oriki-gold hover:scale-110 transition-all duration-200 font-semibold text-sm relative group/link">
                    Team
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-oriki-gold to-oriki-copper group-hover/link:w-full transition-all duration-300"></span>
                  </a>
                </div>
              </div>
            </div>

            {/* Launch App Button - Right (Outside glassmorphism) */}
            <div>
              <Link
                href="/app"
                className="bg-gradient-to-r from-oriki-brown to-oriki-gold text-white px-7 py-3 rounded-full hover:from-oriki-gold hover:to-oriki-copper hover:scale-110 hover:shadow-2xl transition-all duration-300 shadow-lg text-sm font-semibold whitespace-nowrap relative overflow-hidden group"
              >
                <span className="relative z-10">Launch App</span>
                {/* Shine effect on hover */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden bg-gradient-to-br from-oriki-beige to-white">
        {/* Animated Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 left-10 w-64 h-64 bg-oriki-brown rounded-full filter blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-oriki-blue rounded-full filter blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>

        <div className="max-w-[1600px] mx-auto px-6 lg:px-4 xl:px-32 relative z-10">
          <div className="grid md:grid-cols-2 gap-6 items-center">
            {/* Left Column - Text */}
            <div className="space-y-8 animate-fade-in-up">
              <div className="inline-block">
                {/* <span className="bg-oriki-brown/10 text-oriki-brown px-4 py-2 rounded-full text-sm font-medium border border-oriki-brown/30">
                  🏆 BGI25 Hackathon Winner
                </span> */}
              </div>

              <h1 className="text-5xl md:text-7xl font-bold leading-tight">
                <span className="text-oriki-brown">
                  AGI That Learns
                </span>
                <br />
                <span className="text-oriki-gold">From ALL Humanity</span>
              </h1>

              <p className="text-xl text-oriki-charcoal/80 leading-relaxed">
                Preserving ancestral wisdom through decentralized AI.
                Oríkì combines symbolic reasoning with neural networks to create
                explainable, culturally-grounded artificial intelligence.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/app"
                  className="bg-oriki-brown text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-oriki-gold transition-all transform hover:scale-105 text-center shadow-lg"
                >
                  Try Demo →
                </Link>
                <a
                  href="#vision"
                  className="border-2 border-oriki-brown text-oriki-brown px-8 py-4 rounded-full text-lg font-semibold hover:bg-oriki-brown/10 transition-all text-center"
                >
                  Learn More
                </a>
              </div>

              <div className="flex items-center space-x-8 pt-4">
                <div>
                  <div className="text-3xl font-bold text-oriki-brown">10+</div>
                  <div className="text-sm text-oriki-blue">Cultures</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-oriki-brown">1000+</div>
                  <div className="text-sm text-oriki-blue">Knowledge Entries</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-oriki-brown">100%</div>
                  <div className="text-sm text-oriki-blue">Explainable</div>
                </div>
              </div>
            </div>

            {/* Right Column - Visual */}
            <div className="relative flex items-center justify-end gap-1">
              {/* Small hero image - Animated */}
              <img
                src="/hero.png"
                alt="Oríkì - Ancestral Intelligence"
                className="w-full h-auto max-w-[150px] object-contain opacity-70 animate-float"
                style={{ animationDelay: '0.5s' }}
              />
              {/* Main hero image - Animated */}
              <img
                src="/hero.png"
                alt="Oríkì - Ancestral Intelligence"
                className="w-full h-auto max-w-[250px] object-contain animate-float"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-oriki-brown/5 border-y border-oriki-brown/20">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-oriki-brown mb-2">5+</div>
              <div className="text-oriki-blue">Continents</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-oriki-brown mb-2">50+</div>
              <div className="text-oriki-blue">Cultural Traditions</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-oriki-brown mb-2">∞</div>
              <div className="text-oriki-blue">Wisdom Preserved</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-oriki-brown mb-2">100%</div>
              <div className="text-oriki-blue">Open Source</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gradient-to-b from-white to-oriki-beige/30">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-oriki-brown">
              Revolutionary Features
            </h2>
            <p className="text-xl text-oriki-blue max-w-2xl mx-auto">
              Combining the best of symbolic AI, neural networks, and decentralized infrastructure
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 - Symbolic Reasoning */}
            <div className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-oriki-brown/10 hover:border-oriki-gold/50">
              <div className="relative h-56 overflow-hidden bg-gradient-to-br from-oriki-brown/20 to-oriki-gold/20">
                <img 
                  src="/features/feature-symbolic.jpg" 
                  alt="Symbolic Reasoning"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  onError={(e) => {
                    e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Crect fill="%23E9E1D2" width="400" height="300"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="24" fill="%238B653A"%3ESymbolic Reasoning%3C/text%3E%3C/svg%3E'
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              </div>
              <div className="p-6">
                <h3 className="text-2xl font-bold mb-3 text-oriki-brown">Symbolic Reasoning</h3>
                <p className="text-oriki-charcoal/80 leading-relaxed">
                  MeTTa-powered symbolic encoding creates transparent, explainable reasoning chains.
                  Every inference is traceable and verifiable.
                </p>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="bg-gradient-to-br from-amber-950/30 to-black p-8 rounded-2xl border border-amber-900/30 hover:border-amber-600/50 transition-all">
              <div className="w-16 h-16 bg-amber-600/20 rounded-xl flex items-center justify-center mb-6">
                <span className="text-3xl">🌐</span>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-amber-400">Decentralized Storage</h3>
              <p className="text-gray-400 leading-relaxed">
                IPFS and CUDOS ensure cultural knowledge is permanently preserved and
                community-owned, not controlled by corporations.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-gradient-to-br from-amber-950/30 to-black p-8 rounded-2xl border border-amber-900/30 hover:border-amber-600/50 transition-all">
              <div className="w-16 h-16 bg-amber-600/20 rounded-xl flex items-center justify-center mb-6">
                <span className="text-3xl">🤖</span>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-amber-400">Multi-Agent System</h3>
              <p className="text-gray-400 leading-relaxed">
                Fetch.ai-powered agents handle ingestion, encoding, reasoning, and translation
                in a coordinated, autonomous workflow.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-gradient-to-br from-amber-950/30 to-black p-8 rounded-2xl border border-amber-900/30 hover:border-amber-600/50 transition-all">
              <div className="w-16 h-16 bg-amber-600/20 rounded-xl flex items-center justify-center mb-6">
                <span className="text-3xl">🌍</span>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-amber-400">Cultural Preservation</h3>
              <p className="text-gray-400 leading-relaxed">
                Digitize and preserve endangered oral traditions, proverbs, and indigenous
                knowledge before they're lost forever.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="bg-gradient-to-br from-amber-950/30 to-black p-8 rounded-2xl border border-amber-900/30 hover:border-amber-600/50 transition-all">
              <div className="w-16 h-16 bg-amber-600/20 rounded-xl flex items-center justify-center mb-6">
                <span className="text-3xl">✨</span>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-amber-400">Explainable AI</h3>
              <p className="text-gray-400 leading-relaxed">
                No black boxes. Every reasoning step is visible, understandable, and
                grounded in cultural wisdom.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="bg-gradient-to-br from-amber-950/30 to-black p-8 rounded-2xl border border-amber-900/30 hover:border-amber-600/50 transition-all">
              <div className="w-16 h-16 bg-amber-600/20 rounded-xl flex items-center justify-center mb-6">
                <span className="text-3xl">🤝</span>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-amber-400">Community Governed</h3>
              <p className="text-gray-400 leading-relaxed">
                Cultural representatives validate knowledge. Communities decide what's shared.
                Token-based governance ensures fairness.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Vision Section */}
      <section id="vision" className="py-20 bg-gradient-to-br from-amber-950/20 to-black">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <h2 className="text-4xl md:text-5xl font-bold">
              <span className="bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent">
                Our Vision
              </span>
            </h2>

            <p className="text-2xl text-gray-300 leading-relaxed">
              "When we build AGI, we have a choice: replicate existing biases,
              or learn from ALL of humanity."
            </p>

            <div className="grid md:grid-cols-2 gap-8 pt-8">
              <div className="bg-black/50 p-8 rounded-2xl border border-amber-900/30">
                <h3 className="text-2xl font-bold mb-4 text-amber-400">The Problem</h3>
                <ul className="text-left space-y-3 text-gray-400">
                  <li className="flex items-start">
                    <span className="text-amber-600 mr-2">•</span>
                    80% of world's wisdom is oral and disappearing
                  </li>
                  <li className="flex items-start">
                    <span className="text-amber-600 mr-2">•</span>
                    Current AI ignores non-Western perspectives
                  </li>
                  <li className="flex items-start">
                    <span className="text-amber-600 mr-2">•</span>
                    Indigenous knowledge is being lost
                  </li>
                  <li className="flex items-start">
                    <span className="text-amber-600 mr-2">•</span>
                    AGI development lacks diverse foundations
                  </li>
                </ul>
              </div>

              <div className="bg-black/50 p-8 rounded-2xl border border-amber-900/30">
                <h3 className="text-2xl font-bold mb-4 text-amber-400">Our Solution</h3>
                <ul className="text-left space-y-3 text-gray-400">
                  <li className="flex items-start">
                    <span className="text-amber-600 mr-2">✓</span>
                    Preserve cultural wisdom digitally
                  </li>
                  <li className="flex items-start">
                    <span className="text-amber-600 mr-2">✓</span>
                    Make AGI learn from all cultures
                  </li>
                  <li className="flex items-start">
                    <span className="text-amber-600 mr-2">✓</span>
                    Provide transparent reasoning
                  </li>
                  <li className="flex items-start">
                    <span className="text-amber-600 mr-2">✓</span>
                    Empower Global South communities
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Technology Section */}
      <section id="technology" className="py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent">
                Powered by ASI Alliance
              </span>
            </h2>
            <p className="text-xl text-gray-400">
              Built on cutting-edge decentralized AI infrastructure
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-gradient-to-br from-purple-950/30 to-black p-6 rounded-xl border border-purple-900/30 text-center">
              <div className="text-4xl mb-4">🧬</div>
              <h3 className="text-xl font-bold mb-2 text-purple-400">MeTTa</h3>
              <p className="text-sm text-gray-400">Symbolic reasoning language</p>
            </div>

            <div className="bg-gradient-to-br from-blue-950/30 to-black p-6 rounded-xl border border-blue-900/30 text-center">
              <div className="text-4xl mb-4">🤖</div>
              <h3 className="text-xl font-bold mb-2 text-blue-400">Fetch.ai</h3>
              <p className="text-sm text-gray-400">Agent orchestration</p>
            </div>

            <div className="bg-gradient-to-br from-green-950/30 to-black p-6 rounded-xl border border-green-900/30 text-center">
              <div className="text-4xl mb-4">⚡</div>
              <h3 className="text-xl font-bold mb-2 text-green-400">CUDOS</h3>
              <p className="text-sm text-gray-400">Decentralized compute</p>
            </div>

            <div className="bg-gradient-to-br from-amber-950/30 to-black p-6 rounded-xl border border-amber-900/30 text-center">
              <div className="text-4xl mb-4">📦</div>
              <h3 className="text-xl font-bold mb-2 text-amber-400">IPFS</h3>
              <p className="text-sm text-gray-400">Permanent storage</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-amber-950/30 to-black">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center space-y-8">
            <h2 className="text-4xl md:text-5xl font-bold">
              <span className="bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent">
                Join the Movement
              </span>
            </h2>

            <p className="text-xl text-gray-300">
              Help us build AGI that represents ALL of humanity's wisdom
            </p>

            <form onSubmit={handleWaitlist} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="flex-1 px-6 py-4 rounded-full bg-black/50 border border-amber-900/30 focus:border-amber-600 focus:outline-none text-white"
                required
              />
              <button
                type="submit"
                className="bg-gradient-to-r from-amber-600 to-amber-700 px-8 py-4 rounded-full font-semibold hover:from-amber-500 hover:to-amber-600 transition-all whitespace-nowrap"
              >
                Join Waitlist
              </button>
            </form>

            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
              <Link
                href="/"
                className="bg-white text-black px-8 py-4 rounded-full font-semibold hover:bg-gray-200 transition-all"
              >
                Try Demo Now
              </Link>
              <a
                href="https://github.com/your-repo"
                target="_blank"
                rel="noopener noreferrer"
                className="border-2 border-white px-8 py-4 rounded-full font-semibold hover:bg-white/10 transition-all"
              >
                View on GitHub
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-amber-900/30">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="font-bold mb-4 text-amber-400">Product</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/" className="hover:text-amber-400">Demo</Link></li>
                <li><a href="#features" className="hover:text-amber-400">Features</a></li>
                <li><a href="#" className="hover:text-amber-400">Pricing</a></li>
                <li><a href="#" className="hover:text-amber-400">Roadmap</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-4 text-amber-400">Resources</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-amber-400">Documentation</a></li>
                <li><a href="#" className="hover:text-amber-400">API</a></li>
                <li><a href="#" className="hover:text-amber-400">Blog</a></li>
                <li><a href="#" className="hover:text-amber-400">Community</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-4 text-amber-400">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-amber-400">About</a></li>
                <li><a href="#team" className="hover:text-amber-400">Team</a></li>
                <li><a href="#" className="hover:text-amber-400">Careers</a></li>
                <li><a href="#" className="hover:text-amber-400">Contact</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-4 text-amber-400">Connect</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-amber-400">Twitter</a></li>
                <li><a href="#" className="hover:text-amber-400">Discord</a></li>
                <li><a href="#" className="hover:text-amber-400">GitHub</a></li>
                <li><a href="#" className="hover:text-amber-400">LinkedIn</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-amber-900/30 pt-8 text-center text-gray-400">
            <p>© 2025 Oríkì. Built for BGI25 Hackathon: AGI Without Borders</p>
            <p className="text-sm mt-2">Powered by SingularityNET • ASI Alliance • MeTTa • CUDOS • Fetch.ai</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
