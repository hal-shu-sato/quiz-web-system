import { randomBytes } from 'crypto';

const CODE_CHARS = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';

export function generateReconnectionCode(length = 6): string {
  const bytes = randomBytes(length);
  return Array.from(bytes, (byte) => CODE_CHARS[byte % CODE_CHARS.length]).join(
    '',
  );
}
