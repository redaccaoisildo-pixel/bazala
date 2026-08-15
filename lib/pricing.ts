/**
 * Modelo de comissão da Bazalá (blueprint §4 e §5).
 *
 * Duas regras governam tudo o que está aqui:
 *
 *  1. O anfitrião indica quanto quer RECEBER, não quanto quer cobrar (§4.3).
 *     O preço ao hóspede é calculado a partir daí. É isto que faz com que uma
 *     comissão baixa do lado do anfitrião apareça onde interessa — no preço
 *     exibido — em vez de ser absorvida.
 *
 *  2. O total é sempre 16%, inclusivo de IVA. O que muda entre fases é a
 *     repartição entre anfitrião e hóspede.
 *
 * Todo o dinheiro é tratado em CENTAVOS inteiros. Nunca em vírgula flutuante:
 * o ledger tem de fechar ao cêntimo (§7.2).
 */

/** IVA moçambicano. Isento sob ISPC — ver blueprint §6.2. */
export const IVA_RATE = 0.16;

export type CommissionRates = {
  /** Fracção retida ao anfitrião, ex. 0.10 */
  host: number;
  /** Fracção acrescentada ao hóspede, ex. 0.06 */
  guest: number;
};

/**
 * As duas fases do §4.2. O total é 16% em ambas.
 *
 *   launch — 10% anfitrião + 6% hóspede. "Fica com 90%", contra os 82,75%
 *            efectivos da LekkeSlaap.
 *   mature — 16% anfitrião + 0% hóspede. Só quando a Bazalá for canal
 *            dominante: a 16% a mensagem passa a "fica com 84%", que não
 *            ganha anfitrião nenhum.
 *
 * Começar a 5% foi rejeitado por obrigar, um dia, a dizer a um anfitrião que
 * a comissão dele duplica — a pior conversa possível num mercado pequeno.
 */
export type Phase = 'launch' | 'mature';

export const PHASE_RATES: Record<Phase, CommissionRates> = {
  launch: { host: 0.1, guest: 0.06 },
  mature: { host: 0.16, guest: 0.0 },
};

/**
 * Anfitriões fundadores (§4.4): 3% em vez de 10%, permanentes, desde a
 * primeira reserva. "Fica com 97%."
 *
 * Não há isenção nas primeiras reservas, e é deliberado: um desconto sobre
 * reservas que o anfitrião ainda não tem vale zero — 10% de zero e 0% de zero
 * são o mesmo número. Uma taxa permanente mais baixa evita o degrau, mantém a
 * informação sobre disposição para pagar, e nunca obriga a subir a comissão a
 * ninguém, que é a razão pela qual a fase de lançamento é 10% e não 5%.
 *
 * Elegibilidade: primeiros 40 anfitriões, ou quem entrar nos primeiros 12
 * meses, o que vier primeiro. O custo dilui-se com a escala.
 *
 * Excepções negociadas caso a caso vivem na tabela `host_commission_rates`,
 * com o motivo registado. São dados, não política.
 */
export const FOUNDING = {
  maxHosts: 40,
  months: 12,
  rates: { host: 0.03, guest: 0.06 } satisfies CommissionRates,
};

export type Quote = {
  nights: number;
  /** Preço a que o alojamento fica listado, por noite. */
  listedPerNight: number;
  /** Subtotal do alojamento — a base de cálculo de tudo (o GBV). */
  accommodationTotal: number;
  /** Taxa de serviço acrescentada ao hóspede. */
  guestFee: number;
  /** O que o hóspede paga. */
  guestTotal: number;
  /** Comissão retida ao anfitrião. */
  hostFee: number;
  /** O que o anfitrião recebe. */
  hostPayout: number;
  /** Comissão bruta da Bazalá (hostFee + guestFee), inclusiva de IVA. */
  commissionGross: number;
  /** IVA contido na comissão. Zero sob ISPC. */
  ivaAmount: number;
  /** Comissão líquida de IVA — antes dos custos de processamento. */
  commissionNetOfIva: number;
  rates: CommissionRates;
};

/** Arredonda para centavos inteiros, half-up. */
function toCentavos(value: number): number {
  return Math.round(value);
}

/**
 * Converte o líquido pretendido pelo anfitrião no preço a listar.
 *
 *   listado × (1 − taxaAnfitriao) = líquido
 */
export function listedFromHostNet(hostNetPerNight: number, rates: CommissionRates): number {
  if (rates.host >= 1) throw new Error('Taxa de anfitrião inválida');
  return toCentavos(hostNetPerNight / (1 - rates.host));
}

/**
 * Orçamento completo de uma estadia, a partir do líquido que o anfitrião
 * quer receber por noite.
 *
 * `ivaRate` a zero representa o regime ISPC, em que a Bazalá é isenta (§6.2).
 */
export function quote(
  hostNetPerNight: number,
  nights: number,
  rates: CommissionRates,
  ivaRate: number = IVA_RATE,
): Quote {
  if (nights < 1) throw new Error('A estadia tem de ter pelo menos uma noite');

  const listedPerNight = listedFromHostNet(hostNetPerNight, rates);
  const accommodationTotal = toCentavos(listedPerNight * nights);

  const guestFee = toCentavos(accommodationTotal * rates.guest);
  const hostFee = toCentavos(accommodationTotal * rates.host);

  const guestTotal = accommodationTotal + guestFee;
  const hostPayout = accommodationTotal - hostFee;

  const commissionGross = hostFee + guestFee;

  // O IVA está CONTIDO na comissão, não é acrescentado a ela:
  //   iva = bruto × taxa / (1 + taxa)
  const ivaAmount = toCentavos((commissionGross * ivaRate) / (1 + ivaRate));

  return {
    nights,
    listedPerNight,
    accommodationTotal,
    guestFee,
    guestTotal,
    hostFee,
    hostPayout,
    commissionGross,
    ivaAmount,
    commissionNetOfIva: commissionGross - ivaAmount,
    rates,
  };
}

/** Número de noites entre duas datas ISO (yyyy-mm-dd). */
export function nightsBetween(checkIn: string, checkOut: string): number {
  const a = Date.parse(`${checkIn}T00:00:00Z`);
  const b = Date.parse(`${checkOut}T00:00:00Z`);
  if (Number.isNaN(a) || Number.isNaN(b)) return 0;
  return Math.round((b - a) / 86_400_000);
}
