---
title: "Distributed Key Generation (DKG) Process"
slug: "neox-dkg"
category: "blog"
description: "Understanding the DKG process with multi-curve architecture, polynomial commitments, and share distribution mechanisms"
---

# DKG Process

## Table of Contents

1. [PVSS (Publicly Verifiable Secret Sharing) Explanation](#pvss-publicly-verifiable-secret-sharing-explanation)
2. [What Every Validator Must Share](#what-every-validator-must-share)
3. [Share Reception and Decryption](#share-reception-and-decryption)
4. [Mathematical Properties](#mathematical-properties)
5. [Security Considerations](#security-considerations)

**All validators generate and share** key shares with everyone else.

Multi-Curve Architecture Summary:

- **secp256k1**: Validator identity keys, ECIES encryption
- **BLS12-381**: Key share commitments, polynomial commitments
- **BN254**: ZK proof generation and verification

## Each validator (let's say 7 total):

### 1. Validator A generates polynomial and distributes shares

Validator A generates polynomial $f_a(x) = a_0 + a_1x + a_2x^2 + a_3x^3 + a_4x^4$ and:

- **Computes polynomial commitment**: $F_a(x) = f_a(x) \cdot G_1$
- **Uploads PVSS to contract**: Submits $F_a(x)$ to KeyManagement contract
- **Distributes encrypted shares**:
  - $\text{enc}(f_a(1))$ → encrypted key share for Validator A
  - $\text{enc}(f_a(2))$ → encrypted key share for Validator B
  - $\text{enc}(f_a(3))$ → encrypted key share for Validator C
  - ... and so on for all 7 validators

### 2. Validator B generates polynomial and distributes shares

Validator B generates polynomial $f_b(x) = b_0 + b_1x + b_2x^2 + b_3x^3 + b_4x^4$ and:

- **Computes polynomial commitment**: $F_b(x) = f_b(x) \cdot G_1$
- **Uploads PVSS to contract**: Submits $F_b(x)$ to KeyManagement contract
- **Distributes encrypted shares**:
  - $\text{enc}(f_b(1))$ → encrypted key share for Validator A
  - $\text{enc}(f_b(2))$ → encrypted key share for Validator B
  - ... and so on

### 3. All other validators do the same

## PVSS (Publicly Verifiable Secret Sharing) Explanation

The polynomial commitment $F(x) = f(x) \cdot G_1$ uploaded to the KeyManagement contract serves multiple purposes:

### Polynomial Commitment Structure

For Validator A's polynomial $f_a(x) = a_0 + a_1x + a_2x^2 + a_3x^3 + a_4x^4$, the commitment is:

$$
F_a(x) = f_a(x) \cdot G_1 = (a_0 + a_1x + a_2x^2 + a_3x^3 + a_4x^4) \cdot G_1
$$

This expands to individual coefficient commitments:

$$
F_a(x) = A_0 + A_1 \cdot x + A_2 \cdot x^2 + A_3 \cdot x^3 + A_4 \cdot x^4
$$

Where:
- $A_0 = a_0 \cdot G_1$ (commitment to constant term - **this is the secret share of global secret**)
- $A_1 = a_1 \cdot G_1$ (commitment to linear coefficient)
- $A_2 = a_2 \cdot G_1$ (commitment to quadratic coefficient)
- $A_3 = a_3 \cdot G_1$ (commitment to cubic coefficient)
- $A_4 = a_4 \cdot G_1$ (commitment to quartic coefficient)

### Key Properties

- **Verifiability**: Validator can verify that $\text{enc}(f_a(j))$ decrypts to $F_a(j)$
- **Binding**: Validator cannot change their polynomial after uploading $A_0, A_1, A_2, A_3, A_4$ to contract
- **Global Public Key Computation**: Contract aggregates all constant values: $S = A_0 + \ldots + G_0$
- **Share Validation**: Recipient of $f_a(j)$ verifies that $f_a(j) \cdot G_1 = F_a(j)$

### Contract Storage

The KeyManagement contract stores for each validator:

$$
\text{PVSS}_a = [A_0, A_1, A_2, A_3, A_4] = [a_0 \cdot G_1, a_1 \cdot G_1, a_2 \cdot G_1, a_3 \cdot G_1, a_4 \cdot G_1]
$$

## What Every Validator Must Share

### 1. Encrypted Key Shares

Each validator distributes **n encrypted shares** (one for each validator):

$$
\begin{align}
\text{Validator A shares:} \\
&\text{enc}(f_a(1)) = \text{ECIES\_encrypt}(f_a(1), \text{pubkey}_A) \rightarrow \text{to Validator A} \\
&\text{enc}(f_a(2)) = \text{ECIES\_encrypt}(f_a(2), \text{pubkey}_B) \rightarrow \text{to Validator B} \\
&\text{enc}(f_a(3)) = \text{ECIES\_encrypt}(f_a(3), \text{pubkey}_C) \rightarrow \text{to Validator C} \\
&\ldots \text{(for all n validators)}
\end{align}
$$

### 2. ZK Encryption Proof

Each validator generates **one batch proof** covering all their encryptions:

```go
// From zk_dkg.go:40
innerAssignment, sumHash := circuit.ComputeMultipleKeyShareEncryptionAssignment(
    batch, pubKey, rs, bigRs, fisInts, bigFis, encryptedFis, nonces)
```

**The proof demonstrates:** "I correctly encrypted all n shares using proper ECIES"

## Share Reception and Decryption

Each validator receives **7 shares** (one from each validator):
- Validator A gets: $f_a(1), f_b(1), f_c(1), f_d(1), f_e(1), f_f(1), f_g(1)$
- Validator B gets: $f_a(2), f_b(2), f_c(2), f_d(2), f_e(2), f_f(2), f_g(2)$

**Validator A then:**

### 1. Decrypts each received encrypted share using their private key

### 2. Verifies the ZK proofs that prove each encryption was done correctly

### 3. Share Summation

Once all shares are decrypted and verified, Validator A computes their final secret share:

$$
s_A = f_a(1) + f_b(1) + f_c(1) + f_d(1) + f_e(1) + f_f(1) + f_g(1)
$$

Where:
- $s_A$ = Validator A's final secret share
- Each $f_x(i)$ = The polynomial evaluation from validator x at point i

### 4. Commitment Verification

To verify the aggregation was done correctly, Validator A computes their commitment:

$$
\text{comm}_A = s_A \times G_1
$$

Where:
- $\text{comm}_A$ = Validator A's public commitment to their final share
- $s_A$ = Validator A's final secret share (sum from Step 2)
- $G_1$ = Generator point on the BLS12-381 curve

**This commitment should equal:**

$$
\text{comm}_A = F_a(1) + F_b(1) + F_c(1) + F_d(1) + F_e(1) + F_f(1) + F_g(1)
$$

Where each $F_i(1)$ is the public polynomial commitment from validator i.

## Mathematical Properties

### Linearity of Polynomial Commitments

The DKG protocol relies on the linearity property:

$$
\begin{align}
\text{If } s_A &= f_a(1) + f_b(1) + \ldots + f_g(1) \\
\text{Then } s_A \times G_1 &= f_a(1) \times G_1 + f_b(1) \times G_1 + \ldots + f_g(1) \times G_1 \\
\text{Therefore: } F(1) &= F_a(1) + F_b(1) + \ldots + F_g(1)
\end{align}
$$

### Global Secret Reconstruction

The final global secret is the sum of all polynomial constant terms:

$$
\begin{align}
\text{Global Secret} &= f_a(0) + f_b(0) + f_c(0) + f_d(0) + f_e(0) + f_f(0) + f_g(0) \\
&= a_0 + b_0 + c_0 + d_0 + e_0 + f_0 + g_0
\end{align}
$$

This global secret can be reconstructed using any $2f+1$ validator shares via Lagrange interpolation.

## Security Considerations

### Share Validation

Before summing shares, each validator must verify:

1. **Decryption correctness**: Share decrypts properly with their private key
2. **ZK proof validity**: The encryption proof from the sender is valid
3. **Commitment consistency**: $f_i(j) \times G_1 = F_i(j)$ for received share
4. **Polynomial degree**: Sender's polynomial has correct degree ($\leq t-1$)
