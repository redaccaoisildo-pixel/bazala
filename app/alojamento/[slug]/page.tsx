import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { BookingRequestForm } from '@/components/BookingRequestForm';
import { Photo } from '@/components/Photo';
import { COMMISSION_PHASE } from '@/data/config';
import { LISTINGS, getListing } from '@/data/listings';
import { formatMzn, plural } from '@/lib/format';
import { PHASE_RATES, quote } from '@/lib/pricing';

type Params = { slug: string };

export function generateStaticParams(): Params[] {
  return LISTINGS.map((l) => ({ slug: l.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const listing = getListing(slug);
  if (!listing) return {};

  return {
    title: `${listing.name} — ${listing.city}`,
    description: listing.description.slice(0, 160),
  };
}

export default async function ListingPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const listing = getListing(slug);
  if (!listing) notFound();

  const rates = PHASE_RATES[COMMISSION_PHASE];
  const oneNight = quote(listing.hostNetPerNight, 1, rates);

  return (
    <article>
      <Link href="/" className="text-sm text-primary-ink">
        ← Todos os alojamentos
      </Link>

      <header className="mt-4">
        <p className="text-sm text-mute">
          {listing.city}
          {listing.neighbourhood ? ` · ${listing.neighbourhood}` : ''} ·{' '}
          {listing.province}
        </p>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight text-dark sm:text-3xl">
          {listing.name}
        </h1>
      </header>

      <div className="mt-5">
        <Photo src={listing.photos[0]} alt={listing.name} priority />
      </div>

      {listing.photos.length > 1 && (
        <div className="mt-3 grid grid-cols-2 gap-3">
          {listing.photos.slice(1).map((src, i) => (
            <Photo key={src} src={src} alt={`${listing.name} — foto ${i + 2}`} />
          ))}
        </div>
      )}

      <section className="mt-6">
        <p className="text-dark">
          {listing.type} · {plural(listing.maxGuests, 'hóspede', 'hóspedes')} ·{' '}
          {plural(listing.bedrooms, 'quarto', 'quartos')} ·{' '}
          {plural(listing.bathrooms, 'casa de banho', 'casas de banho')}
        </p>

        {/* Decide a reserva de quem vem de carro. Aviso, não característica. */}
        <p className={`mt-2 text-sm ${listing.requires4x4 ? 'font-medium text-primary-ink' : 'text-mute'}`}>
          {listing.requires4x4
            ? 'Precisa de 4x4 — o acesso é em areia'
            : 'Acesso em carro normal'}
        </p>

        <p className="mt-4 max-w-prose text-dark">{listing.description}</p>

        {listing.amenities.length > 0 && (
          <ul className="mt-5 flex flex-wrap gap-2">
            {listing.amenities.map((a) => (
              <li
                key={a}
                className="rounded-full border border-rule px-3 py-1 text-sm text-dark"
              >
                {a}
              </li>
            ))}
          </ul>
        )}

        <p className="mt-6 text-lg font-medium text-dark">
          {formatMzn(oneNight.guestTotal)}{' '}
          <span className="text-base font-normal text-mute">
            por noite, tudo incluído
          </span>
        </p>
      </section>

      <div className="mt-8">
        <BookingRequestForm listing={listing} />
      </div>
    </article>
  );
}
