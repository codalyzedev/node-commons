"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const amqp = require("amqplib");
const process = require("process");
const QueueError_1 = require("./QueueError");
class QueueConsumer {
    constructor(queueName, url) {
        this.queueName = queueName;
        this.url = url;
    }
    consume(func) {
        return __awaiter(this, void 0, void 0, function* () {
            return amqp.connect(this.url).then(conn => {
                process.once('SIGINT', () => {
                    conn.close();
                });
                return conn.createChannel().then(ch => {
                    const okPromise = ch.assertQueue(this.queueName, { durable: false });
                    const ok = okPromise
                        .then(() => ch.prefetch(1))
                        .then(() => {
                        ch.consume(this.queueName, (msg) => {
                            if (msg === null)
                                return;
                            func(msg.content.toString()).then(() => ch.ack(msg));
                        }, { noAck: false });
                        console.log('Amqp consumer started. To exit press CTRL+C');
                    });
                    return ok;
                });
            })
                .catch(() => {
                throw new QueueError_1.default();
            });
        });
    }
}
exports.default = QueueConsumer;
//# sourceMappingURL=QueueConsumer.js.map