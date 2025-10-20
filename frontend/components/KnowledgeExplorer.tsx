'use client'

import { useState, useEffect } from 'react'
import axios from 'axios'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

export default function KnowledgeExplorer() {
  const [knowledge, setKnowledge] = useState<any[]>([])
  const [cultures, setCultures] = useState<string[]>([])
  const [selectedCulture, setSelectedCulture] = useState<string>('')
  const [loading, setLoading] = useState(true)
  const [selectedItem, setSelectedItem] = useState<any>(null)

  useEffect(() => {
    loadData()
  }, [selectedCulture])

  const loadData = async () => {
    setLoading(true)
    try {
      const [knowledgeRes, culturesRes] = await Promise.all([
        axios.get(`${API_URL}/knowledge/list`, {
          params: selectedCulture ? { culture: selectedCulture } : {}
        }),
        axios.get(`${API_URL}/cultures`)
      ])
      
      setKnowledge(knowledgeRes.data.knowledge || [])
      setCultures(culturesRes.data.cultures || [])
    } catch (err) {
      console.error('Failed to load knowledge', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold text-amber-900 mb-4">
        Explore Cultural Knowledge
      </h2>

      {/* Culture Filter */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Filter by Culture
        </label>
        <select
          value={selectedCulture}
          onChange={(e) => setSelectedCulture(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
        >
          <option value="">All Cultures</option>
          {cultures.map(culture => (
            <option key={culture} value={culture}>{culture}</option>
          ))}
        </select>
      </div>

      {/* Knowledge List */}
      {loading ? (
        <p className="text-center text-gray-500 py-8">Loading knowledge...</p>
      ) : knowledge.length === 0 ? (
        <p className="text-center text-gray-500 py-8">No knowledge entries found</p>
      ) : (
        <div className="space-y-3">
          {knowledge.map((item, idx) => (
            <div
              key={idx}
              onClick={() => setSelectedItem(item)}
              className="p-4 border border-gray-200 rounded-lg hover:border-amber-400 hover:bg-amber-50 cursor-pointer transition-all"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs bg-amber-100 text-amber-800 px-2 py-1 rounded">
                      {item.culture}
                    </span>
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                      {item.category}
                    </span>
                  </div>
                  <p className="text-sm text-gray-800 line-clamp-2">
                    {item.content}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Selected Item Modal */}
      {selectedItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto p-6">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-bold text-amber-900">
                Cultural Knowledge Detail
              </h3>
              <button
                onClick={() => setSelectedItem(null)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ×
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Culture</p>
                <p className="text-gray-900">{selectedItem.culture}</p>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Category</p>
                <p className="text-gray-900">{selectedItem.category}</p>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Content</p>
                <p className="text-gray-900 leading-relaxed">{selectedItem.content}</p>
              </div>

              {selectedItem.source && (
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Source</p>
                  <p className="text-gray-900">{selectedItem.source}</p>
                </div>
              )}

              {selectedItem.symbolic_representation && (
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">
                    Symbolic Representation (MeTTa)
                  </p>
                  <pre className="text-xs bg-gray-100 p-3 rounded overflow-x-auto">
                    {selectedItem.symbolic_representation}
                  </pre>
                </div>
              )}

              {selectedItem.ipfs_hash && (
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">IPFS Hash</p>
                  <p className="text-xs text-gray-700 font-mono break-all">
                    {selectedItem.ipfs_hash}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
