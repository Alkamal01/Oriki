'use client'

import { useState, useRef } from 'react'
import axios from 'axios'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

export default function UnifiedContribution() {
  const [mode, setMode] = useState<'simple' | 'multimodal'>('simple')
  const [formData, setFormData] = useState({
    content: '',
    culture: '',
    category: 'proverb',
    source: '',
    language: 'en'
  })
  const [audioFile, setAudioFile] = useState<File | null>(null)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [audioPreview, setAudioPreview] = useState<string | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  const [isRecording, setIsRecording] = useState(false)
  
  const audioInputRef = useRef<HTMLInputElement>(null)
  const imageInputRef = useRef<HTMLInputElement>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)

  const categories = ['proverb', 'story', 'ritual', 'medicine', 'governance', 'ethics']

  const handleAudioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setAudioFile(file)
      setAudioPreview(URL.createObjectURL(file))
    }
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImageFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder
      
      const audioChunks: Blob[] = []
      
      mediaRecorder.ondataavailable = (event) => {
        audioChunks.push(event.data)
      }
      
      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/wav' })
        const audioFile = new File([audioBlob], 'recording.wav', { type: 'audio/wav' })
        setAudioFile(audioFile)
        setAudioPreview(URL.createObjectURL(audioBlob))
        stream.getTracks().forEach(track => track.stop())
      }
      
      mediaRecorder.start()
      setIsRecording(true)
    } catch (err) {
      setError('Failed to access microphone')
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess(false)

    try {
      if (mode === 'simple') {
        // Simple text-only submission
        await axios.post(`${API_URL}/knowledge/ingest`, formData)
      } else {
        // Multi-modal submission
        const formDataToSend = new FormData()
        
        if (formData.content) formDataToSend.append('text', formData.content)
        formDataToSend.append('culture', formData.culture)
        formDataToSend.append('category', formData.category)
        if (formData.source) formDataToSend.append('source', formData.source)
        formDataToSend.append('language', formData.language)
        
        if (audioFile) formDataToSend.append('audio_file', audioFile)
        if (imageFile) formDataToSend.append('image_file', imageFile)

        await axios.post(`${API_URL}/multimodal/ingest`, formDataToSend, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        })
      }
      
      setSuccess(true)
      setFormData({
        content: '',
        culture: '',
        category: 'proverb',
        source: '',
        language: 'en'
      })
      setAudioFile(null)
      setImageFile(null)
      setAudioPreview(null)
      setImagePreview(null)
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to contribute knowledge')
    } finally {
      setLoading(false)
    }
  }

  const modalitiesCount = mode === 'simple' ? 1 : [
    formData.content ? 1 : 0,
    audioFile ? 1 : 0,
    imageFile ? 1 : 0
  ].reduce((a, b) => a + b, 0)

  return (
    <div className="bg-gradient-to-br from-white to-oriki-beige rounded-2xl shadow-2xl p-8 border-2 border-oriki-brown/20">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-oriki-copper to-oriki-gold rounded-full flex items-center justify-center text-2xl shadow-lg">
            {mode === 'simple' ? '📝' : '🎭'}
          </div>
          <div>
            <h2 className="text-3xl font-bold text-oriki-brown">
              Contribute Knowledge
            </h2>
            <p className="text-oriki-charcoal text-sm">
              {mode === 'simple' ? 'Text-based contribution' : 'Multi-modal contribution'}
            </p>
          </div>
        </div>

        {/* Mode Toggle */}
        <div className="flex bg-oriki-beige rounded-xl p-1 border-2 border-oriki-brown/20">
          <button
            type="button"
            onClick={() => setMode('simple')}
            className={`px-6 py-2 rounded-lg font-semibold transition-all ${
              mode === 'simple'
                ? 'bg-oriki-brown text-white shadow-md'
                : 'text-oriki-charcoal hover:bg-oriki-brown/10'
            }`}
          >
            📝 Simple
          </button>
          <button
            type="button"
            onClick={() => setMode('multimodal')}
            className={`px-6 py-2 rounded-lg font-semibold transition-all ${
              mode === 'multimodal'
                ? 'bg-oriki-copper text-white shadow-md'
                : 'text-oriki-charcoal hover:bg-oriki-copper/10'
            }`}
          >
            🎭 Multi-Modal
          </button>
        </div>
      </div>
      
      {/* Info Banner */}
      <div className={`mb-6 p-4 rounded-lg border-l-4 ${
        mode === 'simple'
          ? 'bg-oriki-beige border-oriki-gold'
          : 'bg-gradient-to-r from-oriki-blue/10 to-oriki-copper/10 border-oriki-blue'
      }`}>
        {mode === 'simple' ? (
          <p className="text-oriki-charcoal text-sm">
            <strong>📝 Quick Contribution:</strong> Add cultural wisdom using text only. Perfect for proverbs, quotes, and written knowledge.
          </p>
        ) : (
          <>
            <p className="text-oriki-charcoal text-sm mb-2">
              <strong>🎨 Rich Cultural Preservation:</strong> Combine text, audio, and images for comprehensive documentation.
            </p>
            <div className="flex gap-4 text-xs">
              <span className={`px-3 py-1 rounded-full ${formData.content ? 'bg-oriki-gold text-white' : 'bg-gray-200 text-gray-600'}`}>
                📝 Text
              </span>
              <span className={`px-3 py-1 rounded-full ${audioFile ? 'bg-oriki-gold text-white' : 'bg-gray-200 text-gray-600'}`}>
                🎤 Audio
              </span>
              <span className={`px-3 py-1 rounded-full ${imageFile ? 'bg-oriki-gold text-white' : 'bg-gray-200 text-gray-600'}`}>
                🖼️ Image
              </span>
            </div>
            <p className="text-xs text-oriki-brown mt-2">
              Richness: {Math.round((modalitiesCount / 3) * 100)}% • {modalitiesCount}/3 modalities
            </p>
          </>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Text Input */}
        <div>
          <label className="block text-sm font-semibold text-oriki-charcoal mb-3 flex items-center gap-2">
            <span className="text-oriki-brown">📜</span>
            Cultural Knowledge {mode === 'simple' ? '*' : '(Optional)'}
          </label>
          <textarea
            value={formData.content}
            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            placeholder="Enter a proverb, story, or traditional wisdom..."
            className="w-full px-5 py-4 border-2 border-oriki-brown/20 rounded-xl focus:ring-4 focus:ring-oriki-gold/30 focus:border-oriki-brown transition-all shadow-sm hover:shadow-md bg-white"
            rows={mode === 'simple' ? 6 : 4}
            required={mode === 'simple'}
          />
        </div>

        {/* Multi-Modal Inputs */}
        {mode === 'multimodal' && (
          <>
            {/* Audio Input */}
            <div>
              <label className="block text-sm font-semibold text-oriki-charcoal mb-3 flex items-center gap-2">
                <span className="text-oriki-brown">🎤</span>
                Oral Tradition (Optional)
              </label>
              <div className="space-y-3">
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={isRecording ? stopRecording : startRecording}
                    className={`flex-1 ${isRecording ? 'bg-red-600 hover:bg-red-700' : 'bg-oriki-blue hover:bg-oriki-blue/80'} text-white font-semibold py-3 px-6 rounded-xl transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2`}
                  >
                    {isRecording ? (
                      <>
                        <span className="animate-pulse">⏹️</span> Stop Recording
                      </>
                    ) : (
                      <>
                        🎤 Record Audio
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => audioInputRef.current?.click()}
                    className="flex-1 bg-oriki-brown/10 hover:bg-oriki-brown/20 text-oriki-brown font-semibold py-3 px-6 rounded-xl transition-all border-2 border-oriki-brown/30"
                  >
                    📁 Upload Audio
                  </button>
                  <input
                    ref={audioInputRef}
                    type="file"
                    accept="audio/*"
                    onChange={handleAudioChange}
                    className="hidden"
                  />
                </div>
                {audioPreview && (
                  <div className="p-4 bg-oriki-beige rounded-lg border border-oriki-brown/20">
                    <audio src={audioPreview} controls className="w-full" />
                    <button
                      type="button"
                      onClick={() => {
                        setAudioFile(null)
                        setAudioPreview(null)
                      }}
                      className="mt-2 text-xs text-red-600 hover:text-red-800"
                    >
                      Remove Audio
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Image Input */}
            <div>
              <label className="block text-sm font-semibold text-oriki-charcoal mb-3 flex items-center gap-2">
                <span className="text-oriki-brown">🖼️</span>
                Cultural Artifact/Symbol (Optional)
              </label>
              <div className="space-y-3">
                <button
                  type="button"
                  onClick={() => imageInputRef.current?.click()}
                  className="w-full bg-oriki-copper/10 hover:bg-oriki-copper/20 text-oriki-copper font-semibold py-3 px-6 rounded-xl transition-all border-2 border-oriki-copper/30 flex items-center justify-center gap-2"
                >
                  📷 Upload Image
                </button>
                <input
                  ref={imageInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
                {imagePreview && (
                  <div className="p-4 bg-oriki-beige rounded-lg border border-oriki-brown/20">
                    <img src={imagePreview} alt="Preview" className="w-full h-48 object-cover rounded-lg" />
                    <button
                      type="button"
                      onClick={() => {
                        setImageFile(null)
                        setImagePreview(null)
                      }}
                      className="mt-2 text-xs text-red-600 hover:text-red-800"
                    >
                      Remove Image
                    </button>
                  </div>
                )}
              </div>
            </div>
          </>
        )}

        {/* Culture & Category */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-oriki-charcoal mb-3 flex items-center gap-2">
              <span className="text-oriki-brown">🌍</span>
              Culture/Origin *
            </label>
            <input
              type="text"
              value={formData.culture}
              onChange={(e) => setFormData({ ...formData, culture: e.target.value })}
              placeholder="e.g., Yoruba (Nigeria)"
              className="w-full px-5 py-3 border-2 border-oriki-brown/20 rounded-xl focus:ring-4 focus:ring-oriki-gold/30 focus:border-oriki-brown transition-all shadow-sm hover:shadow-md bg-white"
              required
            />
          </div>

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
            placeholder="e.g., Oral tradition, Elder's teaching"
            className="w-full px-5 py-3 border-2 border-oriki-brown/20 rounded-xl focus:ring-4 focus:ring-oriki-gold/30 focus:border-oriki-brown transition-all shadow-sm hover:shadow-md bg-white"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading || !formData.culture || (mode === 'simple' && !formData.content) || (mode === 'multimodal' && modalitiesCount === 0)}
          className={`w-full bg-gradient-to-r ${
            mode === 'simple'
              ? 'from-oriki-brown to-oriki-gold hover:from-oriki-gold hover:to-oriki-copper'
              : 'from-oriki-blue to-oriki-copper hover:from-oriki-copper hover:to-oriki-gold'
          } disabled:from-gray-400 disabled:to-gray-500 text-white font-bold py-4 px-6 rounded-xl transition-all shadow-lg hover:shadow-xl hover:scale-[1.02] disabled:scale-100 disabled:cursor-not-allowed flex items-center justify-center gap-2`}
        >
          {loading && (
            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          )}
          {loading ? 'Processing...' : `Contribute ${mode === 'simple' ? 'Knowledge' : 'Multi-Modal Knowledge'}`}
        </button>

        {/* Loading State */}
        {loading && (
          <div className={`p-4 rounded-lg border ${
            mode === 'simple'
              ? 'bg-oriki-gold/10 border-oriki-gold/20'
              : 'bg-oriki-blue/10 border-oriki-blue/20'
          }`}>
            <div className="flex items-center gap-3">
              <div className="flex-shrink-0">
                <div className="animate-pulse flex space-x-1">
                  <div className={`h-2 w-2 rounded-full ${mode === 'simple' ? 'bg-oriki-gold' : 'bg-oriki-blue'}`}></div>
                  <div className={`h-2 w-2 rounded-full animation-delay-200 ${mode === 'simple' ? 'bg-oriki-gold' : 'bg-oriki-blue'}`}></div>
                  <div className={`h-2 w-2 rounded-full animation-delay-400 ${mode === 'simple' ? 'bg-oriki-gold' : 'bg-oriki-blue'}`}></div>
                </div>
              </div>
              <div className="flex-1">
                <p className={`text-sm font-medium ${mode === 'simple' ? 'text-oriki-gold' : 'text-oriki-blue'}`}>
                  Processing your contribution...
                </p>
                <p className="text-xs text-oriki-charcoal mt-1">
                  {mode === 'simple'
                    ? '📥 Ingesting → 🔐 Encoding → 💾 Storing'
                    : '🎤 Transcribing → 🖼️ Analyzing → 🔐 Encoding → 💾 Storing'
                  }
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
            ✓ Knowledge successfully preserved!
          </p>
          <p className="text-green-700 text-sm mt-1">
            {mode === 'simple'
              ? 'Your contribution has been encoded and stored on IPFS.'
              : `Your multi-modal contribution (${modalitiesCount} modalities) has been processed and stored on IPFS.`
            }
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
