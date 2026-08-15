import type { Listing } from '@/data/listings';

/**
 * Pedido de reserva — Fase 0.
 *
 * Um formulário HTML simples que faz GET para /pedido. Sem JavaScript: o
 * dispositivo alvo é um Android de gama média em 3G, e um formulário nativo
 * funciona em todos eles, com teclado de data do próprio sistema.
 *
 * Não recolhe nome nem telefone. O pedido segue por GET, e dados pessoais não
 * entram em URLs — o visitante identifica-se no WhatsApp, que é onde a
 * conversa acontece de qualquer maneira.
 */
export function BookingRequestForm({ listing }: { listing: Listing }) {
  const today = new Date().toISOString().slice(0, 10);

  return (
    <form
      action="/pedido"
      method="get"
      className="rounded-[--radius-card] border border-rule bg-sand p-4"
    >
      <input type="hidden" name="alojamento" value={listing.slug} />

      <h2 className="text-base font-semibold text-dark">Pedir reserva</h2>
      <p className="mt-1 text-sm text-mute">
        Vê o preço no passo seguinte. Não paga nada agora.
      </p>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <label className="block text-sm">
          <span className="mb-1 block font-medium text-dark">Entrada</span>
          <input
            type="date"
            name="entrada"
            required
            min={today}
            className="w-full rounded-md border border-rule bg-paper px-3 py-2"
          />
        </label>

        <label className="block text-sm">
          <span className="mb-1 block font-medium text-dark">Saída</span>
          <input
            type="date"
            name="saida"
            required
            min={today}
            className="w-full rounded-md border border-rule bg-paper px-3 py-2"
          />
        </label>
      </div>

      <label className="mt-4 block text-sm">
        <span className="mb-1 block font-medium text-dark">Hóspedes</span>
        <select
          name="hospedes"
          defaultValue="2"
          className="w-full rounded-md border border-rule bg-paper px-3 py-2"
        >
          {Array.from({ length: listing.maxGuests }, (_, i) => i + 1).map((n) => (
            <option key={n} value={n}>
              {n}
            </option>
          ))}
        </select>
      </label>

      <button
        type="submit"
        className="mt-5 w-full rounded-md bg-primary px-4 py-3 font-medium text-white hover:bg-primary-hover"
      >
        Ver preço
      </button>
    </form>
  );
}
