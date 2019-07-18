export default class DomainEvent {
    type: string;
    payload: any;
    date: string;
    constructor(type: string, payload: any);
}
