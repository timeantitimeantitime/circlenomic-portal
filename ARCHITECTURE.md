# Circlenomic Network Society Portal

## Complete System Architecture

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [Design Principles](#design-principles)
3. [Technology Stack](#technology-stack)
4. [Mining Layer](#mining-layer)
5. [System Architecture](#system-architecture)
6. [Module Specifications](#module-specifications)
7. [User Experience Design](#user-experience-design)
8. [Implementation Roadmap](#implementation-roadmap)

---

## Executive Summary

Circlenomic is a node-based portal for a Network Society that enables citizens to participate in a decentralized, self-governing community economy. Each user runs a **personal node** (wallet) that mines CIRCL cryptocurrency, earns Universal Basic Income, and participates in governance.

The portal is built on a **two-layer architecture**:
1. **Mining Layer**: A Bitcoin/Ravencoin fork that enables CPU mining of CIRCL tokens, funds UBI through block rewards, and provides the economic foundation.
2. **Social Layer**: ActivityPub (federation), Matrix.org (encrypted communication), IPFS (storage), and AI agents — all off-chain for efficiency.

### Key Innovation: Mine-to-Earn UBI

Unlike traditional blockchains where only miners benefit, Circlenomic distributes mining rewards to all citizens:

- **40%** to the miner who found the block
- **30%** to the UBI pool (distributed monthly to all eligible citizens)
- **20%** to community treasury (funded projects)
- **10%** to development fund (ongoing maintenance)

Citizens also earn **boosted UBI** by completing education, teaching others, and participating in governance.

### Key Innovation: The Personal Node

Every Circlenomic citizen operates a **personal node** — a lightweight wallet application running on their phone, laptop, or home server. This node:

- **Mines CIRCL** automatically (CPU mining, ASIC-resistant)
- Stores the user's identity, reputation, and economic history
- Claims monthly UBI distributions
- Runs a local AI agent for assistance
- Syncs with Matrix for communication
- Participates in governance voting

The node is designed for **zero technical knowledge** — installation is one tap, and all complexity is abstracted away.

---

## Design Principles

### 1. Mine-to-Earn, Not Stake-to-Earn

Traditional blockchains require staking large amounts of capital or running expensive ASIC miners. Circlenomic uses **CPU mining** that anyone can participate in by simply running the wallet app on their phone or laptop.

**Result**: Mining is accessible to everyone, not just those with capital or specialized hardware.

### 2. Subsidiarity and Fractal Governance

Governance operates at four nested levels:

| Level | Scope | Example Decisions |
|-------|-------|-------------------|
| **Individual** | Personal data, reputation, wallet | Privacy settings, time allocation |
| **Community Node** | Local neighborhood/city | Community projects, local timebank rules |
| **Network State** | Regional/national coalition | Economic policy, UBI rates, inter-community trade |
| **Federation** | Global alliances | Planetary issues (climate, human rights) |

Decisions are made at the lowest effective level. A neighborhood handles its own timebank; UBI policy is set at the Network State level.

### 3. Voice and Exit

Citizens can always:
- **Voice**: Propose changes, vote, participate in governance
- **Exit**: Leave a community, take their reputation and history, join another

No locks, no penalties for leaving. Competition between communities drives quality.

### 4. Privacy by Default

- Zero-knowledge proofs for identity verification
- Local data storage (not on a global ledger)
- Encrypted communication (Matrix E2EE)
- Programmable privacy via Proof-Carrying Data

### 5. No Token Plutocracy

Voting power is NOT based on wealth. It is based on:
- **Participation**: How actively you contribute
- **Reputation**: Verified through community endorsement
- **Expertise**: Domain-specific credentials (soulbound tokens)
- **Time**: Consistent long-term participation

---

## Technology Stack

### Layer 1: Mining Layer — Ravencoin Fork (CIRCL Token)

**Why Ravencoin:**
- ASIC-resistant (KawPow algorithm) — CPU mining works longer
- Asset tokens built-in — issue community tokens easily
- Faster blocks (1 minute) — quicker confirmations
- Based on Bitcoin — proven, secure codebase
- Already has mobile wallets

**CIRCL Token:**
- Block reward: 5,000 CIRCL
- Block time: 60 seconds
- Max supply: 21,000,000,000 CIRCL
- Halving: Every 4 years (~2,102,400 blocks)
- No pre-mine, no ICO — fair launch

**Block Reward Distribution:**
```
40% → Miner (who found the block)
30% → UBI Pool (monthly distribution)
20% → Community Treasury (funded projects)
10% → Development Fund (ongoing maintenance)
```

**Core Components:**
```
mining-layer/
├── ravencoin/                      # Forked source code
│   ├── src/
│   │   ├── chainparams.cpp         # Network parameters
│   │   ├── consensus/params.h      # Rewards, halving
│   │   ├── validation.cpp          # UBI distribution logic
│   │   ├── miner.cpp               # Mining rewards split
│   │   └── wallet/wallet.cpp       # UBI claiming
│   └── contrib/circlenomic/        # Configuration files
├── wallet/                         # User wallet apps
│   ├── mobile/                     # React Native
│   └── desktop/                    # Electron
└── contracts/                      # Soroban smart contracts
    ├── ubi/                        # UBI distribution
    ├── education/                  # Course verification
    └── governance/                 # Voting
```

**Mining Tiers:**
| Tier | Hardware | CPU Usage | Expected Daily | Boost |
|------|----------|-----------|----------------|-------|
| Basic | Phone/Laptop | 10-20% | 50-200 CIRCL | +10% |
| Enhanced | Desktop/GPU | 30-50% | 500-2,000 CIRCL | +20% |
| Community | Dedicated Server | 99% uptime | 2,000-10,000 CIRCL | +50% |

### Layer 2: Social Layer — ActivityPub + Matrix (Off-Chain)

**Why Off-Chain:**
- No gas fees for social interactions
- Faster than on-chain transactions
- Better privacy (not everything on public ledger)
- Mature protocols (ActivityPub, Matrix)

**ActivityPub (Federation):**
- Connects to Mastodon, PeerTube, Lemmy, Pixelfed
- Community announcements, marketplace listings
- Education achievements shared across Fediverse
- W3C standard — no vendor lock-in

**Matrix.org (Communication):**
- End-to-end encrypted messaging
- Voice/video conferencing (MatrixRTC)
- Bridging to Slack, Discord, Telegram
- Bot framework for UBI/governance notifications

**Core Components:**
```
social-layer/
├── activitypub/                    # Federation layer
│   └── src/actors/                 # Community, marketplace, education actors
├── matrix/                         # Communication layer
│   ├── app-service/                # Custom Application Service
│   ├── bots/                       # UBI, governance, marketplace bots
│   └── widgets/                    # Embedded UI components
└── ipfs/                           # Decentralized storage
    ├── pinning/                    # Content pinning
    └── content/                    # Courses, proposals, transparency
```

### Layer 3: AI Layer — Local LLM (On-Device)

**Why Local:**
- Privacy: data never leaves the device
- No API costs
- Works offline
- Community-controlled

**Models:**
| Use Case | Model | VRAM | Deployment |
|----------|-------|------|------------|
| On-device assistant | Gemma 4 E4B | 3.5GB | User's phone/laptop |
| Community server AI | Mistral Small 3.1 | 14GB | Community hub |

**Capabilities:**
- Mining assistance and optimization
- UBI eligibility checking
- Governance proposal analysis
- Education tutoring
- Marketplace matching
- Time banking coordination

// Time Banking Contract
contract TimeBank {
    // Work verification
    storage: Map<WorkRecordID, WorkRecord>

    fn verify_work(
        worker: DID,
        hours: i64,
        verifier: DID,
        category: WorkCategory
    ) -> Result<(), Error> {
        require!(is_authorized_verifier(verifier, category), Error::UnauthorizedVerifier)

        let record = WorkRecord {
            worker,
            hours,
            verifier,
            category,
            timestamp: env::ledger().timestamp(),
            status: WorkStatus::Verified
        }

        storage.set(new_id(), record)

        // Issue time credits (1 hour = 1 credit, demurrage applied)
        let credits = TimeCredit::new(worker, hours)
        credits.apply_demurrage(DEMURRAGE_RATE)

        Ok(())
    }
}

// Voting Contract (MACI-inspired)
contract GovernanceVoting {
    fn cast_vote(
        voter: DID,
        proposal_id: ProposalID,
        choice: VoteChoice,
        proof: ZKProof  // Zero-knowledge proof of eligibility
    ) -> Result<(), Error> {
        // Verify voter eligibility via ZK proof
        verify_eligibility(proof, voter)?;

        // Record encrypted vote
        let encrypted_vote = encrypt_vote(choice, voter);
        storage.set((proposal_id, voter), encrypted_vote);

        Ok(())
    }

    fn tally_votes(proposal_id: ProposalID) -> Result<Tally, Error> {
        // Decrypt and tally using MACI-style decryption
        let votes = storage.get_all(proposal_id)?;
        let tally = maci_tally(votes)?;

        Ok(tally)
    }
}
```

### Layer 3: Communication — Matrix.org

**Why Matrix:**
- End-to-end encrypted by default
- Real-time messaging, voice, video
- Rich bridging ecosystem (Slack, Discord, Telegram, WhatsApp)
- Widget system for embedded applications
- ActivityPub bridging available
- Foundation-backed with corporate support

**Integration Architecture:**

```
Circlenomic Portal
    ├── Matrix Client (Element X / Custom)
    │   ├── Encrypted DMs
    │   ├── Community Rooms
    │   ├── Governance Channels
    │   ├── Economic Notifications
    │   └── AI Agent Chat
    ├── Matrix Bot Framework
    │   ├── UBI Distribution Alerts
    │   ├── Time Banking Notifications
    │   ├── Voting Reminders
    │   └── Marketplace Updates
    └── ActivityPub Bridge
        ├── Federation with Fediverse
        ├── Cross-platform posting
        └── Community discovery
```

**Custom Bot Commands:**
```
/circle balance          — Check time credit balance
/circle work-log 2h "cooking class" — Log work
/circle vote proposal-42 — Access voting interface
/circle find-skill "plumbing" — Find service providers
/circle ubi-status       — Check UBI distribution status
/circle ai help me [question] — Invoke AI agent
```

### Layer 4: Federation — ActivityPub

**Why ActivityPub:**
- W3C standard protocol
- Massive existing Fediverse ecosystem (Mastodon, PeerTube, Lemmy, etc.)
- Enables community discovery and cross-platform interaction
- Open, interoperable, no vendor lock-in

**Federation Model:**

```
Circlenomic Community Server
    ├── Local Users (via Matrix)
    ├── Fediverse Users (via ActivityPub)
    │   ├── Mastodon users can follow Circlenomic announcements
    │   ├── Lemmy communities for governance discussion
    │   ├── PeerTube for educational content
    │   └── Pixelfed for community visual media
    └── Custom ActivityPub Actors
        ├── CommunityActor (announcements, governance)
        ├── EconomicActor (marketplace, timebank)
        └── EducationActor (courses, achievements)
```

**Custom Activity Types:**

```json
{
  "@context": "https://circlenomic.org/activitypub/context",
  "type": "Offer",
  "actor": "did:holo:user123",
  "object": {
    "type": "Service",
    "name": "Plumbing repair",
    "description": "Fix leaky faucet and install new sink",
    "timeCredits": 3,
    "category": "Home Repair",
    "availability": "Weekends only"
  }
}

{
  "type": "Achieve",
  "actor": "did:holo:user456",
  "object": {
    "type": "Credential",
    "name": "First Aid Certification",
    "issuer": "did:holo:community789",
    "dateIssued": "2026-07-15"
  }
}
```

### Layer 5: Decentralized Storage — IPFS + Arweave

**Hybrid Approach:**

| Content | Storage | Rationale |
|---------|---------|-----------|
| dApp frontends | IPFS | Dynamic, frequently updated |
| Time banking records | IPFS | Active, queryable data |
| Governance decisions | Arweave | Permanent audit trail |
| Community charter | Arweave | Immutable foundational document |
| UBI distribution proofs | Arweave | Permanent financial records |
| Educational content | IPFS + Arweave | IPFS for access, Arweave for permanent version |
| AI agent knowledge base | IPFS | Community-curated, updatable |

### Layer 6: AI Agents — Local LLMs

**Why Local:**
- Privacy: data never leaves the user's device
- No API costs
- Works offline
- Community-controlled

**Recommended Models:**

| Use Case | Model | VRAM | Deployment |
|----------|-------|------|------------|
| On-device assistant | Gemma 4 E4B | 3.5GB | User's phone/laptop |
| Community server AI | Mistral Small 3.1 | 14GB | Community hub server |
| Governance analyzer | Gemma 4 31B | 20GB | Network State server |

**AI Agent Capabilities:**

```
Circlenomic AI Agent
├── Economic Assistant
│   ├── Explain time banking
│   ├── Suggest skill exchanges
│   ├── Help log work
│   └── Analyze spending patterns
├── Governance Assistant
│   ├── Summarize proposals
│   ├── Explain voting options
│   ├── Track active proposals
│   └ Facilitate discussion
├── Education Assistant
│   ├── Khan Academy-style tutoring
│   ├── Skill gap analysis
│   ├── Learning path recommendations
│   └── Peer matching for study groups
├── Marketplace Assistant
│   ├── Help list items/services
│   ├── Price suggestions
│   ├── Match buyers/sellers
│   └── Verify trust scores
└── Wellbeing Assistant
    ├── Community resource navigation
    ├── Conflict mediation support
    ├── Social connection suggestions
    └── Mental health resource referral
```

**AI Agent Integration:**

```typescript
// CirclenomicAgent
interface Agent {
  // Identity
  id: string
  userId: DID
  capabilities: AgentCapability[]

  // Core functions
  respondToMessage(message: string): Promise<string>
  analyzeGovernanceProposal(proposal: Proposal): Promise<Analysis>
  suggestTimeBankMatch(
    skill: string,
    availability: Schedule
  ): Promise<Match[]>
  summarizeEducationalContent(content: Content): Promise<Summary>
  mediateConflict(
    parties: [DID, DID],
    context: string
  ): Promise<MediationSuggestion>

  // Privacy
  localInference: boolean  // Never send data externally
  dataRetention: "ephemeral" | "session" | "persistent"
  userControl: "full"  // User owns all data
}
```

---

## Mining Layer

### How Mining Works

```
User installs Circlenomic wallet
        ↓
Wallet starts mining automatically (low CPU usage)
        ↓
Every ~60 seconds, a new block is found
        ↓
Block reward = 5,000 CIRCL
        ↓
Reward split:
├── 40% → Miner (user who found the block)
├── 30% → UBI Pool (distributed to all citizens)
├── 20% → Community Treasury (funded projects)
└── 10% → Development Fund (ongoing maintenance)
```

### Education-Linked Mining

Users earn extra mining rewards by completing educational tasks:

```
Base Mining Rate: 100%
│
├── Complete Digital Literacy Course:     +10%
├── Complete Financial Literacy Course:   +10%
├── Complete Governance Course:           +10%
├── Complete Technical Skill Course:      +10%
├── Teach a Course to Others:            +15%
├── Mentor a New Member:                 +10%
├── Complete Community Service Hours:     +10%
└── Maximum Bonus Cap:                   +50%
```

### UBI Distribution

```
UBI Pool accumulates from mining rewards (30% of every block)
        ↓
Every 30 days, distribution occurs
        ↓
Eligible citizens receive their share
        ↓
Distribution = (Pool Balance / Eligible Citizens) × Individual Boost
```

### Eligibility Requirements

```
To receive UBI, you must:

1. Have an active wallet (mining or synced) in the last 30 days
2. Complete Digital Literacy course (one-time)
3. Have at least 1 community endorsement
4. Not be flagged for sybil attack
```

### Boost Multipliers

| Achievement | Boost | Duration |
|-------------|-------|----------|
| Education completion | +10% | Permanent |
| Teaching experience | +15% | 6 months |
| Mentoring new members | +10% | 12 months |
| Community service hours | +10% | 6 months |
| Governance participation | +5% | 6 months |
| **Maximum total boost** | **+50%** | — |

---

## System Architecture

### High-Level Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                     CIRCLENOMIC PERSONAL NODE                        │
│  (Phone, Laptop, or Home Server)                                     │
│                                                                      │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌───────────┐  │
│  │  Identity    │  │  Mining     │  │  AI Agent   │  │  Storage  │  │
│  │  Manager     │  │  Engine     │  │  (Local     │  │  (IPFS    │  │
│  │  (DID/SBT)  │  │  (CPU)     │  │   LLM)     │  │   Node)   │  │
│  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘  └─────┬─────┘  │
│         │                │                │                │         │
│         └────────────────┼────────────────┼────────────────┘         │
│                          │                │                          │
│                          ▼                ▼                          │
│              ┌───────────────────────────────────────┐               │
│              │       Circlenomic Wallet               │               │
│              │  (Mining + UBI + Transactions)         │               │
│              └───────────────┬───────────────────────┘               │
│                              │                                       │
└──────────────────────────────┼───────────────────────────────────────┘
                               │
                               ▼
┌──────────────────────────────────────────────────────────────────────┐
│                 CIRCLENOMIC BLOCKCHAIN (CIRCL)                       │
│                                                                      │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐            │
│  │  Mining  │  │   UBI    │  │Community │  │   Dev    │            │
│  │  Rewards │  │   Pool   │  │ Treasury │  │   Fund   │            │
│  │  (40%)   │  │  (30%)   │  │  (20%)   │  │  (10%)   │            │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘            │
│                                                                      │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐            │
│  │  Block   │  │Transaction│  │  UBI     │  │Education │            │
│  │  Headers │  │  Ledger   │  │Distribu- │  │  Proofs  │            │
│  │          │  │           │  │  tion    │  │          │            │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘            │
│                                                                      │
└──────────────────────────────────────────────────────────────────────┘
                               │
                    ┌──────────┼──────────┐
                    ▼          ▼          ▼
            ┌──────────┐ ┌──────────┐ ┌──────────┐
            │ ActivityPub│ │  Matrix  │ │  IPFS/   │
            │(Fediverse)│ │  (Chat)  │ │ Arweave  │
            └──────────┘ └──────────┘ └──────────┘
                    │          │          │
                    ▼          ▼          ▼
            ┌──────────────────────────────────┐
            │       External World              │
            │  (Fiat, Other Communities, etc.)  │
            └──────────────────────────────────┘
```
                    ┌──────────┼──────────┐
                    ▼          ▼          ▼
            ┌──────────┐ ┌──────────┐ ┌──────────┐
            │  Stellar │ │  Matrix  │ │ActivityPub│
            │  (Settle)│ │  (Chat)  │ │ (Fediverse)│
            └──────────┘ └──────────┘ └──────────┘
                    │          │          │
                    ▼          ▼          ▼
            ┌──────────────────────────────────┐
            │       External World              │
            │  (Fiat, Other Communities, etc.)  │
            └──────────────────────────────────┘
```

### Data Flow

```
User Action → Personal Node → Holochain DHT → Community Validation
                ↓                                    ↓
        Local Storage                     DHT Record Stored
                ↓                                    ↓
        UI Update ←──────────────────── Notification to Related Nodes
                ↓
        Matrix Notification (if relevant)
                ↓
        ActivityPub Broadcast (if public)
```

---

## Module Specifications

### Module 1: Digital Identity & Trust

**Purpose**: Secure, self-sovereign identity that works across all Circlenomic services.

**Components:**

```
IdentityManager/
├── DID/
│   ├── did:holo:user123         # Holochain DID
│   └── did:stellar:GABC...     # Stellar public key
├── SoulboundTokens/
│   ├── CommunityMembership      # Which communities you belong to
│   ├── SkillCredentials         # Verified skills (e.g., "First Aid")
│   ├── GovernanceParticipation  # Voting history, proposals submitted
│   ├── TimeBankReputation       # Work quality, reliability score
│   └── EducationAchievements    # Courses completed, certifications
├── Privacy/
│   ├── ZKProofs                 # Prove claims without revealing data
│   ├── PCDs                     # Proof-Carrying Data
│   └── SelectiveDisclosure       # Choose what to share
└── Recovery/
    ├── SocialRecovery           # Trusted contacts can restore access
    └── BackupPhrase             # Encrypted backup for node migration
```

**Identity Verification Flow:**

```
1. User creates account → Personal node generates DID
2. Community endorsement → Existing members vouch for new member
3. Skill verification → Expert in domain confirms capability
4. SBTs issued → Non-transferable tokens attached to DID
5. ZK proofs available → Prove credentials without exposing data
```

**Example ZK Proof:**
```typescript
// Prove you're over 18 without revealing your birthday
const proof = await zkProver.generate({
  claim: "age >= 18",
  credential: user.sbt.ageVerification,
  // Reveals: boolean (true/false)
  // Does NOT reveal: actual birthdate
})

// Prove you're a community member without revealing which one
const membershipProof = await zkProver.generate({
  claim: "isMemberOfANY(CirclenomicCommunity)",
  credential: user.sbt.communityMembership,
  // Reveals: membership status
  // Does NOT reveal: which community
})
```

---

### Module 2: Universal Basic Income (UBI)

**Purpose**: Distribute regular income to all citizens based on participation, not wealth.

**UBI Model:**

```
UBI Distribution
├── Base Rate: 100 Time Credits / month
├── Participation Bonus: +10 credits per governance action
├── Skill Contribution: +5 credits per verified skill used
├── Community Service: +15 credits per verified service hour
├── Education Bonus: +20 credits per course completed
└── Demurrage: -2% per month (incentivizes circulation)
```

**Distribution Mechanism:**

```rust
// Monthly UBI distribution via Stellar
contract CirclenomicUBI {
    storage: {
        citizens: Map<DID, CitizenRecord>,
        monthly_pool: i128,
        distribution_schedule: Map<u32, i128>
    }

    fn distribute_monthly() -> Result<(), Error> {
        let current_month = env::ledger().timestamp() / SECONDS_PER_MONTH;

        // Calculate pool based on community size and contributions
        let pool_size = calculate_pool_size()?;
        let per_citizen = pool_size / citizen_count()?;

        // Distribute to all active citizens
        for citizen in active_citizens() {
            let bonus = calculate_participation_bonus(citizen);
            let amount = per_citizen + bonus;

            // Transfer on Stellar
            transfer_stellar(citizen.stellar_address, amount)?;

            // Record on Holochain
            record_ubi_distribution(citizen.did, amount, current_month)?;

            // Update reputation
            update_reputation(citizen.did, bonus / 10)?;
        }

        Ok(())
    }

    fn calculate_participation_bonus(citizen: &CitizenRecord) -> i128 {
        let governance_bonus = citizen.governance_actions_last_month * 10;
        let skill_bonus = citizen.skills_used_last_month * 5;
        let service_bonus = citizen.service_hours_last_month * 15;
        let education_bonus = citizen.courses_completed_last_month * 20;

        governance_bonus + skill_bonus + service_bonus + education_bonus
    }
}
```

**Time Banking Integration:**

```typescript
// Time Bank - 1 hour = 1 time credit
interface TimeBankRecord {
  id: string
  provider: DID          // Person who did the work
  receiver: DID          // Person who received the work
  hours: number          // Duration
  category: WorkCategory // Type of work
  description: string    // What was done
  verification: {
    verifier: DID        // Who confirmed the work
    proof: string        // Photo, receipt, etc.
    timestamp: number
  }
  credits: {
    earned: number       // Provider earns
    spent: number        // Receiver spends
    demurrage: number    // -2% per month if unspent
  }
}

// Work categories:
// - Care work (childcare, eldercare)
// - Education (tutoring, mentoring)
// - Home repair (plumbing, electrical)
// - Food (cooking, gardening)
// - Transportation (driving, delivery)
// - Administrative (record keeping, planning)
// - Creative (art, music, writing)
// - Technical (programming, design)
// - Community service (cleaning, organizing)
```

---

### Module 3: AI Agent

**Purpose**: Personal AI assistant that helps users navigate all Circlenomic services.

**Agent Architecture:**

```
CirclenomicAI
├── Core Engine
│   ├── Local LLM (Gemma 4 E4B on device)
│   ├── Community LLM (Mistral Small 3.1 on server)
│   └── Fallback: Cloud API (user opt-in only)
├── Memory
│   ├── Session Memory (ephemeral)
│   ├── User Preferences (local only)
│   └── Community Knowledge Base (IPFS)
├── Capabilities
│   ├── Natural Language Understanding
│   ├── Task Execution
│   ├── Information Retrieval
│   ├── Multi-modal (text, image, voice)
│   └── Multi-lingual
└── Privacy
    ├── Local Inference Only
    ├── No Data Sent Externally
    ├── User Controls All Data
    └── Transparent Decision Logs
```

**Agent Interactions:**

```typescript
// Example: User asks for help with time banking
const agent = new CirclenomicAgent(user)

const response = await agent.respond(
  "I want to offer cooking classes. How do I set that up?"
)

// Agent response:
// "I can help you set up a cooking class service! Here's what we need:
//
// 1. LIST YOUR SERVICE
//    → Go to Marketplace → Add Service
//    → Category: Food & Cooking
//    → Title: Cooking Classes
//    → Description: What cuisines/styles you teach
//    → Time Credits: How many per session
//    → Availability: Days/times you're available
//
// 2. SKILL VERIFICATION (optional but recommended)
//    → If you have culinary credentials, I can help you get verified
//    → This increases trust and attracts more students
//
// 3. PROMOTE YOUR CLASS
//    → I can announce it in the community Matrix room
//    → Cross-post to the Fediverse via ActivityPub
//    → Pin it in the marketplace
//
// Would you like me to start the listing process?"
```

**Agent Governance Assistance:**

```typescript
// Example: User asks about a governance proposal
const analysis = await agent.analyzeProposal("proposal-42")

// Agent analysis:
// "PROPOSAL #42: Increase UBI base rate by 20%
//
// SUMMARY:
// This proposal would increase the monthly UBI from 100 to 120 time credits.
// The additional 20 credits would be funded by a 5% allocation from
// marketplace transaction fees.
//
// PROS:
// - Increases purchasing power for all citizens
// - Encourages more economic activity
// - Addresses concerns about inflation in time credits
//
// CONS:
// - May reduce marketplace transaction volume
// - Could create inflation if not balanced
// - Some argue funds should go to infrastructure instead
//
// SIMILAR PROPOSALS:
// - Proposal #38 (passed): 10% increase 6 months ago
// - Proposal #35 (failed): 30% increase (too aggressive)
//
// RECOMMENDATION:
// Based on your past voting patterns, you tend to support moderate
// economic reforms. You might lean YES, but review the economic
// impact analysis linked below.
//
// VOTE DEADLINE: 3 days remaining
// Current tally: 67% YES, 28% NO, 5% ABSTAIN"
```

---

### Module 4: Education System (Khan Academy-Style)

**Purpose**: Free, accessible education for all citizens with skill verification.

**Education Architecture:**

```
CirclenomicEducation
├── Content Library
│   ├── Courses (structured learning paths)
│   ├── Lessons (individual topics)
│   ├── Exercises (practice problems)
│   ├── Videos (hosted on PeerTube via ActivityPub)
│   └── Quizzes (assessment)
├── Skill Verification
│   ├── Automated testing
│   ├── Peer assessment
│   ├── Expert verification
│   └── Portfolio review
├── Learning Paths
│   ├── Digital Literacy (required for all citizens)
│   ├── Financial Literacy (time banking, marketplace)
│   ├── Governance (how to participate)
│   ├── Technical Skills (programming, design)
│   ├── Life Skills (cooking, repair, gardening)
│   └── Professional Skills (career development)
├── Gamification
│   ├── Achievement badges (stored as SBTs)
│   ├── Learning streaks
│   ├── Peer mentoring rewards
│   └── Community teaching credits
└── Accessibility
    ├── Multi-lingual support
    ├── Voice narration
    ├── Screen reader compatible
    ├── Offline mode
    └── Low-bandwidth options
```

**Course Structure:**

```yaml
Course:
  id: "digital-literacy-101"
  title: "Digital Literacy Fundamentals"
  description: "Essential skills for navigating the digital world"
  level: "Beginner"
  duration: "4 weeks"
  timeCredits: 20  # Earned upon completion

  modules:
    - title: "Internet Basics"
      lessons:
        - title: "How the Internet Works"
          type: video
          duration: 10
          peerTubeUrl: "https://education.circlenomic.org/videos/internet-basics"
        - title: "Browsing Safely"
          type: interactive
          duration: 15
        - title: "Exercise: Browse and Search"
          type: exercise
          duration: 20

    - title: "Digital Communication"
      lessons:
        - title: "Email and Messaging"
          type: video
          duration: 10
        - title: "Matrix: Secure Communication"
          type: interactive
          duration: 20
        - title: "Exercise: Set Up Your First Room"
          type: exercise
          duration: 15

  assessment:
    type: quiz
    passingScore: 80
    certificate:
      type: soulbound_token
      name: "Digital Literacy Certified"
      issuer: "did:holo:circlenomic-education"
```

**Peer Teaching System:**

```typescript
// Citizens can teach and earn time credits
interface TeachingSession {
  id: string
  teacher: DID
  subject: string
  students: DID[]
  duration: number  // hours
  credits: {
    teacherEarns: number   // 1.5x normal rate for teaching
    studentsEarn: number   // Learning bonus
  }
  verification: {
    attendance: boolean[]
    feedback: Rating[]
    completion: boolean[]
  }
}

// Teaching earns more than regular work
// 1 hour teaching = 1.5 time credits (vs 1.0 for regular work)
// This incentivizes knowledge sharing
```

---

### Module 5: Voting & Governance

**Purpose**: Transparent, collusion-resistant governance at all levels.

**Governance Levels:**

```
Individual Level
├── Privacy settings
├── Data sharing preferences
└── Skill endorsements

Community Level
├── Local project proposals
├── Timebank rule changes
├── Community resource allocation
└── Member disputes

Network State Level
├── UBI policy changes
├── Inter-community trade agreements
├── Infrastructure investments
└── Constitutional amendments

Federation Level
├── Global initiatives
├── Climate action
├── Human rights standards
└ └── Cross-state cooperation
```

**Voting Mechanism (MACI-inspired):**

```rust
// Minimal Anti-Collusion Infrastructure
contract VotingMACI {
    // Registration
    fn register_voter(
        voter: DID,
        eligibility_proof: ZKProof
    ) -> Result<(), Error> {
        // Verify: citizen, not yet registered, eligible for this vote
        verify_eligibility(eligibility_proof)?;

        // Issue encrypted voting key
        let voting_key = generate_encrypted_key();
        storage.set(voter, VotingRecord {
            registered: true,
            voting_key,
            nullifier: compute_nullifier(voter),
        });

        Ok(())
    }

    // Cast vote (encrypted)
    fn vote(
        voter: DID,
        proposal_id: ProposalID,
        encrypted_choice: EncryptedVote,
        proof: ZKProof  // Proof of eligibility without revealing identity
    ) -> Result<(), Error> {
        // Verify voter hasn't already voted
        require!(!has_voted(voter, proposal_id), Error::AlreadyVoted);

        // Store encrypted vote
        storage.set((proposal_id, voter), encrypted_choice);

        // Mark as voted
        mark_voted(voter, proposal_id);

        // Emit event (no vote content revealed)
        emit(VoteCast { proposal_id, timestamp: env::ledger().timestamp() });

        Ok(())
    }

    // Tally (after voting period ends)
    fn tally(proposal_id: ProposalID) -> Result<Tally, Error> {
        let votes = storage.get_all(proposal_id)?;

        // Decrypt all votes using trusted decryption ceremony
        let decrypted = maci_decrypt_all(votes)?;

        // Count
        let tally = Tally {
            yes: decrypted.filter(|v| v.choice == VoteChoice::Yes).count(),
            no: decrypted.filter(|v| v.choice == VoteChoice::No).count(),
            abstain: decrypted.filter(|v| v.choice == VoteChoice::Abstain).count(),
        };

        // Store permanently on Arweave
        store_permanently(proposal_id, tally)?;

        Ok(tally)
    }
}
```

**Proposal Lifecycle:**

```
1. Draft Phase (7 days)
   ├── Citizen submits proposal
   ├── AI agent helps refine language
   ├── Community discussion in Matrix
   └── Feedback collected

2. Discussion Phase (14 days)
   ├── Public comment period
   ├── Town hall meetings (MatrixRTC)
   ├── AI-summarized arguments for/against
   └── Amendments proposed

3. Voting Phase (7 days)
   ├── ZK-encrypted voting
   ├── Real-time participation tracking
   ├── Reminder notifications via Matrix
   └── No vote buying possible (MACI)

4. Implementation Phase
   ├── If passed: auto-execute via smart contracts
   ├── If failed: feedback incorporated, can resubmit
   └── Results stored permanently on Arweave
```

---

### Module 6: Decentralized Marketplace

**Purpose**: Buy, sell, and trade goods and services using time credits or barter.

**Marketplace Architecture:**

```
CirclenomicMarketplace
├── Listings
│   ├── Goods (physical items)
│   ├── Services (time-based)
│   ├── Skills (knowledge exchange)
│   ├── Resources (shared tools, spaces)
│   └── Bounties (community needs)
├── Transaction Types
│   ├── Time Credit Exchange
│   ├── Barter (direct trade)
│   ├── Hybrid (credits + goods)
│   └── Community Funded (collective purchase)
├── Trust System
│   ├── Reputation scores
│   ├── Community endorsements
│   ├── Transaction history
│   └── Dispute resolution
└── Discovery
    ├── Search by skill/category
    ├── AI-powered matching
    ├── Location-based (local优先)
    └── Cross-community (via federation)
```

**Listing Example:**

```typescript
interface MarketplaceListing {
  id: string
  seller: DID
  type: "good" | "service" | "skill" | "resource" | "bounty"

  // Item details
  title: string
  description: string
  category: string
  images: string[]  // IPFS CIDs

  // Pricing
  price: {
    timeCredits: number
    barterOffers: string[]  // What the seller wants in trade
    hybrid: { credits: number; barterDescription: string } | null
  }

  // Availability
  availability: {
    schedule: string
    location: string  // "Local", "Remote", "Community Hub"
    remote: boolean
  }

  // Trust
  trust: {
    verified: boolean      // Skill verified
    endorsements: number   // Community endorsements
    responseTime: string   // Average response time
    completionRate: number // % of successful transactions
  }

  // Metadata
  metadata: {
    createdAt: number
    updatedAt: number
    views: number
    saves: number
    aiMatchScore?: number  // For AI-powered recommendations
  }
}
```

**AI-Powered Matching:**

```typescript
// User asks: "I need someone to help me fix my bicycle"
const matches = await marketplace.search({
  query: "bicycle repair",
  location: "within 5km",
  maxCredits: 5,
  sortBy: "trust"
})

// AI returns:
// "I found 3 bicycle repair specialists near you:
//
// 1. Maria S. (⭐ 4.9, 23 endorsements)
//    - Bicycle repair and maintenance
//    - 3 time credits/hour
//    - Available: Weekends
//    - Distance: 0.8km
//
// 2. Jake R. (⭐ 4.7, 15 endorsements)
//    - General mechanical repair
//    - 2 time credits/hour
//    - Available: Evenings
//    - Distance: 1.2km
//
// 3. Community Bike Shop (⭐ 4.8, 41 endorsements)
//    - Volunteer-run, donations welcome
//    - Free basic repairs
//    - Open: Saturdays 10am-4pm
//    - Distance: 2.1km
//
// Would you like me to message one of them?"
```

---

### Module 7: Communication Layer

**Purpose**: Encrypted, real-time communication with federation to the Fediverse.

**Matrix Integration:**

```
CirclenomicMatrix
├── Homeserver
│   ├── Synapse (or Conduit for lighter weight)
│   ├── Custom Application Service
│   └── Federation enabled
├── Rooms
│   ├── #general: Welcome, announcements
│   ├── #governance: Proposal discussions
│   ├── #marketplace: Buy/sell/trade
│   ├── #timebank: Work coordination
│   ├── #education: Learning groups
│   ├── #local-<community>: Community-specific
│   └── #ai-assistant: Direct AI agent chat
├── Bots
│   ├── @ubi-bot: UBI distribution notifications
│   ├── @governance-bot: Proposal updates, voting reminders
│   ├── @marketplace-bot: New listings, transaction updates
│   ├── @timebank-bot: Work verification, credit updates
│   └── @ai-bot: General AI assistant
├── Widgets
│   ├── Voting widget (embeddable in rooms)
│   ├── Marketplace widget (browse listings)
│   ├── Timebank widget (log hours)
│   └── Education widget (access courses)
└── Bridging
    ├── ActivityPub bridge (Fediverse)
    ├── Slack bridge (external organizations)
    └── Discord bridge (gaming/interest communities)
```

**ActivityPub Federation:**

```typescript
// Circlenomic exposes custom ActivityPub actors
const actors = {
  // Community announcement actor
  community: {
    type: "Organization",
    preferredUsername: "circlenomic-community",
    inbox: "https://ap.circlenomic.org/community/inbox",
    outbox: "https://ap.circlenomic.org/community/outbox",
    endpoints: {
      sharedInbox: "https://ap.circlenomic.org/shared-inbox"
    }
  },

  // Marketplace actor
  marketplace: {
    type: "Application",
    preferredUsername: "circlenomic-marketplace",
    // Posts new listings, trade opportunities
  },

  // Education actor
  education: {
    type: "Application",
    preferredUsername: "circlenomic-education",
    // Posts new courses, achievements, learning resources
  },

  // Governance actor
  governance: {
    type: "Application",
    preferredUsername: "circlenomic-governance",
    // Posts proposals, voting results, community decisions
  }
}
```

**Cross-Protocol Communication:**

```
User sends Matrix message
    ↓
Application Service processes
    ↓
If public/announcement → ActivityPub broadcast
    ↓
Fediverse users see post in their timeline
    ↓
Can interact (like, reply, boost)
    ↓
Interaction bridged back to Matrix
```

---

### Module 8: Marketplace

**Purpose**: Decentralized exchange of goods, services, and time credits.

(See Module 6 for detailed specification)

---

### Module 9: Time Banking

**Purpose**: Equal exchange of time-based labor, valuing all work equally.

**Time Banking Rules:**

```
Core Principle: 1 hour of service = 1 time credit

Earning:
├── Service provision: 1 credit per hour
├── Teaching: 1.5 credits per hour (incentivizes knowledge sharing)
├── Mentoring: 1.25 credits per hour
├── Community organizing: 1.25 credits per hour
└── Skill verification bonus: +0.5 credits for first verification

Spending:
├── Receive any service: 1 credit per hour
├── Access community resources: Variable credits
├── Purchase marketplace goods: Credits + barter
├── Pay for education: Credits (discounted for peer teaching)
└── Donate to community fund: Variable

Demurrage:
├── -2% per month on unspent credits
├── Encourages circulation, prevents hoarding
├── Grace period: 3 months before demurrage applies
└── Maximum holding: 500 credits (prevents concentration)

Verification:
├── Work log: Provider records hours + description
├── Receiver confirms: Digital signature
├── Community verifier: For disputes or large transactions
└── AI verification: Photo/receipt analysis (optional)
```

---

### Module 10: Decentralized Marketplace

(See Module 6 and Module 8)

---

### Module 11: Federation

(See Module 7 - Communication Layer)

---

### Module 12: Cybersecurity & Resilience

**Security Architecture:**

```
SecurityLayers
├── Identity
│   ├── DID-based authentication
│   ├── Multi-factor authentication
│   ├── Biometric support (optional)
│   └── Social recovery
├── Data
│   ├── Local storage (Holochain)
│   ├── End-to-end encryption (Matrix)
│   ├── Content addressing (IPFS)
│   └── Permanent records (Arweave)
├── Communication
│   ├── E2EE by default
│   ├── HTTP signatures (ActivityPub)
│   └── Forward secrecy
├── Economic
│   ├── ZK proofs for transactions
│   ├── MACI for voting
│   └── No single point of failure
├── Network
│   ├── Mesh networking capability
│   ├── LoRaWAN for off-grid
│   └── Redundant DHT storage
└── Resilience
    ├── Data replication across nodes
    ├── Graceful degradation
    ├── Offline mode support
    └── Disaster recovery protocols
```

---

## User Experience Design

### Onboarding Flow

```
Step 1: Download Circlenomic
├── iOS App Store
├── Google Play Store
├── Desktop (macOS, Windows, Linux)
└── Web (progressive web app)

Step 2: Create Account
├── Choose username
├── Set password
├── Backup phrase generated (show once)
└── Personal node starts syncing

Step 3: Join Community
├── Search for local community
├── Request membership
├── Wait for endorsement (1-2 existing members)
└── Welcome! Start exploring

Step 4: Complete Digital Literacy Course
├── Mandatory for full participation
├── Earns first 20 time credits
├── Teaches how to use all features
└── AI agent guides through process

Step 5: Start Participating
├── Log existing skills
├── Browse marketplace
├── Join governance discussions
├── Connect with neighbors
└── Earn and spend time credits
```

### Daily Use Cases

**Morning:**
```
8:00 AM — Matrix notification: "Good morning! You have 2 new messages
           and 1 governance proposal to review."
8:05 AM — AI agent: "Your cooking class is scheduled for 2pm today.
           3 students have signed up. Would you like to send a reminder?"
```

**Afternoon:**
```
12:00 PM — Marketplace: "Someone near you is looking for a bike repair.
           Your mechanical skills match! Want to respond?"
1:30 PM — Timebank: "Log your teaching session after class?"
2:00 PM — Teach cooking class (2 hours = 3 time credits for teaching)
```

**Evening:**
```
6:00 PM — Governance: "Proposal #42 voting ends tomorrow. You haven't
           voted yet. Want the AI to summarize it for you?"
6:15 PM — AI agent: "Here's the summary... Based on your values, you
           might lean YES. Want to vote?"
6:20 PM — Vote cast (encrypted, private)
7:00 PM — Community: "Movie night this Saturday! 12 people interested."
```

---

## Implementation Roadmap

### Phase 1: Foundation (Months 1-6)

```
Deliverables:
├── Holochain hApp: Identity + Basic Economic Engine
├── Stellar: UBI distribution smart contract
├── Matrix: Basic homeserver + bot framework
├── IPFS: Content storage layer
└── MVP Portal: Web + Mobile (basic features)

Team:
├── 2 Holochain developers
├── 1 Stellar/Rust developer
├── 2 Matrix/Synapse developers
├── 1 Frontend (React Native)
├── 1 UX Designer
└── 1 Project Manager

Budget Estimate: $500K-800K
```

### Phase 2: Core Features (Months 7-12)

```
Deliverables:
├── hREA integration (full economic accounting)
├── Time banking module
├── Voting module (MACI-inspired)
├── Marketplace MVP
├── AI agent (Gemma 4 E4B integration)
├── ActivityPub federation
└── Education platform (course creation tools)

Team:
├── Add: 1 AI/ML engineer
├── Add: 1 ActivityPub developer
├── Add: 1 Education content specialist
└── Existing team continues

Budget Estimate: $600K-1M
```

### Phase 3: Scale & Polish (Months 13-18)

```
Deliverables:
├── Community server deployment tools
├── Advanced AI capabilities
├── Multi-language support
├── Accessibility improvements
├── Security audit
├── Performance optimization
└── Mainnet launch

Team:
├── Add: Security auditor
├── Add: DevOps/Infrastructure
├── Add: Community manager
└── Existing team continues

Budget Estimate: $400K-700K
```

### Phase 4: Federation & Growth (Months 19-24)

```
Deliverables:
├── Inter-community trade protocols
├── Cross-state governance
├── Advanced education features
├── Mesh networking support
├── LoRaWAN integration
└── Global federation tools

Budget Estimate: $300K-500K
```

---

## Open Questions for Implementation

### Technical Decisions Needed

| Question | Options | Recommendation |
|----------|---------|----------------|
| Primary development language | Rust, TypeScript, Go | Rust for Holochain/Stellar, TypeScript for frontend |
| Matrix homeserver | Synapse, Conduit, Dendrite | Synapse (mature) or Conduit (lighter) |
| Local LLM inference | Ollama, LocalAI, LM Studio | LocalAI (OpenAI-compatible API) |
| Mobile framework | React Native, Flutter, Native | React Native (shared web code) |
| Hosting model | Self-hosted, managed, hybrid | Hybrid (community hubs + self-host) |

### Governance Design Needed

| Question | Considerations |
|----------|----------------|
| UBI base rate | How many time credits per month? |
| Demurrage rate | How aggressively to encourage circulation? |
| Voting thresholds | What % needed to pass proposals? |
| Community size | Minimum/maximum for community recognition? |
| Skill verification | Who verifies? Automated vs human? |
| Dispute resolution | Mediation, arbitration, or both? |
| Inter-community trade | Exchange rates, protocols? |

### Business Model

| Revenue Stream | Description |
|----------------|-------------|
| Community hosting fees | Small fee for managed community hubs |
| Premium features | Advanced analytics, priority support |
| Enterprise partnerships | Organizations joining the network |
| Grants | Foundation and government funding |
| Donations | Community contributions |

---

## Appendix: Technology Comparison Summary

| Technology | Role in Circlenomic | Why Chosen |
|------------|---------------------|------------|
| **Holochain** | Core economic engine | Agent-centric, zero fees, purpose-built for community economics |
| **Stellar** | Financial settlement | Proven UBI, CBDC-ready, Soroban smart contracts |
| **Matrix.org** | Encrypted communication | E2EE, real-time, rich bridging, widget system |
| **ActivityPub** | Federation | W3C standard, massive Fediverse ecosystem |
| **IPFS** | Dynamic storage | Content-addressed, fast, decentralized |
| **Arweave** | Permanent records | One-time payment, 200+ year storage |
| **Gemma 4** | On-device AI | 3.5GB VRAM, multimodal, Apache 2.0 |
| **Mistral Small** | Server AI | 14GB VRAM, zero license restrictions |

---

*Document version: 1.0*
*Last updated: July 2026*
