/**
 * Formatação de valores.
 *
 * O metical é a fonte de verdade (blueprint §6.4). Qualquer conversão para USD
 * ou ZAR é indicativa e tem de ser rotulada como tal — nunca é a base de cálculo.
 */

const mzn = new Intl.NumberFormat('pt-MZ', {
  style: 'currency',
  currency: 'MZN',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

/** Formata centavos inteiros como meticais. */
export function formatMzn(centavos: number): string {
  return mzn.format(centavos / 100);
}

const dateFmt = new Intl.DateTimeFormat('pt-PT', {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
});

/** Formata uma data ISO (yyyy-mm-dd) para leitura. */
export function formatDate(iso: string): string {
  const ms = Date.parse(`${iso}T00:00:00Z`);
  if (Number.isNaN(ms)) return iso;
  return dateFmt.format(new Date(ms));
}

export function plural(n: number, one: string, many: string): string {
  return `${n} ${n === 1 ? one : many}`;
}
