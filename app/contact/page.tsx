import { Metadata } from 'next'
import Navigation from '../components/Navigation'

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <Navigation currentPage="/contact" />
      <div className="max-w-4xl mx-auto px-4 py-4">
        <h1 className="text-2xl font-bold mb-4">Get in Touch</h1>
        
        <div className="max-w-none">
          <p className="text-sm leading-relaxed mb-4">
            Feel free to reach out for collaborations, questions about ZK circuits, or just to say hi!
          </p>
          
          <div className="grid gap-2 md:grid-cols-3">
            <a
              href="mailto:00nullity@gmail.com"
              className="block p-2 border border-zinc-700 rounded hover:border-zinc-500 transition-colors"
            >
              <h3 className="text-sm font-semibold mb-0.5">Email</h3>
              <p className="text-zinc-300 text-xs">00nullity@gmail.com</p>
            </a>
            
            <a
              href="https://twitter.com/nullity00"
              target="_blank"
              rel="noopener noreferrer"
              className="block p-2 border border-zinc-700 rounded hover:border-zinc-500 transition-colors"
            >
              <h3 className="text-sm font-semibold mb-0.5">Twitter</h3>
              <p className="text-zinc-300 text-xs">@nullity00</p>
            </a>
            
            <a
              href="https://github.com/nullity00"
              target="_blank"
              rel="noopener noreferrer"
              className="block p-2 border border-zinc-700 rounded hover:border-zinc-500 transition-colors"
            >
              <h3 className="text-sm font-semibold mb-0.5">GitHub</h3>
              <p className="text-zinc-300 text-xs">nullity00</p>
            </a>
          </div>
          
          <div className="mt-4 p-2 border border-zinc-700 rounded">
            <h3 className="text-sm font-semibold mb-2">Areas of Interest</h3>
            <div className="grid gap-2 md:grid-cols-2">
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
    </div>
  )
}

export const metadata: Metadata = {
  title: 'Contact - Nullity',
  description: 'Get in touch for collaborations in ZK research, cryptography, and blockchain security',
  keywords: [
    'contact',
    'collaboration',
    'ZK research',
    'cryptography',
    'blockchain security',
    'consulting'
  ].join(', '),
}