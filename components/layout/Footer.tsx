import Link from "next/link"
import { Github, Youtube, Send } from "lucide-react"
import Image from "next/image"

const footerLinks = [
  { name: "Features", href: "#features" },
  { name: "App", href: "#app" },
  { name: "API", href: "#" },
  { name: "Documentation", href: "#" },
  { name: "About", href: "#" },
  { name: "Contact", href: "#" },
  { name: "Privacy", href: "#" },
  { name: "Terms", href: "#" },
]

const socialLinks = [
  { name: "GitHub", icon: Github, href: "https://github.com/unrepoai" },
  {
    name: "NPM",
    icon: () => (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
        <path d="M0 7.334v8h6.666v1.332H12v-1.332h12v-8H0zm6.666 6.664H5.334v-4H3.999v4H1.335V8.667h5.331v5.331zm4 0v1.336H8.001V8.667h5.334v5.332h-2.669v-.001zm12.001 0h-1.33v-4h-1.336v4h-1.335v-4h-1.33v4h-2.671V8.667h8.002v5.331zM10.665 10H12v2.667h-1.335V10z" />
      </svg>
    ),
    href: "https://www.npmjs.com/~unrepo-dev",
  },
  {
    name: "Twitter",
    icon: () => (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
    href: "https://x.com/unrepoai",
  },
  {
    name: "YouTube",
    icon: Youtube,
    href: "https://youtube.com/@unrepoai",
  },
  {
    name: "Medium",
    icon: () => (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
        <path d="M13.54 12a6.8 6.8 0 01-6.77 6.82A6.8 6.8 0 010 12a6.8 6.8 0 016.77-6.82A6.8 6.8 0 0113.54 12zM20.96 12c0 3.54-1.51 6.42-3.38 6.42-1.87 0-3.39-2.88-3.39-6.42s1.52-6.42 3.39-6.42 3.38 2.88 3.38 6.42M24 12c0 3.17-.53 5.75-1.19 5.75-.66 0-1.19-2.58-1.19-5.75s.53-5.75 1.19-5.75C23.47 6.25 24 8.83 24 12z" />
      </svg>
    ),
    href: "https://medium.com/@unrepoai",
  },
  {
    name: "Telegram",
    icon: Send,
    href: "https://t.me/unrepoai",
  },
  {
    name: "Discord",
    icon: () => (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
        <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z" />
      </svg>
    ),
    href: "https://discord.gg/unrepoai",
  },
  {
    name: "Linktree",
    icon: () => (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
        <path d="M7.953 15.066c-.08.163-.08.324-.08.486.08.517.528.897 1.052.89h1.294v4.776c0 .486-.404.89-.89.89H6.577a.898.898 0 0 1-.889-.891v-4.774H.992c-.728 0-1.214-.729-.89-1.377l6.96-12.627a1.065 1.065 0 0 1 1.863 0l2.913 5.585-3.885 7.042zm15.945 0-6.96-12.627a1.065 1.065 0 0 0-1.862 0l-2.995 5.586 3.885 7.04c.081.164.081.326.081.487-.08.517-.529.897-1.052.89h-1.296v4.776c0 .486.405.89.89.89h2.914a.9.9 0 0 0 .892-.891v-4.774h4.612c.73 0 1.214-.729.89-1.377Z" />
      </svg>
    ),
    href: "https://linktr.ee/unrepoai",
  },
]

export default function Footer() {
  return (
    <footer className="border-t border-border/40 bg-background">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:py-12 lg:py-16 sm:px-6 lg:px-8">
        {/* Logo and Brand */}
        <div className="flex justify-center items-center mb-6 sm:mb-8">
          <Link href="/" className="flex items-center gap-2 transition-transform duration-200 hover:scale-105">
            <Image
              src="/blackremove.png"
              alt="UnRepo Logo"
              width={32}
              height={32}
              className="h-8 w-8 object-contain"
            />
            <span className="text-lg sm:text-xl font-semibold tracking-tight font-mono">UnRepo</span>
          </Link>
        </div>

        {/* Navigation Links */}
        <nav className="flex justify-center items-center mb-6 sm:mb-8">
          <ul className="flex flex-wrap justify-center gap-x-4 sm:gap-x-6 gap-y-2 px-4">
            {footerLinks.map((link) => (
              <li key={link.name}>
                <Link
                  href={link.href}
                  className="text-xs sm:text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Social Links */}
        <div className="flex justify-center items-center flex-wrap gap-4 sm:gap-6 mb-6 sm:mb-8 px-4">
          {socialLinks.map((social) => {
            const Icon = social.icon
            return (
              <Link
                key={social.name}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground transition-all duration-200 hover:text-foreground hover:scale-110"
                aria-label={social.name}
              >
                {typeof Icon === "function" ? <Icon /> : <Icon className="h-5 w-5" />}
              </Link>
            )
          })}
        </div>

        {/* Copyright */}
        <div className="border-t border-border/40 pt-6 sm:pt-8">
          <p className="text-center text-xs sm:text-sm text-muted-foreground px-4">
            © {new Date().getFullYear()} UnRepo. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
