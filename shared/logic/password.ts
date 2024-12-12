import { hash, verify } from '@node-rs/argon2';
import { sha1 } from '@oslojs/crypto/sha1';
import { encodeHexLowerCase } from '@oslojs/encoding';
import { isDevelopment } from 'std-env';

// recommended minimum parameters
const hashParams = {
  memoryCost: 19456,
  timeCost: 2,
  outputLen: 32,
  parallelism: 1,
};

export async function hashPassword(password: string): Promise<string> {
  return await hash(password, hashParams);
}

export async function verifyPasswordHash(hash: string, password: string): Promise<boolean> {
  return await verify(hash, password, hashParams);
}

export function verifyPasswordInput(password: unknown): password is string {
  return (
    typeof password === 'string'
    && password.length > 6
    && password.length < 256
  );
}

export async function verifyPasswordStrength(password: string): Promise<boolean> {
  // bypass strength check in development
  if (isDevelopment) {
    return true;
  }
  const hash = encodeHexLowerCase(sha1(new TextEncoder().encode(password)));
  const hashPrefix = hash.slice(0, 5);
  const response = await fetch(`https://api.pwnedpasswords.com/range/${hashPrefix}`);
  const data = await response.text();
  const items = data.split('\n');
  for (const item of items) {
    const hashSuffix = item.slice(0, 35).toLowerCase();
    if (hash === hashPrefix + hashSuffix) {
      return false;
    }
  }
  return true;
}
