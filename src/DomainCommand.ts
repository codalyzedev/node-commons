export default class DomainCommand {
  type: string;
  payload: object;
  date: string;

  constructor (type: string, payload: any) {
    this.type = type;
    this.payload = payload;
    this.date = new Date().toISOString();
  }
}
