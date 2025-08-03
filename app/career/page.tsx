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
    company: "YAcademyDAO",
    role: "Core",
    period: "Sept - Present",
    links: [{ text: "site", url: "https://yacademy.dev/" }],
    details: "...",
    accomplishments: []
  },
  {
    company: "Ethereum Foundation",
    role: "Grantee (P256 Project)",
    period: "Oct 2023",
    links: [
      { text: "site", url: "https://ethereum.org/en/community/grants/" },
      { text: "code", url: "https://github.com/nullity00/batch-ecdsa-secp256r1" }
    ],
    details: "The EF provides grants to individuals, companies & teams working on cutting edge research & development in the Ethereum & ZK ecosystem.",
    accomplishments: [
      "Pursued the research and development of Batch ECDSA Signatures using P256 curve to facilitate the verification of signatures signed from Secure Enclave.",
      "In one of the approaches, I used circom to create circuits & the Nova library to fold multiple signatures",
      "In another approach, I used circom to create a batch verification circuit using randomizers"
    ]
  },
  {
    company: "YAcademyDAO",
    role: "ZK Auditing Fellow (zBlock1)",
    period: "May 2023 - June 2023",
    links: [
      { text: "site", url: "https://yacademy.dev/" },
      { text: "reports", url: "https://github.com/nullity00/audits" }
    ],
    details: "A 5 week program for zk auditors where to audit circom codebases",
    accomplishments: [
      "Was awarded the Top Fellow Award for the zBlock1 cohort.",
      "Audited circuits written in circom for Rate Limiting Nullifier project by the PSE team & spartan ECDSA by Personae Labs.",
      "Explored formal verification tools for circom including Picus & Ecne",
      "Tutored peers on ZK theory, Circom & shared notes for non-fellows in the public discussion channels."
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
    details: "Spect provides web3 forms, projects & automations to coordinate & build DAOs the decentralized way. Funded by PolygonDAO, GR14 & Push Protocol",
    accomplishments: [
      "Revamped the application's frontend by providing feasible UI using React.js & Next.js.",
      "Accelerated the integration of Soul bound Tokens into Spect Profiles by designing the tokens.",
      "Designed & deployed the GitHub bot for seamless integration into Spect Network using GitHub API & webhooks.",
      "Used Nest.js, Mongoose, MongoDB to create endpoints in the CQRS pattern."
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
    details: "Flawed Arts is an Indian Graphic designing and Digital Marketing company",
    accomplishments: [
      "Designed the client's applications using Wordpress, Elementor, Figma, Canva and developed them using JS Frameworks and Django.",
      "Developed POS Applications for small sized business using React.js, MongoDB and AWS S3 buckets."
    ]
  },
  {
    company: "Freelance",
    role: "Graphic Designer",
    period: "Nov 2019 - Aug 2020",
    links: [{ text: "portfolio", url: "https://www.behance.net/nullity00" }],
    details: "Teamed up with my fellow friend Abdul Majeed to design logos, posters, banners, etc. for various clients using Adobe Illustrator, Adobe Photoshop, Adobe XD, Figma & Blender.",
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
            <div key={index} className="border-l-2 border-zinc-700 pl-3 relative">
              <div className="absolute w-2 h-2 bg-white rounded-full -left-1 top-0"></div>
              
              <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-1">
                <div>
                  <h2 className="text-base font-bold text-white mb-0.5">{item.company}</h2>
                  <p className="text-sm text-zinc-300 mb-0.5">{item.role}</p>
                  <p className="text-xs text-zinc-500 mb-1">{item.period}</p>
                  
                  <div className="flex flex-wrap gap-1 mb-1">
                    {item.links.map((link, linkIndex) => (
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
              </div>
              
              <div className="text-zinc-300 leading-relaxed">
                <p className="mb-1 text-xs">{item.details}</p>
                
                {item.accomplishments.length > 0 && (
                  <>
                    <h3 className="text-xs font-semibold text-white mb-1">Accomplishments</h3>
                    <ul className="list-disc list-inside space-y-0.5 text-zinc-300 text-xs">
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