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
    role: "Core",
    period: "Sept - Present",
    links: [{ text: "site", url: "https://yaudit.dev/" }],
    details: "...",
    accomplishments: []
  },
  {
    company: "yAudit",
    role: "Mentor (zBlock2)",
    period: "Jan 2024 - May 2024",
    links: [
      { text: "site", url: "https://yaudit.dev/zBlock2" },
      { text: "zBlock1", url: "https://yaudit.dev/zBlock1" }
    ],
    details: "The second zero-knowledge auditing fellowship centered around the PSE-Halo2 development framework and the KZG commitment scheme.",
    accomplishments: [
      "Mentored fellows in auditing the Summa Protocol, a blockchain-based solution for providing proof of solvency for financial entities."
    ]
  },
  {
    company: "Ethereum Foundation",
    role: "Grantee (P256 Project)",
    period: "Oct 2023",
    links: [
      { text: "site", url: "https://ethereum.org/en/community/grants/" },
      { text: "code", url: "https://github.com/nullity00/batch-ecdsa-secp256r1" }
    ],
    details: "Research & development grant for Batch ECDSA Signatures using P256 curve to facilitate verification of signatures from Secure Enclave. Funded by PolygonDAO, GR14 & Push Protocol.",
    accomplishments: [
      "Developed circuits using circom & Nova library for signature folding",
      "Created batch verification circuit using randomizers"
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
    details: "5-week program for zk auditors to audit circom codebases.",
    accomplishments: [
      "Awarded Top Fellow Award for zBlock1 cohort",
      "Audited Rate Limiting Nullifier (PSE) & Spartan ECDSA (Personae Labs)",
      "Explored formal verification tools: Picus & Ecne",
      "Tutored peers on ZK theory & Circom"
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
    details: "Web3 forms, projects & automations for DAOs. Funded by PolygonDAO, GR14 & Push Protocol.",
    accomplishments: [
      "Built frontend using React.js & Next.js",
      "Integrated Soulbound Tokens into Spect Profiles",
      "Developed GitHub bot using GitHub API & webhooks",
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
    details: "Indian Graphic design and Digital Marketing company.",
    accomplishments: [
      "Designed & developed client applications using Wordpress, Elementor, Figma, JS frameworks & Django",
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
        
        <div className="space-y-4">
          {careerData.map((item, index) => (
            <div key={index} className="relative">

              <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-1">
                <div className="flex-1">
                  <h2 className="text-lg font-bold mb-0.5">{item.company}</h2>
                  <p className="text-base text-white/50 mb-0.5">{item.role}</p>
                </div>

                <div className="md:text-right mt-1 md:mt-0">
                  <p className="text-sm text-white/50 mb-1">{item.period}</p>
                  <div className="flex flex-wrap gap-1 md:justify-end">
                    {item.links.map((link, linkIndex) => (
                      <a
                        key={linkIndex}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-white/50 hover:text-white underline text-sm"
                      >
                        [{link.text}]
                      </a>
                    ))}
                  </div>
                </div>
              </div>

              <div className="leading-relaxed">
                <p className="mb-1 text-sm text-white/50">{item.details}</p>

                {item.accomplishments.length > 0 && (
                  <>
                    <h3 className="text-sm font-semibold mb-1">Accomplishments</h3>
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