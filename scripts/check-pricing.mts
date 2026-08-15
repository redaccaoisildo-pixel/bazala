/**
 * Verificação da aritmética de comissão contra os números da blueprint.
 *
 *   npm run check:pricing
 *
 * Não é uma suite de testes — é uma rede de segurança para a única parte do
 * código onde um erro custa dinheiro real e só se descobre ao fechar contas.
 *
 * Foi esta verificação que apanhou uma fase a somar 15% em vez de 16% numa
 * versão anterior da blueprint. Vale a pena mantê-la a correr.
 */

import { IVA_RATE, PHASE_RATES, quote, type Phase } from '../lib/pricing.ts';

let failures = 0;

function check(label: string, actual: number, expected: number, tolerance = 1) {
  const ok = Math.abs(actual - expected) <= tolerance;
  if (!ok) failures++;
  console.log(
    `${ok ? 'ok   ' : 'FALHA'} ${label}: ${actual}${ok ? '' : ` (esperado ${expected})`}`,
  );
}

function assert(label: string, condition: boolean) {
  if (!condition) failures++;
  console.log(`${condition ? 'ok   ' : 'FALHA'} ${label}`);
}

// ── Blueprint §4.3 ───────────────────────────────────────────────────────────
// O anfitrião quer receber 827,50 por noite. No lançamento (10% + 6%) o hóspede
// deve pagar 974,61 — abaixo dos 1.000 que a LekkeSlaap cobraria pelo mesmo
// líquido, porque 16% < 17,25%.
console.log('\n§4.3 — paridade com a LekkeSlaap (uma noite)');
const parity = quote(82_750, 1, PHASE_RATES.launch);
check('preço listado', parity.listedPerNight, 91_944);
check('hóspede paga', parity.guestTotal, 97_461);
check('anfitrião recebe', parity.hostPayout, 82_750);

// ── Blueprint §5 ─────────────────────────────────────────────────────────────
// Reserva média de 531,00 de subtotal, decomposta por inteiro.
console.log('\n§5 — decomposição da reserva média');
const subtotal = 53_100;
const guestFee = Math.round(subtotal * PHASE_RATES.launch.guest);
const hostFee = Math.round(subtotal * PHASE_RATES.launch.host);
const commissionGross = guestFee + hostFee;
const iva = Math.round((commissionGross * IVA_RATE) / (1 + IVA_RATE));

check('taxa do hóspede (6%)', guestFee, 3_186);
check('taxa do anfitrião (10%)', hostFee, 5_310);
check('comissão bruta (16%)', commissionGross, 8_496);
check('IVA contido (16/116)', iva, 1_172);
check('comissão líquida de IVA', commissionGross - iva, 7_324);
check('hóspede paga', subtotal + guestFee, 56_286);
check('anfitrião recebe', subtotal - hostFee, 47_790);

// Sob ISPC a Bazalá é isenta de IVA (§6.2) — a comissão fica inteira.
console.log('\n§6.2 — sob ISPC não há IVA a entregar');
const ispc = quote(500_000, 3, PHASE_RATES.launch, 0);
assert('IVA a zero', ispc.ivaAmount === 0);
assert('comissão líquida = bruta', ispc.commissionNetOfIva === ispc.commissionGross);

// ── Invariantes ──────────────────────────────────────────────────────────────
// As mesmas que a base de dados impõe por constraint (migração 0009).
console.log('\nInvariantes nas duas fases');
for (const phase of ['launch', 'mature'] as Phase[]) {
  const rates = PHASE_RATES[phase];
  const q = quote(500_000, 3, rates);

  const reconciles =
    q.guestTotal === q.accommodationTotal + q.guestFee &&
    q.hostPayout === q.accommodationTotal - q.hostFee &&
    q.commissionGross === q.guestFee + q.hostFee &&
    q.commissionNetOfIva === q.commissionGross - q.ivaAmount;

  // O total é sempre 16% do subtotal, seja qual for a repartição.
  const takeRate = q.commissionGross / q.accommodationTotal;
  const takeOk = Math.abs(takeRate - 0.16) < 0.0005;

  const ok = reconciles && takeOk;
  if (!ok) failures++;
  console.log(
    `${ok ? 'ok   ' : 'FALHA'} ${phase.padEnd(6)} ` +
      `(${(rates.host * 100).toFixed(0)}% + ${(rates.guest * 100).toFixed(0)}%): ` +
      `total ${(takeRate * 100).toFixed(2)}%, ` +
      `anfitrião recebe ${(q.hostPayout / 100).toFixed(2)}, ` +
      `hóspede paga ${(q.guestTotal / 100).toFixed(2)}`,
  );
}

console.log(
  failures === 0 ? '\nTudo certo.\n' : `\n${failures} verificação(ões) falharam.\n`,
);

process.exitCode = failures === 0 ? 0 : 1;
