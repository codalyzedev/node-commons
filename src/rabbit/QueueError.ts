export default class QueueError extends Error {
  name: string;
  code: number;

  constructor () {
    super('Queue not started');
    this.name = 'QueueError';
    this.code = 500;
  }
}
