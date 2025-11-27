![Untitled](https://prod-files-secure.s3.us-west-2.amazonaws.com/51b7421b-cae0-49db-ac78-c9a988f11825/2fac1dc8-9434-4407-8e5c-7e00949bdff5/Untitled.png)

Folding schemes have been the buzz in the Zero Knowledge Ecosystem of 2023. But what's the lowdown? Let's start from the basics: SNARKs!

SNARKs are cryptographic proof systems that let a prover convince a verifier they 'know' something, without revealing the details. As wonderful as it looks, SNARKs have their own tradeoffs. Fast provers mean long proofs, making verification a headache. Slow provers create short proofs, but they're, well, slow. But what if we could somehow reduce the proving & verification costs by proving that the verification of a program was done correctly ? And there you have a one-level recursive SNARK.

![Untitled](https://prod-files-secure.s3.us-west-2.amazonaws.com/51b7421b-cae0-49db-ac78-c9a988f11825/39ac6e41-c41f-4a67-bf82-230f7197f7af/Untitled.png)

This structure could be extended to n-levels of full fledged recursive snarks & proof composition using suitable SNARKs. This way, If the statement to be proven has a repetitive/iterative structure (consists of repeated application of a limited number of functions), composition and the resulting recursive SNARKs become a valuable tool.

One such computational framework is Incrementally Verifable Computation (IVC) where a verifier checks the correctness of a function which progresses or changes incrementally. 

![Untitled](https://prod-files-secure.s3.us-west-2.amazonaws.com/51b7421b-cae0-49db-ac78-c9a988f11825/e5ebb0f8-5f35-4d7e-9575-5e48af65911f/Untitled.png)

But wait, where’s the folding happening ?

## Folding Schemes

In the above mentioned IVC example, there is a verification of proofs happening at every step which  is costly as it involves opening multiple polynomial commitments. To tackle this, Nova brings in a new concept of “Folding” instances & verifying the expensive computation in the end. 

The Folding Scheme is a protocol between the untrusted prover & the verifier where the prover takes two instances $z_1 = (w_1, x_1)$ and $z_2 = (w_2, x_2)$ & returns a single **folded instance $z = (w, x)$.**  Informally, a folding scheme guarantees that the folded instance is satisfiable only if the original instances are satisfiable. 

![Untitled](https://prod-files-secure.s3.us-west-2.amazonaws.com/51b7421b-cae0-49db-ac78-c9a988f11825/eaab949c-4aac-4e7e-bd4b-b398fec59fed/Untitled.png)

The two-to-one reduction pattern of folding schemes is seen in Sum check protocol & in the split-and-fold techniques in Inner Product Arguments. Here’s a hand wavy approach of how the instances are folded :

$$
w = w_1 + r \ w_2 \\ x = x_1 + r \  x_2 \\ z = z_1 + r \ z_2
$$

Here, $r$ is the randomness provided by the Verifier. The witnesses $w_1 , w_2$ are folded into $w$ and the public inputs $x_1, x_2$  are folded into $x$ .

Since, the release of the Nova, this technique of folding has been applied to multiple proof systems. Let’s view them one by one in brief.

### 1. Nova

The Folding Scheme in Nova is constructed on R1CS : an NP-complete language that generalizes arithmetic circuit satisfiability. The barebones of R1CS constraint system is this equation :

$$
Az \ \cdot Bz = Cz 
$$

Since the folded instance $z = z_1 + r \ z_2$ does not satisfy the above equation, Nova introduces a set of relaxed R1CS equation as shown below

$$
Az \ \cdot Bz = uCz + E 
$$

Using the relaxed R1CS equation, every instance is folded recursively over cycles of curves. Nova uses pederson vector commitments to commit to the $E$ vector every time two instances are folded. These commitments are additively homomoprhic & can be aggregated together to be verified in the end. At the moment, Nova supports folding over Pasta curves & BN254-Grumpkin pair. The final folded instance is evaluated over the function for which the proof is produced by Spartan. 

![Untitled](https://prod-files-secure.s3.us-west-2.amazonaws.com/51b7421b-cae0-49db-ac78-c9a988f11825/e769e92c-b5c8-4c15-b58a-22618198665c/Untitled.png)

One of the key drawbacks of Nova is that it does not support lookups or higher degree gates due to its dependence on the R1CS constraint system.

Here’s a detailed explaination on working of Nova : [Nova[WIP]](https://www.notion.so/Nova-WIP-4e97e5a45d16423984f020e45f305f50?pvs=21) 

Implementation - https://github.com/microsoft/Nova

### 2. SuperNova

SuperNova, as the name suggests is a successor to the recursive proof system Nova, for incrementally producing succinct proofs of correct execution of programs on a stateful machine with a particular instruction set (e.g., EVM, RISC-V). Naturally, SuperNova can support a rich instruction set whereas Nova supports machines with a single instruction. This is done via non-uniform IVC wherein SuperNova keeps track of specific folded instances (which could be instructions). 

Implementation - https://github.com/jules/supernova

### 3. HyperNova

Before moving on to HyperNova, let’s decode a few buzz words. 

**Customizable Constraint System :** 

![Untitled](https://prod-files-secure.s3.us-west-2.amazonaws.com/51b7421b-cae0-49db-ac78-c9a988f11825/2c834bb7-6f3a-4d93-b44e-766f031890a9/Untitled.png)

CCS is a generalization of R1CS that can simultaneously capture R1CS, Plonkish, and AIR without overheads. An R1CS equation looks like this : $Az \ \cdot Bz = Cz$  where $A, B, C$ are constraint matrices and $z$ is the instance vector containing witness $w$ and public input $x$. CSS generalizes this into the equation $\sum_{i \ \in \ q} M_j \cdot z = 0$  , $M_j$ could be matrices (eg., $A, B$ and $-C$ ) & $z$ is the instance vector.  

The latest addition to the Nova family is HyperNova, where steps in incremental computations are expressed with CCS (Customizable Constraint System) & performs a randomized sumcheck protocol to accumulate a new instance. The folding technique employed here is a generalization of folding schemes referred to as multi-folding scheme. HyperNova also introduces **nlookup,** a lookup argument compatible with the Nova family.

### 4. Sangria

Sangria (or PlonkNova) is a folding scheme for PLONK arithmetization. The Plonk equation is 

$$
q_L * a + q_R * b + q_O * c + q_M * a * b + q_C = 0
$$

As this is incompatible with folded instances, Sangria introduces a relaxed Plonk equation :

$$
u \ ( q_L * a + q_R * b + q_O * c) + q_M * a * b + q_C + e = 0
$$

It then extends its PLONK arithmetization to accept custom gates of degree 2 and circuits with gates having multiple arguments/inputs. 

Origami is a Halo2 Lookup protocol which happens to be a special case of Sangria.

Implementation - https://github.com/geometryresearch/sangria_impl

### 5. Protostar

Btw, what are special sound protocols ?

**Special Sound Protocol :**

Special soundness is a property of interactive protocols. It states that given a tree of accepting transcripts, there exists an algorithm that can recover a valid witness. A tree of transcripts is a tree in which each node is a prover message and each edge is verifier challenge. It allows to track what the prover would have sent given different challenges from the verifier.

![Untitled](https://prod-files-secure.s3.us-west-2.amazonaws.com/51b7421b-cae0-49db-ac78-c9a988f11825/c717fa66-3edb-453e-a118-cde402f2f030/Untitled.png)

ProtoStar provides a generic folding scheme for any multi-round special sound protocol via non uniform IVC (read the technique used in SuperNova). It also supports high-degree gates, Lookups & is easily extendible to CCS. 

In Nova, there are two checks : Folding check to check if the folding was done properly & Prover check to deduce if the function was evaluated well over the folded instance. In Protostar, these two checks are combined into one by performing polynomial interpolation.

While we’ve seen Folding schemes which fold two instances in one folding step, ProtoGalaxy focuses on folding k instances in one folding operation.

Implementation - https://github.com/arnaucube/protogalaxy-poc

## Resources

1. Nova - https://eprint.iacr.org/2021/370.pdf
2. Breaking Nova - https://eprint.iacr.org/2023/969.pdf
3. Super Nova - https://eprint.iacr.org/2022/1758
4. CCS - https://eprint.iacr.org/2023/552.pdf
5. Hyper Nova - https://eprint.iacr.org/2023/573
6. Sangria - https://github.com/geometryresearch/technical_notes/blob/main/sangria_folding_plonk.pdf
7. Protostar - https://eprint.iacr.org/2023/620
8. Protogalaxy - https://eprint.iacr.org/2023/1106
9. Origami - https://hackmd.io/@aardvark/rkHqa3NZ2
10. CycleFold - https://eprint.iacr.org/2023/1192