'use client'

import { useState } from 'react'
import axios from 'axios'
import WebResultActions from './WebResultActions'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

interface QueryInterfaceProps {
  onResult: (result: any) => void
}

export default function QueryInterface({ onResult }: QueryInterfaceProps) {
  const [question, setQuestion] = useState('')
  const [loading, setLoading] = useState(false)
  const [answer, setAnswer] = useState<any>(null)
  const [error, setError] = useState('')
  const [audioFile, setAudioFile] = useState<File | null>(null)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imageAnalysis, setImageAnalysis] = useState<string>('')
  const [processingMultimodal, setProcessingMultimodal] = useState(false)

  const exampleQuestions = [
    "What can African proverbs teach AI about fairness?",
    "How does Ubuntu philosophy inform community ethics?",
    "What wisdom do indigenous cultures offer about environmental stewardship?",
    "How can ancestral knowledge guide modern governance?"
  ]

  const handleAudioUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setAudioFile(file)
    setProcessingMultimodal(true)
    setError('')

    try {
      // Process audio to get transcription
      const formData = new FormData()
      formData.append('file', file)
      formData.append('language', 'en')

      const response = await axios.post(`${API_URL}/multimodal/process-audio`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })

      // Set the transcribed text as the question
      if (response.data.transcription) {
        setQuestion(response.data.transcription)
      }
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to process audio')
    } finally {
      setProcessingMultimodal(false)
    }
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setImageFile(file)
    setProcessingMultimodal(true)
    setError('')

    try {
      // Process image to extract text/symbols
      const formData = new FormData()
      formData.append('file', file)

      const response = await axios.post(`${API_URL}/multimodal/process-image`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })

      // Store the full analysis separately
      if (response.data.description) {
        setImageAnalysis(response.data.description)
        // Only add a brief note to the question, not the full analysis
        const briefNote = `[Image uploaded: ${file.name}]`
        if (!question.includes(briefNote)) {
          setQuestion(prev => prev ? `${prev} ${briefNote}` : `What can you tell me about this image? ${briefNote}`)
        }
      }
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to process image')
      setImageFile(null)
    } finally {
      setProcessingMultimodal(false)
    }
  }

  const clearMultimodal = () => {
    setAudioFile(null)
    setImageFile(null)
    setImageAnalysis('')
  }

  const handleQuery = async () => {
    // Allow query if we have either text or image analysis
    if (!question.trim() && !imageAnalysis) return

    setLoading(true)
    setError('')
    setAnswer(null)

    try {
      // If we have image analysis, include it in the query context
      let queryText = question.trim() || "What can you tell me about this image?"
      if (imageAnalysis) {
        // Summarize image analysis to keep query reasonable length
        const summarizedAnalysis = imageAnalysis.length > 300 
          ? imageAnalysis.substring(0, 300) + '...' 
          : imageAnalysis
        queryText = `${queryText}\n\nImage context: ${summarizedAnalysis}`
      }

      const response = await axios.post(`${API_URL}/query`, {
        question: queryText
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
    <div className="bg-gradient-to-br from-white to-oriki-beige rounded-2xl shadow-2xl p-8 border-2 border-oriki-brown/20">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-12 h-12 bg-gradient-to-br from-oriki-brown to-oriki-gold rounded-full flex items-center justify-center text-2xl shadow-lg">
          🔍
        </div>
        <div>
          <h2 className="text-3xl font-bold text-oriki-brown">
            Ask the Ancestors
          </h2>
          <p className="text-oriki-charcoal text-sm">AI-powered semantic search</p>
        </div>
      </div>
      
      <p className="text-oriki-charcoal mb-6 bg-oriki-beige p-4 rounded-lg border-l-4 border-oriki-gold">
        Query our cultural knowledge base and receive insights grounded in ancestral wisdom from diverse cultures
      </p>

      {/* Question Input */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-oriki-charcoal mb-3 flex items-center gap-2">
          <span className="text-oriki-brown">💭</span>
          Your Question
        </label>
        <div className="relative">
          <textarea
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Ask about cultural wisdom, ethics, governance, or traditional knowledge..."
            className="w-full px-5 py-4 pr-24 border-2 border-oriki-brown/20 rounded-xl focus:ring-4 focus:ring-oriki-gold/30 focus:border-oriki-brown transition-all shadow-sm hover:shadow-md bg-white"
            rows={4}
          />
          
          {/* Multimodal Upload Buttons */}
          <div className="absolute bottom-3 right-3 flex gap-2">
            {/* Audio Upload */}
            <label className="cursor-pointer group">
              <input
                type="file"
                accept="audio/*"
                onChange={handleAudioUpload}
                className="hidden"
                disabled={processingMultimodal || loading}
              />
              <div className="w-10 h-10 bg-oriki-blue/10 hover:bg-oriki-blue/20 rounded-lg flex items-center justify-center transition-all group-hover:scale-110 border border-oriki-blue/30">
                <span className="text-xl" title="Upload audio/voice">🎤</span>
              </div>
            </label>

            {/* Image Upload */}
            <label className="cursor-pointer group">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                disabled={processingMultimodal || loading}
              />
              <div className="w-10 h-10 bg-oriki-gold/10 hover:bg-oriki-gold/20 rounded-lg flex items-center justify-center transition-all group-hover:scale-110 border border-oriki-gold/30">
                <span className="text-xl" title="Upload image">📷</span>
              </div>
            </label>
          </div>
        </div>

        {/* Multimodal Status */}
        {(audioFile || imageFile || processingMultimodal) && (
          <div className="mt-2 space-y-2">
            <div className="flex items-center gap-2 text-sm">
              {processingMultimodal && (
                <span className="text-oriki-blue animate-pulse">⏳ Processing...</span>
              )}
              {audioFile && !processingMultimodal && (
                <span className="bg-oriki-blue/10 text-oriki-blue px-3 py-1 rounded-full flex items-center gap-2">
                  🎤 {audioFile.name}
                  <button onClick={clearMultimodal} className="hover:text-red-600">×</button>
                </span>
              )}
              {imageFile && !processingMultimodal && (
                <span className="bg-oriki-gold/10 text-oriki-brown px-3 py-1 rounded-full flex items-center gap-2">
                  📷 {imageFile.name}
                  <button onClick={clearMultimodal} className="hover:text-red-600">×</button>
                </span>
              )}
            </div>
            
            {/* Image Analysis Preview */}
            {imageAnalysis && !processingMultimodal && (
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-sm">
                <p className="font-semibold text-amber-900 mb-1">📷 Image Analysis:</p>
                <p className="text-amber-800 text-xs line-clamp-3">{imageAnalysis}</p>
                <p className="text-amber-600 text-xs mt-1 italic">This context will be included in your query</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Example Questions */}
      <div className="mb-6">
        <p className="text-sm font-medium text-oriki-charcoal mb-3 flex items-center gap-2">
          <span>💡</span> Try these examples:
        </p>
        <div className="flex flex-wrap gap-2">
          {exampleQuestions.map((q, idx) => (
            <button
              key={idx}
              onClick={() => setQuestion(q)}
              className="text-xs bg-gradient-to-r from-oriki-beige to-white hover:from-oriki-brown/10 hover:to-oriki-gold/10 text-oriki-brown px-4 py-2 rounded-full transition-all hover:scale-105 shadow-sm hover:shadow-md border border-oriki-brown/30"
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      {/* Submit Button */}
      <button
        onClick={handleQuery}
        disabled={loading || (!question.trim() && !imageAnalysis)}
        className="w-full bg-gradient-to-r from-oriki-brown to-oriki-gold hover:from-oriki-gold hover:to-oriki-copper disabled:from-gray-400 disabled:to-gray-500 text-white font-bold py-4 px-6 rounded-xl transition-all shadow-lg hover:shadow-xl hover:scale-[1.02] disabled:scale-100 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {loading && (
          <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        )}
        {loading ? 'Consulting the ancestors...' : 'Query Knowledge Base'}
      </button>
      
      {/* Loading State with Progress */}
      {loading && (
        <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-lg">
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0">
              <div className="animate-pulse flex space-x-1">
                <div className="h-2 w-2 bg-amber-600 rounded-full"></div>
                <div className="h-2 w-2 bg-amber-600 rounded-full animation-delay-200"></div>
                <div className="h-2 w-2 bg-amber-600 rounded-full animation-delay-400"></div>
              </div>
            </div>
            <div className="flex-1">
              <p className="text-sm text-amber-800 font-medium">Processing your query...</p>
              <p className="text-xs text-amber-600 mt-1">
                🔍 Searching knowledge base → 🧠 Reasoning with MeTTa → 🌍 Translating insights
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

          {/* Add to Knowledge Base Button (only for web results) */}
          {answer.used_web_fallback && answer.web_result_data && (
            <WebResultActions 
              webResultData={answer.web_result_data}
              originalQuery={question}
            />
          )}
        </div>
      )}
    </div>
  )
}
