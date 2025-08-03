interface NavigationProps {
  currentPage?: string;
}

export default function Navigation({ currentPage }: NavigationProps) {
  const links = [
    { href: '/', label: 'Home' },
    { href: '/career', label: 'Career' },
    { href: '/learning', label: 'Learning' },
    { href: '/projects', label: 'Projects' },
    { href: '/misc', label: 'Misc' },
    { href: '/blog', label: 'Blog' },
  ];

  return (
    <nav className="border-b border-zinc-800 px-4 py-3">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-wrap gap-2 text-sm">
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
      </div>
    </nav>
  );
}