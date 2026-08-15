import type { Phase } from '@/lib/pricing';

/**
 * Configuração da Fase 0.
 *
 * A Fase 0 é validação manual (blueprint §8.1): não há base de dados, não há
 * pagamentos, não há contas. O site mostra alojamentos reais e encaminha cada
 * pedido para o WhatsApp do fundador, que fecha a reserva à mão.
 *
 * Gate 1 (blueprint §8.1): só se avança para o MVP com 15 anfitriões
 * comprometidos E 3 reservas pagas intermediadas manualmente.
 */

export const SITE = {
  /** Em prosa escreve-se com maiúscula; o logótipo é minúsculo (ver layout). */
  name: 'Bazalá',
  tagline: 'Sinta-se em casa onde quer que vá.',
  description:
    'Alojamento em Moçambique reservado directamente com quem recebe. ' +
    'Casas, guesthouses e pensões em Maputo, no Bilene, em Xai-Xai e na costa.',
  url: 'https://bazala.co.mz',
  locale: 'pt-MZ',
} as const;

/**
 * Número de WhatsApp que recebe os pedidos, em formato internacional sem '+'.
 * SUBSTITUIR antes de publicar.
 */
export const WHATSAPP_NUMBER = '258000000000';

/** Sinaliza que o número ainda é o de exemplo. */
export const WHATSAPP_IS_PLACEHOLDER = WHATSAPP_NUMBER === '258000000000';

/**
 * Fase de comissão em vigor (blueprint §4.2).
 *
 *   launch — 10% anfitrião + 6% hóspede
 *   mature — 16% anfitrião + 0% hóspede
 *
 * O total é sempre 16%. Passa-se a `mature` quando a Bazalá for o canal
 * dominante do anfitrião — medido, não adivinhado.
 */
export const COMMISSION_PHASE: Phase = 'launch';
