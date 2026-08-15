import Link from 'next/link';
import { Photo } from '@/components/Photo';
import type { Listing } from '@/data/listings';
import { formatMzn, plural } from '@/lib/format';
import { PHASE_RATES, quote } from '@/lib/pricing';
import { COMMISSION_PHASE } from '@/data/config';

export function ListingCard({
  listing,
  priority = false,
}: {
  listing: Listing;
  priority?: boolean;
}) {
  const rates = PHASE_RATES[COMMISSION_PHASE];
  const oneNight = quote(listing.hostNetPerNight, 1, rates);

  return (
    <article className="border-b border-rule pb-6 last:border-0">
      <Link href={`/alojamento/${listing.slug}`} className="block no-underline">
        <Photo src={listing.photos[0]} alt={listing.name} priority={priority} />

        <div className="mt-3">
          <p className="text-sm text-mute">
            {listing.city}
            {listing.neighbourhood ? ` · ${listing.neighbourhood}` : ''}
          </p>

          <h2 className="mt-1 text-lg font-semibold text-dark">{listing.name}</h2>

          <p className="mt-1 text-sm text-mute">
            {listing.type} · {plural(listing.maxGuests, 'hóspede', 'hóspedes')} ·{' '}
            {plural(listing.bedrooms, 'quarto', 'quartos')}
          </p>

          {listing.requires4x4 && (
            <p className="mt-1 text-sm font-medium text-primary-ink">Precisa de 4x4</p>
          )}

          <p className="mt-2 font-medium text-dark">
            {formatMzn(oneNight.guestTotal)}{' '}
            <span className="font-normal text-mute">por noite, tudo incluído</span>
          </p>
        </div>
      </Link>
    </article>
  );
}
