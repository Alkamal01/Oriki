# 🌍 Oríkì — The Ancestral Intelligence Network

**BGI25 Hackathon Submission: AGI Without Borders**

> *"When we build AGI, we have a choice: replicate existing biases, or learn from ALL of humanity."*

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Python 3.9+](https://img.shields.io/badge/python-3.9+-blue.svg)](https://www.python.org/downloads/)
[![Next.js](https://img.shields.io/badge/Next.js-14-black)](https://nextjs.org/)

---

## 📖 Table of Contents

- [Vision](#-vision)
- [The Problem](#-the-problem)
- [Our Solution](#-our-solution)
- [Tech Stack](#-tech-stack)
- [Quick Start](#-quick-start)
- [Architecture](#-architecture)
- [Key Features](#-key-features)
- [Demo](#-demo)
- [Documentation](#-documentation)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🌍 Vision

Oríkì bridges ancestral wisdom with modern AI to create more **inclusive**, **interpretable**, and **culturally grounded** AGI. We preserve indigenous knowledge through symbolic reasoning, neural understanding, and decentralized storage.

**Our Mission**: Make AGI truly representative of ALL humanity by preserving and reasoning over cultural wisdom from around the world.

---

## 🎯 The Problem

### The Crisis
- **80% of world's wisdom** is oral, unstructured, and rapidly disappearing
- **Indigenous knowledge** on medicine, governance, ethics, and environment is being lost
- **Current AI systems** ignore non-Western epistemologies, creating biased intelligence
- **Cultural erasure** accelerates as elders pass without digital preservation

### The Impact
- AI systems perpetuate Western-centric biases
- Global South perspectives are systematically excluded
- Centuries of tested wisdom is wasted
- AGI development lacks diverse ethical foundations

---

## 💡 Our Solution

### A Cultural Memory Engine that:

1. **📥 Ingests** cultural wisdom (proverbs, stories, oral history)
2. **🔣 Encodes** knowledge into symbolic graphs using MeTTa
3. **🧠 Reasons** transparently using symbolic + neural hybrid
4. **💾 Stores** decentrally on IPFS/CUDOS
5. **🤝 Enables** community contribution and governance

### Why This Matters

| Traditional AI | Oríkì |
|---------------|-------|
| ❌ Black box reasoning | ✅ Transparent symbolic logic |
| ❌ Western-centric | ✅ Multi-cultural perspectives |
| ❌ Corporate-owned | ✅ Community-governed |
| ❌ Data-driven only | ✅ Wisdom + data driven |
| ❌ Biased outputs | ✅ Culturally grounded ethics |

---

## 🛠️ Tech Stack

### ASI Alliance Integration (Full Stack!)

| Component | Technology | Purpose |
|-----------|-----------|---------|
| **🤖 Multi-Agent System** | **Fetch.ai (uAgents)** | **Decentralized agent orchestration** |
| **Symbolic Reasoning** | MeTTa | Knowledge representation & inference |
| **Agent Orchestration** | Fetch.ai Agentverse | Multi-agent coordination |
| **Neural Processing** | OpenAI API | Natural language understanding |
| **Decentralized Compute** | CUDOS Network | Distributed reasoning |
| **Decentralized Storage** | IPFS | Immutable knowledge preservation |
| **Database** | PostgreSQL | Metadata & relationships |
| **Backend** | FastAPI (Python) | API & business logic |
| **Frontend** | Next.js + Tailwind | User interface |

---

## 🚀 Quick Start

### Prerequisites

Before you begin, ensure you have the following installed:
- **Python 3.9+** ([Download](https://www.python.org/downloads/))
- **Node.js 18+** ([Download](https://nodejs.org/))
- **npm** or **yarn** (comes with Node.js)
- **Git** ([Download](https://git-scm.com/downloads))

### 1. Clone the Repository

```bash
git clone https://github.com/Alkamal01/Oriki.git
cd Oriki
```

### 2. Backend Setup

#### Install Dependencies

```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On macOS/Linux:
source venv/bin/activate
# On Windows:
venv\Scripts\activate

# Install Python packages
pip install -r requirements.txt
```

#### Configure Environment Variables

Create a `.env` file in the `backend` directory:

```bash
cp .env.example .env
```

Edit `.env` and add your API keys:

```env
# Database (SQLite for local development)
DATABASE_URL=sqlite:///./oriki.db

# ASI Cloud API (CUDOS) - Required for AI features
ASI_API_KEY=your_asi_api_key_here
ASI_BASE_URL=https://inference.asicloud.cudos.org/v1
ASI_MODEL=qwen/qwen3-32b

# OpenAI API - Required for multimodal features
OPENAI_API_KEY=your_openai_api_key_here

# Tavily API - Optional, for web search enrichment
TAVILY_API_KEY=your_tavily_api_key_here

# Fetch.ai - Optional, for decentralized agents
FETCH_AI_API_KEY=your_fetchai_api_key_here

# IPFS - Optional, uses local node by default
IPFS_API_URL=/ip4/127.0.0.1/tcp/5001
```

**Get API Keys:**
- **ASI Cloud**: [https://inference.asicloud.cudos.org](https://inference.asicloud.cudos.org)
- **OpenAI**: [https://platform.openai.com/api-keys](https://platform.openai.com/api-keys)
- **Tavily**: [https://tavily.com](https://tavily.com)
- **Fetch.ai**: [https://fetch.ai](https://fetch.ai)

#### Initialize Database

```bash
# Seed the database with example cultural knowledge
python seed_database.py
```

#### Start Backend Server

```bash
# Run with uvicorn
python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

The backend API will be available at `http://localhost:8000`

### 3. Frontend Setup

Open a **new terminal** window:

```bash
cd frontend

# Install dependencies
npm install
# or
yarn install

# Create environment file
echo "NEXT_PUBLIC_API_URL=http://localhost:8000" > .env.local
```

#### Start Frontend Development Server

```bash
npm run dev
# or
yarn dev
```

The frontend will be available at `http://localhost:3000` 🎉

### 4. Verify Installation

1. Open your browser to `http://localhost:3000`
2. You should see the Oríkì landing page
3. Click "Enter App" to access the main interface
4. Try querying: "What can African proverbs teach about community?"

### 🐛 Troubleshooting

#### Backend Issues

**Port already in use:**
```bash
# Use a different port
python -m uvicorn main:app --reload --port 8001
```

**Database errors:**
```bash
# Delete and recreate database
rm oriki.db
python seed_database.py
```

**Missing dependencies:**
```bash
pip install --upgrade -r requirements.txt
```

#### Frontend Issues

**Port 3000 in use:**
```bash
# Next.js will automatically use port 3001
npm run dev
```

**Module not found:**
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

**API connection errors:**
- Ensure backend is running on `http://localhost:8000`
- Check `.env.local` has correct `NEXT_PUBLIC_API_URL`

### 📦 Production Build

#### Backend

```bash
cd backend
pip install gunicorn
gunicorn main:app --workers 4 --worker-class uvicorn.workers.UvicornWorker --bind 0.0.0.0:8000
```

#### Frontend

```bash
cd frontend
npm run build
npm start
```

### 🐳 Docker Setup (Optional)

```bash
# Build and run with Docker Compose
docker-compose up --build

# Access at http://localhost:3000
```

---

## 📊 Architecture

### System Overview

```
┌─────────────────────────────────────────────────────┐
│              Frontend (Next.js + Tailwind)          │
│  • Query Interface  • Upload Form  • Explorer      │
└────────────────────┬────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────┐
│              Backend API (FastAPI)                  │
│  • REST endpoints  • WebSocket  • Validation       │
└─────┬──────────┬──────────┬──────────┬─────────────┘
      │          │          │          │
      ▼          ▼          ▼          ▼
┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐
│Ingestion │ │ Symbolic │ │Reasoning │ │  Neural  │
│  Agent   │ │ Encoder  │ │  Engine  │ │Translator│
└────┬─────┘ └────┬─────┘ └────┬─────┘ └────┬─────┘
     │            │            │            │
     └────────────┴────────────┴────────────┘
                     │
┌────────────────────▼────────────────────────────────┐
│           Storage Layer                             │
│  • PostgreSQL (metadata)                           │
│  • IPFS (documents)                                │
│  • CUDOS (compute)                                 │
└─────────────────────────────────────────────────────┘
```

**Detailed architecture**: See [ARCHITECTURE.md](ARCHITECTURE.md)

---

## 🌟 Key Features

### 🤖 Decentralized Multi-Agent System (NEW!)
**True decentralized AI orchestration using Fetch.ai:**
- 5 autonomous agents communicating via Fetch.ai protocol
- Orchestrator coordinates knowledge processing pipeline
- Specialized agents for ingestion, encoding, reasoning, and translation
- Transparent agent-to-agent communication
- Scalable across multiple nodes
- **Full ASI Alliance integration!**

### 1. 📥 Knowledge Ingestion
Upload cultural content and automatically extract:
- Key concepts (community, wisdom, fairness)
- Themes (collective_good, ethics, wisdom)
- Entities (values, actions, principles)

### 2. 🔣 Symbolic Encoding (MeTTa)
Convert natural language to symbolic graphs:
```metta
(: ubuntu-philosophy (→ CulturalKnowledge))
(= (ubuntu-philosophy)
   (knowledge
      (culture "Zulu/Xhosa")
      (concept "community-first")
      (principle "individual-serves-collective")))
```

### 3. 🧠 Reasoning Engine
Perform transparent symbolic inference:
- Pattern matching across cultures
- Rule-based logical deduction
- Proof chain generation
- Cross-cultural synthesis

### 4. 🗣️ Neural Translation
Convert symbolic reasoning to natural language:
- LLM-based explanation generation
- Cultural context preservation
- Source attribution
- Interpretable insights

### 5. 💾 Decentralized Storage
- IPFS for immutable records
- Content-addressed retrieval
- Community accessibility
- Permanent preservation

### 6. 🎨 Interactive UI
- Beautiful, intuitive interface
- Real-time reasoning visualization
- Knowledge contribution form
- Cultural explorer

---

## 🎬 Demo

### Example Query
**"What can African proverbs teach AI about fairness?"**

### System Response

**Step 1**: Identifies relevant knowledge
- Ubuntu philosophy (Zulu/Xhosa)
- Spider web proverb (Akan)
- Sankofa principle (Akan)

**Step 2**: Extracts symbolic patterns
```
collective_good → community_first_principle
ethics + fairness → justice_through_community
```

**Step 3**: Applies reasoning rules
```metta
(if (has-theme ubuntu "collective_good")
    (implies "fairness-through-community-consensus"))
```

**Step 4**: Generates natural language answer
> "Based on ancestral wisdom, fairness is achieved through prioritizing collective well-being over individual gain. African philosophy teaches that justice emerges from community consensus and shared responsibility, not just individual rights..."

**Cultural Sources**: Zulu/Xhosa Ubuntu philosophy, Akan oral tradition

**See it in action**: [Demo Video](#) | [Live Demo](#)

---

## 📚 Documentation

| Document | Description |
|----------|-------------|
| [README.md](README.md) | This file - complete project overview |
| [ARCHITECTURE.md](ARCHITECTURE.md) | Detailed system architecture and design |
| [DEPLOYMENT.md](DEPLOYMENT.md) | Production deployment guide (Vercel + Render) |
| [LICENSE](LICENSE) | MIT License details |

### API Documentation

Once the backend is running, visit:
- **Local**: `http://localhost:8000/docs`
- **Production**: `https://your-backend.onrender.com/docs`

---

## 🤝 Contributing

We welcome contributions from:
- **Developers**: Improve code, add features
- **Cultural Experts**: Share wisdom, validate knowledge
- **Researchers**: Study and publish findings
- **Designers**: Enhance UI/UX
- **Community Builders**: Spread the word

### How to Contribute

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 🌐 Impact

### For Communities
✅ Preserve endangered cultural knowledge  
✅ Maintain cultural identity  
✅ Economic opportunities for knowledge holders  
✅ Intergenerational knowledge transfer

### For AI Development
✅ More diverse training data  
✅ Reduced bias in AI systems  
✅ Ethical frameworks from tested wisdom  
✅ Interpretable reasoning patterns

### For Society
✅ Inclusive AGI development  
✅ Cultural diversity preservation  
✅ Democratic knowledge governance  
✅ Global South empowerment

---

## 📊 Current Status

- ✅ **10** cultural knowledge entries
- ✅ **5+** cultures represented
- ✅ **4-step** reasoning chains
- ✅ Full symbolic encoding
- ✅ Decentralized storage simulation
- ✅ Interactive web interface

---

## 🗺️ Roadmap

### Phase 1 (Hackathon - COMPLETED! ✅)
- ✅ Core architecture with multi-agent system
- ✅ Full ASI Alliance stack integration (Fetch.ai + CUDOS + MeTTa)
- ✅ Demo functional with 14+ knowledge entries
- ✅ 10+ cultures represented (African, Indian, Turkish, Indigenous)
- ✅ Real IPFS integration (content-addressed storage)
- ✅ AI-powered semantic search
- ✅ Interactive knowledge graph visualization
- ✅ Cultural wisdom comparison tool
- ✅ Transparent reasoning visualization
- ✅ **Multi-modal AI processing** (Audio + Image + Text)
- ✅ **Audio recording and transcription** for oral traditions
- ✅ **Image analysis** for cultural symbols and artifacts
- ✅ **Multi-modal synthesis** combining all formats
- ✅ Professional UI/UX with brand consistency
- ✅ PostgreSQL/SQLite database with symbolic encoding
- ✅ Decentralized agent orchestration

### Phase 2 (Post-Hackathon: Months 1-3)
- ⏳ Community feedback and iteration
- ⏳ 100+ knowledge entries from community contributions
- ⏳ 20+ cultures with deeper representation
- ⏳ Initial partnerships with cultural organizations
- ⏳ Voice input for native languages
- ⏳ Enhanced mobile responsiveness

### Phase 3 (Months 4-6)
- ⏳ 500+ knowledge entries
- ⏳ 30+ cultures
- ⏳ Mobile app (iOS/Android)
- ⏳ Blockchain-based contribution rewards
- ⏳ Cultural expert verification system
- ⏳ Multi-language support
- ⏳ **Audio Processing**: Direct oral tradition recording and transcription
- ⏳ **Image Recognition**: Analyze cultural symbols and artifacts
- ⏳ **Multi-modal Reasoning**: Combine text, audio, visual knowledge

### Phase 4 (Months 7-12)
- ⏳ 1,000+ entries
- ⏳ 50+ cultures
- ⏳ Full CUDOS network deployment
- ⏳ Token launch for governance
- ⏳ DAO for community governance
- ⏳ AI-generated cultural art
- ⏳ Elder interview mode

---

## 📝 License

MIT License - Built for humanity, by humanity.

See [LICENSE](LICENSE) for details.

---

## 🙏 Acknowledgments

- **BGI25 Hackathon** organizers
- **SingularityNET** for MeTTa
- **ASI Alliance** for infrastructure
- **Fetch.ai** for agent orchestration
- **CUDOS** for decentralized compute
- **All cultural knowledge holders** who preserve wisdom

---

## 📞 Contact

- **Email**: [kamalaliyu212@gmail.com]
- **Twitter**: [@kaftandev]
- **Website**: [oriki.vercel.app]

---

<div align="center">

**AGI Without Borders means AGI with ALL of humanity's wisdom.**

*Built with ❤️ for BGI25 Hackathon*

[⭐ Star this repo](https://github.com/Alkamal01/Oriki) | [🐛 Report Bug](https://github.com/Alkamal01/Oriki/issues) | [💡 Request Feature](https://github.com/Alkamal01/Oriki/issues)

</div>
