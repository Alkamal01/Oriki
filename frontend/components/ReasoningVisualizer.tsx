'use client'

import { motion } from 'framer-motion'

interface ReasoningVisualizerProps {
  result: any
}

const stepIcons: { [key: string]: string } = {
  identify_relevant_knowledge: '🔍',
  extract_symbolic_patterns: '🔐',
  apply_reasoning_rules: '🧠',
  synthesize_conclusion: '✨',
}

export default function ReasoningVisualizer({ result }: ReasoningVisualizerProps) {
  if (!result) {
    return (
      <div className="bg-gradient-to-br from-white to-oriki-beige rounded-2xl shadow-2xl p-6 border-2 border-oriki-brown/20 sticky top-24">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-gradient-to-br from-oriki-blue to-oriki-brown rounded-full flex items-center justify-center text-xl shadow-lg">
            🧠
          </div>
          <h3 className="text-2xl font-bold text-oriki-brown">
            Reasoning Chain
          </h3>
        </div>
        
        <div className="text-center py-12">
          <div className="w-20 h-20 bg-oriki-beige rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-4xl">💭</span>
          </div>
          <p className="text-oriki-charcoal/60">
            Submit a query to see the transparent reasoning process
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-gradient-to-br from-white to-oriki-beige rounded-2xl shadow-2xl p-6 border-2 border-oriki-brown/20 sticky top-24">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-gradient-to-br from-oriki-blue to-oriki-brown rounded-full flex items-center justify-center text-xl shadow-lg animate-pulse">
          🧠
        </div>
        <div>
          <h3 className="text-2xl font-bold text-oriki-brown">
            Reasoning Chain
          </h3>
          <p className="text-xs text-oriki-charcoal">Transparent AI Process</p>
        </div>
      </div>
      
      <p className="text-sm text-oriki-charcoal mb-4 bg-oriki-blue/10 p-3 rounded-lg border-l-4 border-oriki-blue">
        <strong>Symbolic Reasoning:</strong> Watch how MeTTa logic connects cultural wisdom
      </p>

      {/* Animated Reasoning Steps */}
      <div className="space-y-3 mb-6">
        {result.reasoning_chain && result.reasoning_chain.map((step: any, idx: number) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.2, duration: 0.5 }}
            className="relative"
          >
            {/* Connection Line */}
            {idx < result.reasoning_chain.length - 1 && (
              <div className="absolute left-5 top-12 w-0.5 h-8 bg-gradient-to-b from-oriki-gold to-oriki-copper"></div>
            )}
            
            <div className="border-l-4 border-oriki-gold pl-4 py-3 bg-gradient-to-r from-oriki-beige to-white rounded-r-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="flex items-start gap-3">
                <motion.span 
                  className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-oriki-brown to-oriki-gold text-white rounded-full flex items-center justify-center text-lg font-bold shadow-lg"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  {stepIcons[step.action] || step.step}
                </motion.span>
                <div className="flex-1">
                  <p className="font-bold text-sm text-oriki-brown mb-1">
                    {step.action.replace(/_/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())}
                  </p>
                  <p className="text-xs text-oriki-charcoal leading-relaxed">
                    {step.result}
                  </p>
                  {step.details && Array.isArray(step.details) && step.details.length > 0 && (
                    <motion.div 
                      className="mt-2 flex flex-wrap gap-1"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: idx * 0.2 + 0.3 }}
                    >
                      {step.details.slice(0, 3).map((detail: any, i: number) => (
                        <span
                          key={i}
                          className="text-xs bg-oriki-gold/20 text-oriki-brown px-2 py-1 rounded-full border border-oriki-gold/30"
                        >
                          {typeof detail === 'string' ? detail : JSON.stringify(detail).slice(0, 30)}
                        </span>
                      ))}
                    </motion.div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Reasoning Stats */}
      <motion.div 
        className="pt-4 border-t-2 border-oriki-brown/20"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
      >
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-gradient-to-br from-oriki-blue/20 to-oriki-blue/10 rounded-lg p-3 border border-oriki-blue/30">
            <p className="text-3xl font-bold text-oriki-blue">
              {result.reasoning_chain?.length || 0}
            </p>
            <p className="text-xs text-oriki-charcoal font-medium">Reasoning Steps</p>
          </div>
          <div className="bg-gradient-to-br from-oriki-copper/20 to-oriki-copper/10 rounded-lg p-3 border border-oriki-copper/30">
            <p className="text-3xl font-bold text-oriki-copper">
              {result.sources?.length || 0}
            </p>
            <p className="text-xs text-oriki-charcoal font-medium">Cultural Sources</p>
          </div>
        </div>
      </motion.div>

      {/* Explainability Badge */}
      <motion.div 
        className="mt-4 p-3 bg-gradient-to-r from-oriki-gold/20 to-oriki-copper/20 rounded-lg border-2 border-oriki-gold/40"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1, duration: 0.5 }}
      >
        <p className="text-xs text-oriki-brown font-bold text-center flex items-center justify-center gap-2">
          <span className="text-lg">✨</span>
          Fully Explainable AI - Every step is transparent
        </p>
      </motion.div>

      {/* MeTTa Badge */}
      <div className="mt-3 text-center">
        <span className="inline-block text-xs bg-oriki-brown text-white px-3 py-1 rounded-full font-semibold">
          Powered by MeTTa Symbolic Reasoning
        </span>
      </div>
    </div>
  )
}
