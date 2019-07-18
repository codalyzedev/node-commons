import * as amqp from 'amqplib';
export default class Queue {
    queueName: string;
    url: string;
    ch: amqp.Channel | null;
    conn: amqp.Connection | null;
    constructor(queueName: string, url: string);
    send(cmd: any): Promise<void>;
}
