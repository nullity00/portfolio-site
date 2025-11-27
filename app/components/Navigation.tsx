import { Mail, Twitter, Github, Send } from 'lucide-react'

interface NavigationProps {
  currentPage?: string;
}

export default function Navigation({ currentPage }: NavigationProps) {
  const links = [
    { href: '/', label: 'Home' },
    { href: '/career', label: 'Career' },
    { href: '/learning', label: 'Learning' },
    { href: '/projects', label: 'Projects' },
    { href: '/blog', label: 'Blog' },
    { href: '/misc', label: 'Misc' },
  ];

  const socialLinks = [
    { href: 'mailto:00nullity@gmail.com', icon: Mail, label: 'Email' },
    { href: 'https://twitter.com/nullity00', icon: Twitter, label: 'Twitter' },
    { href: 'https://github.com/nullity00', icon: Github, label: 'GitHub' },
    { href: 'https://t.me/nullity00', icon: Send, label: 'Telegram' },
  ];

  return (
    <nav className="px-4 py-3">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center">
          <div className="flex flex-wrap gap-4 text-base">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className={`px-3 py-1 rounded transition-colors ${
                  currentPage === link.href
                    ? 'bg-zinc-700 text-white'
                    : 'hover:bg-zinc-800'
                }`}
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="flex gap-3 ml-4">
            {socialLinks.map((link) => {
              const Icon = link.icon;
              return (
                <a
                  key={link.href}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 hover:bg-zinc-800 rounded transition-colors"
                  aria-label={link.label}
                >
                  <Icon size={18} />
                </a>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}