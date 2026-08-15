/**
 * Alojamentos da Fase 0.
 *
 * ┌──────────────────────────────────────────────────────────────────────────┐
 * │  AS ENTRADAS ABAIXO SÃO EXEMPLOS. Substituir por alojamentos reais antes │
 * │  de publicar, e apagar o campo `example` de cada uma.                     │
 * │  Enquanto existir uma entrada com `example: true`, o site mostra um aviso.│
 * └──────────────────────────────────────────────────────────────────────────┘
 *
 * Objectivo da Fase 0: 15 alojamentos reais, com fotos reais e preços reais
 * (blueprint §8.1). Três deles em destinos domésticos — Bilene, Xai-Xai — para
 * testar a hipótese de que o moçambicano viaja e reservaria online (§1.1).
 * Essa hipótese é a coisa mais barata de testar em todo o plano.
 *
 * `hostNetPerNight` é o que o anfitrião quer RECEBER, em centavos de metical.
 * Nunca é o preço ao público: esse é calculado (blueprint §4.3).
 */

export type ListingType =
  | 'apartamento'
  | 'guesthouse'
  | 'pensão'
  | 'casa'
  | 'lodge'
  | 'hotel';

export type Listing = {
  slug: string;
  name: string;
  type: ListingType;
  city: string;
  province: string;
  neighbourhood?: string;
  maxGuests: number;
  bedrooms: number;
  bathrooms: number;
  /** O que o anfitrião quer receber por noite, em centavos de MZN. */
  hostNetPerNight: number;
  /**
   * Os acessos a Ponta do Ouro e à Reserva Especial de Maputo são de areia.
   * É a pergunta que decide a reserva para quem vem de carro da África do Sul,
   * e nenhuma plataforma global tem campo para ela. Obrigatório de propósito:
   * quem introduz o alojamento tem de decidir, não pode deixar em branco.
   */
  requires4x4: boolean;
  amenities: string[];
  description: string;
  /** Caminhos em /public/listings/. Vazio mostra um marcador. */
  photos: string[];
  hostFirstName: string;
  /**
   * Marca as três entradas que testam o segmento doméstico (§1.1).
   * Serve para separar os pedidos e saber de onde vieram.
   */
  hypothesis?: 'domestico';
  /** Remover quando a entrada for substituída por um alojamento real. */
  example?: boolean;
};

export const LISTINGS: Listing[] = [
  {
    slug: 'exemplo-apartamento-polana',
    name: 'Exemplo — Apartamento na Polana',
    type: 'apartamento',
    city: 'Maputo',
    province: 'Maputo Cidade',
    neighbourhood: 'Polana',
    maxGuests: 4,
    bedrooms: 2,
    bathrooms: 1,
    hostNetPerNight: 550_000,
    requires4x4: false,
    amenities: ['Wi-Fi', 'Ar condicionado', 'Cozinha', 'Estacionamento'],
    description:
      'Entrada de exemplo. Substituir pelo texto do anfitrião real: o que é a casa, ' +
      'o que a rodeia, e a que distância fica do que interessa a quem chega.',
    photos: [],
    hostFirstName: 'Anfitrião',
    example: true,
  },
  {
    slug: 'exemplo-guesthouse-sommerschield',
    name: 'Exemplo — Guesthouse em Sommerschield',
    type: 'guesthouse',
    city: 'Maputo',
    province: 'Maputo Cidade',
    neighbourhood: 'Sommerschield',
    maxGuests: 2,
    bedrooms: 1,
    bathrooms: 1,
    hostNetPerNight: 380_000,
    requires4x4: false,
    amenities: ['Wi-Fi', 'Pequeno-almoço', 'Ar condicionado'],
    description:
      'Entrada de exemplo. Este é o segmento que interessa: guesthouses e pensões ' +
      'que hoje não estão listadas em plataforma nenhuma.',
    photos: [],
    hostFirstName: 'Anfitrião',
    example: true,
  },
  {
    slug: 'exemplo-pensao-baixa',
    name: 'Exemplo — Pensão na Baixa',
    type: 'pensão',
    city: 'Maputo',
    province: 'Maputo Cidade',
    neighbourhood: 'Baixa',
    maxGuests: 2,
    bedrooms: 1,
    bathrooms: 1,
    hostNetPerNight: 220_000,
    requires4x4: false,
    amenities: ['Wi-Fi', 'Ventoinha'],
    description:
      'Entrada de exemplo. Escalão de preço para viajante de negócios e ' +
      'trabalhador em deslocação — reserva curta, repetida, paga por empresa.',
    photos: [],
    hostFirstName: 'Anfitrião',
    example: true,
  },

  // ── Teste do segmento doméstico (blueprint §1.1 e §8.1) ──────────────────
  {
    slug: 'exemplo-casa-bilene',
    name: 'Exemplo — Casa no Bilene',
    type: 'casa',
    city: 'Bilene',
    province: 'Gaza',
    maxGuests: 6,
    bedrooms: 3,
    bathrooms: 2,
    hostNetPerNight: 450_000,
    requires4x4: false,
    amenities: ['Wi-Fi', 'Cozinha', 'Churrasqueira', 'Estacionamento'],
    description:
      'Entrada de exemplo. Destino de fim-de-semana a partir de Maputo — é aqui ' +
      'que se testa se o moçambicano reserva online ou continua a telefonar.',
    photos: [],
    hostFirstName: 'Anfitrião',
    hypothesis: 'domestico',
    example: true,
  },
  {
    slug: 'exemplo-casa-xai-xai',
    name: 'Exemplo — Casa em Xai-Xai',
    type: 'casa',
    city: 'Xai-Xai',
    province: 'Gaza',
    maxGuests: 8,
    bedrooms: 4,
    bathrooms: 2,
    hostNetPerNight: 520_000,
    requires4x4: false,
    amenities: ['Cozinha', 'Churrasqueira', 'Estacionamento'],
    description: 'Entrada de exemplo. Segundo ponto do teste doméstico.',
    photos: [],
    hostFirstName: 'Anfitrião',
    hypothesis: 'domestico',
    example: true,
  },
  {
    slug: 'exemplo-casa-ponta-do-ouro',
    name: 'Exemplo — Casa em Ponta do Ouro',
    type: 'casa',
    city: 'Ponta do Ouro',
    province: 'Maputo',
    maxGuests: 6,
    bedrooms: 3,
    bathrooms: 2,
    hostNetPerNight: 850_000,
    requires4x4: true,
    amenities: ['Wi-Fi', 'Cozinha', 'Churrasqueira', 'Estacionamento'],
    description:
      'Entrada de exemplo. Mercado onde a LekkeSlaap e a SafariNow já estão — ' +
      'e onde o argumento é pagamento em meticais em 24 horas, não preço.',
    photos: [],
    hostFirstName: 'Anfitrião',
    hypothesis: 'domestico',
    example: true,
  },
];

export const HAS_EXAMPLE_LISTINGS = LISTINGS.some((l) => l.example);

export function getListing(slug: string): Listing | undefined {
  return LISTINGS.find((l) => l.slug === slug);
}

/** Cidades presentes, pela ordem em que aparecem nos alojamentos. */
export function cities(): string[] {
  return [...new Set(LISTINGS.map((l) => l.city))];
}
