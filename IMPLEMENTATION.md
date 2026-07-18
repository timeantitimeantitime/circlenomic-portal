# Circlenomic Portal — Implementation Guide

## Quick Start for Developers

### Prerequisites

```bash
# System requirements
- Node.js 20+
- Rust 1.75+
- Docker (for Matrix homeserver)
- Git

# Install Holochain
curl https://holochain-install.s3-us-west-2.amazonaws.com/install.sh | bash
hc --version  # Should show 0.6.x

# Install Stellar CLI
curl -L https://soroban.stellar.org | bash
soroban --version

# Install IPFS
go install github.com/ipfs/kubo@latest
ipfs --version
```

### Project Structure

```
circlenomic/
├── holochain/                    # Holochain hApps
│   ├── dnas/
│   │   ├── identity/             # DID & SBT management
│   │   ├── economic/             # hREA economic engine
│   │   ├── governance/           # Voting & proposals
│   │   ├── timebank/             # Time banking records
│   │   ├── marketplace/          # Marketplace listings
│   │   └── education/            # Course & achievement tracking
│   ├── zomes/                    # Business logic (Rust)
│   └── tests/                    # Integration tests
├── stellar/                      # Soroban smart contracts
│   ├── contracts/
│   │   ├── ubi/                  # UBI distribution
│   │   ├── timebank/             # Time credit settlement
│   │   ├── voting/               # MACI-style voting
│   │   └── marketplace/          # Transaction settlement
│   └── migrations/
├── matrix/                       # Matrix integration
│   ├── app-service/              # Custom Application Service
│   ├── bots/
│   │   ├── ubi-bot/
│   │   ├── governance-bot/
│   │   ├── marketplace-bot/
│   │   └── ai-bot/
│   └── widgets/
│       ├── voting-widget/
│       ├── marketplace-widget/
│       └── timebank-widget/
├── activitypub/                  # ActivityPub federation
│   ├── actors/
│   ├── activities/
│   └── objects/
├── ai-agent/                     # AI agent system
│   ├── core/
│   │   ├── llm/                  # LLM integration
│   │   ├── memory/               # Conversation memory
│   │   └── tools/                # Agent tool definitions
│   ├── capabilities/
│   │   ├── economic/
│   │   ├── governance/
│   │   ├── education/
│   │   └── marketplace/
│   └── models/
│       ├── gemma-4-e4b/          # On-device model
│       └── mistral-small/        # Community server model
├── portal/                       # User-facing portal
│   ├── mobile/                   # React Native app
│   │   ├── src/
│   │   │   ├── screens/
│   │   │   │   ├── Onboarding/
│   │   │   │   ├── Dashboard/
│   │   │   │   ├── Economic/
│   │   │   │   ├── Governance/
│   │   │   │   ├── Marketplace/
│   │   │   │   ├── Education/
│   │   │   │   ├── Communication/
│   │   │   │   └── Settings/
│   │   │   ├── components/
│   │   │   ├── services/
│   │   │   └── hooks/
│   │   └── package.json
│   ├── web/                      # Web app (shared code)
│   │   ├── src/
│   │   └── package.json
│   └── desktop/                  # Electron wrapper
├── storage/                      # Storage configuration
│   ├── ipfs/
│   └── arweave/
├── infrastructure/               # Deployment
│   ├── docker/
│   ├── kubernetes/
│   └── terraform/
└── docs/
    ├── ARCHITECTURE.md
    ├── IMPLEMENTATION.md
    └── API.md
```

---

## Core Module Implementations

### 1. Identity Module (Holochain Zome)

```rust
// dnas/identity/zomes/main/src/lib.rs

use hdk::prelude::*;

#[hdk_entry_helper]
pub struct Citizen {
    pub did: String,
    pub username: String,
    pub community_ids: Vec<EntryHash>,
    pub created_at: Timestamp,
    pub reputation: f64,
    pub soulbound_tokens: Vec<SoulboundToken>,
}

#[hdk_entry_helper]
pub struct SoulboundToken {
    pub id: String,
    pub token_type: TokenType,
    pub issuer: String,
    pub issued_at: Timestamp,
    pub expires_at: Option<Timestamp>,
    pub metadata: HashMap<String, String>,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
pub enum TokenType {
    CommunityMembership,
    SkillCredential,
    GovernanceParticipation,
    TimeBankReputation,
    EducationAchievement,
}

#[hdk_extern]
pub fn create_citizen(input: CreateCitizenInput) -> ExternResult<EntryHash> {
    let citizen = Citizen {
        did: input.did,
        username: input.username,
        community_ids: vec![],
        created_at: sys_time()?,
        reputation: 0.0,
        soulbound_tokens: vec![],
    };

    let hash = create_entry(&citizen)?;
    Ok(hash)
}

#[hdk_extern]
pub fn issue_soulbound_token(input: IssueSBTInput) -> ExternResult<()> {
    let mut citizen = get_citizen(&input.citizen_hash)?;

    let sbt = SoulboundToken {
        id: generate_uuid(),
        token_type: input.token_type,
        issuer: input.issuer,
        issued_at: sys_time()?,
        expires_at: input.expires_at,
        metadata: input.metadata,
    };

    citizen.soulbound_tokens.push(sbt);
    update_entry(input.citizen_hash, &citizen)?;

    Ok(())
}

#[hdk_extern]
pub fn verify_credential(input: VerifyCredentialInput) -> ExternResult<bool> {
    let citizen = get_citizen(&input.citizen_hash)?;

    // Find the specific SBT
    let sbt = citizen.soulbound_tokens.iter().find(|t| t.id == input.token_id);

    match sbt {
        Some(sbt) => {
            // Check expiration
            if let Some(expires) = sbt.expires_at {
                if sys_time()? > expires {
                    return Ok(false);
                }
            }

            // Verify issuer is authorized
            let issuer_authorized = verify_issuer(&sbt.issuer, &sbt.token_type)?;
            Ok(issuer_authorized)
        }
        None => Ok(false),
    }
}

#[hdk_extern]
pub fn generate_zk_proof(input: ZKProofInput) -> ExternResult<String> {
    // Generate a zero-knowledge proof for the given claim
    // This allows proving credentials without revealing underlying data
    let proof = zk_prove(
        &input.claim,
        &input.credential,
        &input.private_input,
    )?;

    Ok(proof)
}
```

### 2. Economic Engine (hREA Integration)

```rust
// dnas/economic/zomes/main/src/lib.rs

use hdk::prelude::*;
use hrea_sdk::*;

#[hdk_entry_helper]
pub struct TimeCreditAccount {
    pub did: String,
    pub balance: f64,
    pub earned_total: f64,
    pub spent_total: f64,
    pub last_activity: Timestamp,
    pub demurrage_rate: f64,  // 0.02 = 2% per month
}

#[hdk_extern]
pub fn create_time_credit_account(input: CreateAccountInput) -> ExternResult<EntryHash> {
    let account = TimeCreditAccount {
        did: input.did,
        balance: 0.0,
        earned_total: 0.0,
        spent_total: 0.0,
        last_activity: sys_time()?,
        demurrage_rate: 0.02,
    };

    let hash = create_entry(&account)?;
    Ok(hash)
}

#[hdk_extern]
pub fn log_work(input: LogWorkInput) -> ExternResult<EntryHash> {
    // Create economic event in hREA
    let event = EconomicEvent {
        action: Action::Transfer,
        provider: input.worker_did,
        receiver: input.receiver_did,
        resource: ResourceReference {
            resource_type: "time_credit".to_string(),
            quantity: input.hours as f64,
        },
        timestamp: sys_time()?,
        metadata: HashMap::from([
            ("category".to_string(), input.category),
            ("description".to_string(), input.description),
        ]),
    };

    // Record in hREA
    let event_hash = hrea_record_event(event)?;

    // Update accounts
    update_account_balance(&input.worker_did, input.hours as f64)?;  // Earn
    update_account_balance(&input.receiver_did, -(input.hours as f64))?;  // Spend

    Ok(event_hash)
}

#[hdk_extern]
pub fn apply_demurrage() -> ExternResult<()> {
    let accounts = get_all_accounts()?;
    let current_time = sys_time()?;

    for account_hash in accounts {
        let mut account = get_time_credit_account(&account_hash)?;

        // Calculate months since last activity
        let months_elapsed = calculate_months(account.last_activity, current_time);

        // Apply demurrage
        if months_elapsed > 3 {  // 3 month grace period
            let demurrage_months = months_elapsed - 3;
            let demurrage_factor = 1.0 - (account.demurrage_rate * demurrage_months as f64);
            account.balance *= demurrage_factor.max(0.0);  // Never go below 0
        }

        account.last_activity = current_time;
        update_entry(account_hash, &account)?;
    }

    Ok(())
}

#[hdk_extern]
pub fn get_balance(did: String) -> ExternResult<f64> {
    let account = get_account_by_did(&did)?;
    Ok(account.balance)
}

#[hdk_extern]
pub fn get_earnings_history(did: String, months: u32) -> ExternResult<Vec<EarningsRecord>> {
    let history = get_economic_events(&did, months)?;
    Ok(history)
}
```

### 3. Governance Voting (MACI-inspired)

```rust
// dnas/governance/zomes/main/src/lib.rs

use hdk::prelude::*;

#[hdk_entry_helper]
pub struct Proposal {
    pub id: String,
    pub proposer: String,
    pub title: String,
    pub description: String,
    pub proposal_type: ProposalType,
    pub status: ProposalStatus,
    pub created_at: Timestamp,
    pub voting_starts: Timestamp,
    pub voting_ends: Timestamp,
    pub tally: Option<VoteTally>,
}

#[hdk_entry_helper]
pub struct VoteTally {
    pub yes: u64,
    pub no: u64,
    pub abstain: u64,
    pub total_voters: u64,
    pub encrypted_votes: Vec<EncryptedVote>,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
pub enum ProposalType {
    CommunityProject,
    TimeBankRuleChange,
    ResourceAllocation,
    UBIPolicyChange,
    ConstitutionalAmendment,
    InterCommunityTrade,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
pub enum ProposalStatus {
    Draft,
    Discussion,
    Voting,
    Passed,
    Failed,
    Implemented,
}

#[hdk_extern]
pub fn create_proposal(input: CreateProposalInput) -> ExternResult<EntryHash> {
    let proposal = Proposal {
        id: generate_uuid(),
        proposer: input.proposer,
        title: input.title,
        description: input.description,
        proposal_type: input.proposal_type,
        status: ProposalStatus::Draft,
        created_at: sys_time()?,
        voting_starts: input.voting_starts,
        voting_ends: input.voting_ends,
        tally: None,
    };

    let hash = create_entry(&proposal)?;
    Ok(hash)
}

#[hdk_extern]
pub fn cast_vote(input: CastVoteInput) -> ExternResult<()> {
    // Verify voter eligibility
    let voter = get_citizen(&input.voter_hash)?;
    require!(is_eligible_voter(&voter, &input.proposal_hash)?, "Not eligible to vote");

    // Check if already voted
    require!(!has_voted(&input.voter_hash, &input.proposal_hash)?, "Already voted");

    // Encrypt vote using MACI-style encryption
    let encrypted_vote = encrypt_vote(
        &input.choice,
        &input.voter_secret,
        &input.proposal_hash,
    )?;

    // Store encrypted vote
    let vote_record = VoteRecord {
        proposal_hash: input.proposal_hash,
        voter_hash: input.voter_hash,
        encrypted_vote: encrypted_vote.clone(),
        nullifier: compute_nullifier(&input.voter_hash),
        timestamp: sys_time()?,
    };

    create_entry(&vote_record)?;

    // Mark as voted
    mark_voted(&input.voter_hash, &input.proposal_hash)?;

    Ok(())
}

#[hdk_extern]
pub fn tally_votes(proposal_hash: EntryHash) -> ExternResult<VoteTally> {
    let proposal = get_proposal(&proposal_hash)?;
    require!(proposal.status == ProposalStatus::Voting, "Not in voting period");
    require!(sys_time()? > proposal.voting_ends, "Voting period not ended");

    // Get all encrypted votes
    let votes = get_votes_for_proposal(&proposal_hash)?;

    // Decrypt using trusted ceremony (simplified here)
    let decrypted_choices = maci_tally(&votes)?;

    let tally = VoteTally {
        yes: decrypted_choices.iter().filter(|c| **c == VoteChoice::Yes).count() as u64,
        no: decrypted_choices.iter().filter(|c| **c == VoteChoice::No).count() as u64,
        abstain: decrypted_choices.iter().filter(|c| **c == VoteChoice::Abstain).count() as u64,
        total_voters: votes.len() as u64,
        encrypted_votes: votes,
    };

    // Store result
    update_proposal_tally(&proposal_hash, &tally)?;

    // Determine outcome
    let passed = tally.yes > tally.no;
    let new_status = if passed {
        ProposalStatus::Passed
    } else {
        ProposalStatus::Failed
    };
    update_proposal_status(&proposal_hash, new_status)?;

    Ok(tally)
}
```

### 4. Matrix Application Service

```typescript
// matrix/app-service/src/index.ts

import {
  Appservice,
  IAppserviceRegistration,
  MatrixUser,
} from "matrix-appservice-bridge";
import express from "express";

// Configuration
const config = {
  homeserverUrl: process.env.MATRIX_HOMESERVER_URL || "http://localhost:8008",
  appId: "circlenomic",
  appToken: process.env.MATRIX_APP_TOKEN,
  port: 9000,
};

// Initialize appservice
const appservice = new Appservice({
  registration: {
    id: config.appId,
    appserviceUrl: `http://localhost:${config.port}`,
    hsToken: config.appToken,
    senderLocalpart: "circlenomic",
  },
  homeserverUrl: config.homeserverUrl,
});

// Bot: UBI Notifications
appservice.addMatrixEventHandler("m.room.message", async (event) => {
  if (event.content?.body?.startsWith("/circle ubi-status")) {
    const userId = event.sender;
    const balance = await getCirclenomicBalance(userId);
    const lastDistribution = await getLastUBIDistribution(userId);

    await appservice.sendEvent(event.room_id, "m.room.message", {
      msgtype: "m.text",
      body: `💰 UBI Status\n\nBalance: ${balance} time credits\nLast distribution: ${lastDistribution.date}\nNext distribution: ${lastDistribution.next}\n\nParticipation bonus this month: +${lastDistribution.bonus} credits`,
      format: "org.matrix.custom.html",
      formatted_body: `<h3>💰 UBI Status</h3>
        <p><strong>Balance:</strong> ${balance} time credits</p>
        <p><strong>Last distribution:</strong> ${lastDistribution.date}</p>
        <p><strong>Next distribution:</strong> ${lastDistribution.next}</p>
        <p><strong>Participation bonus:</strong> +${lastDistribution.bonus} credits</p>`,
    });
  }
});

// Bot: Governance Notifications
appservice.addMatrixEventHandler("m.room.message", async (event) => {
  if (event.content?.body?.startsWith("/circle vote")) {
    const proposalId = event.content.body.split(" ")[2];
    const proposal = await getProposal(proposalId);

    if (!proposal) {
      await appservice.sendEvent(event.room_id, "m.room.message", {
        msgtype: "m.text",
        body: `❌ Proposal #${proposalId} not found.`,
      });
      return;
    }

    await appservice.sendEvent(event.room_id, "m.room.message", {
      msgtype: "m.text",
      body: `📋 Proposal #${proposal.id}: ${proposal.title}\n\n${proposal.description}\n\nStatus: ${proposal.status}\nVoting ends: ${proposal.votingEnds}\n\nCurrent tally:\n👍 Yes: ${proposal.tally.yes}\n👎 No: ${proposal.tally.no}\n🤷 Abstain: ${proposal.tally.abstain}\n\nReact with 👍👎🤷 to vote!`,
    });
  }
});

// Bot: AI Assistant
appservice.addMatrixEventHandler("m.room.message", async (event) => {
  if (event.content?.body?.startsWith("/circle ai")) {
    const query = event.content.body.replace("/circle ai ", "").trim();
    const userId = event.sender;

    // Get AI response from local LLM
    const response = await getAIAgentResponse(userId, query);

    await appservice.sendEvent(event.room_id, "m.room.message", {
      msgtype: "m.text",
      body: response,
    });
  }
});

// Voting widget integration
appservice.addMatrixEventHandler("m.reaction", async (event) => {
  const emoji = event.content?.["m.relates_to"]?.key;
  const proposalId = extractProposalId(event);

  if (proposalId && ["👍", "👎", "🤷"].includes(emoji)) {
    const choice = emoji === "👍" ? "yes" : emoji === "👎" ? "no" : "abstain";
    await castVote(event.sender, proposalId, choice);

    await appservice.sendEvent(event.room_id, "m.room.message", {
      msgtype: "m.text",
      body: `✅ Vote recorded for Proposal #${proposalId}: ${choice.toUpperCase()}`,
    });
  }
});

// Start the appservice
const app = express();
app.use("/bridge", appservice.getRequestHandler());

app.listen(config.port, () => {
  console.log(`Circlenomic Matrix AppService running on port ${config.port}`);
});
```

### 5. AI Agent Core

```typescript
// ai-agent/src/core/agent.ts

import { LocalLLM } from "./llm/local";
import { MemoryManager } from "./memory/manager";
import { ToolExecutor } from "./tools/executor";

interface AgentConfig {
  userId: string;
  modelPath: string;
  communityServerUrl?: string;
  privacyLevel: "local-only" | "community" | "optional-cloud";
}

export class CirclenomicAgent {
  private llm: LocalLLM;
  private memory: MemoryManager;
  private tools: ToolExecutor;

  constructor(config: AgentConfig) {
    this.llm = new LocalLLM(config.modelPath);
    this.memory = new MemoryManager(config.userId);
    this.tools = new ToolExecutor(config.userId);
  }

  async respond(message: string): Promise<string> {
    // Load conversation context
    const context = await this.memory.getContext();

    // Load available tools
    const tools = this.tools.getAvailableTools();

    // Generate response using local LLM
    const response = await this.llm.generate({
      systemPrompt: this.getSystemPrompt(),
      messages: context.messages,
      newMessage: message,
      tools,
    });

    // Execute any tool calls
    if (response.toolCalls) {
      const toolResults = await this.tools.executeAll(response.toolCalls);
      // Continue conversation with tool results
      return this.continueWithToolResults(context, response, toolResults);
    }

    // Save to memory
    await this.memory.addMessage("user", message);
    await this.memory.addMessage("assistant", response.text);

    return response.text;
  }

  private getSystemPrompt(): string {
    return `You are the Circlenomic AI Agent, a helpful assistant for the Circlenomic Network Society.

Your capabilities:
- Help users navigate the time banking system
- Assist with governance participation (explain proposals, help vote)
- Guide educational content and skill development
- Facilitate marketplace transactions
- Provide community information
- Answer questions about Circlenomic

Important rules:
- You are running LOCALLY on the user's device
- You NEVER send user data to external servers
- You are transparent about what you can and cannot do
- You encourage community participation and mutual aid
- You respect user privacy and autonomy

Current user context:
- User ID: ${this.config.userId}
- Community: ${await this.tools.getCommunityInfo()}
- Balance: ${await this.tools.getBalance()} time credits
- Reputation: ${await this.tools.getReputation()}`;
  }

  async analyzeGovernanceProposal(proposalId: string): Promise<Analysis> {
    const proposal = await this.tools.getProposal(proposalId);
    const userHistory = await this.memory.getVotingHistory();

    const analysis = await this.llm.generate({
      systemPrompt: "You are analyzing a governance proposal for a Circlenomic citizen.",
      messages: [{
        role: "user",
        content: `Analyze this proposal and provide:
1. Summary (2-3 sentences)
2. Key pros
3. Key cons
4. Similar past proposals
5. How this aligns with the user's past voting patterns
6. Current vote tally

Proposal: ${JSON.stringify(proposal)}
User voting history: ${JSON.stringify(userHistory)}`
      }]
    });

    return {
      summary: extractSummary(analysis),
      pros: extractPros(analysis),
      cons: extractCons(analysis),
      similarProposals: extractSimilar(analysis),
      alignment: extractAlignment(analysis),
      currentTally: proposal.tally,
    };
  }

  async suggestTimeBankMatch(
    skill: string,
    availability: Schedule
  ): Promise<Match[]> {
    const availableProviders = await this.tools.searchTimeBank(skill, availability);

    const ranked = await this.llm.generate({
      systemPrompt: "You are matching a user with time bank service providers.",
      messages: [{
        role: "user",
        content: `Rank these providers based on trust, proximity, and availability for: ${skill}

Providers: ${JSON.stringify(availableProviders)}`
      }]
    });

    return parseMatches(ranked);
  }
}
```

### 6. ActivityPub Federation

```typescript
// activitypub/src/actors/community.ts

import { Actor, Activity, Object } from "@activitypub/core";

export class CirclenomicCommunityActor implements Actor {
  type = "Organization" as const;
  preferredUsername = "circlenomic-community";
  name = "Circlenomic Network Society";
  summary = "A decentralized network society built on mutual aid and cooperation";

  inbox = "https://ap.circlenomic.org/community/inbox";
  outbox = "https://ap.circlenomic.org/community/outbox";
  followers = "https://ap.circlenomic.org/community/followers";
  following = "https://ap.circlenomic.org/community/following";

  endpoints = {
    sharedInbox: "https://ap.circlenomic.org/shared-inbox",
  };

  // Post governance announcement
  async postProposal(proposal: Proposal): Promise<Activity> {
    const create = {
      type: "Create" as const,
      actor: this.id,
      object: {
        type: "Article" as const,
        name: `Proposal #${proposal.id}: ${proposal.title}`,
        content: proposal.description,
        url: `https://portal.circlenomic.org/governance/${proposal.id}`,
        published: new Date().toISOString(),
        attachment: [
          {
            type: "PropertyValue" as const,
            name: "Status",
            value: proposal.status,
          },
          {
            type: "PropertyValue" as const,
            name: "Voting Ends",
            value: proposal.votingEnds,
          },
        ],
      } as Object,
      to: "https://www.w3.org/ns/activitystreams#Public",
    };

    await this.sendToFollowers(create);
    return create;
  }

  // Post marketplace listing
  async postListing(listing: MarketplaceListing): Promise<Activity> {
    const offer = {
      type: "Offer" as const,
      actor: this.id,
      object: {
        type: "Service" as const,
        name: listing.title,
        content: listing.description,
        url: `https://portal.circlenomic.org/marketplace/${listing.id}`,
        image: listing.images[0],
        attachment: [
          {
            type: "PropertyValue" as const,
            name: "Price",
            value: `${listing.price.timeCredits} time credits`,
          },
          {
            type: "PropertyValue" as const,
            name: "Category",
            value: listing.category,
          },
          {
            type: "PropertyValue" as const,
            name: "Location",
            value: listing.location,
          },
        ],
      } as Object,
      to: "https://www.w3.org/ns/activitystreams#Public",
    };

    await this.sendToFollowers(offer);
    return offer;
  }

  // Post educational achievement
  async postAchievement(achievement: Achievement): Promise<Activity> {
    const achieve = {
      type: "Achieve" as const,
      actor: this.id,
      object: {
        type: "Badge" as const,
        name: achievement.name,
        content: achievement.description,
        url: `https://portal.circlenomic.org/education/${achievement.id}`,
        issuedBy: this.id,
        issuedOn: new Date().toISOString(),
      } as Object,
      to: "https://www.w3.org/ns/activitystreams#Public",
    };

    await this.sendToFollowers(achieve);
    return achieve;
  }
}
```

---

## Deployment Guide

### Local Development

```bash
# 1. Clone and install
git clone https://github.com/circlenomic/portal.git
cd portal
npm install

# 2. Start Holochain conductor
hc sandbox generate
hc sandbox run

# 3. Start Matrix homeserver
docker-compose up -d matrix

# 4. Start AI agent
cd ai-agent
ollama pull gemma4:latest
npm start

# 5. Start portal
cd portal/mobile
npm start
```

### Community Server Deployment

```bash
# Single-node community deployment
./deploy-community.sh \
  --name "Portland Community" \
  --domain "portland.circlenomic.org" \
  --matrix-server "matrix.portland.circlenomic.org" \
  --holochain-bootstrap "bootstrap.circlenomic.org"

# This will:
# 1. Deploy Holochain conductor with community DNA
# 2. Deploy Matrix homeserver (Synapse)
# 3. Deploy ActivityPub server
# 4. Deploy IPFS node
# 5. Configure SSL certificates
# 6. Set up monitoring
```

### Production Infrastructure

```yaml
# kubernetes/community-cluster.yaml
apiVersion: v1
kind: Namespace
metadata:
  name: circlenomic
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: holochain-conductor
spec:
  replicas: 3
  selector:
    matchLabels:
      app: holochain
  template:
    metadata:
      labels:
        app: holochain
    spec:
      containers:
      - name: conductor
        image: holochain/conductor:0.6.1
        ports:
        - containerPort: 8888
        volumeMounts:
        - name: conductor-data
          mountPath: /root/.local/share/holochain
      volumes:
      - name: conductor-data
        persistentVolumeClaim:
          claimName: holochain-data
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: matrix-synapse
spec:
  replicas: 2
  selector:
    matchLabels:
      app: synapse
  template:
    metadata:
      labels:
        app: synapse
    spec:
      containers:
      - name: synapse
        image: matrixdotorg/synapse:latest
        ports:
        - containerPort: 8008
        env:
        - name: SYNAPSE_SERVER_NAME
          value: "matrix.circlenomic.org"
        - name: SYNAPSE_REPORT_STATS
          value: "no"
        volumeMounts:
        - name: synapse-data
          mountPath: /data
      volumes:
      - name: synapse-data
        persistentVolumeClaim:
          claimName: synapse-data
```

---

## Testing Strategy

### Unit Tests

```bash
# Holochain zome tests
cargo test --manifest-path dnas/identity/zomes/main/Cargo.toml

# Stellar contract tests
cargo test --manifest-path stellar/contracts/ubi/Cargo.toml

# TypeScript tests
npm test --prefix ai-agent
npm test --prefix matrix/app-service
```

### Integration Tests

```bash
# Full system integration test
./tests/integration/run.sh

# This tests:
# - Identity creation and SBT issuance
# - Time credit transactions
# - Governance proposal lifecycle
# - Matrix message delivery
# - ActivityPub federation
# - AI agent responses
```

### Load Tests

```bash
# Simulate 1000 concurrent users
./tests/load/simulate.sh --users 1000 --duration 3600

# Test DHT performance
./tests/load/dht-stress.sh --operations 100000
```

---

## Security Checklist

- [ ] All Holochain DNAs audited
- [ ] Stellar contracts audited
- [ ] Matrix E2EE enabled by default
- [ ] ActivityPub HTTP signatures verified
- [ ] ZK proof implementations reviewed
- [ ] MACI voting collusion resistance verified
- [ ] Local LLM runs without external API calls
- [ ] IPFS/Arweave content validation enabled
- [ ] Penetration testing completed
- [ ] Bug bounty program launched

---

*Implementation guide version: 1.0*
*Last updated: July 2026*
