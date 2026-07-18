# Circlenomic Portal

A node-based portal for a decentralized Network Society with cryptocurrency mining that funds universal basic income.

## Overview

Circlenomic uses Ravencoin-based mining to fund a 4-way revenue split:
- **40%** to miners
- **30%** to a Universal Basic Income pool
- **20%** to community treasury
- **10%** to development fund

The portal monitors the blockchain and automatically distributes block rewards to the appropriate addresses.

## Quick Start

### Prerequisites

- **Node.js** 18+ (https://nodejs.org)
- **ravend** binary (https://github.com/RavenProject/Ravencoin/releases)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/timeantitimeantitime/circlenomic-portal.git
cd circlenomic-portal/portal
```

2. Install dependencies:
```bash
npm install
```

3. Place the `ravend` and `raven-cli` binaries in `mining-layer/bin/`

4. Start the portal:
```bash
npm start
```

The portal will:
- Connect to the ravend daemon (or start one)
- Begin monitoring for new blocks
- Distribute UBI when blocks are mined
- Serve an API on http://localhost:3000

### API Endpoints

| Endpoint | Method | Description |
|---|---|---|
| `/api/status` | GET | System status |
| `/api/blockchain` | GET | Blockchain info |
| `/api/balances` | GET | Pool balances |
| `/api/mine` | POST | Mine blocks (regtest only) |
| `/api/ubi/history` | GET | Distribution history |
| `/api/ubi/config` | GET | UBI configuration |
| `/api/education` | GET | Education tasks |
| `/api/governance` | GET | Governance data |
| `/api/marketplace` | GET | Marketplace listings |

### Mining a Block (regtest)

```bash
curl -X POST http://localhost:3000/api/mine \
  -H 'Content-Type: application/json' \
  -d '{"blocks": 1}'
```

## Configuration

Edit `src/config.js` to change:
- UBI split percentages
- Address destinations
- RPC credentials
- Poll interval

## Documentation

- [ARCHITECTURE.md](ARCHITECTURE.md) — System design
- [TOKEN_SPEC.md](TOKEN_SPEC.md) — Token economics
- [UBI_MECHANISM.md](UBI_MECHANISM.md) — UBI distribution model
- [USER_GUIDE.md](USER_GUIDE.md) — End-user guide

## License

MIT
