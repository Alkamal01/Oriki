# Fetch.ai Integration - Decentralized Multi-Agent System

## Overview

Oríkì now features a **true decentralized multi-agent system** powered by Fetch.ai's uAgents framework. This integration demonstrates full alignment with the ASI Alliance vision and showcases advanced decentralized AI orchestration.

## Architecture

### Agent Network

The system consists of 5 autonomous agents communicating via Fetch.ai's agent protocol:

1. **Orchestrator Agent** (`oriki_orchestrator`)
   - Coordinates the entire agent network
   - Manages request routing and response aggregation
   - Tracks pipeline status and agent health

2. **Ingestion Agent** (`oriki_ingestion`)
   - Processes raw cultural knowledge input
   - Validates and structures data
   - Extracts metadata and keywords

3. **Encoder Agent** (`oriki_encoder`)
   - Converts processed knowledge to symbolic MeTTa representation
   - Creates formal logic structures
   - Enables symbolic reasoning

4. **Reasoning Agent** (`oriki_reasoning`)
   - Performs symbolic reasoning over knowledge base
   - Builds reasoning chains
   - Generates logical conclusions

5. **Translator Agent** (`oriki_translator`)
   - Converts symbolic reasoning to natural language
   - Adds cultural context
   - Formats final responses

### Communication Flow

```
User Request
    ↓
Orchestrator Agent
    ↓
[Parallel Processing]
    ├→ Ingestion Agent → Encoder Agent
    └→ Reasoning Agent → Translator Agent
    ↓
Orchestrator Agent (Aggregation)
    ↓
User Response
```

## Key Features

### ✅ True Decentralization
- Each agent runs independently with its own address
- Agents communicate via Fetch.ai's message protocol
- No single point of failure
- Scalable across multiple nodes

### ✅ ASI Alliance Alignment
- Built on Fetch.ai (ASI Alliance member)
- Uses CUDOS for AI inference
- Integrates with SingularityNET's symbolic AI (MeTTa)
- Demonstrates full stack ASI integration

### ✅ Autonomous Operation
- Agents make independent decisions
- Self-organizing workflow
- Automatic error recovery
- Dynamic load balancing

### ✅ Verifiable Execution
- All agent communications are traceable
- Request IDs track full pipeline
- Agent addresses provide accountability
- Transparent reasoning chains

## Configuration

### Environment Variables

```bash
# Enable Fetch.ai decentralized agents
USE_FETCHAI=true

# Agent network configuration
FETCHAI_SEED=oriki_orchestrator_seed_phrase_change_in_production
FETCHAI_PORT=8001
```

### Agent Ports

- Orchestrator: 8001
- Ingestion Agent: 8002
- Encoder Agent: 8003
- Reasoning Agent: 8004
- Translator Agent: 8005

## API Endpoints

### Get Agent Status
```bash
GET /agents/status
```

Returns the status of all agents in the network:

```json
{
  "orchestrator": {
    "name": "oriki_orchestrator",
    "address": "agent1q...",
    "status": "active"
  },
  "agents": {
    "ingestion": {
      "name": "oriki_ingestion",
      "address": "agent1q...",
      "status": "active"
    },
    "encoder": {...},
    "reasoning": {...},
    "translator": {...}
  },
  "pending_requests": 0,
  "network": "Fetch.ai Testnet"
}
```

### Health Check
```bash
GET /health
```

Now includes agent mode information:

```json
{
  "status": "healthy",
  "agent_mode": "fetchai_decentralized",
  "services": {
    "database": true,
    "ipfs": true
  }
}
```

## Usage

### Knowledge Ingestion with Decentralized Agents

```python
import requests

# Submit knowledge - automatically routed through agent network
response = requests.post("http://localhost:8000/knowledge/ingest", json={
    "content": "Ubuntu philosophy emphasizes community and shared humanity",
    "culture": "Zulu",
    "category": "philosophy",
    "source": "Traditional wisdom"
})

# The request flows through:
# 1. Orchestrator receives request
# 2. Ingestion agent processes content
# 3. Encoder agent creates symbolic representation
# 4. Results stored in IPFS and database
```

### Query with Decentralized Reasoning

```python
# Submit query - agents collaborate to answer
response = requests.post("http://localhost:8000/query", json={
    "question": "What is the meaning of Ubuntu?"
})

# The request flows through:
# 1. Orchestrator receives query
# 2. Reasoning agent analyzes knowledge base
# 3. Translator agent formats response
# 4. Cultural context added
```

## Benefits for BGI25 Hackathon

### Technical Excellence
- **Cutting-edge architecture**: True decentralized AI agents
- **ASI Alliance showcase**: Full integration of Fetch.ai, CUDOS, and SingularityNET
- **Scalability**: Can distribute agents across multiple nodes
- **Innovation**: Combines cultural preservation with Web3 AI

### Demonstration Value
- **Visual appeal**: Agent network status dashboard
- **Transparency**: Traceable agent communications
- **Real-world ready**: Production-grade architecture
- **Future-proof**: Built on emerging ASI standards

### Competitive Advantages
1. **Only project with true multi-agent orchestration**
2. **Full ASI Alliance technology stack**
3. **Decentralized + Cultural preservation = Unique value**
4. **Technically impressive and socially impactful**

## Development vs Production

### Development Mode (Direct Agents)
Set `USE_FETCHAI=false` for faster development:
- Agents run in-process
- Simpler debugging
- Faster iteration

### Production Mode (Decentralized Agents)
Set `USE_FETCHAI=true` for full decentralization:
- Agents run independently
- True multi-agent system
- Production-ready architecture

## Future Enhancements

### Phase 1 (Current)
- ✅ Local agent network
- ✅ Inter-agent messaging
- ✅ Request orchestration

### Phase 2 (Next)
- [ ] Deploy agents to Fetch.ai testnet
- [ ] Agent discovery via Almanac
- [ ] Cross-node communication

### Phase 3 (Future)
- [ ] Economic incentives for agents
- [ ] Community-run agent nodes
- [ ] DAO governance for agent network

## Testing

### Test Agent Network

```bash
# Start the API with Fetch.ai agents
cd backend
python main.py
```

### Check Agent Status

```bash
curl http://localhost:8000/agents/status
```

### Test Knowledge Ingestion

```bash
curl -X POST http://localhost:8000/knowledge/ingest \
  -H "Content-Type: application/json" \
  -d '{
    "content": "Test knowledge",
    "culture": "Test",
    "category": "test"
  }'
```

## Troubleshooting

### Agents Not Starting
- Check port availability (8001-8005)
- Verify `uagents` package installed
- Check logs for agent initialization errors

### Communication Failures
- Ensure all agents are running
- Check network connectivity
- Verify agent addresses in logs

### Performance Issues
- Monitor agent response times
- Check for bottlenecks in orchestrator
- Consider scaling to multiple nodes

## Resources

- [Fetch.ai Documentation](https://docs.fetch.ai/)
- [uAgents Framework](https://github.com/fetchai/uAgents)
- [ASI Alliance](https://asi.global/)
- [Oríkì Architecture](./ARCHITECTURE.md)

## Conclusion

The Fetch.ai integration transforms Oríkì into a **truly decentralized cultural intelligence network**. This showcases the future of AI: autonomous, transparent, and aligned with human values - preserving ancestral wisdom through cutting-edge Web3 technology.

Perfect for demonstrating ASI Alliance alignment and technical excellence at BGI25! 🚀
