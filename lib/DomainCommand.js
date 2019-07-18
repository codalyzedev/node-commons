"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class DomainCommand {
    constructor(type, payload) {
        this.type = type;
        this.payload = payload;
        this.date = new Date().toISOString();
    }
}
exports.default = DomainCommand;
//# sourceMappingURL=DomainCommand.js.map