# CIRCL UBI Distribution Mechanism

## Overview

The Universal Basic Income (UBI) system distributes 30% of all mining rewards to eligible citizens on a monthly basis. This creates a continuous income stream funded entirely by network participation — no external funding required.

---

## How It Works

```
┌─────────────────────────────────────────────────────────────┐
│                    MINING REWARDS                            │
│                                                               │
│  Every 60 seconds, a new block is mined                      │
│  Block reward: 5,000 CIRCL                                   │
│  UBI allocation: 1,500 CIRCL (30%)                           │
│                                                               │
└─────────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                      UBI POOL                                │
│                                                               │
│  Accumulates over 30 days                                    │
│  ~1,500 × 43,200 blocks/month = 64,800,000 CIRCL            │
│                                                               │
└─────────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                    DISTRIBUTION                              │
│                                                               │
│  Day 1 of each month:                                        │
│  1. Snapshot eligible citizens                               │
│  2. Calculate per-capita amount                              │
│  3. Apply individual boosts                                  │
│  4. Send CIRCL to eligible wallets                           │
│  5. Record on-chain                                          │
│                                                               │
└─────────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                    CITIZEN RECEIVES                          │
│                                                               │
│  Base UBI: ~100 CIRCL/month                                  │
│  With boosts: up to 150 CIRCL/month                          │
│  Value: $1-3/month at launch                                 │
│  Value: $50-100/month at maturity (target)                   │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

---

## Eligibility Requirements

### Mandatory (All Required)

```
1. ACTIVE WALLET
   ├── Wallet must have synced in last 30 days
   ├── Wallet must have positive balance (any amount)
   └── Wallet must have at least 1 transaction in last 90 days

2. DIGITAL LITERACY
   ├── Must complete "Digital Literacy Fundamentals" course
   ├── One-time requirement (never expires)
   └── Verified via Soulbound Token on-chain

3. COMMUNITY ENDORSEMENT
   ├── Must have at least 1 endorsement from existing citizen
   ├── Endorser must have been active for 90+ days
   └── Endorser stakes reputation on endorsement

4. IDENTITY VERIFICATION
   ├── Must have verified DID (Decentralized Identifier)
   ├── DID linked to unique human (ZK proof)
   └── Prevents sybil attacks
```

### Disqualifying Factors

```
WILL NOT receive UBI if:

1. Sybil Flag
   ├── Multiple wallets linked to same person
   ├── Suspicious transaction patterns
   └── Flagged by community governance

2. Inactivity
   ├── Wallet inactive for 60+ days
   ├── No mining, no transactions, no sync
   └── Suspended until activity resumes

3. Governance Penalty
   ├── Found to be gaming the system
   ├── Voted to have UBI suspended
   └── Community vote required (not automatic)
```

---

## Boost Multipliers

### Education Boosts

| Achievement | Boost | Duration |
|-------------|-------|----------|
| Digital Literacy Course | +10% | Permanent |
| Financial Literacy Course | +10% | Permanent |
| Governance Course | +10% | Permanent |
| Technical Skill Course | +10% | Permanent |
| Teach a Course | +15% | 6 months |
| Mentor 5 New Members | +10% | 12 months |
| Complete 5 Courses Total | +5% | Permanent |

### Community Boosts

| Activity | Boost | Duration |
|----------|-------|----------|
| 10+ Governance Votes | +5% | 6 months |
| Submit Passed Proposal | +10% | 12 months |
| 20+ Service Hours | +10% | 6 months |
| Run Community Node | +15% | While running |
| Host Matrix Server | +10% | While hosting |
| Verify 10 New Members | +5% | 12 months |

### Maximum Boost Cap

```
Total boost cannot exceed 50% (×1.5 multiplier)

This prevents:
• Elite class of "super citizens"
• Gaming the system through excessive activity
• Unequal distribution that defeats UBI purpose

Example:
• Base UBI: 100 CIRCL
• Maximum UBI: 150 CIRCL
• No citizen can receive more than 1.5× another
```

---

## Distribution Process

### Step 1: Snapshot (Day 1, 00:00 UTC)

```
1. Query blockchain for all addresses with balance > 0
2. Check each address against eligibility criteria
3. Count eligible citizens
4. Calculate base amount per citizen
5. Calculate individual boost for each citizen
6. Store snapshot on-chain (Merkle root)
```

### Step 2: Calculation

```
Base Amount = UBI Pool Balance / Eligible Citizens

Example:
• UBI Pool: 64,800,000 CIRCL
• Eligible Citizens: 50,000
• Base Amount: 1,296 CIRCL

Individual Distribution = Base Amount × Boost Multiplier

Example:
• Citizen A (no boost): 1,296 × 1.0 = 1,296 CIRCL
• Citizen B (education): 1,296 × 1.1 = 1,425.6 CIRCL
• Citizen C (max boost): 1,296 × 1.5 = 1,944 CIRCL
```

### Step 3: Distribution (Day 1-3)

```
For each eligible citizen:
1. Create transaction from UBI pool to citizen wallet
2. Include OP_RETURN data: distribution period, boost proof
3. Broadcast transaction
4. Wait for confirmation (6 blocks)
5. Record distribution in UBI ledger

Batch processing:
• Process 1,000 citizens per batch
• 50 batches for 50,000 citizens
• Complete within 48-72 hours
```

### Step 4: Verification (Day 3-4)

```
1. Verify all distributions completed
2. Check for failed transactions (retry if needed)
3. Publish transparency report:
   ├── Total distributed
   ├── Number of citizens
   ├── Average boost
   ├── Any anomalies detected
   └── Merkle root for verification
4. Store report on IPFS
```

---

## Smart Contract Implementation

### UBI Pool Contract

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract UBIPool {
    address public owner;
    address public ubiOracle;

    uint256 public totalPool;
    uint256 public lastDistribution;
    uint256 public constant DISTRIBUTION_INTERVAL = 30 days;

    struct Citizen {
        bool exists;
        bool eligible;
        uint256 boostMultiplier;  // 100 = 1.0x, 150 = 1.5x
        uint256 lastClaimed;
        uint256 totalClaimed;
    }

    mapping(address => Citizen) public citizens;
    address[] public citizenList;

    event UBIDistributed(address indexed citizen, uint256 amount);
    event PoolFunded(uint256 amount);

    modifier onlyOracle() {
        require(msg.sender == ubiOracle, "Only oracle can call");
        _;
    }

    // Fund pool (called by mining rewards)
    function fundPool() external payable {
        totalPool += msg.value;
        emit PoolFunded(msg.value);
    }

    // Register citizen (called by oracle)
    function registerCitizen(
        address citizen,
        bool eligible,
        uint256 boostMultiplier
    ) external onlyOracle {
        if (!citizens[citizen].exists) {
            citizenList.push(citizen);
            citizens[citizen].exists = true;
        }

        citizens[citizen].eligible = eligible;
        citizens[citizen].boostMultiplier = boostMultiplier;
    }

    // Claim UBI (called by citizen)
    function claimUBI() external {
        Citizen storage citizen = citizens[msg.sender];
        require(citizen.exists, "Not registered");
        require(citizen.eligible, "Not eligible");
        require(block.timestamp >= citizen.lastClaimed + DISTRIBUTION_INTERVAL, "Too early");

        uint256 baseAmount = totalPool / citizenList.length;
        uint256 boostedAmount = (baseAmount * citizen.boostMultiplier) / 100;

        require(boostedAmount <= totalPool, "Insufficient pool");

        citizen.lastClaimed = block.timestamp;
        citizen.totalClaimed += boostedAmount;
        totalPool -= boostedAmount;

        payable(msg.sender).transfer(boostedAmount);

        emit UBIDistributed(msg.sender, boostedAmount);
    }

    // Check eligibility
    function checkEligibility(address citizen) external view returns (bool) {
        return citizens[citizen].eligible &&
               block.timestamp >= citizens[citizen].lastClaimed + DISTRIBUTION_INTERVAL;
    }

    // Get distribution info
    function getDistributionInfo(address citizen) external view returns (
        uint256 baseAmount,
        uint256 boostedAmount,
        uint256 nextClaimTime
    ) {
        Citizen storage c = citizens[citizen];
        baseAmount = totalPool / citizenList.length;
        boostedAmount = (baseAmount * c.boostMultiplier) / 100;
        nextClaimTime = c.lastClaimed + DISTRIBUTION_INTERVAL;
    }
}
```

### Education Verification Contract

```solidity
contract EducationVerification {
    struct CourseCompletion {
        address citizen;
        string courseId;
        uint256 completedAt;
        address issuer;
        bytes32 proofHash;
    }

    mapping(address => CourseCompletion[]) public completions;
    mapping(address => uint256) public boostMultiplier;

    // Verify course completion (called by education oracle)
    function verifyCourse(
        address citizen,
        string calldata courseId,
        bytes32 proofHash
    ) external onlyEducationOracle {
        CourseCompletion memory completion = CourseCompletion({
            citizen: citizen,
            courseId: courseId,
            completedAt: block.timestamp,
            issuer: msg.sender,
            proofHash: proofHash
        });

        completions[citizen].push(completion);

        // Update boost multiplier
        updateBoost(citizen);
    }

    function updateBoost(address citizen) internal {
        uint256 boost = 100;  // Base 1.0x

        // Education boosts
        uint256 coursesCompleted = completions[citizen].length;
        boost += coursesCompleted * 10;  // +10% per course

        // Cap at 1.5x
        if (boost > 150) boost = 150;

        boostMultiplier[citizen] = boost;
    }

    function getBoost(address citizen) external view returns (uint256) {
        return boostMultiplier[citizen];
    }
}
```

---

## RPC Commands

### Wallet Commands

```bash
# Check UBI eligibility
circl-cli checkubieligibility <address>

# Response:
{
  "eligible": true,
  "boostMultiplier": 1.25,
  "baseAmount": 1296,
  "boostedAmount": 1620,
  "nextClaimTime": "2026-08-01T00:00:00Z",
  "requirements": {
    "walletActive": true,
    "digitalLiteracy": true,
    "communityEndorsed": true,
    "identityVerified": true
  }
}

# Claim UBI
circl-cli claimubi

# Response:
{
  "success": true,
  "txid": "abc123...",
  "amount": 1620,
  "boostApplied": 1.25,
  "nextClaim": "2026-09-01T00:00:00Z"
}

# Get UBI history
circl-cli getubihistory <address> 10

# Response:
{
  "distributions": [
    {
      "date": "2026-07-01",
      "amount": 1500,
      "boost": 1.20,
      "txid": "def456..."
    },
    ...
  ],
  "totalReceived": 15000,
  "averageMonthly": 1500
}
```

### Pool Commands

```bash
# Get UBI pool info
circl-cli getubipool

# Response:
{
  "balance": 64800000,
  "eligibleCitizens": 50000,
  "basePerCapita": 1296,
  "lastDistribution": "2026-07-01T00:00:00Z",
  "nextDistribution": "2026-08-01T00:00:00Z",
  "totalDistributed": 750000000,
  "poolGrowthRate": "2,160,000/day"
}

# Get distribution stats
circl-cli getdistributionstats

# Response:
{
  "currentPeriod": "2026-07",
  "citizensDistributed": 48500,
  "totalDistributed": 62940000,
  "averageBoost": 1.15,
  "maxBoost": 1.50,
  "minBoost": 1.00
}
```

---

## Transparency & Auditing

### On-Chain Audit Trail

```
Every distribution is recorded on-chain:

Transaction: UBI Distribution 2026-07
├── Block: 1234567
├── Total Distributed: 62,940,000 CIRCL
├── Citizens: 48,500
├── Average Boost: 1.15x
├── Merkle Root: 0xabc123...
└── Timestamp: 2026-07-01T00:00:00Z

Merkle proof allows any citizen to verify they were included.
```

### Public Dashboard

```
Real-time dashboard at: ubi.circlenomic.org

Shows:
• Current pool balance
• Distribution history
• Eligibility criteria
• Boost calculations
• Transparency reports
• Governance proposals
```

### Community Auditing

```
Anyone can audit:

1. Verify pool balance matches mining rewards
2. Verify distribution amounts match calculations
3. Verify eligibility rules were applied correctly
4. Challenge suspicious distributions via governance
5. Propose changes to distribution rules
```

---

## Governance of UBI Rules

### Who Can Change UBI Rules?

```
Changes require Network State governance:

1. Proposal submitted
2. 14-day discussion period
3. 7-day voting period
4. Passes with >60% approval
5. 30-day implementation delay
6. Changes take effect next distribution

This prevents:
• Sudden rule changes
• Majority tyranny over minority
• Hasty decisions
```

### Changeable Parameters

```
Can be changed via governance:
├── Distribution frequency (monthly → weekly)
├── Boost multipliers
├── Eligibility requirements
├── Pool allocation percentage
├── Maximum boost cap
└── Sybil resistance rules

Cannot be changed without supermajority (80%):
├── Maximum supply (21 billion)
├── Halving schedule
└── Fundamental fairness principles
```

---

## Economic Projections

### Launch Phase (Year 1)

```
Assumptions:
• 10,000 citizens
• 5,000 active miners
• 1,000 CIRCL/block (early rewards higher)
• Price: $0.001/CIRCL

Monthly mining: ~43,200,000 CIRCL
UBI pool: ~12,960,000 CIRCL
UBI per citizen: ~1,296 CIRCL = $1.30/month
```

### Growth Phase (Year 3)

```
Assumptions:
• 100,000 citizens
• 50,000 active miners
• 2,500 CIRCL/block (post-halving)
• Price: $0.01/CIRCL

Monthly mining: ~10,800,000 CIRCL
UBI pool: ~3,240,000 CIRCL
UBI per citizen: ~32 CIRCL = $0.32/month
```

### Maturity Phase (Year 10)

```
Assumptions:
• 1,000,000 citizens
• 200,000 active miners
• 625 CIRCL/block (post-halving)
• Price: $0.05/CIRCL

Monthly mining: ~2,700,000 CIRCL
UBI pool: ~810,000 CIRCL
UBI per citizen: ~0.81 CIRCL = $0.04/month
```

### At Scale (Year 20+)

```
Assumptions:
• 10,000,000 citizens
• 1,000,000 active miners
• 312 CIRCL/block
• Price: $0.10/CIRCL
• High participation = high mining

Monthly mining: ~1,350,000 CIRCL
UBI pool: ~405,000 CIRCL
UBI per citizen: ~0.04 CIRCL = $0.004/month
```

### The Challenge

```
As more citizens join, per-capita UBI decreases UNLESS:
1. CIRCL price increases
2. More mining occurs (more blocks)
3. Additional funding sources added
4. Governance adjusts parameters

Target: $50-100/month per citizen
Requires: $0.05+ CIRCL price AND high network activity
```

---

## Risk Mitigation

### Price Volatility

```
Risk: CIRCL price crashes → UBI worthless
Mitigation:
• Diversify: 50% CIRCL, 50% stablecoins for critical needs
• Community treasury can hold stablecoins
• Bridge to stablecoins for conversions
• Governance can adjust distribution if needed
```

### Sybil Attacks

```
Risk: Fake accounts drain UBI pool
Mitigation:
• Mining requirement (CPU cost)
• Community endorsement (social cost)
• Education requirement (time cost)
• Graph analysis (pattern detection)
• Governance penalties (reputation cost)
```

### Pool Exhaustion

```
Risk: More citizens than mining rewards
Mitigation:
• Halving schedule reduces distribution naturally
• Boosts reward active citizens
• Governance can adjust eligibility
• Additional funding sources can be added
```

---

*UBI mechanism version: 1.0*
*Last updated: July 2026*
