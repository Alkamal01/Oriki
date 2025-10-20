# System Architecture - Oríkì

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        User Interface                        │
│              (Next.js + Tailwind CSS)                       │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│                    API Gateway Layer                         │
│                    (FastAPI Backend)                         │
└─────┬──────────┬──────────┬──────────┬──────────────────────┘
      │          │          │          │
      ▼          ▼          ▼          ▼
┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────────┐
│Ingestion │ │ Symbolic │ │Reasoning │ │   Neural     │
│  Agent   │ │ Encoder  │ │  Engine  │ │  Translator  │
└────┬─────┘ └────┬─────┘ └────┬─────┘ └──────┬───────┘
     │            │            │               │
     └────────────┴────────────┴───────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│              Knowledge Graph Storage Layer                   │
│                                                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │  PostgreSQL  │  │     IPFS     │  │    CUDOS     │     │
│  │  (Metadata)  │  │ (Documents)  │  │  (Compute)   │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
└─────────────────────────────────────────────────────────────┘
```

## Component Details

### 1. Frontend Layer (Next.js)
- **Knowledge Upload Interface**: Submit cultural content
- **Query Interface**: Ask questions about cultural wisdom
- **Reasoning Visualizer**: Display symbolic reasoning chains
- **Knowledge Explorer**: Browse cultural knowledge graph

### 2. API Gateway (FastAPI)
- RESTful endpoints for all operations
- WebSocket support for real-time reasoning
- Authentication & rate limiting
- Request validation & error handling

### 3. Agent Network (Agentverse Integration)

#### Ingestion Agent
- Accepts text/audio transcripts
- Extracts key concepts and entities
- Validates cultural context
- Prepares data for encoding

#### Symbolic Encoder
- Converts natural language to MeTTa syntax
- Creates knowledge graph nodes and edges
- Links to existing cultural concepts
- Maintains ontology consistency

#### Reasoning Engine (MeTTa)
- Performs logical inference
- Traverses knowledge graph
- Applies cultural reasoning rules
- Generates proof chains

#### Neural Translator
- Uses LLM (GPT-4/Claude) for context
- Translates symbolic output to natural language
- Adds cultural context and examples
- Ensures interpretability

### 4. Storage Layer

#### PostgreSQL
- Stores metadata and relationships
- Indexes for fast querying
- User contributions tracking
- Reasoning history

#### IPFS
- Decentralized document storage
- Content-addressed cultural artifacts
- Immutable knowledge preservation
- Community-accessible data

#### CUDOS Network
- Decentralized compute for reasoning
- Scalable agent execution
- Distributed knowledge processing
- Economic incentives for contributors

## Data Flow

### Knowledge Ingestion Flow
```
User Input → Validation → Ingestion Agent → Symbolic Encoder 
    → MeTTa Graph → PostgreSQL + IPFS → Confirmation
```

### Query & Reasoning Flow
```
User Query → Query Parser → Reasoning Engine (MeTTa) 
    → Symbolic Result → Neural Translator → Human Response
    → UI Visualization
```

## MeTTa Knowledge Representation

```metta
; Cultural concept node
(: proverb-ubuntu (→ Concept))
(= (proverb-ubuntu) 
   (concept "Ubuntu" 
            (origin "Zulu/Xhosa")
            (meaning "I am because we are")
            (domain ethics community)))

; Reasoning rule
(: fairness-rule (→ Rule))
(= (fairness-rule)
   (if (and (has-value community-first)
            (has-value collective-good))
       (implies fairness-through-community)))
```

## Decentralization Strategy

1. **Data**: IPFS for immutable cultural records
2. **Compute**: CUDOS for distributed reasoning
3. **Agents**: Fetch.ai Agentverse for coordination
4. **Governance**: Community validation of knowledge

## Security & Ethics

- Community moderation of contributions
- Source attribution and provenance tracking
- Privacy-preserving for sensitive knowledge
- Transparent reasoning chains
- No cultural appropriation safeguards

## Scalability

- Horizontal scaling via microservices
- Caching layer for frequent queries
- Async processing for heavy reasoning
- CDN for static cultural content
- Sharding for large knowledge graphs
