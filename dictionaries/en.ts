import type { Dictionary } from './pt';

/**
 * Interface strings in English.
 *
 * The audience is the inland South African self-drive family (blueprint §1.1),
 * so the register is plain and practical rather than aspirational — these are
 * people who want to know whether the last kilometre is sand.
 *
 * This file is a translation of the interface only. Destination and border
 * content is written from scratch in English (§7.5), never translated.
 */
export const en: Dictionary = {
  tagline: 'Make yourself at home wherever you go.',

  exampleWarning:
    'This site still contains example listings. Replace them with real properties before publishing.',

  nav: {
    allListings: 'All places to stay',
    back: 'Back to all places',
    changeDates: 'Change dates',
  },

  home: {
    title: 'Places to stay in Mozambique, booked with the people who host you.',
    intro:
      'Houses, guesthouses and small lodges in Maputo, Bilene, Xai-Xai and along the coast. Choose one, send a request, and we talk to you before any money changes hands.',
    note: 'Prices in meticais, everything included. Hosts are paid within 24 hours, by M-Pesa or bank transfer.',
    listingsHeading: 'Available places to stay',
  },

  listing: {
    perNight: 'per night, all in',
    perNightShort: 'per night',
    needs4x4: '4x4 needed',
    needs4x4Long: '4x4 needed — the access road is sand',
    normalCar: 'Reachable in a normal car',
    noPhoto: 'No photograph',
    originalLanguage: 'Description written by the host, in Portuguese.',
  },

  form: {
    heading: 'Request a booking',
    note: "You'll see the price on the next step. You pay nothing now.",
    checkIn: 'Check-in',
    checkOut: 'Check-out',
    guests: 'Guests',
    submit: 'See the price',
  },

  request: {
    metaTitle: 'Booking request',
    nights: (n: string) => `${n} nights`,
    serviceFee: 'Service fee',
    total: 'Total',
    reassurance:
      'You pay nothing now. We confirm availability with you first, and only then arrange payment.',
    whatsapp: 'Send request on WhatsApp',
    whatsappPlaceholder:
      'The WhatsApp number is still the example one. Set WHATSAPP_NUMBER in data/config.ts before publishing.',
    errorTitle: "I couldn't put that request together",
    errorNoListing: "I couldn't find that place. Please pick one from the list.",
    errorDates: 'Check-out has to be after check-in. Go back and fix the dates.',
    message: {
      intro: "Hello! I'd like to book",
      reference: 'Reference',
      checkIn: 'Check-in',
      checkOut: 'Check-out',
      total: 'Total',
    },
  },

  footer: {
    line1: 'places to stay in Mozambique. Prices in meticais.',
    line2: 'Every request is confirmed by a person before any money changes hands.',
  },

  units: {
    guest: 'guest',
    guests: 'guests',
    bedroom: 'bedroom',
    bedrooms: 'bedrooms',
    bathroom: 'bathroom',
    bathrooms: 'bathrooms',
    night: 'night',
    nights: 'nights',
  },

  listingTypes: {
    apartamento: 'apartment',
    guesthouse: 'guesthouse',
    // Sem equivalente inglês que não perca o sentido — fica no original.
    pensão: 'pensão',
    casa: 'house',
    lodge: 'lodge',
    hotel: 'hotel',
  },
};
