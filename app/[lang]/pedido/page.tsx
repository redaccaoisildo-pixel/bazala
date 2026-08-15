import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  COMMISSION_PHASE,
  WHATSAPP_IS_PLACEHOLDER,
  WHATSAPP_NUMBER,
} from '@/data/config';
import { getListing } from '@/data/listings';
import { getDictionary, type Dictionary } from '@/dictionaries';
import { formatDate, formatMzn, plural } from '@/lib/format';
import { isLocale, type Locale } from '@/lib/i18n';
import { PHASE_RATES, nightsBetween, quote } from '@/lib/pricing';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  return { title: getDictionary(lang).request.metaTitle, robots: { index: false } };
}

type SearchParams = {
  alojamento?: string;
  entrada?: string;
  saida?: string;
  hospedes?: string;
};

function Problem({
  locale,
  t,
  children,
}: {
  locale: Locale;
  t: Dictionary;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h1 className="text-2xl font-semibold text-dark">{t.request.errorTitle}</h1>
      <p className="mt-3 text-dark">{children}</p>
      <Link href={`/${locale}`} className="mt-6 inline-block text-primary-ink">
        ← {t.nav.back}
      </Link>
    </div>
  );
}

export default async function PedidoPage({
  params,
  searchParams,
}: {
  params: Promise<{ lang: string }>;
  searchParams: Promise<SearchParams>;
}) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();

  const t = getDictionary(lang);
  const sp = await searchParams;

  const listing = sp.alojamento ? getListing(sp.alojamento) : undefined;
  if (!listing) {
    return (
      <Problem locale={lang} t={t}>
        {t.request.errorNoListing}
      </Problem>
    );
  }

  const checkIn = sp.entrada ?? '';
  const checkOut = sp.saida ?? '';
  const nights = nightsBetween(checkIn, checkOut);

  if (nights < 1) {
    return (
      <Problem locale={lang} t={t}>
        {t.request.errorDates}
      </Problem>
    );
  }

  const guests = Math.min(
    Math.max(Number.parseInt(sp.hospedes ?? '2', 10) || 2, 1),
    listing.maxGuests,
  );

  const rates = PHASE_RATES[COMMISSION_PHASE];
  const q = quote(listing.hostNetPerNight, nights, rates);

  // A mensagem leva a referência do alojamento, as datas e o total. É essa a
  // medição da Fase 0: o histórico do WhatsApp diz o que gerou procura, sem
  // precisar de analytics nenhum.
  const m = t.request.message;
  const message = [
    `${m.intro}: ${listing.name}`,
    `${m.reference}: ${listing.slug}`,
    `${m.checkIn}: ${formatDate(checkIn, lang)}`,
    `${m.checkOut}: ${formatDate(checkOut, lang)}`,
    `${plural(nights, t.units.night, t.units.nights)}, ${plural(guests, t.units.guest, t.units.guests)}`,
    `${m.total}: ${formatMzn(q.guestTotal, lang)}`,
  ].join('\n');

  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight text-dark">{listing.name}</h1>
      <p className="mt-1 text-sm text-mute">
        {listing.city}
        {listing.neighbourhood ? ` · ${listing.neighbourhood}` : ''}
      </p>

      <dl className="mt-6 rounded-[--radius-card] border border-rule bg-sand p-4 text-sm">
        <div className="flex justify-between py-1">
          <dt className="text-mute">{t.form.checkIn}</dt>
          <dd className="font-medium text-dark">{formatDate(checkIn, lang)}</dd>
        </div>
        <div className="flex justify-between py-1">
          <dt className="text-mute">{t.form.checkOut}</dt>
          <dd className="font-medium text-dark">{formatDate(checkOut, lang)}</dd>
        </div>
        <div className="flex justify-between py-1">
          <dt className="text-mute">{t.form.guests}</dt>
          <dd className="font-medium text-dark">{guests}</dd>
        </div>

        <div className="my-3 border-t border-rule" />

        <div className="flex justify-between py-1">
          <dt className="text-mute">
            {formatMzn(q.listedPerNight, lang)} ×{' '}
            {plural(nights, t.units.night, t.units.nights)}
          </dt>
          <dd className="text-dark">{formatMzn(q.accommodationTotal, lang)}</dd>
        </div>
        {q.guestFee > 0 && (
          <div className="flex justify-between py-1">
            <dt className="text-mute">{t.request.serviceFee}</dt>
            <dd className="text-dark">{formatMzn(q.guestFee, lang)}</dd>
          </div>
        )}

        <div className="my-3 border-t border-rule" />

        <div className="flex justify-between py-1 text-base">
          <dt className="font-medium text-dark">{t.request.total}</dt>
          <dd className="font-semibold text-dark">{formatMzn(q.guestTotal, lang)}</dd>
        </div>
      </dl>

      <p className="mt-4 text-sm text-mute">{t.request.reassurance}</p>

      {WHATSAPP_IS_PLACEHOLDER ? (
        <p className="mt-6 rounded-md bg-dark px-4 py-3 text-sm text-paper">
          {t.request.whatsappPlaceholder}
        </p>
      ) : (
        <a
          href={whatsappUrl}
          className="mt-6 flex items-center justify-center rounded-md bg-primary px-4 py-3 font-medium text-white no-underline hover:bg-primary-hover"
        >
          {t.request.whatsapp}
        </a>
      )}

      <p className="mt-6">
        <Link href={`/${lang}/alojamento/${listing.slug}`} className="text-primary-ink">
          ← {t.nav.changeDates}
        </Link>
      </p>
    </div>
  );
}
