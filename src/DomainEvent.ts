export default class DomainEvent {
  type: string
  payload: any
  date: string

  constructor (type: string, payload: any) {
    this.type = type;
    this.payload = payload;
    this.date = new Date().toISOString();
  }
}
