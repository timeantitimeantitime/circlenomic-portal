# Circlenomic Mining Architecture

## Overview

Circlenomic uses a **Proof-of-Work** cryptocurrency (CIRCL token) that users mine by running wallet nodes. Mining rewards fund the Universal Basic Income pool and incentivize network participation.

This is inspired by early Bitcoin where anyone with a computer could mine by running the wallet software.

---

## Token: CIRCL

| Property | Value |
|----------|-------|
| **Name** | Circlenomic |
| **Ticker** | CIRCL |
| **Algorithm** | KawPow (ASIC-resistant, same as Ravencoin) |
| **Block Time** | 1 minute |
| **Block Reward** | Starts at 5,000 CIRCL, halving every 4 years |
| **Max Supply** | 21,000,000,000 CIRCL (21 billion) |
| **Fair Launch** | No pre-mine, no ICO, no founder rewards |

### Why 21 Billion (not 21 Million)?

- Designed for a global Network Society of billions of people
- More granular UBI payments (1 CIRCL ≈ $0.01 target)
- Prevents "whole coin" psychology barriers
- Still deflationary (halving schedule)

### Why KawPow Algorithm?

- **ASIC-resistant**: CPUs and GPUs can mine profitably longer
- **Proven**: Used by Ravencoin since 2018
- **Energy efficient**: Better than SHA-256 or Ethash
- **Decentralized**: No mining pool dominance

---

## Mining Mechanics

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

### Block Reward Distribution

```cpp
// In consensus/params.h
static const int64_t nSubsidy = 5000 * COIN;  // 5,000 CIRCL per block

// Distribution split
static const int64_t nMinerReward = 40;        // 40% to miner
static const int64_t nUBIPool = 30;            // 30% to UBI
static const int64_t nCommunityTreasury = 20;  // 20% to community
static const int64_t nDevFund = 10;            // 10% to development
```

### Halving Schedule

```
Year 0-4:    5,000 CIRCL/block → ~2.1B CIRCL/year
Year 4-8:    2,500 CIRCL/block → ~1.05B CIRCL/year
Year 8-12:   1,250 CIRCL/block → ~525M CIRCL/year
Year 12-16:  625 CIRCL/block   → ~262M CIRCL/year
...continues until block reward < 1 CIRCL

Total mined: ~21 billion CIRCL over ~100 years
```

---

## Mining Tiers

### Tier 1: Basic Mining (Phone/Laptop)

```
Hardware: Any modern phone or laptop
CPU Usage: 10-20%
Expected: ~50-200 CIRCL/day
Requirements: Circlenomic wallet app
Bonus: +10% for education tasks completed
```

### Tier 2: Enhanced Mining (Desktop/Gaming PC)

```
Hardware: Desktop with dedicated GPU
GPU Usage: 30-50% (when idle)
Expected: ~500-2,000 CIRCL/day
Requirements: Mining configuration enabled
Bonus: +20% for running a community node
```

### Tier 3: Community Node (Dedicated Server)

```
Hardware: VPS or dedicated server
Uptime: 99%+ availability
Expected: ~2,000-10,000 CIRCL/day
Requirements: Running full node + community services
Bonus: +50% for hosting Matrix homeserver, DHT node
```

---

## Education-Linked Mining

### How Education Boosts Mining

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

### Verification

```rust
// Education boost is verified via Soulbound Tokens
struct MiningBoost {
    citizen_did: String,
    completed_courses: Vec<CourseSBT>,
    teaching_hours: u64,
    mentoring_hours: u64,
    service_hours: u64,
    calculated_boost: f64,  // 0.10 to 0.50
}

// Wallet queries the education module for boost calculation
fn calculate_mining_boost(citizen: &Citizen) -> f64 {
    let base = 1.0;
    let education_boost = citizen.completed_courses.len() as f64 * 0.10;
    let teaching_boost = citizen.teaching_hours as f64 * 0.15 / 100.0;
    let mentoring_boost = citizen.mentoring_hours as f64 * 0.10 / 100.0;
    let service_boost = citizen.service_hours as f64 * 0.10 / 100.0;

    (base + education_boost + teaching_boost + mentoring_boost + service_boost).min(1.5)
}
```

---

## UBI Distribution Mechanism

### Monthly Distribution

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

This prevents:
• Fake accounts draining the pool
• inactive users receiving benefits
• Sybil attacks (creating many accounts)
```

### Distribution Smart Contract

```solidity
// On-chain UBI distribution
contract UBIDistribution {
    mapping(address => uint256) public lastDistribution;
    mapping(address => uint256) public boostMultiplier;
    uint256 public constant DISTRIBUTION_INTERVAL = 30 days;
    uint256 public poolBalance;

    function distributeUBI() public {
        require(block.timestamp >= lastDistribution[msg.sender] + DISTRIBUTION_INTERVAL);

        uint256 baseAmount = poolBalance / eligibleCount();
        uint256 boostedAmount = baseAmount * boostMultiplier[msg.sender] / 100;

        // Verify eligibility
        require(isEligible(msg.sender), "Not eligible for UBI");

        // Transfer
        payable(msg.sender).transfer(boostedAmount);
        poolBalance -= boostedAmount;

        lastDistribution[msg.sender] = block.timestamp;
    }

    function isEligible(address user) internal view returns (bool) {
        // Check: active wallet, education complete, community endorsed
        return walletActive(user) &&
               educationComplete(user) &&
               communityEndorsed(user) &&
               !sybilFlagged(user);
    }
}
```

---

## Wallet Architecture

### Circlenomic Wallet

The wallet is the user's personal node. It:

1. **Mines CIRCL** automatically (CPU mining)
2. **Stores** private keys locally
3. **Syncs** with the blockchain
4. **Manages** UBI distribution
5. **Tracks** education boost
6. **Connects** to the community network

### Wallet Components

```
Circlenomic Wallet
├── Core (Rust/C++)
│   ├── KawPow miner
│   ├── Blockchain sync
│   ├── Transaction management
│   └── Key management
├── UBI Module
│   ├── Eligibility verification
│   ├── Distribution claiming
│   └── Boost calculation
├── Education Module
│   ├── Course completion tracking
│   ├── SBT verification
│   └── Boost calculation
├── Social Layer
│   ├── ActivityPub identity
│   ├── Matrix integration
│   └── Community reputation
└── UI (React Native / Electron)
    ├── Dashboard
    ├── Mining stats
    ├── Transaction history
    ├── Education progress
    └── Governance participation
```

### Mobile Mining Optimization

```rust
// Mobile-friendly mining configuration
struct MobileMiningConfig {
    cpu_threads: 1,           // Use only 1 core
    max_cpu_usage: 20,        // Max 20% CPU
    pause_on_battery: true,   // Pause when on battery
    pause_on_cellular: true,  // Pause on cellular data
    mine_on_wifi_only: true,  // Only mine on WiFi
    background_mining: true,  // Continue in background
}

// Adaptive difficulty based on device
fn get_mining_intensity(device: &Device) -> MiningIntensity {
    match device.tier {
        DeviceTier::Low => MiningIntensity::Minimal,    // 10% CPU
        DeviceTier::Medium => MiningIntensity::Moderate, // 20% CPU
        DeviceTier::High => MiningIntensity::Full,       // 30% CPU
    }
}
```

---

## Network Topology

```
┌─────────────────────────────────────────────────────────────┐
│                    CIRCLENOMIC NETWORK                       │
│                                                              │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐    │
│  │  Mobile   │  │ Desktop  │  │  Server  │  │  Server  │    │
│  │  Wallet   │  │  Wallet  │  │  (Full)  │  │  (Pool)  │    │
│  │  (Mining) │  │  (Mining)│  │  (Mining)│  │  (Mining)│    │
│  └─────┬────┘  └─────┬────┘  └─────┬────┘  └─────┬────┘    │
│        │              │              │              │         │
│        └──────────────┼──────────────┼──────────────┘         │
│                       │              │                        │
│                       ▼              ▼                        │
│              ┌──────────────────────────────┐                │
│              │    Bitcoin P2P Network        │                │
│              │    (Block propagation)        │                │
│              └──────────────────────────────┘                │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐   │
│  │              Community Layer (Off-chain)              │   │
│  │                                                       │   │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐           │   │
│  │  │ ActivityPub│  │  Matrix  │  │  IPFS    │           │   │
│  │  │ Federation │  │  Chat    │  │  Storage │           │   │
│  │  └──────────┘  └──────────┘  └──────────┘           │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

---

## Sybil Resistance

### Preventing Fake Accounts

The biggest risk to UBI is sybil attacks (creating many fake accounts). Circlenomic uses multiple layers:

```
Layer 1: Proof of Work (Mining)
├── Each account must mine (use CPU resources)
├── Creating many accounts = many machines
└── Cost increases with each fake account

Layer 2: Community Endorsement
├── New members need 1-2 endorsements from existing members
├── Existing members stake reputation on endorsements
└── Fake accounts can't get real endorsements

Layer 3: Education Verification
├── Must complete Digital Literacy course
├── Course includes identity verification
└── AI verifies genuine participation

Layer 4: Activity Requirements
├── Must be active (mining or transacting) in last 30 days
├── Inactive accounts don't receive UBI
└── Prevents dormant fake accounts

Layer 5: Graph Analysis
├── Analyze transaction patterns
├── Identify suspicious clustering
└── Flag potential sybil networks
```

---

## Building from Ravencoin

### Files to Modify

```
src/
├── chainparams.cpp          ← Change network name, ports, seeds
├── consensus/params.h       ← Change rewards, halving schedule
├── validation.cpp           ← Add UBI distribution logic
├── miner.cpp                ← Modify mining rewards split
├── wallet/wallet.cpp        ← Add UBI claiming
├── rpc/misc.cpp             ← Add UBI RPC commands
└── qt/                      ← Rename GUI to Circlenomic

doc/
├── build-osx.md             ← Update for Circlenomic
├── build-ubuntu.md          ← Update for Circlenomic
└── circlenomic-ubi.md       ← New: UBI documentation

contrib/
└── circlenomic/             ← New: Circlenomic-specific configs
```

### Key Changes

```cpp
// chainparams.cpp
class CMainParams : public CChainParams {
public:
    CMainParams() {
        strNetworkName = "circlenomic";
        strNetworkBech32 = "circl";
        bech32Prefixes[EXT_COIN_TYPE] = 0x0488B21E;

        // Custom seeds for Circlenomic network
        vSeeds.emplace_back("seed.circlenomic.org");

        // ports
        nDefaultPort = 8767;
    }
};

// consensus/params.h
struct Params {
    int64_t nSubsidy = 5000 * COIN;  // 5,000 CIRCL
    int nSubsidyHalvingInterval = 210240;  // ~4 years

    // UBI split
    int64_t nMinerPercent = 40;
    int64_t nUBIPercent = 30;
    int64_t nCommunityPercent = 20;
    int64_t nDevPercent = 10;
};
```

---

## Phase 1 Implementation

### What to Build First

```
Week 1-2: Fork and Rename
├── Fork Ravencoin repository
├── Rename all references to Circlenomic
├── Change network parameters (name, ports, seeds)
├── Create new genesis block
└── Test basic compilation

Week 3-4: Reward Structure
├── Modify block reward (5,000 CIRCL)
├── Implement 40/30/20/10 split
├── Add UBI pool address
├── Add community treasury address
└── Test reward distribution

Week 5-6: Mining Optimization
├── Optimize KawPow for mobile devices
├── Add CPU mining mode
├── Implement adaptive difficulty
├── Add battery-aware mining
└── Test on mobile devices

Week 7-8: UBI Distribution
├── Build UBI claiming mechanism
├── Implement eligibility verification
├── Add education boost calculation
├── Create UBI distribution RPC
└── Test monthly distribution

Week 9-10: Wallet UI
├── Fork Raven wallet UI
├── Add UBI dashboard
├── Add mining stats
├── Add education progress
└── Test user experience

Week 11-12: Testnet Launch
├── Launch public testnet
├── Invite beta testers
├── Collect feedback
├── Fix bugs
└── Prepare mainnet
```

---

## Comparison: Circlenomic vs Early Bitcoin

| Feature | Early Bitcoin (2009) | Circlenomic (2026) |
|---------|---------------------|-------------------|
| Mining | CPU only | CPU + GPU (ASIC-resistant) |
| Block time | 10 minutes | 1 minute |
| Block reward | 50 BTC | 5,000 CIRCL |
| Max supply | 21 million | 21 billion |
| UBI | None | 30% of mining rewards |
| Education | None | Boost mining rewards |
| Governance | None | On-chain voting |
| Community | None | 20% treasury for projects |
| Mobile | No | Yes (wallet app) |
| Privacy | Pseudonymous | Optional privacy features |

---

## Economics

### Mining Revenue Projections

```
Assumptions:
• 10,000 active miners
• Average 100 CIRCL/day per miner (basic tier)
• Target price: $0.01 per CIRCL

Daily mining: 1,000,000 CIRCL
Daily USD value: $10,000
Monthly per miner: 3,000 CIRCL = $30 USD

UBI Pool (30%): 300,000 CIRCL/day = $3,000/day
UBI per citizen (assuming 5,000 citizens): 60 CIRCL/day = $0.60/day = $18/month
```

### Scaling

```
As network grows:
• More miners → more blocks found → more CIRCL mined
• More citizens → UBI pool divided more ways
• But: higher demand → higher price → more value per CIRCL

Target: $50-100/month UBI per citizen at maturity
Requires: 50,000+ active citizens, $0.05+ CIRCL price
```

---

*Document version: 1.0*
*Last updated: July 2026*
