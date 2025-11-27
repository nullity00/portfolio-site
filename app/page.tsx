import { Metadata } from 'next'
import Link from 'next/link'
import Navigation from './components/Navigation'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <Navigation currentPage="/" />

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="md:w-2/3">
            <h1 className="text-3xl font-bold mb-4">Nullity</h1>

            <p className="text-base leading-relaxed mb-3 text-white/50">
              I&apos;m a math graduate with a strong interest in <span className="text-white">applied cryptography</span>, <span className="text-white">zero knowledge proofs</span> & its application in the Ethereum ecosystem.
            </p>

            <p className="text-base leading-relaxed mb-6 text-white/50">
              In previous life, I was a designer, full stack developer (MERN) and blockchain developer.
            </p>

            {/* Audits Section */}
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-3">Audits</h2>
              <div className="space-y-2">
                <div className="text-base text-white/50">WORM | Solidity</div>
                <a
                  href="https://github.com/nullity00/audits/blob/main/2025-07-Neo-zk-dkg.md"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-base text-white/50 hover:text-white transition-colors"
                >
                  Neo X ZK-DKG | Rust, Gnark
                </a>
                <a
                  href="https://github.com/nullity00/audits/blob/main/2025-04-Mina-Attestations.md"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-base text-white/50 hover:text-white transition-colors"
                >
                  Mina Attestations | TypeScript, o1js
                </a>
                <Link
                  href="/career"
                  className="inline-block text-zinc-400 hover:text-white transition-colors text-base mt-2"
                >
                  View More →
                </Link>
              </div>
            </div>

            {/* Blogs Section */}
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-3">Blogs</h2>
              <div className="space-y-2">
                <Link
                  href="/blog/fiat-shamir-pitfalls"
                  className="block text-base text-white/50 hover:text-white transition-colors"
                >
                  Fiat-Shamir Pitfalls
                </Link>
                <Link
                  href="/blog/change-circom-prime-field"
                  className="block text-base text-white/50 hover:text-white transition-colors"
                >
                  Changing Circom Prime Field
                </Link>
                <Link
                  href="/blog"
                  className="inline-block text-zinc-400 hover:text-white transition-colors text-base mt-2"
                >
                  View More →
                </Link>
              </div>
            </div>

            {/* Projects Section */}
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-3">Projects</h2>
              <div className="space-y-2">
                <a
                  href="https://github.com/nullity00/batch-ecdsa-secp256r1"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-base text-white/50 hover:text-white transition-colors"
                >
                  batch-ecdsa-secp256r1
                </a>
                <a
                  href="https://github.com/nullity00/circom-circuits"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-base text-white/50 hover:text-white transition-colors"
                >
                  circom-circuits
                </a>
                <a
                  href="https://github.com/nullity00/huff-puzzles"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-base text-white/50 hover:text-white transition-colors"
                >
                  huff-puzzles
                </a>
                <Link
                  href="/projects"
                  className="inline-block text-zinc-400 hover:text-white transition-colors text-base mt-2"
                >
                  View More →
                </Link>
              </div>
            </div>
          </div>
          
          <div className="md:w-1/3">
            <div className="rounded p-3 mb-6">
              <div className="w-full rounded mb-2 overflow-hidden">
                <img
                  src="/1.jpg"
                  alt="Nullity Profile"
                  className="w-full h-auto object-cover"
                />
              </div>
              <p className="text-sm text-zinc-400 text-center">
                <em>Nah, that&apos;s not me</em>
              </p>
            </div>

            {/* Previously Section */}
            <div className="rounded p-3">
              <h2 className="text-xl font-semibold mb-3">Previously</h2>
              <div className="flex flex-wrap gap-4 items-center justify-center mb-4">
                <img
                  src="/hacken.png"
                  alt="Hacken"
                  className="h-8 w-auto grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all duration-300"
                />
                <img
                  src="/yaudit.svg"
                  alt="yAudit"
                  className="h-8 w-auto grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all duration-300"
                />
                <img
                  src="/ef.svg"
                  alt="Ethereum Foundation"
                  className="h-8 w-auto grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all duration-300"
                />
                <img
                  src="/spect.svg"
                  alt="Spect"
                  className="h-8 w-auto grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all duration-300"
                />
                <img
                  src="/fa.jpeg"
                  alt="Flawed Arts"
                  className="h-8 w-auto grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all duration-300 rounded"
                />
              </div>

              <div className="space-y-2 text-center">
                <h3 className="text-base font-semibold">Creator of</h3>
                <a
                  href="https://zkglitch.xyz"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-base text-white/50 hover:text-white transition-colors"
                >
                  zkglitch.xyz
                </a>
                <a
                  href="https://nullity00.notion.site/Justin-Thaler-Proofs-Args-0cd79d9f70c34c26a12f37243a3092cb"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-base text-white/50 hover:text-white transition-colors"
                >
                  Proofs & Args Notes
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export const metadata: Metadata = {
  title: 'Nullity - ZK Security Researcher',
  description: 'Math graduate specializing in applied cryptography, zero knowledge proofs, and ZK circuit development at yAcademyDAO',
  keywords: [
    'applied cryptography',
    'zero knowledge proofs',
    'ZK circuits',
    'Circom',
    'Noir',
    'Halo2',
    'Plonky2',
    'yAcademyDAO',
    'math graduate',
    'Ethereum Foundation'
  ].join(', '),
}