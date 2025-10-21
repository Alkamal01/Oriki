'use client'

import { useState } from 'react'
import axios from 'axios'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

interface WebResultActionsProps {
  webResultData: any
  originalQuery: string
}

export default function WebResultActions({ webResultData, originalQuery }: WebResultActionsProps) {
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    content: webResultData?.answer || '',
    culture: '',
    category: 'proverb',
    source: 'Web search result'
  })

  const categories = ['proverb', 'story', 'ritual', 'medicine', 'governance', 'ethics', 'philosophy', 'art']

  const handleAddToKnowledgeBase = async () => {
    if (!formData.culture.trim()) {
      setError('Please specify the culture')
      return
    }

    setLoading(true)
    setError('')
    
    try {
      const params = new URLSearchParams({
        content: formData.content,
        culture: formData.culture,
        category: formData.category,
        source: formData.source,
        language: 'en'
      })
      
      await axios.post(`${API_URL}/knowledge/add-from-web?${params.toString()}`)
      setSuccess(true)
      setShowForm(false)
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to add to knowledge base')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
        <div className="flex items-center gap-2">
          <span className="text-green-600 text-xl">✅</span>
          <div>
            <p className="text-green-800 font-medium">Added to Knowledge Base!</p>
            <p className="text-green-700 text-sm">This wisdom is now part of our permanent collection. Thank you for contributing!</p>
          </div>
        </div>
      </div>
    )
  }

  if (!showForm) {
    return (
      <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">💾</span>
            <div>
              <p className="font-semibold text-gray-800">Help Build Our Knowledge Base</p>
              <p className="text-sm text-gray-600">Add this verified information to help future users</p>
            </div>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-lg transition-all hover:scale-105 shadow-md"
          >
            Add to Knowledge Base
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="mt-4 p-6 bg-amber-50 border border-amber-200 rounded-lg">
      <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
        <span>💾</span> Add to Knowledge Base
      </h3>
      
      <div className="space-y-4">
        {/* Content */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Content *
          </label>
          <textarea
            value={formData.content}
            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
            rows={4}
            placeholder="The cultural knowledge to preserve..."
          />
        </div>

        {/* Culture */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Culture / Origin *
          </label>
          <input
            type="text"
            value={formData.culture}
            onChange={(e) => setFormData({ ...formData, culture: e.target.value })}
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
            placeholder="e.g., Hausa, Yoruba, Igbo, etc."
          />
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Category
          </label>
          <select
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</option>
            ))}
          </select>
        </div>

        {/* Source */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Source
          </label>
          <input
            type="text"
            value={formData.source}
            onChange={(e) => setFormData({ ...formData, source: e.target.value })}
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
            placeholder="Where this knowledge comes from"
          />
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {error}
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3 pt-2">
          <button
            onClick={handleAddToKnowledgeBase}
            disabled={loading}
            className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold px-6 py-3 rounded-lg transition-all"
          >
            {loading ? 'Adding...' : 'Add to Knowledge Base'}
          </button>
          <button
            onClick={() => setShowForm(false)}
            disabled={loading}
            className="px-6 py-3 border-2 border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition-all"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}
