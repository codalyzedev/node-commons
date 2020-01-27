"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const amqp = require("amqplib");
class Queue {
    constructor(queueName, url) {
        this.queueName = queueName;
        this.url = url;
        this.conn = null;
        this.ch = null;
    }
    send(cmd) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!this.conn || !this.ch) {
                    this.conn = yield amqp.connect(this.url);
                    this.ch = yield this.conn.createChannel();
                    yield this.ch.assertQueue(this.queueName, { durable: false });
                }
                this.ch.sendToQueue(this.queueName, Buffer.from(JSON.stringify(cmd)));
            }
            catch (e) {
                console.log(e);
            }
        });
    }
}
exports.default = Queue;
//# sourceMappingURL=Queue.js.map