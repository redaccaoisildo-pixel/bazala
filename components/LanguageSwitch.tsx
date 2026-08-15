import Link from 'next/link';
import { LOCALES, LOCALE_LABELS, LOCALE_SHORT, type Locale } from '@/lib/i18n';

/**
 * Selector de idioma.
 *
 * Uma ligação normal, sem JavaScript. Troca apenas o prefixo do caminho, o que
 * mantém o visitante na mesma página — e faz do idioma uma decisão que fica no
 * URL, que é o que o Google precisa para indexar as duas árvores.
 */
export function LanguageSwitch({
  current,
  path,
}: {
  current: Locale;
  /** Caminho depois do idioma, começado por '/'. Ex.: '/alojamento/casa-x'. */
  path: string;
}) {
  return (
    <nav aria-label="Idioma / Language" className="flex items-center gap-1 text-sm">
      {LOCALES.map((locale, i) => (
        <span key={locale} className="flex items-center gap-1">
          {i > 0 && <span aria-hidden="true" className="text-rule">·</span>}
          {locale === current ? (
            <span aria-current="true" className="font-semibold text-dark">
              {LOCALE_SHORT[locale]}
            </span>
          ) : (
            <Link
              href={`/${locale}${path}`}
              hrefLang={locale}
              lang={locale}
              aria-label={LOCALE_LABELS[locale]}
              className="text-primary-ink"
            >
              {LOCALE_SHORT[locale]}
            </Link>
          )}
        </span>
      ))}
    </nav>
  );
}
