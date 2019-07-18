import * as amqp from 'amqplib';
import * as process from 'process';
import QueueError from './QueueError';

export default class QueueConsumer {
  queueName: string;
  url: string;

  constructor (queueName: string, url: string) {
    this.queueName = queueName;
    this.url = url;
  }

  async consume (func: Function) {
    return amqp.connect(this.url).then(conn => {
      process.once('SIGINT', () => {
        conn.close();
      });
      return conn.createChannel().then(ch => {
        const okPromise = ch.assertQueue(this.queueName, {durable: false});
        const ok = okPromise
          .then(() => ch.prefetch(1))
          .then(() => {
            ch.consume(
              this.queueName,
              (msg) => {
                if (msg === null) return;

                func(msg.content.toString()).then(() => ch.ack(msg))
              },
              {noAck: false}
            );
            console.log('Amqp consumer started. To exit press CTRL+C');
          });
        return ok;
      });
    })
    .catch(() => {
      throw new QueueError();
    });
  }
}
