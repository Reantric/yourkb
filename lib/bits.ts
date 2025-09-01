const WORD_COUNT = 64;

export function hexadecimalToBitmask(
  hexadecimalString: string,
): BigUint64Array {
  const mask = new BigUint64Array(WORD_COUNT);

  for (let i = 0; i < WORD_COUNT; i++) {
    const start = i * 16;
    const end = start + 16;
    const chunk = hexadecimalString.slice(start, end);

    mask[i] = BigInt("0x" + chunk);
  }

  return mask;
}

export function bitmaskToHexadecimal(mask: BigUint64Array): string {
  const hexParts: string[] = [];

  for (let i = 0; i < mask.length; i++) {
    hexParts.push(mask[i].toString(16).padStart(16, "0"));
  }

  return hexParts.join("");
}

export function getBit(mask: BigUint64Array, index: number): boolean {
  const word = Math.floor(index / 64);
  const bit = BigInt(63 - (index % 64)); // <-- MSB-first
  return (mask[word] & (1n << bit)) !== 0n;
}

export function setBit(mask: BigUint64Array, index: number): void {
  const word = Math.floor(index / 64);
  const bit = BigInt(63 - (index % 64)); // <-- flip index inside word
  mask[word] |= 1n << bit;
}

export function clearBit(mask: BigUint64Array, index: number): void {
  const word = Math.floor(index / 64);
  const bit = BigInt(63 - (index % 64)); // <-- flip index inside word
  mask[word] &= ~(1n << bit);
}
