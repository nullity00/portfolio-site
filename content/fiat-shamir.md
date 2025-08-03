---
title: "Fiat Shamir Transformation and Security Pitfalls"
slug: "fiat-shamir-pitfalls"
category: "blog"
description: "Understanding Fiat-Shamir transformation, its implementation pitfalls, and security considerations in zero-knowledge proof systems"
---

# What is Fiat Shamir ?

The Pitfalls

1. Weak F-S Implementation
2. Grinding Attacks
3. State Restoration Attacks
4. Fault Injection Attacks

Resources

## What is Fiat Shamir ?

It is often mentioned in zero knowledge proofs that interactive protocols can be made non interactive by using Fiat Shamir Transformation. But how exactly does that happen ?

Most interactive protocols can be boiled down to this interaction

1. The prover sends a polynomial commitment $com_p$ to the verifier 
2. The verifier with a challenge value  $r \in F_q$ generated uniformly at random.
3. The Prover calculates $com_p(r)$ and sends it to the verifier with an evaluation proof $\pi$

![Untitled](https://prod-files-secure.s3.us-west-2.amazonaws.com/51b7421b-cae0-49db-ac78-c9a988f11825/98af1694-f1c8-4b93-ab03-63ae3bea534a/Untitled.png)

While the Prover-Verifier chit chat might seem perfect in theory, it is not really practical to implement it in code. This is where the concept of a "random oracle" comes into play. A random oracle is an idealized notion, representing a truly random function that is immune to birthday attacks, unlike regular hash functions. In practice, we use hash functions as the closest approximation to a random oracle.

Hence we use a hash function to generate $r = H(com_p, x, y)$ where $com_p$ is the commitment to the polynomial $p$, $x$ is the public input to the circuit, $y$  could be any known parameter such as the domain or the field modulus.

![Untitled](https://prod-files-secure.s3.us-west-2.amazonaws.com/51b7421b-cae0-49db-ac78-c9a988f11825/91766505-1b0d-4500-9703-3b40e16ac3cc/Untitled.png)

This is called Fiat Shamir Transformation [developed by Amos Fiat and Adi Shamir](https://link.springer.com/content/pdf/10.1007%2F3-540-47721-7_12.pdf). The idea behind the Fiat-Shamir transformation is that instead of having the verifier send a random challenge value to the prover, the prover can compute this value themselves by using a random function, such as a cryptographic hash function.

## The Pitfalls

### 1. Weak F-S implementation

In April 2022, Trail of Bits conducted a survey of open-source implementations of zero-knowledge proof systems and found 36 weak Fiat-Shamir implementations affecting 12 different proof systems. A crucial aspect that is often overlooked is whether it is necessary to include public information, such as the statement, in the transcript. The version of the transformation where the public information is not hashed is typically referred to as "weak Fiat-Shamir." 

If the public information is hashed, it's called "strong Fiat-Shamir" or simply "Fiat-Shamir." Some common weak Fiat-Shamir practices include sending unhashed inputs to the random oracle, incorrect serialization/deserialization of inputs, and omitting critical values. To prevent replay attacks, it's advisable to include the IDs of both the prover and verifier in the Fiat-Shamir hash computation.

Several points to note while implementing Fiat Shamir transformation for your interactive protocol :

- Make a list of all F-S inputs/outputs
- “If you can transmit it, you can hash it”
- Refer good libraries : [Merlin](https://github.com/zkcrypto/merlin) & [Nimue](https://github.com/mmaker/nimue) are the available in Rust
- Get your code reviewed !

Here’s the article by Trail of Bits about their bug hunt : https://blog.trailofbits.com/2022/04/13/part-1-coordinated-disclosure-of-vulnerabilities-affecting-girault-bulletproofs-and-plonk/

### 2. Grinding Attacks

Grinding attacks in the Fiat-Shamir transformation can occur when an adversary repeatedly chooses different commitments to the same challenge and computes multiple responses in an attempt to find one that leads to a valid proof.

![Untitled](https://prod-files-secure.s3.us-west-2.amazonaws.com/51b7421b-cae0-49db-ac78-c9a988f11825/80b594ea-4c32-474b-95a4-bf0993b5bc3b/Untitled.png)

Let’s Assume an interactive model has a soundness error, $\epsilon = 2^{-80}$. The probability of successfully convincing the verifier is  $T * 2^{-80}$  where $T$ is the no. of attempts made by the adversary. Typically, we will use a challenge space about $2^{128}$ (256-bit hash functions) when using Fiat-Shamir.

![Untitled](https://prod-files-secure.s3.us-west-2.amazonaws.com/51b7421b-cae0-49db-ac78-c9a988f11825/9421f6e5-184e-4bcb-803d-0123b66f9ac6/Untitled.png)

For a  1 - round interactive protocol with soundness error $\epsilon = 1/2$ , meaning it has got 1-bit of security. Similarly, for a $k$-round interactive protocol, the soundness error is $\epsilon = 1/2^k$ with k bits of security. In the case of a $k$ round interactive protocol made non interactive via Fiat Shamir Transformation, the protocol would have $\log(k)$ bits of security only. One solution is to introduce a time out to the prover to furnish the correct proof to the verifier, this way we limit the grinding done by the adversary at every round. Another solution is to reduce the number of rounds by compressing multiple variables or reuse the variables over many rounds.

With that being said, cryptographers that are obtaining a SNARK by applying the Fiat Shamir transformation to an interactive protocol with more than three messages should show that the protocol is round by round sound.

### 3. State Restoration Attacks

In a state restoration attack, a malicious prover P interacting with a verifier V may at any point reset V to a state that V was previously in. Then, P may continue to interact with V , with V using fresh randomness. For any public-coin protocol $\pi$, if $\pi$ is sound against state restoration attacks, then $\pi$ is round-by-round sound

Here’s one research tackling this issue :

 [Tight State-Restoration Soundness in the Algebraic Group Model](https://eprint.iacr.org/2020/1351.pdf) - [Video](https://www.youtube.com/watch?v=JMEvYwjIRjs)

### 4. Fault Injection Attacks

In the context of cryptographic systems, fault injection attacks specifically target vulnerabilities in the cryptographic operations of a device or software by intentionally introducing faults.

The attacker injects hardware faults, such as flip bits in memory, which lead to undetectable erroneous output. Appropriate use of erroneous output by the attacker can lead to full disclosure of system secret keys and Denial of service as well.

To protect Fiat Shamir cryptosystems from Fault Injection Attacks, the use of hardware security modules (HSMs) and secure elements are specifically designed to provide physical protection against various attacks should be encouraged. Introducing redundancy in critical components and having multiple copies of data or operations, one can detect and correct errors introduced by fault injection.

Here’s a paper on [Fault Injection Attacks on Fiat Shamir Crypto systems](https://web.archive.org/web/20070712231840id_/http://www.csl.ee.upatras.gr/users/bogart/publications/Fault-Fiat-Shamir.pdf) 

## Resources

1. Weak Fiat Shamir Attacks on Modern Proof systems - [Paper](https://eprint.iacr.org/2023/691.pdf) | [Video](https://www.youtube.com/watch?v=RTSdkWZrEn4) 
2. Opal Wright : Fiat Shamir Vulnerabilities - [Video](https://www.youtube.com/watch?v=giZNOI_JalA)
3. On Adaptive Security of Delayed-Input Sigma Protocols and Fiat-Shamir NIZKs - [Paper](https://eprint.iacr.org/2020/831.pdf)
4. Fiat Shamir Transformation and its Security Problems - [Article](https://medium.com/@shymaa.arafat/fiat-shamir-transformation-and-its-security-problems-shymaa-m-a14d8f7d9192)
5. Fiat-Shamir heuristic in the eyes of attackers - [Article](https://jinb-park.github.io/2022/12/08/fiat-shamir-heuristic-in-the-eyes-of-attackers.html)