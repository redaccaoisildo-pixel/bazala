/**
 * Idiomas da Bazalá (blueprint §7.5).
 *
 * Português e inglês em árvores de URL distintas — `/pt/...` e `/en/...`.
 * Não é uma questão de gosto: se os dois idiomas partilharem endereço, o
 * Google só indexa um, e toda a estratégia de procura assenta em conteúdo
 * de destino a ranquear.
 *
 * Rotas simétricas, sem idioma predefinido na raiz, porque não há um: os
 * anfitriões são lusófonos e boa parte dos hóspedes é anglófona.
 */

export const LOCALES = ['pt', 'en'] as const;

export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = 'pt';

export function isLocale(value: string): value is Locale {
  return (LOCALES as readonly string[]).includes(value);
}

/** Etiquetas do selector de idioma, cada uma no seu próprio idioma. */
export const LOCALE_LABELS: Record<Locale, string> = {
  pt: 'Português',
  en: 'English',
};

/** Etiqueta curta, para o cabeçalho. */
export const LOCALE_SHORT: Record<Locale, string> = {
  pt: 'PT',
  en: 'EN',
};

/** Códigos BCP-47 para `hreflang` e para formatação de datas e moeda. */
export const LOCALE_TAGS: Record<Locale, string> = {
  pt: 'pt-MZ',
  // en-GB e não en-US: o hóspede-alvo é sul-africano, e usa dia/mês.
  en: 'en-GB',
};

/**
 * Escolhe o idioma a partir do cabeçalho Accept-Language.
 * Usado apenas no middleware, para redirigir `/`.
 */
export function pickLocale(acceptLanguage: string | null): Locale {
  if (!acceptLanguage) return DEFAULT_LOCALE;

  const ranked = acceptLanguage
    .split(',')
    .map((part) => {
      const [tag, q] = part.trim().split(';q=');
      return { tag: tag.toLowerCase(), q: q ? Number(q) : 1 };
    })
    .sort((a, b) => b.q - a.q);

  for (const { tag } of ranked) {
    if (tag.startsWith('pt')) return 'pt';
    if (tag.startsWith('en')) return 'en';
  }

  return DEFAULT_LOCALE;
}
