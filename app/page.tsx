import { Metadata } from 'next'
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
            
            <p className="text-sm leading-relaxed mb-3">
              I&apos;m a math graduate with a strong interest in applied cryptography, zero knowledge proofs & its application in the Ethereum ecosystem.
            </p>
            
            <p className="text-sm leading-relaxed mb-3">
              Previously, I was a MERN stack developer with experience in development of dApps as well.
            </p>
            
            <p className="text-sm leading-relaxed mb-3">
              I specialize in the development, optimization & security of ZK circuits in DSLs (Circom, Noir), libraries (Bellman, Halo2, Plonky2) with knowledge in the workings of PLONKish SNARKs.
            </p>
            
            <p className="text-sm leading-relaxed mb-4">
              Right now, I do ZK research & security at{' '}
              <a 
                href="https://twitter.com/yAcademyDao" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-white hover:text-zinc-300 underline"
              >
                yAcademyDAO
              </a>
            </p>

            {/* Contact Section */}
            <div className="mb-6">
              <h2 className="text-lg font-semibold mb-3">Get in Touch</h2>
              <p className="text-sm leading-relaxed mb-4">
                Feel free to reach out for collaborations, questions about ZK circuits, or just to say hi!
              </p>
              
              <div className="grid gap-3 md:grid-cols-3 mb-4">
                <a
                  href="mailto:00nullity@gmail.com"
                  className="block p-3 border border-zinc-700 rounded hover:border-zinc-500 transition-colors"
                >
                  <h3 className="text-sm font-semibold mb-1">Email</h3>
                  <p className="text-zinc-300 text-xs">00nullity@gmail.com</p>
                </a>
                
                <a
                  href="https://twitter.com/nullity00"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block p-3 border border-zinc-700 rounded hover:border-zinc-500 transition-colors"
                >
                  <h3 className="text-sm font-semibold mb-1">Twitter</h3>
                  <p className="text-zinc-300 text-xs">@nullity00</p>
                </a>
                
                <a
                  href="https://github.com/nullity00"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block p-3 border border-zinc-700 rounded hover:border-zinc-500 transition-colors"
                >
                  <h3 className="text-sm font-semibold mb-1">GitHub</h3>
                  <p className="text-zinc-300 text-xs">nullity00</p>
                </a>
              </div>
              
              <div className="border border-zinc-700 rounded p-3">
                <h3 className="text-sm font-semibold mb-3">Areas of Interest</h3>
                <div className="grid gap-3 md:grid-cols-2">
                  <div>
                    <h4 className="text-xs font-medium mb-1">Research & Development</h4>
                    <ul className="text-zinc-300 space-y-0.5 text-xs">
                      <li>• Zero Knowledge Proofs</li>
                      <li>• Applied Cryptography</li>
                      <li>• ZK Circuit Development</li>
                      <li>• PLONK/SNARKs</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-xs font-medium mb-1">Security & Auditing</h4>
                    <ul className="text-zinc-300 space-y-0.5 text-xs">
                      <li>• ZK Circuit Auditing</li>
                      <li>• Smart Contract Security</li>
                      <li>• Formal Verification</li>
                      <li>• Security Reviews</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="md:w-1/3">
            <div className="border border-zinc-700 rounded p-3">
              <div className="w-full h-32 bg-zinc-800 rounded mb-2 flex items-center justify-center">
                <span className="text-zinc-500 text-xs">Profile Image</span>
              </div>
              <p className="text-xs text-zinc-400 text-center">
                <em>Nah, that&apos;s not me</em>
              </p>
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