import * as jwt from 'jsonwebtoken';
import * as config from 'config';
import * as fs from 'fs';
import * as path from 'path';

export interface IJWTPayload {
  userId: string,
  delegateeId: string
};

export default class JWTService {
  expiresIn: number;
  privateKey: Buffer;
  publicKey: Buffer;
  passphrase: string;

  constructor (expiresIn: number = 300) {
    this.privateKey = fs.readFileSync(path.join(__dirname, '../../keys', 'jwtRS256.key'));
    this.publicKey = fs.readFileSync(path.join(__dirname, '../../keys', 'jwtRS256.key.pub'));
    this.passphrase = config.get('JWT_PASSPHRASE');
    this.expiresIn = expiresIn;
  }

  sign (payload: IJWTPayload) {
    return jwt.sign(payload, this.privateKey, { algorithm: 'RS256', expiresIn: this.expiresIn });
  }

  verify (token: string) {
    return jwt.verify(token, this.publicKey, { algorithms: ['RS256'] });
  }
}
