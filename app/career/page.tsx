import { Metadata } from 'next'
import Navigation from '../components/Navigation'

interface CareerItem {
  company: string
  role: string
  period: string
  links: { text: string; url: string }[]
  details: string
  accomplishments: string[]
}

const careerData: CareerItem[] = [
  {
    company: "yAudit",
    role: "Core, ZK Resident Auditor",
    period: "Oct 2023 - Sept 2025",
    links: [{ text: "site", url: "https://yaudit.dev/" }],
    details: "",
    accomplishments: [
      "Audited ZK Protocols and Circuits as a resident auditor",
      "Led rebranding initiatives of yAcademy and yAudit to Electisec (Jan 2025) and back to yAudit (Nov 2025), designed and maintained website, reports, blogs, and research site",
      "Initiated strategy and future directions to grow the DAO, managed client payments and payouts, designed anonymous voting mechanism for DAO proposals",
      "Organized regular resident catchup calls for research and blog posts, maintained website infrastructure (uptime, domain, patches)"
    ]
  },
  {
    company: "Hacken",
    role: "Contractor - ZK Security Engineer",
    period: "Feb 2025 - July 2025",
    links: [{ text: "site", url: "https://hacken.io/" }],
    details: "",
    accomplishments: [
      "Conducted 3 audits: Mina Attestations, Neo X zk-dkg, Sig Network",
      "Assisted in establishing 'Cryptography Audits' as a service offering"
    ]
  },
  {
    company: "yAudit",
    role: "Mentor (zBlock2)",
    period: "Jan 2024 - May 2024",
    links: [
      { text: "site", url: "https://yaudit.dev/zBlock2" }
    ],
    details: "",
    accomplishments: [
      "Mentored fellows on PSE-Halo2 framework and KZG commitment scheme, focusing on Polyexen & Halo2-analyzer tooling",
      "Organized bounties & supervised fellows on Verifier Validator Registry and Mock Prover cell override feature in PSE's Halo2 fork"
    ]
  },
  {
    company: "Ethereum Foundation",
    role: "Grantee (P256 Project)",
    period: "Oct 2023",
    links: [
      { text: "code", url: "https://github.com/nullity00/batch-ecdsa-secp256r1" }
    ],
    details: "",
    accomplishments: [
      "R&D grant for Batch ECDSA Signatures using P256 curve to facilitate verification of signatures from Secure Enclave",
      "Developed circuits using circom & Nova library for signature folding and batch verification using randomizers"
    ]
  },
  {
    company: "yAudit",
    role: "ZK Auditing Fellow (zBlock1)",
    period: "May 2023 - June 2023",
    links: [
      { text: "site", url: "https://yaudit.dev/" },
      { text: "reports", url: "https://github.com/nullity00/audits" }
    ],
    details: "",
    accomplishments: [
      "Awarded Top Fellow Award for zBlock1 cohort in 5-week program for auditing circom codebases",
      "Found a high vulnerability in Spartan ECDSA which led to constraint count reduction, audited Rate Limiting Nullifier (PSE)",
      "Explored formal verification tools (Picus & Ecne) and tutored peers on ZK theory & Circom"
    ]
  },
  {
    company: "Spect",
    role: "Blockchain Developer",
    period: "June 2022 - Feb 2023",
    links: [
      { text: "site", url: "https://spect.network" },
      { text: "code", url: "https://github.com/spect-ai" }
    ],
    details: "",
    accomplishments: [
      "Built Web3 forms, projects & automations for DAOs using React.js, Next.js (funded by PolygonDAO, GR14 & Push Protocol)",
      "Integrated Soulbound Tokens into Spect Profiles and developed GitHub bot using API & webhooks",
      "Created CQRS endpoints with Nest.js, Mongoose, MongoDB"
    ]
  },
  {
    company: "Flawed Arts",
    role: "Web Developer",
    period: "Oct 2020 - Mar 2022",
    links: [
      { text: "site", url: "https://www.linkedin.com/company/flawed-arts/" },
      { text: "portfolio", url: "https://www.instagram.com/flawed.arts_/" }
    ],
    details: "",
    accomplishments: [
      "Designed & developed client applications for graphic design and digital marketing company using Wordpress, Elementor, Figma, JS frameworks & Django",
      "Built POS applications using React.js, MongoDB & AWS S3"
    ]
  },
  {
    company: "Freelance",
    role: "Graphic Designer",
    period: "Nov 2019 - Aug 2020",
    links: [{ text: "portfolio", url: "https://www.behance.net/nullity00" }],
    details: "Designed logos, posters, banners using Adobe Illustrator, Photoshop, XD, Figma & Blender.",
    accomplishments: []
  }
]

export default function CareerPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <Navigation currentPage="/career" />

      <div className="max-w-4xl mx-auto px-4 py-4">
        <h1 className="text-2xl font-bold mb-4">Career</h1>
        
        <div className="space-y-8">
          {careerData.map((item, index) => (
            <div key={index} className="relative">

              <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-1">
                <div className="flex-1">
                  <h2 className="text-lg font-bold mb-0.5">{item.company}</h2>
                  <p className="text-base text-white/70 mb-0.5">{item.role}</p>
                </div>

                <div className="md:text-right mt-1 md:mt-0">
                  <p className="text-sm text-white/50 mb-1">{item.period}</p>
                  <div className="flex flex-wrap gap-1 md:justify-end">
                    {item.links.map((link, linkIndex) => (
                      <span key={linkIndex} className="text-white/50 text-sm">
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
              </div>

              <div className="leading-relaxed">
                <p className="mb-1 text-sm text-white/50">{item.details}</p>

                {item.accomplishments.length > 0 && (
                  <>
                    <h3 className="text-sm font-semibold mb-1 text-white/70">Accomplishments</h3>
                    <ul className="list-disc list-inside space-y-0.5 text-white/50 text-sm">
                      {item.accomplishments.map((accomplishment, accIndex) => (
                        <li key={accIndex}>{accomplishment}</li>
                      ))}
                    </ul>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export const metadata: Metadata = {
  title: 'Career - Nullity',
  description: 'Professional experience in ZK research, blockchain development, and cryptography',
  keywords: [
    'career',
    'experience',
    'yAcademyDAO',
    'Ethereum Foundation',
    'ZK auditing',
    'blockchain developer',
    'cryptography'
  ].join(', '),
}