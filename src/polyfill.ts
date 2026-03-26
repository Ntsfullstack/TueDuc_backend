import * as cryptoModule from 'crypto';

type CryptoLike = Omit<typeof cryptoModule, 'randomUUID'> & {
  randomUUID: () => string;
};

const globalWithCrypto = globalThis as unknown as { crypto?: CryptoLike };

if (!globalWithCrypto.crypto) {
  const { randomUUID: _ignored, ...rest } = cryptoModule;
  void _ignored;
  globalWithCrypto.crypto = {
    ...(rest as unknown as Omit<CryptoLike, 'randomUUID'>),
    randomUUID: () => cryptoModule.randomUUID(),
  };
} else if (!globalWithCrypto.crypto.randomUUID) {
  globalWithCrypto.crypto.randomUUID = () => cryptoModule.randomUUID();
}
