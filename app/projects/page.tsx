import { Metadata } from 'next'
import Navigation from '../components/Navigation'

interface Project {
  name: string
  description: string
  links: { text: string; url: string }[]
}

interface ProjectCategory {
  title: string
  projects: Project[]
}

interface AuditReport {
  date: string
  project: string
  target: string
  framework: string
  reportType: string
  links: { label: string; url: string }[]
}

const auditReports: AuditReport[] = [
  {
    date: "July 2025",
    project: "Neo X ZK-DKG",
    target: "L1 Neo X zk-dkg functionality",
    framework: "Rust, Gnark, Cryptography",
    reportType: "Individual",
    links: [
      { label: "Internal Report", url: "https://github.com/nullity00/audits/blob/main/2025-07-Neo-zk-dkg.md" },
      { label: "Hacken Report", url: "https://hacken.io/audits/neo-x/l1-neo-x-zk-dkg-functionality-jun2025/" }
    ]
  },
  {
    date: "April 2025",
    project: "Mina Attestations",
    target: "o1js circuits, credential verification",
    framework: "TypeScript, o1js, ZK Circuits",
    reportType: "Collaborative",
    links: [
      { label: "Internal Report", url: "https://github.com/nullity00/audits/blob/main/2025-04-Mina-Attestations.md" },
      { label: "Hacken Report", url: "https://hacken.io/audits/mina/dapp-mina-mina-attestations-jan2025/" }
    ]
  },
  {
    date: "February 2025",
    project: "Sig Network",
    target: "Chain signatures cryptography",
    framework: "Solidity, Cryptography",
    reportType: "Collaborative",
    links: [
      { label: "Internal Report", url: "https://github.com/nullity00/audits/blob/main/2025-02-Signetwork.md" },
      { label: "Hacken Report", url: "https://hacken.io/audits/sig-network/sca-sig-network-chain-signatures-jan2025/" }
    ]
  },
  {
    date: "May 2024",
    project: "Summa Solvency A",
    target: "Halo2 codebase, solvency proofs",
    framework: "Rust, Halo2, ZK Circuits",
    reportType: "Mentorship",
    links: [
      { label: "yAudit Report A", url: "https://reports.yaudit.dev/2024-05-Summa-Va" }
    ]
  },
  {
    date: "May 2024",
    project: "Summa Solvency B",
    target: "Halo2 codebase, solvency proofs",
    framework: "Rust, Halo2, ZK Circuits",
    reportType: "Mentorship",
    links: [
      { label: "yAudit Report B", url: "https://reports.yaudit.dev/2024-05-Summa-Vb" }
    ]
  },
  {
    date: "June 2023",
    project: "Spartan ECDSA",
    target: "ECDSA verification in ZK",
    framework: "Circom, ZK Circuits",
    reportType: "Group Audit",
    links: [
      { label: "Internal Report", url: "https://github.com/nullity00/audits/blob/main/2023-06-Spartan-ecdsa.md" },
      { label: "yAudit Report", url: "https://reports.yaudit.dev/2023-06-Spartan-ECDSA" }
    ]
  },
  {
    date: "June 2023",
    project: "Rate Limiting Nullifier (RLN)",
    target: "Spam prevention, anonymity",
    framework: "Circom, ZK Circuits",
    reportType: "Group Audit",
    links: [
      { label: "Internal Report", url: "https://github.com/nullity00/audits/blob/main/2023-06-RLN.md" },
      { label: "yAudit Report", url: "https://reports.yaudit.dev/2023-06-RLN" }
    ]
  }
]

const projectCategories: ProjectCategory[] = [
  {
    title: "ZK",
    projects: [
      {
        name: "batch-ecdsa-secp256r1",
        description: "Developed circuits for batch verification of ECDSA Signatures using Randomizers for the P-256 curve",
        links: [{ text: "link", url: "https://github.com/nullity00/batch-ecdsa-secp256r1" }]
      },
      {
        name: "circom-circuits",
        description: "Developed a library for bit manipulation, floating point operations, operations with multiple operands in circom.",
        links: [{ text: "link", url: "https://github.com/nullity00/circom-circuits" }]
      },
      {
        name: "maci-noir",
        description: "Rewriting PSE's MACI (Minimal Anti Collusion Infrastructure) circuits in Noir",
        links: [{ text: "link", url: "https://github.com/nullity00/maci-noir" }]
      },
      {
        name: "plonkathon",
        description: "Implementation of PLONK prover in python with detailed explanation",
        links: [{ text: "link", url: "https://github.com/nullity00/plonkathon" }]
      }
    ]
  },
  {
    title: "CTFs / Puzzles",
    projects: [
      {
        name: "zkp-mooc-berkeley",
        description: "Solutions to the circom exercises prepped by UC Berkeley RDI for the ZKP MOOC 2023",
        links: [{ text: "link", url: "https://github.com/nullity00/zkp-mooc-berkeley" }]
      },
      {
        name: "ZKBootcamp",
        description: "Solutions to cairo exercises prepped during Encode ZK Bootcamp by mentors from EntropyIO",
        links: [{ text: "link", url: "https://github.com/nullity00/ZeroKnowledgeBootcamp" }]
      },
      {
        name: "huff-puzzles",
        description: "Solutions to huff exercises created for Rareskill's Advanced Solidity Bootcamp",
        links: [{ text: "link", url: "https://github.com/nullity00/huff-puzzles" }]
      },
      {
        name: "zk-puzzles",
        description: "Solutions to the circom exercises prepped by Rareskills. Constraint checks added for the exercises in the main branch.",
        links: [{ text: "link", url: "https://github.com/nullity00/zero-knowledge-puzzles" }]
      }
    ]
  },
  {
    title: "Resources",
    projects: [
      {
        name: "zk-security-reviews",
        description: "Collection of security reviews of ZK Protocols",
        links: [{ text: "link", url: "https://github.com/nullity00/zk-security-reviews" }]
      }
    ]
  },
  {
    title: "Blockchain",
    projects: [
      {
        name: "mintbaseXsupabase",
        description: "The app pulls NFTs as graphdata from the public Mintbase graph, uses Supabase Auth to manage users and Supabase tables for the NFT, Like and Comment data.",
        links: [{ text: "code", url: "https://github.com/nullity00/mintbaseXsupabase" }]
      }
    ]
  }
]

function ProjectCategory({ category }: { category: ProjectCategory }) {
  return (
    <div className="mb-6">
      <h2 className="text-base font-bold mb-3">{category.title}</h2>
      <div className="grid gap-2 md:grid-cols-2">
        {category.projects.map((project, index) => (
          <div key={index} className="border border-zinc-700 rounded p-2 hover:border-zinc-500 transition-colors">
            <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-1">
              <h3 className="text-sm font-semibold mb-0.5">{project.name}</h3>
              <div className="flex flex-wrap gap-1">
                {project.links.map((link, linkIndex) => (
                  <span key={linkIndex} className="text-white/50 text-xs">
                    [<a
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:opacity-80 underline"
                      style={{ color: '#7900FF' }}
                    >
                      {link.text}
                    </a>]
                  </span>
                ))}
              </div>
            </div>
            <p className="text-white/50 leading-relaxed text-xs">{project.description}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function ProjectsPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <Navigation currentPage="/projects" />

      <div className="max-w-4xl mx-auto px-4 py-4">

        {/* Audits Section */}
        <div className="mb-8">
          <h2 className="text-md font-bold mb-3">Audits</h2>
          <p className="text-sm text-white/50 mb-4">
            All of my audits aggregated in one repository. This includes smart contracts in Solidity, circuits in circom & rust as well.{' '}
            <span className="text-white/50">
              [<a
                href="https://github.com/nullity00/audits"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:opacity-80 underline"
                style={{ color: '#7900FF' }}
              >
                repo
              </a>]
            </span>
          </p>

          {/* Audit Reports Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-xs border-collapse">
              <thead>
                <tr className="border-b border-zinc-700">
                  <th className="text-left py-2 px-2 font-semibold text-white/70">Date</th>
                  <th className="text-left py-2 px-2 font-semibold text-white/70">Project</th>
                  <th className="text-left py-2 px-2 font-semibold text-white/70">Target</th>
                  <th className="text-left py-2 px-2 font-semibold text-white/70">Framework/Language</th>
                  <th className="text-left py-2 px-2 font-semibold text-white/70">Report Type</th>
                  <th className="text-left py-2 px-2 font-semibold text-white/70">Links</th>
                </tr>
              </thead>
              <tbody>
                {auditReports.map((audit, index) => (
                  <tr key={index} className="border-b border-zinc-800 hover:bg-zinc-900/30">
                    <td className="py-2 px-2 text-white/50 font-semibold">{audit.date}</td>
                    <td className="py-2 px-2 text-white/50">{audit.project}</td>
                    <td className="py-2 px-2 text-white/50">{audit.target}</td>
                    <td className="py-2 px-2 text-white/50">{audit.framework}</td>
                    <td className="py-2 px-2 text-white/50">{audit.reportType}</td>
                    <td className="py-2 px-2">
                      <div className="flex flex-wrap gap-1">
                        {audit.links.map((link, linkIndex) => (
                          <span key={linkIndex} className="text-white/50">
                            [<a
                              href={link.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="hover:opacity-80 underline"
                              style={{ color: '#7900FF' }}
                            >
                              {link.label}
                            </a>]
                          </span>
                        ))}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Projects Section */}
        <div className="mb-4">
          <h2 className="text-lg font-bold mb-3">Projects</h2>
        </div>

        <div className="space-y-6">
          {projectCategories.map((category, index) => (
            <ProjectCategory key={index} category={category} />
          ))}
        </div>
      </div>
    </div>
  )
}

export const metadata: Metadata = {
  title: 'Projects - Nullity',
  description: 'Portfolio of ZK projects, Solidity implementations, audit reports, and blockchain applications',
  keywords: [
    'projects',
    'ZK circuits',
    'Solidity',
    'blockchain',
    'audit reports',
    'cryptography',
    'PLONK',
    'circom',
    'Noir'
  ].join(', '),
}
