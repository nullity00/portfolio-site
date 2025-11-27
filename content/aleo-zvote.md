---
title: "Building Private Voting with ZK: A Deep Dive into Aleo's zVote"
slug: "aleo-zvote"
category: "blog"
description: "A comprehensive guide to building private voting systems using zero-knowledge proofs on Aleo blockchain, exploring the zVote architecture and implementation"
---

# Building Private Voting with ZK: A Deep Dive into Aleo's zVote

## Aleo Ecosystem Overview

### What is Aleo?

Aleo is a Layer 1 blockchain designed for private applications. The key difference? Every computation happens off-chain in zero-knowledge, then gets verified on-chain. This means you can run complex programs privately, and the network only needs to verify the proof - not re-execute everything.

Practical result: Private transactions, private function inputs, and private variables - all verifiable by anyone.

### The ZK Architecture

Here is how it works:

- **Off-chain Execution**: Your program runs locally on your machine
- **Proof Generation**: The execution generates a cryptographic proof
- **On-chain Verification**: The network verifies the proof without seeing the actual computation

### Consensus: Proof of Stake + ZK

Aleo uses PoS for validator selection combined with Narwhal (mempool protocol for transaction dissemination) and Bullshark (consensus protocol for transaction ordering). Narwhal builds a DAG of transactions ensuring data availability, while Bullshark orders them and achieves instant finality with 2/3rd of validator agreement. Validators verify ZK-SNARK proofs and finalize blocks - they never re-execute private transitions (which is the key difference from traditional blockchains) or access encrypted records.

The ZK Twist: Traditional chains re-execute every transaction, but Aleo validators only verify proofs in milliseconds - invalid transactions are rejected.

### Aleo VM (AVM)

AVM is an example of a zkVM, just like zkSync's zkEVM or RiscZero's zkVM - but each has different design trade-offs and instruction sets.

Three key distinctions to note about Aleo VM are:

**Native privacy model**: AVM has two parallel state systems built-in - encrypted records (private, UTXO-like) and public mappings. Most zkVMs (RISC Zero, SP1, Jolt) don't provide privacy - they compress verification cost for public state. All inputs and outputs remain public on-chain; the ZK proof just proves "$f(\text{public}_x) = \text{public}_y$ correctly" without revealing intermediate steps. Aleo is different. Inputs and outputs are encrypted records. The proof verifies correctness while keeping your actual data private.

**Purpose-built instruction set**: AVM executes Aleo Instructions (compiled from Leo), optimized specifically for ZK circuit generation. Other zkVMs which have such instruction sets are Cairo VM and Miden VM.

**Dual execution phases**: In Aleo, program execution occurs in two phases through explicit language keywords. The transition phase runs off-chain on the user's machine, performing private computations on encrypted records and producing a zero-knowledge proof of correct execution. The finalize phase runs on-chain on validator nodes, verifying the proof and updating public state (e.g., balances, mappings, etc). This separation between private and public execution is natively embedded in Leo's syntax and enforced by the Aleo Virtual Machine(AVM).

### SnarkOS and SnarkVM: Core Components, Protocol Infrastructure

SnarkOS is the node software (client) that runs on network participants' machines, participating in peer-to-peer networking, proof verification, and consensus.

SnarkVM is the virtual machine/proving engine that executes Aleo programs (off-chain) and generates zero-knowledge proofs of their correct execution; those proofs are then submitted to the network (via SnarkOS) for verification and state update.

Note: SnarkVM is the actual name of the implementation. AleoVM (AVM) is the conceptual term used to describe Aleo's virtual machine. Like how people say "EVM" (Ethereum Virtual Machine) but the implementation is in clients like Geth.

Source: [developer.aleo.org](https://developer.aleo.org)

## Leo Language Fundamentals

Ever wondered what it would be like if Rust and cryptography had a brilliant child? Meet Leo! Leo is the brainchild of the Aleo team, designed specifically for building privacy-preserving applications. Think of it as Rust, but for circuits.

### The Compilation Pipeline

### Core Language Features

Leo syntax mirrors Rust with ZK specific types.

**Rust:**
```rust
let x: u32 = 42;
let name: String = String::from("Alice");
let is_valid: bool = true;
```

**Leo:**
```leo
let x: u64 = 42u64;
let hash: field = 12345field;
let is_valid: bool = true;
```

Key differences:

- Explicit type suffixes: `42u64` instead of just `42`
- `field` type represents elements in a finite field (the native type for ZK circuits)
- No strings: Leo does not have string types. Use field for hashed representations

### Structs

Structs define data structures. They are the building blocks of your program state.

```leo
struct Proposal {
    id: field,
    title: field,
    yes_votes: u64,
    no_votes: u64
}
```

Simple. Just like Rust structs, but with ZK-specific types like `field`.

### Functions and Transitions

Leo has three types of functions:

- **Transitions**: Execute off-chain, modify state, generate proofs.
- **Finalize (async functions)**: Execute on-chain publicly by all validators, update mappings.
- **Helper functions**: Execute off-chain during proof generation.

**Leo helper function:**
```leo
function add(a: u64, b: u64) -> u64 {
    return a + b;
}
```

**Leo transition (off-chain):**
```leo
transition create_proposal(
    public title: field,
    public description: field
) -> Proposal {
    // create and return proposal here
}
```

**Leo finalize (on-chain):**
```leo
async function finalize_create(
    creator: address,
    title: field
) {
    // set proposal mapping here
}
```

Every transition is a transaction. When called, it generates a zero-knowledge proof that the computation was executed correctly. The finalize function then executes publicly on every validator to update shared state like mappings - no proof needed, just deterministic re-execution.

More primitives can be found at [https://docs.leo-lang.org/language/structure](https://docs.leo-lang.org/language/structure)

### Records vs Mappings

Aleo has two state models. Think of them like private notes vs public databases.

**Records (Private State)**: Records are like UTXOs in Bitcoin, but encrypted.

**Mappings (Public State)**: Mappings are key-value stores visible to everyone.

An example record from [https://developer.aleo.org/concepts/fundamentals/records](https://developer.aleo.org/concepts/fundamentals/records):

```leo
{
  owner: aleo13ssze66adjjkt795z9u5wpq8h6kn0y2657726h4h3e3wfnez4vqsm3008q.private,
  amount: 100u64.private,
  _nonce: 5861592911433819692697358191094794940442348980903696700646555355124091569429group.public,
  version: 1u8.public
}
```

- **Owner** (`aleo13sz...`): The account address authorized to spend the record.
- **Data** (`100u64.private`): Arbitrary application payload with visibility modifiers - private entries are encrypted on-chain, readable only by sender/receiver via their view keys.
- **Nonce** (`5861...group`): Unique identifier computed via PRF evaluation of the owner's address secret key and serial number.
- **Version** (`1u8.public`): Specifies the record version, determining commitment derivation and available privacy features.

| Records | Mappings |
|---------|----------|
| Owned by a specific address | Publicly readable |
| Encrypted by default, consumed when spent | Mutable |
| Only the owner can read them | Used for Shared State |

```leo
// Private record - only owner can see
record Ballot {
    owner: address,
    proposal_id: field,
    vote: bool
}

// Public mapping - everyone can see
mapping proposals: field => Proposal;
```

Records provide privacy. Mappings provide transparency.

### Working with Mappings

Mapping operations can only be used inside async functions (finalize blocks). Here are the available operations:

**Get a value:**
```leo
let value: u64 = Mapping::get(proposals, proposal_id);
```
Returns the value at the key. Fails if key does not exist.

**Get with default:**
```leo
let value: u64 = Mapping::get_or_use(proposals, proposal_id, 0u64);
```
Returns the value at the key. If the key is not present, store the default value (`0u64`) in the mapping and return it.

**Set a value:**
```leo
Mapping::set(proposals, proposal_id, new_value);
```
Creates or updates the entry at the key.

For more mapping operations, refer to [https://docs.leo-lang.org/language/programs](https://docs.leo-lang.org/language/programs)

## zVote Architecture

All code and architecture are obtained from [https://github.com/zsociety-io/zvote](https://github.com/zsociety-io/zvote)

As the README file states: "zVote is framework for building modular, upgradable and private DAOs on Aleo."

zVote is a voting system where your ballot stays private, but the final tally is public and verifiable. That is the core idea. It is a composition of multiple Aleo programs working together. Each program handles a specific responsibility, and they communicate through interfaces.

Source: [github.com/zsociety-io/zvote](https://github.com/zsociety-io/zvote)

### Core Components

Here are the main players:

#### THE DAO INTERFACES

**Dao** - Each DAO instance manages multiple proposals and links to voting systems. Think of it as the coordination layer.

**DaoManager** - Updates DAO settings, adds or removes voting systems, and manages the DAO lifecycle.

**DaoFactory** - Creates new DAO instances and registers them on-chain.

The DAO Factory calls the `register_dao` function to create a DAO interface. The DAO Manager is an updatable interface which is used to manage the DAO's voting systems and proposals.

Additional programs extend the DAO's functionality, including `daom_approved_proposers_list` (referred to as `daom_approved_proposers_015` in the source code at the time of writing) and `multi_dao_support_program` (currently not implemented). These modules are designed to handle specialized tasks — the former manages the whitelist of approved proposers, while the latter introduces support for multiple DAO interfaces.

#### THE VOTING INTERFACES

**VotingSystem** - The heart of zVote. Handles ballot casting, result aggregation, and vote validation. When you cast a vote, you are interacting with this program.

**VotingSystemManager** - The voting system registry. Tracks which voting systems are active for which DAOs.

VotingSystem consumes your Token record, creates a proof of voting record for you, and updates the public vote tally through its finalize block. The VotingSystem maintains mappings of `proposal_id` to vote counts. A DAO can have multiple Voting Systems.

Different DAOs can use different voting mechanisms (token-weighted, one-address-one-vote, quadratic voting). The VotingSystemManager maintains this. It is called by DaoManager when configuring a DAO's governance rules.

There are specialized voting system implementations like `vs_first_past_the_post` (simple majority), `vs_randomized_condorcet` (ranked choice), and `vs_first_past_the_post_private` (ballot privacy variations).

Note: The above mentioned implementations are in zvote's architecture but have not been implemented in code.

#### THE PROPOSAL INTERFACE

**Proposal** - The proposal lifecycle manager. Stores proposal metadata, tracks voting progress, and handles execution triggers.

**TriggeredOnApproval** - The execution handler. Determines what happens when a proposal passes.

The Proposal interface is called by the VotingSystem when votes are cast. Each proposal has a unique `proposal_id` and stores the proposer address, execution delay, and metadata URI pointing to off-chain details.

Once a proposal is approved, TriggeredOnApproval specifies the actions to execute. This could be transferring tokens from the Treasury, updating DAO parameters, or triggering external program calls.

#### THE TOKEN AND TREASURY INTERFACES

**Token** - The voting power representation. An interface implemented by `token_registry`.

**Treasury** - The asset custody layer. Holds DAO funds and executes approved transfers.

Your voting weight derives from Token records. The Token interface uses external records - records created by one program but consumable by another. When VotingSystem verifies your voting power, it consumes your Token record and extracts the weight field.

For more info, refer: [https://github.com/zsociety-io/zvote](https://github.com/zsociety-io/zvote/tree/main?tab=readme-ov-file#concepts)

## Implementation: Code Walkthrough

zVote's voting system is token-weighted governance with custody receipts (proof of voting). Let us walk through the actual code from `vs__2_candidates_015.aleo`

### Core Data Structures

```leo
record CustodyReceipt {
    owner: address,
    amount: u128,
    token_id: field,
    external_authorization_required: bool,
    dao_id: field,
    proposal_id: field,
    candidate: field
}
```

**Vote Receipt**: This is your proof of voting. It is a private record that shows:
- How many tokens you locked (`amount`)
- Which proposal you voted on (`dao_id + proposal_id`)
- Your choice (`candidate: 0field` or `1field` for no/yes)

Only you can see this record. The network does not know how you voted until you withdraw.

```leo
struct VotingSystemParams {
    quorum: u128
}

struct ProposalParams {
    end_block: u32
}
```

**Voting Parameters:**
- Quorum = minimum votes needed.
- End block = when voting stops.

```leo
mapping scores: field => u128;
// hash(ScoreKey) => votes

mapping voting_system_params: field => VotingSystemParams;
// hash(VotingSystemParams) => VotingSystemParams

mapping proposal_params: field => ProposalParams;
// hash(ProposalParams) => ProposalParams
```

**State Mappings**: Scores are public. Everyone can see vote tallies in real-time. This is not private voting - it is transparent token-weighted voting.

### Casting a Vote

```leo
async transition cast_vote(
    public dao_id: field,
    public proposal_id: field,
    public amount: u128,
    public candidate: field,
    private token: token_registry.aleo/Token
) -> (
    token_registry.aleo/Token,
    CustodyReceipt,
    Future
) {
    let proposal_key: field = BHP256::hash_to_field(
        ProposalKey {
            dao_id: dao_id,
            proposal_id: proposal_id
        }
    );

    let score_key: field = BHP256::hash_to_field(
        ScoreKey {
            dao_id: dao_id,
            proposal_id: proposal_id,
            candidate: candidate
        }
    );

    let (change, transfer_future): (
        token_registry.aleo/Token,
        Future
    ) = token_registry.aleo/transfer_private_to_public(
        self.address,
        amount,
        token
    );

    return (
        change,
        CustodyReceipt {
            owner: self.signer,
            amount: amount,
            token_id: token.token_id,
            external_authorization_required: token.external_authorization_required,
            dao_id: dao_id,
            proposal_id: proposal_id,
            candidate: candidate
        },
        finalize_cast_vote(
            dao_id, token.token_id, amount, proposal_key, score_key, candidate, transfer_future
        )
    );
}
```

What happens:
1. **Create unique keys** - Hash the proposal and score to get deterministic identifiers
2. **Lock tokens** - Call `transfer_private_to_public` to custody your tokens
3. **Issue receipt** - Return a private record proving your vote
4. **Finalize** - Update public vote tallies

Note: `transfer_private_to_public` moves your tokens from a private record to public program state. Your tokens are now locked in the voting contract.

### Finalization

```leo
async function finalize_cast_vote(
    dao_id: field,
    token_id: field,
    amount: u128,
    proposal_key: field,
    score_key: field,
    candidate: field,
    transfer_future: Future
) {
    transfer_future.await();

    let dao: Dao = zvote_dao_registry_015.aleo/daos.get(dao_id);
    assert_eq(dao.token_id, token_id);

    let proposal: Proposal = zvote_dao_registry_015.aleo/proposals.get(proposal_key);
    let end_block: u32 = proposal_params.get(proposal.params_hash).end_block;
    assert(block.height < end_block);

    let former_score: u128 = scores.get_or_use(score_key, 0u128);
    scores.set(score_key, former_score + amount);
}
```

What gets validated:
- Token transfer to custody completed successfully
- You're voting with the correct governance token for this DAO
- Voting period hasn't ended (current block < end block)
- Your vote weight gets added to the public tally

Everyone sees the vote count increase, but nobody knows who voted how much. Your receipt is private.

### Withdrawing After Voting

```leo
async transition withdraw_receipt(
    public amount: u128,
    private receipt: CustodyReceipt
) -> (CustodyReceipt, token_registry.aleo/Token, Future) {
    let score_key: field = BHP256::hash_to_field(
        ScoreKey {
            dao_id: receipt.dao_id,
            proposal_id: receipt.proposal_id,
            candidate: receipt.candidate
        }
    );

    let (withdrawal, transfer_future): (
        token_registry.aleo/Token,
        Future
    ) = token_registry.aleo/transfer_public_to_private(
        receipt.token_id,
        receipt.owner,
        amount,
        receipt.external_authorization_required
    );

    return (
        CustodyReceipt {
            owner: self.signer,
            amount: receipt.amount - amount,
            token_id: receipt.token_id,
            external_authorization_required: receipt.external_authorization_required,
            dao_id: receipt.dao_id,
            proposal_id: receipt.proposal_id,
            candidate: receipt.candidate
        },
        withdrawal,
        finalize_withdraw_receipt(amount, score_key, receipt.candidate, transfer_future)
    );
}
```

The withdrawal mechanism lets you reclaim your locked tokens during the voting period. This enables revocable voting - you can change your mind by withdrawing and re-voting for a different candidate.

### Setting the Result

```leo
async transition set_result(
    public dao_id: field,
    public proposal_id: field,
    public winner: field
) -> (Future) {
    let proposal_key: field = BHP256::hash_to_field(
        ProposalKey {
            dao_id: dao_id,
            proposal_id: proposal_id
        }
    );

    let set_result_future: Future = zvote_dao_registry_015.aleo/set_result(
        dao_id,
        proposal_id,
        winner
    );

    return finalize_set_result(
        dao_id,
        proposal_id,
        proposal_key,
        winner,
        set_result_future
    );
}
```

Anyone can call this after voting ends. It tallies votes and declares a winner.

### Result Validation

```leo
async function finalize_set_result(
    dao_id: field,
    proposal_id: field,
    proposal_key: field,
    winner: field,
    set_result_future: Future
) {
    set_result_future.await();

    let proposal: Proposal = zvote_dao_registry_015.aleo/proposals.get(proposal_key);
    assert_eq(proposal.voting_system, self.address);

    let end_block: u32 = proposal_params.get(proposal.params_hash).end_block;
    assert(block.height >= end_block);

    let vs_params: VotingSystemParams = voting_system_params.get(
        proposal.vs_params_hash
    );

    let candidate0_score_key: field = BHP256::hash_to_field(
        ScoreKey {
            dao_id: dao_id,
            proposal_id: proposal_id,
            candidate: 0field
        }
    );
    let candidate0_score: u128 = scores.get_or_use(candidate0_score_key, 0u128);

    let candidate1_score_key: field = BHP256::hash_to_field(
        ScoreKey {
            dao_id: dao_id,
            proposal_id: proposal_id,
            candidate: 1field
        }
    );
    let candidate1_score: u128 = scores.get_or_use(candidate1_score_key, 0u128);

    let maximum_score: u128 = max_u128(candidate0_score, candidate1_score);
    assert(candidate0_score + candidate1_score >= vs_params.quorum);
    assert(candidate0_score != candidate1_score);

    let computed_winner: field = (candidate0_score > candidate1_score) ?
        0field :
        1field;
    assert_eq(winner, computed_winner);
}
```

The validation logic:
1. Voting period ended (`block.height >= end_block`)
2. This is the correct voting system for this proposal
3. Fetch both candidates' scores
4. Check quorum met: `candidate0_score + candidate1_score >= quorum`
5. No ties: `candidate0_score != candidate1_score`
6. Verify winner matches the higher score

The result is deterministic. Anyone can compute it, but only one valid winner exists.

### Token Custody Flow

Your tokens are locked during voting. The custody receipt proves ownership. You can withdraw anytime before results are finalized.

## ZK Cryptography

Zero-knowledge proofs prove computation correctness without revealing inputs. That's the core idea.

### Aleo's ZK Stack

**snarkVM - Virtual Machine**

Executes Leo programs off-chain, compiles them to R1CS constraints, and generates ZK proofs of correct execution using the Marlin proving system.

**snarkOS - Consensus Layer**

Runs on validator nodes to verify ZK proofs, maintain blockchain state, and reach consensus without re-executing computations.

### Marlin Proof System

Aleo uses Marlin, a preprocessing ZK-SNARK. "Preprocessing" means proving/verifying keys are generated once per program during deployment, not per transaction.

- **Setup Phase**: Program deployer generates proving key (pk) and verifying key (vk) once when deploying the Leo program to the network.
- **Proving Phase**: Voters (clients) use the proving key with their private inputs (vote choice, credentials) to generate proof $\pi$ in 1-3 seconds.
- **Verification Phase**: Validators use the vk to verify proof $\pi$ in ~10-20ms, ensuring that every state transition result is correct by accepting or rejecting the transaction.

### Pedersen Commitments in Records

Every record in Aleo uses Pedersen commitments. When you create a `CustodyReceipt` record:

```leo
record CustodyReceipt {
    owner: address,
    amount: u128,
    token_id: field,
    external_authorization_required: bool,
    dao_id: field,
    proposal_id: field,
    candidate: field
}
```

The system automatically computes:

$$
\text{commitment} = \text{Pedersen}(\text{owner} || \text{amount} || \text{token\_id} || \text{external\_authorization\_required} || \text{dao\_id} || \text{proposal\_id} || \text{candidate})
$$

What goes on chain is only the commitment, the private values never appear on-chain.

### BHP256 (Bowe-Hopwood-Pedersen)

You might have noticed this hash function throughout the code implementation above. BHP256 (Bowe-Hopwood-Pedersen) hashes voting parameters into a single field element. It's collision-resistant and efficient inside ZK circuits. One of the ways zVote uses it, is to commit to proposal parameters.

```leo
let params_hash: field = BHP256::hash_to_field({...});
```

Refer [https://docs.leo-lang.org/language/operators#bhp256hash_to_destination](https://docs.leo-lang.org/language/operators#bhp256hash_to_destination) to know more about BHP256.

## Security Considerations

Let's talk about the elephant in the room: voting systems are hard to secure.

### The Security Model

What does zVote actually protect?

**Vote Validity**: ZK proofs verify that each vote is structurally correct - the voter is eligible, the choice is valid, and all constraints are satisfied.

**Token Custody**: Voters must lock tokens to vote. Each token record can only be used once, preventing reuse of the same tokens.

**Tamper-Proof Tallying**: Vote counts are recorded on-chain with cryptographic guarantees. You can't manipulate totals without breaking the underlying proofs.

### What zVote Doesn't Solve

**Authority Compromise**: Admin accounts control critical functions like creating DAOs, managing voting systems, and setting parameters. If compromised, an attacker could manipulate the governance process before voting even begins.

**Mitigation**: Multi-signature requirements, time-locks, or decentralized governance for admin functions.

### The Privacy Reality

Here's the critical point: zVote is a modular framework. Privacy depends on your implementation choices. The base voting system keeps individual votes private but shows running tallies publicly. This real-time transparency is verifiable but allows early results to influence later voters. Aleo DCP hides tallies until voting closes.

Aleo DCP (Data Custody Protocol) lets programs hold encrypted secrets that can only be revealed when specific conditions are met (like after a voting deadline). The secrets are split across multiple validators using Shamir Secret Sharing, so no single party can decrypt them early.

Source: [zsociety-io/aleo-dcp](https://github.com/zsociety-io/aleo-dcp)

| Feature | Without DCP | With DCP |
|---------|-------------|----------|
| Individual Ballots | Private records (encrypted on-chain) | Private records (encrypted on-chain) |
| Vote Tallies | Public mappings, updated in real-time | Encrypted until reveal conditions met |
| Who Voted | Public | Public |
| Ongoing Results | Visible to everyone as votes come in | Hidden during voting period |
| Result Disclosure | Immediate | Time-bound, revealed after deadline |

Bottom line: Without DCP, you get pseudonymous voting with public live tallies. With DCP, you get true time-bound privacy.

## Resources

### Core Architecture
[https://developer.aleo.org/concepts/network/core_architecture/](https://developer.aleo.org/concepts/network/core_architecture/)

### Consensus
[https://developer.aleo.org/concepts/network/consensus/#bullshark-and-narwhal/](https://developer.aleo.org/concepts/network/consensus/#bullshark-and-narwhal/)

### FAQs
[https://developer.aleo.org/references/faqs/](https://developer.aleo.org/references/faqs/)

### Async Programming Model
[https://developer.aleo.org/concepts/fundamentals/async/](https://developer.aleo.org/concepts/fundamentals/async/)

### Aleo Instructions Language Guide
[https://developer.aleo.org/guides/aleo/language/](https://developer.aleo.org/guides/aleo/language/)

### Managing Public and Private State
[https://developer.aleo.org/sdk/guides/managing_state/](https://developer.aleo.org/sdk/guides/managing_state/)

### Transitions Documentation
[https://developer.aleo.org/concepts/fundamentals/transitions/](https://developer.aleo.org/concepts/fundamentals/transitions/)

### Transactions Documentation
[https://developer.aleo.org/concepts/fundamentals/transactions/](https://developer.aleo.org/concepts/fundamentals/transactions/)
