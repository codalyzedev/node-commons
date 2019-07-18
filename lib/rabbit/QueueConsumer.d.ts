export default class QueueConsumer {
    queueName: string;
    url: string;
    constructor(queueName: string, url: string);
    consume(func: Function): Promise<void>;
}
