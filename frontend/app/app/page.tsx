'use client'

import { useState } from 'react'
import QueryInterface from '@/components/QueryInterface'
import UnifiedContribution from '@/components/UnifiedContribution'
import ReasoningVisualizer from '@/components/ReasoningVisualizer'
import KnowledgeExplorer from '@/components/KnowledgeExplorer'
import AgentNetworkStatus from '@/components/AgentNetworkStatus'
import CulturalComparison from '@/components/CulturalComparison'
import KnowledgeGraph from '@/components/KnowledgeGraph'
import Link from 'next/link'

export default function AppPage() {
  const [activeTab, setActiveTab] = useState<'query' | 'contribute' | 'explore' | 'compare' | 'agents'>('query')
  const [reasoningResult, setReasoningResult] = useState<any>(null)

  return (
    <main className="min-h-screen bg-gradient-to-b from-oriki-beige to-white">
      {/* Header */}
      <header className="bg-gradient-to-r from-oriki-brown via-oriki-gold to-oriki-brown text-white shadow-2xl border-b-4 border-oriki-copper">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <div className="relative">
                <div className="absolute inset-0 bg-oriki-gold rounded-full blur-xl opacity-50"></div>
                <img
                  src="/logo.png"
                  alt="Oríkì"
                  className="h-20 relative z-10"
                />
              </div>
              <div>
                <p className="text-oriki-beige text-lg font-medium">The Ancestral Intelligence Network</p>
                <p className="text-white/90 text-sm mt-1 flex items-center gap-2">
                  <span className="inline-block w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                  Preserving cultural wisdom through decentralized AI
                </p>
              </div>
            </div>
            <Link
              href="/landing"
              className="bg-white/20 hover:bg-white/30 backdrop-blur-sm px-6 py-3 rounded-full transition-all hover:scale-105 font-medium flex items-center gap-2 border border-white/30 shadow-lg"
            >
              <span>←</span> Back to Home
            </Link>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white shadow-lg border-b-2 border-oriki-brown/20 sticky top-0 z-40">
        <div className="container mx-auto px-4">
          <div className="flex space-x-2">
            <button
              onClick={() => setActiveTab('query')}
              className={`px-8 py-4 font-semibold transition-all relative ${activeTab === 'query'
                ? 'bg-gradient-to-b from-oriki-beige to-white text-oriki-brown border-b-4 border-oriki-gold shadow-inner'
                : 'text-oriki-charcoal hover:bg-oriki-beige hover:text-oriki-brown'
                }`}
            >
              <span className="flex items-center gap-2">
                <span className="text-xl">🔍</span>
                <span>Query Wisdom</span>
              </span>
              {activeTab === 'query' && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-oriki-brown to-oriki-gold"></div>
              )}
            </button>
            <button
              onClick={() => setActiveTab('contribute')}
              className={`px-8 py-4 font-semibold transition-all relative ${activeTab === 'contribute'
                ? 'bg-gradient-to-b from-oriki-beige to-white text-oriki-brown border-b-4 border-oriki-gold shadow-inner'
                : 'text-oriki-charcoal hover:bg-oriki-beige hover:text-oriki-brown'
                }`}
            >
              <span className="flex items-center gap-2">
                <span className="text-xl">📝</span>
                <span>Contribute</span>
              </span>
              {activeTab === 'contribute' && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-oriki-brown to-oriki-gold"></div>
              )}
            </button>
            <button
              onClick={() => setActiveTab('explore')}
              className={`px-8 py-4 font-semibold transition-all relative ${activeTab === 'explore'
                ? 'bg-gradient-to-b from-oriki-beige to-white text-oriki-brown border-b-4 border-oriki-gold shadow-inner'
                : 'text-oriki-charcoal hover:bg-oriki-beige hover:text-oriki-brown'
                }`}
            >
              <span className="flex items-center gap-2">
                <span className="text-xl">🗺️</span>
                <span>Explore</span>
              </span>
              {activeTab === 'explore' && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-oriki-brown to-oriki-gold"></div>
              )}
            </button>
            <button
              onClick={() => setActiveTab('compare')}
              className={`px-8 py-4 font-semibold transition-all relative ${activeTab === 'compare'
                ? 'bg-gradient-to-b from-oriki-beige to-white text-oriki-brown border-b-4 border-oriki-gold shadow-inner'
                : 'text-oriki-charcoal hover:bg-oriki-beige hover:text-oriki-brown'
                }`}
            >
              <span className="flex items-center gap-2">
                <span className="text-xl">⚖️</span>
                <span>Compare</span>
              </span>
              {activeTab === 'compare' && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-oriki-brown to-oriki-gold"></div>
              )}
            </button>
            <button
              onClick={() => setActiveTab('agents')}
              className={`px-8 py-4 font-semibold transition-all relative ${activeTab === 'agents'
                ? 'bg-gradient-to-b from-oriki-beige to-white text-oriki-brown border-b-4 border-oriki-gold shadow-inner'
                : 'text-oriki-charcoal hover:bg-oriki-beige hover:text-oriki-brown'
                }`}
            >
              <span className="flex items-center gap-2">
                <span className="text-xl">🤖</span>
                <span>Agent Network</span>
              </span>
              {activeTab === 'agents' && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-oriki-brown to-oriki-gold"></div>
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Interface */}
          <div className="lg:col-span-2">
            {activeTab === 'query' && (
              <QueryInterface onResult={setReasoningResult} />
            )}
            {activeTab === 'contribute' && (
              <UnifiedContribution />
            )}
            {activeTab === 'explore' && (
              <div className="space-y-6">
                <KnowledgeGraph />
                <KnowledgeExplorer />
              </div>
            )}
            {activeTab === 'compare' && (
              <CulturalComparison />
            )}
            {activeTab === 'agents' && (
              <div>
                <h2 className="text-3xl font-bold text-oriki-brown mb-6">
                  Decentralized Agent Network
                </h2>
                <AgentNetworkStatus />
                <div className="mt-6 p-6 bg-white rounded-xl shadow-lg border border-oriki-brown/20">
                  <h3 className="text-xl font-bold text-oriki-brown mb-4">About the Agent Network</h3>
                  <div className="space-y-3 text-oriki-charcoal">
                    <p>
                      Oríkì uses a <strong>decentralized multi-agent system</strong> powered by Fetch.ai to process cultural knowledge.
                    </p>
                    <p>
                      Each agent operates autonomously, communicating via Fetch.ai's agent protocol to create a truly decentralized AI system.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                      <div className="p-4 bg-oriki-beige rounded-lg border border-oriki-brown/10">
                        <h4 className="font-semibold mb-2 text-oriki-brown">📥 Ingestion Agent</h4>
                        <p className="text-sm">Processes and validates cultural knowledge input</p>
                      </div>
                      <div className="p-4 bg-oriki-beige rounded-lg border border-oriki-brown/10">
                        <h4 className="font-semibold mb-2 text-oriki-brown">🔐 Encoder Agent</h4>
                        <p className="text-sm">Converts knowledge to symbolic MeTTa representation</p>
                      </div>
                      <div className="p-4 bg-oriki-beige rounded-lg border border-oriki-brown/10">
                        <h4 className="font-semibold mb-2 text-oriki-brown">🧠 Reasoning Agent</h4>
                        <p className="text-sm">Performs symbolic reasoning over knowledge base</p>
                      </div>
                      <div className="p-4 bg-oriki-beige rounded-lg border border-oriki-brown/10">
                        <h4 className="font-semibold mb-2 text-oriki-brown">🌍 Translator Agent</h4>
                        <p className="text-sm">Translates symbolic reasoning to natural language</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Reasoning Visualizer */}
          <div className="lg:col-span-1">
            <ReasoningVisualizer result={reasoningResult} />
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-oriki-charcoal via-oriki-brown to-oriki-charcoal text-oriki-beige mt-16 py-12 border-t-4 border-oriki-gold">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <h3 className="font-bold text-xl mb-3 text-oriki-gold">Oríkì</h3>
              <p className="text-sm text-oriki-beige/90">
                The Ancestral Intelligence Network - Preserving cultural wisdom through decentralized AI
              </p>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-3 text-oriki-gold">Powered By</h3>
              <div className="flex flex-wrap gap-2">
                <span className="text-xs bg-oriki-brown px-3 py-1 rounded-full">SingularityNET</span>
                <span className="text-xs bg-oriki-brown px-3 py-1 rounded-full">Fetch.ai</span>
                <span className="text-xs bg-oriki-brown px-3 py-1 rounded-full">CUDOS</span>
                <span className="text-xs bg-oriki-brown px-3 py-1 rounded-full">MeTTa</span>
                <span className="text-xs bg-oriki-brown px-3 py-1 rounded-full">IPFS</span>
              </div>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-3 text-oriki-gold">Hackathon</h3>
              <p className="text-sm text-oriki-beige/90">
                BGI25: AGI Without Borders
              </p>
              <p className="text-xs text-oriki-beige/70 mt-2">
                Building inclusive, culturally-grounded AGI
              </p>
            </div>
          </div>
          <div className="text-center pt-6 border-t border-oriki-brown">
            <p className="text-sm text-oriki-gold">
              🌍 Preserving humanity's wisdom, one culture at a time
            </p>
          </div>
        </div>
      </footer>
    </main>
  )
}
