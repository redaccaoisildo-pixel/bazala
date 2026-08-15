import type { ListingType } from '@/data/listings';

/**
 * Expressões da interface em português.
 *
 * Só a interface vive aqui. As descrições dos alojamentos são escritas pelos
 * anfitriões e ficam no idioma original (§7.5) — traduzir automaticamente as
 * palavras de um anfitrião mina exactamente o que a plataforma promete.
 *
 * O conteúdo de destino e da fronteira não se traduz de todo: escreve-se de
 * raiz em cada idioma, porque o guia de Tofo para uma família de Gauteng e o
 * guia de Tofo para um residente de Maputo são artigos diferentes.
 */
export const pt = {
  tagline: 'Sinta-se em casa onde quer que vá.',

  exampleWarning:
    'Este site ainda contém alojamentos de exemplo. Substitua-os por alojamentos reais antes de publicar.',

  nav: {
    allListings: 'Todos os alojamentos',
    back: 'Voltar aos alojamentos',
    changeDates: 'Alterar datas',
  },

  home: {
    title: 'Alojamento em Moçambique, reservado com quem recebe.',
    intro:
      'Casas, guesthouses e pensões em Maputo, no Bilene, em Xai-Xai e na costa. Escolha, peça, e falamos consigo antes de haver qualquer pagamento.',
    note: 'Preços em meticais, tudo incluído. O anfitrião recebe em 24 horas, por M-Pesa ou transferência.',
    listingsHeading: 'Alojamentos disponíveis',
  },

  listing: {
    perNight: 'por noite, tudo incluído',
    perNightShort: 'por noite',
    needs4x4: 'Precisa de 4x4',
    needs4x4Long: 'Precisa de 4x4 — o acesso é em areia',
    normalCar: 'Acesso em carro normal',
    noPhoto: 'Sem fotografia',
    /** O idioma em que o anfitrião escreveu, quando não é o desta página. */
    originalLanguage: 'Descrição escrita pelo anfitrião, em português.',
  },

  form: {
    heading: 'Pedir reserva',
    note: 'Vê o preço no passo seguinte. Não paga nada agora.',
    checkIn: 'Entrada',
    checkOut: 'Saída',
    guests: 'Hóspedes',
    submit: 'Ver preço',
  },

  request: {
    metaTitle: 'Pedido de reserva',
    nights: (n: string) => `${n} noites`,
    serviceFee: 'Taxa de serviço',
    total: 'Total',
    reassurance:
      'Não paga nada agora. Confirmamos a disponibilidade consigo e só depois combinamos o pagamento.',
    whatsapp: 'Enviar pedido por WhatsApp',
    whatsappPlaceholder:
      'O número de WhatsApp ainda é o de exemplo. Defina WHATSAPP_NUMBER em data/config.ts antes de publicar.',
    errorTitle: 'Não consegui montar o pedido',
    errorNoListing: 'Não encontrei esse alojamento. Escolha um da lista.',
    errorDates:
      'A data de saída tem de ser depois da data de entrada. Volte atrás e corrija as datas.',
    /** Mensagem pré-preenchida no WhatsApp. */
    message: {
      intro: 'Olá! Quero reservar',
      reference: 'Referência',
      checkIn: 'Entrada',
      checkOut: 'Saída',
      total: 'Total',
    },
  },

  footer: {
    line1: 'alojamento em Moçambique. Preços em meticais.',
    line2: 'Cada pedido é confirmado por uma pessoa antes de haver qualquer pagamento.',
  },

  units: {
    guest: 'hóspede',
    guests: 'hóspedes',
    bedroom: 'quarto',
    bedrooms: 'quartos',
    bathroom: 'casa de banho',
    bathrooms: 'casas de banho',
    night: 'noite',
    nights: 'noites',
  },

  listingTypes: {
    apartamento: 'apartamento',
    guesthouse: 'guesthouse',
    pensão: 'pensão',
    casa: 'casa',
    lodge: 'lodge',
    hotel: 'hotel',
  } satisfies Record<ListingType, string>,
};

export type Dictionary = typeof pt;
