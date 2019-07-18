import * as amqp from 'amqplib';

export default class Queue {
  queueName: string;
  url: string;
  ch: amqp.Channel | null;
  conn: amqp.Connection | null

  constructor (queueName: string, url: string) {
    this.queueName = queueName;
    this.url = url;
    this.conn = null;
    this.ch = null;
  }

  async send (cmd: any) {
    try {
      if (!this.conn || !this.ch) {
        this.conn = await amqp.connect(this.url);
        this.ch = await this.conn.createChannel();
        await this.ch.assertQueue(this.queueName, {durable: false});
      }
      this.ch.sendToQueue(this.queueName, Buffer.from(JSON.stringify(cmd)));
    } catch (e) {
      console.log(e);
    }
  }
}
