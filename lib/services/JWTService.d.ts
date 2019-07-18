/// <reference types="node" />
export interface IJWTPayload {
    userId: string;
}
export default class JWTService {
    expiresIn: number;
    privateKey: Buffer;
    publicKey: Buffer;
    passphrase: string;
    constructor(expiresIn?: number);
    sign(payload: IJWTPayload): string;
    verify(token: string): string | object;
}
