import { Metadata } from 'next'
import Navigation from '../components/Navigation'

interface MiscItem {
  title: string
  category: string
  period: string
  links: { text: string; url: string }[]
  details: string
}

const talksData: MiscItem[] = [
  {
    title: "yAudit zBlock2",
    category: "Halo2",
    period: "June 2024",
    links: [
      { text: "Video", url: "https://youtu.be/0ZfUKTc_qoE?si=2bmNvr9T1u_Ajy3a" }
    ],
    details: "Talk on Halo2 during yAudit's zBlock2 auditing fellowship"
  },
  {
    title: "OpenSense",
    category: "ZK Circuit Development",
    period: "26th Sept 2023",
    links: [
      { text: "Video", url: "https://www.youtube.com/watch?v=IFy8At9eU3U" },
      { text: "Slides", url: "https://docs.google.com/presentation/d/1awb4alkfu6WMeGVk4I59utyd_rGCXw2QJOtdHiMKvXE/edit?usp=sharing" }
    ],
    details: "A talk on the basics of ZK Circuit Development, ZK Languages and Security"
  }
]

const communityData: MiscItem[] = [
  {
    title: "ZKZK",
    category: "5 week ZK Learning Group",
    period: "Aug 2023 - Sept 2023",
    links: [{ text: "Site", url: "https://github.com/nullity00/zkzk" }],
    details: "Led a fast paced learning group covering circuit development in Halo2, Plonky2, Circom, Proof systems like Plonk & Security Reviews from of ZK Protocols."
  },
  {
    title: "Proofs & Args Notes",
    category: "Study Session",
    period: "Post-ZKZK",
    links: [{ text: "Notes", url: "https://nullity00.notion.site/Justin-Thaler-Proofs-Args-0cd79d9f70c34c26a12f37243a3092cb" }],
    details: "Study notes on Justin Thaler's famous book 'Proofs, Arguments, and Zero-Knowledge'."
  }
]

function MiscSection({ title, items }: { title: string; items: MiscItem[] }) {
  return (
    <div className="mb-6">
      <h2 className="text-base font-bold mb-3">{title}</h2>
      <div className="space-y-3">
        {items.map((item, index) => (
          <div key={index} className="border-l-2 border-zinc-700 pl-3 relative">
            <div className="absolute w-2 h-2 bg-white rounded-full -left-1 top-0"></div>
            
            <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-1">
              <div className="flex-1">
                <h3 className="text-sm font-bold mb-0.5">{item.title}</h3>
                <p className="text-xs text-white/50 mb-0.5">{item.category}</p>
                <p className="text-xs text-white/50 mb-1">{item.period}</p>

                {item.links.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-1">
                    {item.links.map((link, linkIndex) => (
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
                )}
              </div>
            </div>

            <p className="text-white/50 leading-relaxed text-xs">{item.details}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function MiscPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <Navigation currentPage="/misc" />
      <div className="max-w-4xl mx-auto px-4 py-4">
        <h1 className="text-2xl font-bold mb-4">Misc</h1>
        
        <MiscSection title="Talks" items={talksData} />
        <MiscSection title="Community" items={communityData} />
      </div>
    </div>
  )
}

export const metadata: Metadata = {
  title: 'Misc - Nullity',
  description: 'Talks, community involvement, and other activities in the ZK and blockchain space',
  keywords: [
    'talks',
    'community',
    'ZK circuit development',
    'learning group',
    'presentations',
    'blockchain'
  ].join(', '),
}