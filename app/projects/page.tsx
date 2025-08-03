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
    title: "Solidity",
    projects: [
      {
        name: "ecc-solidity",
        description: "Solidity implementation of elliptic curve operations, parameterized for curves secp256r1, secp256k1 with tests using Foundry",
        links: [{ text: "link", url: "https://github.com/nullity00/ecc-solidity" }]
      }
    ]
  },
  {
    title: "Resources",
    projects: [
      {
        name: "web3-resources",
        description: "Collection of web3 resources for blockchain enthusiasts. Contains some major alpha on ZKP, Solidity & auditing.",
        links: [{ text: "link", url: "https://github.com/nullity00/web3-resources/" }]
      },
      {
        name: "zk-security-reviews",
        description: "Collection of security reviews of ZK Protocols",
        links: [{ text: "link", url: "https://github.com/nullity00/zk-security-reviews" }]
      }
    ]
  },
  {
    title: "Audit Reports",
    projects: [
      {
        name: "audits",
        description: "All of my audits aggregated in one repository. This includes smart contracts in Solidity, circuits in circom & rust as well.",
        links: [{ text: "link", url: "https://github.com/nullity00/audits" }]
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
    title: "Blockchain",
    projects: [
      {
        name: "Testing-Web3",
        description: "A fun attempt to try out some of the interesting projects in Web3 which include snapshot, lighthouse ..",
        links: [
          { text: "site", url: "https://testing-web3.vercel.app/" },
          { text: "code", url: "https://github.com/nullity00/Testing-Web3" }
        ]
      },
      {
        name: "Trug",
        description: "A decentralized file storage platform which functions quite similar to Google Drive with static URLs and enhanced Web3 features.",
        links: [
          { text: "site", url: "https://trug.vercel.app/" },
          { text: "code", url: "https://github.com/nullity00/Trug" }
        ]
      },
      {
        name: "mintbaseXsupabase",
        description: "The app pulls NFTs as graphdata from the public Mintbase graph, uses Supabase Auth to manage users and Supabase tables for the NFT, Like and Comment data.",
        links: [{ text: "code", url: "https://github.com/nullity00/mintbaseXsupabase" }]
      }
    ]
  },
  {
    title: "Web2",
    projects: [
      {
        name: "landing-page-spect",
        description: "Landing Page for Spect Network",
        links: [
          { text: "site", url: "https://spect.network" },
          { text: "code", url: "https://github.com/nullity00/landing-page-spect" }
        ]
      },
      {
        name: "Travel-Advisor",
        description: "A simple React App which lists all the Hotels, Restaurants & Tourist Attractions in a specified location.",
        links: [{ text: "code", url: "https://github.com/nullity00/Travel-Advisor-" }]
      }
    ]
  }
]

function ProjectCategory({ category }: { category: ProjectCategory }) {
  return (
    <div className="mb-6">
      <h2 className="text-base font-bold mb-3 text-white">{category.title}</h2>
      <div className="grid gap-2 md:grid-cols-2">
        {category.projects.map((project, index) => (
          <div key={index} className="border border-zinc-700 rounded p-2 hover:border-zinc-500 transition-colors">
            <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-1">
              <h3 className="text-sm font-semibold text-white mb-0.5">{project.name}</h3>
              <div className="flex flex-wrap gap-1">
                {project.links.map((link, linkIndex) => (
                  <a
                    key={linkIndex}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white hover:text-zinc-300 underline text-xs"
                  >
                    [{link.text}]
                  </a>
                ))}
              </div>
            </div>
            <p className="text-zinc-300 leading-relaxed text-xs">{project.description}</p>
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
        <h1 className="text-2xl font-bold mb-4">Projects</h1>
        
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