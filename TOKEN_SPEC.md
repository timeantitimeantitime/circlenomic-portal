# CIRCL Token Specification

## Token Overview

| Property | Value |
|----------|-------|
| **Name** | Circlenomic |
| **Ticker** | CIRCL |
| **Type** | Native UTXO (like Bitcoin) |
| **Algorithm** | KawPow (PoW) |
| **Block Time** | 60 seconds |
| **Max Supply** | 21,000,000,000 CIRCL |
| **Genesis Block** | Block 0 (fair launch) |
| **Decimals** | 8 (like Bitcoin, 1 CIRCL = 100,000,000 satoshis) |

---

## Address Format

### Mainnet

```
Prefix: CIR
Example: CIR1qyqsyqsyqsyqsyqsyqsyqsyqsyqsyqsyqsyqsyqs
Bech32:  cir1qyqsyqsyqsyqsyqsyqsyqsyqsyqsyqsyqsyqsyqs
```

### Testnet

```
Prefix: TCI
Example: TCI1qyqsyqsyqsyqsyqsyqsyqsyqsyqsyqsyqsyqsyqs
Bech32:  tci1qyqsyqsyqsyqsyqsyqsyqsyqsyqsyqsyqsyqsyqs
```

---

## Block Reward Structure

### Distribution Per Block

```
Total Block Reward: 5,000 CIRCL

┌─────────────────────────────────────────────────────────┐
│                    Block Reward: 5,000 CIRCL             │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  ┌────────────────────────────────────┐                  │
│  │  Miner Reward: 2,000 CIRCL (40%)  │                  │
│  │  Goes to: Block finder            │                  │
│  └────────────────────────────────────┘                  │
│                                                          │
│  ┌────────────────────────────────────┐                  │
│  │  UBI Pool: 1,500 CIRCL (30%)      │                  │
│  │  Goes to: UBI distribution fund   │                  │
│  └────────────────────────────────────┘                  │
│                                                          │
│  ┌────────────────────────────────────┐                  │
│  │  Community: 1,000 CIRCL (20%)     │                  │
│  │  Goes to: Community treasury      │                  │
│  └────────────────────────────────────┘                  │
│                                                          │
│  ┌────────────────────────────────────┐                  │
│  │  Development: 500 CIRCL (10%)     │                  │
│  │  Goes to: Dev fund                │                  │
│  └────────────────────────────────────┘                  │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

### Halving Schedule

| Era | Block Range | Reward/Block | Annual Output | % Mined |
|-----|-------------|--------------|---------------|---------|
| 1 | 0 - 2,102,400 | 5,000 | ~2,102,400,000 | 10% |
| 2 | 2,102,401 - 4,204,800 | 2,500 | ~1,051,200,000 | 15% |
| 3 | 4,204,801 - 6,307,200 | 1,250 | ~525,600,000 | 17.5% |
| 4 | 6,307,201 - 8,409,600 | 625 | ~262,800,000 | 18.75% |
| 5 | 8,409,601 - 10,512,000 | 312 | ~131,400,000 | 19.375% |
| ... | ... | ... | ... | ... |
| ∞ | Eventually | <1 | → 0 | → 100% |

**Halving interval**: 2,102,400 blocks (~4 years at 1 min/block)

---

## UBI Distribution Rules

### Eligibility Criteria

```
To receive UBI, a citizen must:

1. WALLET ACTIVITY
   ├── Wallet synced in last 30 days
   ├── At least 1 transaction in last 90 days
   └── Wallet balance > 0 CIRCL

2. EDUCATION
   └── Completed Digital Literacy course (one-time)

3. COMMUNITY
   └── At least 1 endorsement from existing citizen

4. IDENTITY
   └── Verified DID (Decentralized Identifier)
```

### Monthly Distribution

```
UBI Distribution Cycle:
├── Day 1: Snapshot taken
│   ├── Count eligible citizens
│   ├── Calculate per-capita amount
│   └── Apply individual boosts
├── Day 2-3: Distribution
│   ├── CIRCL sent to eligible wallets
│   ├── Transaction recorded on-chain
│   └── Notification sent via Matrix
└── Day 4: Audit
    ├── Verify all distributions
    ├── Check for anomalies
    └── Publish transparency report
```

### Boost Multipliers

```
Base UBI: (UBI Pool Balance) / (Eligible Citizens)

Boost factors (multiplicative):
├── Education completion:     ×1.10 (10% boost)
├── Teaching experience:      ×1.15 (15% boost)
├── Mentoring new members:    ×1.10 (10% boost)
├── Community service hours:  ×1.10 (10% boost)
├── Governance participation: ×1.05 (5% boost)
└── Maximum total boost:      ×1.50 (50% cap)

Example:
• Base UBI: 100 CIRCL/month
• Citizen with education + teaching: 100 × 1.10 × 1.15 = 126.5 CIRCL
• Maximum possible: 100 × 1.50 = 150 CIRCL
```

---

## Mining Configuration

### KawPow Parameters

```cpp
// Consensus parameters
const int64_t COIN = 100000000;  // 1 CIRCL = 100,000,000 satoshis
const int64_t MAX_MONEY = 2100000000LL * COIN;  // 21 billion CIRCL

// Block parameters
const int64_t BLOCK_SUBSIDY = 5000 * COIN;
const int64_t SUBSIDY_HALVING_INTERVAL = 2102400;  // ~4 years
const unsigned int BLOCK_TIME = 60;  // 1 minute
const unsigned int DIFFICULTY_ADJUSTMENT_INTERVAL = 20;  // Every 20 blocks

// Mining
const int POW_KAWPOW = 0;  // KawPow algorithm
const int64_t MIN_STAKE_AMOUNT = 0;  // No staking (PoW only)
```

### Difficulty Adjustment

```
Every 20 blocks (~20 minutes):
• Calculate average block time over last 20 blocks
• If blocks too fast (< 60s avg) → increase difficulty
• If blocks too slow (> 60s avg) → decrease difficulty
• Adjustment capped at 4x per interval
• Prevents wild swings
```

---

## Transaction Types

### Standard Transactions

```
1. P2PKH (Pay to Public Key Hash)
   ├── Standard Bitcoin-like transaction
   ├── Used for regular payments
   └── 1 byte OP_DUP OP_HASH160 <pubKeyHash> OP_EQUALVERIFY OP_CHECKSIG

2. P2SH (Pay to Script Hash)
   ├── Complex spending conditions
   ├── Used for multisig, time locks
   └── 3 byte OP_HASH <scriptHash> OP_EQUAL

3. P2WPKH (SegWit)
   ├── Witness version 0
   ├── Lower fees
   └── bc1... style addresses
```

### Special Transactions

```
4. UBI Distribution Transaction
   ├── Type: OP_RETURN + data
   ├── Contains: distribution period, eligible count
   ├── Signed by: UBI oracle
   └── Verifiable on-chain

5. Education Proof Transaction
   ├── Type: OP_RETURN + SBT proof
   ├── Contains: course completion proof
   ├── Signed by: education authority
   └── Used for boost calculation

6. Governance Vote Transaction
   ├── Type: OP_RETURN + encrypted vote
   ├── Contains: MACI-style encrypted choice
   ├── Signed by: voter (privacy preserved)
   └── Counted during tally period
```

---

## Network Parameters

### Mainnet

```cpp
// chainparams.cpp
class CMainParams : public CChainParams {
    strNetworkName = "circlenomic";
    strNetworkBech32 = "cir";

    // Genesis block
    hashGenesisBlock = uint256S("0x00000...");
    genesis.nTime = 1752000000;  // July 2026
    genesis.nNonce = 0;
    genesis.nBits = 0x1e0ffff0;
    genesis.nVersion = 1;

    // Seeds
    vSeeds.push_back(CDNSSeedData("seed1.circlenomic.org", "seed1.circlenomic.org"));
    vSeeds.push_back(CDNSSeedData("seed2.circlenomic.org", "seed2.circlenomic.org"));

    // Ports
    nDefaultPort = 8767;
    nRPCPort = 8766;

    // Base58 prefixes
    base58Prefixes[PUBKEY_ADDRESS] = std::vector<unsigned char>(1, 28);  // C
    base58Prefixes[SCRIPT_ADDRESS] = std::vector<unsigned char>(1, 50);  // 3

    // Bech32
    bech32_hrp = "cir";
}
```

### Testnet

```cpp
class CTestNetParams : public CChainParams {
    strNetworkName = "circlenomic_testnet";
    strNetworkBech32 = "tcir";

    // Lower difficulty for testing
    powLimit = uint256S("00000fffffffffffffffffffffffffffffffffffffffffffffffffffffffffff");

    // Faster blocks for testing
    nDefaultPort = 18767;
    nRPCPort = 18766;
}
```

---

## RPC Commands

### Mining

```bash
# Start mining
circl-cli generatetoaddress 1 <address>

# Get mining info
circl-cli getmininginfo

# Get block template
circl-cli getblocktemplate

# Set generate (CPU mining)
circl-cli setgenerate true -1  # Use all cores
circl-cli setgenerate true 1   # Use 1 core
```

### UBI

```bash
# Check UBI eligibility
circl-cli checkubieligibility <address>

# Claim UBI
circl-cli claimubi

# Get UBI info
circl-cli getubiinfo

# Get boost multiplier
circl-cli getboost <address>

# Get distribution history
circl-cli getubihistory 10  # Last 10 distributions
```

### Education

```bash
# Verify course completion
circl-cli verifycourse <address> <course_id>

# Get education boost
circl-cli geteducationboost <address>

# List completed courses
circl-cli listcourses <address>
```

### Governance

```bash
# Create proposal
circl-cli createproposal "title" "description"

# Vote on proposal
circl-cli vote <proposal_id> <choice>  # yes/no/abstain

# Get proposal results
circl-cli getproposal <proposal_id>

# List active proposals
circl-cli listproposals
```

---

## API Endpoints

### REST API

```
GET  /api/v1/blockchain/info          — Blockchain status
GET  /api/v1/block/{hash}             — Block details
GET  /api/v1/tx/{hash}                — Transaction details
GET  /api/v1/address/{address}/balance — Address balance
GET  /api/v1/address/{address}/txs    — Address transactions

GET  /api/v1/ubi/status               — UBI pool status
POST /api/v1/ubi/claim                — Claim UBI
GET  /api/v1/ubi/eligibility/{address} — Check eligibility

GET  /api/v1/education/boost/{address} — Education boost
POST /api/v1/education/verify          — Verify course

GET  /api/v1/governance/proposals      — List proposals
POST /api/v1/governance/vote           — Cast vote
GET  /api/v1/governance/results/{id}   — Get results

GET  /api/v1/mining/stats              — Mining statistics
GET  /api/v1/mining/hashrate           — Network hashrate
```

---

## Wallet Backup Format

### HD Wallet Structure

```
m/44'/434'/0'/0/0  — First receiving address
m/44'/434'/0'/1/0  — First change address
m/44'/434'/0'/2/0  — First UBI address
m/44'/434'/0'/3/0  — First governance address

Coin type 434 = Circlenomic (registered with SLIP-44)
```

### Backup File

```json
{
  "version": 1,
  "network": "circlenomic",
  "created": "2026-07-15T00:00:00Z",
  "encrypted": true,
  "master_public_key": "xpub...",
  "derivation_path": "m/44'/434'/0'",
  "note": "Circlenomic wallet backup - DO NOT SHARE"
}
```

---

## Security Considerations

### Consensus Security

```
• Nakamoto consensus (longest chain rule)
• 6 confirmations for high-value transactions
• 60-minute orphan limit
• Checkpoint system for fast sync
• Manual checkpoint signing by trusted parties
```

### Wallet Security

```
• HD wallet (BIP32/BIP39/BIP44)
• Encrypted keystore (AES-256-GCM)
• Optional hardware wallet support (Ledger, Trezor)
• Multi-signature support (P2SH)
• Time-locked transactions
• Social recovery (3-of-5 backup)
```

### UBI Security

```
• Sybil resistance via mining + endorsement + education
• One UBI per DID (verified via ZK proofs)
• Rate limiting on distribution claims
• Anomaly detection on distribution patterns
• Community governance for rule changes
```

---

## Testing

### Testnet Instructions

```bash
# Build for testnet
./autogen.sh
./configure --enable-testnet
make

# Run testnet node
./src/circlend -testnet

# Get testnet coins (faucet)
# Visit: https://faucet.circlenomic.org

# Mine on testnet
circl-cli -testnet setgenerate true 1
```

### Unit Tests

```bash
# Run all tests
make check

# Run specific test suite
./src/test/test_circl --run_test=ubi_tests
./src/test/test_circl --run_test=mining_tests
./src/test/test_circl --run_test=governance_tests
```

---

*Token specification version: 1.0*
*Last updated: July 2026*
