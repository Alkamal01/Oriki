'use client'

import { useState } from 'react'
import QueryInterface from '@/components/QueryInterface'
import KnowledgeUpload from '@/components/KnowledgeUpload'
import ReasoningVisualizer from '@/components/ReasoningVisualizer'
import KnowledgeExplorer from '@/components/KnowledgeExplorer'
import Link from 'next/link'

export default function AppPage() {
  const [activeTab, setActiveTab] = useState<'query' | 'upload' | 'explore'>('query')
  const [reasoningResult, setReasoningResult] = useState<any>(null)

  return (
    <main className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-amber-800 to-orange-700 text-white shadow-lg">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <img 
                src="/logo.png" 
                alt="Oríkì" 
                className="h-16"
              />
              <div>
                <p className="text-amber-100 text-lg">The Ancestral Intelligence Network</p>
                <p className="text-amber-200 text-sm mt-1">Preserving cultural wisdom through decentralized AI</p>
              </div>
            </div>
            <Link 
              href="/landing"
              className="bg-white/20 hover:bg-white/30 px-6 py-2 rounded-full transition-colors"
            >
              ← Back to Home
            </Link>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white shadow-md border-b-2 border-amber-200">
        <div className="container mx-auto px-4">
          <div className="flex space-x-1">
            <button
              onClick={() => setActiveTab('query')}
              className={`px-6 py-3 font-medium transition-colors ${
                activeTab === 'query'
                  ? 'bg-amber-100 text-amber-900 border-b-2 border-amber-600'
                  : 'text-gray-600 hover:bg-amber-50'
              }`}
            >
              🔍 Query Wisdom
            </button>
            <button
              onClick={() => setActiveTab('upload')}
              className={`px-6 py-3 font-medium transition-colors ${
                activeTab === 'upload'
                  ? 'bg-amber-100 text-amber-900 border-b-2 border-amber-600'
                  : 'text-gray-600 hover:bg-amber-50'
              }`}
            >
              📝 Contribute Knowledge
            </button>
            <button
              onClick={() => setActiveTab('explore')}
              className={`px-6 py-3 font-medium transition-colors ${
                activeTab === 'explore'
                  ? 'bg-amber-100 text-amber-900 border-b-2 border-amber-600'
                  : 'text-gray-600 hover:bg-amber-50'
              }`}
            >
              🗺️ Explore
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Main Interface */}
          <div className="lg:col-span-2">
            {activeTab === 'query' && (
              <QueryInterface onResult={setReasoningResult} />
            )}
            {activeTab === 'upload' && (
              <KnowledgeUpload />
            )}
            {activeTab === 'explore' && (
              <KnowledgeExplorer />
            )}
          </div>

          {/* Right Column - Reasoning Visualizer */}
          <div className="lg:col-span-1">
            <ReasoningVisualizer result={reasoningResult} />
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-amber-900 text-amber-100 mt-16 py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="mb-2">Built for BGI25 Hackathon: AGI Without Borders</p>
          <p className="text-sm text-amber-300">
            Powered by SingularityNET • ASI Alliance • MeTTa • CUDOS • Fetch.ai
          </p>
          <p className="text-xs text-amber-400 mt-4">
            Preserving humanity's wisdom, one culture at a time
          </p>
        </div>
      </footer>
    </main>
  )
}
