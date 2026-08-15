import { NextResponse, type NextRequest } from 'next/server';
import { pickLocale } from '@/lib/i18n';

/**
 * Só a raiz. Tudo o resto vive em `/pt/...` ou `/en/...` e continua estático.
 *
 * Não há idioma predefinido na raiz porque não há um: os anfitriões são
 * lusófonos e boa parte dos hóspedes é anglófona (blueprint §7.5). Quem chega
 * a `/` é encaminhado pelo idioma do browser, e a partir daí o URL manda.
 */
export function middleware(request: NextRequest) {
  const locale = pickLocale(request.headers.get('accept-language'));
  return NextResponse.redirect(new URL(`/${locale}`, request.url));
}

export const config = {
  matcher: '/',
};
