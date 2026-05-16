// URL-safe alphabet excluding ambiguous chars (0/O, 1/l/I).
const ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

function randomChars(n: number): string {
  let out = "";
  if (typeof crypto !== "undefined" && typeof crypto.getRandomValues === "function") {
    const buf = new Uint32Array(n);
    crypto.getRandomValues(buf);
    for (let i = 0; i < n; i += 1) {
      out += ALPHABET[buf[i] % ALPHABET.length];
    }
    return out;
  }
  // Fallback: Math.random is non-cryptographic but acceptable for a portfolio
  // demo where token uniqueness is the only property we need.
  for (let i = 0; i < n; i += 1) {
    out += ALPHABET[Math.floor(Math.random() * ALPHABET.length)];
  }
  return out;
}

export function generateBookingToken(): string {
  const a = randomChars(4);
  const b = randomChars(4);
  const c = randomChars(4);
  return `${a}-${b}-${c}`;
}

export function isSeedToken(token: string): boolean {
  return token.startsWith("SEED-");
}
