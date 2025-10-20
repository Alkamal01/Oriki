'use client'

interface ReasoningVisualizerProps {
  result: any
}

export default function ReasoningVisualizer({ result }: ReasoningVisualizerProps) {
  if (!result) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-xl font-bold text-amber-900 mb-4">
          Reasoning Chain
        </h3>
        <p className="text-gray-500 text-center py-8">
          Submit a query to see the reasoning process
        </p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h3 className="text-xl font-bold text-amber-900 mb-4">
        Reasoning Chain
      </h3>
      
      <p className="text-sm text-gray-600 mb-4">
        Transparent symbolic reasoning process
      </p>

      <div className="space-y-3">
        {result.reasoning_chain && result.reasoning_chain.map((step: any, idx: number) => (
          <div
            key={idx}
            className="border-l-4 border-amber-400 pl-4 py-2 bg-amber-50 rounded-r"
          >
            <div className="flex items-start">
              <span className="flex-shrink-0 w-6 h-6 bg-amber-600 text-white rounded-full flex items-center justify-center text-xs font-bold mr-2">
                {step.step}
              </span>
              <div className="flex-1">
                <p className="font-semibold text-sm text-amber-900">
                  {step.action.replace(/_/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())}
                </p>
                <p className="text-xs text-gray-700 mt-1">
                  {step.result}
                </p>
                {step.details && Array.isArray(step.details) && step.details.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1">
                    {step.details.slice(0, 3).map((detail: any, i: number) => (
                      <span
                        key={i}
                        className="text-xs bg-amber-100 text-amber-800 px-2 py-0.5 rounded"
                      >
                        {typeof detail === 'string' ? detail : JSON.stringify(detail).slice(0, 30)}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Reasoning Stats */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="grid grid-cols-2 gap-4 text-center">
          <div className="bg-blue-50 rounded p-3">
            <p className="text-2xl font-bold text-blue-900">
              {result.reasoning_chain?.length || 0}
            </p>
            <p className="text-xs text-blue-700">Reasoning Steps</p>
          </div>
          <div className="bg-green-50 rounded p-3">
            <p className="text-2xl font-bold text-green-900">
              {result.sources?.length || 0}
            </p>
            <p className="text-xs text-green-700">Cultural Sources</p>
          </div>
        </div>
      </div>

      {/* Explainability Badge */}
      <div className="mt-4 p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-200">
        <p className="text-xs text-purple-900 font-medium text-center">
          ✨ Fully Explainable AI - Every step is transparent
        </p>
      </div>
    </div>
  )
}
