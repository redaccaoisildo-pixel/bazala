import { ListingCard } from '@/components/ListingCard';
import { LISTINGS } from '@/data/listings';

export default function HomePage() {
  return (
    <>
      <section className="mb-10">
        <h1 className="text-3xl font-semibold tracking-tight text-dark sm:text-4xl">
          Alojamento em Moçambique, reservado com quem recebe.
        </h1>
        <p className="mt-4 max-w-prose text-dark">
          Casas, guesthouses e pensões em Maputo, no Bilene, em Xai-Xai e na
          costa. Escolhe, pede, e falamos consigo antes de haver qualquer
          pagamento.
        </p>
        <p className="mt-3 max-w-prose text-sm text-mute">
          Preços em meticais, tudo incluído. O anfitrião recebe em 24 horas,
          por M-Pesa ou transferência.
        </p>
      </section>

      <section aria-labelledby="alojamentos">
        <h2 id="alojamentos" className="sr-only">
          Alojamentos disponíveis
        </h2>

        <div className="grid gap-8">
          {LISTINGS.map((listing, i) => (
            <ListingCard key={listing.slug} listing={listing} priority={i === 0} />
          ))}
        </div>
      </section>
    </>
  );
}
