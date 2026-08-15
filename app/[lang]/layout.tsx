import type { Metadata, Viewport } from 'next';
import { Inter, Poppins } from 'next/font/google';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getDictionary } from '@/dictionaries';
import { SITE } from '@/data/config';
import { HAS_EXAMPLE_LISTINGS } from '@/data/listings';
import { LOCALES, LOCALE_TAGS, isLocale, type Locale } from '@/lib/i18n';
import '../globals.css';

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

type Params = { lang: string };

export function generateStaticParams() {
  return LOCALES.map((lang) => ({ lang }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};

  const title = `${SITE.name} — ${lang === 'pt' ? 'alojamento em Moçambique' : 'places to stay in Mozambique'}`;

  return {
    metadataBase: new URL(SITE.url),
    title: { default: title, template: `%s · ${SITE.name}` },
    description: SITE.description[lang],
    // Cinto e suspensórios com o robots.txt: o `disallow` impede a rastreagem,
    // mas uma página ligada a partir de fora ainda podia ser indexada.
    ...(HAS_EXAMPLE_LISTINGS && { robots: { index: false, follow: false } }),
    // Uma árvore por idioma, ligadas por hreflang. Sem isto o Google indexa
    // uma e ignora a outra (blueprint §7.5).
    alternates: {
      canonical: `/${lang}`,
      languages: Object.fromEntries(LOCALES.map((l) => [LOCALE_TAGS[l], `/${l}`])),
    },
    openGraph: {
      title,
      description: SITE.description[lang],
      locale: LOCALE_TAGS[lang].replace('-', '_'),
      type: 'website',
    },
  };
}

export const viewport: Viewport = {
  themeColor: '#163a3d',
  width: 'device-width',
  initialScale: 1,
};

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<Params>;
}) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();

  const locale: Locale = lang;
  const t = getDictionary(locale);

  return (
    <html lang={LOCALE_TAGS[locale]} className={`${poppins.variable} ${inter.variable}`}>
      <body>
        {HAS_EXAMPLE_LISTINGS && (
          <p
            role="status"
            className="bg-dark px-4 py-2 text-center text-sm font-semibold text-paper"
          >
            {t.exampleWarning}
          </p>
        )}

        <header className="border-b border-rule">
          <div className="mx-auto flex max-w-3xl items-baseline justify-between gap-3 px-4 py-4">
            <div className="flex items-baseline gap-3">
              <Link
                href={`/${locale}`}
                className="font-display text-2xl font-semibold lowercase tracking-tight text-primary no-underline"
              >
                {SITE.name}
              </Link>
              <span className="hidden text-sm text-mute sm:inline">
                {t.tagline}
              </span>
            </div>
          </div>
        </header>

        <main className="mx-auto max-w-3xl px-4 py-8">{children}</main>

        <footer className="mt-16 border-t border-rule">
          <div className="mx-auto max-w-3xl px-4 py-8 text-sm text-mute">
            <p>
              {SITE.name} — {t.footer.line1}
            </p>
            <p className="mt-2">{t.footer.line2}</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
