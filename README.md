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

### ASI Alliance Integration

| Component | Technology | Purpose |
|-----------|-----------|---------|
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
- Python 3.9+
- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone repository
git clone <repository-url>
cd oriki

# Backend setup
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
python seed_database.py

# Start backend
python -m uvicorn main:app --reload
```

In a new terminal:
```bash
# Frontend setup
cd frontend
npm install

# Start frontend
npm run dev
```

Visit `http://localhost:3000` 🎉

**Detailed instructions**: See [QUICKSTART.md](QUICKSTART.md)

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
| [QUICKSTART.md](QUICKSTART.md) | Installation and setup guide |
| [ARCHITECTURE.md](ARCHITECTURE.md) | System architecture details |
| [METTA_EXAMPLES.md](METTA_EXAMPLES.md) | MeTTa encoding examples |
| [DEMO_STORY.md](DEMO_STORY.md) | 1-minute presentation script |
| [FUTURE_VISION.md](FUTURE_VISION.md) | Roadmap and scalability |
| [DEPLOYMENT.md](DEPLOYMENT.md) | Production deployment guide |
| [PROJECT_SUMMARY.md](PROJECT_SUMMARY.md) | Complete project overview |

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

### Phase 1 (Months 1-3)
- ✅ Core architecture
- ✅ Demo functional
- ⏳ Community feedback
- ⏳ Initial partnerships

### Phase 2 (Months 4-6)
- ⏳ 100+ knowledge entries
- ⏳ 20+ cultures
- ⏳ Real IPFS integration
- ⏳ Mobile app

### Phase 3 (Months 7-12)
- ⏳ 1,000+ entries
- ⏳ 50+ cultures
- ⏳ CUDOS integration
- ⏳ Token launch

**Full roadmap**: See [FUTURE_VISION.md](FUTURE_VISION.md)

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

- **Email**: [team@oriki.ai]
- **Twitter**: [@oriki_ai]
- **Discord**: [Community Link]
- **Website**: [oriki.ai]

---

<div align="center">

**AGI Without Borders means AGI with ALL of humanity's wisdom.**

*Built with ❤️ for BGI25 Hackathon*

[⭐ Star this repo](https://github.com/your-repo) | [🐛 Report Bug](https://github.com/your-repo/issues) | [💡 Request Feature](https://github.com/your-repo/issues)

</div>
