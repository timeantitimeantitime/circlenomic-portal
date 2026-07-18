# Circlenomic Project Structure

## Complete Directory Layout

```
circlenomic/
│
├── README.md                           # Project overview
├── ARCHITECTURE.md                     # Full system architecture
├── MINING_ARCHITECTURE.md              # Mining layer design
├── TOKEN_SPEC.md                       # CIRCL token specification
├── UBI_MECHANISM.md                    # UBI distribution design
├── USER_GUIDE.md                       # End-user guide
├── IMPLEMENTATION.md                   # Developer guide
├── PROJECT_STRUCTURE.md                # This file
│
├── mining-layer/                       # ==================================
│   │                                   # MINING LAYER (Ravencoin fork)
│   │                                   # ==================================
│   │
│   ├── ravencoin/                      # Forked Ravencoin source
│   │   ├── src/
│   │   │   ├── chainparams.cpp         # Modify: network name, ports, seeds
│   │   │   ├── consensus/params.h      # Modify: rewards, halving
│   │   │   ├── validation.cpp          # Add: UBI distribution logic
│   │   │   ├── miner.cpp               # Modify: reward splitting
│   │   │   ├── wallet/wallet.cpp       # Add: UBI claiming
│   │   │   ├── rpc/misc.cpp            # Add: UBI RPC commands
│   │   │   └── qt/                     # Rename GUI to Circlenomic
│   │   │
│   │   ├── contrib/
│   │   │   └── circlenomic/            # NEW: Circlenomic configs
│   │   │       ├── circlenomic.conf    # Default configuration
│   │   │       ├── bootstrap-nodes.txt # Network bootstrap nodes
│   │   │       └── mine-params.json    # Mining parameters
│   │   │
│   │   └── doc/
│   │       ├── build-osx.md            # Update for Circlenomic
│   │       ├── build-ubuntu.md         # Update for Circlenomic
│   │       └── circlenomic-ubi.md      # NEW: UBI documentation
│   │
│   ├── wallet/                         # NEW: Circlenomic wallet
│   │   ├── mobile/                     # React Native wallet app
│   │   │   ├── src/
│   │   │   │   ├── screens/
│   │   │   │   │   ├── MiningScreen.tsx    # Mining dashboard
│   │   │   │   │   ├── UBIScreen.tsx       # UBI claiming
│   │   │   │   │   ├── EducationScreen.tsx # Course progress
│   │   │   │   │   ├── WalletScreen.tsx    # Balance & txns
│   │   │   │   │   └── SettingsScreen.tsx  # Configuration
│   │   │   │   ├── components/
│   │   │   │   ├── services/
│   │   │   │   │   ├── mining.ts       # Mining service
│   │   │   │   │   ├── ubi.ts          # UBI claiming
│   │   │   │   │   └── rpc.ts          # RPC communication
│   │   │   │   └── hooks/
│   │   │   ├── android/
│   │   │   ├── ios/
│   │   │   └── package.json
│   │   │
│   │   └── desktop/                    # Electron wallet app
│   │       ├── src/
│   │       ├── electron/
│   │       └── package.json
│   │
│   └── contracts/                      # Soroban smart contracts
│       ├── ubi/
│       │   ├── src/lib.rs              # UBI distribution contract
│       │   └── Cargo.toml
│       ├── education/
│       │   ├── src/lib.rs              # Education verification
│       │   └── Cargo.toml
│       └── governance/
│           ├── src/lib.rs              # Voting contract
│           └── Cargo.toml
│
├── social-layer/                       # ==================================
│   │                                   # SOCIAL LAYER (No blockchain)
│   │                                   # ==================================
│   │
│   ├── activitypub/                    # Federation layer
│   │   ├── src/
│   │   │   ├── actors/
│   │   │   │   ├── community.ts        # Community actor
│   │   │   │   ├── marketplace.ts      # Marketplace actor
│   │   │   │   ├── education.ts        # Education actor
│   │   │   │   └── governance.ts       # Governance actor
│   │   │   ├── activities/
│   │   │   │   ├── offer.ts            # Marketplace offers
│   │   │   │   ├── achieve.ts          # Education achievements
│   │   │   │   └── propose.ts          # Governance proposals
│   │   │   ├── objects/
│   │   │   │   ├── service.ts          # Service listings
│   │   │   │   ├── credential.ts       # Education credentials
│   │   │   │   └── proposal.ts         # Governance proposals
│   │   │   └── index.ts
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   ├── matrix/                         # Communication layer
│   │   ├── app-service/                # Custom Application Service
│   │   │   ├── src/
│   │   │   │   ├── index.ts            # App service entry
│   │   │   │   ├── commands/
│   │   │   │   │   ├── balance.ts      # /circle balance
│   │   │   │   │   ├── mining.ts       # /circle mining
│   │   │   │   │   ├── ubi.ts          # /circle ubi
│   │   │   │   │   ├── vote.ts         # /circle vote
│   │   │   │   │   ├── market.ts       # /circle market
│   │   │   │   │   └── ai.ts           # /circle ai
│   │   │   │   ├── handlers/
│   │   │   │   │   ├── message.ts      # Message handling
│   │   │   │   │   ├── reaction.ts     # Reaction handling
│   │   │   │   │   └── membership.ts   # Room membership
│   │   │   │   └── services/
│   │   │   │       ├── rpc.ts          # Circlenomic RPC client
│   │   │   │       └── notification.ts # Notification service
│   │   │   ├── package.json
│   │   │   └── tsconfig.json
│   │   │
│   │   ├── bots/                       # Bot implementations
│   │   │   ├── ubi-bot/
│   │   │   │   ├── src/index.ts
│   │   │   │   └── package.json
│   │   │   ├── governance-bot/
│   │   │   │   ├── src/index.ts
│   │   │   │   └── package.json
│   │   │   ├── marketplace-bot/
│   │   │   │   ├── src/index.ts
│   │   │   │   └── package.json
│   │   │   └── education-bot/
│   │   │       ├── src/index.ts
│   │   │       └── package.json
│   │   │
│   │   └── widgets/                    # Embedded UI components
│   │       ├── voting-widget/
│   │       │   ├── src/
│   │       │   └── package.json
│   │       ├── mining-widget/
│   │       │   ├── src/
│   │       │   └── package.json
│   │       └── marketplace-widget/
│   │           ├── src/
│   │           └── package.json
│   │
│   └── ipfs/                           # Decentralized storage
│       ├── pinning/                    # Pinning service config
│       │   ├── config.json
│       │   └── pin-service.ts
│       └── content/                    # Content types
│           ├── courses/
│           ├── proposals/
│           └── transparency/
│
├── ai-agent/                           # ==================================
│   │                                   # AI AGENT (Local LLM)
│   │                                   # ==================================
│   │
│   ├── core/
│   │   ├── llm/
│   │   │   ├── local.ts                # Local LLM interface
│   │   │   ├── ollama.ts               # Ollama integration
│   │   │   └── model-manager.ts        # Model loading/switching
│   │   ├── memory/
│   │   │   ├── manager.ts              # Memory management
│   │   │   ├── conversation.ts         # Conversation history
│   │   │   └── user-preferences.ts     # User settings
│   │   └── tools/
│   │       ├── executor.ts             # Tool execution
│   │       ├── rpc-tools.ts            # Circlenomic RPC tools
│   │       └── web-tools.ts            # Web search tools
│   │
│   ├── capabilities/
│   │   ├── economic/
│   │   │   ├── mining-assistant.ts     # Mining help
│   │   │   ├── ubi-explainer.ts        # UBI education
│   │   │   └── timebank-helper.ts      # Time banking
│   │   ├── governance/
│   │   │   ├── proposal-analyzer.ts    # Analyze proposals
│   │   │   ├── voting-guide.ts         # Voting assistance
│   │   │   └── community-moderator.ts  # Moderation
│   │   ├── education/
│   │   │   ├── tutor.ts                # Course tutoring
│   │   │   ├── skill-matcher.ts        # Skill matching
│   │   │   └── content-creator.ts      # Course creation
│   │   └── marketplace/
│   │       ├── listing-helper.ts       # Create listings
│   │       ├── price-suggester.ts      # Price suggestions
│   │       └── match-maker.ts          # Buyer/seller matching
│   │
│   ├── models/                         # Model configurations
│   │   ├── gemma-4-e4b/
│   │   │   ├── config.json
│   │   │   └── modelfile
│   │   └── mistral-small/
│   │       ├── config.json
│   │       └── modelfile
│   │
│   ├── package.json
│   └── tsconfig.json
│
├── portal/                             # ==================================
│   │                                   # USER PORTAL (Web + Mobile)
│   │                                   # ==================================
│   │
│   ├── mobile/                         # React Native app
│   │   ├── src/
│   │   │   ├── screens/
│   │   │   │   ├── Onboarding/
│   │   │   │   │   ├── WelcomeScreen.tsx
│   │   │   │   │   ├── CreateAccountScreen.tsx
│   │   │   │   │   ├── JoinCommunityScreen.tsx
│   │   │   │   │   └── DigitalLiteracyScreen.tsx
│   │   │   │   ├── Dashboard/
│   │   │   │   │   ├── HomeScreen.tsx
│   │   │   │   │   └── QuickActions.tsx
│   │   │   │   ├── Mining/
│   │   │   │   │   ├── MiningScreen.tsx
│   │   │   │   │   ├── MiningStats.tsx
│   │   │   │   │   └── MiningSettings.tsx
│   │   │   │   ├── Economic/
│   │   │   │   │   ├── WalletScreen.tsx
│   │   │   │   │   ├── TransactionHistory.tsx
│   │   │   │   │   └── UBIScreen.tsx
│   │   │   │   ├── Governance/
│   │   │   │   │   ├── ProposalsScreen.tsx
│   │   │   │   │   ├── ProposalDetail.tsx
│   │   │   │   │   ├── VotingScreen.tsx
│   │   │   │   │   └── CreateProposal.tsx
│   │   │   │   ├── Marketplace/
│   │   │   │   │   ├── MarketplaceScreen.tsx
│   │   │   │   │   ├── ListingDetail.tsx
│   │   │   │   │   ├── CreateListing.tsx
│   │   │   │   │   └── Messages.tsx
│   │   │   │   ├── Education/
│   │   │   │   │   ├── CoursesScreen.tsx
│   │   │   │   │   ├── CourseDetail.tsx
│   │   │   │   │   ├── LessonPlayer.tsx
│   │   │   │   │   └── Achievements.tsx
│   │   │   │   ├── Communication/
│   │   │   │   │   ├── ChatScreen.tsx
│   │   │   │   │   ├── RoomList.tsx
│   │   │   │   │   └── RoomDetail.tsx
│   │   │   │   ├── Community/
│   │   │   │   │   ├── CommunityScreen.tsx
│   │   │   │   │   ├── MembersList.tsx
│   │   │   │   │   └── EventsScreen.tsx
│   │   │   │   └── Settings/
│   │   │   │       ├── SettingsScreen.tsx
│   │   │   │       ├── PrivacyScreen.tsx
│   │   │   │       ├── BackupScreen.tsx
│   │   │   │       └── AboutScreen.tsx
│   │   │   ├── components/
│   │   │   │   ├── common/
│   │   │   │   ├── mining/
│   │   │   │   ├── economic/
│   │   │   │   ├── governance/
│   │   │   │   ├── marketplace/
│   │   │   │   └── education/
│   │   │   ├── services/
│   │   │   │   ├── rpc.ts              # Circlenomic RPC client
│   │   │   │   ├── mining.ts           # Mining service
│   │   │   │   ├── ubi.ts              # UBI service
│   │   │   │   ├── matrix.ts           # Matrix client
│   │   │   │   └── ai.ts               # AI agent client
│   │   │   ├── hooks/
│   │   │   ├── contexts/
│   │   │   └── utils/
│   │   ├── android/
│   │   ├── ios/
│   │   ├── package.json
│   │   └── app.json
│   │
│   ├── web/                            # Web app (shared code)
│   │   ├── src/
│   │   ├── public/
│   │   ├── package.json
│   │   └── vite.config.ts
│   │
│   └── desktop/                        # Electron wrapper
│       ├── src/
│       ├── electron/
│       └── package.json
│
├── infrastructure/                     # ==================================
│   │                                   # DEPLOYMENT & OPERATIONS
│   │                                   # ==================================
│   │
│   ├── docker/
│   │   ├── docker-compose.yml          # Full stack compose
│   │   ├── docker-compose.dev.yml      # Development compose
│   │   ├── mining-node/
│   │   │   ├── Dockerfile
│   │   │   └── circlenomic.conf
│   │   ├── matrix/
│   │   │   ├── Dockerfile
│   │   │   ├── synapse/
│   │   │   │   └── homeserver.yaml
│   │   │   └── postgres/
│   │   ├── activitypub/
│   │   │   └── Dockerfile
│   │   ├── ai-agent/
│   │   │   ├── Dockerfile
│   │   │   └── models/
│   │   └── ipfs/
│   │       └── Dockerfile
│   │
│   ├── kubernetes/
│   │   ├── namespace.yaml
│   │   ├── mining/
│   │   │   ├── deployment.yaml
│   │   │   ├── service.yaml
│   │   │   └── pvc.yaml
│   │   ├── matrix/
│   │   │   ├── deployment.yaml
│   │   │   ├── service.yaml
│   │   │   └── ingress.yaml
│   │   ├── activitypub/
│   │   │   ├── deployment.yaml
│   │   │   └── service.yaml
│   │   ├── ai-agent/
│   │   │   ├── deployment.yaml
│   │   │   └── service.yaml
│   │   └── monitoring/
│   │       ├── prometheus/
│   │       └── grafana/
│   │
│   ├── terraform/
│   │   ├── main.tf
│   │   ├── variables.tf
│   │   └── outputs.tf
│   │
│   └── scripts/
│       ├── setup.sh                    # Full setup script
│       ├── dev.sh                      # Development start
│       ├── deploy.sh                   # Production deploy
│       └── backup.sh                   # Backup script
│
└── docs/                               # ==================================
    │                                   # DOCUMENTATION
    │                                   # ==================================
    │
    ├── guides/
    │   ├── getting-started.md
    │   ├── mining-guide.md
    │   ├── ubi-guide.md
    │   ├── governance-guide.md
    │   └── education-guide.md
    │
    ├── api/
    │   ├── rpc-api.md
    │   ├── rest-api.md
    │   └── websocket-api.md
    │
    ├── specifications/
    │   ├── token-spec.md
    │   ├── consensus-spec.md
    │   └── ubi-spec.md
    │
    └── community/
        ├── charter.md
        ├── contributing.md
        └── code-of-conduct.md
```

---

## Key Files to Start Building

### Priority 1: Mining Layer (Week 1-4)

```
mining-layer/ravencoin/src/chainparams.cpp
├── Change: strNetworkName = "circlenomic"
├── Change: nDefaultPort = 8767
├── Change: bech32Prefixes
└── Add: Circlenomic seed nodes

mining-layer/ravencoin/src/consensus/params.h
├── Change: nSubsidy = 5000 * COIN
├── Change: nSubsidyHalvingInterval = 2102400
├── Add: nMinerPercent = 40
├── Add: nUBIPercent = 30
├── Add: nCommunityPercent = 20
└── Add: nDevPercent = 10

mining-layer/ravencoin/src/validation.cpp
├── Add: UBI pool funding logic
├── Add: Distribution snapshot
└── Add: Eligibility verification
```

### Priority 2: Wallet (Week 5-8)

```
mining-layer/wallet/mobile/src/
├── screens/MiningScreen.tsx
├── screens/UBIScreen.tsx
├── services/mining.ts
├── services/ubi.ts
└── services/rpc.ts
```

### Priority 3: Matrix Integration (Week 9-12)

```
social-layer/matrix/app-service/src/
├── index.ts
├── commands/balance.ts
├── commands/mining.ts
├── commands/ubi.ts
└── services/rpc.ts
```

---

## Development Commands

```bash
# Setup development environment
./scripts/setup.sh

# Start all services (development)
./scripts/dev.sh

# Build mining node
cd mining-layer/ravencoin
./autogen.sh
./configure
make -j$(nproc)

# Build wallet
cd mining-layer/wallet/mobile
npm install
npm run start

# Build matrix app-service
cd social-layer/matrix/app-service
npm install
npm run build

# Run tests
npm test

# Deploy to testnet
./scripts/deploy-testnet.sh
```

---

## Environment Variables

```bash
# Mining layer
CIRCL_NETWORK=mainnet|testnet
CIRCL_DATA_DIR=~/.circlenomic
CIRCL_RPC_USER=user
CIRCL_RPC_PASS=pass
CIRCL_RPC_PORT=8766

# Matrix
MATRIX_HOMESERVER_URL=http://localhost:8008
MATRIX_APP_TOKEN=your_app_token
MATRIX_PORT=9000

# AI Agent
AI_MODEL_PATH=./models/gemma-4-e4b
AI_PORT=3000
AI_PRIVACY_LEVEL=local-only

# IPFS
IPFS_API_URL=http://localhost:5001
IPFS_GATEWAY_URL=http://localhost:8080
```

---

*Project structure version: 1.0*
*Last updated: July 2026*
