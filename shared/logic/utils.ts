import type { RandomReader } from '@oslojs/crypto/random';
import { generateRandomString } from '@oslojs/crypto/random';

export function generateRandomCode(length: number): string {
  const random: RandomReader = {
    read(bytes) {
      crypto.getRandomValues(bytes);
    },
  };

  // avoid to use 1, I, 0, O for readability
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

  return generateRandomString(random, alphabet, length);
}
