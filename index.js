const ALPHABET = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
const ALPHABET_MAP = {};

for (let i = 0; i < ALPHABET.length; i++) {
  ALPHABET_MAP[ALPHABET.charAt(i)] = i;
}

function encode(buffer) {
  if (buffer.length === 0) {
    return "";
  }

  let digits = [0];

  for (let i = 0; i < buffer.length; i++) {
    for (let j = 0; j < digits.length; j++) {
      digits[j] <<= 8;
    }

    digits[0] += buffer[i];
    let carry = 0;

    for (let j = 0; j < digits.length; j++) {
      digits[j] += carry;
      carry = (digits[j] / 58) | 0;
      digits[j] %= 58;
    }

    while (carry) {
      digits.push(carry % 58);
      carry = (carry / 58) | 0;
    }
  }

  for (let i = 0; buffer[i] === 0 && i < buffer.length - 1; i++) {
    digits.push(0);
  }

  return digits.reverse().map(digit => ALPHABET[digit]).join("");
}

function decode(string) {
  if (string.length === 0) {
    return Buffer.from([]);
  }

  let bytes = [0];

  for (let i = 0; i < string.length; i++) {
    const c = string[i];
    if (!(c in ALPHABET_MAP)) {
      throw new Error(`Base58.decode received unacceptable input. Character '${c}' is not in the Base58 alphabet.`);
    }

    for (let j = 0; j < bytes.length; j++) {
      bytes[j] *= 58;
    }

    bytes[0] += ALPHABET_MAP[c];
    let carry = 0;

    for (let j = 0; j < bytes.length; j++) {
      bytes[j] += carry;
      carry = bytes[j] >> 8;
      bytes[j] &= 0xff;
    }

    while (carry) {
      bytes.push(carry & 0xff);
      carry >>= 8;
    }
  }

  for (let i = 0; string[i] === "1" && i < string.length - 1; i++) {
    bytes.push(0);
  }

  return Buffer.from(bytes.reverse());
}

module.exports = { encode, decode };
