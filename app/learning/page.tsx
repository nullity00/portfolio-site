import { Metadata } from 'next'
import Navigation from '../components/Navigation'

interface LearningItem {
  institution: string
  program: string
  period: string
  links: { text: string; url: string }[]
  details: string
}

const onlineLearning: LearningItem[] = [
  {
    institution: "ZK Camp",
    program: "Aztec Cohort 1",
    period: "August 2023",
    links: [{ text: "site", url: "https://www.zkcamp.xyz/aztec" }],
    details: "Explored Noir's novel intermediate representation (ACIR), constraints optimizations, and security."
  },
  {
    institution: "ABCDELabs",
    program: "Hacker Camp",
    period: "July - Sept 2023",
    links: [{ text: "site", url: "https://www.abcde.com" }],
    details: "ZK Camp is a two-month hybrid program consisting of ZK curriculum, ZK Hackathon and Demo Day."
  },
  {
    institution: "BTA",
    program: "Understanding and Developing on Zcash",
    period: "June 2023",
    links: [{ text: "site", url: "https://blockchaintrainingalliance.com/products/zcash" }],
    details: "Learnt the foundations of Zcash, its use cases, development & governance, halo2 in zcash."
  },
  {
    institution: "UC Berkeley RDI",
    program: "ZKP MOOC",
    period: "Feb - May 2023",
    links: [{ text: "site", url: "https://zk-learning.org/" }],
    details: "The bootcamp focused on the theoretical aspects of ZK Proofs and constructing a ZK Proof using SNARKs, Polynomial Commitments, FRI, encryption algorithms and so much more. I was awarded the Legendary Tier NFT"
  },
  {
    institution: "Encode Club",
    program: "ZK Bootcamp 2023",
    period: "Feb - March 2023",
    links: [{ text: "NFT", url: "https://opensea.io/assets/matic/0xdBf2138593aeC61d55d86E80b8ed86D7b9ba51F5/2858" }],
    details: "Successfully completed an intensive boot camp Zero Knowledge Proofs gaining practical knowledge and hands-on experience in Zokrates, Cairo, Noir, SnarkyJS, Circom."
  },
  {
    institution: "Coursera",
    program: "Blockchain Specialization by University at Buffalo & The State University of New York",
    period: "May 2022",
    links: [{ text: "site", url: "https://www.coursera.org/specializations/blockchain" }],
    details: "Got the basics of blockchain technology, its applications and the architecture of Bitcoin, Ethereum, Hyperledger and misc decentralized applications."
  }
]

const formalEducation: LearningItem[] = [
  {
    institution: "St. Joseph's College",
    program: "Bachelors in Mathematics",
    period: "Jun 2018 - May 2021",
    links: [],
    details: "Completed my Bachelor's degree in Mathematics with a CGPA of 8.6 with in-depth knowledge in Discrete Maths, Graph Theory, Algorithms, C++, MATLAB, Probability, Fourier Analysis & Transform, Regression, Vectors & Calculus."
  }
]

function LearningSection({ title, items }: { title: string; items: LearningItem[] }) {
  return (
    <div className="mb-6">
      <h2 className="text-lg font-bold mb-3">{title}</h2>
      <div className="space-y-3">
        {items.map((item, index) => (
          <div key={index} className="relative">
            <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-1">
              <div className="flex-1">
                <h3 className="text-lg font-bold text-white mb-0.5">{item.institution}</h3>
                <p className="text-base text-zinc-300 mb-0.5">{item.program}</p>
              </div>

              <div className="md:text-right mt-1 md:mt-0">
                <p className="text-sm text-zinc-500 mb-1">{item.period}</p>
                {item.links.length > 0 && (
                  <div className="flex flex-wrap gap-1 md:justify-end">
                    {item.links.map((link, linkIndex) => (
                      <a
                        key={linkIndex}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-white hover:text-zinc-300 underline text-sm"
                      >
                        [{link.text}]
                      </a>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <p className="text-zinc-300 leading-relaxed text-sm">{item.details}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function LearningPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <Navigation currentPage="/learning" />
      <div className="max-w-4xl mx-auto px-4 py-4">
        <h1 className="text-2xl font-bold mb-4">Learning</h1>
        
        <LearningSection title="Online Learning" items={onlineLearning} />
        <LearningSection title="Formal Education" items={formalEducation} />
      </div>
    </div>
  )
}

export const metadata: Metadata = {
  title: 'Learning - Nullity',
  description: 'Educational background including ZK bootcamps, cryptography courses, and formal mathematics education',
  keywords: [
    'education',
    'learning',
    'ZK bootcamp',
    'cryptography',
    'mathematics',
    'Berkeley',
    'Encode Club',
    'blockchain'
  ].join(', '),
}