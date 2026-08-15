import Link from 'next/link';
import { Photo } from '@/components/Photo';
import { COMMISSION_PHASE } from '@/data/config';
import type { Listing } from '@/data/listings';
import type { Dictionary } from '@/dictionaries';
import { formatMzn, plural } from '@/lib/format';
import type { Locale } from '@/lib/i18n';
import { PHASE_RATES, quote } from '@/lib/pricing';

export function ListingCard({
  listing,
  locale,
  t,
  priority = false,
}: {
  listing: Listing;
  locale: Locale;
  t: Dictionary;
  priority?: boolean;
}) {
  const rates = PHASE_RATES[COMMISSION_PHASE];
  const oneNight = quote(listing.hostNetPerNight, 1, rates);

  return (
    <article className="border-b border-rule pb-6 last:border-0">
      <Link href={`/${locale}/alojamento/${listing.slug}`} className="block no-underline">
        <Photo src={listing.photos[0]} alt={listing.name} label={t.listing.noPhoto} priority={priority} />

        <div className="mt-3">
          <p className="text-sm text-mute">
            {listing.city}
            {listing.neighbourhood ? ` · ${listing.neighbourhood}` : ''}
          </p>

          <h2 className="mt-1 text-lg font-semibold text-dark">{listing.name}</h2>

          <p className="mt-1 text-sm text-mute">
            {t.listingTypes[listing.type]} ·{' '}
            {plural(listing.maxGuests, t.units.guest, t.units.guests)} ·{' '}
            {plural(listing.bedrooms, t.units.bedroom, t.units.bedrooms)}
          </p>

          {listing.requires4x4 && (
            <p className="mt-1 text-sm font-medium text-primary-ink">
              {t.listing.needs4x4}
            </p>
          )}

          <p className="mt-2 font-medium text-dark">
            {formatMzn(oneNight.guestTotal, locale)}{' '}
            <span className="font-normal text-mute">{t.listing.perNight}</span>
          </p>
        </div>
      </Link>
    </article>
  );
}
