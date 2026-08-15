import type { Metadata } from 'next';
import Link from 'next/link';
import { COMMISSION_PHASE, WHATSAPP_IS_PLACEHOLDER, WHATSAPP_NUMBER } from '@/data/config';
import { getListing } from '@/data/listings';
import { formatDate, formatMzn, plural } from '@/lib/format';
import { PHASE_RATES, nightsBetween, quote } from '@/lib/pricing';

export const metadata: Metadata = {
  title: 'Pedido de reserva',
  robots: { index: false },
};

type SearchParams = {
  alojamento?: string;
  entrada?: string;
  saida?: string;
  hospedes?: string;
};

function Problem({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <h1 className="text-2xl font-semibold text-dark">Não consegui montar o pedido</h1>
      <p className="mt-3 text-dark">{children}</p>
      <Link href="/" className="mt-6 inline-block text-primary-ink">
        ← Voltar aos alojamentos
      </Link>
    </div>
  );
}

export default async function PedidoPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const sp = await searchParams;

  const listing = sp.alojamento ? getListing(sp.alojamento) : undefined;
  if (!listing) {
    return <Problem>Não encontrei esse alojamento. Escolha um da lista.</Problem>;
  }

  const checkIn = sp.entrada ?? '';
  const checkOut = sp.saida ?? '';
  const nights = nightsBetween(checkIn, checkOut);

  if (nights < 1) {
    return (
      <Problem>
        A data de saída tem de ser depois da data de entrada. Volte atrás e
        corrija as datas.
      </Problem>
    );
  }

  const guests = Math.min(
    Math.max(Number.parseInt(sp.hospedes ?? '2', 10) || 2, 1),
    listing.maxGuests,
  );

  const rates = PHASE_RATES[COMMISSION_PHASE];
  const q = quote(listing.hostNetPerNight, nights, rates);

  const message = [
    `Olá! Quero reservar: ${listing.name}`,
    `Referência: ${listing.slug}`,
    `Entrada: ${formatDate(checkIn)}`,
    `Saída: ${formatDate(checkOut)}`,
    `${plural(nights, 'noite', 'noites')}, ${plural(guests, 'hóspede', 'hóspedes')}`,
    `Total: ${formatMzn(q.guestTotal)}`,
  ].join('\n');

  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight text-dark">
        {listing.name}
      </h1>
      <p className="mt-1 text-sm text-mute">
        {listing.city}
        {listing.neighbourhood ? ` · ${listing.neighbourhood}` : ''}
      </p>

      <dl className="mt-6 rounded-[--radius-card] border border-rule bg-sand p-4 text-sm">
        <div className="flex justify-between py-1">
          <dt className="text-mute">Entrada</dt>
          <dd className="font-medium text-dark">{formatDate(checkIn)}</dd>
        </div>
        <div className="flex justify-between py-1">
          <dt className="text-mute">Saída</dt>
          <dd className="font-medium text-dark">{formatDate(checkOut)}</dd>
        </div>
        <div className="flex justify-between py-1">
          <dt className="text-mute">Hóspedes</dt>
          <dd className="font-medium text-dark">{guests}</dd>
        </div>

        <div className="my-3 border-t border-rule" />

        <div className="flex justify-between py-1">
          <dt className="text-mute">
            {formatMzn(q.listedPerNight)} × {plural(nights, 'noite', 'noites')}
          </dt>
          <dd className="text-dark">{formatMzn(q.accommodationTotal)}</dd>
        </div>
        {q.guestFee > 0 && (
          <div className="flex justify-between py-1">
            <dt className="text-mute">Taxa de serviço</dt>
            <dd className="text-dark">{formatMzn(q.guestFee)}</dd>
          </div>
        )}

        <div className="my-3 border-t border-rule" />

        <div className="flex justify-between py-1 text-base">
          <dt className="font-medium text-dark">Total</dt>
          <dd className="font-semibold text-dark">{formatMzn(q.guestTotal)}</dd>
        </div>
      </dl>

      <p className="mt-4 text-sm text-mute">
        Não paga nada agora. Confirmamos a disponibilidade consigo e só depois
        combinamos o pagamento.
      </p>

      {WHATSAPP_IS_PLACEHOLDER ? (
        <p className="mt-6 rounded-md bg-dark px-4 py-3 text-sm text-white">
          O número de WhatsApp ainda é o de exemplo. Defina{' '}
          <code>WHATSAPP_NUMBER</code> em <code>data/config.ts</code> antes de
          publicar.
        </p>
      ) : (
        <a
          href={whatsappUrl}
          className="mt-6 flex items-center justify-center rounded-md bg-primary px-4 py-3 font-medium text-white no-underline hover:bg-primary-hover"
        >
          Enviar pedido por WhatsApp
        </a>
      )}

      <p className="mt-6">
        <Link href={`/alojamento/${listing.slug}`} className="text-primary-ink">
          ← Alterar datas
        </Link>
      </p>
    </div>
  );
}
