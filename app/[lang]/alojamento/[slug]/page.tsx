import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { BookingRequestForm } from '@/components/BookingRequestForm';
import { LanguageSwitch } from '@/components/LanguageSwitch';
import { Photo } from '@/components/Photo';
import { COMMISSION_PHASE } from '@/data/config';
import { LISTINGS, getListing } from '@/data/listings';
import { getDictionary } from '@/dictionaries';
import { formatMzn, plural } from '@/lib/format';
import { LOCALES, LOCALE_TAGS, isLocale } from '@/lib/i18n';
import { PHASE_RATES, quote } from '@/lib/pricing';

type Params = { lang: string; slug: string };

export function generateStaticParams() {
  return LISTINGS.map((l) => ({ slug: l.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { lang, slug } = await params;
  const listing = getListing(slug);
  if (!listing || !isLocale(lang)) return {};

  const description = (lang === 'en' && listing.descriptionEn) || listing.description;

  return {
    title: `${listing.name} — ${listing.city}`,
    description: description.slice(0, 160),
    alternates: {
      canonical: `/${lang}/alojamento/${slug}`,
      languages: Object.fromEntries(
        LOCALES.map((l) => [LOCALE_TAGS[l], `/${l}/alojamento/${slug}`]),
      ),
    },
  };
}

export default async function ListingPage({ params }: { params: Promise<Params> }) {
  const { lang, slug } = await params;
  if (!isLocale(lang)) notFound();

  const listing = getListing(slug);
  if (!listing) notFound();

  const t = getDictionary(lang);
  const rates = PHASE_RATES[COMMISSION_PHASE];
  const oneNight = quote(listing.hostNetPerNight, 1, rates);

  // A descrição do anfitrião fica no idioma original quando não há versão
  // traduzida por ele (blueprint §7.5). Nunca tradução automática.
  const hasOwnTranslation = lang === 'pt' || Boolean(listing.descriptionEn);
  const description = (lang === 'en' && listing.descriptionEn) || listing.description;

  return (
    <article>
      <div className="mb-4 flex items-center justify-between gap-4">
        <Link href={`/${lang}`} className="text-sm text-primary-ink">
          ← {t.nav.allListings}
        </Link>
        <LanguageSwitch current={lang} path={`/alojamento/${slug}`} />
      </div>

      <header>
        <p className="text-sm text-mute">
          {listing.city}
          {listing.neighbourhood ? ` · ${listing.neighbourhood}` : ''} · {listing.province}
        </p>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight text-dark sm:text-3xl">
          {listing.name}
        </h1>
      </header>

      <div className="mt-5">
        <Photo src={listing.photos[0]} alt={listing.name} label={t.listing.noPhoto} priority />
      </div>

      {listing.photos.length > 1 && (
        <div className="mt-3 grid grid-cols-2 gap-3">
          {listing.photos.slice(1).map((src, i) => (
            <Photo
              key={src}
              src={src}
              alt={`${listing.name} — ${i + 2}`}
              label={t.listing.noPhoto}
            />
          ))}
        </div>
      )}

      <section className="mt-6">
        <p className="text-dark">
          {t.listingTypes[listing.type]} ·{' '}
          {plural(listing.maxGuests, t.units.guest, t.units.guests)} ·{' '}
          {plural(listing.bedrooms, t.units.bedroom, t.units.bedrooms)} ·{' '}
          {plural(listing.bathrooms, t.units.bathroom, t.units.bathrooms)}
        </p>

        {/* Decide a reserva de quem vem de carro. Aviso, não característica. */}
        <p
          className={`mt-2 text-sm ${
            listing.requires4x4 ? 'font-medium text-primary-ink' : 'text-mute'
          }`}
        >
          {listing.requires4x4 ? t.listing.needs4x4Long : t.listing.normalCar}
        </p>

        <p className="mt-4 max-w-prose text-dark" lang={hasOwnTranslation ? undefined : 'pt'}>
          {description}
        </p>
        {!hasOwnTranslation && (
          <p className="mt-2 text-xs text-mute">{t.listing.originalLanguage}</p>
        )}

        {listing.amenities.length > 0 && (
          <ul className="mt-5 flex flex-wrap gap-2">
            {listing.amenities.map((a) => (
              <li
                key={a}
                className="rounded-full border border-rule px-3 py-1 text-sm text-dark"
                lang="pt"
              >
                {a}
              </li>
            ))}
          </ul>
        )}

        <p className="mt-6 text-lg font-medium text-dark">
          {formatMzn(oneNight.guestTotal, lang)}{' '}
          <span className="text-base font-normal text-mute">{t.listing.perNight}</span>
        </p>
      </section>

      <div className="mt-8">
        <BookingRequestForm listing={listing} locale={lang} t={t} />
      </div>
    </article>
  );
}
