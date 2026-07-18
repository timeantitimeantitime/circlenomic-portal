# Circlenomic Network Society Portal

A node-based portal for a decentralized Network Society built on mutual aid, cooperative governance, and time-based economics.

## Overview

Circlenomic enables communities to operate as self-governing Network States where every citizen:
- Earns Universal Basic Income through participation
- Trades services via time banking (1 hour = 1 credit)
- Participates in governance through collusion-resistant voting
- Accesses free education with verifiable credentials
- Trades goods and services in a decentralized marketplace
- Communicates via encrypted Matrix messaging
- Connects to the Fediverse through ActivityPub

**No Ethereum. No gas fees. No plutocracy.**

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│              Circlenomic Personal Node                   │
│  (Phone / Laptop / Home Server)                          │
│                                                          │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐   │
│  │ Identity │ │ Economic │ │ AI Agent │ │ Storage  │   │
│  │ (DID/SBT)│ │ (hREA)  │ │ (Gemma)  │ │ (IPFS)   │   │
│  └────┬─────┘ └────┬─────┘ └────┬─────┘ └────┬─────┘   │
│       └────────────┼────────────┼────────────┘          │
│                    ▼                                   │
│         ┌─────────────────────┐                        │
│         │ Holochain Conductor │                        │
│         └──────────┬──────────┘                        │
└────────────────────┼───────────────────────────────────┘
                     │
                     ▼
    ┌────────────────────────────────────────┐
    │         Holochain DHT Network          │
    │  (Community data, economic records)    │
    └────────────────┬───────────────────────┘
                     │
          ┌──────────┼──────────┐
          ▼          ▼          ▼
    ┌──────────┐ ┌──────────┐ ┌──────────┐
    │ Stellar  │ │  Matrix  │ │ActivityPub│
    │(Payments)│ │  (Chat)  │ │(Fediverse)│
    └──────────┘ └──────────┘ └──────────┘
```

## Technology Stack

| Layer | Technology | Purpose |
|-------|------------|---------|
| **Economic Engine** | Holochain + hREA | Agent-centric economic accounting, zero fees |
| **Financial Settlement** | Stellar + Soroban | UBI distribution, cross-border payments |
| **Communication** | Matrix.org | Encrypted messaging, voice, video |
| **Federation** | ActivityPub | Connect to Fediverse (Mastodon, PeerTube, etc.) |
| **Storage** | IPFS + Arweave | Dynamic content + permanent records |
| **AI Agent** | Gemma 4 E4B (local) | On-device assistant, privacy-preserving |
| **Identity** | DIDs + Soulbound Tokens | Self-sovereign identity, verifiable credentials |
| **Voting** | MACI-inspired | Collusion-resistant, zero-knowledge voting |

## Features

### 🕐 Time Banking
- 1 hour of service = 1 time credit
- Teaching earns 1.5x credits
- Demurrage encourages circulation
- Verified through community confirmation

### 💰 Universal Basic Income
- 100 base credits/month
- Bonuses for participation, skills, service, education
- Distributed via Stellar smart contracts
- Transparent and verifiable

### 🗳️ Governance
- Four levels: Individual → Community → Network State → Federation
- MACI-style encrypted voting
- Zero-knowledge proofs for eligibility
- Proposals, discussions, and implementation

### 📚 Education
- Khan Academy-style courses
- AI-powered tutoring
- Verifiable credentials (SBTs)
- Peer teaching with credit incentives

### 🛒 Marketplace
- Buy, sell, and trade with time credits
- Barter and hybrid transactions
- AI-powered matching
- Trust scores and endorsements

### 🤖 AI Agent
- Runs locally on your device (Gemma 4)
- Helps with governance, education, marketplace
- Never sends data externally
- Multi-lingual support

### 🔐 Privacy
- Zero-knowledge proofs
- Encrypted communication (Matrix E2EE)
- Local data storage
- Programmable privacy

### 🌐 Federation
- ActivityPub connects to Fediverse
- Follow @circlenomic-community on Mastodon
- Watch educational videos on PeerTube
- Discuss governance on Lemmy

## Quick Start

### For Users

```bash
# 1. Download the app
# iOS: App Store
# Android: Google Play Store
# Desktop: circlenomic.org/download

# 2. Create account
# - Choose username
# - Save backup phrase
# - Join your community

# 3. Get started
# - Complete Digital Literacy course (earn 20 credits)
# - Browse the marketplace
# - Participate in governance
# - Start earning time credits!
```

### For Developers

```bash
# Clone the repository
git clone https://github.com/circlenomic/portal.git
cd portal

# Install dependencies
npm install

# Start local development
./scripts/dev.sh

# Run tests
npm test
```

## Project Structure

```
circlenomic/
├── holochain/          # Holochain hApps (Rust)
│   ├── identity/       # DID & SBT management
│   ├── economic/       # hREA economic engine
│   ├── governance/     # Voting & proposals
│   ├── timebank/       # Time banking records
│   ├── marketplace/    # Marketplace listings
│   └── education/      # Course & achievement tracking
├── stellar/            # Soroban smart contracts (Rust)
│   ├── ubi/            # UBI distribution
│   ├── timebank/       # Time credit settlement
│   ├── voting/         # MACI-style voting
│   └── marketplace/    # Transaction settlement
├── matrix/             # Matrix integration (TypeScript)
│   ├── app-service/    # Custom Application Service
│   ├── bots/           # UBI, governance, marketplace bots
│   └── widgets/        # Embedded UI components
├── activitypub/        # ActivityPub federation (TypeScript)
├── ai-agent/           # AI agent system (TypeScript)
│   ├── core/           # LLM integration, memory, tools
│   └── capabilities/   # Economic, governance, education AI
├── portal/             # User-facing portal
│   ├── mobile/         # React Native app
│   ├── web/            # Web app
│   └── desktop/        # Electron wrapper
└── docs/               # Documentation
    ├── ARCHITECTURE.md
    ├── IMPLEMENTATION.md
    └── USER_GUIDE.md
```

## Documentation

- **[ARCHITECTURE.md](ARCHITECTURE.md)** — Complete system architecture and design decisions
- **[IMPLEMENTATION.md](IMPLEMENTATION.md)** — Developer guide with code examples
- **[USER_GUIDE.md](USER_GUIDE.md)** — End-user guide for all features

## Roadmap

### Phase 1: Foundation (Months 1-6)
- Holochain identity + economic engine
- Stellar UBI distribution
- Matrix communication
- Basic portal (web + mobile)

### Phase 2: Core Features (Months 7-12)
- hREA economic accounting
- Time banking module
- Governance voting
- Marketplace MVP
- AI agent integration
- ActivityPub federation

### Phase 3: Scale & Polish (Months 13-18)
- Community server deployment
- Advanced AI capabilities
- Multi-language support
- Security audit
- Mainnet launch

### Phase 4: Federation & Growth (Months 19-24)
- Inter-community trade
- Cross-state governance
- Mesh networking
- Global federation tools

## Contributing

We welcome contributions! Every contribution earns time credits.

1. Report bugs
2. Suggest features
3. Write documentation
4. Translate to other languages
5. Mentor new members
6. Teach courses
7. Submit code

See [CONTRIBUTING.md](CONTRIBUTING.md) for details.

## License

AGPL-3.0 — Open source, community-owned.

## Contact

- Website: circlenomic.org
- Matrix: #general:matrix.circlenomic.org
- ActivityPub: @circlenomic-community
- Email: hello@circlenomic.org

---

*Building the future of cooperative civilization, one node at a time.*
