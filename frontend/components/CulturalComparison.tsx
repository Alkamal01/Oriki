'use client'

import { useState } from 'react'
import axios from 'axios'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

export default function CulturalComparison() {
  const [concept1, setConcept1] = useState('')
  const [concept2, setConcept2] = useState('')
  const [loading, setLoading] = useState(false)
  const [comparison, setComparison] = useState<any>(null)
  const [error, setError] = useState('')

  const exampleComparisons = [
    { c1: "Ubuntu (Zulu)", c2: "Ahimsa (Indian)" },
    { c1: "Harambee (Swahili)", c2: "Sankofa (Akan)" },
    { c1: "Mutunci (Hausa)", c2: "Ubuntu (Zulu)" },
  ]

  const handleCompare = async () => {
    if (!concept1.trim() || !concept2.trim()) return

    setLoading(true)
    setError('')
    setComparison(null)

    try {
      // Query both concepts
      const [response1, response2] = await Promise.all([
        axios.post(`${API_URL}/query`, { question: concept1 }),
        axios.post(`${API_URL}/query`, { question: concept2 })
      ])

      setComparison({
        concept1: {
          name: concept1,
          data: response1.data
        },
        concept2: {
          name: concept2,
          data: response2.data
        }
      })
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to compare concepts')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-gradient-to-br from-white to-oriki-beige rounded-2xl shadow-2xl p-8 border-2 border-oriki-brown/20">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-12 h-12 bg-gradient-to-br from-oriki-blue to-oriki-brown rounded-full flex items-center justify-center text-2xl shadow-lg">
          ⚖️
        </div>
        <div>
          <h2 className="text-3xl font-bold text-oriki-brown">
            Compare Cultural Wisdom
          </h2>
          <p className="text-oriki-charcoal text-sm">Discover universal truths across cultures</p>
        </div>
      </div>
      
      <p className="text-oriki-charcoal mb-6 bg-oriki-blue/10 p-4 rounded-lg border-l-4 border-oriki-blue">
        Compare wisdom from different cultures to find common ground and unique perspectives
      </p>

      {/* Input Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-sm font-semibold text-oriki-charcoal mb-3 flex items-center gap-2">
            <span className="text-oriki-brown">🌍</span>
            First Cultural Concept
          </label>
          <input
            type="text"
            value={concept1}
            onChange={(e) => setConcept1(e.target.value)}
            placeholder="e.g., Ubuntu, Ahimsa, Mutunci"
            className="w-full px-5 py-3 border-2 border-oriki-brown/20 rounded-xl focus:ring-4 focus:ring-oriki-gold/30 focus:border-oriki-brown transition-all shadow-sm hover:shadow-md bg-white"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-oriki-charcoal mb-3 flex items-center gap-2">
            <span className="text-oriki-brown">🌏</span>
            Second Cultural Concept
          </label>
          <input
            type="text"
            value={concept2}
            onChange={(e) => setConcept2(e.target.value)}
            placeholder="e.g., Harambee, Sankofa, Zaman lafiya"
            className="w-full px-5 py-3 border-2 border-oriki-brown/20 rounded-xl focus:ring-4 focus:ring-oriki-gold/30 focus:border-oriki-brown transition-all shadow-sm hover:shadow-md bg-white"
          />
        </div>
      </div>

      {/* Example Comparisons */}
      <div className="mb-6">
        <p className="text-sm font-medium text-oriki-charcoal mb-3 flex items-center gap-2">
          <span>💡</span> Try these comparisons:
        </p>
        <div className="flex flex-wrap gap-2">
          {exampleComparisons.map((ex, idx) => (
            <button
              key={idx}
              onClick={() => {
                setConcept1(ex.c1)
                setConcept2(ex.c2)
              }}
              className="text-xs bg-gradient-to-r from-oriki-beige to-white hover:from-oriki-brown/10 hover:to-oriki-gold/10 text-oriki-brown px-4 py-2 rounded-full transition-all hover:scale-105 shadow-sm hover:shadow-md border border-oriki-brown/30"
            >
              {ex.c1} vs {ex.c2}
            </button>
          ))}
        </div>
      </div>

      {/* Compare Button */}
      <button
        onClick={handleCompare}
        disabled={loading || !concept1.trim() || !concept2.trim()}
        className="w-full bg-gradient-to-r from-oriki-blue to-oriki-brown hover:from-oriki-brown hover:to-oriki-gold disabled:from-gray-400 disabled:to-gray-500 text-white font-bold py-4 px-6 rounded-xl transition-all shadow-lg hover:shadow-xl hover:scale-[1.02] disabled:scale-100 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {loading && (
          <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        )}
        {loading ? 'Comparing wisdom...' : 'Compare Concepts'}
      </button>

      {/* Loading State */}
      {loading && (
        <div className="mt-4 p-4 bg-oriki-blue/10 border border-oriki-blue/20 rounded-lg">
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0">
              <div className="animate-pulse flex space-x-1">
                <div className="h-2 w-2 bg-oriki-blue rounded-full"></div>
                <div className="h-2 w-2 bg-oriki-blue rounded-full animation-delay-200"></div>
                <div className="h-2 w-2 bg-oriki-blue rounded-full animation-delay-400"></div>
              </div>
            </div>
            <div className="flex-1">
              <p className="text-sm text-oriki-blue font-medium">Analyzing cultural wisdom...</p>
              <p className="text-xs text-oriki-charcoal mt-1">
                🔍 Searching → 🧠 Reasoning → ⚖️ Comparing
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-800 text-sm">{error}</p>
        </div>
      )}

      {/* Comparison Results */}
      {comparison && (
        <div className="mt-6 space-y-6">
          {/* Side by Side Comparison */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Concept 1 */}
            <div className="bg-gradient-to-br from-oriki-beige to-white p-6 rounded-xl border-2 border-oriki-brown/30 shadow-lg">
              <h3 className="text-xl font-bold text-oriki-brown mb-3 flex items-center gap-2">
                <span>🌍</span> {comparison.concept1.name}
              </h3>
              <p className="text-oriki-charcoal text-sm leading-relaxed mb-4">
                {comparison.concept1.data.answer}
              </p>
              {comparison.concept1.data.cultural_context && (
                <div className="mt-3">
                  <p className="text-xs font-semibold text-oriki-brown mb-2">Cultural Context:</p>
                  <div className="flex flex-wrap gap-2">
                    {comparison.concept1.data.cultural_context.map((ctx: string, idx: number) => (
                      <span key={idx} className="text-xs bg-oriki-brown/10 text-oriki-brown px-3 py-1 rounded-full">
                        {ctx}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Concept 2 */}
            <div className="bg-gradient-to-br from-oriki-beige to-white p-6 rounded-xl border-2 border-oriki-gold/30 shadow-lg">
              <h3 className="text-xl font-bold text-oriki-gold mb-3 flex items-center gap-2">
                <span>🌏</span> {comparison.concept2.name}
              </h3>
              <p className="text-oriki-charcoal text-sm leading-relaxed mb-4">
                {comparison.concept2.data.answer}
              </p>
              {comparison.concept2.data.cultural_context && (
                <div className="mt-3">
                  <p className="text-xs font-semibold text-oriki-gold mb-2">Cultural Context:</p>
                  <div className="flex flex-wrap gap-2">
                    {comparison.concept2.data.cultural_context.map((ctx: string, idx: number) => (
                      <span key={idx} className="text-xs bg-oriki-gold/10 text-oriki-gold px-3 py-1 rounded-full">
                        {ctx}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Synthesis Section */}
          <div className="bg-gradient-to-r from-oriki-blue/10 to-oriki-brown/10 p-6 rounded-xl border-2 border-oriki-blue/30">
            <h3 className="text-xl font-bold text-oriki-brown mb-3 flex items-center gap-2">
              <span>✨</span> Universal Wisdom
            </h3>
            <p className="text-oriki-charcoal leading-relaxed">
              Both <strong>{comparison.concept1.name}</strong> and <strong>{comparison.concept2.name}</strong> emphasize the interconnectedness of human experience and the importance of community values. While they emerge from different cultural contexts, they share a common thread: the recognition that individual wellbeing is inseparable from collective harmony.
            </p>
            <div className="mt-4 p-4 bg-white/50 rounded-lg">
              <p className="text-sm text-oriki-charcoal">
                <strong>Key Insight:</strong> These cultural concepts demonstrate that wisdom about human relationships and ethics transcends geographical and cultural boundaries, pointing to universal truths about our shared humanity.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
