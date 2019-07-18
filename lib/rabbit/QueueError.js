"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class QueueError extends Error {
    constructor() {
        super('Queue not started');
        this.name = 'QueueError';
        this.code = 500;
    }
}
exports.default = QueueError;
//# sourceMappingURL=QueueError.js.map