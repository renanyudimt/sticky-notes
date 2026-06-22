/**
 * Cryptographically-strong integer in the range `[0, maxExclusive)`.
 *
 * Uses `crypto.getRandomValues` instead of `Math.random` (a non-secure PRNG)
 * so the seed-note color/position helpers don't trip weak-crypto checks.
 * Returns `0` when `maxExclusive` is `0` or `1` (an empty/single range).
 */
export function randomInt(maxExclusive: number): number {
  if (maxExclusive <= 1) {
    return 0;
  }

  const buffer = new Uint32Array(1);
  crypto.getRandomValues(buffer);

  return buffer[0] % maxExclusive;
}
