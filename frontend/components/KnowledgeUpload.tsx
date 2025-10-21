'use client'

import { useState } from 'react'
import axios from 'axios'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

export default function KnowledgeUpload() {
  const [formData, setFormData] = useState({
    content: '',
    culture: '',
    category: 'proverb',
    source: '',
    language: 'en'
  })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const categories = ['proverb', 'story', 'ritual', 'medicine', 'governance', 'ethics']

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess(false)

    try {
      await axios.post(`${API_URL}/knowledge/ingest`, formData)
      setSuccess(true)
      setFormData({
        content: '',
        culture: '',
        category: 'proverb',
        source: '',
        language: 'en'
      })
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to upload knowledge')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-gradient-to-br from-white to-oriki-beige rounded-2xl shadow-2xl p-8 border-2 border-oriki-brown/20">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-12 h-12 bg-gradient-to-br from-oriki-copper to-oriki-gold rounded-full flex items-center justify-center text-2xl shadow-lg">
          📝
        </div>
        <div>
          <h2 className="text-3xl font-bold text-oriki-brown">
            Contribute Knowledge
          </h2>
          <p className="text-oriki-charcoal text-sm">Share ancestral wisdom</p>
        </div>
      </div>
      
      <p className="text-oriki-charcoal mb-6 bg-oriki-beige p-4 rounded-lg border-l-4 border-oriki-copper">
        Help preserve ancestral wisdom by adding proverbs, stories, and traditional knowledge to our decentralized network
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Content */}
        <div>
          <label className="block text-sm font-semibold text-oriki-charcoal mb-3 flex items-center gap-2">
            <span className="text-oriki-brown">📜</span>
            Cultural Knowledge *
          </label>
          <textarea
            value={formData.content}
            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            placeholder="Enter a proverb, story, or traditional wisdom..."
            className="w-full px-5 py-4 border-2 border-oriki-brown/20 rounded-xl focus:ring-4 focus:ring-oriki-gold/30 focus:border-oriki-brown transition-all shadow-sm hover:shadow-md bg-white"
            rows={6}
            required
          />
        </div>

        {/* Culture */}
        <div>
          <label className="block text-sm font-semibold text-oriki-charcoal mb-3 flex items-center gap-2">
            <span className="text-oriki-brown">🌍</span>
            Culture/Origin *
          </label>
          <input
            type="text"
            value={formData.culture}
            onChange={(e) => setFormData({ ...formData, culture: e.target.value })}
            placeholder="e.g., Yoruba (Nigeria), Akan (Ghana), Quechua (Peru)"
            className="w-full px-5 py-3 border-2 border-oriki-brown/20 rounded-xl focus:ring-4 focus:ring-oriki-gold/30 focus:border-oriki-brown transition-all shadow-sm hover:shadow-md bg-white"
            required
          />
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-semibold text-oriki-charcoal mb-3 flex items-center gap-2">
            <span className="text-oriki-brown">🏷️</span>
            Category *
          </label>
          <select
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            className="w-full px-5 py-3 border-2 border-oriki-brown/20 rounded-xl focus:ring-4 focus:ring-oriki-gold/30 focus:border-oriki-brown transition-all shadow-sm hover:shadow-md bg-white"
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </option>
            ))}
          </select>
        </div>

        {/* Source */}
        <div>
          <label className="block text-sm font-semibold text-oriki-charcoal mb-3 flex items-center gap-2">
            <span className="text-oriki-brown">📚</span>
            Source (Optional)
          </label>
          <input
            type="text"
            value={formData.source}
            onChange={(e) => setFormData({ ...formData, source: e.target.value })}
            placeholder="e.g., Oral tradition, Elder's teaching, Historical text"
            className="w-full px-5 py-3 border-2 border-oriki-brown/20 rounded-xl focus:ring-4 focus:ring-oriki-gold/30 focus:border-oriki-brown transition-all shadow-sm hover:shadow-md bg-white"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-oriki-copper to-oriki-gold hover:from-oriki-gold hover:to-oriki-brown disabled:from-gray-400 disabled:to-gray-500 text-white font-bold py-4 px-6 rounded-xl transition-all shadow-lg hover:shadow-xl hover:scale-[1.02] disabled:scale-100 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {loading && (
            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          )}
          {loading ? 'Processing...' : 'Contribute Knowledge'}
        </button>
        
        {/* Loading State */}
        {loading && (
          <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="flex-shrink-0">
                <div className="animate-pulse flex space-x-1">
                  <div className="h-2 w-2 bg-amber-600 rounded-full"></div>
                  <div className="h-2 w-2 bg-amber-600 rounded-full animation-delay-200"></div>
                  <div className="h-2 w-2 bg-amber-600 rounded-full animation-delay-400"></div>
                </div>
              </div>
              <div className="flex-1">
                <p className="text-sm text-amber-800 font-medium">Processing your contribution...</p>
                <p className="text-xs text-amber-600 mt-1">
                  📥 Ingesting → 🔐 Encoding to MeTTa → 💾 Storing on IPFS
                </p>
              </div>
            </div>
          </div>
        )}
      </form>

      {/* Success Message */}
      {success && (
        <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-green-800 font-medium">
            ✓ Knowledge successfully added to the ancestral network!
          </p>
          <p className="text-green-700 text-sm mt-1">
            Your contribution has been encoded symbolically and stored on IPFS.
          </p>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-800 text-sm">{error}</p>
        </div>
      )}
    </div>
  )
}
