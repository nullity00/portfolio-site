---
title: "Trusted Setup in Zero-Knowledge Proofs"
slug: "trusted-setup"
category: "blog"
description: "Understanding trusted setups, perpetual powers of tau, and security considerations in zk-SNARK protocols"
---

# Trusted Setup in Zero-Knowledge Proofs

## Table of Contents

1. [Introduction to Trusted Setups](#introduction-to-trusted-setups)
2. [Anatomy of a .ptau file](#anatomy-of-a-ptau-file)
3. [What is Perpetual Powers of Tau?](#what-is-perpetual-powers-of-tau)
4. [Innovations in Trusted Setup: Optimistic Pipelining](#innovations-in-trusted-setup-optimistic-pipelining)
5. [Security Considerations](#security-considerations)
6. [Key Takeaways](#key-takeaways)

## Introduction to Trusted Setups

Trusted Setup is a pivotal component in some cryptographic protocols, particularly those leveraging Succinct Non-Interactive Arguments of Knowledge (SNARKs). It involves creating a set of random secret numbers, encrypting them, and utilizing them within commitment schemes, essential for the successful functioning of the protocol. These random secret values, often termed 'toxic wastes,' must be permanently erased to maintain the protocol's integrity and prevent malicious exploitation.

In this process, trust in at least one of the participants is paramount to ensure the efficacy of the setup. This gives rise to the term 'trusted setup.'

Before we dive into the notorious bugs found in trusted setup ceremonies, let's get a clear picture of what a trusted setup is. Here are two articles which break down the process of trusted setup very well:

1. [A Guide to Understanding Trusted Setups](https://blog.pantherprotocol.io/a-guide-to-understanding-trusted-setups/)
2. [Vitalik's Guide to Trusted Setup](https://vitalik.ca/general/2022/03/14/trustedsetup.html)

To TLDR this:

Modern SNARKs are built upon Polynomial Commitment Schemes (PCS) and Interactive Oracle Proofs (IOP). In the PCS, a commitment to a polynomial is made, requiring a secret value generated during the trusted setup. This setup essentially forms the backbone of the SNARK protocol, making it imperative to establish trust in its execution.

The Powers of Tau ceremony is a common type of trusted setup, creating a public parameter string in the form of:

$$
(\tau \cdot G_1, \tau^2 \cdot G_1, \tau^3 \cdot G_1, \ldots, \tau^m \cdot G_1 \ ; \ \tau \cdot G_2, \tau^2 \cdot G_2, \tau^3 \cdot G_2, \ldots, \tau^n \cdot G_2)
$$

Here $\tau$ is the secret and $G_1, G_2$ are the generators of elliptic curve groups of a pairing friendly curve and $m, n$ are specific to the application's requirements.

## Anatomy of a .ptau file

A `.ptau` file contains the powers of tau parameters generated during the trusted setup ceremony. These files are essential for circuit-specific setups and contain the public parameters that enable zero-knowledge proof generation.

## What is Perpetual Powers of Tau?

To simplify the process of generating powers of tau & to add more randomness to the CRS, the MACI team at the PSE group of EF came up with [Perpetual Powers of Tau (Phase 1)](https://medium.com/coinmonks/announcing-the-perpetual-powers-of-tau-ceremony-to-benefit-all-zk-snark-projects-c3da86af8377) where they have public parameters for circuits up to $2^{28}$ constraints. Anyone can contribute to this ceremony, and as long as one of the participant is honest, the entire setup is trustworthy.

One can pick any point of the Perpetual Powers of Tau to begin their circuit-specific second phase.

## Innovations in Trusted Setup: Optimistic Pipelining

[Optimistic Pipelining](https://ethresear.ch/t/accelerating-powers-of-tau-ceremonies-with-optimistic-pipelining/6870) represents a significant innovation in trusted setup ceremonies.

Traditionally, each contributor had to wait for their turn to process a chunk of data, causing delays when others were inactive. Optimistic Pipelining is a new approach whereby multiple participants can work in parallel on different chunks of data simultaneously.

Imagine a conveyor belt with chunks of work moving along. Each participant processes their assigned chunk and passes their output to the next person without waiting for others. If someone stops participating or does something wrong, only their chunk and the following ones are affected. The rest of the process continues smoothly.

This method significantly speeds up the overall process, allowing many participants to work together efficiently. It's like a faster and more streamlined assembly line for creating the needed mathematical values, making the whole ceremony faster and more scalable.

Here's a recent [paper](https://eprint.iacr.org/2022/1592.pdf) introducing the first decentralized trusted setup protocols for constructing a powers-of-tau structured reference string.

## Security Considerations

While Trusted Setup is a fundamental process, it's not without its security considerations:

### 1. Exposing Discrete Log Relation

In the [security assessment](https://github.com/nullity00/zk-security-reviews/blob/main/Aleo/LeastAuthority_Aleo_Trusted_Setup_Phase_1_Final_Audit_Report.pdf) of Aleo's trusted setup conducted by Least Authority, it was noted that Aleo's trusted setup follows the approach outlined in the [MMORPG paper](https://eprint.iacr.org/2017/1050.pdf). MMORPG employs a discrete log proof of knowledge scheme based on the Knowledge of Exponent assumption (KEA), ensuring that no user of the system should possess knowledge of a discrete logarithm relation between different oracle queries. However, the review by Least Authority revealed that the method adopted by the Aleo development team inadvertently reveals a discrete logarithm relation between any output and the generator, posing a potential security risk.

### 2. Cheon's Attack

Cheon's attack is a method for solving the discrete logarithm problem (DLP) in certain cryptographic groups, particularly elliptic curve groups. The discrete logarithm problem involves finding $x$ in the equation $g^x = h$ where $g$ is the generator of the group and $h$ is an element of the group.

In the case of big trusted setups $(d \approx 2^{40})$, given the values $g, g^{\tau}, g^{\tau^{d}}$ it is possible to break the soundness of the system by solving for $\tau$. For projects aiming for 128-bit security while employing extensive circuits, it is critical to acknowledge and address this vulnerability, as discussed comprehensively [in this post](https://ethresear.ch/t/cheons-attack-and-its-effect-on-the-security-of-big-trusted-setups/6692).

### 3. Memory Management

Ensuring the secure erasure of confidential contributions is a pivotal task in any Multi-Party Computation (MPC) implementation of a trusted setup ceremony. However, a frequently underestimated aspect is that when functions go out of scope, the variables utilized within that function are not systematically erased and persist in the process's memory, which is eventually released back to the memory pool.

Certain programming languages offer specific mechanisms to obliterate data from memory securely. For instance, in the Rust programming language, the crate [zeroize](https://docs.rs/zeroize/1.1.0/zeroize/) serves this purpose, while in C++, the `free()` function is often utilized to achieve the same outcome.

### 4. Degenerative Contributions

During the trusted ceremony, it is possible for an attacker to use a degenerative contribution to erase the setup thus undermining the contributions of previous participants. Thus, it important that the verifier checks if the contributor has well formed public parameters, non-degenerative updates & that the latest contribution to the ceremony builds on the work of the preceding participants.

Here's another article explaining the security considerations of Trusted Setup ceremonies: [Security Considerations of zk-SNARK Parameter Multi-Party Computation](https://research.nccgroup.com/2020/06/24/security-considerations-of-zk-snark-parameter-multi-party-computation/)

## Key Takeaways

Trusted Setup plays a critical role in the integrity and security of some zkSNARKs but not without its pitfalls. Security vulnerabilities and potential risks can undermine the efficacy and trustworthiness of the setup. This emphasizes the importance of auditing the trusted setup and utilizing reliable, well-vetted code from trusted sources.

To ensure a trustworthy Trusted Setup:

- **Audit Your Trusted Setup**: Regular security assessments are crucial
- **Use Reliable and Verified Code**: Leverage well-tested implementations
- **Follow Best Security Practices**: Implement proper memory management and verification
- **Stay Informed**: Keep up with the latest research and vulnerabilities
