import Image from 'next/image';

/**
 * Foto de alojamento, com marcador quando ainda não há foto.
 *
 * A fotografia é o que converte, e é também a razão para visitar cada
 * propriedade em pessoa (blueprint §10.1). Enquanto não houver foto real, o
 * marcador diz isso em vez de fingir.
 */
export function Photo({
  src,
  alt,
  priority = false,
}: {
  src?: string;
  alt: string;
  priority?: boolean;
}) {
  if (!src) {
    return (
      <div className="flex aspect-[4/3] items-center justify-center rounded-[--radius-card] bg-sand text-sm text-mute">
        Sem fotografia
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      width={800}
      height={600}
      priority={priority}
      sizes="(max-width: 640px) 100vw, 640px"
      className="aspect-[4/3] w-full rounded-[--radius-card] object-cover"
    />
  );
}
