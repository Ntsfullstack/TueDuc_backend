"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cryptoModule = require("crypto");
const uuid_1 = require("uuid");
const globalWithCrypto = globalThis;
if (!globalWithCrypto.crypto) {
    const { randomUUID: _ignored, ...rest } = cryptoModule;
    void _ignored;
    globalWithCrypto.crypto = {
        ...rest,
        randomUUID: () => cryptoModule.randomUUID ? cryptoModule.randomUUID() : (0, uuid_1.v4)(),
    };
}
else if (!globalWithCrypto.crypto.randomUUID) {
    globalWithCrypto.crypto.randomUUID = () => (0, uuid_1.v4)();
}
//# sourceMappingURL=polyfill.js.map