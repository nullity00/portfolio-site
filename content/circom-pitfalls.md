5 Circom Security Pitfalls That Can Break Your Proofs

Circom in 60 Seconds
Circom (short for Circuit Compiler) is a programming language used for creating zero-knowledge proofs (zk-SNARKs) circuits.

A circuit defines a mathematical computation, where constraints dictate valid inputs and outputs. Understanding these constraints is crucial for writing secure circuits.

Prover: Knows the full witness (private and public inputs) and generates a valid proof.
Verifier: Sees only the public inputs and proof, ensuring correctness without learning private values.
Common Circom Pitfalls (and Solutions)
1. Misunderstanding Assignments vs. Constraints
A frequent misconception is differentiating between signal assignments and constraints. In Circom, <-- and --> operators assign signals, crucial for witness generation. On the other hand, === operator sets constraints. For example, x === y enforces the circuit to accept only inputs where x equals y.

Circom also provides two additional operators, namely <==, ==>, to perform both assignment and constraint generation simultaneously. But there is one key complication: the operands of === must obey certain restrictions (e.g., involving only quadratic expressions) in order to facilitate the generation of a Rank-1 constraint system.

template Cube () {
    signal input a;
    signal output c;
    
    var temp = a * a * a ;
    signal temp2 <-- temp;
    c <== temp2;
}
In this template, the var temp is assigned to temp2 but not constrained. A malicious prover can set the value of temp2 to anything and generate a fake proof. This is because the verifier only evaluates the constraints and not the assignments.

Circom signals have to be of the form a * x + b, thus we construct the solution this way:

template Cube () {

    signal input a;

    signal output c;

    signal temp <== a * a ;

    signal c <== temp * a;

}
2. Broken Circuit Dependence Graph
A Circuit Dependency Graph (CDG) visually represents how values flow through a circuit. For example - a dotted line connecting two signals represents assignment and a solid line represents a constraint. This is done manually when evaluating a circuit to have a clear picture of the circuit. If the CDG has gaps, some signals may remain unconstrained, allowing malicious manipulation.

A prevalent mistake is not structuring a clear Circuit Dependence Graph (CDG) during template development. Let’s take this code for example:

signal total_bits <== 256 * length;

signal n <-- (total_bits + 576) \\ 512;

signal rem <-- (total_bits + 576) % 512;

n * 512 + rem === total_bits + 576;
The functionality of this code is to take a non zero integer length and calculate n which is the number of 512-bit blocks it would generate. Since integer division operator \\ produces a non quadratic constraint we introduce the signal rem and try to constrain it by introducing the equation quotient * divisor + remainder === divident

The Circuit Dependence Graph is as follows:


Here the value n * 512 + rem is constrained to total_bits + 576 but the individual values of n and rem still remain un constrained. Hence, the circuit dependence graph is broken. Drawing a CDG helps find out the blind spots and vulnerabilities as in this case a malicious prover can set rem to total_bits + 576 and n to 0, and generate fake proofs.

The solution is to constrain the individual values of n and rem as shown below:

signal total_bits <== 256 * length;

signal n <-- (total_bits + 576) \\ 512;

signal rem <-- (total_bits + 576) % 512;

// Range Check for n

component lessthan = LessThan(4);

lessthan.in[0] <== 0;

lessthan.in[1] <== n;

component greaterthan = LessThan(4);

greaterthan.in[0] <== n;

greaterthan.in[1] <== 7;

// Range Check for rem

component lessthan512 = LessThan(10);

lessthan512.in[0] <== rem;

lessthan512.in[1] <== 512;

n * 512 + rem === total_bits + 576;
In the original CDG:

n and rem had only assignments, no constraints.
The constraint n * 512 + rem === total_bits + 576 connects a combined expression, but not the individual signals.

After the fix:

n and rem now have direct constraints (via LessThan).
The CDG becomes closed and complete, eliminating unconstrained paths.
This prevents arbitrary values for n and rem, securing the circuit's logic.
3. Missing essential logic constraints
Missing essential constraints makes it possible for proof creators to deviate from intended rules. This can occur due to various vulnerabilities or missing logic constraints. It's critical to ensure all signals are appropriately constrained.

One of the bugs found in Unirep’s security review was that of an underconstrained circuit as shown in the code below.

template BigLessThan() {

...

component bits[2];

for (var x = 0; x < 2; x++) {

bits[x] = Num2Bits(254);

bits[x].in <== in[x];

}

  ...

}
Circom has a scalar field of p = 21888242871839275222246405745257275088548364400416034343698204186575808495617 which is around 2253.59669 i.e. less than 254 bits. The maximum value for a circom signal is p - 1 and any value greater than p would be represented as the_value mod p. For example, 0 can be expressed either as 0 or as p since converting p from a bit array back to a signal will result in 0 due to an overflow. As a result, it is unsafe to use Num2Bits(254) as it is technically unconstrained.

Another subset of bugs as a result of missing essential logic constraints leads to Non-deteministic circuits. Nondeterminism, in this case, means that there are multiple ways to create a valid proof for a certain outcome. A common source of non-determinism is due to signals that are unconstrained, meaning that the signal is not even mentioned in the generated Rank-1 constraint system. If such an unconstrained signal corresponds to an output, this is guaranteed to be a bug. An example of a non deterministic circuit is given below:

template ArrayOR(n) {

signal input a[n];

signal input b[n];

signal output out[n];

for (var i = 0; i < n; i++) {

out[i] <-- a[i] | b[i];

}

}

component main = ArrayXOR(2);
Here, the above circuit ArrayOR produces no constraints. This can be fixed by using an OR gate this way.

template ArrayOR(n) {

signal input a[n];

signal input b[n];

signal output out[n];

for (var i = 0; i < n; i++) {

out[i] <== a[i] + b[i] - a[i] * b[i];

}

}

component main = ArrayOR(2);
4. Unsafe component and signal usage
Using a component without applying constraints to its inputs or outputs can lead to serious security vulnerabilities. For instance, in the example below, the component hash_component is instantiated with its input directly connected to the signal msg, without any constraint or validation. This allows arbitrary values to be accepted as input.

template Hashmsg(){

signal input msg;

signal output hash;

component hash_component = Hash();

hash_component.in <-- msg;

hash <== hash_component.out;

}
In this case, the input to hash_component is not constrained in any way, making it susceptible to misuse. An attacker could exploit this by providing any msg value, potentially bypassing the intended logic or proof assumptions. Simply wiring signals without applying constraints does not guarantee that the circuit enforces any correctness conditions.

Another subset of Unsafe signal usage is Unused Public Inputs. These public inputs without any constraints can act as key information when verifying the proof. In Circom 2.0, the default R1CS compilation uses an optimizer. ( Rank-1 Constraint System (R1CS) is a mathematical framework used to represent arithmetic circuits as a set of constraints for zero-knowledge proofs). The optimizer will optimize these public inputs out of the circuit if they are not involved in any constraints, potentially compromising verification. Adding a non-linear constraint involving the public input can mitigate this issue.

component Example() {

signal input a;

signal input b;

signal input c;

signal output out;

out <== a + b;

}

component main { public [c] } = Example();
In the example above, c will be optimized out. When submitting a proof to a verifier contract, any value for c will succeed on an existing proof. To prevent this over optimization, one can add a non-linear constraint such as signal c_square <== c * c; that involves the public input.

5. Overlooking Edge cases
In Circomlib’s Security Review by Veridise, there was one very common bug reported several times. When performing division in circom, it is important we check for the denominator or the divisor to be non zero. Here’s an example :

template Montgomery2Edwards() {

signal input in[2];

signal output out[2];

out[0] <-- in[0] / in[1];

out[1] <-- (in[0] - 1) / (in[0] + 1);

out[0] * in[1] === in[0];

out[1] * (in[0] + 1) === in[0] - 1;

}
You might have noticed the use of \ and / symbols for division and wondered about the difference. The / operator performs modular division (i.e., multiplication by the modular inverse in the prime field), while the \ operator computes the integer division quotient and then returns the result as a field element modulo p.

In the above circuit, there’s no constraint to check if 1 + in[0] ≠ 0 and in[1] ≠ 0 . When 1 + in[0] or in[1] is set to 0, their corresponding multipliers in the same terms, namely out[1] and out[0] become underconstrained. Attackers can construct an exploit to bypass the restrictions on circuit outputs. This was fixed by adding a constraint to check if the divisor is non zero using the IsZero() template.

Here’s another edge case from Electisec’s review of Spartan Ecdsa:

In the Secp256k1AddComplete() circuit of Spartan ECDSA, an edge case arises when adding two distinct points P and Q such that xP ≠ xQ but yP + yQ = 1.

Here :

xP , yP - x and y coordinates of point P

xQ , yQ - x and y coordinates of point Q

P and Q represent valid points on the secp256k1 elliptic curve.

In this scenario, the circuit incorrectly identifies the points as equal and returns the point at infinity (the identity element in elliptic curve groups represented by (0,0)) instead of their correct sum. This happens because the current implementation checks only for x-coordinate equality using:

component isXEqual = IsEqual();

isXEqual.in[0] <== xP;

isXEqual.in[1] <== xQ;

component zeroizeA = IsEqual();

zeroizeA.in[0] <== isXEqual.out;

zeroizeA.in[1] <== 1;
This logic falsely triggers when xP ≠ xQ but yP + yQ = 1, which is a rare but valid case where the points are not equal yet their y-values sum to 1. To fix this, the circuit should also compare the y-coordinates and ensure both x and y match before treating the inputs as equal points. The corrected logic introduces a isYEqual component and combines both checks using an AND() gate:

component isYEqual = IsEqual();

isYEqual.in[0] <== yP;

isYEqual.in[1] <== yQ;

component zeroizeA = AND();

zeroizeA.in[0] <== isXEqual.out;

zeroizeA.in[1] <== isYEqual.out;
This ensures zeroizeA.out becomes 1 only when both coordinates are equal, properly signaling a point doubling operation. Other special cases involving zero points, points at infinity, or inverses like P + (-P).

Summary
Circom empowers developers to build powerful zero-knowledge applications, but the responsibility of enforcing secure and deterministic computations lies heavily on the developer.

As seen from the five pitfalls above - misunderstanding constraints, ignoring dependency graphs, leaving logic incomplete, improperly wiring components, and missing edge cases - any oversight can break the validity of a circuit or even introduce exploits.

One unconstrained signal can break everything. ​​

Careful constraint design, regular auditing, visual tools like CDGs, and thorough testing (including edge cases) are essential.

Resources
Here are some of the resources focused on Circom Security :

Practical Security Analysis of Zero-Knowledge Proof Circuits - https://eprint.iacr.org/2023/190.pdf
Certifying Zero-Knowledge Circuits with Refinement Types - https://eprint.iacr.org/2023/547.pdf
Automated Detection of Under-Constrained Circuits in Zero-Knowledge Proofs - https://dl.acm.org/doi/pdf/10.1145/3591282
ZK bug Tracker by 0xPARC - https://github.com/0xPARC/zk-bug-tracker
ZK Security Reports - https://github.com/nullity00/zk-security-reviews
Here are some of the tools used to debug circom circuits :

Picus - https://github.com/Veridise/Picus
circomspect - https://github.com/trailofbits/circomspect