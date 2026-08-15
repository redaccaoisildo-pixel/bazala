import type { MetadataRoute } from 'next';
import { HAS_EXAMPLE_LISTINGS } from '@/data/listings';

/**
 * Enquanto existir um alojamento de exemplo, o site fica fora dos motores de
 * busca.
 *
 * A mesma bandeira que mostra a faixa de aviso bloqueia a indexação — não há
 * um interruptor separado para alguém se esquecer de desligar no dia do
 * lançamento. O domínio é novo e a estratégia de procura demora meses a
 * compor-se (blueprint §10.2): começar com "Exemplo — Casa no Bilene"
 * indexado seria uma má primeira impressão que custa a apagar.
 */
export default function robots(): MetadataRoute.Robots {
  if (HAS_EXAMPLE_LISTINGS) {
    return { rules: { userAgent: '*', disallow: '/' } };
  }

  return { rules: { userAgent: '*', allow: '/' } };
}
