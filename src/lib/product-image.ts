import type { ImageProps } from 'expo-image';
import type { ImageSourcePropType } from 'react-native';

import { versionedImageUrl } from './image-cache';

export type ProductWithManagedImage = {
  id: string;
  /** Existing bundled require() image, retained as an offline fallback. */
  image?: ImageProps['source'] | ImageSourcePropType;
  /** Full-size public URL for the product detail screen. */
  imageUrl?: string | null;
  /** Smaller URL for cards and lists. Prefer 400-600 px width. */
  thumbnailUrl?: string | null;
  /** BlurHash generated when the admin uploads the image. */
  imageBlurhash?: string | null;
  /** updatedAt or another version value, used only when the URL can accept query parameters. */
  imageVersion?: string | number | null;
};

export type ProductImageVariant = 'card' | 'detail';

export function productImageSource(
  product: ProductWithManagedImage,
  variant: ProductImageVariant = 'card',
): ImageProps['source'] {
  const remoteUrl =
    variant === 'detail'
      ? product.imageUrl ?? product.thumbnailUrl
      : product.thumbnailUrl ?? product.imageUrl;

  if (remoteUrl) {
    return { uri: versionedImageUrl(remoteUrl, product.imageVersion) };
  }

  return (product.image as ImageProps['source']) ?? null;
}

export function productImagePlaceholder(
  product: ProductWithManagedImage,
): ImageProps['placeholder'] {
  return product.imageBlurhash
    ? { blurhash: product.imageBlurhash, width: 16, height: 16 }
    : null;
}

export function productImageKey(
  product: ProductWithManagedImage,
  variant: ProductImageVariant = 'card',
) {
  return `${product.id}:${variant}:${product.imageVersion ?? 'current'}`;
}
