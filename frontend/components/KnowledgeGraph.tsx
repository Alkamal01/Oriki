'use client'

import { useCallback, useEffect, useState } from 'react'
import ReactFlow, {
  Node,
  Edge,
  addEdge,
  Connection,
  useNodesState,
  useEdgesState,
  Controls,
  Background,
  MiniMap,
} from 'reactflow'
import 'reactflow/dist/style.css'
import axios from 'axios'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

const nodeColors = {
  culture: '#B8860B', // oriki-brown
  concept: '#DAA520', // oriki-gold
  theme: '#6B8E9E', // oriki-blue
  wisdom: '#CD853F', // oriki-copper
}

export default function KnowledgeGraph() {
  const [nodes, setNodes, onNodesChange] = useNodesState([])
  const [edges, setEdges, onEdgesChange] = useEdgesState([])
  const [loading, setLoading] = useState(true)
  const [selectedNode, setSelectedNode] = useState<any>(null)

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  )

  useEffect(() => {
    loadKnowledgeGraph()
  }, [])

  const loadKnowledgeGraph = async () => {
    try {
      // Fetch all knowledge entries
      const response = await axios.get(`${API_URL}/knowledge/list?limit=50`)
      const knowledge = response.data.knowledge

      if (!knowledge || knowledge.length === 0) {
        setLoading(false)
        return
      }

      // Build graph structure
      const graphNodes: Node[] = []
      const graphEdges: Edge[] = []
      const cultureNodes = new Map()
      const conceptNodes = new Map()
      const themeNodes = new Map()

      // Create culture nodes
      knowledge.forEach((item: any, idx: number) => {
        const culture = item.culture
        if (!cultureNodes.has(culture)) {
          cultureNodes.set(culture, {
            id: `culture-${culture}`,
            type: 'default',
            data: {
              label: culture,
              type: 'culture',
              count: 1
            },
            position: {
              x: Math.cos((cultureNodes.size * 2 * Math.PI) / 10) * 400 + 500,
              y: Math.sin((cultureNodes.size * 2 * Math.PI) / 10) * 400 + 400
            },
            style: {
              background: nodeColors.culture,
              color: 'white',
              border: '2px solid #DAA520',
              borderRadius: '50%',
              width: 120,
              height: 120,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '12px',
              fontWeight: 'bold',
              textAlign: 'center',
              padding: '10px',
            },
          })
        } else {
          const node = cultureNodes.get(culture)
          node.data.count++
        }

        // Create concept nodes
        if (item.concepts && item.concepts.length > 0) {
          item.concepts.forEach((concept: string) => {
            const conceptId = `concept-${concept}`
            if (!conceptNodes.has(conceptId)) {
              conceptNodes.set(conceptId, {
                id: conceptId,
                data: {
                  label: concept,
                  type: 'concept',
                  cultures: [culture]
                },
                position: {
                  x: Math.random() * 800 + 200,
                  y: Math.random() * 600 + 100
                },
                style: {
                  background: nodeColors.concept,
                  color: 'white',
                  border: '2px solid #CD853F',
                  borderRadius: '10px',
                  padding: '10px 15px',
                  fontSize: '11px',
                  fontWeight: '600',
                },
              })
            } else {
              const node = conceptNodes.get(conceptId)
              if (!node.data.cultures.includes(culture)) {
                node.data.cultures.push(culture)
              }
            }

            // Create edge from culture to concept
            graphEdges.push({
              id: `edge-${culture}-${concept}`,
              source: `culture-${culture}`,
              target: conceptId,
              animated: true,
              style: { stroke: nodeColors.concept, strokeWidth: 2 },
            })
          })
        }

        // Create theme nodes
        if (item.themes && item.themes.length > 0) {
          item.themes.forEach((theme: string) => {
            const themeId = `theme-${theme}`
            if (!themeNodes.has(themeId)) {
              themeNodes.set(themeId, {
                id: themeId,
                data: {
                  label: theme.replace(/_/g, ' '),
                  type: 'theme'
                },
                position: {
                  x: Math.random() * 800 + 200,
                  y: Math.random() * 600 + 100
                },
                style: {
                  background: nodeColors.theme,
                  color: 'white',
                  border: '2px solid #B8860B',
                  borderRadius: '8px',
                  padding: '8px 12px',
                  fontSize: '10px',
                  fontWeight: '500',
                },
              })
            }

            // Create edge from culture to theme
            graphEdges.push({
              id: `edge-${culture}-${theme}`,
              source: `culture-${culture}`,
              target: themeId,
              animated: false,
              style: { stroke: nodeColors.theme, strokeWidth: 1, strokeDasharray: '5,5' },
            })
          })
        }
      })

      // Combine all nodes
      const allNodes = [
        ...Array.from(cultureNodes.values()),
        ...Array.from(conceptNodes.values()),
        ...Array.from(themeNodes.values()),
      ]

      setNodes(allNodes)
      setEdges(graphEdges)
      setLoading(false)
    } catch (error) {
      console.error('Failed to load knowledge graph:', error)
      setLoading(false)
    }
  }

  const onNodeClick = useCallback((event: React.MouseEvent, node: Node) => {
    setSelectedNode(node)
  }, [])

  if (loading) {
    return (
      <div className="bg-gradient-to-br from-white to-oriki-beige rounded-2xl shadow-2xl p-8 border-2 border-oriki-brown/20 h-[600px] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-oriki-brown mx-auto mb-4"></div>
          <p className="text-oriki-brown font-semibold">Loading Knowledge Graph...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-gradient-to-br from-white to-oriki-beige rounded-2xl shadow-2xl p-8 border-2 border-oriki-brown/20">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-oriki-blue to-oriki-gold rounded-full flex items-center justify-center text-2xl shadow-lg">
            🕸️
          </div>
          <div>
            <h2 className="text-3xl font-bold text-oriki-brown">
              Knowledge Graph
            </h2>
            <p className="text-oriki-charcoal text-sm">Explore interconnected wisdom</p>
          </div>
        </div>

        {/* Legend */}
        <div className="flex gap-4 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full" style={{ background: nodeColors.culture }}></div>
            <span>Cultures</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded" style={{ background: nodeColors.concept }}></div>
            <span>Concepts</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded" style={{ background: nodeColors.theme }}></div>
            <span>Themes</span>
          </div>
        </div>
      </div>

      <div className="bg-oriki-beige/30 p-4 rounded-lg border border-oriki-brown/20 mb-4">
        <p className="text-sm text-oriki-charcoal">
          <strong>Interactive Visualization:</strong> Explore how cultural wisdom connects across traditions.
          Circles represent cultures, rectangles show concepts, and rounded boxes indicate themes.
          Click nodes to see details!
        </p>
      </div>

      {/* Graph Container */}
      <div className="h-[600px] bg-white rounded-xl border-2 border-oriki-brown/20 overflow-hidden">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodeClick={onNodeClick}
          fitView
        >
          <Controls />
          <MiniMap
            nodeColor={(node) => {
              if (node.data.type === 'culture') return nodeColors.culture
              if (node.data.type === 'concept') return nodeColors.concept
              if (node.data.type === 'theme') return nodeColors.theme
              return nodeColors.wisdom
            }}
          />
          <Background gap={12} size={1} />
        </ReactFlow>
      </div>

      {/* Selected Node Info */}
      {selectedNode && (
        <div className="mt-4 p-4 bg-gradient-to-r from-oriki-beige to-white rounded-lg border-2 border-oriki-gold">
          <h3 className="font-bold text-oriki-brown mb-2 flex items-center gap-2">
            <span>ℹ️</span> {selectedNode.data.label}
          </h3>
          <div className="text-sm text-oriki-charcoal space-y-1">
            <p><strong>Type:</strong> {selectedNode.data.type}</p>
            {selectedNode.data.count && (
              <p><strong>Knowledge Entries:</strong> {selectedNode.data.count}</p>
            )}
            {selectedNode.data.cultures && (
              <p><strong>Found in:</strong> {selectedNode.data.cultures.join(', ')}</p>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
