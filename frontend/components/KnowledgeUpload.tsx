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
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold text-amber-900 mb-4">
        Contribute Cultural Knowledge
      </h2>
      
      <p className="text-gray-600 mb-6">
        Help preserve ancestral wisdom by adding proverbs, stories, and traditional knowledge
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Content */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Cultural Knowledge *
          </label>
          <textarea
            value={formData.content}
            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            placeholder="Enter a proverb, story, or traditional wisdom..."
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
            rows={6}
            required
          />
        </div>

        {/* Culture */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Culture/Origin *
          </label>
          <input
            type="text"
            value={formData.culture}
            onChange={(e) => setFormData({ ...formData, culture: e.target.value })}
            placeholder="e.g., Yoruba (Nigeria), Akan (Ghana), Quechua (Peru)"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
            required
          />
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Category *
          </label>
          <select
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
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
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Source (Optional)
          </label>
          <input
            type="text"
            value={formData.source}
            onChange={(e) => setFormData({ ...formData, source: e.target.value })}
            placeholder="e.g., Oral tradition, Elder's teaching, Historical text"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-amber-600 hover:bg-amber-700 disabled:bg-gray-400 text-white font-medium py-3 px-6 rounded-lg transition-colors"
        >
          {loading ? 'Processing...' : 'Contribute Knowledge'}
        </button>
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
