# Bazalá

Marketplace de alojamento em Moçambique. **É pertinho.**

Este repositório está na **Fase 0** do plano: validação manual antes de
construir o motor de reservas. A estratégia completa está em
`Bazala_Platform_Blueprint_v3.md`.

---

## O que está aqui

| | |
|---|---|
| **Site da Fase 0** | Next.js 15 + Tailwind 4. Alojamentos vindos de um ficheiro, pedido de reserva encaminhado para WhatsApp. Sem base de dados, sem pagamentos, sem contas. |
| **Schema do Supabase** | `supabase/migrations/` — o schema completo do MVP, pronto para quando o Gate 1 passar. Ainda não é usado pelo site. |
| **Modelo de comissão** | `lib/pricing.ts` — as três fases, o IVA, e a conversão de líquido do anfitrião em preço ao hóspede. |

## Correr localmente

```bash
npm install
```

```bash
npm run dev
```

Verificar a aritmética de comissão contra os números da blueprint:

```bash
npm run check:pricing
```

---

## Antes de publicar

Três coisas, por ordem. Enquanto a primeira e a segunda não estiverem feitas,
o site mostra avisos visíveis em vez de fingir que está pronto.

**1. Substituir os alojamentos de exemplo.**
Editar `data/listings.ts`. O objectivo da Fase 0 são **15 alojamentos reais**,
com fotos reais e preços reais. Apagar o campo `example: true` de cada entrada
substituída. Fotos vão para `public/listings/`.

Três das entradas estão marcadas `hypothesis: 'domestico'` — Bilene, Xai-Xai,
Ponta do Ouro. São o teste barato da hipótese de que o moçambicano viaja e
reservaria online (blueprint §1.1). Manter pelo menos três destinos domésticos.

**2. Definir o número de WhatsApp.**
`WHATSAPP_NUMBER` em `data/config.ts`, em formato internacional sem `+`.

**3. Confirmar os preços.**
`hostNetPerNight` é o que o anfitrião quer **receber**, em centavos de metical.
Não é o preço ao público — esse é calculado. Perguntar sempre ao anfitrião
*"quanto quer receber por noite?"*, nunca *"quanto quer cobrar?"*.

---

## Como funciona o preço

Uma regra explica quase tudo: **o anfitrião indica o líquido, a Bazalá calcula
o resto.** É isto que faz com que uma comissão baixa do lado do anfitrião
apareça onde interessa — no preço exibido — em vez de ser absorvida.

O total é sempre **16%**, inclusivo de IVA. O que muda entre fases é a
repartição:

| Fase | Anfitrião | Hóspede | Quando |
|---|---|---|---|
| **`launch`** | **10%** | **6%** | Agora. Mensagem ao anfitrião: *fica com 90%* |
| `mature` | 16% | 0% | Só quando a Bazalá for o canal dominante |

A fase em vigor está em `COMMISSION_PHASE` (`data/config.ts`).

Para um anfitrião que queira receber 827,50 por noite, o hóspede paga 974,61 —
abaixo dos 1.000 que a LekkeSlaap cobraria pelo mesmo líquido, porque 16% é
menos do que os 17,25% efectivos deles.

```bash
npm run check:pricing
```

---

## Gate 1 — a decisão que este site existe para informar

Só se avança para o MVP com:

- **15 anfitriões** com alojamentos comprometidos
- **3 reservas pagas** intermediadas manualmente

Se não conseguir fechar três reservas à mão, um site não resolve isso.

Cada pedido chega ao WhatsApp com a referência do alojamento, as datas e o
total. É essa a medição da Fase 0 — não é preciso analytics nenhum para saber
o que está a gerar procura, basta o histórico das conversas.

---

## O que ainda está bloqueado

O fluxo de pagamento **não pode ser construído** antes de duas respostas
(blueprint §6.1 e §6.2, Apêndice B):

1. A Bazalá é **agente ou principal** para efeitos de IVA? A diferença é entre
   IVA sobre a comissão e IVA sobre o valor total da reserva.
2. Reter fundos do hóspede exige **autorização do Banco de Moçambique**?

Ambas precisam de advogado e contabilista moçambicanos. A primeira tem de ser
respondida **antes de registar a empresa**, não antes de escrever código.

---

## Estrutura

```
app/                     Páginas (todas server components; a única
                         interactividade é um formulário HTML nativo)
  page.tsx               Lista de alojamentos
  alojamento/[slug]/     Página de cada alojamento
  pedido/                Resumo do pedido e envio para WhatsApp
components/
data/
  config.ts              Site, WhatsApp, fase de comissão
  listings.ts            Os alojamentos
lib/
  pricing.ts             Comissão, IVA, líquido → preço
  format.ts              Meticais e datas
scripts/
  check-pricing.mts      Verificação da aritmética
supabase/migrations/     Schema do MVP (ainda não usado)
```

**Sem JavaScript do lado do cliente.** O formulário de pedido é HTML nativo com
`method="get"`. O dispositivo alvo é um Android de gama média em 3G, e o
orçamento de desempenho é 400 KB por página (blueprint §7.4).
