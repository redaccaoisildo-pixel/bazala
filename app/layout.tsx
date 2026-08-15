import type { Metadata, Viewport } from 'next';
import { Inter, Poppins } from 'next/font/google';
import Link from 'next/link';
import { SITE } from '@/data/config';
import { HAS_EXAMPLE_LISTINGS } from '@/data/listings';
import './globals.css';

/**
 * Auto-alojadas por `next/font`: sem ligação a servidores da Google, sem salto
 * de layout. Só os pesos que a identidade usa — Poppins SemiBold para títulos,
 * Inter Regular e SemiBold para o resto. Cada peso extra custa ~15 KB no
 * orçamento de 400 KB por página.
 */
const poppins = Poppins({
  subsets: ['latin'],
  weight: ['600'],
  variable: '--font-poppins',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '600'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: `${SITE.name} — alojamento em Moçambique`,
    template: `%s · ${SITE.name}`,
  },
  description: SITE.description,
  openGraph: {
    title: `${SITE.name} — alojamento em Moçambique`,
    description: SITE.description,
    locale: 'pt_MZ',
    type: 'website',
  },
};

export const viewport: Viewport = {
  themeColor: '#163a3d',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-MZ" className={`${poppins.variable} ${inter.variable}`}>
      <body>
        {HAS_EXAMPLE_LISTINGS && (
          <p
            role="status"
            className="bg-dark px-4 py-2 text-center text-sm font-semibold text-paper"
          >
            Este site ainda contém alojamentos de exemplo. Substitua-os por
            alojamentos reais antes de publicar.
          </p>
        )}

        <header className="border-b border-rule">
          <div className="mx-auto flex max-w-3xl items-baseline gap-3 px-4 py-4">
            <Link
              href="/"
              className="font-display text-2xl font-semibold lowercase tracking-tight text-primary no-underline"
            >
              {SITE.name}
            </Link>
            <span className="text-sm text-mute">{SITE.tagline}</span>
          </div>
        </header>

        <main className="mx-auto max-w-3xl px-4 py-8">{children}</main>

        <footer className="mt-16 border-t border-rule">
          <div className="mx-auto max-w-3xl px-4 py-8 text-sm text-mute">
            <p>{SITE.name} — alojamento em Moçambique. Preços em meticais.</p>
            <p className="mt-2">
              Cada pedido é confirmado por uma pessoa antes de haver qualquer
              pagamento.
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
