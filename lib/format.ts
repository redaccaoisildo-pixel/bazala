import { LOCALE_TAGS, type Locale } from '@/lib/i18n';

/**
 * Formatação de valores e datas, por idioma.
 *
 * O metical é a fonte de verdade nos dois idiomas (blueprint §6.4) — o que
 * muda é a apresentação: `10 011 MTn` em português, `MZN 10,011` em inglês.
 * O hóspede sul-africano lê datas em dia/mês, daí `en-GB` e não `en-US`.
 */

/**
 * O símbolo não vem do `Intl`: para `pt-MZ` ele devolve `MTn`, e a forma usada
 * em Moçambique é `MT`. Formatamos o número com o `Intl` — que já dá o
 * agrupamento e a vírgula decimal certos em cada idioma — e pomos o símbolo à
 * mão, com espaço inquebrável para não se separar do valor na mudança de linha.
 *
 *   pt → 10 011,00 MT     (a abreviatura local)
 *   en → MZN 10,011.00    (o código ISO, que um estrangeiro reconhece)
 */
const AFFIX: Record<Locale, { prefix: string; suffix: string }> = {
  pt: { prefix: '', suffix: ' MT' },
  en: { prefix: 'MZN ', suffix: '' },
};

const money = new Map<Locale, Intl.NumberFormat>();
const dates = new Map<Locale, Intl.DateTimeFormat>();

function moneyFor(locale: Locale) {
  let f = money.get(locale);
  if (!f) {
    f = new Intl.NumberFormat(LOCALE_TAGS[locale], {
      style: 'decimal',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
      // 'auto' não agrupa quatro dígitos em português — daria `9444,44` ao lado
      // de `66 111,08` na mesma coluna de preços. Numa tabela de valores a
      // consistência vale mais do que a convenção.
      useGrouping: 'always',
    });
    money.set(locale, f);
  }
  return f;
}

function dateFor(locale: Locale) {
  let f = dates.get(locale);
  if (!f) {
    f = new Intl.DateTimeFormat(LOCALE_TAGS[locale], {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
    dates.set(locale, f);
  }
  return f;
}

/** Formata centavos inteiros como meticais. */
export function formatMzn(centavos: number, locale: Locale): string {
  const { prefix, suffix } = AFFIX[locale];
  return `${prefix}${moneyFor(locale).format(centavos / 100)}${suffix}`;
}

/**
 * O `Intl` devolve os meses em minúscula em português — `setembro`. Em
 * português europeu pré-Acordo escrevem-se com maiúscula, por isso qualquer
 * formato que inclua o nome do mês tem de passar por aqui.
 *
 * Usa `formatToParts` para tocar apenas na parte do mês: capitalizar a string
 * inteira estragaria `23 de Setembro`, e capitalizar às cegas partiria o
 * inglês, onde o `Intl` já devolve `September` como deve ser.
 */
function withCapitalMonth(parts: Intl.DateTimeFormatPart[]): string {
  return parts
    .map((p) =>
      p.type === 'month' && /\p{L}/u.test(p.value)
        ? p.value.charAt(0).toUpperCase() + p.value.slice(1)
        : p.value,
    )
    .join('');
}

/** Formata uma data ISO (yyyy-mm-dd) para leitura. */
export function formatDate(iso: string, locale: Locale): string {
  const ms = Date.parse(`${iso}T00:00:00Z`);
  if (Number.isNaN(ms)) return iso;
  return withCapitalMonth(dateFor(locale).formatToParts(new Date(ms)));
}

const months = new Map<Locale, Intl.DateTimeFormat>();

/** `Setembro 2026` — cabeçalho de calendário. */
export function formatMonthYear(date: Date, locale: Locale): string {
  let f = months.get(locale);
  if (!f) {
    f = new Intl.DateTimeFormat(LOCALE_TAGS[locale], { month: 'long', year: 'numeric' });
    months.set(locale, f);
  }
  return withCapitalMonth(f.formatToParts(date));
}

/** `2 noites`, `1 night`. As palavras vêm do dicionário. */
export function plural(n: number, one: string, many: string): string {
  return `${n} ${n === 1 ? one : many}`;
}
