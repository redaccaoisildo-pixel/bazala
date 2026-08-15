import type { Locale } from '@/lib/i18n';
import { en } from './en';
import { pt, type Dictionary } from './pt';

export type { Dictionary };

/**
 * Sem biblioteca de i18n. Para umas sessenta expressões, `next-intl` ou
 * `react-i18next` acrescentam complexidade e bundle a troco de nada.
 *
 * Estes objectos resolvem-se em tempo de build, dentro de componentes de
 * servidor — impacto zero no JavaScript enviado ao browser.
 */
const dictionaries: Record<Locale, Dictionary> = { pt, en };

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale];
}
