'use client'

import { useState } from 'react'
import axios from 'axios'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

interface QueryInterfaceProps {
  onResult: (result: any) => void
}

export default function QueryInterface({ onResult }: QueryInterfaceProps) {
  const [question, setQuestion] = useState('')
  const [loading, setLoading] = useState(false)
  const [answer, setAnswer] = useState<any>(null)
  const [error, setError] = useState('')

  const exampleQuestions = [
    "What can African proverbs teach AI about fairness?",
    "How does Ubuntu philosophy inform community ethics?",
    "What wisdom do indigenous cultures offer about environmental stewardship?",
    "How can ancestral knowledge guide modern governance?"
  ]

  const handleQuery = async () => {
    if (!question.trim()) return

    setLoading(true)
    setError('')
    setAnswer(null)

    try {
      const response = await axios.post(`${API_URL}/query`, {
        question: question
      })
      
      setAnswer(response.data)
      onResult(response.data)
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to query knowledge base')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold text-amber-900 mb-4">
        Ask the Ancestors
      </h2>
      
      <p className="text-gray-600 mb-6">
        Query our cultural knowledge base and receive insights grounded in ancestral wisdom
      </p>

      {/* Question Input */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Your Question
        </label>
        <textarea
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Ask about cultural wisdom, ethics, governance, or traditional knowledge..."
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
          rows={4}
        />
      </div>

      {/* Example Questions */}
      <div className="mb-6">
        <p className="text-sm text-gray-600 mb-2">Try these examples:</p>
        <div className="flex flex-wrap gap-2">
          {exampleQuestions.map((q, idx) => (
            <button
              key={idx}
              onClick={() => setQuestion(q)}
              className="text-xs bg-amber-50 hover:bg-amber-100 text-amber-800 px-3 py-1 rounded-full transition-colors"
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      {/* Submit Button */}
      <button
        onClick={handleQuery}
        disabled={loading || !question.trim()}
        className="w-full bg-amber-600 hover:bg-amber-700 disabled:bg-gray-400 text-white font-medium py-3 px-6 rounded-lg transition-colors"
      >
        {loading ? 'Consulting the ancestors...' : 'Query Knowledge Base'}
      </button>

      {/* Error Message */}
      {error && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-800 text-sm">{error}</p>
        </div>
      )}

      {/* Answer Display */}
      {answer && (
        <div className="mt-6 space-y-4">
          <div className="p-6 bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg border-l-4 border-amber-600">
            <h3 className="font-bold text-amber-900 mb-3 text-lg">
              Ancestral Wisdom
            </h3>
            <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">
              {answer.answer}
            </p>
          </div>

          {/* Cultural Context */}
          {answer.cultural_context && answer.cultural_context.length > 0 && (
            <div className="p-4 bg-blue-50 rounded-lg">
              <h4 className="font-semibold text-blue-900 mb-2 text-sm">
                Cultural Sources
              </h4>
              <div className="flex flex-wrap gap-2">
                {answer.cultural_context.map((context: string, idx: number) => (
                  <span
                    key={idx}
                    className="text-xs bg-blue-100 text-blue-800 px-3 py-1 rounded-full"
                  >
                    {context}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Sources */}
          {answer.sources && answer.sources.length > 0 && (
            <div className="p-4 bg-green-50 rounded-lg">
              <h4 className="font-semibold text-green-900 mb-2 text-sm">
                References
              </h4>
              <ul className="text-sm text-green-800 space-y-1">
                {answer.sources.map((source: string, idx: number) => (
                  <li key={idx}>• {source}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
