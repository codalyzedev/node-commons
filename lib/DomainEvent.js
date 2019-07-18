"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class DomainEvent {
    constructor(type, payload) {
        this.type = type;
        this.payload = payload;
        this.date = new Date().toISOString();
    }
}
exports.default = DomainEvent;
//# sourceMappingURL=DomainEvent.js.map