"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jwt = require("jsonwebtoken");
const config = require("config");
const fs = require("fs");
const path = require("path");
;
class JWTService {
    constructor(expiresIn = 300) {
        this.privateKey = fs.readFileSync(path.join(__dirname, '../../keys', 'jwtRS256.key'));
        this.publicKey = fs.readFileSync(path.join(__dirname, '../../keys', 'jwtRS256.key.pub'));
        this.passphrase = config.get('JWT_PASSPHRASE');
        this.expiresIn = expiresIn;
    }
    sign(payload) {
        return jwt.sign(payload, this.privateKey, { algorithm: 'RS256', expiresIn: this.expiresIn });
    }
    verify(token) {
        return jwt.verify(token, this.publicKey, { algorithms: ['RS256'] });
    }
}
exports.default = JWTService;
//# sourceMappingURL=JWTService.js.map