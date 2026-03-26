"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cryptoModule = require("crypto");
const globalWithCrypto = globalThis;
if (!globalWithCrypto.crypto) {
    const { randomUUID: _ignored, ...rest } = cryptoModule;
    void _ignored;
    globalWithCrypto.crypto = {
        ...rest,
        randomUUID: () => cryptoModule.randomUUID(),
    };
}
else if (!globalWithCrypto.crypto.randomUUID) {
    globalWithCrypto.crypto.randomUUID = () => cryptoModule.randomUUID();
}
//# sourceMappingURL=polyfill.js.map