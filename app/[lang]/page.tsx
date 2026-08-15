import { notFound } from 'next/navigation';
import { LanguageSwitch } from '@/components/LanguageSwitch';
import { ListingCard } from '@/components/ListingCard';
import { LISTINGS } from '@/data/listings';
import { getDictionary } from '@/dictionaries';
import { isLocale } from '@/lib/i18n';

export default async function HomePage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();

  const t = getDictionary(lang);

  return (
    <>
      <div className="mb-6 flex justify-end">
        <LanguageSwitch current={lang} path="" />
      </div>

      <section className="mb-10">
        <h1 className="text-3xl font-semibold tracking-tight text-dark sm:text-4xl">
          {t.home.title}
        </h1>
        <p className="mt-4 max-w-prose text-dark">{t.home.intro}</p>
        <p className="mt-3 max-w-prose text-sm text-mute">{t.home.note}</p>
      </section>

      <section aria-labelledby="alojamentos">
        <h2 id="alojamentos" className="sr-only">
          {t.home.listingsHeading}
        </h2>

        <div className="grid gap-8">
          {LISTINGS.map((listing, i) => (
            <ListingCard
              key={listing.slug}
              listing={listing}
              locale={lang}
              t={t}
              priority={i === 0}
            />
          ))}
        </div>
      </section>
    </>
  );
}
