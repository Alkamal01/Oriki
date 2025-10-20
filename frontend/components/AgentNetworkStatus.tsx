"use client";

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface Agent {
  name: string;
  address: string;
  status: string;
  type?: string;
}

interface AgentStatus {
  orchestrator?: {
    name: string;
    address: string;
    status: string;
  };
  agents?: {
    [key: string]: Agent;
  };
  mode?: string;
  pending_requests?: number;
  network?: string;
}

export default function AgentNetworkStatus() {
  const [agentStatus, setAgentStatus] = useState<AgentStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAgentStatus();
    const interval = setInterval(fetchAgentStatus, 5000); // Refresh every 5 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchAgentStatus = async () => {
    try {
      const response = await fetch('http://localhost:8000/agents/status');
      if (!response.ok) throw new Error('Failed to fetch agent status');
      const data = await response.json();
      setAgentStatus(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-6 shadow-lg">
        <div className="animate-pulse">
          <div className="h-6 bg-amber-200 rounded w-1/3 mb-4"></div>
          <div className="space-y-3">
            <div className="h-4 bg-amber-200 rounded"></div>
            <div className="h-4 bg-amber-200 rounded w-5/6"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-6">
        <p className="text-red-600">Error loading agent status: {error}</p>
      </div>
    );
  }

  const isFetchAI = agentStatus?.orchestrator !== undefined;

  return (
    <div className="bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 rounded-xl p-6 shadow-lg border border-amber-200">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-bold text-amber-900">
          {isFetchAI ? '🌐 Decentralized Agent Network' : '⚡ Direct Agent Mode'}
        </h3>
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-3 h-3 bg-green-500 rounded-full"
        />
      </div>

      {isFetchAI && agentStatus.orchestrator && (
        <div className="mb-6 p-4 bg-white/60 backdrop-blur-sm rounded-lg border border-amber-300">
          <h4 className="font-semibold text-amber-900 mb-2">Orchestrator</h4>
          <div className="space-y-1 text-sm">
            <p className="text-amber-800">
              <span className="font-medium">Name:</span> {agentStatus.orchestrator.name}
            </p>
            <p className="text-amber-800 font-mono text-xs break-all">
              <span className="font-medium">Address:</span> {agentStatus.orchestrator.address}
            </p>
            <p className="text-amber-800">
              <span className="font-medium">Status:</span>{' '}
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                {agentStatus.orchestrator.status}
              </span>
            </p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {agentStatus?.agents && Object.entries(agentStatus.agents).map(([key, agent]) => (
          <motion.div
            key={key}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 bg-white/60 backdrop-blur-sm rounded-lg border border-amber-200 hover:border-amber-400 transition-all"
          >
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-semibold text-amber-900 capitalize">
                {getAgentIcon(key)} {key}
              </h4>
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                {agent.status}
              </span>
            </div>
            <div className="space-y-1 text-xs text-amber-700">
              <p><span className="font-medium">Name:</span> {agent.name}</p>
              {agent.address && (
                <p className="font-mono break-all">
                  <span className="font-medium">Address:</span> {agent.address.substring(0, 20)}...
                </p>
              )}
              {agent.type && (
                <p><span className="font-medium">Type:</span> {agent.type}</p>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {isFetchAI && (
        <div className="flex items-center justify-between p-4 bg-white/60 backdrop-blur-sm rounded-lg border border-amber-200">
          <div className="flex items-center space-x-4">
            <div>
              <p className="text-sm text-amber-700">Network</p>
              <p className="font-semibold text-amber-900">{agentStatus.network || 'Local'}</p>
            </div>
            <div className="h-8 w-px bg-amber-300"></div>
            <div>
              <p className="text-sm text-amber-700">Pending Requests</p>
              <p className="font-semibold text-amber-900">{agentStatus.pending_requests || 0}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs text-amber-600">Powered by</p>
            <p className="font-bold text-amber-900">Fetch.ai</p>
          </div>
        </div>
      )}

      {!isFetchAI && (
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800">
            💡 Running in direct mode. Set <code className="bg-blue-100 px-2 py-1 rounded">USE_FETCHAI=true</code> to enable decentralized agent network.
          </p>
        </div>
      )}
    </div>
  );
}

function getAgentIcon(agentType: string): string {
  const icons: { [key: string]: string } = {
    ingestion: '📥',
    encoder: '🔐',
    reasoning: '🧠',
    translator: '🌍'
  };
  return icons[agentType] || '🤖';
}
