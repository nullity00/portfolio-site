---
title: "Change circom's prime Field"
slug: "change-circom-prime-field"
category: "blog"
description: "Guide on how to change the prime field in circom to support different elliptic curves"
---

# Change circom's prime Field

Circom operates over the prime field of `p = 21888242871839275222246405745257275088548364400416034343698204186575808495617` which is the Field Modulus of `BN254` curve. This might be because of the existing support for `BN254` curves in the Ethereum ecosystem like precompiles (add, mul, pairing), powers of tau parameters & so on. 

Circom supports these curves as of now : `bn128`, `bls12381`, `goldilocks`, `grumpkin`, `pallas`, `vesta` . Refer [here](https://github.com/iden3/circom/blob/master/mkdocs/docs/getting-started/compilation-options.md)

## Steps to change the prime field

To add your choice of curve & tweak the prime field of circom, follow the given steps :

1. Fork the repository - `https://github.com/iden3/circom`
2. In `circom/src/input_user.rs`, add your curve in the `prime_value` field
3. In `code_producers/src/c_elements/c_code_generator.rs`, include your curve to generate the cpp, hpp, asm files
4. In `code_producers/src/wasm_elements/wasm_code_generator.rs`, include your curve to generate the wat files
5. In `program_structure/src/utils/constants.rs`, add your curve's prime field as a constant 
6. Clone this repository - `https://github.com/iden3/ffwasm` & install the dependencies by running `npm i`
7. Run `node tools/build.js -q <your_prime> -n Fr` inside the `ffwasm` folder to generate `fr.wasm` & `fr.wat` files
8. From the `fr.wat` file, carefully parse the `type`, `data` & `code` into `fr-types.wat`, `fr-data.wat` & `fr-code.wat` under `code_producers/src/wasm_elements/<your_curve>`. Refer to this [commit](https://github.com/nullity00/circom-secp256r1/commit/eea89dbc926cdaf51423f7ab5e72becf00453d95)
9. In the `fr-code.wat`, search for `$Fr_F1m_isZero`, if it exists, replace it with `$Fr_int_isZero`. Refer to this [commit](https://github.com/nullity00/circom-secp256r1/commit/3ea7e873470f4247893df3564341b177cd68df21). Not doing this change will lead to this error when you compile your circuits :
```
error[W01]: Error translating the circuit from wat to wasm.
Exception encountered when encoding WASM: failed to find func named `$Fr_F1m_isZero` at byte offset 164466
previous errors were found
```
10. This is enough for you to compile your circuits with your choice of curve. Further more, to produce C code for your circuits, you might have to generate `cpp`, `hpp`, `asm` files using the steps mentioned in `https://github.com/iden3/ffiasm`

## Caveats

1. This might not work well with `snarkjs` 

## Implementations

A few implementations to refer to :

1. [circom-secq256r1](https://github.com/nullity00/circom-secp256r1) - Adds prime for secq256r1
2. [circom-secq](https://github.com/DanTehrani/circom-secq) - Adds prime for secq256k1
3. [PR - Pallas, Vesta, Grumpkin](https://github.com/iden3/circom/pull/179) - Adds prime for Pasta curves & Grumpkin