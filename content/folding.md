---
title: "Folding Schemes: From Nova to ProtoGalaxy"
slug: "folding"
category: "blog"
description: "Understanding folding schemes in zero-knowledge proofs, exploring Nova, SuperNova, HyperNova, Sangria, and ProtoStar"
---

# Folding Schemes: From Nova to ProtoGalaxy

Folding schemes have been the buzz in the Zero Knowledge Ecosystem of 2023. But what's the lowdown? Let's start from the basics: SNARKs!

SNARKs are cryptographic proof systems that let a prover convince a verifier they 'know' something, without revealing the details. As wonderful as it looks, SNARks have their own tradeoffs. Fast provers mean long proofs, making verification a headache. Slow provers create short proofs, but they're, well, slow. But what if we could somehow reduce the proving & verification costs by proving that the verification of a program was done correctly? And there you have a one-level recursive SNARK.

This structure could be extended to n-levels of full fledged recursive snarks & proof composition using suitable SNARKs. This way, If the statement to be proven has a repetitive/iterative structure (consists of repeated application of a limited number of functions), composition and the resulting recursive SNARKs become a valuable tool.

One such computational framework is Incrementally Verifiable Computation (IVC) where a verifier checks the correctness of a function which progresses or changes incrementally.

But wait, where's the folding happening?

## Folding Schemes

In the above mentioned IVC example, there is a verification of proofs happening at every step which is costly as it involves opening multiple polynomial commitments. To tackle this, Nova brings in a new concept of "Folding" instances & verifying the expensive computation in the end.

The Folding Scheme is a protocol between the untrusted prover & the verifier where the prover takes two instances $z_1 = (w_1, x_1)$ and $z_2 = (w_2, x_2)$ & returns a single **folded instance $z = (w, x)$.** Informally, a folding scheme guarantees that the folded instance is satisfiable only if the original instances are satisfiable.

The two-to-one reduction pattern of folding schemes is seen in Sum check protocol & in the split-and-fold techniques in Inner Product Arguments. Here's a hand wavy approach of how the instances are folded:

$$
w = w_1 + r \cdot w_2
$$

$$
x = x_1 + r \cdot x_2
$$

$$
z = z_1 + r \cdot z_2
$$

Here, $r$ is the randomness provided by the Verifier. The witnesses $w_1, w_2$ are folded into $w$ and the public inputs $x_1, x_2$ are folded into $x$.

Since, the release of the Nova, this technique of folding has been applied to multiple proof systems. Let's view them one by one in brief.

### 1. Nova

The Folding Scheme in Nova is constructed on R1CS: an NP-complete language that generalizes arithmetic circuit satisfiability. The barebones of R1CS constraint system is this equation:

$$
Az \cdot Bz = Cz
$$

Since the folded instance $z = z_1 + r \cdot z_2$ does not satisfy the above equation, Nova introduces a set of relaxed R1CS equation as shown below

$$
Az \cdot Bz = uCz + E
$$

Using the relaxed R1CS equation, every instance is folded recursively over cycles of curves. Nova uses pederson vector commitments to commit to the $E$ vector every time two instances are folded. These commitments are additively homomorphic & can be aggregated together to be verified in the end. At the moment, Nova supports folding over Pasta curves & BN254-Grumpkin pair. The final folded instance is evaluated over the function for which the proof is produced by Spartan.

One of the key drawbacks of Nova is that it does not support lookups or higher degree gates due to its dependence on the R1CS constraint system.

Implementation: [https://github.com/microsoft/Nova](https://github.com/microsoft/Nova)

### 2. SuperNova

SuperNova, as the name suggests is a successor to the recursive proof system Nova, for incrementally producing succinct proofs of correct execution of programs on a stateful machine with a particular instruction set (e.g., EVM, RISC-V). Naturally, SuperNova can support a rich instruction set whereas Nova supports machines with a single instruction. This is done via non-uniform IVC wherein SuperNova keeps track of specific folded instances (which could be instructions).

Implementation: [https://github.com/jules/supernova](https://github.com/jules/supernova)

### 3. HyperNova

Before moving on to HyperNova, let's decode a few buzz words.

**Customizable Constraint System:**

CCS is a generalization of R1CS that can simultaneously capture R1CS, Plonkish, and AIR without overheads. An R1CS equation looks like this: $Az \cdot Bz = Cz$ where $A, B, C$ are constraint matrices and $z$ is the instance vector containing witness $w$ and public input $x$. CCS generalizes this into the equation $\sum_{i \in q} M_j \cdot z = 0$, $M_j$ could be matrices (eg., $A, B$ and $-C$) & $z$ is the instance vector.

The latest addition to the Nova family is HyperNova, where steps in incremental computations are expressed with CCS (Customizable Constraint System) & performs a randomized sumcheck protocol to accumulate a new instance. The folding technique employed here is a generalization of folding schemes referred to as multi-folding scheme. HyperNova also introduces **nlookup**, a lookup argument compatible with the Nova family.

### 4. Sangria

Sangria (or PlonkNova) is a folding scheme for PLONK arithmetization. The Plonk equation is

$$
q_L \cdot a + q_R \cdot b + q_O \cdot c + q_M \cdot a \cdot b + q_C = 0
$$

As this is incompatible with folded instances, Sangria introduces a relaxed Plonk equation:

$$
u \cdot (q_L \cdot a + q_R \cdot b + q_O \cdot c) + q_M \cdot a \cdot b + q_C + e = 0
$$

It then extends its PLONK arithmetization to accept custom gates of degree 2 and circuits with gates having multiple arguments/inputs.

Origami is a Halo2 Lookup protocol which happens to be a special case of Sangria.

Implementation: [https://github.com/geometryresearch/sangria_impl](https://github.com/geometryresearch/sangria_impl)

### 5. ProtoStar

Btw, what are special sound protocols?

**Special Sound Protocol:**

Special soundness is a property of interactive protocols. It states that given a tree of accepting transcripts, there exists an algorithm that can recover a valid witness. A tree of transcripts is a tree in which each node is a prover message and each edge is verifier challenge. It allows to track what the prover would have sent given different challenges from the verifier.

ProtoStar provides a generic folding scheme for any multi-round special sound protocol via non uniform IVC (read the technique used in SuperNova). It also supports high-degree gates, Lookups & is easily extendible to CCS.

In Nova, there are two checks: Folding check to check if the folding was done properly & Prover check to deduce if the function was evaluated well over the folded instance. In Protostar, these two checks are combined into one by performing polynomial interpolation.

While we've seen Folding schemes which fold two instances in one folding step, ProtoGalaxy focuses on folding k instances in one folding operation.

Implementation: [https://github.com/arnaucube/protogalaxy-poc](https://github.com/arnaucube/protogalaxy-poc)

## Resources

1. Nova - [https://eprint.iacr.org/2021/370.pdf](https://eprint.iacr.org/2021/370.pdf)
2. Breaking Nova - [https://eprint.iacr.org/2023/969.pdf](https://eprint.iacr.org/2023/969.pdf)
3. Super Nova - [https://eprint.iacr.org/2022/1758](https://eprint.iacr.org/2022/1758)
4. CCS - [https://eprint.iacr.org/2023/552.pdf](https://eprint.iacr.org/2023/552.pdf)
5. Hyper Nova - [https://eprint.iacr.org/2023/573](https://eprint.iacr.org/2023/573)
6. Sangria - [https://github.com/geometryresearch/technical_notes/blob/main/sangria_folding_plonk.pdf](https://github.com/geometryresearch/technical_notes/blob/main/sangria_folding_plonk.pdf)
7. Protostar - [https://eprint.iacr.org/2023/620](https://eprint.iacr.org/2023/620)
8. Protogalaxy - [https://eprint.iacr.org/2023/1106](https://eprint.iacr.org/2023/1106)
9. Origami - [https://hackmd.io/@aardvark/rkHqa3NZ2](https://hackmd.io/@aardvark/rkHqa3NZ2)
10. CycleFold - [https://eprint.iacr.org/2023/1192](https://eprint.iacr.org/2023/1192)
